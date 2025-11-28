'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return
      let raf = 0

      const DPR = Math.min(2, (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1)
      let w = 0, h = 0
      const resize = () => {
        w = canvas.clientWidth
        h = canvas.clientHeight
        canvas.width = Math.floor(w * DPR)
        canvas.height = Math.floor(h * DPR)
        ;(ctx as CanvasRenderingContext2D).setTransform(DPR, 0, 0, DPR, 0, 0)
      }
      resize()
      const onResize = () => resize()
      window.addEventListener('resize', onResize)

      // Animated monochrome grain
      const render = () => {
        ctx.clearRect(0, 0, w, h)
        const count = Math.min(450, Math.floor((w * h) / 14000))
        for (let i = 0; i < count; i++) {
          const x = Math.random() * w
          const y = Math.random() * h
          const a = 0.03 + Math.random() * 0.04
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fillRect(x, y, 1, 1)
        }
        raf = requestAnimationFrame(render)
      }
      raf = requestAnimationFrame(render)

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', onResize)
      }
    } catch {
      // Fail silently if canvas API is not available
      return
    }
  }, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgb(12,12,12), rgb(18,18,18))' }}>
      <canvas ref={canvasRef} className="w-full h-full opacity-[.12]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(120rem 60rem at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: '100% 100%',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}


