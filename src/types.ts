export interface VibeEntry {
  date: string // YYYY-MM-DD
  mood: number // 1-5
  energy: number // 1-5
  note: string
  createdAt: number
}

export type EntryMap = Record<string, VibeEntry>

export const MOOD_LABELS = ['힘들어요', '별로예요', '그저그래요', '좋아요', '최고예요'] as const
export const MOOD_EMOJI = ['😞', '😕', '😐', '🙂', '😄'] as const
export const ENERGY_EMOJI = ['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '⚡️'] as const

export const FREE_HISTORY_DAYS = 30
