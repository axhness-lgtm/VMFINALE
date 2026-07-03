import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, token, seats: bodySeats, occurrence_id: bodyOccId, email: bodyEmail, user_id: bodyUserId, phone: bodyPhone, customer_query } = req.body || {};

  // Verify signature if not in dev mode
  if (process.env.VITE_RAZORPAY_KEY_ID && !process.env.VITE_RAZORPAY_KEY_ID.includes('test_XXX')) {
    try {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
  }

  // ── Immediately finalize & confirm booking in DB ──────────────────────
  let user_id = bodyUserId;
  let email = bodyEmail;
  let occurrence_id = bodyOccId;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!user_id) user_id = decoded.user_id;
      if (!email) email = decoded.email;
      if (!occurrence_id) occurrence_id = decoded.occurrence_id;
    } catch (e) {
      return res.status(401).json({
        error: 'You have crossed the 4 hour time limit to reserve your seat, please register again to get a chance to reserve your seat again.',
        expired: true
      });
    }
  }

  if (!email) email = 'guest@vantammayilu.com';
  if (!occurrence_id) {
    return res.status(400).json({ error: 'Missing occurrence_id.' });
  }

  try {
    // Resolve user_id if missing or invalid
    if (!user_id || typeof user_id !== 'string' || !user_id.includes('-')) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser?.id) {
        user_id = existingUser.id;
      } else {
        const { data: newUser, error: insertErr } = await supabase
          .from('users')
          .insert({ name: email.split('@')[0], email, phone: bodyPhone || `g_${Date.now()}` })
          .select('id')
          .maybeSingle();
        if (insertErr) {
          console.error('[confirm] Failed to create user:', insertErr);
          return res.status(500).json({ error: 'Failed to create user record.', details: insertErr.message });
        }
        user_id = newUser?.id;
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
      return res.status(400).json({ error: 'Could not resolve user identity.' });
    }

    // Get seats from lock (or fallback)
    const { data: seatLock } = await supabase
      .from('seat_locks')
      .select('seats')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .maybeSingle();

    const finalSeats = seatLock?.seats || bodySeats || 1;

    const bookingOrderId = razorpay_order_id || `dev_${Date.now()}`;
    const bookingPayload = {
      occurrence_id,
      user_id,
      seats: finalSeats,
      razorpay_order_id: bookingOrderId,
      razorpay_payment_id: razorpay_payment_id || null,
      status: 'confirmed',
      customer_query: customer_query || null
    };

    let bookingId;
    const { data: insertedBooking, error: insertError } = await supabase
      .from('bookings')
      .insert(bookingPayload)
      .select('id')
      .maybeSingle();

    if (insertError) {
      console.log('[confirm] Insert failed (likely duplicate), trying update:', insertError.message);
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          seats: finalSeats,
          razorpay_order_id: bookingOrderId,
          razorpay_payment_id: razorpay_payment_id || null,
          status: 'confirmed',
          customer_query: customer_query || null
        })
        .eq('occurrence_id', occurrence_id)
        .eq('user_id', user_id)
        .select('id')
        .maybeSingle();

      if (updateError) {
        console.error('[confirm] Update also failed:', updateError);
        return res.status(500).json({ error: 'Failed to save booking.', details: updateError.message });
      }
      bookingId = updatedBooking?.id;
    } else {
      bookingId = insertedBooking?.id;
    }

    // Cleanup seat locks and update occurrence_interests immediately
    await supabase.from('seat_locks').delete().eq('user_id', user_id).eq('occurrence_id', occurrence_id);
    await supabase.from('occurrence_interests')
      .update({ status: 'booked' })
      .eq('user_id', user_id)
      .eq('occurrence_id', occurrence_id);

    // Confirmation email (non-blocking)
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
          <div style="font-family: 'The Seasons', Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #efe8db; padding: 40px 30px; border-radius: 12px; color: #2c2b29; border: 1px solid rgba(44,43,41,0.15); line-height: 1.7;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(232,99,33,0.3); padding-bottom: 20px;">
              <h1 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 34px; margin: 0; letter-spacing: 1px;">Vantammayilu</h1>
              <p style="font-family: 'The Seasons', Georgia, serif; font-style: italic; font-size: 16px; margin-top: 6px; color: #555;">The Supper Social</p>
            </div>
            <h2 style="font-family: 'Apricot', Georgia, cursive; color: #e86321; font-size: 28px; margin-bottom: 16px;">Your Seat is Secured.</h2>
            <p style="font-size: 16px;">We are overjoyed to confirm your reservation. A space at our table has been prepared expressly for you.</p>
            <div style="background-color: #faf8f5; padding: 24px; border-radius: 8px; margin: 28px 0; border-left: 4px solid #e86321;">
              <p style="margin: 0; font-size: 16px; color: #555;">Seats Reserved: <strong>${finalSeats}</strong></p>
              ${customer_query ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #555;">Notes: <em>${customer_query}</em></p>` : ''}
            </div>
            <p style="font-size: 15px;">Exact coordinates and arrival secrets will be whispered via WhatsApp and Email 24 hours before the gathering begins.</p>
            <p style="font-size: 15px; margin-top: 24px; font-style: italic;">Bring your curiosity and an appetite for stories.</p>
            <div style="margin-top: 36px; border-top: 1px solid rgba(44,43,41,0.1); text-align: center; padding-top: 20px;">
              <p style="font-style: italic; font-size: 16px; margin-bottom: 4px; color: #555;">Warmly,</p>
              <p style="font-family: 'Apricot', Georgia, cursive; font-size: 22px; color: #e86321; margin: 0;">Hyndavi & Artee</p>
            </div>
          </div>
        `
      };
      sgMail.send(msg).catch(err => console.error('[confirm] SendGrid error (non-blocking):', err?.response?.body || err.message));
    }

    return res.status(200).json({ success: true, booking_id: bookingId || bookingOrderId });
  } catch (error) {
    console.error('[confirm] Unhandled error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
