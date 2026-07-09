import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  accent?: 'default' | 'gold'
}

export default function Card({ children, className = '', accent = 'default' }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-card backdrop-blur-xl ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          accent === 'gold' ? 'via-gold-400/70' : 'via-white/30'
        }`}
      />
      {children}
    </div>
  )
}
