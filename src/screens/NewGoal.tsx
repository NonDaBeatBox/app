import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import type {
  GoalCategory,
  ProofMethod,
  Frequency,
  Consequence,
} from '../types'
import { useStore, useDB, useCurrentUser } from '../lib/store'
import { circleById, membershipFor, membersOf, goalById } from '../lib/selectors'
import { approvalStatus } from '../lib/compute'
import { AppShell, TopBar } from '../components/AppShell'
import { Button } from '../components/Button'
import { Avatar } from '../components/Avatar'
import { useToast } from '../components/Toast'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  PROOF_META,
  PROOF_ORDER,
  FREQ_META,
  CONSEQUENCE_META,
} from '../lib/labels'
import { SparkleIcon } from '../components/icons'

interface Prefill {
  title?: string
  category?: GoalCategory
  proof_method?: ProofMethod
  frequency?: Frequency
}

export default function NewGoal() {
  const { id = '' } = useParams()
  const db = useDB()
  const me = useCurrentUser()
  if (!me) return <Navigate to="/login" replace />
  if (!circleById(db, id) || !membershipFor(db, me.id, id))
    return <Navigate to="/" replace />
  return <NewGoalForm circleId={id} />
}

function NewGoalForm({ circleId }: { circleId: string }) {
  const store = useStore()
  const toast = useToast()
  const prefill = (useLocation().state as Prefill | null) ?? {}

  const [title, setTitle] = useState(prefill.title ?? '')
  const [category, setCategory] = useState<GoalCategory>(prefill.category ?? 'mindset')
  const [otherLabel, setOtherLabel] = useState('')
  const [proof, setProof] = useState<ProofMethod>(
    prefill.proof_method ?? CATEGORY_META[prefill.category ?? 'mindset'].defaultProof,
  )
  const [proofTouched, setProofTouched] = useState(!!prefill.proof_method)
  const [frequency, setFrequency] = useState<Frequency>(prefill.frequency ?? 'daily')
  const [consequence, setConsequence] = useState<Consequence>('streak_break')
  const [forfeitText, setForfeitText] = useState('')
  const [busy, setBusy] = useState(false)
  const [submittedGoalId, setSubmittedGoalId] = useState<string | null>(null)

  function pickCategory(c: GoalCategory) {
    setCategory(c)
    if (!proofTouched) setProof(CATEGORY_META[c].defaultProof)
  }

  async function submit() {
    if (busy || !title.trim()) return
    setBusy(true)
    try {
      const goal = await store.createGoalWithContract({
        circleId,
        title: title.trim(),
        category,
        kind: proof === 'honest_checkin' ? 'fuzzy' : 'concrete',
        proof_method: proof,
        frequency,
        consequence,
        forfeit_text: consequence === 'forfeit' ? forfeitText : null,
      })
      setSubmittedGoalId(goal.id)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create goal')
    } finally {
      setBusy(false)
    }
  }

  if (submittedGoalId)
    return <AwaitingApproval goalId={submittedGoalId} circleId={circleId} />

  return (
    <AppShell>
      <TopBar title="Set a goal" back />
      <div className="flex flex-col gap-6 px-5 pb-32 pt-5">
        {/* title */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="label mb-0" htmlFor="title">
              What are you chasing?
            </label>
            <Link
              to="/coach"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-coral"
            >
              <SparkleIcon width={14} height={14} /> Ask the coach
            </Link>
          </div>
          <textarea
            id="title"
            className="input resize-none text-base"
            rows={2}
            placeholder="e.g. Read 20 pages before I open my phone"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            autoFocus
          />
        </div>

        {/* category */}
        <div>
          <p className="label">Lane</p>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
            {CATEGORY_ORDER.map((c) => (
              <button
                key={c}
                onClick={() => pickCategory(c)}
                className={`chip ${category === c ? 'chip-active' : ''}`}
              >
                <span>{CATEGORY_META[c].emoji}</span> {CATEGORY_META[c].label}
              </button>
            ))}
          </div>
          {category === 'other' && (
            <input
              className="input mt-3 animate-pop-in"
              placeholder="Name your own lane…"
              value={otherLabel}
              onChange={(e) => setOtherLabel(e.target.value)}
              maxLength={30}
            />
          )}
        </div>

        {/* proof method */}
        <div>
          <p className="label">How you'll prove it</p>
          <p className="-mt-1 mb-2 text-xs text-muted">
            Suggested for {CATEGORY_META[category].label.toLowerCase()} — pick any.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PROOF_ORDER.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProof(p)
                  setProofTouched(true)
                }}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-colors ${
                  proof === p
                    ? 'border-coral bg-coral/8 text-ink'
                    : 'border-hairline bg-surface text-ink hover:bg-paper'
                }`}
              >
                <span className="text-lg">{PROOF_META[p].emoji}</span>
                <span className="leading-tight">{PROOF_META[p].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* frequency */}
        <div>
          <p className="label">How often</p>
          <div className="grid grid-cols-2 gap-2">
            {(['daily', 'weekdays'] as Frequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                  frequency === f
                    ? 'border-coral bg-coral/8'
                    : 'border-hairline bg-surface hover:bg-paper'
                }`}
              >
                <p className="text-sm font-bold text-ink">{FREQ_META[f].label}</p>
                <p className="text-xs text-muted">{FREQ_META[f].sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* consequence */}
        <div>
          <p className="label">If you miss a day</p>
          <div className="flex flex-col gap-2">
            {(Object.keys(CONSEQUENCE_META) as Consequence[]).map((c) => (
              <button
                key={c}
                onClick={() => setConsequence(c)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  consequence === c
                    ? 'border-coral bg-coral/8'
                    : 'border-hairline bg-surface hover:bg-paper'
                }`}
              >
                <span className="text-xl">{CONSEQUENCE_META[c].emoji}</span>
                <span>
                  <span className="block text-sm font-bold text-ink">
                    {CONSEQUENCE_META[c].label}
                  </span>
                  <span className="block text-xs text-muted">
                    {CONSEQUENCE_META[c].help}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {consequence === 'forfeit' && (
            <div className="mt-3 animate-pop-in">
              <input
                className="input"
                placeholder="e.g. bring the circle coffee ☕"
                value={forfeitText}
                onChange={(e) => setForfeitText(e.target.value)}
                maxLength={80}
              />
              <p className="mt-1.5 text-xs text-muted">
                Keep it small and kind — never money.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* sticky submit */}
      <div className="sticky bottom-0 border-t border-hairline bg-paper/95 px-5 py-4 backdrop-blur">
        <Button full size="lg" onClick={submit} disabled={busy || !title.trim()}>
          {busy ? 'Sending to the circle…' : 'Send to the circle for approval'}
        </Button>
      </div>
    </AppShell>
  )
}

function AwaitingApproval({ goalId, circleId }: { goalId: string; circleId: string }) {
  const db = useDB()
  const me = useCurrentUser()
  const navigate = useNavigate()
  const goal = goalById(db, goalId)
  const status = approvalStatus(db, goalId)
  const isActive = goal?.status === 'active'
  const others = membersOf(db, circleId).filter((m) => m.user_id !== me?.id)

  return (
    <AppShell>
      <TopBar title={isActive ? "You're live" : 'Waiting on the circle'} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        {isActive ? (
          <>
            <div className="animate-pop-in text-6xl">🎉</div>
            <div>
              <h2 className="font-display text-2xl font-extrabold text-ink">
                The circle's got you
              </h2>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm text-muted">
                “{goal?.title}” is active. Time to show up — your first check-in
                sets the tone.
              </p>
            </div>
            <div className="w-full max-w-xs space-y-3">
              <Button full size="lg" onClick={() => navigate(`/checkin/${goalId}`)}>
                Do your first check-in
              </Button>
              <Button full variant="ghost" onClick={() => navigate(`/c/${circleId}`)}>
                Back to circle
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-hairline">
              <span className="font-display text-2xl font-extrabold text-plum">
                {status.approvals}/{status.needed}
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink">
                Waiting on {Math.max(0, status.needed - status.approvals)} more{' '}
                {status.needed - status.approvals === 1 ? 'approval' : 'approvals'}
              </h2>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm text-muted">
                A goal goes live once a majority of your circle signs off. They
                just got an approve card in chat.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {others.map((m) => {
                const approved = db.approvals.some(
                  (a) => a.goal_id === goalId && a.user_id === m.user_id && a.approved,
                )
                const u = db.users.find((x) => x.id === m.user_id)!
                return (
                  <div key={m.user_id} className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <Avatar user={u} size="md" />
                      {approved && (
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green text-[11px] text-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted">
                      {approved ? 'approved' : 'thinking…'}
                    </span>
                  </div>
                )
              })}
            </div>
            <Button variant="ghost" onClick={() => navigate(`/c/${circleId}`)}>
              Wait in the circle
            </Button>
          </>
        )}
      </div>
    </AppShell>
  )
}
