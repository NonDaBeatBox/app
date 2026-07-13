import type { User } from '../types'

type Size = 'xs' | 'sm' | 'md' | 'lg'

const SIZES: Record<Size, string> = {
  xs: 'h-7 w-7 text-[11px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Readable text color for a given hex background (YIQ contrast). */
function readableOn(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150 ? '#2C1B38' : '#FFFFFF'
}

export function Avatar({
  user,
  size = 'md',
  ring = false,
  className = '',
}: {
  user: Pick<User, 'name' | 'avatar_color'>
  size?: Size
  ring?: boolean
  className?: string
}) {
  return (
    <div
      className={`inline-flex select-none items-center justify-center rounded-full font-bold font-display leading-none ${
        SIZES[size]
      } ${ring ? 'ring-2 ring-surface' : ''} ${className}`}
      style={{ backgroundColor: user.avatar_color, color: readableOn(user.avatar_color) }}
      aria-hidden="true"
    >
      {initials(user.name)}
    </div>
  )
}
