import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'ko' | 'en' | 'ja'

const LANGS: Lang[] = ['ko', 'en', 'ja']
const LANG_FLAG: Record<Lang, string> = { ko: '🇰🇷', en: '🇺🇸', ja: '🇯🇵' }
const LANG_CODE: Record<Lang, string> = { ko: 'KO', en: 'EN', ja: 'JA' }

export interface Dict {
  appName: string
  appTagline: string
  nav: { today: string; history: string; report: string; settings: string }
  checkin: {
    moodQuestion: string
    energyQuestion: string
    tagQuestion: string
    noteLabel: string
    notePlaceholder: string
    photoLabel: string
    photoAlt: string
    photoRemove: string
    saveDefault: string
    saveEdit: string
    saved: string
  }
  moodLabels: [string, string, string, string, string]
  tags: [string, string, string, string, string, string, string, string]
  weekdays: [string, string, string, string, string, string, string]
  streak: { streakLabel: string; totalLabel: string }
  weekly: {
    title: string
    summaryLine: (avg: string, count: number) => string
    noLastWeek: string
    up: (delta: string) => string
    down: (delta: string) => string
    flat: string
  }
  history: { recentDays: (n: number) => string }
  report: {
    empty: string
    avgMood: string
    avgEnergy: string
    moodDistribution: string
    bestDay: string
    moodByWeekday: string
    moodByTag: string
    times: string
  }
  paywall: {
    title: string
    perks: [string, string, string, string]
    price: string
    ctaDemo: string
    disclaimer: string
  }
  reminder: {
    title: string
    onAt: (time: string) => string
    off: string
    permissionDenied: string
    footnote: string
  }
  settings: {
    membership: string
    premiumActive: string
    freeActive: string
    exportButton: string
    exportPremiumSuffix: string
  }
  share: { button: string }
}

const ko: Dict = {
  appName: '데일리바이브 ✨',
  appTagline: '오늘의 기분과 에너지를 기록해보세요',
  nav: { today: '오늘', history: '기록', report: '리포트', settings: '설정' },
  checkin: {
    moodQuestion: '오늘 기분은 어때요?',
    energyQuestion: '에너지 레벨은요?',
    tagQuestion: '오늘에 태그를 붙여볼까요? (선택)',
    noteLabel: '한 줄 메모 (선택)',
    notePlaceholder: '오늘 있었던 일을 짧게 남겨보세요',
    photoLabel: '사진 한 장 (선택)',
    photoAlt: '오늘의 사진',
    photoRemove: '사진 삭제',
    saveDefault: '오늘의 바이브 저장하기',
    saveEdit: '오늘 기록 수정하기',
    saved: '저장됐어요! ✅'
  },
  moodLabels: ['힘들어요', '별로예요', '그저그래요', '좋아요', '최고예요'],
  tags: ['운동', '일/공부', '친구', '가족', '휴식', '연애', '건강', '기타'],
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  streak: { streakLabel: '연속 기록일', totalLabel: '총 기록 수' },
  weekly: {
    title: '이번 주 요약',
    summaryLine: (avg, count) => `평균 기분 ${avg} / 5 · ${count}일 기록`,
    noLastWeek: '지난주 기록이 없어서 비교할 수 없어요',
    up: (d) => `지난주보다 기분이 좋아졌어요 (+${d})`,
    down: (d) => `지난주보다 기분이 가라앉았어요 (${d})`,
    flat: '지난주와 비슷한 흐름이에요'
  },
  history: { recentDays: (n) => `최근 ${n}일` },
  report: {
    empty: '아직 기록이 없어요. 체크인을 시작해보세요!',
    avgMood: '평균 기분',
    avgEnergy: '평균 에너지',
    moodDistribution: '기분 분포',
    bestDay: '최고의 하루',
    moodByWeekday: '요일별 평균 기분',
    moodByTag: '태그별 평균 기분',
    times: '회'
  },
  paywall: {
    title: '데일리바이브 프리미엄',
    perks: [
      '전체 기록 히스토리 무제한 열람',
      '월간 리포트 · 기분 트렌드 분석',
      '데이터 내보내기 (JSON 백업)',
      '커스텀 리마인더 시간 설정'
    ],
    price: '월 2,900원 · 언제든 해지 가능',
    ctaDemo: '프리미엄 체험하기 (데모)',
    disclaimer: '* 결제 연동 전 데모 버전입니다. 실제 서비스에는 Stripe/앱스토어 결제가 연결됩니다.'
  },
  reminder: {
    title: '매일 리마인더',
    onAt: (t) => `매일 ${t}에 알림`,
    off: '알림 꺼짐',
    permissionDenied: '브라우저 알림 권한이 차단되어 있어요. 기기 설정에서 허용해주세요.',
    footnote:
      '* 앱이 열려 있을 때 기준으로 확인하는 방식이에요. 앱을 완전히 꺼도 알림이 오게 하려면 서버 기반 푸시(Web Push) 연동이 필요해요.'
  },
  settings: {
    membership: '멤버십',
    premiumActive: '프리미엄 이용 중 ✨',
    freeActive: '무료 플랜 이용 중',
    exportButton: '데이터 내보내기 (JSON)',
    exportPremiumSuffix: '· 프리미엄'
  },
  share: { button: '오늘의 바이브 공유하기 📤' }
}

const en: Dict = {
  appName: 'Daily Vibe ✨',
  appTagline: "Track today's mood and energy",
  nav: { today: 'Today', history: 'History', report: 'Report', settings: 'Settings' },
  checkin: {
    moodQuestion: 'How are you feeling today?',
    energyQuestion: "What's your energy level?",
    tagQuestion: 'Add a tag? (optional)',
    noteLabel: 'Quick note (optional)',
    notePlaceholder: 'Jot down something about today',
    photoLabel: 'Add a photo (optional)',
    photoAlt: "Today's photo",
    photoRemove: 'Remove photo',
    saveDefault: "Save today's vibe",
    saveEdit: "Update today's entry",
    saved: 'Saved! ✅'
  },
  moodLabels: ['Rough', 'Meh', 'Okay', 'Good', 'Amazing'],
  tags: ['Exercise', 'Work/Study', 'Friends', 'Family', 'Rest', 'Love', 'Health', 'Other'],
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  streak: { streakLabel: 'Day streak', totalLabel: 'Total entries' },
  weekly: {
    title: 'This week',
    summaryLine: (avg, count) => `Avg mood ${avg} / 5 · ${count} ${count === 1 ? 'entry' : 'entries'}`,
    noLastWeek: 'No data from last week to compare',
    up: (d) => `Feeling better than last week (+${d})`,
    down: (d) => `A bit lower than last week (${d})`,
    flat: 'About the same as last week'
  },
  history: { recentDays: (n) => `Last ${n} days` },
  report: {
    empty: 'No entries yet. Start your first check-in!',
    avgMood: 'Avg mood',
    avgEnergy: 'Avg energy',
    moodDistribution: 'Mood distribution',
    bestDay: 'Best day',
    moodByWeekday: 'Mood by weekday',
    moodByTag: 'Mood by tag',
    times: 'times'
  },
  paywall: {
    title: 'Daily Vibe Premium',
    perks: [
      'Unlimited full history',
      'Monthly report & mood trends',
      'Export data (JSON backup)',
      'Custom reminder time'
    ],
    price: '$2.99/mo · cancel anytime',
    ctaDemo: 'Try Premium (demo)',
    disclaimer: '* Demo unlock before payments are wired up. Real billing will use Stripe/app store.'
  },
  reminder: {
    title: 'Daily reminder',
    onAt: (t) => `Reminder at ${t} daily`,
    off: 'Reminder off',
    permissionDenied: 'Notifications are blocked. Please allow them in device settings.',
    footnote:
      '* Only works while the app is open. True background push needs a server (Web Push).'
  },
  settings: {
    membership: 'Membership',
    premiumActive: 'Premium active ✨',
    freeActive: 'Free plan',
    exportButton: 'Export data (JSON)',
    exportPremiumSuffix: '· Premium'
  },
  share: { button: "Share today's vibe 📤" }
}

const ja: Dict = {
  appName: 'デイリーバイブ ✨',
  appTagline: '今日の気分とエネルギーを記録しよう',
  nav: { today: '今日', history: '記録', report: 'レポート', settings: '設定' },
  checkin: {
    moodQuestion: '今日の気分はどうですか?',
    energyQuestion: 'エネルギーレベルは?',
    tagQuestion: 'タグを付けますか?(任意)',
    noteLabel: 'ひとことメモ(任意)',
    notePlaceholder: '今日あったことを短く残してみましょう',
    photoLabel: '写真を1枚(任意)',
    photoAlt: '今日の写真',
    photoRemove: '写真を削除',
    saveDefault: '今日のバイブを保存',
    saveEdit: '今日の記録を更新',
    saved: '保存しました! ✅'
  },
  moodLabels: ['つらい', 'いまいち', 'ふつう', 'いいね', '最高'],
  tags: ['運動', '仕事/勉強', '友達', '家族', '休息', '恋愛', '健康', 'その他'],
  weekdays: ['日', '月', '火', '水', '木', '金', '土'],
  streak: { streakLabel: '連続記録日数', totalLabel: '総記録数' },
  weekly: {
    title: '今週のまとめ',
    summaryLine: (avg, count) => `平均気分 ${avg} / 5 ・ ${count}日記録`,
    noLastWeek: '先週の記録がないため比較できません',
    up: (d) => `先週より気分が良くなっています (+${d})`,
    down: (d) => `先週より気分が落ちています (${d})`,
    flat: '先週と同じくらいです'
  },
  history: { recentDays: (n) => `直近${n}日間` },
  report: {
    empty: 'まだ記録がありません。チェックインを始めましょう!',
    avgMood: '平均気分',
    avgEnergy: '平均エネルギー',
    moodDistribution: '気分の分布',
    bestDay: 'ベストな日',
    moodByWeekday: '曜日別の平均気分',
    moodByTag: 'タグ別の平均気分',
    times: '回'
  },
  paywall: {
    title: 'デイリーバイブ プレミアム',
    perks: [
      '全履歴を無制限に閲覧',
      '月間レポート・気分トレンド分析',
      'データ書き出し(JSONバックアップ)',
      'リマインダー時間のカスタム設定'
    ],
    price: '月額390円・いつでも解約可能',
    ctaDemo: 'プレミアムを試す(デモ)',
    disclaimer: '※ 決済連携前のデモ版です。実際のサービスではStripe/アプリストア決済と連携します。'
  },
  reminder: {
    title: '毎日のリマインダー',
    onAt: (t) => `毎日${t}に通知`,
    off: '通知オフ',
    permissionDenied: '通知の権限がブロックされています。端末の設定で許可してください。',
    footnote:
      '※ アプリを開いている時のみ動作します。完全なバックグラウンド通知にはサーバー側のプッシュ(Web Push)連携が必要です。'
  },
  settings: {
    membership: 'メンバーシップ',
    premiumActive: 'プレミアム利用中 ✨',
    freeActive: '無料プラン利用中',
    exportButton: 'データ書き出し(JSON)',
    exportPremiumSuffix: '・プレミアム'
  },
  share: { button: '今日のバイブを共有 📤' }
}

const dictionaries: Record<Lang, Dict> = { ko, en, ja }

const STORAGE_KEY = 'daily-vibe:lang'

interface I18nContextValue {
  lang: Lang
  t: Dict
  cycleLang: () => void
  code: string
  flag: string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function loadLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ko' || stored === 'en' || stored === 'ja') return stored
  return 'ko'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(loadLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const cycleLang = () => {
    const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]
    setLang(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  const value: I18nContextValue = { lang, t: dictionaries[lang], cycleLang, code: LANG_CODE[lang], flag: LANG_FLAG[lang] }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
