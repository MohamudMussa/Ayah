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
    <div className="relative flex items-center min-w-0 flex-1 max-w-[45%]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReciterId)}
        className="text-[10px] w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-2.5 pr-5 py-1 text-white/40 hover:text-white/60 hover:bg-white/[0.08] focus:outline-none appearance-none cursor-pointer transition-colors truncate"
        aria-label="Select reciter"
      >
        {RECITERS.map((reciter) => (
          <option key={reciter.id} value={reciter.id} className="bg-gray-800 text-white">
            {reciter.name}
          </option>
        ))}
      </select>
      <ChevronDown className="w-2.5 h-2.5 text-white/30 absolute right-1.5 pointer-events-none" />
    </div>
  )
}
