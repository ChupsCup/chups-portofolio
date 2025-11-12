'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, Experience } from '@/lib/supabase'
import ParallaxSection from './ParallaxSection'
import ScrambleText from './ScrambleText'
import { pickAccentByKey } from '@/lib/accents'
import { setupExperiencesTable } from '@/lib/setupDatabase'

const HAS_SUPABASE = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!HAS_SUPABASE) {
      setExperiences([])
      setLoading(false)
      return
    }
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 10000)
    fetchExperiences().finally(() => clearTimeout(timeoutId))
  }, [])

  async function fetchExperiences() {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        // Silently handle table not found
        const errorMsg = error.message || JSON.stringify(error)
        if (
          error.code === 'PGRST116' ||
          error.code === 'PGRST205' ||
          errorMsg.includes('relation') ||
          errorMsg.includes('does not exist') ||
          errorMsg.includes('404') ||
          errorMsg.includes('schema cache')
        ) {
          console.log('experiences table not found - this is normal if not set up yet')
          try {
            const ok = await setupExperiencesTable()
            if (ok) {
              // small delay for schema cache to refresh then retry
              await new Promise((r) => setTimeout(r, 1000))
              const { data: retry } = await supabase
                .from('experiences')
                .select('*')
                .order('start_date', { ascending: false })
              setExperiences(retry || [])
            } else {
              setExperiences([])
            }
          } catch {
            setExperiences([])
          } finally {
            setLoading(false)
          }
          return
        }
        throw error
      }
      setExperiences(data || [])
    } catch (error) {
      console.log('Error fetching experiences (table may not be created yet):', error)
      setExperiences([])
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/70">Loading experiences...</p>
        </div>
      </section>
    )
  }

  if (experiences.length === 0) {
    return null
  }

  return (
    <ParallaxSection>
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <ScrambleText
              text="My Experience"
              className="text-4xl md:text-5xl font-extrabold mb-4 text-[rgb(var(--foreground-rgb))]"
            />
            <div className="w-20 h-1 rounded-full" style={{ background: '#5C6CFF' }}></div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative pl-8 border-l-2"
                style={{ borderColor: '#5C6CFF' }}
              >
                {/* Timeline dot */}
                <div className="absolute -left-4 top-0 w-6 h-6 rounded-full border-4" style={{ background: '#5C6CFF', borderColor: 'rgba(12,12,12,1)' }}></div>

                {/* Content */}
                <div
                  className="group p-6 rounded-lg shadow-md hover:shadow-lg transition-all border will-change-transform relative"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                  onMouseMove={(e) => {
                    const t = e.currentTarget as HTMLDivElement
                    const r = t.getBoundingClientRect()
                    const x = ((e.clientX - r.left) / r.width) * 100
                    const y = ((e.clientY - r.top) / r.height) * 100
                    t.style.setProperty('--x', `${x}%`)
                    t.style.setProperty('--y', `${y}%`)
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'radial-gradient(280px 120px at var(--x,50%) var(--y,50%), rgba(92,108,255,0.14), transparent 60%)' }} />
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">{exp.position}</h3>
                      <p className="text-lg text-white/80 font-semibold">{exp.company}</p>
                    </div>
                    <div className="text-sm text-white/70 mt-2 md:mt-0 md:text-right font-medium">
                      <p>
                        {formatDate(exp.start_date)} -{' '}
                        {exp.is_current ? (
                          <span style={{ color: '#5C6CFF' }} className="font-semibold">Present</span>
                        ) : (
                          formatDate(exp.end_date || '')
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-white/85 mb-4 leading-relaxed text-base whitespace-pre-line">{exp.description}</div>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => {
                        const color = pickAccentByKey(`exp-tech:${tech}`)
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 text-black text-sm font-medium rounded-full border"
                            style={{ background: color, borderColor: color }}
                          >
                            {tech}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </ParallaxSection>
  )
}

