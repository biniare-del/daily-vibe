export interface VibeEntry {
  date: string // YYYY-MM-DD
  mood: number // 1-5
  energy: number // 1-5
  note: string
  tags: string[]
  photo?: string // data URL
  createdAt: number
}

export type EntryMap = Record<string, VibeEntry>

export const MOOD_LABELS = ['힘들어요', '별로예요', '그저그래요', '좋아요', '최고예요'] as const
export const MOOD_EMOJI = ['😞', '😕', '😐', '🙂', '😄'] as const
export const ENERGY_EMOJI = ['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '⚡️'] as const

export const MOOD_BG_GRADIENT = [
  'from-slate-800 to-slate-950',
  'from-indigo-950 to-slate-950',
  'from-vibe-900 to-slate-950',
  'from-vibe-700/60 to-slate-950',
  'from-fuchsia-700/50 to-slate-950'
] as const

export const TAGS = ['운동', '일/공부', '친구', '가족', '휴식', '연애', '건강', '기타'] as const

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

export const FREE_HISTORY_DAYS = 30
