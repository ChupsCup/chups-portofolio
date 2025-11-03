'use client'

import { useEffect } from 'react'

export default function ScrollFX() {
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      doc.style.setProperty('--scroll', progress.toString())
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed left-0 top-0 h-1 w-full z-[9998]">
      <div className="h-full bg-gradient-to-r from-accent to-accent-dark shadow-[0_0_20px_rgba(232,184,138,0.6)]" style={{ width: 'calc(var(--scroll, 0) * 100%)' }} />
    </div>
  )
}


