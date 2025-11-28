'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      // Skip on touch-only devices (avoid errors and unnecessary work)
      if ('ontouchstart' in window || (navigator as any)?.maxTouchPoints > 0) return

      const ring = ringRef.current
      const dot = dotRef.current
      if (!ring || !dot) return

      let x = window.innerWidth / 2
      let y = window.innerHeight / 2
      let rx = x
      let ry = y

      const onMove = (e: MouseEvent) => {
        x = e.clientX
        y = e.clientY
        dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`
      }

      const lerp = (a: number, b: number, n: number) => a + (b - a) * n
      let raf = 0
      let running = true
      const frame = () => {
        if (!running) return
        rx = lerp(rx, x, 0.12)
        ry = lerp(ry, y, 0.12)
        ring.style.left = `${rx}px`
        ring.style.top = `${ry}px`
        raf = requestAnimationFrame(frame)
      }

      const enlarge = () => (ring.style.transform = 'translate(-50%,-50%) scale(1.4)')
      const shrink = () => (ring.style.transform = 'translate(-50%,-50%) scale(1)')

      window.addEventListener('mousemove', onMove)
      const hoverables = document.querySelectorAll('a, button, .magnetic')
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', enlarge)
        el.addEventListener('mouseleave', shrink)
      })

      const onVisibility = () => {
        running = !document.hidden
        if (running) {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(frame)
        }
      }

      frame()
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('mousemove', onMove)
        hoverables.forEach((el) => {
          el.removeEventListener('mouseenter', enlarge)
          el.removeEventListener('mouseleave', shrink)
        })
        document.removeEventListener('visibilitychange', onVisibility)
      }
    } catch {
      // fail safely on unsupported environments
      return
    }
  }, [])

  return (
    <div id="cursor">
      <div ref={ringRef} className="cursor-ring"></div>
      <div ref={dotRef} className="cursor-dot"></div>
    </div>
  )
}


