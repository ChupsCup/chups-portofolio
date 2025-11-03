import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'
import ScrollFX from '@/components/ScrollFX'
import BackgroundFX from '@/components/BackgroundFX'
import InitialScrollGuard from '@/components/InitialScrollGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - Your Name',
  description: 'Professional portfolio website showcasing my projects and skills',
}

export const viewport: Viewport = {
  width: 1280,
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=1280, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <InitialScrollGuard />
        <Cursor />
        <BackgroundFX />
        <ScrollFX />
        {children}
      </body>
    </html>
  )
}

