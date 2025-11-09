'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
    '#contact': '#FF6B6B',   // updated distinct color
  }
  const colorFor = (key: string) => COLOR_MAP[key] || '#5C6CFF'

  // Hitung offset dari tinggi navbar sebenarnya
  const getOffset = useCallback(() => {
    const h = navRef.current?.getBoundingClientRect().height ?? (compact ? 48 : 64)
    return Math.max(70, h + 24)
  }, [compact])

  // Deteksi section aktif (batch read)
  const computeActive = useCallback(() => {
    const ids = ['home', 'about', 'projects', 'education', 'contact']
    const offset = getOffset()
    const scrollY = window.scrollY || document.documentElement.scrollTop
    const scrollPos = scrollY + offset

    let current: string | null = null
    let smallestPositive: { id: string; delta: number } | null = null
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const absoluteTop = el.getBoundingClientRect().top + scrollY
      const delta = absoluteTop - scrollPos
      if (delta <= 0) current = `#${id}`
      else if (!smallestPositive || delta < smallestPositive.delta) smallestPositive = { id, delta }
    }
    if (!current && smallestPositive) current = `#${smallestPositive.id}`
    return current ?? '#home'
  }, [getOffset])

  // RAF debounced scroll handler
  const rafRef = useRef<number>(0)
  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      const y = window.scrollY || document.documentElement.scrollTop
      setElevated(y > 4)
      setCompact(y > 80)
      setActive(computeActive())
      rafRef.current = 0
    })
  }, [computeActive])

  useEffect(() => {
    // hitung saat mount dan frame berikutnya
    handleScroll()
    requestAnimationFrame(() => handleScroll())

    const onHash = () => setTimeout(handleScroll, 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('hashchange', onHash)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  // Smooth scroll untuk anchor
  const scrollToHash = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    const el = document.querySelector(hash) as HTMLElement | null
    if (el) {
      const y = el.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop) - getOffset() + 1
      window.scrollTo({ top: y, behavior: 'smooth' })
      window.history.pushState(null, '', hash)
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      data-navbar-root
      className="fixed inset-x-0 top-0 z-[60]"
      initial={{ y: -100 }}
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

          <div
            ref={navRef}
            className={`grid grid-cols-3 items-center ${compact ? 'h-12' : 'h-16'} ${elevated ? 'px-3 sm:px-4' : 'px-0'}`}
          >
            {/* Brand left */}
            <div className={`flex items-center gap-2 ${elevated ? '' : 'pl-0'}`}>
              <a href="#home" className={`font-extrabold ${compact ? 'text-lg' : 'text-xl'}`} style={{ color: '#5C6CFF' }}>Portfolio</a>
            </div>

            {/* Links center */}
            <div className="hidden md:flex justify-center">
              <nav
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white transition"
              >
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

