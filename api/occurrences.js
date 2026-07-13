import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder_key') {
    return res.status(500).json({ error: 'Database configuration missing. Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables.' });
  }
  if (req.method === 'POST') {
    const { action, id, title, event_date, total_seats = 8, price_inr = 299900, status, dietary_type = 'non_veg', password } = req.body;

    if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      if (action === 'create' || (!id && title && event_date)) {
        let insertData = {
          title,
          event_date,
          total_seats: parseInt(total_seats),
          price_inr: parseInt(price_inr),
          status: status || 'collecting_interests',
          dietary_type: dietary_type || 'non_veg'
        };

        let { data, error } = await supabase
          .from('occurrences')
          .insert(insertData)
          .select()
          .maybeSingle();

        if (error && (error.message?.includes('dietary_type') || error.code === 'PGRST204' || error.code === '42703')) {
          delete insertData.dietary_type;
          let titlePrefix = `[${(dietary_type || 'non_veg').toUpperCase()}] `;
          if (!insertData.title.startsWith('[')) insertData.title = titlePrefix + insertData.title;
          const retry = await supabase.from('occurrences').insert(insertData).select().maybeSingle();
          if (retry.error) throw retry.error;
          data = retry.data;
        } else if (error) {
          throw error;
        }

        return res.status(200).json({ success: true, occurrence: data });
      } else if (action === 'update' || id) {
        if (!id) return res.status(400).json({ error: 'Occurrence ID is required.' });
        const updates = {};
        if (status) updates.status = status;
        if (title) updates.title = title;
        if (event_date) updates.event_date = event_date;
        if (dietary_type) updates.dietary_type = dietary_type;
        if (total_seats) updates.total_seats = parseInt(total_seats);
        if (price_inr !== undefined) updates.price_inr = parseInt(price_inr);

        let { data, error } = await supabase
          .from('occurrences')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error && (error.message?.includes('dietary_type') || error.code === 'PGRST204' || error.code === '42703')) {
          delete updates.dietary_type;
          const retry = await supabase.from('occurrences').update(updates).eq('id', id).select().maybeSingle();
          if (retry.error) throw retry.error;
          data = retry.data;
        } else if (error) {
          throw error;
        }

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
      
      let derivedDietary = occ.dietary_type || 'non_veg';
      if (!occ.dietary_type && occ.title) {
        if (occ.title.match(/^\[VEG\]/i)) derivedDietary = 'veg';
        else if (occ.title.match(/^\[BOTH\]/i)) derivedDietary = 'both';
        else if (occ.title.match(/^\[NON-VEG\]/i)) derivedDietary = 'non_veg';
      }

      return {
        ...occ,
        dietary_type: derivedDietary,
        sold_seats: soldSeats
      };
    });

    return res.status(200).json({ success: true, occurrences: enrichedOccurrences });
  } catch (error) {
    console.error('Error fetching occurrences:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
