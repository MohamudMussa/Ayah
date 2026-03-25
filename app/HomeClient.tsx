'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
import StatsDisplay from '@/components/StatsDisplay'

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
  // Two-slot crossfade: slot A and B alternate, CSS opacity handles the transition
  const [bgSlots, setBgSlots] = useState<[string, string]>([initialBgImage, initialBgImage])
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0)
  const [ayahNumber, setAyahNumber] = useState(initialData?.ayahNumber ?? 1)
  const { bookmarks } = useBookmarks()
  const hasBookmarks = bookmarks.length > 0
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', visible: false })

  // Background preloading pool — always have 2 ready
  const preloadPool = useRef<string[]>([])
  const preloadImages = useCallback(() => {
    while (preloadPool.current.length < 3) {
      const url = getRandomBackground()
      preloadPool.current.push(url)
      const img = new window.Image()
      img.src = url // browser caches it
    }
  }, [])
  useEffect(() => { preloadImages() }, [preloadImages])
  const getPreloadedBg = useCallback(() => {
    const bg = preloadPool.current.shift() || getRandomBackground()
    preloadImages() // refill pool
    return bg
  }, [preloadImages])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true })
  }, [])

  // Crossfade: load new image into inactive slot, then swap active
  const changeBg = useCallback((newBg: string) => {
    const inactiveSlot = activeSlot === 0 ? 1 : 0
    setBgSlots((prev) => {
      const next = [...prev] as [string, string]
      next[inactiveSlot] = newBg
      return next
    })
    // Small delay so the inactive slot has the new image before we fade to it
    requestAnimationFrame(() => {
      setActiveSlot(inactiveSlot as 0 | 1)
    })
  }, [activeSlot])

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
    changeBg(getPreloadedBg())
    fetchAyah(num)
  }, [fetchAyah, changeBg, getPreloadedBg])

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
    fetchAyah(next)
  }, [arabic, fetchAyah])

  const handlePrevious = useCallback(() => {
    if (!arabic) return
    hapticLight()
    const prev = arabic.number > 1 ? arabic.number - 1 : TOTAL_AYAHS
    setAyahNumber(prev)
    fetchAyah(prev)
  }, [arabic, fetchAyah])

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
      {/* Background — two permanent layers, CSS opacity crossfade */}
      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
        style={{
          backgroundImage: `url('${bgSlots[0]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: activeSlot === 0 ? 1 : 0,
          zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
        style={{
          backgroundImage: `url('${bgSlots[1]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: activeSlot === 1 ? 1 : 0,
          zIndex: 1,
        }}
      />
      {/* Content layer — above backgrounds */}
      {/* Stats (top-left, subtle) */}
      <StatsDisplay />

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
        {/* Ayah content */}
        <div className="min-h-[200px]">
          {arabic && english ? (
            <AyahDisplay
              arabic={arabic}
              translation={english}
              animationKey={arabic.number}
            />
          ) : (
            <AyahSkeleton />
          )}
        </div>

        {/* Tafsir + Audio + Controls */}
        <div
          className="space-y-3 md:space-y-4 transition-opacity duration-300 ease-out"
          style={{ opacity: !arabic || !english ? 0 : 1 }}
        >
          {arabic && (
            <TafsirSection surahAyahRef={reference} />
          )}

          <div className="space-y-2 md:space-y-3">
            <AudioPlayer url={audioUrl} reciterName={reciterName} />
            {arabic && english && (
              <Controls
                onRefresh={handleRefresh}
                onSearch={() => setShowSearch(true)}
                onChangeBackground={() => { hapticLight(); changeBg(getPreloadedBg()) }}
                onShare={handleShare}
                reference={reference}
                surahName={arabic.surah.englishName}
                surahNameArabic={arabic.surah.name}
                translationText={english.text}
                arabicText={arabic.text}
                backgroundUrl={bgSlots[activeSlot]}
                onToast={showToast}
              />
            )}
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-2 w-full">
            <ReciterSelector value={reciter} onChange={handleReciterChange} />
            <TranslationSelector value={translation} onChange={handleTranslationChange} />
          </div>
        </div>

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
