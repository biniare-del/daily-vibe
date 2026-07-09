import { useEffect, useMemo, useState } from 'react'
import CheckIn from './components/CheckIn'
import Streak from './components/Streak'
import HistoryHeatmap from './components/HistoryHeatmap'
import MonthlyReport from './components/MonthlyReport'
import PremiumPaywall from './components/PremiumPaywall'
import WeeklySummary from './components/WeeklySummary'
import ReminderSettingsPanel from './components/ReminderSettings'
import DailyEnglishCard from './components/DailyEnglishCard'
import FortuneCard from './components/FortuneCard'
import ProfileSettings from './components/ProfileSettings'
import { FREE_HISTORY_DAYS, MOOD_BG_GRADIENT } from './types'
import type { TagId } from './types'
import {
  calcStreak,
  getProfile,
  getReminderSettings,
  isPremium,
  loadEntries,
  saveEntry,
  setPremium,
  sortedDates,
  todayKey
} from './storage'
import { maybeShowReminder } from './notifications'
import { shareEntry } from './share'
import { useI18n } from './i18n'

type Tab = 'today' | 'history' | 'report' | 'settings'

function App() {
  const { t, flag, code, cycleLang } = useI18n()
  const [entries, setEntries] = useState(loadEntries())
  const [premium, setPremiumState] = useState(isPremium())
  const [tab, setTab] = useState<Tab>('today')
  const [profile, setProfileState] = useState(getProfile())

  const streak = useMemo(() => calcStreak(entries), [entries])
  const totalEntries = useMemo(() => sortedDates(entries).length, [entries])
  const today = todayKey()
  const todayEntry = entries[today]

  const handleSave = (mood: number, energy: number, note: string, tags: TagId[], photo?: string) => {
    const next = saveEntry({ date: today, mood, energy, note, tags, photo, createdAt: Date.now() })
    setEntries({ ...next })
  }

  const handleUnlock = () => {
    setPremium(true)
    setPremiumState(true)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'daily-vibe-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    document.title = t.appName
  }, [t])

  useEffect(() => {
    const reminder = getReminderSettings()
    if (reminder.enabled) {
      maybeShowReminder(!!todayEntry, reminder.time)
    }
  }, [])

  const bgGradient = MOOD_BG_GRADIENT[(todayEntry?.mood ?? 3) - 1]

  return (
    <div
      className={`mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b text-white transition-colors duration-700 ${bgGradient}`}
    >
      <header className="flex items-start justify-between px-5 pb-2 pt-6">
        <div>
          <h1 className="text-xl font-bold">{t.appName}</h1>
          <p className="text-xs text-white/40">{t.appTagline}</p>
        </div>
        <button
          onClick={cycleLang}
          className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium active:scale-95"
          aria-label="switch language"
        >
          <span>{flag}</span>
          <span>{code}</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
        {tab === 'today' && (
          <div className="flex flex-col gap-5">
            <Streak streak={streak} totalEntries={totalEntries} />
            <WeeklySummary entries={entries} />
            <DailyEnglishCard />
            <FortuneCard profile={profile} />
            <CheckIn existing={todayEntry} onSave={handleSave} />
            {todayEntry && (
              <button
                onClick={() => shareEntry(todayEntry)}
                className="rounded-2xl bg-white/10 py-3 text-sm font-medium active:scale-95"
              >
                {t.share.button}
              </button>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="flex flex-col gap-5">
            <HistoryHeatmap entries={entries} days={premium ? 365 : FREE_HISTORY_DAYS} />
            {!premium && <PremiumPaywall onUnlock={handleUnlock} />}
          </div>
        )}

        {tab === 'report' && (
          <div className="flex flex-col gap-5">
            {premium ? (
              <MonthlyReport entries={entries} />
            ) : (
              <PremiumPaywall onUnlock={handleUnlock} />
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm font-medium">{t.settings.membership}</p>
              <p className="mt-1 text-xs text-white/50">
                {premium ? t.settings.premiumActive : t.settings.freeActive}
              </p>
            </div>
            <ReminderSettingsPanel initial={getReminderSettings()} />
            <ProfileSettings initial={profile} onSave={setProfileState} />
            <button
              onClick={handleExport}
              disabled={!premium}
              className="rounded-2xl bg-white/5 py-3 text-sm font-medium disabled:opacity-30"
            >
              {t.settings.exportButton} {!premium && t.settings.exportPremiumSuffix}
            </button>
            {!premium && <PremiumPaywall onUnlock={handleUnlock} />}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#0f0f17]/95 backdrop-blur">
        {(
          [
            ['today', t.nav.today, '📝'],
            ['history', t.nav.history, '📅'],
            ['report', t.nav.report, '📊'],
            ['settings', t.nav.settings, '⚙️']
          ] as const
        ).map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
              tab === key ? 'text-vibe-400' : 'text-white/40'
            }`}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
