'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Bookmark as BookmarkIcon } from 'lucide-react'

import AyahDisplay from '@/components/AyahDisplay'
import AudioPlayer from '@/components/AudioPlayer'
import Controls from '@/components/Controls'
import SearchModal from '@/components/SearchModal'
import BookmarksPanel from '@/components/BookmarksPanel'
import ReciterSelector from '@/components/ReciterSelector'
import TranslationSelector from '@/components/TranslationSelector'
import TafsirSection from '@/components/TafsirSection'
import AyahSkeleton from '@/components/Skeleton'

import { usePreferences } from '@/hooks/usePreferences'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { getRandomAyahNumber, getRandomBackground } from '@/lib/utils'
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
  const [ayahNumber, setAyahNumber] = useState(initialData?.ayahNumber ?? 1)

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
    const num = getRandomAyahNumber()
    setAyahNumber(num)
    setBgImage(getRandomBackground())
    fetchAyah(num)
  }, [fetchAyah])

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
    const next = arabic.number < TOTAL_AYAHS ? arabic.number + 1 : 1
    setAyahNumber(next)
    fetchAyah(next)
  }, [arabic, fetchAyah])

  const handlePrevious = useCallback(() => {
    if (!arabic) return
    const prev = arabic.number > 1 ? arabic.number - 1 : TOTAL_AYAHS
    setAyahNumber(prev)
    fetchAyah(prev)
  }, [arabic, fetchAyah])

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
    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-3 py-4 md:p-4 transition-all duration-700"
      style={{
        backgroundImage: bgImage ? `url('${bgImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#111827',
      }}
    >
      {/* Top bar */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowBookmarks(true)}
          className="text-white/30 hover:text-white/60 transition-colors"
          title="Bookmarks"
        >
          <BookmarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main card */}
      <div className="glass-card w-full max-w-lg p-4 md:p-8 space-y-3 md:space-y-5">
        {/* Ayah content */}
        <AnimatePresence mode="wait">
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

        {/* Tafsir */}
        {arabic && !loading && (
          <TafsirSection reference={arabic.number} />
        )}

        {/* Audio + Controls inline */}
        {!loading && arabic && english && (
          <div className="space-y-2 md:space-y-3">
            <AudioPlayer url={audioUrl} reciterName={reciterName} />
            <Controls
              onRefresh={handleRefresh}
              onSearch={() => setShowSearch(true)}
              onChangeBackground={() => setBgImage(getRandomBackground())}
              onShare={handleShare}
              reference={reference}
              surahName={arabic.surah.englishName}
              surahNameArabic={arabic.surah.name}
              translationText={english.text}
              arabicText={arabic.text}
              backgroundUrl={bgImage}
            />
          </div>
        )}

        {/* Selectors */}
        <div className="flex items-center justify-center gap-1.5 w-full">
          <ReciterSelector value={reciter} onChange={handleReciterChange} />
          <span className="text-white/15 text-[8px] shrink-0">•</span>
          <TranslationSelector value={translation} onChange={handleTranslationChange} />
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

      {/* Keyboard hints (desktop) */}
      <div className="hidden md:flex fixed bottom-3 left-4 text-[10px] text-white/15 gap-3">
        <span>← → Navigate</span>
        <span>Space Play</span>
        <span>R Random</span>
        <span>S Search</span>
        <span>B Bookmark</span>
      </div>
    </div>
  )
}
