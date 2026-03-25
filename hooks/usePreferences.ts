'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ReciterId, TranslationId } from '@/lib/constants'

function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) setValue(JSON.parse(stored))
    } catch {}
  }, [key])

  const setAndStore = useCallback(
    (newValue: T) => {
      setValue(newValue)
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch {}
    },
    [key]
  )

  return [value, setAndStore]
}

export function usePreferences() {
  const [reciter, setReciter] = useLocalStorage<ReciterId>('ayah-reciter', 'ar.hudhaify')
  const [translation, setTranslation] = useLocalStorage<TranslationId>('ayah-translation', 'en.sahih')

  return { reciter, setReciter, translation, setTranslation }
}
