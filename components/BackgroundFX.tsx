'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    try {
      // Skip if prefers-reduced-motion is enabled
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d', { alpha: true })
      if (!ctx) return
      
      let raf = 0
      let particles: Array<{x: number, y: number, size: number, alpha: number}> = []
      
      // Initialize canvas size and particles
      const init = () => {
        const DPR = Math.min(2, window.devicePixelRatio || 1)
        const w = window.innerWidth
        const h = document.documentElement.scrollHeight // Gunakan tinggi dokumen penuh
        
        // Set canvas size to full document with DPR
        canvas.width = Math.floor(w * DPR)
        canvas.height = Math.floor(h * DPR)
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
        
        // Create particles - lebih sedikit partikel untuk performa lebih baik
        const particleCount = Math.min(300, Math.floor((w * h) / 20000))
        particles = Array(particleCount).fill(0).map(() => ({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.8 + Math.random() * 0.8, // Ukuran lebih kecil
          alpha: 0.008 + Math.random() * 0.015 // Lebih transparan
        }))
        
        return { w, h }
      }
      
      const { w, h } = init()
      
      // Handle window resize
      const handleResize = () => {
        init()
        render()
      }
      
      window.addEventListener('resize', handleResize)
      
      // Render function
      const render = () => {
        if (!ctx) return
        
        // Clear with dark background
        ctx.fillStyle = '#0c0c0c'
        ctx.fillRect(0, 0, w, h)
        
        // Draw particles
        particles.forEach(particle => {
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
        })
        
        raf = requestAnimationFrame(render)
      }
      
      render()
      
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', handleResize)
      }
    } catch (error) {
      console.error('Error in BackgroundFX:', error)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgb(12,12,12), rgb(18,18,18))' }}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-10"
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120vw 90vh at 50% 0%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.65) 100%)'
        }}
      />
    </div>
  )
}


