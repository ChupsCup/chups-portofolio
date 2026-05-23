import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Use service role key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Update existing projects
    const updates = [
      { id: 1, image_url: 'https://picsum.photos/400/300?random=1', image_urls: ['https://picsum.photos/400/300?random=1'] },
      { id: 2, image_url: 'https://picsum.photos/400/300?random=2', image_urls: ['https://picsum.photos/400/300?random=2'] },
      { id: 3, image_url: 'https://picsum.photos/400/300?random=3', image_urls: ['https://picsum.photos/400/300?random=3'] },
      { id: 4, image_url: 'https://picsum.photos/400/300?random=4', image_urls: ['https://picsum.photos/400/300?random=4'] }
    ];
    
    for (const update of updates) {
      const { error } = await supabase
        .from('projects')
        .update(update)
        .eq('id', update.id);
      
      if (error) {
        console.log(`Update error for project ${update.id}:`, error);
      }
    }
    
    // Add new sample project
    const { error: insertError } = await supabase
      .from('projects')
      .insert([{
        title: 'Multiple Photos Demo',
        description: 'This project demonstrates the multiple photos gallery feature. Click to see beautiful images!',
        image_url: 'https://picsum.photos/400/300?random=100',
        image_urls: [
          'https://picsum.photos/400/300?random=100',
          'https://picsum.photos/400/300?random=101',
          'https://picsum.photos/400/300?random=102'
        ],
        technologies: ['Next.js', 'React', 'TypeScript', 'Supabase'],
        demo_url: null,
        github_url: null
      }]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin update completed',
      insertError: insertError?.message,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
