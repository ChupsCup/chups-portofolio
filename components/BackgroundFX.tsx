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

      // Efek grain yang lebih halus dan natural
      const render = () => {
        ctx.clearRect(0, 0, w, h)
        // Jumlah partikel disesuaikan dengan ukuran layar, tapi tidak terlalu banyak
        const count = Math.min(300, Math.floor((w * h) / 30000))
        for (let i = 0; i < count; i++) {
          const x = Math.random() * w
          const y = Math.random() * h
          // Opacity yang sangat halus
          const a = 0.01 + Math.random() * 0.02
          // Ukuran partikel lebih kecil dan konsisten
          const size = 1.2
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fillRect(Math.floor(x), Math.floor(y), size, size)
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
      <canvas ref={canvasRef} className="w-full h-full opacity-[.08]" />
      <div className="pointer-events-none absolute inset-0" style={{
        backgroundImage:
          'radial-gradient(100% 100% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
    </div>
  )
}


