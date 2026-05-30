import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import InitialScrollGuard from '@/components/InitialScrollGuard'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import GlobalEffects from '@/components/GlobalEffects'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fahri Yusuf — Full-Stack Developer',
  description: 'Portfolio Fahri Yusuf, Full-Stack Developer spesialis React, Next.js, TypeScript. Based in Jakarta, Indonesia.',
  keywords: ['Fahri Yusuf', 'Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Jakarta', 'Indonesia', 'portfolio'],
  authors: [{ name: 'Fahri Yusuf', url: 'https://chups-portofolio.vercel.app' }],
  creator: 'Fahri Yusuf',
  metadataBase: new URL('https://chups-portofolio.vercel.app'),
  openGraph: {
    type: 'website',
    url: 'https://chups-portofolio.vercel.app',
    title: 'Fahri Yusuf — Full-Stack Developer',
    description: 'Portfolio Fahri Yusuf, Full-Stack Developer spesialis React, Next.js, TypeScript. Lihat project, skill, dan experience saya.',
    siteName: 'Fahri Yusuf Portfolio',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Fahri Yusuf — Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fahri Yusuf — Full-Stack Developer',
    description: 'Portfolio Fahri Yusuf, Full-Stack Developer di Jakarta.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://chups-portofolio.vercel.app',
  },
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
      <body className={inter.className}>
        <ClientErrorBoundary>
          <InitialScrollGuard />
          <GlobalEffects />
          {children}
        </ClientErrorBoundary>
      </body>
    </html>
  )
}

