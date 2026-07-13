import type { ReactNode } from 'react'

export function StreakBadge({ streak, className = '' }: { streak: number; className?: string }) {
  if (streak <= 0)
    return (
      <span className={`text-xs font-semibold text-muted ${className}`}>no streak yet</span>
    )
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 text-xs font-bold text-ink ${className}`}
    >
      🔥 {streak} day{streak === 1 ? '' : 's'}
    </span>
  )
}

export function StatusPill({ done }: { done: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        done ? 'bg-green/15 text-green' : 'bg-amber/15 text-[#B7791F]'
      }`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: done ? '#25BE86' : '#FFB23E' }}
      />
      {done ? 'checked in today' : 'pending today'}
    </span>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{children}</p>
  )
}

export function EmptyState({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <div className="text-4xl">{emoji}</div>
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      <p className="max-w-[16rem] text-sm text-muted">{body}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
