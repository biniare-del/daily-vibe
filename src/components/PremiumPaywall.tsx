import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  onUnlock: () => void
}

export default function PremiumPaywall({ onUnlock }: Props) {
  const { t } = useI18n()
  return (
    <Card accent="gold" className="bg-gradient-to-b from-gold-500/10 to-white/[0.04] text-center">
      <p className="text-3xl">✨</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{t.paywall.title}</h3>
      <ul className="mx-auto mt-4 flex max-w-xs flex-col gap-2 text-left text-sm text-white/70">
        {t.paywall.perks.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-gold-400">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-white/40">{t.paywall.price}</p>
      <button
        onClick={onUnlock}
        className="relative mt-4 w-full overflow-hidden rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 py-3 text-sm font-semibold text-black shadow-goldGlow transition active:scale-95"
      >
        <span className="relative z-10">{t.paywall.ctaDemo}</span>
        <span className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </button>
      <p className="mt-2 text-[11px] text-white/30">{t.paywall.disclaimer}</p>
    </Card>
  )
}
