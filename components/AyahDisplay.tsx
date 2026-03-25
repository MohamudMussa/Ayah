'use client'

import { motion } from 'framer-motion'
import type { AyahData } from '@/lib/api'

interface AyahDisplayProps {
  arabic: AyahData
  translation: AyahData
  animationKey?: string | number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 8, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function AyahDisplay({ arabic, translation, animationKey }: AyahDisplayProps) {
  const surah = arabic.surah

  return (
    <motion.div
      key={animationKey}
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col items-center gap-2 md:gap-4 text-center text-white"
    >
      {/* Surah info */}
      <motion.div variants={item} className="space-y-0.5">
        <p className="text-[10px] md:text-[11px] font-medium tracking-wider text-white/40 uppercase">
          {surah.englishName} — {surah.englishNameTranslation}
        </p>
      </motion.div>

      {/* Arabic text */}
      <motion.h2
        variants={item}
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
      </motion.h2>

      {/* Translation */}
      <motion.p variants={item} className="text-[12px] md:text-sm leading-relaxed text-white/55 max-w-md">
        {translation.text}
      </motion.p>

      {/* Divider + reference */}
      <motion.div variants={item} className="flex items-center gap-2 text-white/25">
        <div className="w-6 h-px bg-white/15" />
        <span className="text-[10px] font-mono">
          {surah.number}:{arabic.numberInSurah}
        </span>
        <div className="w-6 h-px bg-white/15" />
      </motion.div>
    </motion.div>
  )
}
