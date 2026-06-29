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

  const { token, booking_id, customer_query, occurrence_id: bodyOccId, seats: bodySeats, email: bodyEmail } = req.body || {};
  console.log('[finalize] HIT —', { token: !!token, booking_id, bodyOccId, bodyEmail });

  // ── 1. Resolve identity from JWT token or body ──────────────────────────
  let user_id, email, occurrence_id;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user_id = decoded.user_id;
      email = decoded.email;
      occurrence_id = decoded.occurrence_id;
      console.log('[finalize] JWT decoded —', { user_id, email, occurrence_id });
    } catch (e) {
      console.log('[finalize] JWT decode failed, using body fields:', e.message);
      user_id = req.body.user_id;
      email = bodyEmail;
      occurrence_id = bodyOccId;
    }
  } else {
    user_id = req.body.user_id;
    email = bodyEmail;
    occurrence_id = bodyOccId;
  }

  // Fallbacks
  if (!email) email = 'guest@vantammayilu.com';
  if (!occurrence_id) occurrence_id = bodyOccId;

  if (!occurrence_id) {
    return res.status(400).json({ error: 'Missing occurrence_id.' });
  }

  try {
    // ── 2. Resolve user_id if still missing ───────────────────────────────
    if (!user_id || typeof user_id !== 'string' || !user_id.includes('-')) {
      console.log('[finalize] user_id missing/invalid, looking up by email:', email);
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser?.id) {
        user_id = existingUser.id;
        console.log('[finalize] Found user by email:', user_id);
      } else {
        // Create the user
        const { data: newUser, error: insertErr } = await supabase
          .from('users')
          .insert({ name: email.split('@')[0], email, phone: `g_${Date.now()}` })
          .select('id')
          .single();
        if (insertErr) {
          console.error('[finalize] Failed to create user:', insertErr);
          return res.status(500).json({ error: 'Failed to create user record.', details: insertErr.message });
        }
        user_id = newUser.id;
        console.log('[finalize] Created new user:', user_id);
      }
    }

    // Last resort: find via seat_locks for this occurrence
    if (!user_id || !user_id.includes('-')) {
      const { data: lockRow } = await supabase
        .from('seat_locks')
        .select('user_id')
        .eq('occurrence_id', occurrence_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lockRow?.user_id) user_id = lockRow.user_id;
    }

    if (!user_id || !user_id.includes('-')) {
      return res.status(400).json({ error: 'Could not resolve user identity. Please try again.' });
    }

    // ── 3. Get seats from lock (or fallback) ─────────────────────────────
    const { data: seatLock } = await supabase
      .from('seat_locks')
      .select('seats')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .maybeSingle();

    const finalSeats = seatLock?.seats || bodySeats || 1;
    console.log('[finalize] finalSeats:', finalSeats, '| user_id:', user_id);

    // ── 4. Save booking — try INSERT first, then UPDATE if duplicate ──────
    const bookingPayload = {
      occurrence_id,
      user_id,
      seats: finalSeats,
      razorpay_order_id: booking_id || `manual_${Date.now()}`,
      status: 'confirmed',
      customer_query: customer_query || null
    };

    let bookingId;

    const { data: insertedBooking, error: insertError } = await supabase
      .from('bookings')
      .insert(bookingPayload)
      .select('id')
      .single();

    if (insertError) {
      console.log('[finalize] Insert failed (likely duplicate), trying update:', insertError.message);
      // Row already exists — update it
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          seats: finalSeats,
          razorpay_order_id: booking_id || `manual_${Date.now()}`,
          status: 'confirmed',
          customer_query: customer_query || null
        })
        .eq('occurrence_id', occurrence_id)
        .eq('user_id', user_id)
        .select('id')
        .single();

      if (updateError) {
        console.error('[finalize] Update also failed:', updateError);
        return res.status(500).json({ error: 'Failed to save booking.', details: updateError.message });
      }
      bookingId = updatedBooking?.id;
    } else {
      bookingId = insertedBooking?.id;
    }

    console.log('[finalize] Booking saved, id:', bookingId);

    // ── 5. Cleanup ─────────────────────────────────────────────────────────
    await supabase.from('seat_locks').delete().eq('user_id', user_id).eq('occurrence_id', occurrence_id);
    await supabase.from('occurrence_interests')
      .update({ status: 'booked' })
      .eq('user_id', user_id)
      .eq('occurrence_id', occurrence_id);

    // ── 6. Confirmation email (non-blocking) ──────────────────────────────
    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'hyndavio@vantammayilu.com',
        subject: `Your seat is confirmed — Vantammayilu`,
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
            <p style="font-size: 16px; line-height: 1.6;">We are delighted to confirm your reservation. The table is set, and a chair waits for you.</p>
            <div style="background-color: #faf8f5; padding: 24px; border-radius: 8px; margin: 28px 0; border-left: 4px solid #e86321;">
              <p style="margin: 0; font-size: 16px; color: #555;">Seats Booked: <strong>${finalSeats}</strong></p>
              ${customer_query ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #555;">Dietary Notes: <em>${customer_query}</em></p>` : ''}
            </div>
            <p style="font-size: 15px; line-height: 1.6;">Exact coordinates and arrival instructions will be shared via WhatsApp and Email exactly 24 hours before the evening.</p>
            <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">Bring your curiosity and an appetite for stories.</p>
            <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
              <p style="font-style: italic; font-size: 16px; margin-bottom: 4px;">Warmly,</p>
              <p style="font-weight: bold; font-size: 18px; color: #e86321; margin: 0;">Vantammayilu Founder</p>
            </div>
          </div>
        `
      };
      sgMail.send(msg).catch(err => console.error('[finalize] SendGrid error (non-blocking):', err?.response?.body || err.message));
    }

    return res.status(200).json({ success: true, message: 'Booking confirmed successfully', booking_id: bookingId });

  } catch (error) {
    console.error('[finalize] Unhandled error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
