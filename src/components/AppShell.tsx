import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { BackIcon } from './icons'

/** The phone-shaped frame every screen lives inside. */
export function AppShell({
  children,
  nav = false,
  scroll = true,
}: {
  children: ReactNode
  nav?: boolean
  scroll?: boolean
}) {
  return (
    <div className="app-frame">
      <main
        className={`flex flex-1 flex-col ${
          scroll ? 'overflow-y-auto' : 'overflow-hidden'
        } ${nav ? 'pb-2' : ''}`}
      >
        {children}
      </main>
      {nav && <BottomNav />}
    </div>
  )
}

/** A reusable top bar with optional back button, title and right slot. */
export function TopBar({
  title,
  subtitle,
  back,
  right,
  onBack,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  back?: boolean
  right?: ReactNode
  onBack?: () => void
}) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-hairline bg-paper/90 px-4 py-3 backdrop-blur">
      {back && (
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="btn-ghost -ml-1 h-9 w-9 rounded-full !p-0"
          aria-label="Go back"
        >
          <BackIcon width={20} height={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="truncate font-display text-lg font-bold leading-tight text-ink">
            {title}
          </h1>
        )}
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
