'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  text: string
  className?: string
  trigger?: 'inview' | 'hover'
}

const CHARS = '!<>-_\/[]{}—=+*^?#________'

export default function ScrambleText({ text, className = '', trigger = 'inview' }: Props) {
  const [output, setOutput] = useState(text)
  const elRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef(0)
  const queueRef = useRef<{ from: string; to: string; start: number; end: number }[]>([])
  const frame = (t = 0) => {
    const q = queueRef.current
    let complete = 0
    let str = ''
    for (let i = 0, n = q.length; i < n; i++) {
      const { from, to, start, end } = q[i]
      if (t >= end) {
        complete++
        str += to
      } else if (t >= start) {
        str += CHARS[Math.floor(Math.random() * CHARS.length)]
      } else {
        str += from
      }
    }
    setOutput(str)
    if (complete === q.length) return
    frameRef.current = requestAnimationFrame(() => frame(t + 1))
  }

  const run = () => {
    cancelAnimationFrame(frameRef.current)
    const from = (elRef.current?.innerText || '').padEnd(text.length)
    queueRef.current = Array.from({ length: text.length }).map((_, i) => ({
      from: from[i] || ' ',
      to: text[i] || ' ',
      start: Math.floor(Math.random() * 10),
      end: Math.floor(Math.random() * 20) + 10,
    }))
    frameRef.current = requestAnimationFrame(() => frame(0))
  }

  useEffect(() => {
    if (trigger === 'inview') {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => e.isIntersecting && run())
      }, { threshold: 0.6 })
      if (elRef.current) io.observe(elRef.current)
      return () => io.disconnect()
    }
  }, [text, trigger])

  return (
    <span ref={elRef} className={className} onMouseEnter={() => trigger === 'hover' && run()}>
      {output}
    </span>
  )
}



