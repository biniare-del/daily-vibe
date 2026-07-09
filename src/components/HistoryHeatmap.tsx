import type { EntryMap } from '../types'
import { todayKey } from '../storage'
import { useI18n } from '../i18n'

interface Props {
  entries: EntryMap
  days: number
}

const MOOD_BG = [
  'bg-white/5',
  'bg-vibe-900',
  'bg-vibe-700',
  'bg-vibe-600',
  'bg-vibe-500',
  'bg-vibe-400'
]

export default function HistoryHeatmap({ entries, days }: Props) {
  const { t } = useI18n()
  const cells: { key: string; mood: number }[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - (days - 1))

  for (let i = 0; i < days; i++) {
    const key = todayKey(cursor)
    cells.push({ key, mood: entries[key]?.mood ?? 0 })
    cursor.setDate(cursor.getDate() + 1)
  }

  // pad to full weeks (start on Sunday-aligned columns)
  const firstDow = new Date(cells[0].key).getDay()
  const padded = Array(firstDow).fill(null).concat(cells)
  const weeks: (typeof cells[number] | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) =>
              cell ? (
                <div
                  key={di}
                  title={`${cell.key}${cell.mood ? ` · mood ${cell.mood}` : ''}`}
                  className={`h-3.5 w-3.5 rounded-[3px] transition-transform hover:scale-125 ${MOOD_BG[cell.mood]}`}
                />
              ) : (
                <div key={di} className="h-3.5 w-3.5" />
              )
            )}
          </div>
        ))}
      </div>
      <p className="mt-1 text-right text-[11px] text-white/30">{t.history.recentDays(days)}</p>
    </div>
  )
}
