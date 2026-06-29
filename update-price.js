import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('occurrences')
    .update({ price_inr: 100 }) // 100 paise = ₹1 INR
    .eq('title', 'Occurrence 18')
    .select('id, title, price_inr');

  if (error) {
    console.error('❌ Error updating price:', error);
  } else {
    console.log('✅ Successfully updated Occurrence 18 price to ₹1 (100 paise):');
    console.log(data);
  }
}

run();
