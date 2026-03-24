'use client'

import { RECITERS, type ReciterId } from '@/lib/constants'

interface ReciterSelectorProps {
  value: ReciterId
  onChange: (id: ReciterId) => void
}

export default function ReciterSelector({ value, onChange }: ReciterSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ReciterId)}
      className="text-[10px] bg-transparent border border-white/[0.06] rounded-md px-1.5 py-1 text-white/35 hover:text-white/50 focus:outline-none appearance-none cursor-pointer"
      aria-label="Select reciter"
    >
      {RECITERS.map((reciter) => (
        <option key={reciter.id} value={reciter.id} className="bg-gray-800 text-white">
          {reciter.name}
        </option>
      ))}
    </select>
  )
}
