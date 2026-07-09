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
import Card from './components/Card'
import AmbientBackground from './components/AmbientBackground'
import { FREE_HISTORY_DAYS } from './types'
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

const TABS: { key: Tab; icon: string }[] = [
  { key: 'today', icon: '📝' },
  { key: 'history', icon: '📅' },
  { key: 'report', icon: '📊' },
  { key: 'settings', icon: '⚙️' }
]

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

  const activeIndex = TABS.findIndex((item) => item.key === tab)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col text-white">
      <AmbientBackground mood={todayEntry?.mood ?? 3} />

      <header className="flex items-center justify-between px-5 pb-3 pt-6">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" className="drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <defs>
              <linearGradient id="logo-g" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0" stopColor="#c4b5fd" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#logo-g)" />
            <circle cx="13" cy="13" r="1.8" fill="white" />
            <circle cx="19" cy="13" r="1.8" fill="white" />
            <path d="M11 18c1.6 2 3.4 2.9 5 2.9s3.4-.9 5-2.9" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{t.appName.replace(' ✨', '')}</h1>
            <p className="text-[11px] text-white/40">{t.appTagline}</p>
          </div>
        </div>
        <button
          onClick={cycleLang}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium backdrop-blur-xl transition active:scale-95"
          aria-label="switch language"
        >
          <span>{flag}</span>
          <span className="text-white/70">{code}</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-2">
        <div key={tab} className="flex flex-col gap-4 animate-fadeInUp">
          {tab === 'today' && (
            <>
              <Streak streak={streak} totalEntries={totalEntries} />
              <WeeklySummary entries={entries} />
              <DailyEnglishCard />
              <FortuneCard profile={profile} />
              <CheckIn existing={todayEntry} onSave={handleSave} />
              {todayEntry && (
                <button
                  onClick={() => shareEntry(todayEntry)}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-sm font-medium backdrop-blur-xl transition active:scale-95"
                >
                  {t.share.button}
                </button>
              )}
            </>
          )}

          {tab === 'history' && (
            <>
              <Card>
                <HistoryHeatmap entries={entries} days={premium ? 365 : FREE_HISTORY_DAYS} />
              </Card>
              {!premium && <PremiumPaywall onUnlock={handleUnlock} />}
            </>
          )}

          {tab === 'report' && (
            <>
              {premium ? (
                <MonthlyReport entries={entries} />
              ) : (
                <PremiumPaywall onUnlock={handleUnlock} />
              )}
            </>
          )}

          {tab === 'settings' && (
            <>
              <Card>
                <p className="text-sm font-medium">{t.settings.membership}</p>
                <p className="mt-1 text-xs text-white/50">
                  {premium ? t.settings.premiumActive : t.settings.freeActive}
                </p>
              </Card>
              <ReminderSettingsPanel initial={getReminderSettings()} />
              <ProfileSettings initial={profile} onSave={setProfileState} />
              <button
                onClick={handleExport}
                disabled={!premium}
                className="rounded-2xl border border-white/10 bg-white/[0.06] py-3 text-sm font-medium backdrop-blur-xl transition disabled:opacity-30"
              >
                {t.settings.exportButton} {!premium && t.settings.exportPremiumSuffix}
              </button>
              {!premium && <PremiumPaywall onUnlock={handleUnlock} />}
            </>
          )}
        </div>
      </main>

      <nav className="fixed bottom-4 left-1/2 flex w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/10 bg-white/[0.06] p-1.5 shadow-card backdrop-blur-xl">
        <div
          className="absolute inset-y-1.5 rounded-2xl bg-white/10 transition-all duration-300 ease-out"
          style={{ width: `calc(${100 / TABS.length}% - 6px)`, left: `calc(${(activeIndex * 100) / TABS.length}% + 6px)` }}
        />
        {TABS.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative z-10 flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] transition ${
              tab === key ? 'text-white' : 'text-white/40'
            }`}
          >
            <span className="text-lg">{icon}</span>
            {t.nav[key]}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
