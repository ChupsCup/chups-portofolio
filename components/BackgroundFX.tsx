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
        const rect = canvas.getBoundingClientRect()
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        
        // Set canvas size to full viewport with DPR
        canvas.width = Math.floor(w * DPR)
        canvas.height = Math.floor(h * DPR)
        canvas.style.width = '100vw'
        canvas.style.height = '100vh'
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
        
        // Create particles
        const particleCount = Math.floor((w * h) / 15000) // Less particles for better performance
        particles = Array(particleCount).fill(0).map(() => ({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 1 + Math.random() * 0.5,
          alpha: 0.01 + Math.random() * 0.02
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
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-10" 
      />
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}


