import { getAyah } from '@/lib/api'
import { getRandomAyahNumber, getRandomBackground } from '@/lib/utils'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const dailyNumber = getRandomAyahNumber()
  const bgImage = getRandomBackground()

  let initialData = null
  try {
    const editions = await getAyah(dailyNumber, ['ar.hudhaify', 'en.sahih'])
    const arabic = editions.find((e) => e.edition?.language === 'ar')
    const english = editions.find((e) => e.edition?.language === 'en')
    if (arabic && english) {
      initialData = { arabic, english, ayahNumber: dailyNumber }
    }
  } catch {}

  return <HomeClient initialData={initialData} initialBgImage={bgImage} />
}
