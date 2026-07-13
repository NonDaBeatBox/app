// ---------------------------------------------------------------------------
// Supabase-backed store. Used when VITE_SUPABASE_URL is set. Keeps a local DB
// cache that mirrors the mock store's shape, refreshed on auth changes and on
// realtime postgres_changes so chat + pulse stay live. RLS (see
// supabase/schema.sql) guarantees a user only ever reads circles they're in.
// ---------------------------------------------------------------------------
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DB, ID, Circle, Goal, Checkin, Message, Nudge } from '../../types'
import type {
  Store,
  CreateGoalInput,
  CreateCheckinInput,
  SendNudgeInput,
} from './types'
import { PROOFS_BUCKET } from '../supabase'
import { todayISO } from '../dates'
import { detectMisses } from '../compute'

const EMPTY: DB = {
  users: [],
  circles: [],
  memberships: [],
  goals: [],
  contracts: [],
  approvals: [],
  checkins: [],
  messages: [],
  nudges: [],
  cheers: [],
  currentUserId: null,
}

const AVATAR_COLORS = ['#4B2E63', '#FF6A5D', '#25BE86', '#FFB23E', '#D9547E', '#7C5CBF']

export class SupabaseStore implements Store {
  readonly isDemo = false
  private db: DB = EMPTY
  private listeners = new Set<() => void>()
  private sb: SupabaseClient
  private readyPromise: Promise<void>
  private reloadTimer: ReturnType<typeof setTimeout> | null = null
  private missHandled = false

  constructor(sb: SupabaseClient) {
    this.sb = sb
    this.readyPromise = this.init()
  }

  getSnapshot(): DB {
    return this.db
  }
  subscribe(cb: () => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }
  ready(): Promise<void> {
    return this.readyPromise
  }

  private set(next: DB) {
    this.db = next
    this.listeners.forEach((l) => l())
  }

  private async init() {
    const { data } = await this.sb.auth.getSession()
    await this.ensureProfile(data.session?.user)
    await this.reload()
    this.sb.auth.onAuthStateChange(async (_e, session) => {
      await this.ensureProfile(session?.user)
      await this.reload()
    })
    this.subscribeRealtime()
  }

  /** Make sure a `users` row exists for the signed-in auth user. */
  private async ensureProfile(user: { id: string; email?: string } | undefined) {
    if (!user) return
    const { data } = await this.sb.from('users').select('id').eq('id', user.id).maybeSingle()
    if (data) return
    const base = (user.email ?? 'friend').split('@')[0].replace(/[^a-z0-9]/gi, '')
    await this.sb.from('users').insert({
      id: user.id,
      name: base.charAt(0).toUpperCase() + base.slice(1),
      handle: base.toLowerCase() || 'friend',
      avatar_color: AVATAR_COLORS[base.length % AVATAR_COLORS.length],
      phone: null,
    })
  }

  private subscribeRealtime() {
    this.sb
      .channel('circle-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'approvals' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nudges' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cheers' }, () =>
        this.scheduleReload(),
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memberships' }, () =>
        this.scheduleReload(),
      )
      .subscribe()
  }

  private scheduleReload() {
    if (this.reloadTimer) clearTimeout(this.reloadTimer)
    this.reloadTimer = setTimeout(() => this.reload(), 120)
  }

  /** Refetch everything the current user can see (RLS scopes it for us). */
  private async reload() {
    const { data: auth } = await this.sb.auth.getUser()
    const uid = auth.user?.id ?? null
    if (!uid) {
      this.set({ ...EMPTY })
      return
    }
    const tables = [
      'users',
      'circles',
      'memberships',
      'goals',
      'contracts',
      'approvals',
      'checkins',
      'messages',
      'nudges',
      'cheers',
    ] as const
    const results = await Promise.all(
      tables.map((t) => this.sb.from(t).select('*')),
    )
    const byName = Object.fromEntries(
      tables.map((t, i) => [t, results[i].data ?? []]),
    ) as Record<(typeof tables)[number], unknown[]>

    this.set({
      users: byName.users as DB['users'],
      circles: byName.circles as DB['circles'],
      memberships: byName.memberships as DB['memberships'],
      goals: byName.goals as DB['goals'],
      contracts: byName.contracts as DB['contracts'],
      approvals: byName.approvals as DB['approvals'],
      checkins: byName.checkins as DB['checkins'],
      messages: byName.messages as DB['messages'],
      nudges: byName.nudges as DB['nudges'],
      cheers: byName.cheers as DB['cheers'],
      currentUserId: uid,
    })
  }

  private requireUser(): ID {
    if (!this.db.currentUserId) throw new Error('Not signed in')
    return this.db.currentUserId
  }

  // --- auth ---
  async signInWithEmail(email: string): Promise<{ magicLinkSent: boolean }> {
    const { error } = await this.sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
    return { magicLinkSent: true }
  }
  async signOut(): Promise<void> {
    await this.sb.auth.signOut()
    this.set({ ...EMPTY })
  }

  // --- circles ---
  inviteLink(circleId: ID): string {
    return `${window.location.origin}/join/${circleId}`
  }

  async createCircle(name: string): Promise<Circle> {
    const uid = this.requireUser()
    const { data, error } = await this.sb
      .from('circles')
      .insert({ name: name.trim() || 'My Circle', created_by: uid, member_cap: 6 })
      .select()
      .single()
    if (error) throw error
    const circle = data as Circle
    await this.sb.from('memberships').insert({
      user_id: uid,
      circle_id: circle.id,
      role: 'founder',
      backs_user_id: null,
    })
    await this.reload()
    return circle
  }

  async joinCircle(circleId: ID): Promise<void> {
    const uid = this.requireUser()
    await this.sb
      .from('memberships')
      .insert({ user_id: uid, circle_id: circleId, role: 'member', backs_user_id: null })
    await this.reload()
  }

  async leaveCircle(circleId: ID): Promise<void> {
    const uid = this.requireUser()
    await this.sb
      .from('goals')
      .update({ status: 'paused' })
      .eq('user_id', uid)
      .eq('circle_id', circleId)
      .eq('status', 'pending_approval')
    await this.sb.from('memberships').delete().eq('user_id', uid).eq('circle_id', circleId)
    await this.reload()
  }

  // --- goals ---
  async createGoalWithContract(input: CreateGoalInput): Promise<Goal> {
    const uid = this.requireUser()
    const { data, error } = await this.sb
      .from('goals')
      .insert({
        user_id: uid,
        circle_id: input.circleId,
        title: input.title.trim(),
        category: input.category,
        kind: input.kind,
        status: 'pending_approval',
      })
      .select()
      .single()
    if (error) throw error
    const goal = data as Goal
    await this.sb.from('contracts').insert({
      goal_id: goal.id,
      proof_method: input.proof_method,
      frequency: input.frequency,
      consequence: input.consequence,
      forfeit_text: input.forfeit_text?.trim() || null,
      approved_by_circle: false,
    })
    await this.sb.from('messages').insert({
      circle_id: input.circleId,
      user_id: uid,
      body: `wants the circle to approve a new goal: “${goal.title}”`,
      kind: 'system',
      ref_goal_id: goal.id,
    })
    await this.reload()
    return goal
  }

  async setApproval(goalId: ID, approved: boolean): Promise<void> {
    const uid = this.requireUser()
    const goal = this.db.goals.find((g) => g.id === goalId)
    if (!goal) return
    await this.sb
      .from('approvals')
      .upsert(
        { goal_id: goalId, user_id: uid, approved },
        { onConflict: 'goal_id,user_id' },
      )
    // recompute majority-of-others and activate if met
    const others = this.db.memberships.filter(
      (m) => m.circle_id === goal.circle_id && m.user_id !== goal.user_id,
    ).length
    const yes =
      this.db.approvals.filter((a) => a.goal_id === goalId && a.approved).length +
      (approved ? 1 : 0)
    const needed = others === 0 ? 1 : Math.floor(others / 2) + 1
    if (yes >= needed) {
      await this.sb.from('goals').update({ status: 'active' }).eq('id', goalId)
      await this.sb
        .from('contracts')
        .update({ approved_by_circle: true })
        .eq('goal_id', goalId)
      await this.sb.from('messages').insert({
        circle_id: goal.circle_id,
        user_id: null,
        body: `🎉 “${goal.title}” is live. The circle has your back.`,
        kind: 'system',
        ref_goal_id: goal.id,
      })
    }
    await this.reload()
  }

  // --- check-ins ---
  async uploadProof(file: File): Promise<string> {
    const uid = this.requireUser()
    const ext = file.name.split('.').pop() || 'bin'
    const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await this.sb.storage.from(PROOFS_BUCKET).upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    })
    if (error) throw error
    const { data } = this.sb.storage.from(PROOFS_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async createCheckin(input: CreateCheckinInput): Promise<Checkin> {
    const uid = this.requireUser()
    const date = input.date ?? todayISO()
    const status = input.status ?? 'done'
    const goal = this.db.goals.find((g) => g.id === input.goalId)
    const { data, error } = await this.sb
      .from('checkins')
      .upsert(
        {
          goal_id: input.goalId,
          user_id: uid,
          date,
          status,
          proof_url: input.proof_url ?? null,
          note: input.note ?? null,
        },
        { onConflict: 'goal_id,date' },
      )
      .select()
      .single()
    if (error) throw error
    if (status === 'done' && goal) {
      await this.sb.from('messages').insert({
        circle_id: goal.circle_id,
        user_id: uid,
        body: 'checked in',
        kind: 'checkin_event',
        ref_goal_id: goal.id,
      })
    }
    await this.reload()
    return data as Checkin
  }

  // --- chat ---
  async sendMessage(circleId: ID, body: string): Promise<Message> {
    const uid = this.requireUser()
    const { data, error } = await this.sb
      .from('messages')
      .insert({ circle_id: circleId, user_id: uid, body: body.trim(), kind: 'text', ref_goal_id: null })
      .select()
      .single()
    if (error) throw error
    return data as Message
  }

  // --- nudges ---
  async sendNudge(input: SendNudgeInput): Promise<Nudge> {
    const uid = this.requireUser()
    const { data, error } = await this.sb
      .from('nudges')
      .insert({
        from_user_id: uid,
        to_user_id: input.toUserId,
        goal_id: input.goalId,
        level: input.level,
      })
      .select()
      .single()
    if (error) throw error
    const toName = this.db.users.find((u) => u.id === input.toUserId)?.name ?? 'them'
    const verb =
      input.level === 'ping'
        ? `nudged ${toName} 👀`
        : input.level === 'you_good'
          ? `checked in on ${toName}: you good? 💬`
          : `wants to start a check-in call with ${toName} 📞`
    await this.sb.from('messages').insert({
      circle_id: input.circleId,
      user_id: uid,
      body: verb,
      kind: 'nudge',
      ref_goal_id: input.goalId,
    })
    return data as Nudge
  }

  async cheerMessage(messageId: ID): Promise<void> {
    const uid = this.requireUser()
    if (this.db.cheers.some((c) => c.message_id === messageId && c.user_id === uid)) return
    await this.sb
      .from('cheers')
      .upsert({ user_id: uid, message_id: messageId }, { onConflict: 'user_id,message_id' })
    await this.reload()
  }

  // --- maintenance ---
  async runMissHandling(): Promise<number> {
    if (this.missHandled) return 0
    this.missHandled = true
    const misses = detectMisses(this.db, todayISO())
    for (const miss of misses) {
      await this.sb.from('checkins').upsert(
        {
          goal_id: miss.goal_id,
          user_id: miss.user_id,
          date: miss.date,
          status: 'missed',
          proof_url: null,
          note: null,
        },
        { onConflict: 'goal_id,date' },
      )
      const goal = this.db.goals.find((g) => g.id === miss.goal_id)
      const who = this.db.users.find((u) => u.id === miss.user_id)?.name ?? 'Someone'
      const body =
        miss.consequence === 'forfeit'
          ? `${who} missed “${goal?.title ?? 'a goal'}”. Forfeit: ${miss.forfeit_text ?? 'as agreed'}`
          : miss.consequence === 'streak_break'
            ? `${who} missed a day — streak reset. Fresh start tomorrow.`
            : `${who} missed a day — the pulse takes a small hit for 24h.`
      await this.sb.from('messages').insert({
        circle_id: miss.circle_id,
        user_id: null,
        body,
        kind: 'system',
        ref_goal_id: miss.goal_id,
      })
    }
    if (misses.length) await this.reload()
    return misses.length
  }
}
