import { useId } from 'react'
import type { User } from '../types'
import type { PulseState } from '../lib/compute'
import { Avatar } from './Avatar'

export interface RingMember {
  user: User
  checkedInToday: boolean
}

const STATE_META: Record<PulseState, { word: string; color: string }> = {
  rising: { word: 'rising', color: '#25BE86' },
  steady: { word: 'steady', color: '#FFB23E' },
  slipping: { word: 'slipping', color: '#FF6A5D' },
}

/**
 * The heartbeat of the app: a circular amber→green meter with each member's
 * avatar orbiting the ring (status dot = checked in today?), the pulse % and a
 * one-word state in the middle. Breathes gently unless reduced-motion is on.
 */
export function PulseRing({
  pulse,
  state,
  members,
  penalty = 0,
  size = 300,
}: {
  pulse: number
  state: PulseState
  members: RingMember[]
  penalty?: number
  size?: number
}) {
  const gid = useId()
  const meta = STATE_META[state]
  const R = 40 // ring radius in viewBox units (0..100)
  const clamped = Math.max(0, Math.min(100, pulse))

  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size, maxWidth: '82vw', aspectRatio: '1 / 1' }}
      role="img"
      aria-label={`Circle pulse ${clamped}%, ${meta.word}`}
    >
      {/* breathing group: ring + fills scale together */}
      <div className="absolute inset-0 animate-breathe motion-reduce:animate-none">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id={`grad-${gid}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFB23E" />
              <stop offset="55%" stopColor="#FF9E57" />
              <stop offset="100%" stopColor="#25BE86" />
            </linearGradient>
          </defs>
          {/* track */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#EFE3DB"
            strokeWidth="8"
          />
          {/* progress arc */}
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={`url(#grad-${gid})`}
            strokeWidth="8"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${clamped} 100`}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>

        {/* orbiting member avatars */}
        {members.map((m, i) => {
          const theta = (-90 + (360 / Math.max(members.length, 1)) * i) * (Math.PI / 180)
          const left = 50 + R * Math.cos(theta)
          const top = 50 + R * Math.sin(theta)
          return (
            <div
              key={m.user.id}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                <Avatar user={m.user} size="sm" ring />
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface"
                  style={{ backgroundColor: m.checkedInToday ? '#25BE86' : '#FFB23E' }}
                  title={m.checkedInToday ? 'Checked in today' : 'Pending today'}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* center readout (steady, not breathing, for legibility) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[42px] font-extrabold leading-none tracking-tight text-ink">
          {clamped}
          <span className="text-xl text-muted">%</span>
        </span>
        <span
          className="mt-1 text-sm font-bold lowercase tracking-wide"
          style={{ color: meta.color }}
        >
          {meta.word}
        </span>
        {penalty > 0 && (
          <span className="mt-1 rounded-full bg-coral/12 px-2 py-0.5 text-[10px] font-bold text-coral">
            −{penalty} · a miss stings for 24h
          </span>
        )}
      </div>
    </div>
  )
}
