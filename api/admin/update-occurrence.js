import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, status, title, event_date, password } = req.body;

  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Occurrence ID is required.' });
  }

  try {
    const updates = {};
    if (status) updates.status = status;
    if (title) updates.title = title;
    if (event_date) updates.event_date = event_date;

    const { data, error } = await supabase
      .from('occurrences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, occurrence: data });
  } catch (error) {
    console.error('Error updating occurrence:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
