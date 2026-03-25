'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Search,
  Image as ImageIcon,
  Share,
  Loader2,
} from 'lucide-react'
import BookmarkButton from './BookmarkButton'
import ShareSheet from './ShareSheet'
import { renderAyahImage, shareAyahImage } from '@/lib/share-image'
import { hapticMedium, hapticSuccess } from '@/lib/haptics'
import { recordShare } from './StatsDisplay'

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
  onToast?: (message: string, type?: 'success' | 'error') => void
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
  onToast,
}: ControlsProps) {
  const [showShareSheet, setShowShareSheet] = useState(false)
  const [quickSharing, setQuickSharing] = useState(false)
  const [shareCount, setShareCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.shares > 0) setShareCount(d.shares) })
      .catch(() => {})
  }, [])

  // Quick share: generates story format and shares immediately
  const handleQuickShare = async () => {
    hapticMedium()
    setQuickSharing(true)
    try {
      const blob = await renderAyahImage({
        arabicText,
        translationText,
        surahName,
        reference,
        backgroundUrl,
        format: 'story',
      })
      await shareAyahImage(blob, reference)
      hapticSuccess()
      recordShare()
      setShareCount(prev => (prev ?? 0) + 1)
      onToast?.('Image ready to share!', 'success')
    } catch {
      onShare()
      onToast?.('Shared as text', 'success')
    } finally {
      setQuickSharing(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        {/* Share button — prominent, recognizable */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleQuickShare}
          onContextMenu={(e) => {
            e.preventDefault()
            setShowShareSheet(true)
          }}
          disabled={quickSharing}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white/90 transition-all text-xs font-medium"
          aria-label="Share"
        >
          {quickSharing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Share className="w-3.5 h-3.5" />
          )}
          Share
        </motion.button>

        {/* Social proof + change format */}
        <div className="flex items-center gap-0 text-[10px] text-white/25">
          {shareCount ? (
            <span className="flex items-center gap-1">
              {shareCount >= 1000 ? `${(shareCount/1000).toFixed(1)}K` : shareCount} Shared
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
          ) : null}
          {shareCount ? (
            <span className="mx-1.5 text-white/15">|</span>
          ) : null}
          <button
            onClick={() => setShowShareSheet(true)}
            className="text-white/25 hover:text-white/40 transition-colors"
          >
            Change Format
          </button>
        </div>

        {/* Other controls */}
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

          <ControlButton onClick={onChangeBackground} label="Change Background">
            <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </ControlButton>
        </div>
      </div>

      {/* Share format sheet */}
      <ShareSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        arabicText={arabicText}
        translationText={translationText}
        surahName={surahName}
        reference={reference}
        backgroundUrl={backgroundUrl}
        onToast={onToast}
      />
    </>
  )
}
