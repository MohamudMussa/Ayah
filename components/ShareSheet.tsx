'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Square, Monitor, Copy, Loader2, Check } from 'lucide-react'
import { renderAyahImage, shareAyahImage, copyImageToClipboard, type ShareFormat } from '@/lib/share-image'
import { hapticMedium, hapticSuccess } from '@/lib/haptics'
import { recordShare } from './StatsDisplay'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  arabicText: string
  translationText: string
  surahName: string
  reference: string
  backgroundUrl: string
  onToast?: (message: string, type?: 'success' | 'error') => void
}

const formats: { id: ShareFormat; label: string; desc: string; icon: typeof Smartphone }[] = [
  { id: 'story', label: 'Story', desc: 'Instagram / WhatsApp Status', icon: Smartphone },
  { id: 'square', label: 'Square', desc: 'Instagram Feed / Twitter', icon: Square },
  { id: 'landscape', label: 'Wide', desc: 'Facebook / Desktop', icon: Monitor },
]

export default function ShareSheet({
  isOpen,
  onClose,
  arabicText,
  translationText,
  surahName,
  reference,
  backgroundUrl,
  onToast,
}: ShareSheetProps) {
  const [generating, setGenerating] = useState<ShareFormat | null>(null)
  const [copied, setCopied] = useState(false)

  const handleShare = async (format: ShareFormat) => {
    hapticMedium()
    setGenerating(format)
    try {
      const blob = await renderAyahImage({
        arabicText,
        translationText,
        surahName,
        reference,
        backgroundUrl,
        format,
      })
      await shareAyahImage(blob, reference)
      hapticSuccess()
      recordShare()
      onToast?.('Image shared!', 'success')
      onClose()
    } catch {
      onToast?.('Share cancelled', 'error')
    } finally {
      setGenerating(null)
    }
  }

  const handleCopyImage = async () => {
    hapticMedium()
    setGenerating('story')
    try {
      const blob = await renderAyahImage({
        arabicText,
        translationText,
        surahName,
        reference,
        backgroundUrl,
        format: 'story',
      })
      const success = await copyImageToClipboard(blob)
      if (success) {
        setCopied(true)
        hapticSuccess()
        onToast?.('Image copied to clipboard!', 'success')
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback: download
        await shareAyahImage(blob, reference)
        onToast?.('Image downloaded!', 'success')
      }
      onClose()
    } catch {
      onToast?.('Failed to copy', 'error')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl rounded-t-2xl border-t border-white/10 p-5 pb-8"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/80 text-sm font-medium">Share Ayah</h3>
              <button onClick={onClose} className="text-white/40 hover:text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Format options */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {formats.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleShare(id)}
                  disabled={generating !== null}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {generating === id ? (
                    <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-white/60" />
                  )}
                  <span className="text-white/80 text-xs font-medium">{label}</span>
                  <span className="text-white/30 text-[9px] leading-tight text-center">{desc}</span>
                </button>
              ))}
            </div>

            {/* Copy to clipboard */}
            <button
              onClick={handleCopyImage}
              disabled={generating !== null}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 text-xs disabled:opacity-50"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy image to clipboard'}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
