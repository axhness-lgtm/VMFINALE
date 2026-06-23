import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client using service_role key to bypass RLS
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, instagram_handle, occurrence_id } = req.body;

  if (!name || !email || !phone || !occurrence_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let userId;

    // 1. Check if user already exists in the Common Community List (by email or phone)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (existingUser) {
      userId = existingUser.id;
      // Update their latest details
      await supabase
        .from('users')
        .update({ name, instagram_handle })
        .eq('id', userId);
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ name, email, phone, instagram_handle })
        .select('id')
        .single();
        
      if (createError) throw createError;
      userId = newUser.id;
    }

    // 2. Add to Occurrence Interests (Active List)
    const { error: interestError } = await supabase
      .from('occurrence_interests')
      .insert({
        occurrence_id,
        user_id: userId,
        status: 'interested'
      });
      
    // Ignore conflict if they already showed interest for this occurrence
    if (interestError && interestError.code !== '23505') { 
       throw interestError;
    }

    return res.status(200).json({ success: true, message: 'Interest registered successfully' });
  } catch (error) {
    console.error('Error registering interest:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
