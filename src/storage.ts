import type { EntryMap, VibeEntry } from './types'

const ENTRIES_KEY = 'daily-vibe:entries'
const PREMIUM_KEY = 'daily-vibe:premium'

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function loadEntries(): EntryMap {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    return raw ? (JSON.parse(raw) as EntryMap) : {}
  } catch {
    return {}
  }
}

export function saveEntry(entry: VibeEntry): EntryMap {
  const all = loadEntries()
  all[entry.date] = entry
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(all))
  return all
}

export function isPremium(): boolean {
  return localStorage.getItem(PREMIUM_KEY) === 'true'
}

export function setPremium(value: boolean): void {
  localStorage.setItem(PREMIUM_KEY, String(value))
}

export function calcStreak(entries: EntryMap): number {
  let streak = 0
  const cursor = new Date()
  const hasToday = !!entries[todayKey(cursor)]
  if (!hasToday) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (entries[todayKey(cursor)]) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function sortedDates(entries: EntryMap): string[] {
  return Object.keys(entries).sort((a, b) => (a < b ? 1 : -1))
}
