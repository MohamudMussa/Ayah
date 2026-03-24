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
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TranslationId)}
        className="text-[10px] bg-white/[0.04] border border-white/[0.08] rounded-full pl-2.5 pr-5 py-1 text-white/40 hover:text-white/60 hover:bg-white/[0.08] focus:outline-none appearance-none cursor-pointer transition-colors"
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
      <ChevronDown className="w-2.5 h-2.5 text-white/30 absolute right-1.5 pointer-events-none" />
    </div>
  )
}
