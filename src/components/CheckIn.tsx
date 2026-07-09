import { useState } from 'react'
import { MOOD_EMOJI, MOOD_LABELS, ENERGY_EMOJI } from '../types'
import type { VibeEntry } from '../types'

interface Props {
  existing?: VibeEntry
  onSave: (mood: number, energy: number, note: string) => void
}

export default function CheckIn({ existing, onSave }: Props) {
  const [mood, setMood] = useState(existing?.mood ?? 3)
  const [energy, setEnergy] = useState(existing?.energy ?? 3)
  const [note, setNote] = useState(existing?.note ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(mood, energy, note)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-sm font-medium text-white/60">오늘 기분은 어때요?</h2>
        <div className="flex justify-between gap-2">
          {MOOD_EMOJI.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setMood(i + 1)}
              className={`flex-1 rounded-2xl py-3 text-2xl transition ${
                mood === i + 1
                  ? 'bg-vibe-600 scale-105 shadow-lg shadow-vibe-600/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              aria-label={MOOD_LABELS[i]}
            >
              {emoji}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-white/40">{MOOD_LABELS[mood - 1]}</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white/60">에너지 레벨은요?</h2>
        <input
          type="range"
          min={1}
          max={5}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full accent-vibe-500"
        />
        <p className="mt-1 text-center text-lg">{ENERGY_EMOJI[energy - 1]}</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white/60">한 줄 메모 (선택)</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="오늘 있었던 일을 짧게 남겨보세요"
          className="w-full resize-none rounded-2xl bg-white/5 p-3 text-sm outline-none placeholder:text-white/30 focus:ring-2 focus:ring-vibe-500"
        />
      </section>

      <button
        onClick={handleSave}
        className="rounded-2xl bg-vibe-600 py-4 text-base font-semibold shadow-lg shadow-vibe-600/30 transition active:scale-95"
      >
        {saved ? '저장됐어요! ✅' : existing ? '오늘 기록 수정하기' : '오늘의 바이브 저장하기'}
      </button>
    </div>
  )
}
