import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, event_date, total_seats = 8, price_inr = 299900, status = 'collecting_interests', password } = req.body;

  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!title || !event_date) {
    return res.status(400).json({ error: 'Title and event date are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('occurrences')
      .insert({
        title,
        event_date,
        total_seats: parseInt(total_seats),
        price_inr: parseInt(price_inr),
        status
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, occurrence: data });
  } catch (error) {
    console.error('Error creating occurrence:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
