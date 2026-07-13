import type { LoadZone } from '../lib/compute'

const ZONE_META: Record<LoadZone, { word: string; color: string; emoji: string }> = {
  easy: { word: 'Easy', color: '#25BE86', emoji: '🌿' },
  sustainable: { word: 'Sustainable', color: '#FFB23E', emoji: '⚖️' },
  stretched: { word: 'Stretched', color: '#FF6A5D', emoji: '🔥' },
}

const SCALE_MAX = 21 // soft cap for the bar (≈ heavy multi-circle load)

export function zoneMeta(zone: LoadZone) {
  return ZONE_META[zone]
}

/** Small tappable pill: gradient bar + zone word. */
export function LoadMini({ zone, total }: { zone: LoadZone; total: number }) {
  const meta = ZONE_META[zone]
  const pct = Math.min(100, (total / SCALE_MAX) * 100)
  return (
    <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold leading-none" style={{ color: meta.color }}>
          {meta.word}
        </span>
      </div>
      <div className="relative h-1.5 w-12 overflow-hidden rounded-full bg-hairline">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#25BE86,#FFB23E 60%,#FF6A5D)',
          }}
        />
      </div>
    </div>
  )
}

/** Big gradient bar with a moving marker, for the Load screen. */
export function LoadBarFull({ total }: { zone?: LoadZone; total: number }) {
  const pct = Math.min(100, (total / SCALE_MAX) * 100)
  return (
    <div>
      <div className="relative h-4 w-full rounded-full bg-hairline">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#25BE86,#FFB23E 55%,#FF6A5D)',
            transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
        <div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface bg-ink shadow-card"
          style={{ left: `${pct}%`, transition: 'left 600ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted">
        <span>Easy</span>
        <span>Sustainable</span>
        <span>Stretched</span>
      </div>
    </div>
  )
}
