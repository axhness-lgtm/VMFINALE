import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: occs } = await supabase.from('occurrences').select('id, title').order('created_at', { ascending: false }).limit(1);
  const activeOccId = occs[0].id;
  console.log('Active Occurrence:', activeOccId, occs[0].title);
  
  const { data: seats } = await supabase.rpc('get_available_seats', { p_occurrence_id: activeOccId });
  console.log('Available seats:', seats);

  const { data: bookings } = await supabase.from('bookings').select('*').eq('occurrence_id', activeOccId);
  console.log('Bookings for occurrence:', bookings);
}

run();
