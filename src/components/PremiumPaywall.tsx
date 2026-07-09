interface Props {
  onUnlock: () => void
}

const PERKS = [
  '전체 기록 히스토리 무제한 열람',
  '월간 리포트 · 기분 트렌드 분석',
  '데이터 내보내기 (JSON 백업)',
  '커스텀 리마인더 시간 설정'
]

export default function PremiumPaywall({ onUnlock }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-vibe-600/20 to-white/5 p-5 text-center">
      <p className="text-3xl">✨</p>
      <h3 className="mt-2 text-lg font-semibold">데일리바이브 프리미엄</h3>
      <ul className="mx-auto mt-4 flex max-w-xs flex-col gap-2 text-left text-sm text-white/70">
        {PERKS.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-vibe-400">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-white/40">월 2,900원 · 언제든 해지 가능</p>
      <button
        onClick={onUnlock}
        className="mt-4 w-full rounded-xl bg-vibe-600 py-3 text-sm font-semibold active:scale-95"
      >
        프리미엄 체험하기 (데모)
      </button>
      <p className="mt-2 text-[11px] text-white/30">
        * 결제 연동 전 데모 버전입니다. 실제 서비스에는 Stripe/앱스토어 결제가 연결됩니다.
      </p>
    </div>
  )
}
