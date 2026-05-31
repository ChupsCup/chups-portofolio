'use client'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export default function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const words = children.split(' ')

  return (
    <span className={`inline-flex flex-wrap gap-2 ${className}`} aria-label={children}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className="animate-fade-in-up-word"
          style={{ animationDelay: `${delay + idx * 100}ms` }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
