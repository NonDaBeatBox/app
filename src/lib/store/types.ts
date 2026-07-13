import type {
  DB,
  ID,
  Circle,
  Goal,
  Checkin,
  Message,
  Nudge,
  GoalCategory,
  GoalKind,
  ProofMethod,
  Frequency,
  Consequence,
  CheckinStatus,
  NudgeLevel,
} from '../../types'

export interface CreateGoalInput {
  circleId: ID
  title: string
  category: GoalCategory
  kind: GoalKind
  proof_method: ProofMethod
  frequency: Frequency
  consequence: Consequence
  forfeit_text?: string | null
}

export interface CreateCheckinInput {
  goalId: ID
  status?: CheckinStatus // default 'done'
  proof_url?: string | null
  note?: string | null
  date?: string // default today
}

export interface SendNudgeInput {
  circleId: ID
  toUserId: ID
  goalId: ID
  level: NudgeLevel
}

/**
 * One interface, two backends: an in-memory mock (demo mode) and a Supabase
 * client. The UI only ever talks to this.
 */
export interface Store {
  readonly isDemo: boolean

  /** Reactive snapshot plumbing for useSyncExternalStore. */
  getSnapshot(): DB
  subscribe(cb: () => void): () => void
  /** Resolves once the initial data load is complete (no-op in demo). */
  ready(): Promise<void>

  // --- auth ---
  signInWithEmail(email: string): Promise<{ magicLinkSent: boolean }>
  signOut(): Promise<void>

  // --- circles ---
  createCircle(name: string): Promise<Circle>
  joinCircle(circleId: ID): Promise<void>
  leaveCircle(circleId: ID): Promise<void>
  inviteLink(circleId: ID): string

  // --- goals + contracts ---
  createGoalWithContract(input: CreateGoalInput): Promise<Goal>
  setApproval(goalId: ID, approved: boolean): Promise<void>

  // --- check-ins ---
  uploadProof(file: File): Promise<string>
  createCheckin(input: CreateCheckinInput): Promise<Checkin>

  // --- chat ---
  sendMessage(circleId: ID, body: string): Promise<Message>

  // --- nudges ---
  sendNudge(input: SendNudgeInput): Promise<Nudge>
  /** Add a 👏 to a check-in event message (idempotent per user). */
  cheerMessage(messageId: ID): Promise<void>

  // --- maintenance ---
  /** Mark past scheduled days with no check-in as missed + apply consequences. */
  runMissHandling(): Promise<number>

  /** Demo-only: schedule an ambient reply from another member. No-op on real. */
  demoReply?(circleId: ID): void
}
