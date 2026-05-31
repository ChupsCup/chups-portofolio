'use client'

import { useEffect, useRef, useState } from 'react'

type UseInViewOnceOptions = IntersectionObserverInit

export function useInViewOnce(options?: UseInViewOnceOptions) {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, options])

  return { ref, inView }
}
