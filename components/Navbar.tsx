'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [elevated, setElevated] = useState(false)
  const [compact, setCompact] = useState(false)
  const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ]
  const [active, setActive] = useState('#home')
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // CTA color map to guarantee variety across links
  const COLOR_MAP: Record<string, string> = {
    '#home': '#5C6CFF',      // cobalt
    '#about': '#F5A9E6',     // pink
    '#projects': '#E6E66B',  // yellow
    '#education': '#96E6A1', // mint
    '#contact': '#5C6CFF',   // cobalt
  }
  const colorFor = (key: string) => COLOR_MAP[key] || '#5C6CFF'

  useEffect(() => {
    const ids = ['home', 'about', 'projects', 'education', 'contact']
    const getOffset = () => {
      const bar = document.querySelector('[data-navbar-root]') as HTMLElement | null
      const h = bar?.getBoundingClientRect().height ?? 80
      return Math.max(70, h + 24)
    }

    let offset = getOffset()

    const computeActive = () => {
      // Pilih section yang TOP-nya paling dekat dengan garis offset navbar (terdekat secara absolut)
      let best: { id: string; dist: number } | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        const dist = Math.abs(top - offset)
        if (!best || dist < best.dist) best = { id, dist }
      }
      let current = best ? `#${best.id}` : '#home'
      // Saat di dekat footer/bottom, pastikan last section aktif
      const nearBottom = window.innerHeight + (window.scrollY || document.documentElement.scrollTop) >= document.documentElement.scrollHeight - 4
      if (nearBottom) current = '#contact'
      return current
    }

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setElevated(y > 4)
      setCompact(y > 80)
      setActive(computeActive())
    }

    const onResize = () => {
      offset = getOffset()
      setActive(computeActive())
    }

    // Hitung posisi aktif segera dan pada frame berikutnya (setelah browser lompat ke hash)
    onScroll()
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => onScroll())
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onScroll)
    }
  }, [])

  return (
    <motion.nav
      data-navbar-root
      className="fixed inset-x-0 top-0 z-[60]"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 26 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Matte bar */}
        <motion.div
          className={`relative`}
          animate={{
            boxShadow: '0 0 0 rgba(0,0,0,0)',
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)'
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          style={{ borderWidth: 0, borderStyle: 'none' }}
        >
          {/* background sederhana tanpa vignette/pola untuk hindari banding */}

          <div className={`grid grid-cols-3 items-center ${compact ? 'h-12' : 'h-16'} ${elevated ? 'px-3 sm:px-4' : 'px-0'}`}> 
            {/* Brand left */}
            <div className={`flex items-center gap-2 ${elevated ? '' : 'pl-0'}`}>
              <a href="#home" className={`font-extrabold ${compact ? 'text-lg' : 'text-xl'}`} style={{ color: '#5C6CFF' }}>Portfolio</a>
            </div>

            {/* Links center */}
            <div className="hidden md:flex justify-center">
              <nav
                ref={navRef}
                className={`relative overflow-visible flex items-center gap-4 md:gap-6 ${
                  elevated
                    ? 'px-5 py-2 rounded-full bg-[#0B0F17]/80 backdrop-blur-md shadow-[0_10px_40px_-16px_rgba(0,0,0,0.7)]'
                    : 'px-0'
                }`}
              >
                {elevated && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full z-0"
                    style={{
                      boxShadow: '0 0 0 2px rgba(255,255,255,0.9), 0 8px 30px rgba(0,0,0,0.45)'
                    }}
                  />
                )}
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onMouseEnter={() => setHoverKey(l.href)}
                    onMouseLeave={() => setHoverKey(null)}
                    className={`relative z-[1] text-[0.97rem] transition ${active === l.href ? 'text-white' : 'text-white/80 hover:text-white'}`}
                  >
                    <span className="nav-text relative inline-block pb-[2px]">
                      {l.label}
                      {(hoverKey === l.href || (hoverKey == null && active === l.href)) && (
                        <motion.span
                          layoutId="nav-underline"
                          className="pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full rounded z-[1]"
                          style={{ background: colorFor(hoverKey ?? active) }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Right spacer (keeps center alignment) */}
            <div className="flex justify-end" />

            {/* Mobile menu button overlaying for small screens */}
            <div className="md:hidden absolute right-3 top-1/2 -translate-y-1/2">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div className="md:hidden" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[rgba(10,10,10,0.95)] border-t border-white/5">
            {['Home', 'About', 'Projects', 'Education', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white transition" onClick={() => setIsOpen(false)}>
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

