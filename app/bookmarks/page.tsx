'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, BookmarkX } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'
import type { Bookmark } from '@/lib/bookmarks'

export default function BookmarksPage() {
  const { bookmarks, clear } = useBookmarks()
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-gray-900/80 border-b border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-sm font-semibold tracking-wider uppercase">Bookmarks</h1>
          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-red-400"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <BookmarkX className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No bookmarks yet</p>
            <p className="text-sm mt-1">
              Tap the bookmark icon on any ayah to save it here.
            </p>
            <Link
              href="/"
              className="mt-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/60 hover:text-white text-sm transition-colors"
            >
              Explore Ayahs
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {bookmarks.map((bookmark, i) => (
                <motion.div
                  key={bookmark.reference}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/ayah/${bookmark.reference}`}
                    className="block p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-white/40">
                            {bookmark.reference}
                          </span>
                          <span className="text-xs text-white/20">·</span>
                          <span className="text-sm text-white/60">
                            {bookmark.surahName}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 truncate group-hover:text-white/70 transition-colors">
                          {bookmark.text}...
                        </p>
                      </div>
                      <span className="font-arabic text-lg text-white/30 shrink-0">
                        {bookmark.surahNameArabic}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Clear confirmation */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">Clear all bookmarks?</h3>
              <p className="text-sm text-white/50 mb-6">
                This will permanently remove all your saved ayahs.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clear()
                    setShowConfirm(false)
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-sm transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
