'use client'

import { TRANSLATIONS, type TranslationId } from '@/lib/constants'

interface TranslationSelectorProps {
  value: TranslationId
  onChange: (id: TranslationId) => void
}

export default function TranslationSelector({ value, onChange }: TranslationSelectorProps) {
  const grouped = TRANSLATIONS.reduce(
    (acc, t) => {
      if (!acc[t.language]) acc[t.language] = []
      acc[t.language].push(t)
      return acc
    },
    {} as Record<string, typeof TRANSLATIONS[number][]>
  )

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TranslationId)}
      className="text-[10px] bg-transparent border border-white/[0.06] rounded-md px-1.5 py-1 text-white/35 hover:text-white/50 focus:outline-none appearance-none cursor-pointer"
      aria-label="Select translation"
    >
      {Object.entries(grouped).map(([language, translations]) => (
        <optgroup key={language} label={language} className="bg-gray-800">
          {translations.map((t) => (
            <option key={t.id} value={t.id} className="bg-gray-800 text-white">
              {t.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
