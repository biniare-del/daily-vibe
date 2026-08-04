import type { EntryMap } from '../types'
import { getRoastMessage } from '../roast'
import { useI18n } from '../i18n'
import Card from './Card'

export default function RoastCard({ entries }: { entries: EntryMap }) {
  const { t } = useI18n()
  const message = getRoastMessage(entries, t)

  return (
    <Card accent="gold" className="bg-gradient-to-b from-gold-500/10 to-white/[0.04]">
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-white/40">{t.roast.title}</p>
      <p className="text-sm leading-relaxed">{message}</p>
    </Card>
  )
}
