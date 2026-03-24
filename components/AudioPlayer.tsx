'use client'

import { useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAudio } from '@/hooks/useAudio'
import { formatTime } from '@/lib/utils'

interface AudioPlayerProps {
  url: string | undefined
  reciterName: string
}

export default function AudioPlayer({ url, reciterName }: AudioPlayerProps) {
  const { isPlaying, currentTime, duration, progress, toggle, seek, setUrl } = useAudio()

  useEffect(() => {
    if (url) setUrl(url)
  }, [url, setUrl])

  return (
    <div className="flex items-center gap-2 w-full max-w-xs mx-auto bg-white/[0.06] rounded-full px-2 py-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="p-1 shrink-0"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 text-white/70" fill="currentColor" />
        ) : (
          <Play className="w-3 h-3 text-white/70" fill="currentColor" />
        )}
      </motion.button>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(parseFloat(e.target.value))}
        className="flex-1 h-0.5"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.5) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
        }}
      />

      <span className="text-[9px] text-white/30 font-mono shrink-0 w-7 text-right">
        {formatTime(duration > 0 ? duration - currentTime : 0)}
      </span>
    </div>
  )
}
