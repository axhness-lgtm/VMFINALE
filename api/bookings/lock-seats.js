import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, seats, occurrence_id } = req.body;

  if (!token || !seats || !occurrence_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Verify Magic Link Token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired magic link' });
    }

    const { user_id, phone, email } = decoded;

    // 2. Check if already booked
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .single();

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked a seat for this dinner.' });
    }

    // 3. Check Seat Availability
    const { data: availableSeats } = await supabase.rpc('get_available_seats', { p_occurrence_id: occurrence_id });
    
    if (availableSeats < seats) {
      return res.status(400).json({ error: 'Not enough seats available.' });
    }

    // 4. Create Seat Lock
    // We add 10 minutes (600000 ms)
    const locked_until = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: lockError } = await supabase
      .from('seat_locks')
      .upsert({
        occurrence_id,
        user_id,
        seats,
        locked_until
      }, { onConflict: 'occurrence_id, user_id' }); // overwrite existing expired lock for same user

    if (lockError) throw lockError;

    // 5. Fetch occurrence price
    const { data: occurrence } = await supabase
      .from('occurrences')
      .select('price_inr')
      .eq('id', occurrence_id)
      .single();

    const amount = (occurrence.price_inr * seats); // Razorpay expects paise

    // 6. Create Razorpay Order
    let order;
    if (process.env.VITE_RAZORPAY_KEY_ID && !process.env.VITE_RAZORPAY_KEY_ID.includes('test_XXX')) {
       order = await razorpay.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${user_id}_${Date.now()}`
      });
    } else {
       // Dev fallback
       order = { id: `MOCK_ORDER_${Date.now()}`, amount };
    }

    return res.status(200).json({ 
      success: true, 
      locked_until,
      order_id: order.id,
      amount: order.amount,
      user_id,
      phone,
      email
    });
  } catch (error) {
    console.error('Error locking seats:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
