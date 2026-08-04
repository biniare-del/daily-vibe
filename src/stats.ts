import type { EntryMap, VibeEntry } from './types'
import { todayKey } from './storage'

function entriesInLastDays(entries: EntryMap, days: number, offsetDays = 0): VibeEntry[] {
  const list: VibeEntry[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - offsetDays)
  for (let i = 0; i < days; i++) {
    const entry = entries[todayKey(cursor)]
    if (entry) list.push(entry)
    cursor.setDate(cursor.getDate() - 1)
  }
  return list
}

function avg(list: number[]): number | null {
  if (list.length === 0) return null
  return list.reduce((a, b) => a + b, 0) / list.length
}

export interface WeeklySummary {
  thisWeekAvgMood: number | null
  lastWeekAvgMood: number | null
  thisWeekAvgEnergy: number | null
  thisWeekCount: number
  delta: number | null // this week - last week
}

export function getWeeklySummary(entries: EntryMap): WeeklySummary {
  const thisWeek = entriesInLastDays(entries, 7, 0)
  const lastWeek = entriesInLastDays(entries, 7, 7)
  const thisWeekAvgMood = avg(thisWeek.map((e) => e.mood))
  const lastWeekAvgMood = avg(lastWeek.map((e) => e.mood))
  return {
    thisWeekAvgMood,
    lastWeekAvgMood,
    thisWeekAvgEnergy: avg(thisWeek.map((e) => e.energy)),
    thisWeekCount: thisWeek.length,
    delta: thisWeekAvgMood !== null && lastWeekAvgMood !== null ? thisWeekAvgMood - lastWeekAvgMood : null
  }
}

export function getMoodByWeekday(entries: EntryMap): (number | null)[] {
  const buckets: number[][] = [[], [], [], [], [], [], []]
  Object.values(entries).forEach((e) => {
    const dow = new Date(e.date).getDay()
    buckets[dow].push(e.mood)
  })
  return buckets.map((b) => avg(b))
}

export function getWeeklyExerciseCount(entries: EntryMap): number {
  return entriesInLastDays(entries, 7, 0).filter((e) => e.exercised).length
}

export function getWeeklySpending(entries: EntryMap): number {
  return entriesInLastDays(entries, 7, 0).reduce((sum, e) => sum + (e.expenseAmount || 0), 0)
}

export function getAvgDailySpending(entries: EntryMap): number {
  const all = Object.values(entries)
  if (all.length === 0) return 0
  const total = all.reduce((sum, e) => sum + (e.expenseAmount || 0), 0)
  return total / all.length
}

export function getMonthlySpending(entries: EntryMap, date = new Date()): number {
  const prefix = todayKey(date).slice(0, 7) // YYYY-MM
  return Object.values(entries)
    .filter((e) => e.date.startsWith(prefix))
    .reduce((sum, e) => sum + (e.expenseAmount || 0), 0)
}
