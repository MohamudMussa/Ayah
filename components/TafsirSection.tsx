'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'

interface TafsirSectionProps {
  reference: string | number
}

export default function TafsirSection({ reference }: TafsirSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tafsir, setTafsir] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadTafsir = async () => {
    if (tafsir) {
      setIsOpen(!isOpen)
      return
    }
    setLoading(true)
    setIsOpen(true)
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${reference}/en.maududi`
      )
      const json = await res.json()
      setTafsir(json.data.text)
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
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="text-sm text-white/60 leading-relaxed">
                  <p className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider">
                    Tafsir Maududi
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
