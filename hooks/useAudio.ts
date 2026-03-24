'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseAudioReturn {
  isPlaying: boolean
  currentTime: number
  duration: number
  progress: number
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setUrl: (url: string) => void
}

export function useAudio(initialUrl?: string): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    if (initialUrl) audio.src = initialUrl

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const setUrl = useCallback((url: string) => {
    const audio = audioRef.current
    if (!audio) return
    const wasPlaying = !audio.paused
    audio.src = url
    audio.load()
    setCurrentTime(0)
    setDuration(0)
    if (wasPlaying) {
      audio.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (initialUrl && audioRef.current) {
      audioRef.current.src = initialUrl
      audioRef.current.load()
    }
  }, [initialUrl])

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) {
      play()
    } else {
      pause()
    }
  }, [play, pause])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return { isPlaying, currentTime, duration, progress, play, pause, toggle, seek, setUrl }
}
