'use client'

import { useRef, useEffect, useCallback } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  threshold?: number
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  threshold = 60,
}: SwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchEnd.current = null
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const dx = touchStart.current.x - touchEnd.current.x
    const dy = touchStart.current.y - touchEnd.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // Only trigger if horizontal swipe is dominant
    if (absDx > absDy && absDx > threshold) {
      if (dx > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    // Vertical swipe up
    if (absDy > absDx && dy > threshold) {
      onSwipeUp?.()
    }

    touchStart.current = null
    touchEnd.current = null
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, threshold])

  useEffect(() => {
    const el = document.body
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])
}
