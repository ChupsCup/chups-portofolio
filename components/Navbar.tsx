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
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setElevated(y > 4)
      setCompact(y > 80)

      // scrollspy: update active link based on section anchors
      let current = '#home'
      const offset = 140 // consider navbar height
      for (const id of ['home', 'about', 'projects', 'education', 'contact']) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top - offset <= 0) current = `#${id}`
      }
      setActive(current)
      // no manual indicator; shared layout underline will move automatically
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
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
                className={`relative flex items-center gap-4 md:gap-6 ${
                  elevated
                    ? 'px-4 py-1.5 rounded-full border border-white/10 bg-[#10131a]/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]'
                    : 'px-0'
                }`}
              >
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onMouseEnter={() => setHoverKey(l.href)}
                    onMouseLeave={() => setHoverKey(null)}
                    className={`relative text-[0.97rem] transition ${active === l.href ? 'text-white' : 'text-white/80 hover:text-white'}`}
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

