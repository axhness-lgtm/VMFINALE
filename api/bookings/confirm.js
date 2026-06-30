import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, token, seats, occurrence_id } = req.body;

  // In Dev mode, skip signature verification
  if (!process.env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID.includes('test_XXX')) {
    return res.status(200).json({ success: true, booking_id: `DEV_BOOKING_${Date.now()}` });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    return res.status(200).json({ success: true, booking_id: razorpay_order_id });
  } catch (err) {
    console.error('Payment verification failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
