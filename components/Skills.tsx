'use client'

import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ParallaxSection from './ParallaxSection'
import ScrambleText from './ScrambleText'

type Skill = {
  id: string
  name: string
  level: number
  type: string
  note?: string
  category_id: string
}

type Category = {
  id: string
  title: string
  efficiency: number
  skills: Skill[]
}

const Skills: NextPage = () => {
  const [systemPacks, setSystemPacks] = useState<Category[]>([])
  const [softSkills, setSoftSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        const data = await response.json()
        setSystemPacks(data.categories || [])
        setSoftSkills(data.softSkills?.map((s: { name: string }) => s.name) || [])
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSkills()
  }, [])

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
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  } as const

  const TiltCard = ({ children }: { children: React.ReactNode }) => {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [hover, setHover] = useState(false)
    return (
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width
          const y = (e.clientY - rect.top) / rect.height
          setPos({ x, y })
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          transform: `perspective(1000px) rotateX(${(0.5 - pos.y) * 10}deg) rotateY(${(pos.x - 0.5) * 12}deg)`,
          transition: 'transform 200ms ease',
        }}
        className="relative rounded-[28px] p-8 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hover ? 1 : 0,
            background:
              'radial-gradient(600px circle at var(--mx) var(--my), rgba(255,255,255,0.18), transparent 40%)',
            // @ts-ignore
            ['--mx' as any]: `${pos.x * 100}%`,
            // @ts-ignore
            ['--my' as any]: `${pos.y * 100}%`,
          }}
        />
        {children}
      </div>
    )
  }

  const RadialGauge = ({ value }: { value: number }) => {
    const r = 28
    const c = 2 * Math.PI * r
    const pct = Math.max(0, Math.min(100, value))
    const dash = (pct / 100) * c
    return (
      <motion.svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
        <circle cx="36" cy="36" r={r} className="fill-transparent" stroke="rgba(255,255,255,.12)" strokeWidth="6" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          className="fill-transparent"
          stroke="#5C6CFF"
          strokeLinecap="round"
          strokeWidth="6"
          initial={{ strokeDasharray: `0 ${c}` }}
          whileInView={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(92,108,255,.5))' }}
        />
        <text x="36" y="40" textAnchor="middle" className="fill-current text-[12px] font-semibold">
          {value}%
        </text>
      </motion.svg>
    )
  }

  if (loading) {
    return (
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mx-auto mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="relative py-28">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <ScrambleText
              text="System Packs"
              className="text-4xl md:text-6xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-3 inline-block tracking-tight"
            />
          </motion.div>
          <motion.p variants={itemVariants} className="mt-2 text-white/70 text-sm max-w-2xl mx-auto">
            Combining system analysis expertise with development to craft efficient, scalable, user‑centric products
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-10 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {systemPacks.map((category, idx) => {
            const isLast = idx === systemPacks.length - 1
            const centerLast = systemPacks.length % 3 === 1 && isLast
            return (
              <div key={category.id} className={centerLast ? 'md:col-start-2' : ''}>
                <ParallaxSection offset={idx % 2 === 0 ? 18 : -18}>
                  <TiltCard>
                    <div className="relative flex items-start gap-4 mb-6">
                      <RadialGauge value={category.efficiency} />
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--foreground-rgb))]">
                          {category.title}
                        </h3>
                        <p className="text-xs text-white/70 mt-1">Core capabilities and representative skills</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {category.skills.map((skill) => (
                        <div key={skill.id} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm md:text-[0.95rem] font-medium text-[rgb(var(--foreground-rgb))]">
                              {skill.name}
                            </span>
                            <span className="font-semibold text-sm tabular-nums" style={{ color: '#5C6CFF' }}>
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative w-full h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <motion.div
                              className="absolute left-0 top-0 h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              viewport={{ once: true }}
                              style={{ background: '#5C6CFF', boxShadow: '0 0 12px rgba(92,108,255,0.35)' }}
                            />
                            <motion.div
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white/50 dark:bg-white/40 blur-sm pointer-events-none"
                              initial={{ left: '0%' }}
                              whileInView={{ left: `${skill.level}%` }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              viewport={{ once: true }}
                            />
                          </div>
                          {skill.note && (
                            <div className="mt-1 text-xs text-white/70">
                              {skill.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                </ParallaxSection>
              </div>
            )
          })}
        </motion.div>

        <motion.div
          className="mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            variants={itemVariants}
            className="text-center text-2xl font-bold tracking-tight text-[rgb(var(--foreground-rgb))] mb-6"
          >
            Keterampilan Lunak
          </motion.h3>
          <motion.div variants={containerVariants} className="flex flex-wrap gap-3 justify-center">
            {softSkills.map((skill, idx) => (
              <motion.span
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="px-4 py-2 rounded-full text-sm font-medium shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)]"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(235,237,240,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="relative z-[1]">{skill}</span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills