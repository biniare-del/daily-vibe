import type { EntryMap } from '../types'
import { MOOD_EMOJI, WEEKDAY_LABELS } from '../types'
import { getMoodByTag, getMoodByWeekday } from '../stats'

interface Props {
  entries: EntryMap
}

export default function MonthlyReport({ entries }: Props) {
  const all = Object.values(entries)
  if (all.length === 0) {
    return <p className="text-sm text-white/40">아직 기록이 없어요. 체크인을 시작해보세요!</p>
  }

  const avgMood = all.reduce((s, e) => s + e.mood, 0) / all.length
  const avgEnergy = all.reduce((s, e) => s + e.energy, 0) / all.length
  const best = all.reduce((a, b) => (b.mood > a.mood ? b : a))
  const moodCounts = [0, 0, 0, 0, 0]
  all.forEach((e) => moodCounts[e.mood - 1]++)
  const byWeekday = getMoodByWeekday(entries)
  const byTag = getMoodByTag(entries)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <p className="text-xl font-bold">{avgMood.toFixed(1)} / 5</p>
          <p className="mt-1 text-xs text-white/50">평균 기분</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <p className="text-xl font-bold">{avgEnergy.toFixed(1)} / 5</p>
          <p className="mt-1 text-xs text-white/50">평균 에너지</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-4">
        <p className="mb-2 text-xs font-medium text-white/50">기분 분포</p>
        <div className="flex items-end gap-2">
          {moodCounts.map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-vibe-500"
                style={{ height: `${8 + (count / all.length) * 60}px` }}
              />
              <span className="text-xs">{MOOD_EMOJI[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 p-4">
        <p className="text-xs text-white/50">최고의 하루</p>
        <p className="mt-1 text-sm">
          {best.date} {MOOD_EMOJI[best.mood - 1]} {best.note && `· ${best.note}`}
        </p>
      </div>

      <div className="rounded-2xl bg-white/5 p-4">
        <p className="mb-2 text-xs font-medium text-white/50">요일별 평균 기분</p>
        <div className="flex items-end gap-2">
          {byWeekday.map((moodAvg, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-vibe-500"
                style={{ height: `${moodAvg ? 8 + (moodAvg / 5) * 60 : 4}px` }}
              />
              <span className="text-xs text-white/50">{WEEKDAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {byTag.length > 0 && (
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="mb-2 text-xs font-medium text-white/50">태그별 평균 기분</p>
          <div className="flex flex-col gap-2">
            {byTag.map(({ tag, avgMood: tagAvg, count }) => (
              <div key={tag} className="flex items-center justify-between text-sm">
                <span className="text-white/70">{tag}</span>
                <span className="text-white/40">
                  {tagAvg.toFixed(1)} / 5 · {count}회
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
