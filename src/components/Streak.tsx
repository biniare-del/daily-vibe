interface Props {
  streak: number
  totalEntries: number
}

export default function Streak({ streak, totalEntries }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 rounded-2xl bg-white/5 p-4 text-center">
        <p className="text-2xl font-bold text-vibe-400">🔥 {streak}</p>
        <p className="mt-1 text-xs text-white/50">연속 기록일</p>
      </div>
      <div className="flex-1 rounded-2xl bg-white/5 p-4 text-center">
        <p className="text-2xl font-bold text-vibe-400">📝 {totalEntries}</p>
        <p className="mt-1 text-xs text-white/50">총 기록 수</p>
      </div>
    </div>
  )
}
