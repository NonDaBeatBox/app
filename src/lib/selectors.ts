// ---------------------------------------------------------------------------
// Pure read-only selectors over a DB snapshot. No mutation, no dates logic —
// just indexed lookups the compute layer and UI both lean on.
// ---------------------------------------------------------------------------
import type {
  DB,
  ID,
  User,
  Circle,
  Membership,
  Goal,
  Contract,
  Approval,
  Checkin,
  Message,
  Nudge,
} from '../types'

export function userById(db: DB, id: ID | null): User | undefined {
  return id ? db.users.find((u) => u.id === id) : undefined
}

export function circleById(db: DB, id: ID): Circle | undefined {
  return db.circles.find((c) => c.id === id)
}

export function goalById(db: DB, id: ID): Goal | undefined {
  return db.goals.find((g) => g.id === id)
}

/** All memberships in a circle. */
export function membersOf(db: DB, circleId: ID): Membership[] {
  return db.memberships.filter((m) => m.circle_id === circleId)
}

/** All users in a circle (deduped, in membership order). */
export function usersOfCircle(db: DB, circleId: ID): User[] {
  return membersOf(db, circleId)
    .map((m) => userById(db, m.user_id))
    .filter((u): u is User => !!u)
}

export function membershipFor(
  db: DB,
  userId: ID,
  circleId: ID,
): Membership | undefined {
  return db.memberships.find(
    (m) => m.user_id === userId && m.circle_id === circleId,
  )
}

/** Circles a user belongs to. */
export function circlesForUser(db: DB, userId: ID): Circle[] {
  const ids = new Set(
    db.memberships.filter((m) => m.user_id === userId).map((m) => m.circle_id),
  )
  return db.circles.filter((c) => ids.has(c.id))
}

export function goalsForUser(db: DB, userId: ID, circleId?: ID): Goal[] {
  return db.goals.filter(
    (g) =>
      g.user_id === userId && (circleId ? g.circle_id === circleId : true),
  )
}

export function activeGoalsForUser(db: DB, userId: ID, circleId?: ID): Goal[] {
  return goalsForUser(db, userId, circleId).filter((g) => g.status === 'active')
}

/** All active goals in a circle. */
export function activeGoalsInCircle(db: DB, circleId: ID): Goal[] {
  return db.goals.filter((g) => g.circle_id === circleId && g.status === 'active')
}

export function contractForGoal(db: DB, goalId: ID): Contract | undefined {
  return db.contracts.find((c) => c.goal_id === goalId)
}

export function checkinsForGoal(db: DB, goalId: ID): Checkin[] {
  return db.checkins.filter((c) => c.goal_id === goalId)
}

export function checkinForGoalOnDate(
  db: DB,
  goalId: ID,
  date: string,
): Checkin | undefined {
  return db.checkins.find((c) => c.goal_id === goalId && c.date === date)
}

export function approvalsForGoal(db: DB, goalId: ID): Approval[] {
  return db.approvals.filter((a) => a.goal_id === goalId)
}

export function messagesForCircle(db: DB, circleId: ID): Message[] {
  return db.messages
    .filter((m) => m.circle_id === circleId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export function nudgesForUser(db: DB, toUserId: ID): Nudge[] {
  return db.nudges.filter((n) => n.to_user_id === toUserId)
}

/**
 * The goal a member has agreed to back: their membership's backs_user_id
 * resolves to that person's (first) active goal in the same circle.
 */
export function backedGoalFor(
  db: DB,
  userId: ID,
  circleId: ID,
): { user: User; goal: Goal } | undefined {
  const m = membershipFor(db, userId, circleId)
  if (!m?.backs_user_id) return undefined
  const user = userById(db, m.backs_user_id)
  if (!user) return undefined
  const goal =
    activeGoalsForUser(db, m.backs_user_id, circleId)[0] ??
    goalsForUser(db, m.backs_user_id, circleId)[0]
  if (!goal) return undefined
  return { user, goal }
}

/** Members who back a given user (i.e. who is holding this person's goal). */
export function backersOf(db: DB, userId: ID, circleId: ID): User[] {
  return membersOf(db, circleId)
    .filter((m) => m.backs_user_id === userId)
    .map((m) => userById(db, m.user_id))
    .filter((u): u is User => !!u)
}

/** Did the user complete a check-in today on any active goal in the circle? */
export function checkedInToday(
  db: DB,
  userId: ID,
  circleId: ID,
  today: string,
): boolean {
  const goalIds = new Set(
    activeGoalsForUser(db, userId, circleId).map((g) => g.id),
  )
  return db.checkins.some(
    (c) =>
      goalIds.has(c.goal_id) &&
      c.date === today &&
      c.status === 'done',
  )
}
