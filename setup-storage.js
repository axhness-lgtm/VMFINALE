import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
  console.log('Initializing public storage bucket "dinner-images"...');
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.some(b => b.name === 'dinner-images');
    if (!exists) {
      const { data, error } = await supabase.storage.createBucket('dinner-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      if (error) throw error;
      console.log('✅ Successfully created public bucket "dinner-images":', data);
    } else {
      console.log('ℹ️ Bucket "dinner-images" already exists.');
    }
  } catch (err) {
    console.error('❌ Error initializing storage:', err.message || err);
  }
}

setup();
