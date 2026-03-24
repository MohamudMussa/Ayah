import type { Metadata } from 'next'
import Providers from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aayah — Discover the Quran, One Verse at a Time',
  description:
    'Explore the beauty of the Quran through daily verses, multiple translations, and recitations from world-renowned Qaris.',
  keywords: ['Quran', 'Ayah', 'Islamic', 'Verse', 'Arabic', 'Translation', 'Recitation'],
  openGraph: {
    title: 'Aayah — Discover the Quran, One Verse at a Time',
    description: 'Explore the beauty of the Quran through daily verses, multiple translations, and recitations.',
    type: 'website',
    siteName: 'Aayah',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
