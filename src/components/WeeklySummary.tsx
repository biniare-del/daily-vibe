import type { EntryMap } from '../types'
import { getWeeklySummary } from '../stats'
import { useI18n } from '../i18n'
import Card from './Card'

export default function WeeklySummary({ entries }: { entries: EntryMap }) {
  const { t } = useI18n()
  const { thisWeekAvgMood, thisWeekCount, delta } = getWeeklySummary(entries)

  if (thisWeekCount === 0) return null

  const deltaText =
    delta === null
      ? t.weekly.noLastWeek
      : delta > 0.05
        ? t.weekly.up(delta.toFixed(1))
        : delta < -0.05
          ? t.weekly.down(delta.toFixed(1))
          : t.weekly.flat

  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{t.weekly.title}</p>
      <p className="mt-1.5 text-lg font-semibold tracking-tight">
        {t.weekly.summaryLine(thisWeekAvgMood?.toFixed(1) ?? '-', thisWeekCount)}
      </p>
      <p className="mt-1 text-xs text-white/40">{deltaText}</p>
    </Card>
  )
}
