import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { users, password } = req.body;

  if (password !== (process.env.ADMIN_PASSWORD || 'Hyndavio@1001')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: 'No users provided.' });
  }

  try {
    let insertedCount = 0;
    let errorCount = 0;

    // Process in batches of 50
    for (let i = 0; i < users.length; i += 50) {
      const batch = users.slice(i, i + 50).map(u => ({
        name: u.name?.trim() || 'Community Member',
        email: u.email?.trim()?.toLowerCase(),
        phone: u.phone?.trim() || 'N/A',
        instagram_handle: u.instagram?.trim() || u.instagram_handle?.trim() || null
      })).filter(u => u.email && u.email.includes('@'));

      if (batch.length === 0) continue;

      const { data, error } = await supabase
        .from('users')
        .upsert(batch, { onConflict: 'email', ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('Batch upsert error:', error);
        errorCount += batch.length;
      } else if (data) {
        insertedCount += data.length;
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Successfully processed CSV. Imported/Verified ${insertedCount} community members.` 
    });
  } catch (error) {
    console.error('Error importing CSV:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
