// ---------------------------------------------------------------------------
// Circle domain types — mirror the Postgres tables one-to-one so the mock
// store and the real Supabase store share a single shape.
// ---------------------------------------------------------------------------

export type ID = string

export type Role = 'member' | 'founder'

export type GoalCategory =
  | 'sat'
  | 'school'
  | 'skill'
  | 'mindset'
  | 'character'
  | 'other'

export type GoalKind = 'concrete' | 'fuzzy'

export type GoalStatus = 'pending_approval' | 'active' | 'paused'

export type ProofMethod =
  | 'screenshot'
  | 'photo'
  | 'video'
  | 'voice_note'
  | 'focus_session'
  | 'link'
  | 'honest_checkin'

export type Frequency = 'daily' | 'weekdays'

export type Consequence = 'meter_hit' | 'streak_break' | 'forfeit'

export type CheckinStatus = 'done' | 'missed'

export type MessageKind = 'text' | 'checkin_event' | 'nudge' | 'system'

export type NudgeLevel = 'ping' | 'you_good' | 'call'

export interface User {
  id: ID
  name: string
  handle: string
  avatar_color: string
  phone: string | null
}

export interface Circle {
  id: ID
  name: string
  created_by: ID
  member_cap: number
}

export interface Membership {
  id: ID
  user_id: ID
  circle_id: ID
  role: Role
  /** the user whose goal this member has agreed to back */
  backs_user_id: ID | null
}

export interface Goal {
  id: ID
  user_id: ID
  circle_id: ID
  title: string
  category: GoalCategory
  kind: GoalKind
  status: GoalStatus
}

export interface Contract {
  id: ID
  goal_id: ID
  proof_method: ProofMethod
  frequency: Frequency
  consequence: Consequence
  forfeit_text: string | null
  approved_by_circle: boolean
}

export interface Approval {
  id: ID
  goal_id: ID
  user_id: ID
  approved: boolean
}

export interface Checkin {
  id: ID
  goal_id: ID
  user_id: ID
  /** ISO date, YYYY-MM-DD (local) */
  date: string
  status: CheckinStatus
  proof_url: string | null
  note: string | null
}

export interface Message {
  id: ID
  circle_id: ID
  user_id: ID | null
  body: string
  kind: MessageKind
  ref_goal_id: ID | null
  created_at: string // ISO timestamp
}

export interface Nudge {
  id: ID
  from_user_id: ID
  to_user_id: ID
  goal_id: ID
  level: NudgeLevel
  created_at: string
}

// ---------------------------------------------------------------------------
// The full in-memory database shape (also the Realtime snapshot shape).
// ---------------------------------------------------------------------------
export interface DB {
  users: User[]
  circles: Circle[]
  memberships: Membership[]
  goals: Goal[]
  contracts: Contract[]
  approvals: Approval[]
  checkins: Checkin[]
  messages: Message[]
  nudges: Nudge[]
  /** id of the signed-in user, or null when logged out */
  currentUserId: ID | null
}
