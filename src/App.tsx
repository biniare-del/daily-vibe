import { useEffect, useMemo, useState } from 'react'
import CheckIn from './components/CheckIn'
import Streak from './components/Streak'
import HistoryHeatmap from './components/HistoryHeatmap'
import MonthlyReport from './components/MonthlyReport'
import PremiumPaywall from './components/PremiumPaywall'
import { FREE_HISTORY_DAYS } from './types'
import { calcStreak, isPremium, loadEntries, saveEntry, setPremium, sortedDates, todayKey } from './storage'

type Tab = 'today' | 'history' | 'report' | 'settings'

function App() {
  const [entries, setEntries] = useState(loadEntries())
  const [premium, setPremiumState] = useState(isPremium())
  const [tab, setTab] = useState<Tab>('today')

  const streak = useMemo(() => calcStreak(entries), [entries])
  const totalEntries = useMemo(() => sortedDates(entries).length, [entries])
  const today = todayKey()

  const handleSave = (mood: number, energy: number, note: string) => {
    const next = saveEntry({ date: today, mood, energy, note, createdAt: Date.now() })
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
    document.title = '데일리바이브 · Daily Vibe'
  }, [])

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#0f0f17] text-white">
      <header className="px-5 pb-2 pt-6">
        <h1 className="text-xl font-bold">데일리바이브 ✨</h1>
        <p className="text-xs text-white/40">오늘의 기분과 에너지를 기록해보세요</p>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-24 pt-2">
        {tab === 'today' && (
          <div className="flex flex-col gap-5">
            <Streak streak={streak} totalEntries={totalEntries} />
            <CheckIn existing={entries[today]} onSave={handleSave} />
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
              <p className="text-sm font-medium">멤버십</p>
              <p className="mt-1 text-xs text-white/50">
                {premium ? '프리미엄 이용 중 ✨' : '무료 플랜 이용 중'}
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={!premium}
              className="rounded-2xl bg-white/5 py-3 text-sm font-medium disabled:opacity-30"
            >
              데이터 내보내기 (JSON) {!premium && '· 프리미엄'}
            </button>
            {!premium && <PremiumPaywall onUnlock={handleUnlock} />}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#0f0f17]/95 backdrop-blur">
        {(
          [
            ['today', '오늘', '📝'],
            ['history', '기록', '📅'],
            ['report', '리포트', '📊'],
            ['settings', '설정', '⚙️']
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
