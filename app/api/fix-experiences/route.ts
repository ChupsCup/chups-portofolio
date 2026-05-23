import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Add sample experiences using REST API
    const sampleExperiences = [
      {
        company: "Tech Company Inc.",
        position: "Senior Full Stack Developer",
        description: "Led development of scalable web applications using React, Next.js, and Node.js. Implemented CI/CD pipelines and improved system performance by 40%.",
        start_date: "2022-01-15",
        end_date: "2023-12-31",
        is_current: false,
        technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"]
      },
      {
        company: "Digital Agency",
        position: "Frontend Developer",
        description: "Developed responsive websites and web applications for various clients. Specialized in creating smooth user experiences and optimizing performance.",
        start_date: "2020-06-01",
        end_date: "2021-12-31",
        is_current: false,
        technologies: ["Vue.js", "JavaScript", "CSS", "Webpack", "Git"]
      },
      {
        company: "StartupHub",
        position: "Junior Developer",
        description: "Started as an intern and grew into a full-time role. Built features for the main product and participated in code reviews.",
        start_date: "2019-03-01",
        end_date: "2020-05-31",
        is_current: false,
        technologies: ["HTML", "CSS", "JavaScript", "React", "MongoDB"]
      }
    ];

    const results = [];
    for (const exp of sampleExperiences) {
      const response = await fetch(`${supabaseUrl}/rest/v1/experiences`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(exp)
      });

      const responseText = await response.text();
      results.push({
        success: response.ok,
        status: response.status,
        response: responseText
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Experiences added successfully',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fix experiences error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
