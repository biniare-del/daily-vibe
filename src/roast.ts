import type { EntryMap } from './types'
import { getWeeklySummary, getWeeklyExerciseCount, getWeeklySpending } from './stats'
import { dayOfYear } from './fortune'
import type { Dict } from './i18n'

export type RoastCategory = 'noData' | 'noLow' | 'noOk' | 'someLow' | 'someOk' | 'goodLow' | 'goodOk' | 'highSpend'

const HIGH_SPEND_THRESHOLD = 150000

export function getRoastCategory(entries: EntryMap): RoastCategory {
  const { thisWeekAvgMood, thisWeekCount } = getWeeklySummary(entries)
  if (thisWeekCount === 0) return 'noData'

  const spending = getWeeklySpending(entries)
  if (spending > HIGH_SPEND_THRESHOLD) return 'highSpend'

  const exerciseCount = getWeeklyExerciseCount(entries)
  const exLevel = exerciseCount === 0 ? 'no' : exerciseCount <= 2 ? 'some' : 'good'
  const moodLevel = (thisWeekAvgMood ?? 3) < 3.3 ? 'Low' : 'Ok'
  return `${exLevel}${moodLevel}` as RoastCategory
}

export function getRoastMessage(entries: EntryMap, dict: Dict, date = new Date()): string {
  const category = getRoastCategory(entries)
  const pool = dict.roast[category]
  return pool[dayOfYear(date) % pool.length]
}
