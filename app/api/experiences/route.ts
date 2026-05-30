import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, experiences: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch experiences' }, { status: 500 });
  }
}
