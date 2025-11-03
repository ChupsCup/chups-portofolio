import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (password !== 'Samsungj7') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseServiceKey || !supabaseUrl) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 500 })
    }

    const sql = `
CREATE TABLE IF NOT EXISTS public.about_info (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  education TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL,
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.about_info DISABLE ROW LEVEL SECURITY;
`;

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
      },
      body: JSON.stringify({ sql }),
    })

    const text = await response.text()
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to setup about_info', details: text }, { status: 500 })
    }

    await new Promise(r => setTimeout(r, 1000))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}


