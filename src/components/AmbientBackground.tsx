const MOOD_BLOBS: [string, string][] = [
  ['#334155', '#1e293b'], // 힘들어요 — cool slate
  ['#3730a3', '#1e1b4b'], // 별로예요 — indigo
  ['#6d28d9', '#1e1b4b'], // 그저그래요 — violet
  ['#9333ea', '#312e81'], // 좋아요 — warm violet
  ['#d946ef', '#7c3aed'] // 최고예요 — vibrant fuchsia
]

export default function AmbientBackground({ mood }: { mood: number }) {
  const [c1, c2] = MOOD_BLOBS[mood - 1] ?? MOOD_BLOBS[2]

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div
        className="absolute -left-24 -top-32 h-80 w-80 rounded-full opacity-50 blur-3xl transition-colors duration-1000 animate-drift"
        style={{ background: `radial-gradient(circle, ${c1}, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full opacity-40 blur-3xl transition-colors duration-1000 animate-driftSlow"
        style={{ background: `radial-gradient(circle, ${c2}, transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/80" />
    </div>
  )
}
