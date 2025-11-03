'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
    const frame = () => {
      rx = lerp(rx, x, 0.15)
      ry = lerp(ry, y, 0.15)
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`
      raf = requestAnimationFrame(frame)
    }

    const enlarge = () => (ring.style.transform = 'translate(-50%,-50%) scale(1.4)')
    const shrink = () => (ring.style.transform = 'translate(-50%,-50%) scale(1)')

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, .magnetic').forEach((el) => {
      el.addEventListener('mouseenter', enlarge)
      el.addEventListener('mouseleave', shrink)
    })

    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.querySelectorAll('a, button, .magnetic').forEach((el) => {
        el.removeEventListener('mouseenter', enlarge)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <div id="cursor">
      <div ref={ringRef} className="cursor-ring"></div>
      <div ref={dotRef} className="cursor-dot"></div>
    </div>
  )
}


