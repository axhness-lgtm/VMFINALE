import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder_key') {
    return res.status(500).json({ error: 'Database configuration missing. Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables.' });
  }
  if (req.method === 'POST') {
    const { action, id, title, event_date, total_seats = 8, price_inr = 299900, status, password } = req.body;

    if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      if (action === 'create' || (!id && title && event_date)) {
        const { data, error } = await supabase
          .from('occurrences')
          .insert({
            title,
            event_date,
            total_seats: parseInt(total_seats),
            price_inr: parseInt(price_inr),
            status: status || 'collecting_interests'
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        return res.status(200).json({ success: true, occurrence: data });
      } else if (action === 'update' || id) {
        if (!id) return res.status(400).json({ error: 'Occurrence ID is required.' });
        const updates = {};
        if (status) updates.status = status;
        if (title) updates.title = title;
        if (event_date) updates.event_date = event_date;

        const { data, error } = await supabase
          .from('occurrences')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) throw error;
        return res.status(200).json({ success: true, occurrence: data });
      } else {
        return res.status(400).json({ error: 'Invalid action or missing parameters.' });
      }
    } catch (error) {
      console.error('Error modifying occurrence:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

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
