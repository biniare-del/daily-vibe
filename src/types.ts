export const TAG_IDS = ['exercise', 'work', 'friends', 'family', 'rest', 'love', 'health', 'other'] as const
export type TagId = (typeof TAG_IDS)[number]

export interface VibeEntry {
  date: string // YYYY-MM-DD
  mood: number // 1-5
  energy: number // 1-5
  note: string
  tags: TagId[]
  photo?: string // data URL
  createdAt: number
}

export type EntryMap = Record<string, VibeEntry>

export const MOOD_EMOJI = ['😞', '😕', '😐', '🙂', '😄'] as const
export const ENERGY_EMOJI = ['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '⚡️'] as const

export const MOOD_BG_GRADIENT = [
  'from-slate-800 to-slate-950',
  'from-indigo-950 to-slate-950',
  'from-vibe-900 to-slate-950',
  'from-vibe-700/60 to-slate-950',
  'from-fuchsia-700/50 to-slate-950'
] as const

export const FREE_HISTORY_DAYS = 30
