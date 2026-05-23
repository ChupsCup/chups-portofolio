import { NextResponse } from 'next/server';

export async function GET() {
  // Return hardcoded demo experiences that work WITHOUT database
  const demoExperiences = [
    {
      id: 1001,
      company: "Tech Company Inc.",
      position: "Senior Full Stack Developer",
      description: "Led development of scalable web applications using React, Next.js, and Node.js. Implemented CI/CD pipelines and improved system performance by 40%.",
      start_date: "2022-01-15",
      end_date: "2023-12-31",
      is_current: false,
      technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
      created_at: new Date().toISOString()
    },
    {
      id: 1002,
      company: "Digital Agency",
      position: "Frontend Developer", 
      description: "Developed responsive websites and web applications for various clients. Specialized in creating smooth user experiences and optimizing performance.",
      start_date: "2020-06-01",
      end_date: "2021-12-31",
      is_current: false,
      technologies: ["Vue.js", "JavaScript", "CSS", "Webpack", "Git"],
      created_at: new Date().toISOString()
    },
    {
      id: 1003,
      company: "StartupHub",
      position: "Junior Developer",
      description: "Started as an intern and grew into a full-time role. Built features for the main product and participated in code reviews.",
      start_date: "2019-03-01",
      end_date: "2020-05-31", 
      is_current: false,
      technologies: ["HTML", "CSS", "JavaScript", "React", "MongoDB"],
      created_at: new Date().toISOString()
    }
  ];

  return NextResponse.json({
    success: true,
    experiences: demoExperiences,
    message: "Demo experiences loaded successfully!",
    timestamp: new Date().toISOString()
  });
}
