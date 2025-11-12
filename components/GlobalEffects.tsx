'use client'

import { useEffect, useState } from 'react'
import Cursor from '@/components/Cursor'
import ScrollFX from '@/components/ScrollFX'
import BackgroundFX from '@/components/BackgroundFX'
import InitialScrollGuard from '@/components/InitialScrollGuard'

function detectMobile(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const touch = 'ontouchstart' in window || (navigator as any).maxTouchPoints > 0
  const mql = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 767px)') : null
  const small = mql ? mql.matches : window.innerWidth <= 767
  const isUA = /Android|iPhone|iPad|iPod|Mobile|IEMobile|BlackBerry/i.test(ua)
  return touch && (small || isUA)
}

export default function GlobalEffects() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    try {
      setIsMobile(detectMobile())
      const onResize = () => setIsMobile(detectMobile())
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    } catch {
      setIsMobile(false)
    }
  }, [])

  if (isMobile) return null

  return (
    <>
      <InitialScrollGuard />
      <Cursor />
      <BackgroundFX />
      <ScrollFX />
    </>
  )
}
