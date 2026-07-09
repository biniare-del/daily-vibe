import { getDailyEnglish } from '../fortune'
import { useI18n } from '../i18n'
import Card from './Card'

export default function DailyEnglishCard() {
  const { t } = useI18n()
  const sentence = getDailyEnglish()

  return (
    <Card>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">{t.daily.englishTitle}</p>
      <p className="text-base font-medium leading-snug">{sentence.en}</p>
      <p className="mt-1 text-sm text-white/50">{sentence.ko}</p>
    </Card>
  )
}
