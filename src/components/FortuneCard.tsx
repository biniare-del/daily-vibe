import type { ReactNode } from 'react'
import type { Profile } from '../storage'
import { todayKey } from '../storage'
import { getLottoNumbers, getMbtiFortune, getZodiacFortune, getZodiacSign } from '../fortune'
import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  profile: Profile
}

function lottoBallColor(n: number): string {
  if (n <= 10) return 'bg-gradient-to-b from-yellow-400 to-yellow-600'
  if (n <= 20) return 'bg-gradient-to-b from-blue-400 to-blue-600'
  if (n <= 30) return 'bg-gradient-to-b from-red-400 to-red-600'
  if (n <= 40) return 'bg-gradient-to-b from-slate-400 to-slate-600'
  return 'bg-gradient-to-b from-green-400 to-green-600'
}

export default function FortuneCard({ profile }: Props) {
  const { t } = useI18n()
  const today = todayKey()
  const numbers = getLottoNumbers(today)

  let zodiacBlock: ReactNode = <p className="text-xs text-white/40">{t.daily.zodiacPrompt}</p>
  if (profile.birthday) {
    const [, m, d] = profile.birthday.split('-').map(Number)
    const sign = getZodiacSign(m, d)
    zodiacBlock = (
      <p className="text-sm">
        <span className="mr-1">{sign.emoji}</span>
        <span className="font-medium">{sign.name}</span>
        <span className="ml-2 text-white/60">{getZodiacFortune(sign.key)}</span>
      </p>
    )
  }

  let mbtiBlock: ReactNode = <p className="text-xs text-white/40">{t.daily.mbtiPrompt}</p>
  if (profile.mbti) {
    mbtiBlock = (
      <p className="text-sm">
        <span className="mr-2 font-medium">{profile.mbti}</span>
        <span className="text-white/60">{getMbtiFortune(profile.mbti)}</span>
      </p>
    )
  }

  return (
    <Card>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">{t.daily.fortuneTitle}</p>

      <div className="mb-3">
        <p className="mb-1.5 text-xs text-white/40">{t.daily.lottoLabel}</p>
        <div className="flex gap-2">
          {numbers.map((n) => (
            <span
              key={n}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${lottoBallColor(n)}`}
            >
              {n}
            </span>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-white/30">{t.daily.lottoDisclaimer}</p>
      </div>

      <div className="mb-3 border-t border-white/10 pt-3">{zodiacBlock}</div>
      <div className="border-t border-white/10 pt-3">{mbtiBlock}</div>
    </Card>
  )
}
