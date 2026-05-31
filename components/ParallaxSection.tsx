import type { ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  offset?: number
  className?: string
}

export default function ParallaxSection({ children, className = '' }: ParallaxSectionProps) {
  return <div className={className}>{children}</div>
}
