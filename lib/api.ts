import { API_BASE } from './constants'

export interface SurahInfo {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface AyahData {
  number: number
  text: string
  numberInSurah: number
  juz: number
  page: number
  surah: SurahInfo
  audio?: string
  edition?: {
    identifier: string
    language: string
    name: string
    englishName: string
    format: string
    type: string
  }
}

export interface AyahResponse {
  code: number
  status: string
  data: AyahData | AyahData[]
}

export interface SurahListResponse {
  code: number
  status: string
  data: SurahInfo[]
}

export async function getAyah(
  reference: string | number,
  editions: string[]
): Promise<AyahData[]> {
  const editionString = editions.join(',')
  const res = await fetch(
    `${API_BASE}/ayah/${reference}/editions/${editionString}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error(`Failed to fetch ayah: ${res.status}`)
  const json: AyahResponse = await res.json()
  return Array.isArray(json.data) ? json.data : [json.data]
}

export async function getAyahSingle(
  reference: string | number,
  edition: string
): Promise<AyahData> {
  const res = await fetch(
    `${API_BASE}/ayah/${reference}/${edition}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error(`Failed to fetch ayah: ${res.status}`)
  const json = await res.json()
  return json.data
}

export async function getSurahs(): Promise<SurahInfo[]> {
  const res = await fetch(`${API_BASE}/surah`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error('Failed to fetch surahs')
  const json: SurahListResponse = await res.json()
  return json.data
}

export async function getTafsir(
  reference: string | number,
  edition: string = 'en.maududi'
): Promise<AyahData> {
  const res = await fetch(`${API_BASE}/ayah/${reference}/${edition}`, {
    next: { revalidate: 86400 },
  })
  if (!res.ok) throw new Error('Failed to fetch tafsir')
  const json = await res.json()
  return json.data
}
