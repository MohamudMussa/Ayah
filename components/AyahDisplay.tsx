'use client'

import { useEffect, useState } from 'react'
import type { AyahData } from '@/lib/api'

interface AyahDisplayProps {
  arabic: AyahData
  translation: AyahData
  animationKey?: string | number
}

export default function AyahDisplay({ arabic, translation, animationKey }: AyahDisplayProps) {
  const surah = arabic.surah
  const arabicWords = arabic.text.split(' ')
  const [visible, setVisible] = useState(false)

  // Trigger entrance animation after mount
  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(t)
  }, [animationKey])

  return (
    <div
      className="flex flex-col items-center gap-2 md:gap-4 text-center text-white transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
    >
      {/* Surah info */}
      <div className="space-y-0.5">
        <p className="text-[10px] md:text-[11px] font-medium tracking-wider text-white/40 uppercase">
          {surah.englishName} — {surah.englishNameTranslation}
        </p>
      </div>

      {/* Arabic text — word by word stagger */}
      <h2
        className="font-arabic text-lg md:text-2xl text-white/95"
        dir="rtl"
        lang="ar"
        style={{
          lineHeight: 2,
          wordSpacing: '0.05em',
          fontFeatureSettings: '"liga" 1, "calt" 1',
        }}
      >
        {arabicWords.map((word, i) => (
          <span
            key={`${animationKey}-${i}`}
            className="inline-block transition-all ease-out"
            style={{
              opacity: visible ? 1 : 0,
              filter: visible ? 'blur(0px)' : 'blur(6px)',
              transitionDuration: '450ms',
              transitionDelay: visible ? `${200 + i * 40}ms` : '0ms',
            }}
          >
            {word}{i < arabicWords.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </h2>

      {/* Translation */}
      <p
        className="text-[12px] md:text-sm leading-relaxed text-white/55 max-w-md transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transitionDelay: visible ? '400ms' : '0ms',
        }}
      >
        {translation.text}
      </p>

      {/* Divider + reference */}
      <div
        className="flex items-center gap-2 text-white/25 transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: visible ? '500ms' : '0ms',
        }}
      >
        <div className="w-6 h-px bg-white/15" />
        <span className="text-[10px] font-mono">
          {surah.number}:{arabic.numberInSurah}
        </span>
        <div className="w-6 h-px bg-white/15" />
      </div>
    </div>
  )
}
