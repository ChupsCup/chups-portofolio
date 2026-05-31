'use client'

import { useEffect, useState } from 'react'
import { supabase, Experience } from '@/lib/supabase'
import ParallaxSection from './ParallaxSection'
import ScrambleText from './ScrambleText'
import ScrollReveal, { ScrollRevealGroup, ScrollRevealItem } from './ScrollReveal'
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
        if (process.env.NODE_ENV !== 'production') console.log('Supabase error:', error);
        
        const errorMsg = error.message || JSON.stringify(error)
        if (
          error.code === 'PGRST116' ||
          error.code === 'PGRST205' ||
          errorMsg.includes('relation') ||
          errorMsg.includes('does not exist') ||
          errorMsg.includes('404') ||
          errorMsg.includes('schema cache')
        ) {
          try {
            const ok = await setupExperiencesTable()
            if (ok) {
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
      if (process.env.NODE_ENV !== 'production') console.log('Error fetching experiences:', error)
      setExperiences([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-48 rounded-full bg-white/10 mx-auto" />
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-3xl bg-white/5 p-6 min-h-[180px]">
                  <div className="h-6 w-40 rounded-full bg-white/10 mb-4" />
                  <div className="h-4 w-1/2 rounded-full bg-white/10 mb-6" />
                  <div className="h-3 w-full rounded-full bg-white/10 mb-3" />
                  <div className="h-3 w-5/6 rounded-full bg-white/10 mb-3" />
                  <div className="h-3 w-3/4 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <ParallaxSection>
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-16">
            <ScrambleText
              text="My Experience"
              className="text-4xl md:text-5xl font-extrabold mb-4 text-[rgb(var(--foreground-rgb))]"
            />
            <div className="w-20 h-1 rounded-full" style={{ background: '#5C6CFF' }}></div>
          </ScrollReveal>

          <ScrollRevealGroup className="space-y-8">
            {experiences.length === 0 ? (
            <div className="text-center text-white/70 py-16">
              No experience data available.
            </div>
          ) : experiences.map((exp, index) => (
              <ScrollRevealItem key={exp.id} index={index}>
                <div
                  className="relative pl-8 border-l-2"
                  style={{ borderColor: '#5C6CFF' }}
                >
                <div className="absolute -left-4 top-0 w-6 h-6 rounded-full border-4" style={{ background: '#5C6CFF', borderColor: 'rgba(12,12,12,1)' }}></div>

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
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>
    </ParallaxSection>
  )
}
