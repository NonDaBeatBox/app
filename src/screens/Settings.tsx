import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useStore, useDB, useCurrentUser } from '../lib/store'
import { circlesForUser, membersOf, activeGoalsForUser } from '../lib/selectors'
import { AppShell, TopBar } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { useToast } from '../components/Toast'
import { LogOutIcon } from '../components/icons'

export default function Settings() {
  const store = useStore()
  const db = useDB()
  const me = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const [confirming, setConfirming] = useState<string | null>(null)

  if (!me) return <Navigate to="/login" replace />
  const circles = circlesForUser(db, me.id)

  async function leave(circleId: string) {
    try {
      await store.leaveCircle(circleId)
      toast.success('You left the circle. Pending goals paused.')
      setConfirming(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not leave')
    }
  }

  async function signOut() {
    await store.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell nav>
      <TopBar title="Settings" back />
      <div className="flex flex-col gap-6 px-5 py-6">
        {/* profile */}
        <div className="card flex items-center gap-3 p-4">
          <Avatar user={me} size="lg" />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-ink">{me.name}</p>
            <p className="text-sm text-muted">@{me.handle}</p>
            {me.phone && <p className="text-xs text-muted">{me.phone}</p>}
          </div>
        </div>

        {/* circles */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            Your circles
          </p>
          <div className="flex flex-col gap-2">
            {circles.length === 0 && (
              <div className="card p-4 text-sm text-muted">
                You're not in a circle right now.{' '}
                <Link to="/circles/new" className="font-bold text-coral">
                  Start one
                </Link>
                .
              </div>
            )}
            {circles.map((c) => {
              const count = membersOf(db, c.id).length
              const pending = activeGoalsForUser(db, me.id, c.id).length
              return (
                <div key={c.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <Link to={`/c/${c.id}`} className="min-w-0">
                      <p className="truncate font-display text-base font-bold text-ink">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted">
                        {count} members · {pending} active goal{pending === 1 ? '' : 's'}
                      </p>
                    </Link>
                    {confirming === c.id ? (
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => leave(c.id)}
                          className="rounded-full bg-coral px-3 py-1.5 text-xs font-bold text-white"
                        >
                          Leave
                        </button>
                        <button
                          onClick={() => setConfirming(null)}
                          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-bold text-ink"
                        >
                          Stay
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirming(c.id)}
                        className="shrink-0 rounded-full border border-hairline px-3 py-1.5 text-xs font-bold text-muted hover:text-coral"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                  {confirming === c.id && (
                    <p className="mt-2 text-xs text-muted">
                      You can leave instantly. Your pending goals here will be paused —
                      nothing is lost.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* links */}
        <div className="flex flex-col gap-2">
          <Link to="/circles/new" className="btn-ghost w-full justify-start">
            + Start a new circle
          </Link>
          <Link to="/pricing" className="btn-ghost w-full justify-start">
            💸 See pricing
          </Link>
        </div>

        <Button variant="ghost" full onClick={signOut} className="text-coral">
          <LogOutIcon width={18} height={18} /> Sign out
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-muted">
          No DMs — everything stays circle-level. No strangers, no discovery,
          ever. Consequences never involve money.
        </p>
      </div>
    </AppShell>
  )
}
