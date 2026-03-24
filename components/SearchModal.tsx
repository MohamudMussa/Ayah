'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { getSurahs, type SurahInfo } from '@/lib/api'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (surah: number, ayah: number) => void
}

export default function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [surahs, setSurahs] = useState<SurahInfo[]>([])
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [selectedAyah, setSelectedAyah] = useState(1)
  const [maxAyahs, setMaxAyahs] = useState(7)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && surahs.length === 0) {
      fetch('https://api.alquran.cloud/v1/surah')
        .then((res) => res.json())
        .then((json) => setSurahs(json.data))
        .catch(() => {})
    }
  }, [isOpen, surahs.length])

  useEffect(() => {
    const surah = surahs.find((s) => s.number === selectedSurah)
    if (surah) {
      setMaxAyahs(surah.numberOfAyahs)
      setSelectedAyah(1)
    }
  }, [selectedSurah, surahs])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    onSelect(selectedSurah, selectedAyah)
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="glass-card-light w-full max-w-md p-6 text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Aayah" className="w-8 h-8 rounded-full" />
                <h3 className="text-lg font-semibold">Search for an Ayah</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Select Surah
                </label>
                <select
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-white/10 border border-white/10 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
                >
                  {surahs.map((surah) => (
                    <option
                      key={surah.number}
                      value={surah.number}
                      className="bg-gray-800 text-white"
                    >
                      {surah.number}. {surah.englishName} — {surah.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Ayah Number
                </label>
                <select
                  value={selectedAyah}
                  onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
                  className="w-full rounded-xl bg-white/10 border border-white/10 py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
                >
                  {Array.from({ length: maxAyahs }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num} className="bg-gray-800 text-white">
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Go to Ayah
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
