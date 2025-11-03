"use client"

import { useEffect, useRef } from "react"

export default function InitialScrollGuard() {
  const ran = useRef(false)
  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const hash = window.location.hash
    const isReload = performance.getEntriesByType('navigation')
      .some((e) => (e as PerformanceNavigationTiming).type === 'reload')

    if (isReload && hash === '#education') {
      history.replaceState(null, '', window.location.pathname)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [])
  return null
}
