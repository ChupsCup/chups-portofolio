import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check if image_urls column exists
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'projects')
      .eq('column_name', 'image_urls');
    
    if (columnError) {
      console.log('Column check error:', columnError);
    }
    
    // Add image_urls column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';
        
        UPDATE projects 
        SET image_urls = '{}' 
        WHERE image_urls IS NULL;
      `
    });
    
    if (alterError) {
      console.log('Alter table error:', alterError);
      // Try alternative approach
      const { error: updateError } = await supabase
        .from('projects')
        .update({ image_urls: [] })
        .is('image_urls', null);
      
      if (updateError) {
        console.log('Update error:', updateError);
      }
    }
    
    // Test by inserting a sample project if none exist
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (fetchError || !existingProjects || existingProjects.length === 0) {
      // Create sample project
      const { error: insertError } = await supabase
        .from('projects')
        .insert([{
          title: 'Sample Project',
          description: 'This is a sample project to test the system',
          image_url: 'https://via.placeholder.com/400x300/5C6CFF/ffffff?text=Sample',
          image_urls: [],
          technologies: ['React', 'TypeScript', 'Tailwind'],
          demo_url: null,
          github_url: null
        }]);
      
      if (insertError) {
        console.log('Sample insert error:', insertError);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
