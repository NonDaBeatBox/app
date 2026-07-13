import { Navigate, Link } from 'react-router-dom'
import { useDB, useCurrentUser } from '../lib/store'
import { computeLoad } from '../lib/compute'
import { activeGoalsForUser, contractForGoal } from '../lib/selectors'
import { AppShell, TopBar } from '../components/AppShell'
import { LoadBarFull, zoneMeta } from '../components/LoadBar'
import { FREQ_META } from '../lib/labels'

export default function Load() {
  const db = useDB()
  const me = useCurrentUser()
  if (!me) return <Navigate to="/login" replace />

  const load = computeLoad(db, me.id)
  const meta = zoneMeta(load.zone)

  return (
    <AppShell nav>
      <TopBar title="Your load" subtitle="Across every circle you're in" />
      <div className="flex flex-col gap-6 px-5 py-6">
        {/* big zone word */}
        <div className="text-center">
          <div className="text-5xl">{meta.emoji}</div>
          <h2
            className="mt-2 font-display text-4xl font-extrabold tracking-tight"
            style={{ color: meta.color }}
          >
            {meta.word}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {load.total} points of weekly follow-through across {load.per_circle.length}{' '}
            circle{load.per_circle.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* gradient bar */}
        <div className="card p-5">
          <LoadBarFull total={load.total} />
        </div>

        {/* stretched banner */}
        {load.zone === 'stretched' && (
          <div className="animate-pop-in rounded-3xl border border-coral/30 bg-coral/10 p-4">
            <p className="flex items-center gap-2 font-display text-base font-bold text-coral">
              🫱 You're carrying a lot
            </p>
            <p className="mt-1 text-sm text-ink/80">
              Protect one circle this week. Pause a goal or lean on the people
              backing you — spreading thin helps no one.
            </p>
          </div>
        )}
        {load.zone === 'easy' && (
          <div className="rounded-3xl border border-green/25 bg-green/10 p-4 text-sm text-ink/80">
            <b className="text-green">Room to grow.</b> You could take on one more
            goal — or just enjoy the calm.
          </div>
        )}

        {/* per-circle strain */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            Where the weight sits
          </p>
          <div className="flex flex-col gap-2">
            {load.per_circle.map((c) => {
              const goals = activeGoalsForUser(db, me.id, c.circle_id)
              const pct = Math.min(100, (c.points / 15) * 100)
              return (
                <Link
                  key={c.circle_id}
                  to={`/c/${c.circle_id}`}
                  className="card flex items-center gap-3 p-4 transition-colors hover:bg-paper"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-display text-base font-bold text-ink">
                        {c.circle_name}
                      </p>
                      <span className="text-sm font-bold text-plum">{c.points}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-hairline">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg,#25BE86,#FFB23E 60%,#FF6A5D)',
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted">
                      {goals.length === 0
                        ? 'membership only'
                        : goals
                            .map((g) => {
                              const c2 = contractForGoal(db, g.id)
                              return c2 ? FREQ_META[c2.frequency].label.toLowerCase() : ''
                            })
                            .join(' · ')}{' '}
                      + 1 seat
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* how it's counted */}
        <div className="rounded-3xl bg-surface/60 p-4 text-xs leading-relaxed text-muted">
          <b className="text-ink">How load is counted:</b> each active goal adds its
          weekly frequency ({FREQ_META.daily.label.toLowerCase()} = 7,{' '}
          {FREQ_META.weekdays.label.toLowerCase()} = 5), plus 1 for every circle you're
          in. ≤7 easy · 8–14 sustainable · ≥15 stretched.
        </div>
      </div>
    </AppShell>
  )
}
