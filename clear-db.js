import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Clearing database for a fresh simulation...');
  await supabase.from('reminders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('seat_locks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('occurrence_interests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('occurrences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // Re-seed one active occurrence
  const { data } = await supabase.from('occurrences').insert({
    title: 'A Night in Vietnam (Simulation)',
    event_date: '2026-07-25 19:30:00+05:30',
    total_seats: 8,
    price_inr: 450000, // ₹4500
    status: 'collecting_interests'
  }).select().single();
  
  console.log(`✅ Database cleared. Active dinner is set up with 8 seats. (ID: ${data.id})`);
}

run();
