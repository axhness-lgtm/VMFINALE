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
  const { token, booking_id, token_name, customer_query } = req.body || {};

  if (!token || !booking_id || !token_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { user_id, phone, email, occurrence_id } = decoded;

    // 1. Get seat lock info
    const { data: seatLock } = await supabase
      .from('seat_locks')
      .select('seats')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .single();

    const finalSeats = seatLock ? seatLock.seats : 1; // Fallback to 1

    // 2. Insert into bookings
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        occurrence_id,
        user_id,
        seats: finalSeats,
        token_name,
        razorpay_order_id: booking_id,
        status: 'confirmed',
        customer_query: customer_query || null
      })
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seat Secured.</h2>
          <p>Hi,</p>
          <p>We are excited to have you join us for the upcoming dinner. Your payment is successful, and your seat is confirmed.</p>
          <p>For this evening, your token name is <strong>${token_name}</strong>.</p>
          <p>We will share the exact location via WhatsApp and Email 24 hours before the dinner.</p>
          <p>If you have any dietary restrictions that you haven't mentioned, please reply to this email.</p>
          <p>Warmly,<br/>Vantammayilu Founder</p>
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
