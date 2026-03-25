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

    const ref = `${arabic.surah.number}:${arabic.numberInSurah}`
    const title = `${arabic.surah.englishName} ${ref} (${arabic.surah.name}) — Aayah`
    const description = english.text.length > 200
      ? english.text.substring(0, 197) + '...'
      : english.text

    return {
      title,
      description,
      openGraph: {
        title: `${arabic.surah.englishName} ${ref} — ${arabic.surah.name}`,
        description: `"${description}" — Quran ${ref}`,
        type: 'article',
        siteName: 'Aayah',
        url: `https://aayah.one/ayah/${params.reference}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${arabic.surah.englishName} ${ref} — Quran`,
        description: `"${description}"`,
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
