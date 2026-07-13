// ---------------------------------------------------------------------------
// The rules of Circle, as pure functions. Every value the UI shows about
// progress is derived here from a DB snapshot + a reference "today" so the
// same inputs always give the same output (and so it's unit-testable).
// ---------------------------------------------------------------------------
import type { DB, ID, Frequency, Consequence } from '../types'
import {
  lastNDays,
  isScheduledDay,
  scheduledDaysIn,
  addDays,
  yesterdayISO,
} from './dates'
import {
  membersOf,
  activeGoalsForUser,
  contractForGoal,
  checkinForGoalOnDate,
  checkinsForGoal,
  circlesForUser,
  activeGoalsInCircle,
} from './selectors'

const WEEKLY_FREQ: Record<Frequency, number> = { daily: 7, weekdays: 5 }

// --- Pulse -----------------------------------------------------------------

export type PulseState = 'rising' | 'steady' | 'slipping'

export interface MemberRate {
  user_id: ID
  expected: number
  done: number
  rate: number
}

export interface PulseResult {
  circle_id: ID
  total_members: number
  checked_in_today: number
  member_rates: MemberRate[]
  base: number // 0..100 from follow-through rates
  penalty: number // temporary meter_hit deduction active right now
  pulse: number // clamp(base - penalty, 0, 100)
  state: PulseState
}

export function pulseState(pulse: number): PulseState {
  if (pulse >= 75) return 'rising'
  if (pulse >= 45) return 'steady'
  return 'slipping'
}

/**
 * Per member: expected check-ins over the last 7 days from their active
 * contracts (daily=7, weekdays=5); memberRate = done/expected (1 if
 * expected=0). Pulse = round(avg(memberRate) × 100).
 *
 * meter_hit consequence: any missed scheduled day in the last 24h on a
 * meter_hit contract knocks 10 off the *displayed* pulse (base is untouched).
 */
export function computePulse(db: DB, circleId: ID, today: string): PulseResult {
  const window = lastNDays(today, 7)
  const members = membersOf(db, circleId)

  const member_rates: MemberRate[] = members.map((m) => {
    const goals = activeGoalsForUser(db, m.user_id, circleId)
    let expected = 0
    let done = 0
    for (const g of goals) {
      const contract = contractForGoal(db, g.id)
      if (!contract) continue
      for (const date of window) {
        if (!isScheduledDay(date, contract.frequency)) continue
        expected += 1
        const c = checkinForGoalOnDate(db, g.id, date)
        if (c?.status === 'done') done += 1
      }
    }
    const rate = expected === 0 ? 1 : done / expected
    return { user_id: m.user_id, expected, done, rate }
  })

  const avg =
    member_rates.length === 0
      ? 0
      : member_rates.reduce((s, r) => s + r.rate, 0) / member_rates.length
  const base = Math.round(avg * 100)

  // temporary meter_hit penalty: misses recorded for yesterday on a
  // meter_hit contract (i.e. within the last ~24h).
  const y = yesterdayISO(today)
  let penalty = 0
  for (const m of members) {
    for (const g of activeGoalsForUser(db, m.user_id, circleId)) {
      const contract = contractForGoal(db, g.id)
      if (!contract || contract.consequence !== 'meter_hit') continue
      const c = checkinForGoalOnDate(db, g.id, y)
      if (c?.status === 'missed') penalty += 10
    }
  }

  const pulse = Math.max(0, Math.min(100, base - penalty))

  // checked in today: distinct members with a done check-in today
  let checked_in_today = 0
  for (const m of members) {
    const goals = activeGoalsForUser(db, m.user_id, circleId)
    const did = goals.some(
      (g) => checkinForGoalOnDate(db, g.id, today)?.status === 'done',
    )
    if (did) checked_in_today += 1
  }

  return {
    circle_id: circleId,
    total_members: members.length,
    checked_in_today,
    member_rates,
    base,
    penalty,
    pulse,
    state: pulseState(pulse),
  }
}

// --- Load ------------------------------------------------------------------

export type LoadZone = 'easy' | 'sustainable' | 'stretched'

export interface CircleStrain {
  circle_id: ID
  circle_name: string
  goals: number
  points: number // weekly freq of active goals in this circle + 1 membership
}

export interface LoadResult {
  total: number
  zone: LoadZone
  per_circle: CircleStrain[]
}

export function loadZone(total: number): LoadZone {
  if (total <= 7) return 'easy'
  if (total <= 14) return 'sustainable'
  return 'stretched'
}

/**
 * Sum over active goals of weekly frequency, +1 per circle membership.
 * Zones: <=7 easy, 8–14 sustainable, >=15 stretched.
 */
export function computeLoad(db: DB, userId: ID, _today?: string): LoadResult {
  const circles = circlesForUser(db, userId)
  const per_circle: CircleStrain[] = circles.map((circle) => {
    const goals = activeGoalsForUser(db, userId, circle.id)
    const goalPoints = goals.reduce((s, g) => {
      const contract = contractForGoal(db, g.id)
      return s + (contract ? WEEKLY_FREQ[contract.frequency] : 0)
    }, 0)
    return {
      circle_id: circle.id,
      circle_name: circle.name,
      goals: goals.length,
      points: goalPoints + 1, // +1 for the membership itself
    }
  })
  const total = per_circle.reduce((s, c) => s + c.points, 0)
  return { total, zone: loadZone(total), per_circle }
}

// --- Streak ----------------------------------------------------------------

/**
 * Consecutive scheduled days ending at today with a `done` check-in.
 * Today counts if done; an un-actioned today is a grace day (doesn't break).
 * A `missed` (or absent past) scheduled day ends the streak.
 */
export function computeStreak(db: DB, goalId: ID, today: string): number {
  const contract = contractForGoal(db, goalId)
  if (!contract) return 0
  let streak = 0
  let cursor = today
  for (let i = 0; i < 400; i++, cursor = addDays(cursor, -1)) {
    if (!isScheduledDay(cursor, contract.frequency)) continue
    const c = checkinForGoalOnDate(db, goalId, cursor)
    if (c?.status === 'done') {
      streak += 1
      continue
    }
    // today with no action yet is a grace day, not a break
    if (cursor === today && !c) continue
    break
  }
  return streak
}

/** The last N scheduled/unscheduled days for a goal, with their check-in status. */
export interface DayCell {
  date: string
  scheduled: boolean
  status: 'done' | 'missed' | 'pending' | 'off'
}

export function weekGrid(
  db: DB,
  goalId: ID,
  today: string,
  days = 7,
): DayCell[] {
  const contract = contractForGoal(db, goalId)
  const freq: Frequency = contract?.frequency ?? 'daily'
  return lastNDays(today, days).map((date) => {
    const scheduled = isScheduledDay(date, freq)
    const c = checkinForGoalOnDate(db, goalId, date)
    let status: DayCell['status']
    if (!scheduled) status = 'off'
    else if (c?.status === 'done') status = 'done'
    else if (c?.status === 'missed') status = 'missed'
    else status = 'pending'
    return { date, scheduled, status }
  })
}

// --- Earned power ----------------------------------------------------------

export type PowerTier = 'cheer' | 'you_good' | 'call'

export interface EarnedPower {
  rate: number // own 14-day follow-through (0..1)
  tier: PowerTier
  canCheer: boolean
  canPing: boolean
  canYouGood: boolean
  canCall: boolean
}

/**
 * A member's own 14-day follow-through governs how hard they can push a
 * partner. <50% -> Cheer + Ping; 50–79% -> + "You good?"; >=80% -> + "call".
 */
export function computeEarnedPower(
  db: DB,
  userId: ID,
  circleId: ID,
  today: string,
): EarnedPower {
  const window = lastNDays(today, 14)
  let expected = 0
  let done = 0
  for (const g of activeGoalsForUser(db, userId, circleId)) {
    const contract = contractForGoal(db, g.id)
    if (!contract) continue
    expected += scheduledDaysIn(window, contract.frequency)
    for (const date of window) {
      if (!isScheduledDay(date, contract.frequency)) continue
      if (checkinForGoalOnDate(db, g.id, date)?.status === 'done') done += 1
    }
  }
  const rate = expected === 0 ? 0 : done / expected
  const canYouGood = rate >= 0.5
  const canCall = rate >= 0.8
  const tier: PowerTier = canCall ? 'call' : canYouGood ? 'you_good' : 'cheer'
  return {
    rate,
    tier,
    canCheer: true,
    canPing: true,
    canYouGood,
    canCall,
  }
}

// --- Miss detection --------------------------------------------------------

export interface MissDetection {
  goal_id: ID
  user_id: ID
  circle_id: ID
  date: string
  consequence: Consequence
  forfeit_text: string | null
}

/**
 * Every scheduled day strictly before `today` (within the lookback window)
 * that has no check-in row is a miss. Idempotent: days already resolved
 * (done or missed) are skipped, so running this on every app load is safe.
 */
export function detectMisses(
  db: DB,
  today: string,
  lookbackDays = 14,
): MissDetection[] {
  const out: MissDetection[] = []
  for (const circle of db.circles) {
    for (const goal of activeGoalsInCircle(db, circle.id)) {
      const contract = contractForGoal(db, goal.id)
      if (!contract) continue
      // days [today-lookback, yesterday]
      for (let i = lookbackDays; i >= 1; i--) {
        const date = addDays(today, -i)
        if (!isScheduledDay(date, contract.frequency)) continue
        if (checkinForGoalOnDate(db, goal.id, date)) continue // already resolved
        out.push({
          goal_id: goal.id,
          user_id: goal.user_id,
          circle_id: goal.circle_id,
          date,
          consequence: contract.consequence,
          forfeit_text: contract.forfeit_text,
        })
      }
    }
  }
  return out
}

// --- Approvals -------------------------------------------------------------

export interface ApprovalStatus {
  approvals: number // yes votes from *other* members
  needed: number // majority of other members
  others: number // number of other members
  met: boolean
}

/**
 * A goal activates when a majority of *other* members approve it.
 * needed = floor(others / 2) + 1.
 */
export function approvalStatus(db: DB, goalId: ID): ApprovalStatus {
  const goal = db.goals.find((g) => g.id === goalId)
  if (!goal) return { approvals: 0, needed: 1, others: 0, met: false }
  const others = membersOf(db, goal.circle_id).filter(
    (m) => m.user_id !== goal.user_id,
  ).length
  const yes = db.approvals.filter(
    (a) => a.goal_id === goalId && a.approved,
  ).length
  const needed = others === 0 ? 1 : Math.floor(others / 2) + 1
  return { approvals: yes, needed, others, met: yes >= needed }
}

/** Follow-through helpers reused by UI badges. */
export function goalDoneCount(db: DB, goalId: ID): number {
  return checkinsForGoal(db, goalId).filter((c) => c.status === 'done').length
}
