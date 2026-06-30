import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const DOMAIN = process.env.VITE_DOMAIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://vantammayilu.com');

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const occurrence_id = req.body?.occurrence_id || req.query?.occurrence_id;
  const password = req.body?.password || req.query?.password;

  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!occurrence_id) {
    return res.status(400).json({ error: 'Occurrence ID is required.' });
  }

  try {
    // 1. Fetch occurrence interests
    const { data: interestsData } = await supabase
      .from('occurrence_interests')
      .select(`
        id, status, created_at,
        users ( id, name, email, phone, instagram_handle )
      `)
      .eq('occurrence_id', occurrence_id);

    // 2. Fetch confirmed bookings
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select(`
        id, status, seats, token_name, razorpay_order_id, customer_query, created_at,
        users ( id, name, email, phone, instagram_handle )
      `)
      .eq('occurrence_id', occurrence_id);

    const mergedMap = new Map();

    // Add interests first
    (interestsData || []).forEach(item => {
      if (item.users?.id) {
        mergedMap.set(item.users.id, {
          ...item,
          is_paid: false
        });
      }
    });

    // Merge or overwrite with bookings
    (bookingsData || []).forEach(b => {
      if (b.users?.id) {
        const existing = mergedMap.get(b.users.id) || { id: b.id, created_at: b.created_at, users: b.users };
        mergedMap.set(b.users.id, {
          ...existing,
          status: b.status === 'confirmed' ? 'PAID' : b.status,
          is_paid: b.status === 'confirmed',
          seats: b.seats,
          token_name: b.token_name,
          razorpay_order_id: b.razorpay_order_id,
          customer_query: b.customer_query,
          paid_at: b.created_at
        });
      }
    });

    const enrichedList = Array.from(mergedMap.values()).map(item => {
      const u = item.users || {};
      const token = jwt.sign(
        { user_id: u.id, email: u.email, phone: u.phone, occurrence_id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return {
        ...item,
        magic_link: `${DOMAIN}/dinner?token=${token}`
      };
    });

    // Sort: PAID first, then by created_at descending
    enrichedList.sort((a, b) => {
      if (a.is_paid && !b.is_paid) return -1;
      if (!a.is_paid && b.is_paid) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return res.status(200).json({ success: true, interests: enrichedList });
  } catch (error) {
    console.error('Error fetching interests:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
