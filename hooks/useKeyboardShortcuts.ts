'use client'

import { useEffect } from 'react'

interface ShortcutHandlers {
  onNext?: () => void
  onPrevious?: () => void
  onTogglePlay?: () => void
  onRandom?: () => void
  onBookmark?: () => void
  onSearch?: () => void
  onToggleTheme?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          handlers.onNext?.()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlers.onPrevious?.()
          break
        case ' ':
          e.preventDefault()
          handlers.onTogglePlay?.()
          break
        case 'r':
        case 'R':
          handlers.onRandom?.()
          break
        case 'b':
        case 'B':
          handlers.onBookmark?.()
          break
        case 's':
        case 'S':
          handlers.onSearch?.()
          break
        case 't':
        case 'T':
          handlers.onToggleTheme?.()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}
