import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { Message, User } from '../types'
import { useStore, useDB, useCurrentUser, useToday } from '../lib/store'
import {
  circleById,
  membershipFor,
  usersOfCircle,
  userById,
  goalById,
  activeGoalsForUser,
  cheersForMessage,
  hasCheered,
} from '../lib/selectors'
import { computeStreak, approvalStatus } from '../lib/compute'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { useToast } from '../components/Toast'
import { StreakBadge } from '../components/Bits'
import { CATEGORY_META } from '../lib/labels'
import { BackIcon, PhoneIcon, VideoIcon, CheckIcon } from '../components/icons'

export default function Chat() {
  const { id = '' } = useParams()
  const db = useDB()
  const me = useCurrentUser()
  const store = useStore()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const circle = circleById(db, id)
  const messages = useMemo(
    () =>
      db.messages
        .filter((m) => m.circle_id === id)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [db.messages, id],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length])

  if (!me) return <Navigate to="/login" replace />
  if (!circle || !membershipFor(db, me.id, id)) return <Navigate to="/" replace />

  const members = usersOfCircle(db, id)
  const online = members.filter((_, i) => i % 3 !== 1) // deterministic "online" subset
  const phoneMember = members.find((u) => u.id !== me.id && u.phone)

  function send(e: React.FormEvent) {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setText('')
    store.sendMessage(id, body)
    store.demoReply?.(id)
  }

  return (
    <AppShell nav scroll={false}>
      {/* header */}
      <header className="flex items-center gap-2 border-b border-hairline bg-paper/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => navigate(`/c/${id}`)}
          className="btn-ghost h-9 w-9 rounded-full !p-0"
          aria-label="Back"
        >
          <BackIcon width={20} height={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-bold leading-tight text-ink">
            {circle.name}
          </h1>
          <p className="flex items-center gap-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            {online.length} online · {members.length} in the circle
          </p>
        </div>
        {/* member avatars */}
        <div className="mr-1 flex -space-x-2">
          {members.slice(0, 4).map((u) => (
            <Avatar key={u.id} user={u} size="xs" ring />
          ))}
        </div>
        {/* phone: tel handoff */}
        <CallIcons phoneMember={phoneMember} />
      </header>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} meId={me.id} circleId={id} />
        ))}
        <div className="h-1" />
      </div>

      {/* composer */}
      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-hairline bg-surface px-3 py-2.5"
      >
        <input
          className="flex-1 rounded-full border border-hairline bg-paper px-4 py-2.5 text-ink outline-none placeholder:text-muted focus:border-coral"
          placeholder="Say something to the circle…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={300}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn-primary h-11 w-11 shrink-0 rounded-full !p-0 disabled:opacity-40"
          aria-label="Send"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l16-8-6 8 6 8-16-8Z" />
          </svg>
        </button>
      </form>
    </AppShell>
  )
}

function CallIcons({ phoneMember }: { phoneMember?: User }) {
  const toast = useToast()
  return (
    <div className="flex items-center gap-1">
      {phoneMember ? (
        <a
          href={`tel:${phoneMember.phone}`}
          className="btn-ghost h-9 w-9 rounded-full !p-0 text-plum"
          aria-label={`Call ${phoneMember.name}`}
        >
          <PhoneIcon width={17} height={17} />
        </a>
      ) : (
        <button
          onClick={() => toast.info('Group calls arrive with the Circle Plan')}
          className="btn-ghost h-9 w-9 rounded-full !p-0 text-muted"
          aria-label="Call"
        >
          <PhoneIcon width={17} height={17} />
        </button>
      )}
      <button
        onClick={() => toast.info('Video rooms come with the Circle Plan')}
        className="h-9 w-9 rounded-full text-muted/50"
        aria-label="Video (coming with the Circle Plan)"
        title="Coming with the Circle Plan"
      >
        <VideoIcon width={17} height={17} />
      </button>
    </div>
  )
}

function MessageItem({
  message,
  meId,
  circleId,
}: {
  message: Message
  meId: string
  circleId: string
}) {
  const db = useDB()
  switch (message.kind) {
    case 'checkin_event':
      return <CheckinCard message={message} meId={meId} />
    case 'nudge':
      return <NudgeCard message={message} meId={meId} circleId={circleId} />
    case 'system': {
      const goal = message.ref_goal_id ? goalById(db, message.ref_goal_id) : undefined
      if (goal && goal.status === 'pending_approval' && goal.user_id !== meId)
        return <ApproveCard message={message} meId={meId} />
      return <SystemLine message={message} />
    }
    default:
      return <TextBubble message={message} meId={meId} />
  }
}

function TextBubble({ message, meId }: { message: Message; meId: string }) {
  const db = useDB()
  const mine = message.user_id === meId
  const author = userById(db, message.user_id)
  if (mine)
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-3xl rounded-br-lg bg-coral px-4 py-2.5 text-[15px] text-white shadow-soft">
          {message.body}
        </div>
      </div>
    )
  return (
    <div className="flex items-end gap-2">
      {author && <Avatar user={author} size="xs" />}
      <div className="max-w-[78%]">
        {author && <p className="mb-0.5 ml-1 text-[11px] font-bold text-muted">{author.name}</p>}
        <div className="rounded-3xl rounded-bl-lg bg-surface px-4 py-2.5 text-[15px] text-ink shadow-card">
          {message.body}
        </div>
      </div>
    </div>
  )
}

function SystemLine({ message }: { message: Message }) {
  return (
    <div className="flex justify-center py-1">
      <div className="max-w-[85%] rounded-full bg-plum/8 px-3.5 py-1.5 text-center text-xs font-medium text-plum">
        {message.body}
      </div>
    </div>
  )
}

function CheckinCard({ message, meId }: { message: Message; meId: string }) {
  const db = useDB()
  const store = useStore()
  const today = useToday()
  const author = userById(db, message.user_id)
  const goal = message.ref_goal_id ? goalById(db, message.ref_goal_id) : undefined
  if (!author || !goal) return null
  const streak = computeStreak(db, goal.id, today)
  const cheers = cheersForMessage(db, message.id).length
  const cheered = hasCheered(db, message.id, meId)

  return (
    <div className="rounded-3xl border border-green/25 bg-green/8 p-3.5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar user={author} size="md" />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green text-white">
            <CheckIcon width={12} height={12} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">
            {author.id === meId ? 'You' : author.name} checked in
          </p>
          <p className="truncate text-xs text-muted">
            {CATEGORY_META[goal.category].emoji} {goal.title}
          </p>
        </div>
        <StreakBadge streak={streak} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-green/15 pt-2.5">
        <span className="text-xs font-semibold text-muted">
          {cheers > 0 ? `👏 ${cheers}` : 'be the first to cheer'}
        </span>
        <button
          onClick={() => store.cheerMessage(message.id)}
          disabled={cheered}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            cheered
              ? 'bg-green/15 text-green'
              : 'bg-white text-ink shadow-card hover:bg-paper'
          }`}
        >
          {cheered ? 'cheered 👏' : 'Cheer 👏'}
        </button>
      </div>
    </div>
  )
}

function NudgeCard({
  message,
  meId,
  circleId,
}: {
  message: Message
  meId: string
  circleId: string
}) {
  const db = useDB()
  const store = useStore()
  const toast = useToast()
  const author = userById(db, message.user_id)
  if (!author) return null
  const mine = author.id === meId

  async function nudgeBack() {
    const goal = activeGoalsForUser(db, author!.id, circleId)[0]
    if (!goal) {
      toast.info(`${author!.name} has no active goal to nudge`)
      return
    }
    await store.sendNudge({ circleId, toUserId: author!.id, goalId: goal.id, level: 'ping' })
    toast.success(`Nudged ${author!.name} back 👀`)
  }

  return (
    <div className="rounded-3xl border border-amber/40 bg-amber/12 p-3.5">
      <div className="flex items-center gap-3">
        <Avatar user={author} size="sm" />
        <p className="min-w-0 flex-1 text-sm text-ink">
          <b>{mine ? 'You' : author.name}</b>{' '}
          <span className="text-ink/80">{message.body}</span>
        </p>
        {!mine && (
          <button
            onClick={nudgeBack}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-card hover:bg-paper"
          >
            Nudge back
          </button>
        )}
      </div>
    </div>
  )
}

function ApproveCard({ message, meId }: { message: Message; meId: string }) {
  const db = useDB()
  const store = useStore()
  const toast = useToast()
  const goal = message.ref_goal_id ? goalById(db, message.ref_goal_id) : undefined
  if (!goal) return null
  const owner = userById(db, goal.user_id)
  const status = approvalStatus(db, goal.id)
  const myApproval = db.approvals.find((a) => a.goal_id === goal.id && a.user_id === meId)

  async function approve() {
    try {
      await store.setApproval(goal!.id, true)
      toast.success('Approved 🙌')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not approve')
    }
  }

  return (
    <div className="rounded-3xl border border-plum/25 bg-plum/8 p-4">
      <div className="flex items-center gap-2">
        {owner && <Avatar user={owner} size="sm" />}
        <p className="text-sm font-bold text-ink">
          {owner?.name} wants to lock in a goal
        </p>
      </div>
      <p className="mt-2 rounded-2xl bg-surface px-3 py-2 text-sm text-ink">
        {CATEGORY_META[goal.category].emoji} {goal.title}
      </p>
      <p className="mt-2 text-xs text-muted">
        {status.approvals} of {status.needed} approvals · your circle decides together
      </p>
      <div className="mt-3">
        {myApproval?.approved ? (
          <div className="rounded-2xl bg-green/12 py-2.5 text-center text-sm font-bold text-green">
            ✓ You approved this
          </div>
        ) : (
          <button onClick={approve} className="btn-primary w-full py-2.5 text-sm">
            Approve {owner?.name}'s goal
          </button>
        )}
      </div>
    </div>
  )
}
