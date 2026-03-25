'use client'

import { useEffect, useState } from 'react'
import { Eye, Share2 } from 'lucide-react'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function StatsDisplay() {
  const [stats, setStats] = useState<{ views: number; shares: number } | null>(null)

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        if (data.views > 0 || data.shares > 0) {
          setStats(data)
        }
      })
      .catch(() => {})

    // Record this view
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' }),
    }).catch(() => {})
  }, [])

  // Don't render if no stats or Supabase not configured
  if (!stats) return null

  return (
    <div
      className="fixed top-4 left-4 z-40 flex items-center gap-3 text-[10px] text-white/50 font-medium tracking-wide"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
    >
      <span className="flex items-center gap-1">
        <Eye className="w-3 h-3" />
        {formatNumber(stats.views)}
      </span>
      {stats.shares > 0 && (
        <span className="flex items-center gap-1">
          <Share2 className="w-3 h-3" />
          {formatNumber(stats.shares)}
        </span>
      )}
    </div>
  )
}

/** Call this from share button to increment share count */
export function recordShare() {
  fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'share' }),
  }).catch(() => {})
}
