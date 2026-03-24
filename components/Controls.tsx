'use client'

import { motion } from 'framer-motion'
import {
  RefreshCw,
  Search,
  Image as ImageIcon,
  Share2,
  Link2,
} from 'lucide-react'
import BookmarkButton from './BookmarkButton'

interface ControlsProps {
  onRefresh: () => void
  onSearch: () => void
  onChangeBackground: () => void
  onShare: () => void
  reference: string
  surahName: string
  surahNameArabic: string
  translationText: string
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="control-btn"
      aria-label={label}
      title={label}
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
}: ControlsProps) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/ayah/${reference}`)
    } catch {}
  }

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2">
      <ControlButton onClick={onRefresh} label="Random Ayah (R)">
        <RefreshCw className="w-4 h-4" />
      </ControlButton>

      <ControlButton onClick={onSearch} label="Search (S)">
        <Search className="w-4 h-4" />
      </ControlButton>

      <BookmarkButton
        reference={reference}
        surahName={surahName}
        surahNameArabic={surahNameArabic}
        translationText={translationText}
      />

      <ControlButton onClick={copyLink} label="Copy Link">
        <Link2 className="w-4 h-4" />
      </ControlButton>

      <ControlButton onClick={onShare} label="Share">
        <Share2 className="w-4 h-4" />
      </ControlButton>

      <ControlButton onClick={onChangeBackground} label="Change Background">
        <ImageIcon className="w-4 h-4" />
      </ControlButton>
    </div>
  )
}
