import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
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
  }
  edition?: { identifier: string }
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
    const arabic = data.find((d: AyahEdition) => d.edition?.identifier === 'quran-uthmani')
    const english = data.find((d: AyahEdition) => d.edition?.identifier === 'en.sahih')
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
  const decodedRef = decodeURIComponent(params.reference)
  const result = await fetchAyah(decodedRef)

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
            color: '#d4a853',
            fontSize: 48,
            letterSpacing: 6,
            fontFamily: 'sans-serif',
          }}
        >
          AAYAH.ONE
        </div>
      ),
      { ...size }
    )
  }

  const { arabic, english } = result
  const surahName = arabic.surah.englishName
  const surahTranslation = arabic.surah.englishNameTranslation
  const ref = `${arabic.surah.number}:${arabic.numberInSurah}`
  const englishText = truncate(english.text, 220)

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
          background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
          }}
        />

        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
          }}
        />

        {/* Outer frame */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            bottom: 16,
            border: '1px solid rgba(212, 168, 83, 0.2)',
            borderRadius: 8,
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px 80px',
            gap: 20,
          }}
        >
          {/* Surah label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#d4a853',
              fontSize: 16,
              letterSpacing: 5,
            }}
          >
            {`${surahName.toUpperCase()} \u2014 ${surahTranslation.toUpperCase()}`}
          </div>

          {/* Reference */}
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: 3,
              fontFamily: 'monospace',
            }}
          >
            {`AYAH ${ref}`}
          </div>

          {/* Gold divider top */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a853)' }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#d4a853' }} />
            <div style={{ width: 40, height: 1, background: 'linear-gradient(270deg, transparent, #d4a853)' }} />
          </div>

          {/* Translation — the main content */}
          <div
            style={{
              fontSize: englishText.length > 160 ? 26 : englishText.length > 100 ? 30 : 36,
              color: 'rgba(255, 255, 255, 0.85)',
              textAlign: 'center',
              lineHeight: 1.6,
              maxWidth: 900,
              fontStyle: 'italic',
            }}
          >
            {`\u201C${englishText}\u201D`}
          </div>

          {/* Gold divider bottom */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, #d4a853)' }} />
            <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#d4a853' }} />
            <div style={{ width: 40, height: 1, background: 'linear-gradient(270deg, transparent, #d4a853)' }} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.3)',
              textAlign: 'center',
            }}
          >
            Discover the Quran, one verse at a time
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            display: 'flex',
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: '#d4a853',
              letterSpacing: 4,
              fontWeight: 600,
            }}
          >
            AAYAH.ONE
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
