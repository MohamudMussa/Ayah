import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Aayah — Discover the Quran, One Verse at a Time'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
        }}
      >
        {/* Decorative top line */}
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

        {/* Decorative bottom line */}
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

        {/* Inner frame */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: '1px solid rgba(212, 168, 83, 0.1)',
            borderRadius: 4,
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
            padding: '60px 80px',
            gap: 28,
          }}
        >
          {/* Surah label */}
          <div
            style={{
              display: 'flex',
              color: '#d4a853',
              fontSize: 16,
              letterSpacing: 6,
            }}
          >
            AR-RAHMAN
          </div>

          {/* Main quote */}
          <div
            style={{
              fontSize: 42,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: 800,
              fontStyle: 'italic',
            }}
          >
            &ldquo;So which of the favors of your Lord would you deny?&rdquo;
          </div>

          {/* Gold divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(90deg, transparent, #d4a853)',
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#d4a853',
              }}
            />
            <div
              style={{
                width: 60,
                height: 1,
                background: 'linear-gradient(270deg, transparent, #d4a853)',
              }}
            />
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255, 255, 255, 0.45)',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Discover the Quran, one verse at a time. Beautiful recitations, translations, and tafsir.
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 20,
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
