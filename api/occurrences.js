import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: occurrences, error } = await supabase
      .from('occurrences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: bookings } = await supabase
      .from('bookings')
      .select('occurrence_id, seats, status');

    const enrichedOccurrences = (occurrences || []).map(occ => {
      const soldSeats = (bookings || [])
        .filter(b => b.occurrence_id === occ.id && b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.seats || 1), 0);
      return {
        ...occ,
        sold_seats: soldSeats
      };
    });

    return res.status(200).json({ success: true, occurrences: enrichedOccurrences });
  } catch (error) {
    console.error('Error fetching occurrences:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
