import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  console.log('FINALIZING ENDPOINT HIT. Method:', req.method);
  console.log('Body:', req.body);
  const { token, booking_id, token_name, customer_query, occurrence_id: bodyOccId, seats: bodySeats, email: bodyEmail } = req.body || {};

  if (!booking_id || !token_name) {
    return res.status(400).json({ error: 'Missing required fields (booking_id, token_name)' });
  }

  try {
    let user_id, phone, email, occurrence_id;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user_id = decoded.user_id;
        phone = decoded.phone;
        email = decoded.email;
        occurrence_id = decoded.occurrence_id;
      } catch (e) {
        user_id = req.body.user_id;
        email = bodyEmail || 'guest@vantammayilu.com';
        occurrence_id = bodyOccId;
      }
    } else {
      user_id = req.body.user_id;
      email = bodyEmail || 'guest@vantammayilu.com';
      occurrence_id = bodyOccId;
    }

    // Ensure user_id is a valid UUID in users table
    if (!user_id || !user_id.includes('-')) {
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
      if (existingUser?.id) {
        user_id = existingUser.id;
      } else {
        const { data: newUser } = await supabase.from('users').insert({
          name: email.split('@')[0],
          email: email,
          phone: `g_${Date.now()}`
        }).select('id').single();
        if (newUser?.id) user_id = newUser.id;
      }
    }

    if (!occurrence_id) {
      return res.status(400).json({ error: 'Missing occurrence_id for booking.' });
    }

    // 1. Get seat lock info
    const { data: seatLock } = await supabase
      .from('seat_locks')
      .select('seats')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .single();

    const finalSeats = seatLock ? seatLock.seats : (bodySeats || 1); // Fallback to bodySeats or 1

    // 2. Upsert into bookings
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .upsert({
        occurrence_id,
        user_id,
        seats: finalSeats,
        token_name,
        razorpay_order_id: booking_id,
        status: 'confirmed',
        customer_query: customer_query || null
      }, { onConflict: 'occurrence_id, user_id' })
      .select('id')
      .single();

    if (bookingError) throw bookingError;

    // 3. Remove seat lock
    await supabase.from('seat_locks').delete().eq('user_id', user_id).eq('occurrence_id', occurrence_id);
    
    // 4. Update interest status to booked
    await supabase.from('occurrence_interests').update({ status: 'booked' }).eq('user_id', user_id).eq('occurrence_id', occurrence_id);

    // 5. Send Confirmation Email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'founder@vantammayilu.com',
      subject: `Your seat is confirmed. You are ${token_name}`,
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false }
      },
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15);">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
            <h1 style="font-family: 'Courier New', monospace; color: #e86321; font-size: 32px; margin: 0; letter-spacing: 2px;">VANTAMMAYILU</h1>
            <p style="font-style: italic; font-size: 16px; margin-top: 6px; color: #555;">Long Table Society</p>
          </div>
          <h2 style="color: #2c2b29; font-size: 26px; margin-bottom: 16px;">Your Seat is Secured.</h2>
          <p style="font-size: 16px; line-height: 1.6;">We are delighted to confirm your reservation for our upcoming gathering. The table is set, and a chair waits for you.</p>
          <div style="background-color: #faf8f5; padding: 24px; border-radius: 8px; margin: 28px 0; border-left: 4px solid #e86321;">
            <p style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #888;">Your Token Identity</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #e86321;">${token_name}</p>
            <p style="margin: 16px 0 0 0; font-size: 14px; color: #555;">Seats Booked: <strong>${finalSeats}</strong></p>
            ${customer_query ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #555;">Dietary Notes: <em>${customer_query}</em></p>` : ''}
          </div>
          <p style="font-size: 15px; line-height: 1.6;">To maintain intimacy and mystery, exact coordinates and arrival instructions will be shared via WhatsApp and Email exactly 24 hours before the evening begins.</p>
          <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">Bring your curiosity and an appetite for stories.</p>
          <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); pt: 20px; text-align: center;">
            <p style="font-style: italic; font-size: 16px; margin-bottom: 4px;">Warmly,</p>
            <p style="font-weight: bold; font-size: 18px; color: #e86321; margin: 0;">Vantammayilu Founder</p>
          </div>
        </div>
      `,
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
    } else {
      console.log(`[DEV] Mock confirmation email sent to ${email}`);
    }

    return res.status(200).json({ success: true, message: 'Booking completed successfully' });
  } catch (error) {
    console.error('Error finalizing booking:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
