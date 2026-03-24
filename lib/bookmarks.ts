export interface Bookmark {
  reference: string
  surahName: string
  surahNameArabic: string
  text: string
  timestamp: number
}

const STORAGE_KEY = 'ayah-bookmarks'

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

export function toggleBookmark(bookmark: Bookmark): Bookmark[] {
  const existing = getBookmarks()
  const index = existing.findIndex((b) => b.reference === bookmark.reference)
  if (index >= 0) {
    existing.splice(index, 1)
  } else {
    existing.unshift(bookmark)
  }
  saveBookmarks(existing)
  return existing
}

export function isBookmarked(reference: string): boolean {
  return getBookmarks().some((b) => b.reference === reference)
}

export function removeBookmark(reference: string): Bookmark[] {
  const existing = getBookmarks().filter((b) => b.reference !== reference)
  saveBookmarks(existing)
  return existing
}

export function clearBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY)
}
