import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Fallback dipakai supaya proses build/CI tidak crash saat env Supabase belum
// di-set. Request tetap akan ditolak, tapi errornya baru muncul saat runtime.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, projects: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}
