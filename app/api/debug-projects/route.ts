import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get all projects
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      return NextResponse.json({ 
        success: false, 
        error: fetchError.message,
        details: fetchError
      }, { status: 500 });
    }
    
    // Check table structure
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'projects');
    
    return NextResponse.json({ 
      success: true,
      projects: projects || [],
      projectCount: projects?.length || 0,
      tableColumns: columns || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
