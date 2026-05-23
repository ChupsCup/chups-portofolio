import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Force update with raw SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE projects 
        SET 
          image_url = CASE 
            WHEN id = 1 THEN 'https://picsum.photos/400/300?random=1'
            WHEN id = 2 THEN 'https://picsum.photos/400/300?random=2'
            WHEN id = 3 THEN 'https://picsum.photos/400/300?random=3'
            WHEN id = 4 THEN 'https://picsum.photos/400/300?random=4'
            ELSE 'https://picsum.photos/400/300?random=5'
          END,
          image_urls = CASE 
            WHEN id = 1 THEN ARRAY['https://picsum.photos/400/300?random=1']
            WHEN id = 2 THEN ARRAY['https://picsum.photos/400/300?random=2']
            WHEN id = 3 THEN ARRAY['https://picsum.photos/400/300?random=3']
            WHEN id = 4 THEN ARRAY['https://picsum.photos/400/300?random=4']
            ELSE ARRAY['https://picsum.photos/400/300?random=5']
          END
        WHERE image_url IS NULL OR image_url = '';
      `
    });
    
    // Add a new sample project
    const { error: insertError } = await supabase
      .from('projects')
      .insert([{
        title: 'Test Multiple Photos',
        description: 'This project demonstrates multiple photos gallery feature. Click to see multiple images!',
        image_url: 'https://picsum.photos/400/300?random=10',
        image_urls: [
          'https://picsum.photos/400/300?random=10',
          'https://picsum.photos/400/300?random=11',
          'https://picsum.photos/400/300?random=12'
        ],
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
        demo_url: null,
        github_url: null
      }]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Force update completed',
      sqlError: sqlError?.message,
      insertError: insertError?.message,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Force update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
