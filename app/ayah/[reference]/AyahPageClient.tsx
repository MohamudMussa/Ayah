'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bookmark as BookmarkIcon } from 'lucide-react'
import Link from 'next/link'

import AyahDisplay from '@/components/AyahDisplay'
import AudioPlayer from '@/components/AudioPlayer'
import Controls from '@/components/Controls'
import BookmarksPanel from '@/components/BookmarksPanel'
import ReciterSelector from '@/components/ReciterSelector'
import TranslationSelector from '@/components/TranslationSelector'
import TafsirSection from '@/components/TafsirSection'

import { usePreferences } from '@/hooks/usePreferences'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { getRandomBackground, getRandomAyahNumber } from '@/lib/utils'
import { RECITERS, TOTAL_AYAHS } from '@/lib/constants'
import type { AyahData } from '@/lib/api'

interface Props {
  initialArabic: AyahData
  initialEnglish: AyahData
  reference: string
}

export default function AyahPageClient({ initialArabic, initialEnglish, reference }: Props) {
  const router = useRouter()
  const { reciter, setReciter, translation, setTranslation } = usePreferences()

  const [arabic, setArabic] = useState(initialArabic)
  const [english, setEnglish] = useState(initialEnglish)
  const [audioUrl, setAudioUrl] = useState(initialArabic.audio)
  const [bgImage, setBgImage] = useState('')
  const [showBookmarks, setShowBookmarks] = useState(false)

  useEffect(() => {
    setBgImage(getRandomBackground())
  }, [])

  useEffect(() => {
    if (reciter !== 'ar.hudhaify') {
      fetch(`https://api.alquran.cloud/v1/ayah/${reference}/${reciter}`)
        .then((res) => res.json())
        .then((json) => setAudioUrl(json.data.audio))
        .catch(() => {})
    }
    if (translation !== 'en.sahih') {
      fetch(`https://api.alquran.cloud/v1/ayah/${reference}/${translation}`)
        .then((res) => res.json())
        .then((json) => setEnglish(json.data))
        .catch(() => {})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleReciterChange = useCallback(
    (id: typeof reciter) => {
      setReciter(id)
      fetch(`https://api.alquran.cloud/v1/ayah/${arabic.number}/${id}`)
        .then((res) => res.json())
        .then((json) => setAudioUrl(json.data.audio))
        .catch(() => {})
    },
    [arabic, setReciter]
  )

  const handleTranslationChange = useCallback(
    (id: typeof translation) => {
      setTranslation(id)
      fetch(`https://api.alquran.cloud/v1/ayah/${arabic.number}/${id}`)
        .then((res) => res.json())
        .then((json) => setEnglish(json.data))
        .catch(() => {})
    },
    [arabic, setTranslation]
  )

  const handleShare = useCallback(async () => {
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

  const navigate = useCallback(
    (num: number) => {
      router.push(`/ayah/${num}`)
    },
    [router]
  )

  useKeyboardShortcuts({
    onNext: () => navigate(arabic.number < TOTAL_AYAHS ? arabic.number + 1 : 1),
    onPrevious: () => navigate(arabic.number > 1 ? arabic.number - 1 : TOTAL_AYAHS),
    onRandom: () => navigate(getRandomAyahNumber()),
  })

  const ref = `${arabic.surah.number}:${arabic.numberInSurah}`
  const reciterName = RECITERS.find((r) => r.id === reciter)?.name || 'Unknown'

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700"
      style={{
        backgroundImage: bgImage ? `url('${bgImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#111827',
      }}
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-3 px-4">
        <Link href="/" className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors text-white/60 hover:text-white" title="Home">
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setShowBookmarks(true)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors text-white/60 hover:text-white"
          title="Bookmarks"
        >
          <BookmarkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main card */}
      <div className="glass-card w-full max-w-lg p-5 md:p-8 space-y-5">
        <AyahDisplay arabic={arabic} translation={english} />

        <TafsirSection surahAyahRef={`${arabic.surah.number}:${arabic.numberInSurah}`} />

        <AudioPlayer url={audioUrl} reciterName={reciterName} />

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <ReciterSelector value={reciter} onChange={handleReciterChange} />
          <TranslationSelector value={translation} onChange={handleTranslationChange} />
        </div>

        <Controls
          onRefresh={() => navigate(getRandomAyahNumber())}
          onSearch={() => router.push('/')}
          onChangeBackground={() => setBgImage(getRandomBackground())}
          onShare={handleShare}
          reference={ref}
          surahName={arabic.surah.englishName}
          surahNameArabic={arabic.surah.name}
          translationText={english.text}
          arabicText={arabic.text}
          backgroundUrl={bgImage}
        />

      </div>

      {/* Bookmarks panel */}
      <BookmarksPanel
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onSelect={(ref) => {
          setShowBookmarks(false)
          router.push(`/ayah/${ref}`)
        }}
      />

      {/* Keyboard hints */}
      <div className="hidden md:flex fixed bottom-3 left-4 text-[10px] text-white/15 gap-3">
        <span>← → Navigate</span>
        <span>Space Play</span>
        <span>R Random</span>
      </div>
    </div>
  )
}
