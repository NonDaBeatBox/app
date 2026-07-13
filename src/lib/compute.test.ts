import { describe, it, expect } from 'vitest'
import type {
  DB,
  User,
  Circle,
  Membership,
  Goal,
  Contract,
  Checkin,
  Frequency,
  Consequence,
  ProofMethod,
} from '../types'
import {
  computePulse,
  pulseState,
  computeLoad,
  loadZone,
  computeStreak,
  computeEarnedPower,
  detectMisses,
  approvalStatus,
  weekGrid,
} from './compute'
import { addDays, isWeekday } from './dates'

// 2026-06-15 is a Monday — a stable anchor for weekday-sensitive tests.
const TODAY = '2026-06-15'

// --- tiny fixture builder ---------------------------------------------------

function emptyDB(): DB {
  return {
    users: [],
    circles: [],
    memberships: [],
    goals: [],
    contracts: [],
    approvals: [],
    checkins: [],
    messages: [],
    nudges: [],
    currentUserId: null,
  }
}

let seq = 0
const uid = (p: string) => `${p}_${seq++}`

function addUser(db: DB, name: string): User {
  const u: User = {
    id: uid('u'),
    name,
    handle: name.toLowerCase(),
    avatar_color: '#FF6A5D',
    phone: null,
  }
  db.users.push(u)
  return u
}

function addCircle(db: DB, createdBy: string): Circle {
  const c: Circle = {
    id: uid('c'),
    name: 'Test Circle',
    created_by: createdBy,
    member_cap: 6,
  }
  db.circles.push(c)
  return c
}

function addMember(db: DB, userId: string, circleId: string): Membership {
  const m: Membership = {
    id: uid('m'),
    user_id: userId,
    circle_id: circleId,
    role: 'member',
    backs_user_id: null,
  }
  db.memberships.push(m)
  return m
}

function addGoal(
  db: DB,
  userId: string,
  circleId: string,
  freq: Frequency,
  opts: { consequence?: Consequence; proof?: ProofMethod } = {},
): { goal: Goal; contract: Contract } {
  const goal: Goal = {
    id: uid('g'),
    user_id: userId,
    circle_id: circleId,
    title: 'Goal',
    category: 'mindset',
    kind: 'concrete',
    status: 'active',
  }
  const contract: Contract = {
    id: uid('k'),
    goal_id: goal.id,
    proof_method: opts.proof ?? 'honest_checkin',
    frequency: freq,
    consequence: opts.consequence ?? 'streak_break',
    forfeit_text: null,
    approved_by_circle: true,
  }
  db.goals.push(goal)
  db.contracts.push(contract)
  return { goal, contract }
}

function checkin(
  db: DB,
  goalId: string,
  userId: string,
  date: string,
  status: 'done' | 'missed',
): Checkin {
  const c: Checkin = {
    id: uid('ci'),
    goal_id: goalId,
    user_id: userId,
    date,
    status,
    proof_url: null,
    note: null,
  }
  db.checkins.push(c)
  return c
}

// --- pulseState -------------------------------------------------------------

describe('pulseState thresholds', () => {
  it('classifies the boundaries', () => {
    expect(pulseState(100)).toBe('rising')
    expect(pulseState(75)).toBe('rising')
    expect(pulseState(74)).toBe('steady')
    expect(pulseState(45)).toBe('steady')
    expect(pulseState(44)).toBe('slipping')
    expect(pulseState(0)).toBe('slipping')
  })
})

// --- computePulse -----------------------------------------------------------

describe('computePulse', () => {
  it('is 100/rising when the only member is perfect on a daily goal', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const u = addUser(db, 'Ada')
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    for (let i = 0; i < 7; i++) checkin(db, goal.id, u.id, addDays(TODAY, -i), 'done')

    const r = computePulse(db, c.id, TODAY)
    expect(r.member_rates[0].expected).toBe(7)
    expect(r.member_rates[0].done).toBe(7)
    expect(r.base).toBe(100)
    expect(r.pulse).toBe(100)
    expect(r.state).toBe('rising')
    expect(r.checked_in_today).toBe(1)
    expect(r.total_members).toBe(1)
  })

  it('averages member rates (one perfect, one absent -> 50/steady)', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const a = addUser(db, 'Ada')
    const b = addUser(db, 'Bo')
    addMember(db, a.id, c.id)
    addMember(db, b.id, c.id)
    const ga = addGoal(db, a.id, c.id, 'daily').goal
    addGoal(db, b.id, c.id, 'daily')
    for (let i = 0; i < 7; i++) checkin(db, ga.id, a.id, addDays(TODAY, -i), 'done')

    const r = computePulse(db, c.id, TODAY)
    expect(r.base).toBe(50)
    expect(r.state).toBe('steady')
    expect(r.checked_in_today).toBe(1)
  })

  it('treats a member with no active goals as rate 1 (expected 0)', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const u = addUser(db, 'Ada')
    addMember(db, u.id, c.id)
    const r = computePulse(db, c.id, TODAY)
    expect(r.member_rates[0].expected).toBe(0)
    expect(r.member_rates[0].rate).toBe(1)
    expect(r.pulse).toBe(100)
  })

  it('applies a temporary -10 meter_hit penalty for a miss yesterday', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const u = addUser(db, 'Ada')
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily', { consequence: 'meter_hit' })
    // done on all days except yesterday, which is a recorded miss
    for (let i = 0; i < 7; i++) {
      if (i === 1) checkin(db, goal.id, u.id, addDays(TODAY, -1), 'missed')
      else checkin(db, goal.id, u.id, addDays(TODAY, -i), 'done')
    }
    const r = computePulse(db, c.id, TODAY)
    expect(r.penalty).toBe(10)
    expect(r.pulse).toBe(r.base - 10)
  })
})

// --- computeLoad ------------------------------------------------------------

describe('computeLoad', () => {
  it('sums weekly frequency + 1 per membership', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    addGoal(db, u.id, c.id, 'daily') // 7
    const r = computeLoad(db, u.id, TODAY)
    expect(r.total).toBe(8) // 7 + 1 membership
    expect(r.zone).toBe('sustainable')
    expect(r.per_circle[0].points).toBe(8)
  })

  it('goes stretched across two busy circles', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c1 = addCircle(db, u.id)
    const c2 = addCircle(db, u.id)
    addMember(db, u.id, c1.id)
    addMember(db, u.id, c2.id)
    addGoal(db, u.id, c1.id, 'daily') // 7
    addGoal(db, u.id, c1.id, 'daily') // 7
    addGoal(db, u.id, c2.id, 'daily') // 7
    // points: c1 = 7+7+1 = 15, c2 = 7+1 = 8 -> total 23
    const r = computeLoad(db, u.id, TODAY)
    expect(r.total).toBe(23)
    expect(r.zone).toBe('stretched')
    expect(r.per_circle).toHaveLength(2)
  })

  it('classifies zone boundaries', () => {
    expect(loadZone(7)).toBe('easy')
    expect(loadZone(8)).toBe('sustainable')
    expect(loadZone(14)).toBe('sustainable')
    expect(loadZone(15)).toBe('stretched')
  })
})

// --- computeStreak ----------------------------------------------------------

describe('computeStreak', () => {
  it('counts consecutive done days including today', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    for (let i = 0; i < 3; i++) checkin(db, goal.id, u.id, addDays(TODAY, -i), 'done')
    expect(computeStreak(db, goal.id, TODAY)).toBe(3)
  })

  it('gives today a grace day when not yet actioned', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    // nothing today, done the two prior days
    checkin(db, goal.id, u.id, addDays(TODAY, -1), 'done')
    checkin(db, goal.id, u.id, addDays(TODAY, -2), 'done')
    expect(computeStreak(db, goal.id, TODAY)).toBe(2)
  })

  it('breaks on a missed today', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    checkin(db, goal.id, u.id, TODAY, 'missed')
    checkin(db, goal.id, u.id, addDays(TODAY, -1), 'done')
    expect(computeStreak(db, goal.id, TODAY)).toBe(0)
  })

  it('skips weekends for a weekdays goal', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'weekdays')
    // TODAY = Mon; prior weekday is Fri (TODAY-3). Sat/Sun in between are off.
    checkin(db, goal.id, u.id, TODAY, 'done') // Mon
    checkin(db, goal.id, u.id, addDays(TODAY, -3), 'done') // Fri
    expect(isWeekday(addDays(TODAY, -1))).toBe(false) // Sun
    expect(isWeekday(addDays(TODAY, -2))).toBe(false) // Sat
    expect(computeStreak(db, goal.id, TODAY)).toBe(2)
  })
})

// --- computeEarnedPower -----------------------------------------------------

describe('computeEarnedPower', () => {
  function powerWithDoneDays(doneDays: number) {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily') // expected 14 over 14 days
    for (let i = 0; i < doneDays; i++)
      checkin(db, goal.id, u.id, addDays(TODAY, -i), 'done')
    return computeEarnedPower(db, u.id, c.id, TODAY)
  }

  it('locks to cheer/ping below 50%', () => {
    const p = powerWithDoneDays(4) // 4/14 ≈ 0.29
    expect(p.tier).toBe('cheer')
    expect(p.canCheer).toBe(true)
    expect(p.canPing).toBe(true)
    expect(p.canYouGood).toBe(false)
    expect(p.canCall).toBe(false)
  })

  it('unlocks "you good?" in 50–79%', () => {
    const p = powerWithDoneDays(9) // 9/14 ≈ 0.64
    expect(p.tier).toBe('you_good')
    expect(p.canYouGood).toBe(true)
    expect(p.canCall).toBe(false)
  })

  it('unlocks the call at 80%+', () => {
    const p = powerWithDoneDays(13) // 13/14 ≈ 0.93
    expect(p.tier).toBe('call')
    expect(p.canCall).toBe(true)
  })
})

// --- detectMisses -----------------------------------------------------------

describe('detectMisses', () => {
  it('flags each past scheduled day with no check-in, never today', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    addGoal(db, u.id, c.id, 'daily', { consequence: 'streak_break' })
    // no check-ins at all in the last few days
    const misses = detectMisses(db, TODAY, 3)
    const dates = misses.map((m) => m.date).sort()
    expect(dates).toEqual([addDays(TODAY, -3), addDays(TODAY, -2), addDays(TODAY, -1)].sort())
    expect(misses.every((m) => m.date !== TODAY)).toBe(true)
    expect(misses[0].consequence).toBe('streak_break')
  })

  it('is idempotent — resolved days are skipped', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    checkin(db, goal.id, u.id, addDays(TODAY, -1), 'missed')
    checkin(db, goal.id, u.id, addDays(TODAY, -2), 'done')
    const misses = detectMisses(db, TODAY, 3)
    expect(misses.map((m) => m.date)).toEqual([addDays(TODAY, -3)])
  })

  it('ignores non-active goals', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'daily')
    goal.status = 'pending_approval'
    expect(detectMisses(db, TODAY, 3)).toHaveLength(0)
  })
})

// --- approvalStatus ---------------------------------------------------------

describe('approvalStatus', () => {
  it('needs a majority of the other members', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const owner = addUser(db, 'Ada')
    addMember(db, owner.id, c.id)
    for (const n of ['Bo', 'Cy', 'Di']) addMember(db, addUser(db, n).id, c.id)
    const { goal } = addGoal(db, owner.id, c.id, 'daily')
    goal.status = 'pending_approval'

    let s = approvalStatus(db, goal.id)
    expect(s.others).toBe(3)
    expect(s.needed).toBe(2) // floor(3/2)+1
    expect(s.met).toBe(false)

    db.approvals.push({ id: 'a1', goal_id: goal.id, user_id: 'x', approved: true })
    expect(approvalStatus(db, goal.id).met).toBe(false)
    db.approvals.push({ id: 'a2', goal_id: goal.id, user_id: 'y', approved: true })
    expect(approvalStatus(db, goal.id).met).toBe(true)
  })

  it('needs 1 when there are no other members', () => {
    const db = emptyDB()
    const c = addCircle(db, 'x')
    const owner = addUser(db, 'Solo')
    addMember(db, owner.id, c.id)
    const { goal } = addGoal(db, owner.id, c.id, 'daily')
    expect(approvalStatus(db, goal.id).needed).toBe(1)
  })
})

// --- weekGrid ---------------------------------------------------------------

describe('weekGrid', () => {
  it('marks done/missed/pending/off across 7 days', () => {
    const db = emptyDB()
    const u = addUser(db, 'Ada')
    const c = addCircle(db, u.id)
    addMember(db, u.id, c.id)
    const { goal } = addGoal(db, u.id, c.id, 'weekdays')
    checkin(db, goal.id, u.id, addDays(TODAY, -3), 'done') // Fri
    const grid = weekGrid(db, goal.id, TODAY, 7)
    expect(grid).toHaveLength(7)
    // weekend days should be 'off'
    const off = grid.filter((d) => d.status === 'off')
    expect(off.length).toBe(2)
    expect(grid.find((d) => d.date === addDays(TODAY, -3))?.status).toBe('done')
    expect(grid.find((d) => d.date === TODAY)?.status).toBe('pending')
  })
})
