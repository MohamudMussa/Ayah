'use client'

import { useEffect, useRef } from 'react'

/**
 * Subtle film grain overlay — Fuji disposable camera aesthetic.
 * Uses a small canvas to generate noise, tiled as a CSS background.
 */
export default function FilmGrain() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 150
    canvas.height = 150
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.createImageData(150, 150)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 14 // very subtle opacity
    }

    ctx.putImageData(imageData, 0, 0)
    if (ref.current) {
      ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ backgroundRepeat: 'repeat' }}
      aria-hidden="true"
    />
  )
}
