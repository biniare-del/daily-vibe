import { supabase, supabaseEnabled } from './supabaseClient'
import type { EntryMap, VibeEntry } from './types'
import { loadEntries, saveAllEntries } from './storage'

export function isCloudEnabled(): boolean {
  return supabaseEnabled
}

export interface CloudUser {
  id: string
  email?: string
  avatarUrl?: string
}

export async function signInWithGoogle(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signInWithOAuth({ provider: 'google' })
}

export async function signOutCloud(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<CloudUser | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  if (!user) return null
  return { id: user.id, email: user.email, avatarUrl: user.user_metadata?.avatar_url }
}

export function onAuthChange(callback: (user: CloudUser | null) => void): () => void {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user
    callback(user ? { id: user.id, email: user.email, avatarUrl: user.user_metadata?.avatar_url } : null)
  })
  return () => data.subscription.unsubscribe()
}

interface EntryRow {
  date: string
  mood: number
  energy: number
  note: string | null
  exercised: boolean | null
  expense_amount: number | null
  expense_note: string | null
  photo: string | null
  created_at: number
}

function rowToEntry(row: EntryRow): VibeEntry {
  return {
    date: row.date,
    mood: row.mood,
    energy: row.energy,
    note: row.note ?? '',
    exercised: row.exercised ?? false,
    expenseAmount: row.expense_amount ?? 0,
    expenseNote: row.expense_note ?? '',
    photo: row.photo ?? undefined,
    createdAt: row.created_at
  }
}

function entryToRow(userId: string, entry: VibeEntry) {
  return {
    user_id: userId,
    date: entry.date,
    mood: entry.mood,
    energy: entry.energy,
    note: entry.note,
    exercised: entry.exercised,
    expense_amount: entry.expenseAmount,
    expense_note: entry.expenseNote,
    photo: entry.photo ?? null,
    created_at: entry.createdAt
  }
}

/**
 * Merges local entries with the cloud copy (newest createdAt per date wins),
 * writes the merged result back to localStorage, and pushes anything the
 * cloud was missing or had a stale copy of.
 */
export async function syncEntries(userId: string): Promise<EntryMap> {
  if (!supabase) return loadEntries()

  const local = loadEntries()
  const { data: rows, error } = await supabase.from('vibe_entries').select('*').eq('user_id', userId)
  if (error) {
    console.error('Supabase sync fetch failed', error)
    return local
  }

  const remote: EntryMap = {}
  ;(rows ?? []).forEach((row) => {
    remote[row.date] = rowToEntry(row as EntryRow)
  })

  const merged: EntryMap = { ...remote }
  Object.values(local).forEach((entry) => {
    const existing = merged[entry.date]
    if (!existing || entry.createdAt > existing.createdAt) {
      merged[entry.date] = entry
    }
  })

  saveAllEntries(merged)

  const toUpsert = Object.values(merged).filter((entry) => {
    const remoteEntry = remote[entry.date]
    return !remoteEntry || remoteEntry.createdAt !== entry.createdAt
  })

  if (toUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .from('vibe_entries')
      .upsert(toUpsert.map((entry) => entryToRow(userId, entry)))
    if (upsertError) console.error('Supabase sync push failed', upsertError)
  }

  return merged
}

export async function pushEntry(userId: string, entry: VibeEntry): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('vibe_entries').upsert(entryToRow(userId, entry))
  if (error) console.error('Supabase push failed', error)
}
