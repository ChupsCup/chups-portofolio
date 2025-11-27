'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    try {
      // Hormati prefers-reduced-motion: kalau user minta animasi minim, jangan jalanin efek ini
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (mql.matches) return
      }

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

      // Animated monochrome grain dengan kualitas lebih baik
      const render = () => {
        ctx.clearRect(0, 0, w, h)
        // Meningkatkan kualitas dengan lebih banyak partikel yang lebih kecil
        const count = Math.min(400, Math.floor((w * h) / 20000))
        for (let i = 0; i < count; i++) {
          const x = Math.random() * w
          const y = Math.random() * h
          const a = 0.02 + Math.random() * 0.03 // Opacity yang lebih halus
          const size = 0.8 + Math.random() * 0.8 // Ukuran partikel bervariasi
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fillRect(x, y, size, size)
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
    <div aria-hidden className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgb(12,12,12), rgb(18,18,18))' }}>
      <canvas ref={canvasRef} className="w-full h-full opacity-[.15]" />
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage:
          'radial-gradient(120vw 80vh at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
    </div>
  )
}


