import type { EntryMap } from '../types'
import { MOOD_EMOJI } from '../types'
import {
  getAvgDailySpending,
  getMonthlySpending,
  getMoodByWeekday,
  getWeeklyExerciseCount,
  getWeeklySpending
} from '../stats'
import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  entries: EntryMap
}

function formatWon(n: number): string {
  return `${Math.round(n).toLocaleString()}원`
}

export default function MonthlyReport({ entries }: Props) {
  const { t } = useI18n()
  const all = Object.values(entries)
  if (all.length === 0) {
    return <p className="text-sm text-white/40">{t.report.empty}</p>
  }

  const avgMood = all.reduce((s, e) => s + e.mood, 0) / all.length
  const avgEnergy = all.reduce((s, e) => s + e.energy, 0) / all.length
  const best = all.reduce((a, b) => (b.mood > a.mood ? b : a))
  const moodCounts = [0, 0, 0, 0, 0]
  all.forEach((e) => moodCounts[e.mood - 1]++)
  const byWeekday = getMoodByWeekday(entries)

  const weeklyExercise = getWeeklyExerciseCount(entries)
  const weeklySpending = getWeeklySpending(entries)
  const avgSpending = getAvgDailySpending(entries)
  const monthlySpending = getMonthlySpending(entries)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">{avgMood.toFixed(1)} / 5</p>
          <p className="mt-1 text-xs text-white/50">{t.report.avgMood}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">{avgEnergy.toFixed(1)} / 5</p>
          <p className="mt-1 text-xs text-white/50">{t.report.avgEnergy}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">
            {weeklyExercise}
            {t.report.times}
          </p>
          <p className="mt-1 text-xs text-white/50">{t.report.weeklyExercise}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">{formatWon(weeklySpending)}</p>
          <p className="mt-1 text-xs text-white/50">{t.report.weeklySpending}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">{formatWon(avgSpending)}</p>
          <p className="mt-1 text-xs text-white/50">{t.report.avgSpending}</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold tracking-tight">{formatWon(monthlySpending)}</p>
          <p className="mt-1 text-xs text-white/50">{t.report.monthlySpending}</p>
        </Card>
      </div>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">{t.report.moodDistribution}</p>
        <div className="flex items-end gap-2">
          {moodCounts.map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-vibe-700 to-vibe-400"
                style={{ height: `${8 + (count / all.length) * 60}px` }}
              />
              <span className="text-xs">{MOOD_EMOJI[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">{t.report.bestDay}</p>
        <p className="mt-1.5 text-sm">
          {best.date} {MOOD_EMOJI[best.mood - 1]} {best.note && `· ${best.note}`}
        </p>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">{t.report.moodByWeekday}</p>
        <div className="flex items-end gap-2">
          {byWeekday.map((moodAvg, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-vibe-700 to-vibe-400"
                style={{ height: `${moodAvg ? 8 + (moodAvg / 5) * 60 : 4}px` }}
              />
              <span className="text-xs text-white/50">{t.weekdays[i]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
