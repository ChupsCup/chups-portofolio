import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import InitialScrollGuard from '@/components/InitialScrollGuard'
import ClientErrorBoundary from '@/components/ClientErrorBoundary'
import GlobalEffects from '@/components/GlobalEffects'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Fahri Yusuf — System Analyst & Developer',
  description: 'Portfolio Fahri Yusuf, System Analyst & Full-Stack Developer berbasis di Jakarta, Indonesia. Spesialis React, Next.js, TypeScript, dan Laravel.',
  keywords: ['Fahri Yusuf', 'Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'Jakarta', 'Indonesia', 'portfolio'],
  authors: [{ name: 'Fahri Yusuf', url: 'https://chups-portofolio.vercel.app' }],
  creator: 'Fahri Yusuf',
  metadataBase: new URL('https://chups-portofolio.vercel.app'),
  openGraph: {
    type: 'website',
    url: 'https://chups-portofolio.vercel.app',
    title: 'Fahri Yusuf — System Analyst & Developer',
    description: 'Portfolio Fahri Yusuf, System Analyst & Full-Stack Developer berbasis di Jakarta, Indonesia. Spesialis React, Next.js, TypeScript, dan Laravel.',
    siteName: 'Fahri Yusuf Portfolio',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Fahri Yusuf — System Analyst & Developer',
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
  verification: {
    google: '2XKFxkI4ZFFH85tdDVgo-UakEe7O8zPmr7kYXUwsPmw',
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
        <head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content={metadata.description ?? ''} />
          <script dangerouslySetInnerHTML={{ __html: `if (${JSON.stringify(process.env.NODE_ENV)} === "production") { console.log = function(){}; console.info = function(){}; console.debug = function(){}; console.warn = function(){}; }` }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Fahri Yusuf",
            jobTitle: "System Analyst & Full-Stack Developer",
            url: "https://chups-portofolio.vercel.app",
            email: "fahriysuf@gmail.com",
            address: { "@type": "PostalAddress", addressLocality: "Jakarta", addressCountry: "ID" },
            sameAs: ["https://github.com/ChupsCup", "https://www.linkedin.com/in/fahri-yusuf-73bb75217"]
          }) }} />
        </head>
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

