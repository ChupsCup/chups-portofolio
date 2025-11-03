'use client'

import { useEffect, useState } from 'react'

interface Props {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  className?: string
}

export default function TextTypewriter({
  words,
  typingSpeed = 60,
  deletingSpeed = 40,
  pauseTime = 1200,
  className = ''
}: Props) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let timer: any
    const currentWord = words[index % words.length]

    if (!deleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), typingSpeed)
      } else {
        timer = setTimeout(() => setDeleting(true), pauseTime)
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), deletingSpeed)
      } else {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      }
    }

    return () => clearTimeout(timer)
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}



