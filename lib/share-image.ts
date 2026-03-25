/**
 * Renders the current ayah as a 1080x1920 image (Instagram Story size)
 * with a Fuji disposable camera aesthetic — warm tones, film grain, vignette.
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

  // Warm color overlay (Fuji disposable look)
  ctx.fillStyle = 'rgba(255, 180, 100, 0.08)'
  ctx.fillRect(0, 0, W, H)

  // Darken overlay for readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
  ctx.fillRect(0, 0, W, H)

  // --- Measure content to size the card dynamically ---
  const cardX = 60
  const cardW = W - 120
  const contentW = cardW - 100 // padding inside card
  const centerX = W / 2

  // Measure surah name
  ctx.font = '500 26px Inter, system-ui, sans-serif'
  const surahLineH = 36

  // Measure arabic text
  ctx.font = '48px "Amiri Quran", "Noto Naskh Arabic", "Amiri", serif'
  ctx.direction = 'rtl'
  const arabicLineH = 48 * 2
  const arabicLines = wrapText(ctx, arabicText, contentW, arabicLineH)
  ctx.direction = 'ltr'

  // Measure translation
  ctx.font = '300 30px Inter, system-ui, sans-serif'
  const transLineH = 44
  const transLines = wrapText(ctx, `"${translationText}"`, contentW, transLineH)

  // Calculate total content height
  const paddingTop = 80
  const paddingBottom = 70
  const gapAfterSurah = 60
  const gapAfterArabic = 50
  const gapAfterTranslation = 45
  const dividerGap = 40
  const refHeight = 30

  const totalContentH =
    paddingTop +
    surahLineH +
    gapAfterSurah +
    arabicLines.length * arabicLineH +
    gapAfterArabic +
    transLines.length * transLineH +
    gapAfterTranslation +
    1 + // divider
    dividerGap +
    refHeight +
    paddingBottom

  const cardH = Math.min(totalContentH, H - 300) // leave room for top/bottom
  const cardY = (H - cardH) / 2 - 40 // slightly above center
  const radius = 32

  // Draw glass card
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // --- Draw text content ---
  let y = cardY + paddingTop

  // Surah name — subtle, spaced out
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.font = '500 26px Inter, system-ui, sans-serif'
  ctx.letterSpacing = '4px'
  ctx.fillText(surahName.toUpperCase(), centerX, y + 20)
  ctx.letterSpacing = '0px'
  y += surahLineH + gapAfterSurah

  // Arabic text — clear, well-spaced
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.font = '48px "Amiri Quran", "Noto Naskh Arabic", "Amiri", serif'
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  for (const line of arabicLines) {
    ctx.fillText(line, centerX, y)
    y += arabicLineH
  }
  ctx.direction = 'ltr'
  y += gapAfterArabic

  // Translation — lighter, elegant
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '300 30px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const line of transLines) {
    ctx.fillText(line, centerX, y)
    y += transLineH
  }
  y += gapAfterTranslation

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - 30, y)
  ctx.lineTo(centerX + 30, y)
  ctx.stroke()
  y += dividerGap

  // Reference
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.font = '24px "Ubuntu Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText(reference, centerX, y)

  // --- Film grain effect ---
  addFilmGrain(ctx, W, H)

  // --- Vignette ---
  addVignette(ctx, W, H)

  // Watermark at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.font = '22px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('aayah.app', centerX, H - 60)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create image'))),
      'image/png'
    )
  })
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function addFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const imageData = ctx.getImageData(0, 0, w, h)
  const data = imageData.data
  const grainIntensity = 18 // subtle — like Fuji Superia 400

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainIntensity * 2
    data[i] = Math.min(255, Math.max(0, data[i] + noise))     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)) // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)) // B
  }

  ctx.putImageData(imageData, 0, 0)
}

function addVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2
  const cy = h / 2
  const outerRadius = Math.sqrt(cx * cx + cy * cy)
  const gradient = ctx.createRadialGradient(cx, cy, outerRadius * 0.4, cx, cy, outerRadius)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.45)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
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

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, _lineHeight: number): string[] {
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
