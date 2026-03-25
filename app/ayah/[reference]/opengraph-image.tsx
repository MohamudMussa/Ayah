import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ayah from the Quran'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface AyahEdition {
  number: number
  text: string
  numberInSurah: number
  surah: {
    number: number
    name: string
    englishName: string
    englishNameTranslation: string
    numberOfAyahs: number
  }
  edition?: {
    identifier: string
    language: string
  }
}

async function fetchAyah(reference: string): Promise<{
  arabic: AyahEdition
  english: AyahEdition
} | null> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${reference}/editions/quran-uthmani,en.sahih`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const json = await res.json()
    const data = Array.isArray(json.data) ? json.data : [json.data]
    const arabic = data.find(
      (d: AyahEdition) => d.edition?.identifier === 'quran-uthmani'
    )
    const english = data.find(
      (d: AyahEdition) => d.edition?.identifier === 'en.sahih'
    )
    if (!arabic || !english) return null
    return { arabic, english }
  } catch {
    return null
  }
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.substring(0, maxLen - 1).trimEnd() + '\u2026'
}

export default async function OGImage({
  params,
}: {
  params: { reference: string }
}) {
  const result = await fetchAyah(params.reference)

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a1628 0%, #1a1a2e 50%, #16213e 100%)',
            color: '#ffffff',
            fontSize: 48,
            fontFamily: 'sans-serif',
          }}
        >
          aayah.one
        </div>
      ),
      { ...size }
    )
  }

  const { arabic, english } = result
  const surahName = arabic.surah.englishName
  const surahArabic = arabic.surah.name
  const ref = `${arabic.surah.number}:${arabic.numberInSurah}`
  const arabicText = truncate(arabic.text, 200)
  const englishText = truncate(english.text, 180)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0a1628 0%, #111827 40%, #1a1a2e 70%, #0f172a 100%)',
          fontFamily: 'sans-serif',
          padding: '0',
          position: 'relative',
        }}
      >
        {/* Outer border glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '0',
          }}
        />

        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            display: 'flex',
            border: '1px solid rgba(212, 175, 55, 0.12)',
            borderRadius: '4px',
          }}
        />

        {/* Top decorative line */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 100,
            right: 100,
            height: '1px',
            display: 'flex',
            background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 30%, rgba(212, 175, 55, 0.5) 50%, rgba(212, 175, 55, 0.3) 70%, transparent 100%)',
          }}
        />

        {/* Surah name header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '50px',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: 'rgba(212, 175, 55, 0.9)',
              letterSpacing: '4px',
              textTransform: 'uppercase' as const,
              fontWeight: 600,
            }}
          >
            {surahName}
          </span>
          <span
            style={{
              fontSize: 14,
              color: 'rgba(212, 175, 55, 0.5)',
            }}
          >
            |
          </span>
          <span
            style={{
              fontSize: 20,
              color: 'rgba(212, 175, 55, 0.7)',
            }}
          >
            {surahArabic}
          </span>
        </div>

        {/* Reference number */}
        <div
          style={{
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '2px',
            marginBottom: '28px',
          }}
        >
          AYAH {ref}
        </div>

        {/* Arabic text */}
        <div
          style={{
            fontSize: arabicText.length > 120 ? 32 : arabicText.length > 80 ? 38 : 44,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.8,
            maxWidth: '1040px',
            padding: '0 40px',
            direction: 'rtl' as const,
          }}
        >
          {arabicText}
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              display: 'flex',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4))',
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              display: 'flex',
              background: 'rgba(212, 175, 55, 0.5)',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '1px',
              display: 'flex',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.4), transparent)',
            }}
          />
        </div>

        {/* English translation */}
        <div
          style={{
            fontSize: englishText.length > 120 ? 17 : 20,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: '900px',
            padding: '0 40px',
            fontStyle: 'italic',
          }}
        >
          &ldquo;{englishText}&rdquo;
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 100,
            right: 100,
            height: '1px',
            display: 'flex',
            background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 30%, rgba(212, 175, 55, 0.5) 50%, rgba(212, 175, 55, 0.3) 70%, transparent 100%)',
          }}
        />

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: 'rgba(212, 175, 55, 0.5)',
              letterSpacing: '3px',
              fontWeight: 500,
            }}
          >
            aayah.one
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
