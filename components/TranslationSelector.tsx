'use client'

import { ChevronDown } from 'lucide-react'
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
    <div className="relative flex items-center min-w-0 flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TranslationId)}
        className="text-[10px] md:text-[11px] w-full bg-white/[0.06] border border-white/[0.1] rounded-lg pl-2.5 pr-6 py-1.5 text-white/50 hover:text-white/70 hover:bg-white/[0.1] focus:outline-none appearance-none cursor-pointer transition-colors truncate"
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
      <ChevronDown className="w-3 h-3 text-white/40 absolute right-2 pointer-events-none" />
    </div>
  )
}
