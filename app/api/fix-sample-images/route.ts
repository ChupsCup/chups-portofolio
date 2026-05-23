import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Update all projects with sample images
    const sampleImages = [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
      'https://picsum.photos/400/300?random=4'
    ];
    
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('id');
    
    if (fetchError) throw fetchError;
    
    if (projects && projects.length > 0) {
      // Update each project with a sample image
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const { error: updateError } = await supabase
          .from('projects')
          .update({ 
            image_url: sampleImages[i % sampleImages.length],
            image_urls: [sampleImages[i % sampleImages.length]]
          })
          .eq('id', project.id);
        
        if (updateError) {
          console.log(`Update error for project ${project.id}:`, updateError);
        }
      }
    }
    
    // Create a new sample project with proper image
    const { error: insertError } = await supabase
      .from('projects')
      .insert([{
        title: 'Sample Project with Images',
        description: 'This is a sample project to demonstrate multiple images functionality. Click to see the gallery!',
        image_url: 'https://picsum.photos/400/300?random=5',
        image_urls: [
          'https://picsum.photos/400/300?random=5',
          'https://picsum.photos/400/300?random=6',
          'https://picsum.photos/400/300?random=7'
        ],
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
        demo_url: null,
        github_url: null
      }]);
    
    if (insertError) {
      console.log('Insert error:', insertError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sample images added to projects',
      projectsUpdated: projects?.length || 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Fix images error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
