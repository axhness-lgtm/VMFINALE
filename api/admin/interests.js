import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { occurrence_id, password } = req.body;

  // Simple admin auth check matching open-bookings
  if (password !== (process.env.ADMIN_PASSWORD || 'founder123')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!occurrence_id) {
    return res.status(400).json({ error: 'Missing occurrence_id' });
  }

  try {
    const { data, error } = await supabase
      .from('occurrence_interests')
      .select(`
        id, status,
        users (id, name, email, phone, instagram_handle)
      `)
      .eq('occurrence_id', occurrence_id);

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching interests:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
