import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET — fetch current stats
export async function GET() {
  if (!supabase) {
    return NextResponse.json({ views: 0, shares: 0 })
  }

  try {
    const { data, error } = await supabase
      .from('stats')
      .select('views, shares')
      .eq('id', 'global')
      .single()

    if (error || !data) {
      return NextResponse.json({ views: 0, shares: 0 })
    }

    return NextResponse.json({ views: data.views, shares: data.shares })
  } catch {
    return NextResponse.json({ views: 0, shares: 0 })
  }
}

// POST — increment a counter
export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ success: false })
  }

  try {
    const { type } = await request.json() // "view" or "share"
    const column = type === 'share' ? 'shares' : 'views'

    // Use RPC to atomically increment
    const { error } = await supabase.rpc('increment_stat', {
      stat_column: column,
    })

    if (error) {
      console.error('Stats increment error:', error)
      return NextResponse.json({ success: false })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
