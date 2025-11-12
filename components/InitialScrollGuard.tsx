"use client"

import { useEffect, useRef } from "react"

export default function InitialScrollGuard() {
  const ran = useRef(false)
  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const hash = window.location.hash
    // Safari/iOS hardening: guard performance APIs
    const isReload = (() => {
      try {
        const getNav = (performance as any)?.getEntriesByType?.('navigation') as any[] | undefined
        if (getNav && getNav.length > 0) {
          const t = (getNav[0] as any)?.type
          return t === 'reload'
        }
      } catch {}
      return false
    })()

    if (isReload && hash === '#education') {
      history.replaceState(null, '', window.location.pathname)
      // Use valid values only: 'auto' | 'smooth'
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [])
  return null
}
