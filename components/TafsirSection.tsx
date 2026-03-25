'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'

interface TafsirSectionProps {
  /** Surah:Ayah reference like "2:255" */
  surahAyahRef: string
}

export default function TafsirSection({ surahAyahRef }: TafsirSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tafsir, setTafsir] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const lastRef = useRef<string>('')

  // Clear tafsir when ayah changes
  useEffect(() => {
    if (surahAyahRef !== lastRef.current) {
      lastRef.current = surahAyahRef
      setTafsir(null)
      setIsOpen(false)
    }
  }, [surahAyahRef])

  const loadTafsir = async () => {
    if (tafsir) {
      setIsOpen(!isOpen)
      return
    }
    setLoading(true)
    setIsOpen(true)
    try {
      // Use Quran.com API for Ibn Kathir (Abridged) English tafsir
      const res = await fetch(
        `https://api.quran.com/api/v4/tafsirs/169/by_ayah/${surahAyahRef}`
      )
      const json = await res.json()
      const rawHtml = json.tafsir?.text || ''
      // Strip HTML tags for clean text display
      const text = rawHtml
        .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '') // remove headings
        .replace(/<[^>]+>/g, ' ') // strip remaining tags
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()

      if (text) {
        setTafsir(text)
      } else {
        setTafsir('No tafsir available for this ayah.')
      }
    } catch {
      setTafsir('Unable to load tafsir. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={loadTafsir}
        className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors mx-auto"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>{isOpen ? 'Hide' : 'View'} Tafsir</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="text-xs md:text-sm text-white/60 leading-relaxed">
                  <p className="text-[10px] md:text-xs text-white/30 mb-1.5 font-medium uppercase tracking-wider">
                    Tafsir Ibn Kathir
                  </p>
                  {tafsir}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
