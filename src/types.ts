export interface VibeEntry {
  date: string // YYYY-MM-DD
  mood: number // 1-5
  energy: number // 1-5
  note: string
  exercised: boolean
  expenseAmount: number
  expenseNote: string
  photo?: string // data URL
  createdAt: number
}

export type EntryMap = Record<string, VibeEntry>

export const MOOD_EMOJI = ['😞', '😕', '😐', '🙂', '😄'] as const
export const ENERGY_EMOJI = ['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '⚡️'] as const

export const HISTORY_DAYS = 365
