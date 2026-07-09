import { getDailyEnglish } from '../fortune'
import { useI18n } from '../i18n'

export default function DailyEnglishCard() {
  const { t } = useI18n()
  const sentence = getDailyEnglish()

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <p className="mb-2 text-xs font-medium text-white/50">{t.daily.englishTitle}</p>
      <p className="text-base font-medium">{sentence.en}</p>
      <p className="mt-1 text-sm text-white/50">{sentence.ko}</p>
    </div>
  )
}
