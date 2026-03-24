'use client'

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkButtonProps {
  reference: string
  surahName: string
  surahNameArabic: string
  translationText: string
}

export default function BookmarkButton({
  reference,
  surahName,
  surahNameArabic,
  translationText,
}: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks()
  const saved = isBookmarked(reference)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        toggle({
          reference,
          surahName,
          surahNameArabic,
          text: translationText.substring(0, 100),
          timestamp: Date.now(),
        })
      }
      className="control-btn"
      aria-label={saved ? 'Remove bookmark' : 'Bookmark (B)'}
      title={saved ? 'Remove bookmark' : 'Bookmark (B)'}
    >
      <motion.div
        animate={saved ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bookmark
          className="w-4 h-4"
          fill={saved ? 'currentColor' : 'none'}
        />
      </motion.div>
    </motion.button>
  )
}
