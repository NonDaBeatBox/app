import { Navigate } from 'react-router-dom'
import type { User, Goal, NudgeLevel } from '../types'
import { useStore, useDB, useCurrentUser, useToday } from '../lib/store'
import {
  circlesForUser,
  membershipFor,
  userById,
  activeGoalsForUser,
  goalsForUser,
  checkedInToday,
  latestCheckinEvent,
} from '../lib/selectors'
import {
  computeStreak,
  computeEarnedPower,
  weekGrid,
  type DayCell,
} from '../lib/compute'
import { AppShell, TopBar } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { StreakBadge, StatusPill, EmptyState } from '../components/Bits'
import { useToast } from '../components/Toast'
import { CATEGORY_META } from '../lib/labels'
import { PhoneIcon, LockIcon } from '../components/icons'
import { weekdayLetter } from '../lib/dates'

export default function Partner() {
  const db = useDB()
  const me = useCurrentUser()
  if (!me) return <Navigate to="/login" replace />

  // gather every person this user backs, across their circles
  const backings = circlesForUser(db, me.id)
    .map((c) => {
      const m = membershipFor(db, me.id, c.id)
      const partner = m?.backs_user_id ? userById(db, m.backs_user_id) : undefined
      const goal =
        partner &&
        (activeGoalsForUser(db, partner.id, c.id)[0] ??
          goalsForUser(db, partner.id, c.id)[0])
      return partner && goal ? { circleId: c.id, circleName: c.name, partner, goal } : null
    })
    .filter(Boolean) as {
    circleId: string
    circleName: string
    partner: User
    goal: Goal
  }[]

  return (
    <AppShell nav>
      <TopBar title="Who you're backing" subtitle="You hold their goal like it's yours" />
      {backings.length === 0 ? (
        <EmptyState
          emoji="🤝"
          title="No one to back yet"
          body="Once your circle fills up you'll be paired to hold someone's goal. That's the whole point."
        />
      ) : (
        <div className="flex flex-col gap-6 px-5 py-5">
          {backings.map((b) => (
            <PartnerCard key={b.circleId} {...b} meId={me.id} />
          ))}
        </div>
      )}
    </AppShell>
  )
}

function PartnerCard({
  circleId,
  circleName,
  partner,
  goal,
  meId,
}: {
  circleId: string
  circleName: string
  partner: User
  goal: Goal
  meId: string
}) {
  const db = useDB()
  const store = useStore()
  const toast = useToast()
  const today = useToday()

  const streak = computeStreak(db, goal.id, today)
  const grid = weekGrid(db, goal.id, today, 7)
  const done = checkedInToday(db, partner.id, circleId, today)
  const power = computeEarnedPower(db, meId, circleId, today)

  async function nudge(level: NudgeLevel) {
    try {
      await store.sendNudge({ circleId, toUserId: partner.id, goalId: goal.id, level })
      toast.success(
        level === 'ping'
          ? `Pinged ${partner.name} 👀`
          : level === 'you_good'
            ? `Asked ${partner.name} if they're good 💬`
            : `Call request sent 📞`,
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send')
    }
  }

  async function cheer() {
    const ev = latestCheckinEvent(db, partner.id, circleId)
    try {
      if (ev) await store.cheerMessage(ev.id)
      else await store.sendMessage(circleId, `👏 cheering ${partner.name} on — you've got this`)
      toast.success(`You cheered ${partner.name} 👏`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not cheer')
    }
  }

  return (
    <div className="card overflow-hidden">
      {/* partner header */}
      <div className="flex items-center gap-3 border-b border-hairline p-4">
        <Avatar user={partner} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold text-ink">{partner.name}</p>
          <p className="truncate text-sm text-muted">
            {CATEGORY_META[goal.category].emoji} {goal.title}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">in {circleName}</p>
        </div>
      </div>

      {/* week grid + streak */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <StreakBadge streak={streak} />
          <StatusPill done={done} />
        </div>
        <WeekGrid grid={grid} />
      </div>

      {/* earned-power ladder */}
      <div className="border-t border-hairline bg-paper/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Your backing power
          </p>
          <span className="text-xs font-bold text-plum">
            {Math.round(power.rate * 100)}% · 14-day
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <LadderButton label="Cheer" emoji="👏" tone="green" onClick={cheer} />
          <LadderButton label="Ping" emoji="👀" tone="plum" onClick={() => nudge('ping')} />
          <LadderButton
            label="You good?"
            emoji="💬"
            tone="amber"
            locked={!power.canYouGood}
            onClick={() => nudge('you_good')}
          />
          <CallButton
            partner={partner}
            unlocked={power.canCall}
            onRecord={() => nudge('call')}
          />
        </div>
        {(!power.canYouGood || !power.canCall) && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <LockIcon width={12} height={12} /> Show up on your own goal to unlock
            stronger nudges.
          </p>
        )}
      </div>
    </div>
  )
}

function WeekGrid({ grid }: { grid: DayCell[] }) {
  return (
    <div className="flex justify-between gap-1.5">
      {grid.map((d) => {
        const base =
          'flex h-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl border text-[10px] font-bold'
        const style =
          d.status === 'done'
            ? 'border-green/40 bg-green/15 text-green'
            : d.status === 'missed'
              ? 'border-coral/40 bg-coral/12 text-coral'
              : d.status === 'off'
                ? 'border-transparent bg-hairline/40 text-muted/60'
                : 'border-dashed border-hairline bg-surface text-muted'
        return (
          <div key={d.date} className={`${base} ${style}`}>
            <span>{weekdayLetter(d.date)}</span>
            <span className="text-sm leading-none">
              {d.status === 'done' ? '✓' : d.status === 'missed' ? '✕' : d.status === 'off' ? '·' : '○'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const TONES: Record<string, string> = {
  green: 'border-green/30 bg-green/10 text-ink hover:bg-green/15',
  plum: 'border-plum/20 bg-plum/8 text-ink hover:bg-plum/12',
  amber: 'border-amber/30 bg-amber/10 text-ink hover:bg-amber/15',
}

function LadderButton({
  label,
  emoji,
  tone,
  locked = false,
  onClick,
}: {
  label: string
  emoji: string
  tone: string
  locked?: boolean
  onClick: () => void
}) {
  if (locked)
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline bg-surface/50 px-3 py-3.5 text-sm font-bold text-muted">
        <LockIcon width={16} height={16} /> {label}
      </div>
    )
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3.5 text-sm font-bold transition-colors ${TONES[tone]}`}
    >
      <span className="text-base">{emoji}</span> {label}
    </button>
  )
}

function CallButton({
  partner,
  unlocked,
  onRecord,
}: {
  partner: User
  unlocked: boolean
  onRecord: () => void
}) {
  const toast = useToast()
  if (!unlocked)
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline bg-surface/50 px-3 py-3.5 text-sm font-bold text-muted">
        <LockIcon width={16} height={16} /> Call
      </div>
    )
  if (partner.phone)
    return (
      <a
        href={`tel:${partner.phone}`}
        onClick={onRecord}
        className="flex items-center justify-center gap-2 rounded-2xl border border-coral/30 bg-coral/10 px-3 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-coral/15"
      >
        <PhoneIcon width={18} height={18} /> Call
      </a>
    )
  return (
    <button
      onClick={() => {
        onRecord()
        toast.info('In-app calls arrive with the Circle Plan')
      }}
      className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline bg-surface/50 px-3 py-3.5 text-sm font-bold text-muted"
    >
      <PhoneIcon width={18} height={18} /> Call
    </button>
  )
}
