'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, BookmarkX, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarksPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (reference: string) => void
}

function BookmarksPanelContent({ isOpen, onClose, onSelect }: BookmarksPanelProps) {
  const { bookmarks, clear, refresh } = useBookmarks()
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (isOpen) refresh()
  }, [isOpen, refresh])

  const handleSelect = (reference: string) => {
    onSelect(reference)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — inline styles to avoid stacking context issues */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 9990,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 9991,
              width: '100%',
              maxWidth: '24rem',
            }}
          >
            <div className="h-full flex flex-col glass-card rounded-none rounded-l-2xl border-r-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h2 className="text-sm font-semibold tracking-wider uppercase text-white/70">
                  Bookmarks
                </h2>
                <div className="flex items-center gap-2">
                  {bookmarks.length > 0 && (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/30 hover:text-red-400"
                      title="Clear all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-3">
                {bookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/25">
                    <BookmarkX className="w-10 h-10 mb-3" />
                    <p className="text-sm font-medium">No bookmarks yet</p>
                    <p className="text-xs mt-1 text-white/20">
                      Tap the bookmark icon to save ayahs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark, i) => (
                      <motion.button
                        key={bookmark.reference}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleSelect(bookmark.reference)}
                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-white/35">
                                {bookmark.reference}
                              </span>
                              <span className="text-[10px] text-white/15">·</span>
                              <span className="text-xs text-white/50">
                                {bookmark.surahName}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 truncate group-hover:text-white/60 transition-colors">
                              {bookmark.text}...
                            </p>
                          </div>
                          <span className="font-arabic text-base text-white/25 shrink-0">
                            {bookmark.surahNameArabic}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear confirmation */}
              <AnimatePresence>
                {showConfirm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/95 border-t border-white/10 rounded-bl-2xl"
                  >
                    <p className="text-sm text-white/70 mb-3">Clear all bookmarks?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs transition-colors text-white/60"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          clear()
                          setShowConfirm(false)
                        }}
                        className="flex-1 py-2 rounded-lg bg-red-500/70 hover:bg-red-500 text-xs transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function BookmarksPanel(props: BookmarksPanelProps) {
  if (typeof window === 'undefined') return null
  return createPortal(<BookmarksPanelContent {...props} />, document.body)
}
