
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import TextReveal from './TextReveal'
import TextTypewriter from './TextTypewriter'
import ParallaxSection from './ParallaxSection'
import ButtonPill from '@/components/ButtonPill'

function MagneticButton({ href, variant = 'filled', children }: { href: string; variant?: 'filled' | 'outline'; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${relX * 0.08}px, ${relY * 0.08}px)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
  }

  const base = variant === 'filled'
    ? 'px-8 py-3 bg-accent text-white dark:bg-accent dark:text-brown-darker rounded-xl font-semibold text-center relative overflow-hidden group shadow-[0_10px_30px_rgba(232,184,138,0.35)]'
    : 'px-8 py-3 border-2 border-accent text-accent dark:text-accent dark:border-accent rounded-xl font-semibold text-center relative overflow-hidden group'

  return (
    <a href={href} ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={base}>
      <span className="relative z-10">{children}</span>
      <motion.div
        className={`absolute inset-0 ${variant === 'filled' ? 'bg-accent-dark dark:bg-accent-dark' : 'bg-accent/10'} pointer-events-none"`}
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        style={{ zIndex: 0 }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(120px 40px at var(--x,50%) var(--y,50%), rgba(255,255,255,0.35), transparent)' }} />
    </a>
  )
}

export default function Hero() {
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; duration: number; delay: number }[]>([])
  const [hero, setHero] = useState<{ title_prefix: string; highlight: string; para1: string; points: string[] } | null>(null)
  useEffect(() => {
    const list = Array.from({ length: 22 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
    }))
    setParticles(list)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data, error } = await supabase.storage.from('portfolio').download('about/about.json')
        if (!error && data) {
          const text = await data.text()
          const json = JSON.parse(text)
          const h = json?.hero || {}
          if (mounted) {
            setHero({
              title_prefix: h.title_prefix || "Hi, I'm fahri yusuf",
              highlight: h.highlight || 'Developer',
              para1: h.para1 || 'I build beautiful and functional web applications. Passionate about creating great user experiences with modern technologies.',
              points: Array.isArray(h.points) && h.points.length ? h.points : [
                'Full Stack Developer',
                'Frontend Enthusiast',
                'UI Motion Addict',
              ],
            })
          }
        } else {
          if (mounted) {
            setHero({
              title_prefix: "Hi, I'm fahri yusuf",
              highlight: 'Developer',
              para1: 'I build beautiful and functional web applications. Passionate about creating great user experiences with modern technologies.',
              points: ['Full Stack Developer', 'Frontend Enthusiast', 'UI Motion Addict'],
            })
          }
        }
      } catch {
        if (mounted) {
          setHero({
            title_prefix: "Hi, I'm fahri yusuf",
            highlight: 'Developer',
            para1: 'I build beautiful and functional web applications. Passionate about creating great user experiences with modern technologies.',
            points: ['Full Stack Developer', 'Frontend Enthusiast', 'UI Motion Addict'],
          })
        }
      }
    })()
    return () => { mounted = false }
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
        mass: 1,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  }

  return (
  <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Overlay gradient subtle for focus */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(60rem 30rem at 50% 10%, rgba(92,108,255,0.08), transparent 60%)'
      }} />
      <div className="max-w-6xl mx-auto p-4 md:p-8 py-20 w-full relative">
        <div className="flex justify-center">
          {/* Center - Text Only */}
          <motion.div
            className="space-y-6 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="space-y-2">
                <TextReveal className="text-5xl md:text-6xl font-extrabold text-[rgb(var(--foreground-rgb))] leading-tight">
                  {hero?.title_prefix ?? "Hi, I'm fahri yusuf"}
                </TextReveal>
                <motion.div
                  className="text-5xl md:text-6xl font-bold leading-tight"
                  style={{ color: '#5C6CFF' }}
                >
                  {hero?.highlight ?? 'Developer'}
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-xl md:text-2xl text-[rgb(var(--foreground-rgb))] opacity-80 font-medium">
              <TextTypewriter words={hero?.points ?? ["Full Stack Developer", "Frontend Enthusiast", "UI Motion Addict"]} />
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-[rgb(var(--foreground-rgb))] opacity-70 leading-relaxed max-w-xl">
              {hero?.para1 ?? 'I build beautiful and functional web applications. Passionate about creating great user experiences with modern technologies.'}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-4">
              <ButtonPill href="#projects" label="View My Work" variant="cobalt" />
              <ButtonPill href="#contact" label="Get In Touch" variant="mint" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-6 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Glitch styles */}
      <style jsx>{`
        .glitch {
          position: relative;
        }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          clip-path: inset(0 0 0 0);
          background: inherit;
          -webkit-background-clip: text;
          color: transparent;
          animation: glitch 2s infinite ease-in-out alternate;
          pointer-events: none;
        }
        .glitch::before { transform: translate(2px, -2px); filter: drop-shadow(0 0 8px rgba(92,108,255,0.45)); }
        .glitch::after { transform: translate(-2px, 2px); filter: drop-shadow(0 0 8px rgba(92,108,255,0.45)); animation-delay: .2s; }
        @keyframes glitch {
          0% { clip-path: inset(0 0 60% 0); opacity: .8; }
          20% { clip-path: inset(10% 0 40% 0); }
          40% { clip-path: inset(40% 0 20% 0); }
          60% { clip-path: inset(20% 0 40% 0); }
          80% { clip-path: inset(30% 0 10% 0); }
          100% { clip-path: inset(0 0 60% 0); opacity: .8; }
        }
      `}</style>
    </section>
  )
}

