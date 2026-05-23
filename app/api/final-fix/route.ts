import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Create a simple project using REST API directly
    const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        title: 'FINAL FIX PROJECT ' + Math.random().toString(36).substr(2, 9),
        description: 'This project WILL work! Multiple photos demo.',
        image_url: 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000),
        image_urls: [
          'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000),
          'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000),
          'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000)
        ],
        technologies: ['Next.js', 'React', 'TypeScript', 'Supabase'],
        demo_url: null,
        github_url: null
      })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.log('API Error:', responseText);
      return NextResponse.json({ 
        success: false, 
        error: 'API Error: ' + responseText,
        status: response.status,
        details: responseText
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'FINAL FIX SUCCESSFUL! Check your website now!',
      data: data,
      responseText: responseText,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Final fix error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all projects to debug
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?order=created_at.desc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    const responseText = await response.text();
    
    return NextResponse.json({ 
      success: true,
      projects: responseText,
      status: response.status,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
