import { MOOD_EMOJI } from './types'
import type { VibeEntry } from './types'

const GRADIENTS = [
  ['#1e293b', '#0f172a'],
  ['#312e81', '#0f172a'],
  ['#4c1d95', '#0f172a'],
  ['#6d28d9', '#1e1b4b'],
  ['#a21caf', '#1e1b4b']
]

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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
  return lines.slice(0, 4)
}

export async function generateShareImage(entry: VibeEntry): Promise<Blob> {
  const size = 1080
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const [c1, c2] = GRADIENTS[entry.mood - 1]
  const grad = ctx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, c1)
  grad.addColorStop(1, c2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  ctx.textAlign = 'center'
  ctx.fillStyle = 'white'

  ctx.font = '260px sans-serif'
  ctx.fillText(MOOD_EMOJI[entry.mood - 1], size / 2, 480)

  ctx.font = '600 48px sans-serif'
  ctx.fillText(entry.date, size / 2, 600)

  const badges = [entry.exercised ? '🏃 운동' : null, entry.expenseAmount ? `💰 ${Math.round(entry.expenseAmount).toLocaleString()}원` : null].filter(
    Boolean
  )
  if (badges.length > 0) {
    ctx.font = '400 34px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(badges.join('   '), size / 2, 670)
    ctx.fillStyle = 'white'
  }

  if (entry.note) {
    ctx.font = '400 38px sans-serif'
    const lines = wrapText(ctx, entry.note, size - 160)
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, 760 + i * 52)
    })
  }

  ctx.font = '600 40px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('데일리바이브 ✨', size / 2, size - 90)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

export async function shareEntry(entry: VibeEntry): Promise<void> {
  const blob = await generateShareImage(entry)
  const file = new File([blob], 'daily-vibe.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: '데일리바이브',
      text: '오늘의 바이브를 공유해요 ✨'
    })
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'daily-vibe.png'
  a.click()
  URL.revokeObjectURL(url)
}
