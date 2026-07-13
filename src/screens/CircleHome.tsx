import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDB, useCurrentUser, useToday } from '../lib/store'
import {
  circleById,
  membershipFor,
  usersOfCircle,
  activeGoalsForUser,
  checkedInToday,
  backedGoalFor,
  membersOf,
} from '../lib/selectors'
import { computePulse, computeLoad, computeStreak } from '../lib/compute'
import { AppShell } from '../components/AppShell'
import { PulseRing, type RingMember } from '../components/PulseRing'
import { LoadMini } from '../components/LoadBar'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { StreakBadge, StatusPill } from '../components/Bits'
import { SettingsIcon } from '../components/icons'
import { CATEGORY_META } from '../lib/labels'

export default function CircleHome() {
  const { id = '' } = useParams()
  const db = useDB()
  const me = useCurrentUser()
  const today = useToday()
  const navigate = useNavigate()

  const circle = circleById(db, id)
  if (!me) return <Navigate to="/login" replace />
  if (!circle || !membershipFor(db, me.id, id)) return <Navigate to="/" replace />

  const pulse = computePulse(db, id, today)
  const load = computeLoad(db, me.id)
  const members = membersOf(db, id)
  const ringMembers: RingMember[] = usersOfCircle(db, id).map((u) => ({
    user: u,
    checkedInToday: checkedInToday(db, u.id, id, today),
  }))

  const myGoals = activeGoalsForUser(db, me.id, id)
  const myGoal = myGoals[0]
  const myDone = myGoal ? checkedInToday(db, me.id, id, today) : false
  const myStreak = myGoal ? computeStreak(db, myGoal.id, today) : 0

  const backing = backedGoalFor(db, me.id, id)

  return (
    <AppShell nav>
      {/* header */}
      <header className="flex items-center justify-between px-5 pb-1 pt-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-ink">
            {circle.name}
          </h1>
          <p className="text-xs text-muted">
            {members.length} of {circle.member_cap} · circles stay small
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/load" aria-label="Your load">
            <LoadMini zone={load.zone} total={load.total} />
          </Link>
          <Link
            to="/settings"
            className="btn-ghost h-9 w-9 rounded-full !p-0 text-plum"
            aria-label="Settings"
          >
            <SettingsIcon width={18} height={18} />
          </Link>
        </div>
      </header>

      {/* pulse hero */}
      <section className="px-5 pt-4">
        <PulseRing
          pulse={pulse.pulse}
          state={pulse.state}
          members={ringMembers}
          penalty={pulse.penalty}
        />
        <p className="mt-3 text-center text-sm font-semibold text-ink">
          <span className="text-coral">{pulse.checked_in_today}</span> of{' '}
          {pulse.total_members} checked in today
        </p>
        <p className="mx-auto mt-1 max-w-[17rem] text-center text-xs leading-relaxed text-muted">
          {pulse.state === 'rising'
            ? 'The circle is on a roll. Keep feeding it.'
            : pulse.state === 'steady'
              ? 'Holding steady. One check-in nudges it up.'
              : 'The pulse is slipping — someone needs backup.'}
        </p>
      </section>

      {/* your goal + check-in CTA */}
      <section className="px-5 pt-6">
        {myGoal ? (
          <div className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Your goal
                </p>
                <p className="mt-0.5 font-display text-base font-bold leading-snug text-ink">
                  {CATEGORY_META[myGoal.category].emoji} {myGoal.title}
                </p>
                <div className="mt-2">
                  <StreakBadge streak={myStreak} />
                </div>
              </div>
              <Link
                to={`/c/${id}/goal/new`}
                className="shrink-0 rounded-full bg-plum/10 px-3 py-1.5 text-xs font-bold text-plum transition-colors hover:bg-plum/15"
              >
                + goal
              </Link>
            </div>
            <div className="mt-4">
              {myDone ? (
                <div className="rounded-2xl bg-green/10 py-3 text-center text-sm font-bold text-green">
                  ✓ Checked in today — see you tomorrow
                </div>
              ) : (
                <Button full size="lg" onClick={() => navigate(`/checkin/${myGoal.id}`)}>
                  Check in for today
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-5 text-center">
            <p className="font-display text-base font-bold text-ink">
              You don't have a goal yet
            </p>
            <p className="mt-1 text-sm text-muted">
              The circle can't back what you haven't named.
            </p>
            <Button
              full
              size="lg"
              className="mt-4"
              onClick={() => navigate(`/c/${id}/goal/new`)}
            >
              Set your goal
            </Button>
          </div>
        )}
      </section>

      {/* who you're backing */}
      <section className="px-5 pb-6 pt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          You're backing
        </p>
        {backing ? (
          <Link
            to="/partner"
            className="card flex items-center gap-3 p-4 transition-colors hover:bg-paper"
          >
            <Avatar user={backing.user} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-bold text-ink">
                {backing.user.name}
              </p>
              <p className="truncate text-sm text-muted">
                {CATEGORY_META[backing.goal.category].emoji} {backing.goal.title}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <StreakBadge streak={computeStreak(db, backing.goal.id, today)} />
                <StatusPill done={checkedInToday(db, backing.user.id, id, today)} />
              </div>
            </div>
          </Link>
        ) : (
          <div className="card p-4 text-sm text-muted">
            No one to back yet — invite your circle and you'll be paired up.
          </div>
        )}
      </section>
    </AppShell>
  )
}
