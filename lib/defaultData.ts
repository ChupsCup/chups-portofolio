/**
 * Default/Fallback data for portfolio sections
 * Used when Supabase is unavailable or data hasn't been set up yet
 */

export const DEFAULT_ABOUT_INFO = {
  id: 0,
  name: 'Fahri Yusuf',
  location: 'Jakarta, Indonesia',
  education: 'Self-taught Developer',
  email: 'fahriysuf@gmail.com',
  phone: '085121017198',
  status: 'Open to Work / Available for Freelance',
  cv_url: '/api/cv',
  created_at: new Date().toISOString(),
}

export const DEFAULT_ABOUT_CONTENT = {
  title_prefix: "Hello! I'm a",
  highlight: 'passionate Full-Stack Developer',
  para1: "I'm a self-taught full-stack developer with a passion for creating beautiful, functional, and performant web applications. With expertise in React, Next.js, TypeScript, and modern web technologies, I transform ideas into digital reality.",
  para2: "I specialize in building responsive, user-friendly applications with clean code, optimal performance, and best practices. I'm always eager to learn new technologies and collaborate with talented teams to create impactful solutions.",
  points: [
    'Full-Stack Development',
    'React & Next.js',
    'TypeScript & JavaScript',
    'Responsive Design',
    'Performance Optimization',
    'Database Design',
  ],
}

export const DEFAULT_EXPERIENCES: any[] = [
  {
    id: '1',
    title: 'Fullstack Developer (Freelance)',
    company: 'Self-employed',
    description: 'Building modern web applications for various clients using Next.js, React, and TypeScript. Focus on performance, UX, and scalability.',
    start_date: '2023-01-01',
    end_date: null,
    is_current: true,
    accent_color: 'cyan',
  },
  {
    id: '2',
    title: 'Web Developer',
    company: 'Various Startups',
    description: 'Contributed to multiple startup projects, building responsive web interfaces and optimizing application performance.',
    start_date: '2022-06-01',
    end_date: '2022-12-31',
    is_current: false,
    accent_color: 'blue',
  },
]

export const DEFAULT_PROJECTS: any[] = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'Personal portfolio showcasing projects and skills. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    image_urls: [],
    repo_url: 'https://github.com/ChupsCup/website-portofolio',
    live_url: 'https://chups-portofolio.vercel.app',
    tech_stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase'],
    accent_color: 'cyan',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Full-stack task management application with real-time updates and collaborative features.',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    image_urls: [],
    repo_url: 'https://github.com/ChupsCup',
    live_url: '#',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    accent_color: 'blue',
  },
]

export const DEFAULT_SKILLS = [
  {
    id: '1',
    category: 'Frontend',
    name: 'React',
    level: 'Expert',
  },
  {
    id: '2',
    category: 'Frontend',
    name: 'Next.js',
    level: 'Expert',
  },
  {
    id: '3',
    category: 'Frontend',
    name: 'TypeScript',
    level: 'Advanced',
  },
  {
    id: '4',
    category: 'Frontend',
    name: 'Tailwind CSS',
    level: 'Advanced',
  },
  {
    id: '5',
    category: 'Frontend',
    name: 'Framer Motion',
    level: 'Intermediate',
  },
  {
    id: '6',
    category: 'Backend',
    name: 'Node.js',
    level: 'Advanced',
  },
  {
    id: '7',
    category: 'Backend',
    name: 'PostgreSQL',
    level: 'Advanced',
  },
  {
    id: '8',
    category: 'Backend',
    name: 'Supabase',
    level: 'Advanced',
  },
  {
    id: '9',
    category: 'Tools',
    name: 'Git & GitHub',
    level: 'Advanced',
  },
  {
    id: '10',
    category: 'Tools',
    name: 'Docker',
    level: 'Intermediate',
  },
]

export const DEFAULT_SOFT_SKILLS = [
  'Problem Solving',
  'Communication',
  'Team Collaboration',
  'Leadership',
  'Attention to Detail',
  'Time Management',
]
