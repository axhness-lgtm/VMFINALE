import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { occurrence_id } = req.query;

  if (!occurrence_id) {
    return res.status(400).json({ error: 'Missing occurrence_id' });
  }

  try {
    const { data: availableSeats, error: seatsError } = await supabase
      .rpc('get_available_seats', { p_occurrence_id: occurrence_id });

    if (seatsError) throw seatsError;

    const { count, error: countError } = await supabase
      .from('occurrence_interests')
      .select('*', { count: 'exact', head: true })
      .eq('occurrence_id', occurrence_id);

    if (countError) throw countError;

    return res.status(200).json({ 
      available_seats: availableSeats, 
      interested_count: count || 0
    });
  } catch (error) {
    console.error('Error fetching booking status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
