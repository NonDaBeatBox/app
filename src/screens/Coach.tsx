import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDB, useCurrentUser } from '../lib/store'
import { circlesForUser } from '../lib/selectors'
import { askCoach, coachHasKey, type CoachReply, type CoachSuggestion } from '../lib/coach'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { CATEGORY_META, PROOF_META, FREQ_META } from '../lib/labels'
import { SparkleIcon, BackIcon, PlusIcon } from '../components/icons'
import { newId } from '../lib/store/ids'

interface ChatItem {
  id: string
  role: 'user' | 'coach'
  text?: string
  reply?: CoachReply
}

const QUICK_PROMPTS = [
  'Help me stop doomscrolling',
  'I want to get better at guitar',
  'Something for SAT reading',
  'I want to start running',
]

export default function Coach() {
  const db = useDB()
  const me = useCurrentUser()
  const navigate = useNavigate()
  const circleId = me ? circlesForUser(db, me.id)[0]?.id : undefined

  const [items, setItems] = useState<ChatItem[]>([
    {
      id: 'intro',
      role: 'coach',
      text: coachHasKey()
        ? "Hey — I'm your Circle coach. Tell me what you want to work on and I'll shape it into a small, doable goal. (Mind, skill, and character only — physical goals are coming soon.)"
        : "Hey — I'm your Circle coach. Tell me what you want to work on and I'll shape it into a small, doable goal. I'm running offline right now, so I'll use my best guess.",
    },
  ])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function send(prompt: string) {
    const q = prompt.trim()
    if (!q || busy) return
    setText('')
    setItems((xs) => [...xs, { id: newId('m'), role: 'user', text: q }])
    setBusy(true)
    // scroll after render
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 30)
    try {
      const reply = await askCoach(q)
      setItems((xs) => [...xs, { id: newId('m'), role: 'coach', reply }])
    } catch {
      setItems((xs) => [
        ...xs,
        { id: newId('m'), role: 'coach', text: "Hmm, I glitched. Try rephrasing that?" },
      ])
    } finally {
      setBusy(false)
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 30)
    }
  }

  function addGoal(s: CoachSuggestion) {
    const to = circleId ? `/c/${circleId}/goal/new` : '/circles/new'
    navigate(to, { state: circleId ? s : undefined })
  }

  return (
    <AppShell nav scroll={false}>
      <header className="flex items-center gap-2 border-b border-hairline bg-paper/90 px-3 py-2.5 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost h-9 w-9 rounded-full !p-0"
          aria-label="Back"
        >
          <BackIcon width={20} height={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/15 text-coral">
            <SparkleIcon width={18} height={18} />
          </span>
          <div>
            <h1 className="font-display text-base font-bold leading-tight text-ink">Coach</h1>
            <p className="text-[11px] text-muted">
              {coachHasKey() ? 'powered by Claude' : 'offline · heuristic'}
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {items.map((it) =>
          it.role === 'user' ? (
            <div key={it.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-coral px-4 py-2.5 text-[15px] text-white shadow-soft">
                {it.text}
              </div>
            </div>
          ) : (
            <div key={it.id} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
                <SparkleIcon width={15} height={15} />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                {it.text && (
                  <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-surface px-4 py-2.5 text-[15px] text-ink shadow-card">
                    {it.text}
                  </div>
                )}
                {it.reply && <ReplyBlock reply={it.reply} onAdd={addGoal} />}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex items-center gap-2 pl-9 text-sm text-muted">
            <span className="flex gap-1">
              <Dot /> <Dot /> <Dot />
            </span>
            thinking…
          </div>
        )}
        {items.length === 1 && (
          <div className="flex flex-wrap gap-2 pl-9 pt-1">
            {QUICK_PROMPTS.map((p) => (
              <button key={p} onClick={() => send(p)} className="chip text-xs">
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
        }}
        className="flex items-center gap-2 border-t border-hairline bg-surface px-3 py-2.5"
      >
        <input
          className="flex-1 rounded-full border border-hairline bg-paper px-4 py-2.5 text-ink outline-none placeholder:text-muted focus:border-coral"
          placeholder="What do you want to work on?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={!text.trim() || busy}
          className="btn-primary h-11 w-11 shrink-0 rounded-full !p-0 disabled:opacity-40"
          aria-label="Ask"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l16-8-6 8 6 8-16-8Z" />
          </svg>
        </button>
      </form>
    </AppShell>
  )
}

function ReplyBlock({
  reply,
  onAdd,
}: {
  reply: CoachReply
  onAdd: (s: CoachSuggestion) => void
}) {
  if (reply.kind === 'notice') {
    return (
      <div className="space-y-2">
        <div className="max-w-[90%] rounded-3xl rounded-bl-lg border border-amber/40 bg-amber/10 px-4 py-3 text-[15px] text-ink">
          🏋️ {reply.message}
        </div>
        {reply.alternative && <GoalCard s={reply.alternative} onAdd={onAdd} />}
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {reply.note && (
        <div className="max-w-[85%] rounded-3xl rounded-bl-lg bg-surface px-4 py-2.5 text-[15px] text-ink shadow-card">
          {reply.note}
        </div>
      )}
      <GoalCard s={reply.suggestion} onAdd={onAdd} />
    </div>
  )
}

function GoalCard({ s, onAdd }: { s: CoachSuggestion; onAdd: (s: CoachSuggestion) => void }) {
  return (
    <div className="max-w-[92%] animate-pop-in rounded-3xl border border-coral/30 bg-coral/[0.06] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-coral">Suggested goal</p>
      <p className="mt-1 font-display text-base font-bold leading-snug text-ink">
        {CATEGORY_META[s.category].emoji} {s.title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Tag>{CATEGORY_META[s.category].label}</Tag>
        <Tag>{PROOF_META[s.proof_method].emoji} {PROOF_META[s.proof_method].label}</Tag>
        <Tag>{FREQ_META[s.frequency].label}</Tag>
      </div>
      <Button full className="mt-3" size="sm" onClick={() => onAdd(s)}>
        <PlusIcon width={16} height={16} /> Add this goal
      </Button>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink">
      {children}
    </span>
  )
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-muted" />
}
