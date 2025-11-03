'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export default function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  const words = children.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={wordVariants}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

