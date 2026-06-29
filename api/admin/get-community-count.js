import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (error) throw error;
    return res.status(200).json({ success: true, count: count || 0 });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
