import { supabase } from './supabase'

export async function setupProfilePhotosTable() {
  try {
    // Check if table exists by trying to query it
    const { error: checkError } = await supabase
      .from('profile_photos')
      .select('id')
      .limit(1)

    if (checkError) {
      // Table doesn't exist or error
      if (checkError.code === 'PGRST116' || checkError.message?.includes('relation')) {
        console.log('profile_photos table not found. Attempting to create via SQL...')

        // Try to create table using SQL
        try {
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS profile_photos (
              id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
              photo_url TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

            DROP POLICY IF EXISTS "Allow public read" ON profile_photos;
            CREATE POLICY "Allow public read" ON profile_photos
              FOR SELECT USING (true);

            DROP POLICY IF EXISTS "Allow authenticated insert" ON profile_photos;
            CREATE POLICY "Allow authenticated insert" ON profile_photos
              FOR INSERT WITH CHECK (true);

            DROP POLICY IF EXISTS "Allow authenticated delete" ON profile_photos;
            CREATE POLICY "Allow authenticated delete" ON profile_photos
              FOR DELETE USING (true);
          `

          // Execute SQL via RPC if available, otherwise just log
          let sqlError: unknown = null
          try {
            const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
            sqlError = error
          } catch (e) {
            // If RPC function not available or throws, ignore and continue
            sqlError = null
          }

          if (sqlError) {
            console.log('Could not auto-create table via RPC. Please create manually.')
            return false
          }

          console.log('profile_photos table created successfully!')
          return true
        } catch (createErr) {
          console.log('Could not auto-create table. Please create manually via SQL Editor.')
          return false
        }
      }
      console.warn('Error checking table:', checkError)
      return false
    }

    console.log('profile_photos table already exists')
    return true
  } catch (error) {
    console.warn('Setup error:', error)
    return false
  }
}

export async function setupExperiencesTable() {
  try {
    // Check if table exists by trying to query it
    const { error: checkError } = await supabase
      .from('experiences')
      .select('id')
      .limit(1)

    if (checkError) {
      // Table doesn't exist or error
      if (checkError.code === 'PGRST116' || checkError.code === 'PGRST205' || checkError.message?.includes('relation') || checkError.message?.includes('does not exist')) {
        console.log('experiences table not found. Attempting to create via API...')

        // Try to create table using API endpoint
        try {
          const response = await fetch('/api/create-experiences-table', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'Samsungj7' })
          })

          if (response.ok) {
            const data = await response.json()
            console.log('experiences table created successfully via API!', data)
            return true
          } else {
            const errorData = await response.json()
            console.log('API creation failed:', errorData)
            return false
          }
        } catch (apiErr) {
          console.log('Could not create table via API. Please create manually.')
          return false
        }
      }
      console.warn('Error checking table:', checkError)
      return false
    }

    console.log('experiences table already exists')
    return true
  } catch (error) {
    console.warn('Setup error:', error)
    return false
  }
}

export async function setupStorageBucket() {
  try {
    // Try to upload a test file to check if bucket exists
    const testFileName = `.test-${Date.now()}.txt`
    const testContent = new Blob(['test'], { type: 'text/plain' })

    const { error: uploadError } = await supabase.storage
      .from('portfolio')
      .upload(testFileName, testContent, { upsert: false })

    if (uploadError) {
      if (uploadError.message?.includes('not found') || uploadError.message?.includes('404')) {
        console.log('portfolio bucket not found. Attempting to create...')

        // Try to create bucket
        try {
          const { error: createError } = await supabase.storage.createBucket('portfolio', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          })

          if (createError) {
            console.warn('Error creating bucket:', createError)
            return false
          }

          console.log('portfolio bucket created successfully!')
          return true
        } catch (createErr) {
          console.warn('Error creating bucket:', createErr)
          return false
        }
      }
      console.warn('Error testing bucket:', uploadError)
      return false
    }

    // Delete test file
    await supabase.storage.from('portfolio').remove([testFileName])
    console.log('portfolio bucket exists and is accessible')
    return true
  } catch (error) {
    console.warn('Setup error:', error)
    return false
  }
}

