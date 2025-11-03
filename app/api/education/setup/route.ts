import { NextResponse } from 'next/server'
import { createClient as createServerAdminClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { serviceRole } = await request.json()
    const key = serviceRole || process.env.SUPABASE_SERVICE_ROLE
    if (!key) return NextResponse.json({ error: 'Missing service role' }, { status: 400 })
    const admin = createServerAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const sql = `
      create table if not exists public.educations (
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        issuer text not null,
        date text not null,
        credentialUrl text,
        imageUrl text,
        created_at timestamp with time zone default timezone('utc', now())
      );
      alter table public.educations enable row level security;
      drop policy if exists "edu_read_all" on public.educations;
      create policy "edu_read_all" on public.educations for select using (true);
      drop policy if exists "edu_write_auth" on public.educations;
      create policy "edu_write_auth" on public.educations for all using (auth.role() = 'authenticated');
    `

    // attempt to execute via an existing rpc function 'exec_sql'
    try {
      const { error } = await admin.rpc('exec_sql', { sql })
      if (error) throw error
    } catch {
      return NextResponse.json({ error: 'SQL executor RPC not available. Please create table via Supabase SQL.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'setup failed' }, { status: 500 })
  }
}
