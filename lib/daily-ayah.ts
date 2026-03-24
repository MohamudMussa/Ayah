import { TOTAL_AYAHS } from './constants'

export function getDailyAyahNumber(): number {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % TOTAL_AYAHS) + 1
}
