'use client'

import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInViewOnce } from '@/hooks/useInViewOnce'

type Animation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  animation?: Animation
  delay?: number
  as?: ElementType
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, inView } = useInViewOnce()

  return (
    <Tag
      ref={ref as never}
      className={`scroll-reveal scroll-reveal--${animation} ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

export function ScrollRevealGroup({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const { ref, inView } = useInViewOnce()

  return (
    <div ref={ref as never} className={`scroll-reveal-group ${inView ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}

export function ScrollRevealItem({
  children,
  className = '',
  index = 0,
}: {
  children: ReactNode
  className?: string
  index?: number
}) {
  return (
    <div
      className={`scroll-reveal-item ${className}`.trim()}
      style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
