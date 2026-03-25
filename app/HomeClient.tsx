'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Bookmark as BookmarkIcon } from 'lucide-react'

import { useBookmarks } from '@/hooks/useBookmarks'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import AyahDisplay from '@/components/AyahDisplay'
import AudioPlayer from '@/components/AudioPlayer'
import Controls from '@/components/Controls'
import SearchModal from '@/components/SearchModal'
import BookmarksPanel from '@/components/BookmarksPanel'
import ReciterSelector from '@/components/ReciterSelector'
import TranslationSelector from '@/components/TranslationSelector'
import TafsirSection from '@/components/TafsirSection'
import AyahSkeleton from '@/components/Skeleton'
import Toast from '@/components/Toast'

import { usePreferences } from '@/hooks/usePreferences'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { getRandomAyahNumber, getRandomBackground } from '@/lib/utils'
import { hapticLight, hapticMedium } from '@/lib/haptics'
import { RECITERS, TOTAL_AYAHS } from '@/lib/constants'
import type { AyahData } from '@/lib/api'

interface InitialData {
  arabic: AyahData
  english: AyahData
  ayahNumber: number
}

interface HomeClientProps {
  initialData: InitialData | null
  initialBgImage: string
}

export default function HomeClient({ initialData, initialBgImage }: HomeClientProps) {
  const router = useRouter()
  const { reciter, setReciter, translation, setTranslation } = usePreferences()

  const [arabic, setArabic] = useState<AyahData | null>(initialData?.arabic ?? null)
  const [english, setEnglish] = useState<AyahData | null>(initialData?.english ?? null)
  const [audioUrl, setAudioUrl] = useState<string | undefined>(initialData?.arabic?.audio)
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bgImage, setBgImage] = useState(initialBgImage)
  const [nextBgImage, setNextBgImage] = useState<string | null>(null)
  const [bgKey, setBgKey] = useState(0)
  const [ayahNumber, setAyahNumber] = useState(initialData?.ayahNumber ?? 1)
  const { bookmarks } = useBookmarks()
  const hasBookmarks = bookmarks.length > 0
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', visible: false })

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true })
  }, [])

  // Simple crossfade: set new image on top, after it fades in, swap base
  const changeBg = useCallback((newBg: string) => {
    setNextBgImage(newBg)
    setBgKey((k) => k + 1)
  }, [])

  // On mount: if user's saved reciter/translation differs from defaults, re-fetch
  useEffect(() => {
    if (!initialData) return
    const num = initialData.ayahNumber
    const needsReciter = reciter !== 'ar.hudhaify'
    const needsTranslation = translation !== 'en.sahih'

    if (needsReciter) {
      fetch(`https://api.alquran.cloud/v1/ayah/${num}/${reciter}`)
        .then((res) => res.json())
        .then((json) => setAudioUrl(json.data.audio))
        .catch(() => {})
    }
    if (needsTranslation) {
      fetch(`https://api.alquran.cloud/v1/ayah/${num}/${translation}`)
        .then((res) => res.json())
        .then((json) => setEnglish(json.data))
        .catch(() => {})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAyah = useCallback(
    async (ref: string | number, reciterId?: string, translationId?: string) => {
      setLoading(true)
      try {
        const r = reciterId || reciter
        const t = translationId || translation
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${ref}/editions/${r},${t}`
        )
        const json = await res.json()
        const data = json.data as AyahData[]
        const ar = data.find((d) => d.edition?.language === 'ar')
        const en = data.find((d) => d.edition?.language !== 'ar') || data[1]
        if (ar) {
          setArabic(ar)
          setAudioUrl(ar.audio)
        }
        if (en) setEnglish(en)
        return { arabic: ar, english: en }
      } catch {
        // keep current data on error
      } finally {
        setLoading(false)
      }
    },
    [reciter, translation]
  )

  const handleRefresh = useCallback(() => {
    hapticLight()
    const num = getRandomAyahNumber()
    setAyahNumber(num)
    changeBg(getRandomBackground())
    fetchAyah(num)
  }, [fetchAyah, changeBg])

  const handleSearch = useCallback(
    (surah: number, ayah: number) => {
      const ref = `${surah}:${ayah}`
      setAyahNumber(0)
      fetchAyah(ref)
    },
    [fetchAyah]
  )

  const handleBookmarkSelect = useCallback(
    (reference: string) => {
      fetchAyah(reference)
    },
    [fetchAyah]
  )

  const handleNext = useCallback(() => {
    if (!arabic) return
    hapticLight()
    const next = arabic.number < TOTAL_AYAHS ? arabic.number + 1 : 1
    setAyahNumber(next)
    changeBg(getRandomBackground())
    fetchAyah(next)
  }, [arabic, fetchAyah, changeBg])

  const handlePrevious = useCallback(() => {
    if (!arabic) return
    hapticLight()
    const prev = arabic.number > 1 ? arabic.number - 1 : TOTAL_AYAHS
    setAyahNumber(prev)
    changeBg(getRandomBackground())
    fetchAyah(prev)
  }, [arabic, fetchAyah, changeBg])

  // Swipe left = next ayah, swipe right = previous ayah
  useSwipeGesture({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
  })

  const handleReciterChange = useCallback(
    (id: typeof reciter) => {
      setReciter(id)
      if (arabic) {
        fetch(`https://api.alquran.cloud/v1/ayah/${arabic.number}/${id}`)
          .then((res) => res.json())
          .then((json) => setAudioUrl(json.data.audio))
          .catch(() => {})
      }
    },
    [arabic, setReciter]
  )

  const handleTranslationChange = useCallback(
    (id: typeof translation) => {
      setTranslation(id)
      if (arabic) fetchAyah(arabic.number, reciter, id)
    },
    [arabic, reciter, setTranslation, fetchAyah]
  )

  const handleShare = useCallback(async () => {
    if (!arabic || !english) return
    const ref = `${arabic.surah.number}:${arabic.numberInSurah}`
    const text = `"${english.text}"\n\n— ${arabic.surah.englishName} ${ref}\n\n${window.location.origin}/ayah/${ref}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `Quran ${ref}`, text })
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
      } catch {}
    }
  }, [arabic, english])

  useKeyboardShortcuts({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onRandom: handleRefresh,
    onSearch: () => setShowSearch(true),
    onBookmark: () => setShowBookmarks((prev) => !prev),
  })

  const reference = arabic
    ? `${arabic.surah.number}:${arabic.numberInSurah}`
    : ''

  const reciterName =
    RECITERS.find((r) => r.id === reciter)?.name || 'Unknown'

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-3 py-4 md:p-4 overflow-hidden"
      style={{ backgroundColor: '#111827' }}
    >
      {/* Background — base layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bgImage ? `url('${bgImage}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Background — crossfade layer */}
      <AnimatePresence>
        {nextBgImage && (
          <motion.div
            key={bgKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            onAnimationComplete={() => {
              setBgImage(nextBgImage)
              setNextBgImage(null)
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${nextBgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </AnimatePresence>
      {/* Content layer — above backgrounds */}
      {/* Top bar */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowBookmarks(true)}
          className={`transition-all duration-300 ${
            hasBookmarks
              ? 'text-amber-400/80 hover:text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]'
              : 'text-white/30 hover:text-white/60'
          }`}
          title="Bookmarks"
        >
          <BookmarkIcon className={`w-5 h-5 ${hasBookmarks ? 'fill-amber-400/60' : ''}`} />
        </button>
      </div>

      {/* Main card — min-height prevents jarring resize between short/long ayahs */}
      <div className="relative z-10 glass-card w-full max-w-lg p-4 md:p-8 space-y-3 md:space-y-5 min-h-[420px] md:min-h-[480px] transition-all duration-500 ease-out">
        {/* Ayah content — crossfade, no wait mode to avoid size collapse */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <AyahSkeleton key="skeleton" />
          ) : arabic && english ? (
            <AyahDisplay
              key={arabic.number}
              arabic={arabic}
              translation={english}
              animationKey={arabic.number}
            />
          ) : (
            <AyahSkeleton key="initial-skeleton" />
          )}
        </AnimatePresence>

        {/* Tafsir + Audio + Controls — fade in after ayah */}
        <AnimatePresence>
          {!loading && arabic && english && (
            <motion.div
              key={`controls-${arabic.number}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="space-y-3 md:space-y-4"
            >
              <TafsirSection reference={arabic.number} />

              <div className="space-y-2 md:space-y-3">
                <AudioPlayer url={audioUrl} reciterName={reciterName} />
                <Controls
                  onRefresh={handleRefresh}
                  onSearch={() => setShowSearch(true)}
                  onChangeBackground={() => { hapticLight(); changeBg(getRandomBackground()) }}
                  onShare={handleShare}
                  reference={reference}
                  surahName={arabic.surah.englishName}
                  surahNameArabic={arabic.surah.name}
                  translationText={english.text}
                  arabicText={arabic.text}
                  backgroundUrl={bgImage}
                  onToast={showToast}
                />
              </div>

              {/* Selectors */}
              <div className="flex items-center gap-2 w-full">
                <ReciterSelector value={reciter} onChange={handleReciterChange} />
                <TranslationSelector value={translation} onChange={handleTranslationChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={handleSearch}
      />

      {/* Bookmarks panel */}
      <BookmarksPanel
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onSelect={handleBookmarkSelect}
      />

      {/* Swipe hint — shown briefly on first visit */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/20 flex items-center gap-1.5">
        <span>← swipe →</span>
      </div>

      {/* Keyboard hints (desktop) */}
      <div className="hidden md:flex fixed bottom-3 left-4 text-[10px] text-white/15 gap-3">
        <span>← → Navigate</span>
        <span>Space Play</span>
        <span>R Random</span>
        <span>S Search</span>
        <span>B Bookmark</span>
      </div>

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  )
}
