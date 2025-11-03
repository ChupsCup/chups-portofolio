import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    // Verify password
    const { password } = await request.json()
    if (password !== 'Samsungj7') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let tableCreated = false
    let bucketCreated = false

    // Try with service role key first (if available)
    if (supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Try to create profile_photos and experiences tables
      try {
        const { error: tableError } = await supabase.rpc('exec_sql', {
          sql: `
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

            CREATE TABLE IF NOT EXISTS experiences (
              id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
              company TEXT NOT NULL,
              position TEXT NOT NULL,
              description TEXT NOT NULL,
              start_date DATE NOT NULL,
              end_date DATE,
              is_current BOOLEAN DEFAULT false,
              technologies TEXT[] DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

            DROP POLICY IF EXISTS "Allow public read" ON experiences;
            CREATE POLICY "Allow public read" ON experiences
              FOR SELECT USING (true);

            DROP POLICY IF EXISTS "Allow authenticated insert" ON experiences;
            CREATE POLICY "Allow authenticated insert" ON experiences
              FOR INSERT WITH CHECK (true);

            DROP POLICY IF EXISTS "Allow authenticated update" ON experiences;
            CREATE POLICY "Allow authenticated update" ON experiences
              FOR UPDATE USING (true);

            DROP POLICY IF EXISTS "Allow authenticated delete" ON experiences;
            CREATE POLICY "Allow authenticated delete" ON experiences
              FOR DELETE USING (true);
          `
        })

        tableCreated = !tableError
      } catch (err) {
        console.log('Could not create table via RPC')
      }

      // Try to create storage bucket
      try {
        const { error: bucketError } = await supabase.storage
          .createBucket('portfolio', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          })

        bucketCreated = !bucketError
      } catch (err) {
        console.log('Could not create bucket')
      }
    }

    // If service key not available, try with anon key for bucket creation
    if (!bucketCreated && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      try {
        const { error: bucketError } = await supabase.storage
          .createBucket('portfolio', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          })

        bucketCreated = !bucketError
      } catch (err) {
        console.log('Could not create bucket with anon key')
      }
    }

    return NextResponse.json({
      success: tableCreated || bucketCreated,
      tableCreated,
      bucketCreated,
      message: 'Setup completed',
      note: 'If table creation failed, please create it manually via Supabase SQL Editor'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

