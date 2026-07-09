import type { EntryMap } from '../types'
import { getWeeklySummary } from '../stats'

export default function WeeklySummary({ entries }: { entries: EntryMap }) {
  const { thisWeekAvgMood, thisWeekCount, delta } = getWeeklySummary(entries)

  if (thisWeekCount === 0) return null

  const deltaText =
    delta === null
      ? '지난주 기록이 없어서 비교할 수 없어요'
      : delta > 0.05
        ? `지난주보다 기분이 좋아졌어요 (+${delta.toFixed(1)})`
        : delta < -0.05
          ? `지난주보다 기분이 가라앉았어요 (${delta.toFixed(1)})`
          : '지난주와 비슷한 흐름이에요'

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="text-xs font-medium text-white/50">이번 주 요약</p>
      <p className="mt-1 text-lg font-semibold">
        평균 기분 {thisWeekAvgMood?.toFixed(1)} / 5 · {thisWeekCount}일 기록
      </p>
      <p className="mt-1 text-xs text-white/40">{deltaText}</p>
    </div>
  )
}
