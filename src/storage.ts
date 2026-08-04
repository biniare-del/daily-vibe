import type { EntryMap, VibeEntry } from './types'
import type { MbtiType } from './content/mbti'

const ENTRIES_KEY = 'daily-vibe:entries'
const REMINDER_KEY = 'daily-vibe:reminder'
const PROFILE_KEY = 'daily-vibe:profile'

export interface ReminderSettings {
  enabled: boolean
  time: string // "HH:MM"
}

const DEFAULT_REMINDER: ReminderSettings = { enabled: false, time: '20:00' }

export interface Profile {
  birthday?: string // "YYYY-MM-DD"
  mbti?: MbtiType
}

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

export function saveAllEntries(entries: EntryMap): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
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

export function getReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_KEY)
    return raw ? { ...DEFAULT_REMINDER, ...JSON.parse(raw) } : DEFAULT_REMINDER
  } catch {
    return DEFAULT_REMINDER
  }
}

export function setReminderSettings(settings: ReminderSettings): void {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(settings))
}

export function getProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as Profile) : {}
  } catch {
    return {}
  }
}

export function setProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
