import type { ReactNode } from 'react'
import type { Profile } from '../storage'
import { todayKey } from '../storage'
import { getLottoNumbers, getMbtiFortune, getZodiacFortune, getZodiacSign } from '../fortune'
import { useI18n } from '../i18n'

interface Props {
  profile: Profile
}

function lottoBallColor(n: number): string {
  if (n <= 10) return 'bg-yellow-500'
  if (n <= 20) return 'bg-blue-500'
  if (n <= 30) return 'bg-red-500'
  if (n <= 40) return 'bg-slate-500'
  return 'bg-green-500'
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
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="mb-2 text-xs font-medium text-white/50">{t.daily.fortuneTitle}</p>

      <div className="mb-3">
        <p className="mb-1.5 text-xs text-white/40">{t.daily.lottoLabel}</p>
        <div className="flex gap-2">
          {numbers.map((n) => (
            <span
              key={n}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${lottoBallColor(n)}`}
            >
              {n}
            </span>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-white/30">{t.daily.lottoDisclaimer}</p>
      </div>

      <div className="mb-3 border-t border-white/10 pt-3">{zodiacBlock}</div>
      <div className="border-t border-white/10 pt-3">{mbtiBlock}</div>
    </div>
  )
}
