'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ScrambleText from './ScrambleText'

type Certificate = {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl?: string
  imageUrl?: string
}

const defaultCertificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Software Engineering Foundations',
    issuer: 'Coursera',
    date: '2024',
    credentialUrl: '#',
  },
  {
    id: 'cert-2',
    title: 'System Analysis & Design',
    issuer: 'Dicoding',
    date: '2024',
    credentialUrl: '#',
  },
  {
    id: 'cert-3',
    title: 'Cloud Practitioner Essentials',
    issuer: 'AWS',
    date: '2024',
    credentialUrl: '#',
  },
]

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 160, damping: 18 } },
} as const

export default function Education({ certificates = defaultCertificates }: { certificates?: Certificate[] }) {
  const [items, setItems] = useState<Certificate[] | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  // Modal image always fits inside viewport (no scroll)
  const autoPlayMs = 4800
  const enableAutoplay = false
  const stripRef = useRef<HTMLUListElement>(null)
  const progress = (items && items.length ? (slide + 1) / items.length : (slide + 1) / certificates.length) * 100

  const goTo = (i: number) => {
    const len = data.length
    const next = ((i % len) + len) % len
    setSlide(next)
    const strip = stripRef.current
    const el = strip?.children[next] as HTMLElement | undefined
    if (strip && el) {
      // Only scroll the horizontal container; do NOT change the page scroll position
      strip.scrollTo({ left: el.offsetLeft, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!data.length || paused || !enableAutoplay) return
    const id = setInterval(() => {
      const strip = stripRef.current
      if (!strip) return
      const r = strip.getBoundingClientRect()
      const fullyOut = r.bottom < 0 || r.top > window.innerHeight
      if (fullyOut) return // do not trigger when section is off-screen
      goTo(slide + 1)
    }, autoPlayMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, paused, slide])

  // Keyboard navigation (ArrowLeft/ArrowRight)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(slide - 1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(slide + 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/education')
        if (res.ok) {
          const json = await res.json()
          const list: any[] = json.items || []
          if (mounted) {
            const mapped = list.map((x) => ({
              id: String(x.id),
              title: x.title,
              issuer: x.issuer,
              date: x.date,
              credentialUrl: x.credentialUrl || undefined,
              imageUrl: x.imageUrl || undefined,
            }))
            setItems(mapped.length ? mapped : certificates)
          }
        }
      } catch {
        if (mounted) setItems(certificates)
      }
    })()
    return () => { mounted = false }
  }, [])

  const data = items && items.length ? items : certificates

  return (
    <section id="education" className="py-24">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          className="text-center mb-10"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={item}>
            <ScrambleText
              text="My Education"
              className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))]"
            />
          </motion.div>
          <motion.p variants={item} className="mt-3 text-white/70 text-sm max-w-2xl mx-auto">
            Certifications and courses that reinforce my System Analyst and Full‑Stack capabilities.
          </motion.p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={()=>setPaused(true)}
          onMouseLeave={()=>setPaused(false)}
          onWheel={(e)=>{
            const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
            if (Math.abs(dx) < 10) return
            if (dx > 0) goTo(slide+1); else goTo(slide-1)
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/70">Klik kartu untuk melihat sertifikat</span>
            <span className="text-xs text-white/50">Grid view</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((cert, idx) => (
              <button
                key={cert.id}
                onClick={() => setActive(idx)}
                className="group w-full aspect-[16/9] rounded-2xl overflow-hidden relative transition-all hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}
              >
                <div className="absolute inset-0 rounded-[calc(theme(borderRadius.2xl)-1px)] overflow-hidden" style={{ background: '#080808' }}>
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-start justify-end p-4" style={{ background: 'rgba(0,0,0,0.38)' }}>
                      <span className="text-xs text-white/80">{cert.issuer} • {cert.date}</span>
                      <span className="text-base font-semibold text-white line-clamp-2">{cert.title}</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 0%, rgba(255,255,255,0.03), transparent 60%)' }} />
                  <div className="absolute inset-x-3 bottom-2 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: '#5C6CFF', boxShadow: '0 0 8px rgba(92,108,255,0.5)' }} />
                </div>
              </button>
            ))}
          </div>

          {/* Removed arrows and dots in grid layout */}

          {/* Timeline rail with nodes */}
          {/* Simplified dots only (keep the existing dots above) */}

          {/* No caption: keep it minimal */}
        </div>

        {active !== null && data[active] && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="relative w-[90vw] max-w-[1200px] h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-2 right-2 z-10 px-3 py-1 rounded bg-white/10 text-white text-sm" onClick={() => setActive(null)}>Close</button>
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {data[active].imageUrl ? (
                  <img
                    src={data[active].imageUrl}
                    alt={data[active].title}
                    className="object-contain"
                    style={{ maxWidth: '80vw', maxHeight: '75vh' }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/80">
                    <div className="text-2xl font-bold mb-2">{data[active].title}</div>
                    <div className="text-sm">{data[active].issuer} • {data[active].date}</div>
                  </div>
                )}
              </div>
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
                <button aria-label="prev" className="h-12 w-8 rounded bg-white/10 text-white" onClick={() => setActive((i) => (i! > 0 ? (i!-1) : data.length - 1))}>{'<'}</button>
                <button aria-label="next" className="h-12 w-8 rounded bg-white/10 text-white" onClick={() => setActive((i) => ((i!+1) % data.length))}>{'>'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
