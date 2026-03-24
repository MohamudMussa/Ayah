import { TOTAL_AYAHS, BACKGROUNDS } from './constants'

export function getRandomAyahNumber(): number {
  return Math.floor(Math.random() * TOTAL_AYAHS) + 1
}

export function getRandomBackground(): string {
  return `/backgrounds/${BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]}`
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function parseReference(reference: string): { surah: number; ayah: number } | null {
  const match = reference.match(/^(\d+):(\d+)$/)
  if (!match) return null
  return { surah: parseInt(match[1]), ayah: parseInt(match[2]) }
}
