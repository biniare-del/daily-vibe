import { useI18n } from '../i18n'
import Card from './Card'
import AnimatedNumber from './AnimatedNumber'

interface Props {
  streak: number
  totalEntries: number
}

export default function Streak({ streak, totalEntries }: Props) {
  const { t } = useI18n()
  return (
    <div className="flex gap-3">
      <Card className="flex-1 text-center">
        <p className="text-3xl font-bold tracking-tight text-vibe-400">
          <span className="mr-1">🔥</span>
          <AnimatedNumber value={streak} />
        </p>
        <p className="mt-1 text-xs text-white/50">{t.streak.streakLabel}</p>
      </Card>
      <Card className="flex-1 text-center">
        <p className="text-3xl font-bold tracking-tight text-vibe-400">
          <span className="mr-1">📝</span>
          <AnimatedNumber value={totalEntries} />
        </p>
        <p className="mt-1 text-xs text-white/50">{t.streak.totalLabel}</p>
      </Card>
    </div>
  )
}
