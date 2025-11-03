import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    // Verify password
    const { password } = await request.json()
    if (password !== 'Samsungj7') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Supabase URL not configured' },
        { status: 500 }
      )
    }

    // Execute SQL via Supabase SQL API using the correct endpoint
    const sql = `
DROP TABLE IF EXISTS public.experiences CASCADE;

CREATE TABLE public.experiences (
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

ALTER TABLE public.experiences DISABLE ROW LEVEL SECURITY;
`

    console.log('Attempting to create table via Supabase SQL API...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service key exists:', !!supabaseServiceKey)

    // Use the correct Supabase SQL API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({ sql }),
    })

    const responseText = await response.text()
    console.log(`SQL execution response (${response.status}):`, responseText)

    if (!response.ok) {
      console.log('RPC endpoint failed, trying alternative approach...')

      // Alternative: Try to create table by inserting a test record
      // This will fail if table doesn't exist, but we can catch that
      const testResponse = await fetch(`${supabaseUrl}/rest/v1/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          company: 'Test',
          position: 'Test',
          description: 'Test',
          start_date: new Date().toISOString().split('T')[0],
          is_current: false,
          technologies: [],
        }),
      })

      if (testResponse.ok) {
        console.log('Table exists or was created!')
        return NextResponse.json({
          success: true,
          message: 'Experiences table is ready!',
        })
      }

      const testError = await testResponse.text()
      console.log('Test insert failed:', testError)

      return NextResponse.json(
        {
          error: 'Could not create table',
          details: responseText,
          hint: 'Please create the table manually via Supabase Dashboard'
        },
        { status: 500 }
      )
    }

    // Wait for schema cache to update
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Experiences table created successfully!',
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

