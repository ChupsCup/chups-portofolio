const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function setupBucket() {
  try {
    console.log('🚀 Starting Supabase Storage setup...\n');

    // Create Supabase client dengan service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('📦 Creating "portfolio" bucket...');

    // Create bucket
    const { data, error } = await supabase.storage.createBucket('portfolio', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Bucket "portfolio" already exists');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Bucket "portfolio" created successfully');
      console.log('Data:', data);
    }

    console.log('\n✨ Storage setup completed!\n');
    console.log('📝 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage');
    console.log('2. Click "portfolio" bucket');
    console.log('3. Click "Policies" tab');
    console.log('4. Add policies for public access');
    console.log('\n✅ Then you can start uploading photos in admin panel!');

  } catch (error) {
    console.error('❌ Error setting up storage:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

setupBucket();

