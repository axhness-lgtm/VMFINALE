import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder_key') {
    return res.status(500).json({ error: 'Database configuration missing. Please add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables.' });
  }

  const { name, email, phone, instagram_handle, occurrence_id } = req.body;

  if (!name || !email || !phone || !occurrence_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let userId;

    // 1. Check if user already exists in the Common Community List (by email or phone)
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      userId = existingUsers[0].id;
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
        .maybeSingle();
        
      if (createError) {
        if (createError.code === '23505' || createError.message?.includes('duplicate') || createError.message?.includes('unique')) {
          const { data: retryUsers } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${email},phone.eq.${phone}`)
            .limit(1);
          if (retryUsers && retryUsers.length > 0) {
            userId = retryUsers[0].id;
          } else {
            throw createError;
          }
        } else {
          throw createError;
        }
      } else if (newUser?.id) {
        userId = newUser.id;
      }
    }

    if (!userId) {
      throw new Error('Unable to resolve user profile identity.');
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
    if (interestError && interestError.code !== '23505' && !interestError.message?.includes('duplicate') && !interestError.message?.includes('unique')) { 
       throw interestError;
    }

    return res.status(200).json({ success: true, message: 'Interest registered successfully' });
  } catch (error) {
    console.error('Error registering interest:', error);
    const errMsg = error?.message || error?.details || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return res.status(500).json({ error: errMsg || 'Internal Server Error', details: errMsg });
  }
}
