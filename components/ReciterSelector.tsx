'use client'

import { ChevronDown } from 'lucide-react'
import { RECITERS, type ReciterId } from '@/lib/constants'

interface ReciterSelectorProps {
  value: ReciterId
  onChange: (id: ReciterId) => void
}

export default function ReciterSelector({ value, onChange }: ReciterSelectorProps) {
  const name = RECITERS.find((r) => r.id === value)?.name || 'Reciter'

  return (
    <div className="relative flex items-center min-w-0 flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReciterId)}
        className="text-[10px] md:text-[11px] w-full bg-white/[0.06] border border-white/[0.1] rounded-lg pl-2.5 pr-6 py-1.5 text-white/50 hover:text-white/70 hover:bg-white/[0.1] focus:outline-none appearance-none cursor-pointer transition-colors truncate"
        aria-label="Select reciter"
      >
        {RECITERS.map((reciter) => (
          <option key={reciter.id} value={reciter.id} className="bg-gray-800 text-white">
            {reciter.name}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-white/40 absolute right-2 pointer-events-none" />
    </div>
  )
}
