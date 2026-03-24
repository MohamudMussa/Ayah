'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Search,
  Image as ImageIcon,
  Share2,
  Link2,
  Download,
  Loader2,
} from 'lucide-react'
import BookmarkButton from './BookmarkButton'
import { renderAyahImage, shareAyahImage } from '@/lib/share-image'

interface ControlsProps {
  onRefresh: () => void
  onSearch: () => void
  onChangeBackground: () => void
  onShare: () => void
  reference: string
  surahName: string
  surahNameArabic: string
  translationText: string
  arabicText: string
  backgroundUrl: string
}

function ControlButton({
  onClick,
  label,
  children,
  disabled,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="control-btn"
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

export default function Controls({
  onRefresh,
  onSearch,
  onChangeBackground,
  onShare,
  reference,
  surahName,
  surahNameArabic,
  translationText,
  arabicText,
  backgroundUrl,
}: ControlsProps) {
  const [sharing, setSharing] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/ayah/${reference}`)
    } catch {}
  }

  const handleShareImage = async () => {
    setSharing(true)
    try {
      const blob = await renderAyahImage({
        arabicText,
        translationText,
        surahName,
        reference,
        backgroundUrl,
      })
      await shareAyahImage(blob, reference)
    } catch {
      // Fallback to text share
      onShare()
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2">
      <ControlButton onClick={onRefresh} label="Random Ayah (R)">
        <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </ControlButton>

      <ControlButton onClick={onSearch} label="Search (S)">
        <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </ControlButton>

      <BookmarkButton
        reference={reference}
        surahName={surahName}
        surahNameArabic={surahNameArabic}
        translationText={translationText}
      />

      <ControlButton onClick={copyLink} label="Copy Link">
        <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </ControlButton>

      <ControlButton onClick={handleShareImage} label="Share Image" disabled={sharing}>
        {sharing ? (
          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
        ) : (
          <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
        )}
      </ControlButton>

      <ControlButton onClick={onChangeBackground} label="Change Background">
        <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </ControlButton>
    </div>
  )
}
