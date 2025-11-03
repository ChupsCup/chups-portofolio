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
  const autoPlayMs = 3500
  const stripRef = useRef<HTMLUListElement>(null)

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
    if (!data.length || paused) return
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="relative" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/70">Slide untuk melihat sertifikat</span>
            <div className="flex gap-2">
              <button aria-label="prev" className="px-3 py-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(235,237,240,0.95)' }} onClick={() => goTo(slide-1)}>{'<'}</button>
              <button aria-label="next" className="px-3 py-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(235,237,240,0.95)' }} onClick={() => goTo(slide+1)}>{'>'}</button>
            </div>
          </div>

          <ul ref={stripRef} className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-2 no-scrollbar">
            {data.map((cert, idx) => (
              <li key={cert.id} className="snap-start shrink-0 w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[42rem]">
                <button
                  onClick={() => setActive(idx)}
                  className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative p-[2px] transition-shadow"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="absolute inset-0 rounded-[calc(theme(borderRadius.3xl)-2px)] overflow-hidden">
                    {cert.imageUrl ? (
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-start justify-end p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
                        <span className="text-xs text-white/80">{cert.issuer} • {cert.date}</span>
                        <span className="text-base font-semibold text-white line-clamp-2">{cert.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-3 py-2 ring-1 ring-white/10">
                        <span className="text-[11px] text-white/85 whitespace-nowrap">{cert.issuer} • {cert.date}</span>
                        <span className="text-white font-semibold text-sm line-clamp-1">{cert.title}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-center gap-2">
            {data.map((_, i)=> (
              <button
                key={i}
                aria-label={`go to ${i+1}`}
                onClick={()=> goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i===slide? 'w-7 scale-110' : 'w-2.5'}`}
                style={ i===slide ? { background: '#5C6CFF', boxShadow: '0 0 10px rgba(92,108,255,0.6)' } : { background: 'rgba(255,255,255,0.3)' } }
              />
            ))}
          </div>
        </div>

        {active !== null && data[active] && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-white/80">{data[active].issuer} • {data[active].date}</div>
                  <h3 className="text-xl font-bold text-white">{data[active].title}</h3>
                </div>
                <div className="flex gap-2">
                  {data[active].credentialUrl && (
                    <a
                      href={data[active].credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded font-medium"
                      style={{ background: '#5C6CFF', color: '#0A0A0A' }}
                    >
                      View Credential
                    </a>
                  )}
                  <button className="px-4 py-2 rounded bg-white/10 text-white" onClick={() => setActive(null)}>Close</button>
                </div>
              </div>
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black">
                {data[active].imageUrl ? (
                  <img src={data[active].imageUrl} alt={data[active].title} className="w-full h-full object-contain" />
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
