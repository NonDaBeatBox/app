// ---------------------------------------------------------------------------
// In-memory, fully-reactive demo store. No network, no localStorage — a page
// refresh resets to the seed. Mutations replace the top-level DB reference so
// useSyncExternalStore re-renders, and simulate "realtime" for free.
// ---------------------------------------------------------------------------
import type {
  DB,
  ID,
  Circle,
  Goal,
  Contract,
  Checkin,
  Message,
  Nudge,
  MessageKind,
} from '../../types'
import type {
  Store,
  CreateGoalInput,
  CreateCheckinInput,
  SendNudgeInput,
} from './types'
import { seedDB, DEMO_USER_ID } from './seed'
import { newId } from './ids'
import { todayISO } from '../dates'
import { membersOf, membershipFor, goalById, userById } from '../selectors'
import { approvalStatus, detectMisses, computeStreak } from '../compute'

const nowISO = () => new Date().toISOString()

export class MockStore implements Store {
  readonly isDemo = true
  private db: DB
  private listeners = new Set<() => void>()
  private missHandled = false

  constructor() {
    this.db = seedDB(todayISO())
  }

  getSnapshot(): DB {
    return this.db
  }

  subscribe(cb: () => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  async ready(): Promise<void> {
    /* seed is synchronous */
  }

  /** Replace state (new top-level ref) and notify subscribers. */
  private set(next: DB) {
    this.db = next
    this.listeners.forEach((l) => l())
  }

  private patch(part: Partial<DB>) {
    this.set({ ...this.db, ...part })
  }

  private requireUser(): ID {
    if (!this.db.currentUserId) throw new Error('Not signed in')
    return this.db.currentUserId
  }

  // --- auth ----------------------------------------------------------------

  async signInWithEmail(_email: string): Promise<{ magicLinkSent: boolean }> {
    // Demo: the "magic link" is instant — become the seeded demo user so the
    // populated Grind Squad is right there.
    this.patch({ currentUserId: DEMO_USER_ID })
    return { magicLinkSent: false }
  }

  async signOut(): Promise<void> {
    this.patch({ currentUserId: null })
  }

  // --- circles -------------------------------------------------------------

  inviteLink(circleId: ID): string {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://circle.app'
    return `${origin}/join/${circleId}`
  }

  async createCircle(name: string): Promise<Circle> {
    const uid = this.requireUser()
    const circle: Circle = {
      id: newId('c'),
      name: name.trim() || 'My Circle',
      created_by: uid,
      member_cap: 6,
    }
    const membership = {
      id: newId('m'),
      user_id: uid,
      circle_id: circle.id,
      role: 'founder' as const,
      backs_user_id: null,
    }
    this.set({
      ...this.db,
      circles: [...this.db.circles, circle],
      memberships: [...this.db.memberships, membership],
      messages: [
        ...this.db.messages,
        this.systemMsg(
          circle.id,
          `${userById(this.db, uid)?.name ?? 'Someone'} started ${circle.name}. Circles stay small on purpose 🤏`,
        ),
      ],
    })
    return circle
  }

  async joinCircle(circleId: ID): Promise<void> {
    const uid = this.requireUser()
    if (membershipFor(this.db, uid, circleId)) return // already in
    const circle = this.db.circles.find((c) => c.id === circleId)
    if (!circle) throw new Error('Circle not found')
    const current = membersOf(this.db, circleId)
    if (current.length >= circle.member_cap) throw new Error('This circle is full')

    // ring backing: back the most recently joined member; and wire the
    // founder (who currently backs no one) to back the newcomer.
    const last = current[current.length - 1]
    const membership = {
      id: newId('m'),
      user_id: uid,
      circle_id: circleId,
      role: 'member' as const,
      backs_user_id: last ? last.user_id : null,
    }
    const memberships = this.db.memberships.map((m) =>
      m.circle_id === circleId && m.backs_user_id === null && m.user_id !== uid
        ? { ...m, backs_user_id: uid }
        : m,
    )
    this.set({
      ...this.db,
      memberships: [...memberships, membership],
      messages: [
        ...this.db.messages,
        this.systemMsg(
          circleId,
          `${userById(this.db, uid)?.name ?? 'A new member'} joined the circle 👋`,
        ),
      ],
    })
  }

  async leaveCircle(circleId: ID): Promise<void> {
    const uid = this.requireUser()
    // pending goals of this user in this circle -> paused
    const goals = this.db.goals.map((g) =>
      g.user_id === uid && g.circle_id === circleId && g.status === 'pending_approval'
        ? { ...g, status: 'paused' as const }
        : g,
    )
    this.set({
      ...this.db,
      goals,
      memberships: this.db.memberships.filter(
        (m) => !(m.user_id === uid && m.circle_id === circleId),
      ),
      // anyone who was backing this user in this circle now backs no one
      // (handled lazily by selectors; also clear the link)
      messages: [
        ...this.db.messages,
        this.systemMsg(
          circleId,
          `${userById(this.db, uid)?.name ?? 'A member'} left the circle. Pending goals are paused.`,
        ),
      ],
    })
    // clear dangling backs_user_id references
    this.patch({
      memberships: this.db.memberships.map((m) =>
        m.circle_id === circleId && m.backs_user_id === uid
          ? { ...m, backs_user_id: null }
          : m,
      ),
    })
  }

  // --- goals ---------------------------------------------------------------

  async createGoalWithContract(input: CreateGoalInput): Promise<Goal> {
    const uid = this.requireUser()
    const goal: Goal = {
      id: newId('g'),
      user_id: uid,
      circle_id: input.circleId,
      title: input.title.trim(),
      category: input.category,
      kind: input.kind,
      status: 'pending_approval',
    }
    const contract: Contract = {
      id: newId('k'),
      goal_id: goal.id,
      proof_method: input.proof_method,
      frequency: input.frequency,
      consequence: input.consequence,
      forfeit_text: input.forfeit_text?.trim() || null,
      approved_by_circle: false,
    }
    const others = membersOf(this.db, input.circleId).filter(
      (m) => m.user_id !== uid,
    )

    this.set({
      ...this.db,
      goals: [...this.db.goals, goal],
      contracts: [...this.db.contracts, contract],
      messages: [
        ...this.db.messages,
        this.mkMsg({
          circle_id: input.circleId,
          user_id: uid,
          body: `wants the circle to approve a new goal: “${goal.title}”`,
          kind: 'system',
          ref_goal_id: goal.id,
        }),
      ],
    })

    if (others.length === 0) {
      // solo circle: nothing to approve against — activate immediately.
      this.activateGoal(goal.id)
    } else {
      // demo: the other members trickle in their approvals over a few seconds.
      this.simulateApprovals(goal.id)
    }
    return goal
  }

  async setApproval(goalId: ID, approved: boolean): Promise<void> {
    const uid = this.requireUser()
    this.recordApproval(goalId, uid, approved)
  }

  private recordApproval(goalId: ID, userId: ID, approved: boolean) {
    const goal = goalById(this.db, goalId)
    if (!goal || goal.status !== 'pending_approval') return
    const existing = this.db.approvals.find(
      (a) => a.goal_id === goalId && a.user_id === userId,
    )
    const approvals = existing
      ? this.db.approvals.map((a) =>
          a === existing ? { ...a, approved } : a,
        )
      : [
          ...this.db.approvals,
          { id: newId('a'), goal_id: goalId, user_id: userId, approved },
        ]

    const name = userById(this.db, userId)?.name ?? 'Someone'
    this.set({
      ...this.db,
      approvals,
      messages: approved
        ? [
            ...this.db.messages,
            this.systemMsg(
              goal.circle_id,
              `${name} approved ${userById(this.db, goal.user_id)?.name ?? 'the'} goal ✅`,
            ),
          ]
        : this.db.messages,
    })

    if (approvalStatus(this.db, goalId).met) this.activateGoal(goalId)
  }

  private activateGoal(goalId: ID) {
    const goal = goalById(this.db, goalId)
    if (!goal || goal.status === 'active') return
    this.set({
      ...this.db,
      goals: this.db.goals.map((g) =>
        g.id === goalId ? { ...g, status: 'active' } : g,
      ),
      contracts: this.db.contracts.map((c) =>
        c.goal_id === goalId ? { ...c, approved_by_circle: true } : c,
      ),
      messages: [
        ...this.db.messages,
        this.systemMsg(
          goal.circle_id,
          `🎉 “${goal.title}” is live. The circle has your back.`,
        ),
      ],
    })
  }

  /** Demo-only: other members auto-approve on a gentle stagger. */
  private simulateApprovals(goalId: ID) {
    const goal = goalById(this.db, goalId)
    if (!goal) return
    const others = membersOf(this.db, goal.circle_id).filter(
      (m) => m.user_id !== goal.user_id,
    )
    others.forEach((m, i) => {
      window.setTimeout(
        () => this.recordApproval(goalId, m.user_id, true),
        1100 + i * 1000,
      )
    })
  }

  // --- check-ins -----------------------------------------------------------

  async uploadProof(file: File): Promise<string> {
    // in-memory object URL; lives for the session, no storage API.
    return URL.createObjectURL(file)
  }

  async createCheckin(input: CreateCheckinInput): Promise<Checkin> {
    const uid = this.requireUser()
    const date = input.date ?? todayISO()
    const status = input.status ?? 'done'
    const goal = goalById(this.db, input.goalId)
    if (!goal) throw new Error('Goal not found')

    // one check-in per goal per day — replace if it exists
    const existing = this.db.checkins.find(
      (c) => c.goal_id === input.goalId && c.date === date,
    )
    const checkin: Checkin = {
      id: existing?.id ?? newId('ci'),
      goal_id: input.goalId,
      user_id: uid,
      date,
      status,
      proof_url: input.proof_url ?? null,
      note: input.note ?? null,
    }
    const checkins = existing
      ? this.db.checkins.map((c) => (c === existing ? checkin : c))
      : [...this.db.checkins, checkin]

    const nextDB = { ...this.db, checkins }
    const streak = computeStreak(nextDB, input.goalId, date)

    this.set({
      ...nextDB,
      messages:
        status === 'done'
          ? [
              ...this.db.messages,
              this.mkMsg({
                circle_id: goal.circle_id,
                user_id: uid,
                body: `checked in${streak > 1 ? ` · ${streak} day streak 🔥` : ''}`,
                kind: 'checkin_event',
                ref_goal_id: goal.id,
              }),
            ]
          : this.db.messages,
    })
    return checkin
  }

  // --- chat ----------------------------------------------------------------

  async sendMessage(circleId: ID, body: string): Promise<Message> {
    const uid = this.requireUser()
    const message = this.mkMsg({
      circle_id: circleId,
      user_id: uid,
      body: body.trim(),
      kind: 'text',
      ref_goal_id: null,
    })
    this.patch({ messages: [...this.db.messages, message] })
    return message
  }

  // --- nudges --------------------------------------------------------------

  async sendNudge(input: SendNudgeInput): Promise<Nudge> {
    const uid = this.requireUser()
    const nudge: Nudge = {
      id: newId('n'),
      from_user_id: uid,
      to_user_id: input.toUserId,
      goal_id: input.goalId,
      level: input.level,
      created_at: nowISO(),
    }
    const toName = userById(this.db, input.toUserId)?.name ?? 'them'
    const verb =
      input.level === 'ping'
        ? `nudged ${toName} 👀`
        : input.level === 'you_good'
          ? `checked in on ${toName}: you good? 💬`
          : `wants to start a check-in call with ${toName} 📞`
    this.set({
      ...this.db,
      nudges: [...this.db.nudges, nudge],
      messages: [
        ...this.db.messages,
        this.mkMsg({
          circle_id: input.circleId,
          user_id: uid,
          body: verb,
          kind: 'nudge',
          ref_goal_id: input.goalId,
        }),
      ],
    })
    return nudge
  }

  async cheerMessage(messageId: ID): Promise<void> {
    const uid = this.requireUser()
    if (this.db.cheers.some((c) => c.message_id === messageId && c.user_id === uid)) return
    this.patch({
      cheers: [
        ...this.db.cheers,
        { id: newId('ch'), user_id: uid, message_id: messageId, created_at: nowISO() },
      ],
    })
  }

  // --- maintenance ---------------------------------------------------------

  async runMissHandling(): Promise<number> {
    if (this.missHandled) return 0
    this.missHandled = true
    const today = todayISO()
    const misses = detectMisses(this.db, today)
    if (misses.length === 0) return 0

    const newCheckins: Checkin[] = []
    const newMessages: Message[] = []
    for (const miss of misses) {
      newCheckins.push({
        id: newId('ci'),
        goal_id: miss.goal_id,
        user_id: miss.user_id,
        date: miss.date,
        status: 'missed',
        proof_url: null,
        note: null,
      })
      const who = userById(this.db, miss.user_id)?.name ?? 'Someone'
      const goal = goalById(this.db, miss.goal_id)
      let body: string
      if (miss.consequence === 'forfeit') {
        body = `${who} missed “${goal?.title ?? 'a goal'}”. Forfeit: ${
          miss.forfeit_text ?? 'as agreed'
        }`
      } else if (miss.consequence === 'streak_break') {
        body = `${who} missed a day — streak reset. Fresh start tomorrow.`
      } else {
        body = `${who} missed a day — the pulse takes a small hit for 24h.`
      }
      newMessages.push(
        this.mkMsg({
          circle_id: miss.circle_id,
          user_id: null,
          body,
          kind: 'system',
          ref_goal_id: miss.goal_id,
        }),
      )
    }
    this.set({
      ...this.db,
      checkins: [...this.db.checkins, ...newCheckins],
      messages: [...this.db.messages, ...newMessages],
    })
    return misses.length
  }

  // --- helpers -------------------------------------------------------------

  private mkMsg(partial: {
    circle_id: ID
    user_id: ID | null
    body: string
    kind: MessageKind
    ref_goal_id: ID | null
  }): Message {
    return { id: newId('msg'), created_at: nowISO(), ...partial }
  }

  private systemMsg(circleId: ID, body: string): Message {
    return this.mkMsg({
      circle_id: circleId,
      user_id: null,
      body,
      kind: 'system',
      ref_goal_id: null,
    })
  }
}
