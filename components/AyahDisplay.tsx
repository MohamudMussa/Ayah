'use client'

import { motion } from 'framer-motion'
import type { AyahData } from '@/lib/api'

interface AyahDisplayProps {
  arabic: AyahData
  translation: AyahData
  animationKey?: string | number
}

export default function AyahDisplay({ arabic, translation, animationKey }: AyahDisplayProps) {
  const surah = arabic.surah

  return (
    <motion.div
      key={animationKey}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2 md:gap-4 text-center text-white"
    >
      {/* Surah info */}
      <div className="space-y-0.5">
        <p className="text-[10px] md:text-[11px] font-medium tracking-wider text-white/40 uppercase">
          {surah.englishName} — {surah.englishNameTranslation}
        </p>
      </div>

      {/* Arabic text */}
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
        {arabic.text}
      </h2>

      {/* Translation */}
      <p className="text-[12px] md:text-sm leading-relaxed text-white/55 max-w-md">
        {translation.text}
      </p>

      {/* Divider + reference */}
      <div className="flex items-center gap-2 text-white/25">
        <div className="w-6 h-px bg-white/15" />
        <span className="text-[10px] font-mono">
          {surah.number}:{arabic.numberInSurah}
        </span>
        <div className="w-6 h-px bg-white/15" />
      </div>
    </motion.div>
  )
}
