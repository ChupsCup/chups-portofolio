"use client"

import { useEffect, useRef, useState } from "react"

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
]

const ctaByHref: Record<string, { bg: string; glow: string }> = {
  '#home': { bg: '#5C6CFF', glow: 'rgba(92,108,255,0.55)' },
  '#about': { bg: '#F5A1E6', glow: 'rgba(245,161,230,0.55)' },
  '#experience': { bg: '#E9F572', glow: 'rgba(233,245,114,0.55)' },
  '#projects': { bg: '#86F0B7', glow: 'rgba(134,240,183,0.55)' },
  '#skills': { bg: '#FF7A7A', glow: 'rgba(255,122,122,0.55)' },
  '#education': { bg: '#A6B0FF', glow: 'rgba(166,176,255,0.55)' },
  '#contact': { bg: '#86E0FF', glow: 'rgba(134,224,255,0.55)' },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>("#home")
  const linksRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; w: number; bg: string; glow: string }>({ x: 0, w: 0, bg: '#ffffff', glow: 'rgba(255,255,255,0.4)' })
  const [scrolled, setScrolled] = useState(false)

  // Recalculate indicator position for a specific href (or current active if not provided)
  const recalcIndicatorFor = (href?: string) => {
    const el = linksRef.current
    if (!el) return
    const targetHref = href || active
    const anchor = Array.from(el.querySelectorAll<HTMLAnchorElement>('a')).find(a => a.getAttribute('href') === targetHref)
    const containerRect = el.getBoundingClientRect()
    if (anchor) {
      const r = anchor.getBoundingClientRect()
      const cta = ctaByHref[targetHref] || ctaByHref['#home']
      setIndicator({ x: r.left - containerRect.left + 8, w: Math.min(56, r.width - 16), bg: cta.bg, glow: cta.glow })
    }
  }

  // Track which section is in view to highlight the corresponding link
  useEffect(() => {
    const computeActive = () => {
      const ids = links.map((l) => l.href.replace('#', ''))
      const els = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))

      if (els.length === 0) return

      const vh = window.innerHeight
      const ref = vh * 0.35 // slightly above center for nicer feel with fixed header

      // First, consider only sections that intersect the viewport
      const intersecting = els
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < vh)

      if (intersecting.length) {
        let best = intersecting[0]
        let bestDist = Math.abs((best.rect.top + best.rect.height / 2) - ref)
        for (const item of intersecting) {
          const dist = Math.abs((item.rect.top + item.rect.height / 2) - ref)
          if (dist < bestDist) {
            best = item
            bestDist = dist
          }
        }
        setActive(`#${best.el.id}`)
        return
      }

      // Fallback: pick the closest section below the viewport top; if none, pick the last above
      const below = els
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top >= 0)
        .sort((a, b) => a.rect.top - b.rect.top)[0]
      if (below) {
        setActive(`#${below.el.id}`)
        return
      }
      // Else last above
      const above = els
        .map((el) => ({ el, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom <= 0)
        .sort((a, b) => b.rect.bottom - a.rect.bottom)[0]
      if (above) setActive(`#${above.el.id}`)
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          computeActive()
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('hashchange', computeActive)
    computeActive()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('hashchange', computeActive)
    }
  }, [])

  // Toggle `scrolled` state (true when page is not at the very top)
  useEffect(() => {
    const onScrollFlag = () => {
      const y = (typeof window !== 'undefined' && (window.pageYOffset ?? 0))
        || (document.documentElement?.scrollTop ?? 0)
        || (document.body?.scrollTop ?? 0)
      setScrolled(y > 0)
    }
    onScrollFlag()
    window.addEventListener('scroll', onScrollFlag, { passive: true })
    return () => window.removeEventListener('scroll', onScrollFlag)
  }, [])

  // Animate the underline indicator to the active link
  useEffect(() => {
    const onResize = () => recalcIndicatorFor()
    recalcIndicatorFor()
    window.addEventListener('resize', onResize)
    // Handle late layout shifts (fonts/images)
    const tid = window.setTimeout(recalcIndicatorFor, 50)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(tid)
    }
  }, [active, scrolled])

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl bg-[rgba(10,10,10,0.55)] shadow-none backdrop-blur supports-[backdrop-filter]:bg-[rgba(10,10,10,0.35)]">
          <nav className="flex items-center justify-between px-4 py-3 relative min-h-14">
            <a href="#home" className="font-extrabold text-xl" style={{ color: "#5C6CFF" }}>Portfolio</a>

            <div
              ref={linksRef}
              className="hidden md:flex items-center gap-1 relative ml-auto"
              onMouseMove={(e) => {
                const el = linksRef.current
                if (!el) return
                const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null
                const href = target?.getAttribute?.('href') || undefined
                if (href) recalcIndicatorFor(href)
              }}
              onMouseLeave={() => recalcIndicatorFor()}
            >
              {links.map((l) => {
                const isActive = active === l.href
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setActive(l.href)}
                    className={`group relative px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition flex flex-col items-center ${isActive ? 'text-white' : ''}`}
                  >
                    <span>{l.label}</span>
                  </a>
                )
              })}
              {/* Moving underline indicator (solid + glow) */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 h-[2px] rounded-full"
                style={{
                  transform: `translateX(${indicator.x}px)`,
                  width: indicator.w,
                  background: indicator.bg,
                  boxShadow: `0 0 10px ${indicator.glow}, 0 0 18px ${indicator.glow}`,
                  transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), width 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 h-[6px] rounded-full opacity-40 blur-md"
                style={{
                  transform: `translateX(${indicator.x - 6}px)`,
                  width: indicator.w + 12,
                  background: indicator.bg,
                  transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), width 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>

            <button
              aria-label="Toggle Menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => setOpen((v) => !v)}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </nav>

          {open && (
            <div className="md:hidden px-4 pb-4">
              <div className="grid gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
