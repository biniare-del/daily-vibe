import { useI18n } from '../i18n'

interface Props {
  onUnlock: () => void
}

export default function PremiumPaywall({ onUnlock }: Props) {
  const { t } = useI18n()
  return (
    <div className="rounded-2xl bg-gradient-to-b from-vibe-600/20 to-white/5 p-5 text-center">
      <p className="text-3xl">✨</p>
      <h3 className="mt-2 text-lg font-semibold">{t.paywall.title}</h3>
      <ul className="mx-auto mt-4 flex max-w-xs flex-col gap-2 text-left text-sm text-white/70">
        {t.paywall.perks.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-vibe-400">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-white/40">{t.paywall.price}</p>
      <button
        onClick={onUnlock}
        className="mt-4 w-full rounded-xl bg-vibe-600 py-3 text-sm font-semibold active:scale-95"
      >
        {t.paywall.ctaDemo}
      </button>
      <p className="mt-2 text-[11px] text-white/30">{t.paywall.disclaimer}</p>
    </div>
  )
}
