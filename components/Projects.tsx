'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, Project } from '@/lib/supabase'
import ParallaxSection from './ParallaxSection'
import ScrambleText from './ScrambleText'
import { pickAccentByKey } from '@/lib/accents'
import ButtonPill from '@/components/ButtonPill'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Use demo data only during development to avoid prod divergence
      if (process.env.NODE_ENV !== 'production') {
        setProjects(demoProjects)
      } else {
        setProjects([])
      }
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const projectHoverVariants = {
    hover: {
      y: -12,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
  }

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="text-center text-brown-mid dark:text-cream-200">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
  <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <ScrambleText text="My Projects" className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4 inline-block" />
          </motion.div>
          <motion.div variants={itemVariants} className="w-20 h-1 mx-auto" style={{ background: '#5C6CFF' }}></motion.div>
          <motion.p variants={itemVariants} className="mt-4 text-white/70 font-medium">
            Here are some of my recent works
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, idx) => (
            <ParallaxSection key={project.id} offset={idx % 2 === 0 ? 15 : -15}>
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer will-change-transform border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                onMouseMove={(e) => {
                  const target = e.currentTarget as HTMLDivElement
                  const rect = target.getBoundingClientRect()
                  const x = ((e.clientX - rect.left) / rect.width) * 100
                  const y = ((e.clientY - rect.top) / rect.height) * 100
                  target.style.setProperty('--x', `${x}%`)
                  target.style.setProperty('--y', `${y}%`)
                }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(320px 140px at var(--x,50%) var(--y,50%), rgba(92,108,255,0.18), transparent 60%)' }}
                />
                <div className="h-48 flex items-center justify-center overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {project.image_url ? (
                    <motion.img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                    />
                  ) : (
                    <svg className="w-20 h-20 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => {
                      const chip = pickAccentByKey(`tech:${tech}`)
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 text-black text-xs font-semibold rounded-full"
                          style={{ background: chip }}
                        >
                          {tech}
                        </span>
                      )
                    })}
                  </div>
                  <div className="flex gap-3">
                    {project.demo_url && (
                      <ButtonPill href={project.demo_url} label="Live Demo" variant="auto" />
                    )}
                    {project.github_url && (
                      <ButtonPill href={project.github_url} label="GitHub" variant="auto" />
                    )}
                  </div>
                </div>
              </motion.div>
            </ParallaxSection>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Demo data for when database is not set up
const demoProjects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with cart, checkout, and payment integration.',
    image_url: '',
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates.',
    image_url: '',
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    technologies: ['React', 'Firebase', 'Material-UI'],
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A beautiful weather dashboard with forecasts and interactive maps.',
    image_url: '',
    demo_url: 'https://example.com',
    github_url: 'https://github.com',
    technologies: ['Vue.js', 'OpenWeather API', 'Chart.js'],
    created_at: new Date().toISOString(),
  },
]

