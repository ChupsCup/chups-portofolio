import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Return hardcoded demo projects that work WITHOUT database
  const demoProjects = [
    {
      id: 999,
      title: "Demo Project 1 - E-Commerce",
      description: "A full-featured e-commerce platform with modern design and smooth user experience.",
      image_url: "https://picsum.photos/400/300?random=100",
      image_urls: [
        "https://picsum.photos/400/300?random=100",
        "https://picsum.photos/400/300?random=101",
        "https://picsum.photos/400/300?random=102"
      ],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
      created_at: new Date().toISOString()
    },
    {
      id: 998,
      title: "Demo Project 2 - Portfolio",
      description: "Beautiful portfolio website with gallery features and smooth animations.",
      image_url: "https://picsum.photos/400/300?random=200",
      image_urls: [
        "https://picsum.photos/400/300?random=200",
        "https://picsum.photos/400/300?random=201",
        "https://picsum.photos/400/300?random=202"
      ],
      technologies: ["React", "Next.js", "Framer Motion"],
      created_at: new Date().toISOString()
    },
    {
      id: 997,
      title: "Demo Project 3 - Dashboard",
      description: "Admin dashboard with analytics, charts, and real-time data visualization.",
      image_url: "https://picsum.photos/400/300?random=300",
      image_urls: [
        "https://picsum.photos/400/300?random=300",
        "https://picsum.photos/400/300?random=301"
      ],
      technologies: ["Vue.js", "Chart.js", "Firebase"],
      created_at: new Date().toISOString()
    }
  ];

  return NextResponse.json({
    success: true,
    projects: demoProjects,
    message: "Demo projects loaded successfully!",
    timestamp: new Date().toISOString()
  });
}
