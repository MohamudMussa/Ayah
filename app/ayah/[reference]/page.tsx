import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAyah, type AyahData } from '@/lib/api'
import AyahPageClient from './AyahPageClient'

interface Props {
  params: { reference: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const editions = await getAyah(params.reference, ['ar.hudhaify', 'en.sahih'])
    const english = editions.find((e) => e.edition?.language === 'en')
    const arabic = editions.find((e) => e.edition?.language === 'ar')

    if (!english || !arabic) return {}

    const title = `${arabic.surah.englishName} ${params.reference} — Aayah`
    const description = english.text.substring(0, 200)

    return {
      title,
      description,
      openGraph: {
        title: `Quran — ${arabic.surah.englishName} (${arabic.surah.name}) ${params.reference}`,
        description,
        type: 'article',
        siteName: 'Aayah',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch {
    return { title: 'Ayah — Aayah' }
  }
}

export default async function AyahPage({ params }: Props) {
  let arabic: AyahData | undefined
  let english: AyahData | undefined

  try {
    const editions = await getAyah(params.reference, ['ar.hudhaify', 'en.sahih'])
    arabic = editions.find((e) => e.edition?.language === 'ar')
    english = editions.find((e) => e.edition?.language === 'en')
  } catch {
    notFound()
  }

  if (!arabic || !english) notFound()

  return (
    <AyahPageClient
      initialArabic={arabic}
      initialEnglish={english}
      reference={params.reference}
    />
  )
}
