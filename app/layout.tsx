import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import InitialScrollGuard from '@/components/InitialScrollGuard'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import GlobalEffects from '@/components/GlobalEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio - Your Name',
  description: 'Professional portfolio website showcasing my projects and skills',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className + ' overflow-x-hidden'}>
        <ClientErrorBoundary>
          <InitialScrollGuard />
          <GlobalEffects />
          <div className="overflow-x-hidden">
            {children}
          </div>
        </ClientErrorBoundary>
      </body>
    </html>
  )
}

