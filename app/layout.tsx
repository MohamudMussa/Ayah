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
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
