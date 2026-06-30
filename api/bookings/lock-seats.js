import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

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

  if (!seats || !occurrence_id) {
    return res.status(400).json({ error: 'Missing required fields (seats, occurrence_id)' });
  }

  try {
    // 1. Verify Magic Link Token or Fallback to Guest
    let user_id, phone, email;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user_id = decoded.user_id;
        phone = decoded.phone;
        email = decoded.email;
      } catch (e) {
        phone = req.body.phone || '9999999999';
        email = req.body.email || 'guest@vantammayilu.com';
      }
    } else {
      user_id = req.body.user_id;
      phone = req.body.phone || '9999999999';
      email = req.body.email || 'guest@vantammayilu.com';
    }

    // Always verify user_id actually exists in DB (JWT may reference deleted users)
    if (user_id) {
      const { data: verifiedUser } = await supabase.from('users').select('id, email, phone').eq('id', user_id).maybeSingle();
      if (!verifiedUser) {
        console.log('[lock-seats] user_id from JWT not found in DB, will re-create via email');
        if (!email) email = req.body.email || 'guest@vantammayilu.com';
        user_id = null; // force re-creation below
      } else {
        email = email || verifiedUser.email;
        phone = phone || verifiedUser.phone;
      }
    }

    // Create or find user if we still don't have a valid user_id
    if (!user_id || !user_id.includes('-')) {
      if (!email) email = req.body.email || 'guest@vantammayilu.com';
      const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
      if (existingUser?.id) {
        user_id = existingUser.id;
      } else {
        const { data: newUser, error: createErr } = await supabase.from('users').insert({
          name: email.split('@')[0],
          email: email,
          phone: phone !== '9999999999' ? phone : `g_${Date.now()}`
        }).select('id').maybeSingle();
        if (createErr) {
          console.error('[lock-seats] Failed to create user:', createErr);
          return res.status(500).json({ error: 'Failed to create user record.', details: createErr.message });
        }
        if (newUser?.id) user_id = newUser.id;
      }
    }

    // 2. Check if already booked
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('occurrence_id', occurrence_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked a seat for this dinner.' });
    }

    // 3. Check Seat Availability
    const { data: availableSeats } = await supabase.rpc('get_available_seats', { p_occurrence_id: occurrence_id });
    
    if (availableSeats < seats) {
      return res.status(400).json({ error: 'Not enough seats available.' });
    }

    // 4. Create Seat Lock
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: lock, error: lockError } = await supabase
      .from('seat_locks')
      .upsert({
        occurrence_id,
        user_id,
        seats,
        locked_until: lockedUntil
      }, { onConflict: 'occurrence_id, user_id' })
      .select()
      .maybeSingle();

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
    if (process.env.VITE_RAZORPAY_KEY_ID && !process.env.VITE_RAZORPAY_KEY_ID.includes('test_XXX') && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== 'dummy_secret') {
       order = await razorpay.orders.create({
        amount: amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}` // Must be <= 40 chars for Razorpay API
      });
    } else if (process.env.VITE_RAZORPAY_KEY_ID && (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'dummy_secret')) {
       throw new Error('Razorpay Authentication failed: RAZORPAY_KEY_SECRET is missing in Vercel environment variables.');
    } else {
       // Dev fallback
       order = { id: `MOCK_ORDER_${Date.now()}`, amount };
    }

    return res.status(200).json({ 
      success: true, 
      locked_until: lockedUntil,
      order_id: order.id,
      amount: order.amount,
      user_id,
      phone,
      email
    });
  } catch (error) {
    console.error('Error locking seats:', error);
    let errorMsg = error?.error?.description || error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    if (errorMsg === 'Authentication failed') {
      errorMsg = 'Razorpay Authentication failed: Please add RAZORPAY_KEY_SECRET to your Vercel Environment Variables.';
    }
    return res.status(500).json({ error: errorMsg, details: errorMsg });
  }
}
