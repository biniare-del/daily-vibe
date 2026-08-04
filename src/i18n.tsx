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
    noteLabel: string
    notePlaceholder: string
    exerciseQuestion: string
    expenseTitle: string
    expenseAmountPlaceholder: string
    expenseNotePlaceholder: string
    photoLabel: string
    photoAlt: string
    photoRemove: string
    saveDefault: string
    saveEdit: string
    saved: string
  }
  moodLabels: [string, string, string, string, string]
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
    times: string
    weeklyExercise: string
    weeklySpending: string
    avgSpending: string
    monthlySpending: string
  }
  reminder: {
    title: string
    onAt: (time: string) => string
    off: string
    permissionDenied: string
    footnote: string
  }
  settings: {
    exportButton: string
  }
  share: { button: string }
  daily: {
    englishTitle: string
    fortuneTitle: string
    lottoLabel: string
    lottoDisclaimer: string
    zodiacPrompt: string
    mbtiPrompt: string
  }
  profile: {
    title: string
    birthdayLabel: string
    mbtiLabel: string
    mbtiPlaceholder: string
    save: string
    saved: string
  }
  cloud: {
    title: string
    notConfigured: string
    signedOutDescription: string
    loginButton: string
    logoutButton: string
    syncing: string
    signedInAs: (email: string) => string
  }
  roast: {
    title: string
    noData: string[]
    noLow: string[]
    noOk: string[]
    someLow: string[]
    someOk: string[]
    goodLow: string[]
    goodOk: string[]
    highSpend: string[]
  }
}

const ko: Dict = {
  appName: '데일리바이브 ✨',
  appTagline: '오늘 하루를 짧게 기록해보세요',
  nav: { today: '오늘', history: '기록', report: '리포트', settings: '설정' },
  checkin: {
    moodQuestion: '오늘 기분이 어땠나요?',
    energyQuestion: '에너지 레벨은요?',
    noteLabel: '한 줄 일기',
    notePlaceholder: '오늘 있었던 일을 짧게 남겨보세요',
    exerciseQuestion: '오늘 운동했나요?',
    expenseTitle: '오늘의 지출',
    expenseAmountPlaceholder: '지출 금액',
    expenseNotePlaceholder: '어디에 썼나요?',
    photoLabel: '사진 한 장 (선택)',
    photoAlt: '오늘의 사진',
    photoRemove: '사진 삭제',
    saveDefault: '오늘의 일기 저장하기',
    saveEdit: '오늘 기록 수정하기',
    saved: '저장됐어요! ✅'
  },
  moodLabels: ['힘들었어요', '별로였어요', '그저그랬어요', '좋았어요', '최고였어요'],
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
    empty: '아직 기록이 없어요. 오늘 일기부터 남겨보세요!',
    avgMood: '평균 기분',
    avgEnergy: '평균 에너지',
    moodDistribution: '기분 분포',
    bestDay: '최고의 하루',
    moodByWeekday: '요일별 평균 기분',
    times: '회',
    weeklyExercise: '주간 운동 횟수',
    weeklySpending: '주간 지출',
    avgSpending: '일 평균 지출',
    monthlySpending: '이번 달 지출'
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
    exportButton: '데이터 내보내기 (JSON)'
  },
  share: { button: '오늘의 일기 공유하기 📤' },
  daily: {
    englishTitle: '오늘의 영어 한마디',
    fortuneTitle: '오늘의 운세',
    lottoLabel: '오늘의 행운 번호',
    lottoDisclaimer: '* 재미로만 봐주세요. 실제 로또 당첨 번호가 아니에요.',
    zodiacPrompt: '생일을 입력하면 별자리 운세를 볼 수 있어요',
    mbtiPrompt: 'MBTI를 입력하면 오늘의 한마디를 볼 수 있어요'
  },
  profile: {
    title: '프로필',
    birthdayLabel: '생일 (별자리 운세용)',
    mbtiLabel: 'MBTI',
    mbtiPlaceholder: '선택 안 함',
    save: '저장하기',
    saved: '저장됐어요! ✅'
  },
  cloud: {
    title: '클라우드 백업',
    notConfigured: '클라우드 백업이 아직 설정되지 않았어요.',
    signedOutDescription: '구글로 로그인하면 기기를 바꿔도 기록이 유지돼요.',
    loginButton: '구글로 로그인',
    logoutButton: '로그아웃',
    syncing: '동기화 중...',
    signedInAs: (email) => `${email} 로 백업 중`
  },
  roast: {
    title: '이번 주 한마디',
    noData: [
      '아직 이번 주 기록이 없어요. 일단 오늘부터 남겨봐요.',
      '기록이 없으면 저도 할 말이 없어요. 오늘 하나 써보세요.'
    ],
    noLow: [
      '이번 주 운동 0번, 기분도 바닥이네요. 몸을 움직이면 기분도 따라 움직여요.',
      '운동은 안 하고 기분 탓만 하고 계신 건 아니죠?',
      '운동 기록이 없어요. 우울할 자격은 충분한데, 원인 제공도 본인 몫이에요.'
    ],
    noOk: [
      '운동은 0번인데 기분은 나쁘지 않네요. 다음 주엔 몸도 좀 챙겨봐요.',
      '기분은 괜찮지만 운동 기록이 텅 비었어요. 오래는 못 갈 수도 있어요.',
      '지금은 버티고 있지만, 운동 없이 이 컨디션이 계속될 거란 보장은 없어요.'
    ],
    someLow: [
      '운동은 하고 있는데 기분은 아직이네요. 조금만 더 버텨봐요.',
      '노력은 하고 있어요. 결과가 더디게 오는 것뿐이에요.',
      '운동만으로 기분이 다 해결되진 않아요. 그래도 계속하는 게 맞아요.'
    ],
    someOk: [
      '운동도 어느 정도 하고 기분도 나쁘지 않아요. 나쁘지 않은 한 주예요.',
      '딱 무난한 한 주네요. 그거면 충분해요.',
      '이 정도면 준수해요. 더 잘하려고 애쓰지 않아도 돼요.'
    ],
    goodLow: [
      '운동은 열심히 했는데 기분은 안 따라오네요. 다른 데 원인이 있을 수도 있어요.',
      '몸은 챙겼는데 마음이 안 따라오는 한 주였네요.',
      '운동량은 충분해요. 이제 다른 걸 좀 돌아볼 차례예요.'
    ],
    goodOk: [
      '운동도 하고 기분도 좋고, 이번 주는 제법 잘 살고 계시네요.',
      '이 페이스 유지만 해도 충분해요.',
      '몸도 마음도 균형 잡힌 한 주였어요. 그대로 가봐요.'
    ],
    highSpend: [
      '이번 주 지출이 꽤 크네요. 그만한 가치가 있었길 바라요.',
      '지갑이 이번 주 제일 고생했겠어요.',
      '돈을 많이 쓴 주에는 꼭 이유를 하나쯤 남겨두세요, 나중에 후회 안 하게.'
    ]
  }
}

const en: Dict = {
  appName: 'Daily Vibe ✨',
  appTagline: 'A short daily diary',
  nav: { today: 'Today', history: 'History', report: 'Report', settings: 'Settings' },
  checkin: {
    moodQuestion: 'How was your day?',
    energyQuestion: "What's your energy level?",
    noteLabel: 'One-line diary',
    notePlaceholder: 'Jot down something about today',
    exerciseQuestion: 'Did you exercise today?',
    expenseTitle: "Today's spending",
    expenseAmountPlaceholder: 'Amount spent',
    expenseNotePlaceholder: 'What was it for?',
    photoLabel: 'Add a photo (optional)',
    photoAlt: "Today's photo",
    photoRemove: 'Remove photo',
    saveDefault: "Save today's diary",
    saveEdit: "Update today's entry",
    saved: 'Saved! ✅'
  },
  moodLabels: ['Rough', 'Meh', 'Okay', 'Good', 'Amazing'],
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
    empty: 'No entries yet. Start with today!',
    avgMood: 'Avg mood',
    avgEnergy: 'Avg energy',
    moodDistribution: 'Mood distribution',
    bestDay: 'Best day',
    moodByWeekday: 'Mood by weekday',
    times: 'times',
    weeklyExercise: 'Exercise this week',
    weeklySpending: 'Spending this week',
    avgSpending: 'Avg daily spending',
    monthlySpending: 'Spending this month'
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
    exportButton: 'Export data (JSON)'
  },
  share: { button: "Share today's diary 📤" },
  daily: {
    englishTitle: 'Phrase of the day',
    fortuneTitle: "Today's fortune",
    lottoLabel: "Today's lucky numbers",
    lottoDisclaimer: '* For fun only — not real lottery numbers.',
    zodiacPrompt: 'Add your birthday to see your zodiac fortune',
    mbtiPrompt: 'Add your MBTI to see a daily one-liner'
  },
  profile: {
    title: 'Profile',
    birthdayLabel: 'Birthday (for zodiac fortune)',
    mbtiLabel: 'MBTI',
    mbtiPlaceholder: 'Not set',
    save: 'Save',
    saved: 'Saved! ✅'
  },
  cloud: {
    title: 'Cloud backup',
    notConfigured: 'Cloud backup isn\'t configured yet.',
    signedOutDescription: 'Sign in with Google to keep your entries when you switch devices.',
    loginButton: 'Sign in with Google',
    logoutButton: 'Sign out',
    syncing: 'Syncing...',
    signedInAs: (email) => `Backed up as ${email}`
  },
  roast: {
    title: 'This week, straight talk',
    noData: [
      "No entries yet this week. Start with today.",
      "Can't say much with no data. Write one today."
    ],
    noLow: [
      "Zero workouts this week, and your mood shows it. Moving your body tends to move your mood too.",
      "Blaming your mood while skipping every workout, are we?",
      "No exercise logged. Fair enough to feel low — but you had a hand in that."
    ],
    noOk: [
      "Zero workouts, but mood's holding up. Might want to move a bit next week.",
      "Mood's fine, but your exercise log is empty. That won't last forever.",
      "You're coasting fine for now, but there's no guarantee it holds without moving."
    ],
    someLow: [
      "You're putting in some effort, mood just hasn't caught up. Stick with it.",
      "The effort is there. Results are just running behind.",
      "Exercise alone won't fix everything, but keep going anyway."
    ],
    someOk: [
      "Some exercise, decent mood. Not a bad week.",
      "Perfectly average week. That's plenty.",
      "This is solid. No need to push harder."
    ],
    goodLow: [
      "You worked out plenty, but your mood didn't follow. Might be something else going on.",
      "Body's taken care of, mind didn't quite catch up this week.",
      "Exercise is covered. Time to look at what else is going on."
    ],
    goodOk: [
      "Exercising and feeling good — you're living pretty well this week.",
      "Keep this pace and you're set.",
      "Body and mind both in balance this week. Stay on it."
    ],
    highSpend: [
      "You spent a lot this week. Hope it was worth it.",
      "Your wallet had the roughest week of anyone.",
      "On big-spending weeks, always jot down why — future you will thank you."
    ]
  }
}

const ja: Dict = {
  appName: 'デイリーバイブ ✨',
  appTagline: '今日一日を短く記録しよう',
  nav: { today: '今日', history: '記録', report: 'レポート', settings: '設定' },
  checkin: {
    moodQuestion: '今日の気分はどうでしたか?',
    energyQuestion: 'エネルギーレベルは?',
    noteLabel: '一行日記',
    notePlaceholder: '今日あったことを短く残してみましょう',
    exerciseQuestion: '今日運動しましたか?',
    expenseTitle: '今日の支出',
    expenseAmountPlaceholder: '支出金額',
    expenseNotePlaceholder: '何に使いましたか?',
    photoLabel: '写真を1枚(任意)',
    photoAlt: '今日の写真',
    photoRemove: '写真を削除',
    saveDefault: '今日の日記を保存',
    saveEdit: '今日の記録を更新',
    saved: '保存しました! ✅'
  },
  moodLabels: ['つらかった', 'いまいちだった', 'ふつうだった', 'よかった', '最高だった'],
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
    empty: 'まだ記録がありません。今日から始めましょう!',
    avgMood: '平均気分',
    avgEnergy: '平均エネルギー',
    moodDistribution: '気分の分布',
    bestDay: 'ベストな日',
    moodByWeekday: '曜日別の平均気分',
    times: '回',
    weeklyExercise: '今週の運動回数',
    weeklySpending: '今週の支出',
    avgSpending: '1日の平均支出',
    monthlySpending: '今月の支出'
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
    exportButton: 'データ書き出し(JSON)'
  },
  share: { button: '今日の日記を共有 📤' },
  daily: {
    englishTitle: '今日の英語ひとこと',
    fortuneTitle: '今日の運勢',
    lottoLabel: '今日のラッキーナンバー',
    lottoDisclaimer: '※ 楽しみ用です。実際の宝くじの当選番号ではありません。',
    zodiacPrompt: '誕生日を入力すると星座の運勢が見られます',
    mbtiPrompt: 'MBTIを入力すると今日のひとことが見られます'
  },
  profile: {
    title: 'プロフィール',
    birthdayLabel: '誕生日(星座占い用)',
    mbtiLabel: 'MBTI',
    mbtiPlaceholder: '未設定',
    save: '保存',
    saved: '保存しました! ✅'
  },
  cloud: {
    title: 'クラウドバックアップ',
    notConfigured: 'クラウドバックアップはまだ設定されていません。',
    signedOutDescription: 'Googleでログインすると、機種変更しても記録が保持されます。',
    loginButton: 'Googleでログイン',
    logoutButton: 'ログアウト',
    syncing: '同期中...',
    signedInAs: (email) => `${email} でバックアップ中`
  },
  roast: {
    title: '今週のひとこと',
    noData: ['今週の記録がまだありません。今日から始めましょう。', '記録がないと何も言えません。今日1つ書いてみて。'],
    noLow: [
      '今週の運動0回、気分も低調ですね。体を動かせば気分も動きますよ。',
      '運動はせずに気分のせいにしていませんか?',
      '運動記録がありません。落ち込む理由は十分ですが、原因の一部は自分にもありますよ。'
    ],
    noOk: [
      '運動は0回ですが気分は悪くないですね。来週は体も動かしてみて。',
      '気分は大丈夫でも運動記録は空っぽです。ずっとは続かないかも。',
      '今はなんとかなっていても、運動なしでこの調子が続く保証はありません。'
    ],
    someLow: [
      '運動はしているのに気分はまだですね。もう少し頑張ってみて。',
      '努力はしています。結果が遅れて来るだけです。',
      '運動だけで気分が全部解決するわけではないけど、続ける価値はあります。'
    ],
    someOk: [
      '運動もそこそこ、気分も悪くない。悪くない一週間です。',
      'ちょうど無難な一週間ですね。それで十分です。',
      'これくらいで上出来です。無理しなくて大丈夫。'
    ],
    goodLow: [
      '運動は頑張ったのに気分はついてきませんでしたね。他に原因があるかも。',
      '体はケアできたけど心が追いつかない一週間でした。',
      '運動量は十分です。そろそろ他のことにも目を向ける番です。'
    ],
    goodOk: [
      '運動もして気分も良い、なかなか良い一週間ですね。',
      'このペースを維持するだけで十分です。',
      '体も心もバランスの取れた一週間でした。そのまま続けて。'
    ],
    highSpend: [
      '今週の支出はかなり大きいですね。それだけの価値があったと願います。',
      '今週一番頑張ったのは財布かもしれません。',
      '出費が多い週は理由を一つメモしておくと、後で後悔しませんよ。'
    ]
  }
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
