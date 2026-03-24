/**
 * Renders the current ayah as a 1080x1920 image (Instagram Story size)
 * with the background image, Arabic text, translation, and reference.
 */
export async function renderAyahImage({
  arabicText,
  translationText,
  surahName,
  reference,
  backgroundUrl,
}: {
  arabicText: string
  translationText: string
  surahName: string
  reference: string
  backgroundUrl: string
}): Promise<Blob> {
  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Draw background image
  try {
    const img = await loadImage(backgroundUrl)
    const scale = Math.max(W / img.width, H / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
  } catch {
    // Fallback: dark gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#16213e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
  }

  // Semi-transparent overlay for readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fillRect(0, 0, W, H)

  // Glass card area
  const cardX = 60
  const cardY = 400
  const cardW = W - 120
  const cardH = 1100
  const radius = 40

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cardX + radius, cardY)
  ctx.lineTo(cardX + cardW - radius, cardY)
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius)
  ctx.lineTo(cardX + cardW, cardY + cardH - radius)
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH)
  ctx.lineTo(cardX + radius, cardY + cardH)
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius)
  ctx.lineTo(cardX, cardY + radius)
  ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY)
  ctx.closePath()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()

  const centerX = W / 2
  let y = cardY + 80

  // Surah name
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '500 28px Inter, system-ui, sans-serif'
  ctx.fillText(surahName.toUpperCase(), centerX, y)
  y += 70

  // Arabic text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.font = '52px "Amiri Quran", "Noto Naskh Arabic", Amiri, serif'
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  const arabicLines = wrapText(ctx, arabicText, cardW - 80, 52 * 2.2)
  for (const line of arabicLines) {
    ctx.fillText(line, centerX, y)
    y += 52 * 2.2
  }
  ctx.direction = 'ltr'
  y += 30

  // Translation
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.font = '300 32px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const transLines = wrapText(ctx, `"${translationText}"`, cardW - 80, 48)
  for (const line of transLines) {
    ctx.fillText(line, centerX, y)
    y += 48
  }
  y += 50

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - 40, y)
  ctx.lineTo(centerX + 40, y)
  ctx.stroke()
  y += 40

  // Reference
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.font = '26px "Ubuntu Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(reference, centerX, y)

  // Watermark at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.font = '24px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('aayah.app', centerX, H - 60)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create image'))),
      'image/png'
    )
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)

  // Cap at max lines to prevent overflow
  return lines.slice(0, 8)
}

/**
 * Share the ayah as an image using the native Web Share API (for Instagram Stories, etc.)
 * Falls back to downloading the image if sharing isn't supported.
 */
export async function shareAyahImage(blob: Blob, reference: string): Promise<void> {
  const file = new File([blob], `ayah-${reference.replace(':', '-')}.png`, { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `Quran ${reference}`,
      text: `Quran ${reference}`,
    })
  } else {
    // Fallback: download the image
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }
}
