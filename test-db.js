import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDb() {
  console.log('--- Checking Occurrences ---');
  const { data: occs, error: occErr } = await supabase.from('occurrences').select('*');
  console.log('Occurrences:', occs, occErr || '');

  console.log('--- Checking Users ---');
  const { data: users, error: userErr } = await supabase.from('users').select('*');
  console.log('Users count:', users?.length, userErr || '');
  if (users?.length) console.log('Latest users:', users.slice(-3));

  console.log('--- Checking Interests ---');
  const { data: ints, error: intErr } = await supabase.from('occurrence_interests').select('*, users(name, email)');
  console.log('Interests count:', ints?.length, intErr || '');
  if (ints?.length) console.log('Latest interests:', ints.slice(-3));
}

checkDb();
