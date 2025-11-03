const supabaseUrl = 'https://oemaqbrvwbosbinjrxei.supabase.co';
const supabaseServiceKey = 'sbp_c5ed6ba941156ee12f5d60fb56da8edbef167808';

async function setupStorage() {
  try {
    console.log('🚀 Starting Supabase Storage setup...\n');

    // 1. Create bucket using REST API
    console.log('📦 Creating "portfolio" bucket...');
    console.log(`URL: ${supabaseUrl}/storage/v1/bucket`);

    const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'portfolio',
        public: true,
      }),
    });

    console.log(`Response Status: ${createBucketResponse.status}`);

    const bucketResult = await createBucketResponse.json();
    console.log('Response:', JSON.stringify(bucketResult, null, 2));

    if (!createBucketResponse.ok) {
      if (bucketResult.message && bucketResult.message.includes('already exists')) {
        console.log('\n✅ Bucket "portfolio" already exists');
      } else {
        throw new Error(bucketResult.message || 'Failed to create bucket');
      }
    } else {
      console.log('\n✅ Bucket "portfolio" created successfully');
    }

    console.log('\n✨ Storage setup completed!\n');
    console.log('📝 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage');
    console.log('2. Click "portfolio" bucket');
    console.log('3. Click "Policies" tab');
    console.log('4. Add policies for public access (see QUICK_STORAGE_SETUP.md)');
    console.log('\n✅ Then you can start uploading photos in admin panel!');

  } catch (error) {
    console.error('❌ Error setting up storage:', error.message);
    process.exit(1);
  }
}

setupStorage();

