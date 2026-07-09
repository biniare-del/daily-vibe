import { useRef, useState } from 'react'
import { MOOD_EMOJI, ENERGY_EMOJI, TAG_IDS } from '../types'
import type { TagId, VibeEntry } from '../types'
import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  existing?: VibeEntry
  onSave: (mood: number, energy: number, note: string, tags: TagId[], photo?: string) => void
}

const MAX_PHOTO_DIMENSION = 640

function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function CheckIn({ existing, onSave }: Props) {
  const { t } = useI18n()
  const [mood, setMood] = useState(existing?.mood ?? 3)
  const [energy, setEnergy] = useState(existing?.energy ?? 3)
  const [note, setNote] = useState(existing?.note ?? '')
  const [tags, setTags] = useState<TagId[]>(existing?.tags ?? [])
  const [photo, setPhoto] = useState<string | undefined>(existing?.photo)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTag = (tagId: TagId) => {
    setTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]))
  }

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await resizePhoto(file)
    setPhoto(dataUrl)
  }

  const handleSave = () => {
    onSave(mood, energy, note, tags, photo)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <Card className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{t.checkin.moodQuestion}</h2>
        <div className="flex justify-between gap-2">
          {MOOD_EMOJI.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setMood(i + 1)}
              className={`flex aspect-square flex-1 items-center justify-center rounded-2xl text-2xl transition-all duration-200 ${
                mood === i + 1
                  ? 'scale-110 bg-gradient-to-b from-vibe-500 to-vibe-700 shadow-glow ring-1 ring-white/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
              aria-label={t.moodLabels[i]}
            >
              {emoji}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-center text-xs text-white/40">{t.moodLabels[mood - 1]}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{t.checkin.energyQuestion}</h2>
        <input
          type="range"
          min={1}
          max={5}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="vibe-slider w-full"
        />
        <p className="mt-2 text-center text-lg">{ENERGY_EMOJI[energy - 1]}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{t.checkin.tagQuestion}</h2>
        <div className="flex flex-wrap gap-2">
          {TAG_IDS.map((tagId, i) => (
            <button
              key={tagId}
              onClick={() => toggleTag(tagId)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                tags.includes(tagId)
                  ? 'border-vibe-400/50 bg-vibe-600/80 text-white shadow-[0_0_16px_-4px_rgba(139,92,246,0.6)]'
                  : 'border-white/10 bg-white/[0.03] text-white/60'
              }`}
            >
              {tags.includes(tagId) && <span className="mr-1">✓</span>}
              {t.tags[i]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{t.checkin.noteLabel}</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder={t.checkin.notePlaceholder}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm outline-none placeholder:text-white/30 focus:border-vibe-400/50 focus:ring-1 focus:ring-vibe-400/50"
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">{t.checkin.photoLabel}</h2>
        {photo ? (
          <div className="relative w-fit">
            <img
              src={photo}
              alt={t.checkin.photoAlt}
              className="h-28 w-28 rounded-2xl border border-white/10 object-cover"
            />
            <button
              onClick={() => setPhoto(undefined)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs backdrop-blur"
              aria-label={t.checkin.photoRemove}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-28 w-28 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-2xl text-white/30 transition hover:bg-white/[0.06]"
          >
            📷
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoPick}
          className="hidden"
        />
      </section>

      <button
        onClick={handleSave}
        className="rounded-2xl bg-gradient-to-r from-vibe-600 to-vibe-500 py-4 text-base font-semibold shadow-glow transition-transform active:scale-[0.98]"
      >
        {saved ? t.checkin.saved : existing ? t.checkin.saveEdit : t.checkin.saveDefault}
      </button>
    </Card>
  )
}
