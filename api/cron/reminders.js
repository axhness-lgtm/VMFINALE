import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export default async function handler(req, res) {
  try {
    const now = new Date().toISOString();

    // ---------------------------------------------------------
    // 1. REOPENING LOGIC (Clean expired locks)
    // ---------------------------------------------------------
    const { data: expiredLocks } = await supabase
      .from('seat_locks')
      .select('id, occurrence_id')
      .lt('locked_until', now);

    if (expiredLocks && expiredLocks.length > 0) {
      // Delete them
      await supabase.from('seat_locks').delete().in('id', expiredLocks.map(l => l.id));
      
      // Find which occurrences might have opened up
      const occIds = [...new Set(expiredLocks.map(l => l.occurrence_id))];
      
      for (const occId of occIds) {
        // Check if there are seats available now
        const { data: availableSeats } = await supabase.rpc('get_available_seats', { p_occurrence_id: occId });
        
        if (availableSeats > 0) {
          // Fetch users who are selected but haven't booked
          const { data: activeInterests } = await supabase
            .from('occurrence_interests')
            .select(`
              user_id,
              users (email, name, phone)
            `)
            .eq('occurrence_id', occId)
            .eq('status', 'selected_by_founder');

          if (activeInterests && activeInterests.length > 0) {
            const { data: occ } = await supabase.from('occurrences').select('title').eq('id', occId).single();
            
            // Send "Seat Opened" emails
            const msgs = activeInterests.map(interest => ({
              to: interest.users.email,
              from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
              subject: `A seat has opened up for ${occ.title}!`,
              trackingSettings: {
                clickTracking: { enable: false, enableText: false },
                openTracking: { enable: false }
              },
              html: `
                <div style="font-family: 'The Seasons', Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15); line-height: 1.7;">
                  <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
                    <h1 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 34px; margin: 0; letter-spacing: 1px;">Vantammayilu</h1>
                    <p style="font-family: 'The Seasons', Georgia, serif; font-style: italic; font-size: 16px; margin-top: 6px; color: #555;">The Supper Social</p>
                  </div>
                  <h2 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 26px; margin-bottom: 16px;">A Seat Has Opened.</h2>
                  <p style="font-size: 16px;">Hi ${interest.users.name},</p>
                  <p style="font-size: 16px;">Serendipity has smiled upon our table. A seat has just opened up for <strong>${occ.title}</strong>.</p>
                  <p style="font-size: 16px; margin-bottom: 24px;">Please return to your invitation link immediately to reserve this place before another guest claims it.</p>
                  <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
                    <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555;">Warmly,</p>
                    <p style="font-family: 'Apricot', Georgia, cursive; font-size: 22px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
                  </div>
                </div>
              `
            }));
            if (process.env.SENDGRID_API_KEY) {
              await sgMail.send(msgs);
            } else {
              console.log(`[DEV] Seat opened emails simulated for ${msgs.length} users.`);
            }
          }
        }
      }
    }

    // ---------------------------------------------------------
    // 2. 24h REMINDERS (Email & WhatsApp)
    // ---------------------------------------------------------
    const in48Hours = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const { data: upcomingOccurrences } = await supabase
      .from('occurrences')
      .select('id, title, event_date')
      .gte('event_date', now)
      .lte('event_date', in48Hours.toISOString());

    if (upcomingOccurrences && upcomingOccurrences.length > 0) {
      for (const occ of upcomingOccurrences) {
        // Get confirmed bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select(`
            id, token_name,
            users (name, email, phone)
          `)
          .eq('occurrence_id', occ.id)
          .eq('status', 'confirmed');

        if (bookings) {
          for (const booking of bookings) {
            // Check if reminder already sent
            const { data: existingReminder } = await supabase
              .from('reminders')
              .select('id')
              .eq('booking_id', booking.id)
              .eq('type', '24h_reminder')
              .single();

            if (!existingReminder) {
              // Send Email
              if (process.env.SENDGRID_API_KEY) {
                await sgMail.send({
                  to: booking.users.email,
                  from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
                  subject: `Reminder: ${occ.title} is tomorrow`,
                  trackingSettings: {
                    clickTracking: { enable: false, enableText: false },
                    openTracking: { enable: false }
                  },
                  html: `
                    <div style="font-family: 'The Seasons', Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15); line-height: 1.7;">
                      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
                        <h1 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 34px; margin: 0; letter-spacing: 1px;">Vantammayilu</h1>
                        <p style="font-family: 'The Seasons', Georgia, serif; font-style: italic; font-size: 16px; margin-top: 6px; color: #555;">The Supper Social</p>
                      </div>
                      <h2 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 26px; margin-bottom: 16px;">Tomorrow Evening Awaits.</h2>
                      <p style="font-size: 16px;">Hi ${booking.users.name},</p>
                      <p style="font-size: 16px;">We eagerly anticipate welcoming you tomorrow evening for <strong>${occ.title}</strong>.</p>
                      <div style="background-color: #faf8f5; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #e86321;">
                        <p style="margin: 0; font-size: 16px; color: #555;">Your Secret Identity Token: <strong style="color: #e86321;">${booking.token_name}</strong></p>
                      </div>
                      <p style="font-size: 15px;">Please check your WhatsApp for coordinates and arrival details.</p>
                      <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
                        <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555;">Warmly,</p>
                        <p style="font-family: 'Apricot', Georgia, cursive; font-size: 22px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
                      </div>
                    </div>
                  `
                });
              }

              // Send WhatsApp
              if (twilioClient) {
                await twilioClient.messages.create({
                  body: `Hello ${booking.users.name}! We look forward to seeing you tomorrow for ${occ.title}. Your token is ${booking.token_name}.`,
                  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
                  to: `whatsapp:${booking.users.phone}`
                });
              } else {
                console.log(`[DEV] WhatsApp reminder simulated to ${booking.users.phone}`);
              }

              // Record that reminder was sent
              await supabase.from('reminders').insert({ booking_id: booking.id, type: '24h_reminder' });
            }
          }
        }
      }
    }

    return res.status(200).json({ success: true, message: 'Cron jobs executed successfully.' });
  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
