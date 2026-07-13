// ---------------------------------------------------------------------------
// Demo seed — "The Grind Squad". A fully-populated circle so the app is
// clickable the moment it loads, with no env keys and no network. All dates
// are generated relative to the real `today` so the last-7-days windows,
// streaks and pulse always look live.
// ---------------------------------------------------------------------------
import type { DB, User, Membership, Goal, Contract, Checkin, Message, Cheer } from '../../types'
import { lastNDays, isScheduledDay, addDays, isWeekday } from '../dates'
import { newId } from './ids'

/** The demo user you "sign in" as. */
export const DEMO_USER_ID = 'u_maya'

interface SeedMember {
  id: string
  name: string
  handle: string
  avatar_color: string
  phone: string | null
  backs: string // user id this member backs
  goal: {
    id: string
    title: string
    category: Goal['category']
    kind: Goal['kind']
    proof_method: Contract['proof_method']
    frequency: Contract['frequency']
    consequence: Contract['consequence']
    forfeit_text?: string
  }
  /** did they already check in today? */
  todayDone: boolean
  /** positions (1 = most recent past scheduled day) that are misses */
  misses: number[]
  /** positions left unresolved so the miss-handling job has work to do */
  gaps: number[]
}

// Backing forms a ring: maya → theo → jordan → sam → priya → maya
const MEMBERS: SeedMember[] = [
  {
    id: 'u_maya',
    name: 'Maya',
    handle: 'maya',
    avatar_color: '#4B2E63',
    phone: '+15551200100',
    backs: 'u_theo',
    goal: {
      id: 'g_maya',
      title: 'Read 20 pages before I open my phone',
      category: 'mindset',
      kind: 'fuzzy',
      proof_method: 'honest_checkin',
      frequency: 'daily',
      consequence: 'streak_break',
    },
    todayDone: false,
    misses: [5],
    gaps: [],
  },
  {
    id: 'u_theo',
    name: 'Theo',
    handle: 'theo',
    avatar_color: '#FF6A5D',
    phone: null,
    backs: 'u_jordan',
    goal: {
      id: 'g_theo',
      title: '3 SAT reading sets this week',
      category: 'sat',
      kind: 'concrete',
      proof_method: 'screenshot',
      frequency: 'weekdays',
      consequence: 'meter_hit',
    },
    todayDone: false,
    misses: [1],
    gaps: [],
  },
  {
    id: 'u_jordan',
    name: 'Jordan',
    handle: 'jrdn',
    avatar_color: '#25BE86',
    phone: '+15551200103',
    backs: 'u_sam',
    goal: {
      id: 'g_jordan',
      title: 'Ship one small portfolio piece',
      category: 'skill',
      kind: 'concrete',
      proof_method: 'link',
      frequency: 'weekdays',
      consequence: 'forfeit',
      forfeit_text: 'cook dinner for the house 🍝',
    },
    todayDone: true,
    misses: [2, 4],
    gaps: [],
  },
  {
    id: 'u_sam',
    name: 'Sam',
    handle: 'sammo',
    avatar_color: '#FFB23E',
    phone: null,
    backs: 'u_priya',
    goal: {
      id: 'g_sam',
      title: '10 minutes of quiet, no phone',
      category: 'character',
      kind: 'fuzzy',
      proof_method: 'honest_checkin',
      frequency: 'daily',
      consequence: 'streak_break',
    },
    todayDone: true,
    misses: [6],
    gaps: [],
  },
  {
    id: 'u_priya',
    name: 'Priya',
    handle: 'priyap',
    avatar_color: '#D9547E',
    phone: null,
    backs: 'u_maya',
    goal: {
      id: 'g_priya',
      title: 'Practice guitar 20 minutes',
      category: 'skill',
      kind: 'concrete',
      proof_method: 'video',
      frequency: 'daily',
      consequence: 'streak_break',
    },
    todayDone: true,
    misses: [],
    // position 2 (two days back) left unresolved so the startup miss-handling
    // job has real work to do (marks it missed + posts a system card).
    gaps: [2],
  },
]

const CIRCLE_ID = 'c_grind'

export function seedDB(today: string): DB {
  const users: User[] = []
  const memberships: Membership[] = []
  const goals: Goal[] = []
  const contracts: Contract[] = []
  const checkins: Checkin[] = []

  // Cover 15 days so every day the miss-handling job scans (the last 14) is
  // already resolved — only the intentional gap should surface as a miss.
  const window = lastNDays(today, 15) // oldest-first

  for (const m of MEMBERS) {
    users.push({
      id: m.id,
      name: m.name,
      handle: m.handle,
      avatar_color: m.avatar_color,
      phone: m.phone,
    })
    memberships.push({
      id: newId('m'),
      user_id: m.id,
      circle_id: CIRCLE_ID,
      role: m.id === DEMO_USER_ID ? 'founder' : 'member',
      backs_user_id: m.backs,
    })
    goals.push({
      id: m.goal.id,
      user_id: m.id,
      circle_id: CIRCLE_ID,
      title: m.goal.title,
      category: m.goal.category,
      kind: m.goal.kind,
      status: 'active',
    })
    contracts.push({
      id: newId('k'),
      goal_id: m.goal.id,
      proof_method: m.goal.proof_method,
      frequency: m.goal.frequency,
      consequence: m.goal.consequence,
      forfeit_text: m.goal.forfeit_text ?? null,
      approved_by_circle: true,
    })

    // today's check-in (only if scheduled + already done)
    if (m.todayDone && isScheduledDay(today, m.goal.frequency)) {
      checkins.push(mkCheckin(m.goal.id, m.id, today, 'done', m.goal.proof_method))
    }

    // past scheduled days, most-recent-first (position 1 = most recent).
    // Everything is 'done' except designated misses; gaps are skipped so the
    // startup miss-handling job resolves them live.
    const pastScheduled = window
      .filter((d) => d !== today && isScheduledDay(d, m.goal.frequency))
      .reverse()
    pastScheduled.forEach((date, i) => {
      const pos = i + 1
      if (m.gaps.includes(pos)) return
      const status = m.misses.includes(pos) ? 'missed' : 'done'
      checkins.push(mkCheckin(m.goal.id, m.id, date, status, m.goal.proof_method))
    })
  }

  // A goal from Sam that's still awaiting approval, pre-approved by Theo &
  // Jordan (2 of 3 needed) so the demo user sees an actionable Approve card in
  // chat — their tap tips it live.
  const pendingGoalId = 'g_sam_pending'
  goals.push({
    id: pendingGoalId,
    user_id: 'u_sam',
    circle_id: CIRCLE_ID,
    title: 'Write one gratitude line each morning',
    category: 'character',
    kind: 'fuzzy',
    status: 'pending_approval',
  })
  contracts.push({
    id: newId('k'),
    goal_id: pendingGoalId,
    proof_method: 'honest_checkin',
    frequency: 'daily',
    consequence: 'streak_break',
    forfeit_text: null,
    approved_by_circle: false,
  })
  const approvals = [
    { id: newId('a'), goal_id: pendingGoalId, user_id: 'u_theo', approved: true },
    { id: newId('a'), goal_id: pendingGoalId, user_id: 'u_jordan', approved: true },
  ]

  const messages = seedMessages(today)
  // pre-load a couple of 👏 on Sam's check-in card so counts aren't empty
  const samEvent = messages.find((m) => m.kind === 'checkin_event' && m.user_id === 'u_sam')
  const cheers: Cheer[] = samEvent
    ? [
        { id: newId('ch'), user_id: 'u_maya', message_id: samEvent.id, created_at: samEvent.created_at },
        { id: newId('ch'), user_id: 'u_jordan', message_id: samEvent.id, created_at: samEvent.created_at },
      ]
    : []

  return {
    users,
    circles: [
      {
        id: CIRCLE_ID,
        name: 'The Grind Squad',
        created_by: DEMO_USER_ID,
        member_cap: 6,
      },
    ],
    memberships,
    goals,
    contracts,
    approvals,
    checkins,
    messages,
    nudges: [],
    cheers,
    currentUserId: null, // signed out; the login screen sets this
  }
}

function mkCheckin(
  goalId: string,
  userId: string,
  date: string,
  status: 'done' | 'missed',
  proof: Contract['proof_method'],
): Checkin {
  const notes: Record<string, string> = {
    honest_checkin: 'showed up. not perfect but real.',
    focus_session: '25:00 focused',
  }
  return {
    id: newId('ci'),
    goal_id: goalId,
    user_id: userId,
    date,
    status,
    proof_url:
      status === 'done' && proof !== 'honest_checkin' && proof !== 'focus_session'
        ? `demo://proof/${goalId}/${date}`
        : null,
    note: status === 'done' ? (notes[proof] ?? null) : null,
  }
}

/** A little chat backstory: system welcome, banter, a check-in card, a nudge. */
function seedMessages(today: string): Message[] {
  const at = (dayOffset: number, hour: number, min = 0) => {
    const d = new Date(addDays(today, dayOffset))
    d.setHours(hour, min, 0, 0)
    return d.toISOString()
  }
  const msg = (
    partial: Omit<Message, 'id' | 'circle_id'>,
  ): Message => ({ id: newId('msg'), circle_id: CIRCLE_ID, ...partial })

  // find a recent weekday for a coherent SAT check-in card
  let theoDay = -1
  while (!isWeekday(addDays(today, theoDay)) && theoDay > -6) theoDay--

  return [
    msg({
      user_id: null,
      body: 'Maya started The Grind Squad. Circles stay small on purpose 🤏',
      kind: 'system',
      ref_goal_id: null,
      created_at: at(-6, 9),
    }),
    msg({
      user_id: 'u_theo',
      body: "ok i'm actually locking in this week. hold me to it",
      kind: 'text',
      ref_goal_id: null,
      created_at: at(-6, 9, 12),
    }),
    msg({
      user_id: 'u_priya',
      body: 'we got this 🎸 no more doomscrolling at 1am',
      kind: 'text',
      ref_goal_id: null,
      created_at: at(-6, 9, 20),
    }),
    msg({
      user_id: 'u_sam',
      body: 'checked in',
      kind: 'checkin_event',
      ref_goal_id: 'g_sam',
      created_at: at(-2, 7, 40),
    }),
    msg({
      user_id: 'u_theo',
      body: 'checked in',
      kind: 'checkin_event',
      ref_goal_id: 'g_theo',
      created_at: at(theoDay, 16, 5),
    }),
    msg({
      user_id: 'u_priya',
      body: 'nudged',
      kind: 'nudge',
      ref_goal_id: 'g_maya',
      created_at: at(-1, 20, 15),
    }),
    msg({
      user_id: 'u_jordan',
      body: 'lol ok ok reading my 20 pages now 🙄📖',
      kind: 'text',
      ref_goal_id: null,
      created_at: at(-1, 20, 22),
    }),
    msg({
      user_id: 'u_sam',
      body: 'wants the circle to approve a new goal: “Write one gratitude line each morning”',
      kind: 'system',
      ref_goal_id: 'g_sam_pending',
      created_at: at(0, 7, 55),
    }),
  ]
}
