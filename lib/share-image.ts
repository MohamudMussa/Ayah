/**
 * Renders the current ayah as a shareable image with Fuji disposable camera aesthetic.
 * Supports multiple formats: Story (1080x1920), Square (1080x1080), Landscape (1200x630)
 */

export type ShareFormat = 'story' | 'square' | 'landscape'

const FORMAT_SIZES: Record<ShareFormat, { w: number; h: number }> = {
  story: { w: 1080, h: 1920 },
  square: { w: 1080, h: 1080 },
  landscape: { w: 1200, h: 630 },
}

export async function renderAyahImage({
  arabicText,
  translationText,
  surahName,
  reference,
  backgroundUrl,
  format = 'story',
}: {
  arabicText: string
  translationText: string
  surahName: string
  reference: string
  backgroundUrl: string
  format?: ShareFormat
}): Promise<Blob> {
  const { w: W, h: H } = FORMAT_SIZES[format]
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

  // Scale factors for different formats
  const s = format === 'landscape' ? 0.55 : format === 'square' ? 0.8 : 1

  // --- Measure content to size the card dynamically ---
  const cardMargin = Math.round(60 * s)
  const cardX = cardMargin
  const cardW = W - cardMargin * 2
  const contentW = cardW - Math.round(100 * s)
  const centerX = W / 2

  // Font sizes scaled by format
  const surahFontSize = Math.round(26 * s)
  const arabicFontSize = Math.round(48 * s)
  const transFontSize = Math.round(30 * s)
  const refFontSize = Math.round(24 * s)
  const watermarkFontSize = Math.round(22 * s)

  // Measure surah name
  ctx.font = `500 ${surahFontSize}px Inter, system-ui, sans-serif`
  const surahLineH = Math.round(36 * s)

  // Measure arabic text
  ctx.font = `${arabicFontSize}px "Amiri Quran", "Noto Naskh Arabic", "Amiri", serif`
  ctx.direction = 'rtl'
  const arabicLineH = Math.round(arabicFontSize * 2)
  const maxArabicLines = format === 'landscape' ? 3 : format === 'square' ? 5 : 8
  const arabicLines = wrapText(ctx, arabicText, contentW, arabicLineH).slice(0, maxArabicLines)
  ctx.direction = 'ltr'

  // Measure translation
  ctx.font = `300 ${transFontSize}px Inter, system-ui, sans-serif`
  const transLineH = Math.round(44 * s)
  const maxTransLines = format === 'landscape' ? 3 : format === 'square' ? 4 : 8
  const transLines = wrapText(ctx, `"${translationText}"`, contentW, transLineH).slice(0, maxTransLines)

  // Calculate total content height
  const paddingTop = Math.round(80 * s)
  const paddingBottom = Math.round(70 * s)
  const gapAfterSurah = Math.round(60 * s)
  const gapAfterArabic = Math.round(50 * s)
  const gapAfterTranslation = Math.round(45 * s)
  const dividerGap = Math.round(40 * s)
  const refHeight = Math.round(30 * s)

  const totalContentH =
    paddingTop +
    surahLineH +
    gapAfterSurah +
    arabicLines.length * arabicLineH +
    gapAfterArabic +
    transLines.length * transLineH +
    gapAfterTranslation +
    1 +
    dividerGap +
    refHeight +
    paddingBottom

  const maxCardH = format === 'landscape' ? H - 60 : H - 300
  const cardH = Math.min(totalContentH, maxCardH)
  const cardY = (H - cardH) / 2 - (format === 'landscape' ? 0 : 40)
  const radius = Math.round(32 * s)

  // Draw glass card
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // --- Draw text content ---
  let y = cardY + paddingTop

  // Surah name
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.font = `500 ${surahFontSize}px Inter, system-ui, sans-serif`
  ctx.letterSpacing = '4px'
  ctx.fillText(surahName.toUpperCase(), centerX, y + Math.round(20 * s))
  ctx.letterSpacing = '0px'
  y += surahLineH + gapAfterSurah

  // Arabic text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.font = `${arabicFontSize}px "Amiri Quran", "Noto Naskh Arabic", "Amiri", serif`
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  for (const line of arabicLines) {
    ctx.fillText(line, centerX, y)
    y += arabicLineH
  }
  ctx.direction = 'ltr'
  y += gapAfterArabic

  // Translation
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = `300 ${transFontSize}px Inter, system-ui, sans-serif`
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
  ctx.font = `${refFontSize}px "Ubuntu Mono", monospace`
  ctx.textAlign = 'center'
  ctx.fillText(reference, centerX, y)

  // --- Film grain ---
  addFilmGrain(ctx, W, H)

  // --- Vignette ---
  addVignette(ctx, W, H)

  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.font = `${watermarkFontSize}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('www.aayah.one', centerX, H - Math.round(60 * s))

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
  const grainIntensity = 18

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainIntensity * 2
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
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

  return lines
}

/**
 * Share the ayah image using native Web Share API.
 * Falls back to downloading if sharing isn't supported.
 */
export async function shareAyahImage(blob: Blob, reference: string): Promise<void> {
  const file = new File([blob], `ayah-${reference.replace(':', '-')}.png`, { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `Quran ${reference}`,
      text: `Quran ${reference} — www.aayah.one`,
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

/**
 * Copy image to clipboard for easy pasting
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      return true
    }
  } catch {}
  return false
}
