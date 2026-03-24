'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getBookmarks,
  toggleBookmark as toggleBM,
  isBookmarked as checkBookmarked,
  clearBookmarks as clearBM,
  type Bookmark,
} from '@/lib/bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks())
  }, [])

  const refresh = useCallback(() => {
    setBookmarks(getBookmarks())
  }, [])

  const toggle = useCallback((bookmark: Bookmark) => {
    const updated = toggleBM(bookmark)
    setBookmarks(updated)
  }, [])

  const isBookmarked = useCallback(
    (reference: string) => checkBookmarked(reference),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookmarks]
  )

  const clear = useCallback(() => {
    clearBM()
    setBookmarks([])
  }, [])

  return { bookmarks, toggle, isBookmarked, clear, refresh }
}
