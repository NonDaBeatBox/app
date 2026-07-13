import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { ProofMethod } from '../types'
import { useStore, useDB, useCurrentUser, useToday } from '../lib/store'
import {
  goalById,
  contractForGoal,
  checkinForGoalOnDate,
} from '../lib/selectors'
import { computeStreak } from '../lib/compute'
import { AppShell, TopBar } from '../components/AppShell'
import { Button } from '../components/Button'
import { useToast } from '../components/Toast'
import { StreakBadge } from '../components/Bits'
import { CATEGORY_META, PROOF_META, FREQ_META } from '../lib/labels'
import { CameraIcon, VideoIcon, MicIcon, LinkIcon, CheckIcon } from '../components/icons'

export default function Checkin() {
  const { goalId = '' } = useParams()
  const db = useDB()
  const me = useCurrentUser()
  const today = useToday()
  const navigate = useNavigate()
  const store = useStore()
  const toast = useToast()

  const goal = goalById(db, goalId)
  const contract = goal ? contractForGoal(db, goal.id) : undefined
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!me) return <Navigate to="/login" replace />
  if (!goal || !contract) return <Navigate to="/" replace />
  if (goal.user_id !== me.id) return <Navigate to="/partner" replace />

  const existing = checkinForGoalOnDate(db, goal.id, today)
  const streak = computeStreak(db, goal.id, today)

  async function complete(payload: { proof_url?: string | null; note?: string | null }) {
    if (busy) return
    setBusy(true)
    try {
      await store.createCheckin({ goalId: goal!.id, status: 'done', ...payload })
      setDone(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not check in')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const newStreak = computeStreak(db, goal.id, today)
    return (
      <AppShell>
        <TopBar title="Checked in" />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="animate-pop-in text-6xl">✅</div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink">
              That's today, handled
            </h2>
            <p className="mx-auto mt-2 max-w-[17rem] text-sm text-muted">
              The circle felt that. Your pulse just ticked up.
            </p>
          </div>
          <StreakBadge streak={newStreak} className="scale-125" />
          <div className="mt-2 w-full max-w-xs space-y-3">
            <Button full size="lg" onClick={() => navigate(`/c/${goal.circle_id}`)}>
              Back to the pulse
            </Button>
            <Button full variant="ghost" onClick={() => navigate(`/c/${goal.circle_id}/chat`)}>
              See it in chat
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <TopBar title="Today's check-in" back />
      <div className="flex flex-col gap-5 px-5 pb-10 pt-5">
        {/* goal card */}
        <div className="card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
            {CATEGORY_META[goal.category].label} · {FREQ_META[contract.frequency].label}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold leading-snug text-ink">
            {CATEGORY_META[goal.category].emoji} {goal.title}
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <StreakBadge streak={streak} />
            <span className="text-xs text-muted">
              Prove it with {PROOF_META[contract.proof_method].label.toLowerCase()}
            </span>
          </div>
        </div>

        {existing?.status === 'done' && (
          <div className="rounded-2xl border border-green/30 bg-green/10 p-4 text-sm font-semibold text-green">
            You already checked in today. Doing it again just updates your proof.
          </div>
        )}

        <ProofSwitch method={contract.proof_method} busy={busy} onComplete={complete} />
      </div>
    </AppShell>
  )
}

function ProofSwitch({
  method,
  busy,
  onComplete,
}: {
  method: ProofMethod
  busy: boolean
  onComplete: (p: { proof_url?: string | null; note?: string | null }) => void
}) {
  switch (method) {
    case 'honest_checkin':
      return <HonestProof busy={busy} onComplete={onComplete} />
    case 'focus_session':
      return <FocusProof busy={busy} onComplete={onComplete} />
    case 'link':
      return <LinkProof busy={busy} onComplete={onComplete} />
    case 'voice_note':
      return <UploadProof kind="voice_note" busy={busy} onComplete={onComplete} />
    case 'video':
      return <UploadProof kind="video" busy={busy} onComplete={onComplete} />
    case 'photo':
      return <UploadProof kind="photo" busy={busy} onComplete={onComplete} />
    default:
      return <UploadProof kind="screenshot" busy={busy} onComplete={onComplete} />
  }
}

// --- honest check-in --------------------------------------------------------
function HonestProof({
  busy,
  onComplete,
}: {
  busy: boolean
  onComplete: (p: { note?: string | null }) => void
}) {
  const [on, setOn] = useState(false)
  const [note, setNote] = useState('')
  return (
    <div className="space-y-4">
      <button
        onClick={() => setOn((v) => !v)}
        className={`flex w-full items-center gap-4 rounded-3xl border-2 p-5 text-left transition-all ${
          on ? 'border-green bg-green/10' : 'border-hairline bg-surface'
        }`}
      >
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${
            on ? 'bg-green text-white' : 'bg-hairline text-muted'
          }`}
        >
          <CheckIcon width={28} height={28} />
        </span>
        <span>
          <span className="block font-display text-lg font-bold text-ink">
            {on ? 'I showed up' : 'Did you show up?'}
          </span>
          <span className="block text-sm text-muted">
            Just be honest — your circle knows you.
          </span>
        </span>
      </button>
      <textarea
        className="input resize-none"
        rows={3}
        placeholder="Optional: a line about how it went…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={200}
      />
      <Button full size="lg" disabled={!on || busy} onClick={() => onComplete({ note: note || null })}>
        {busy ? 'Saving…' : 'Log today'}
      </Button>
    </div>
  )
}

// --- focus session timer ----------------------------------------------------
const PRESETS = [15, 25, 50]
function FocusProof({
  busy,
  onComplete,
}: {
  busy: boolean
  onComplete: (p: { note?: string | null }) => void
}) {
  const [minutes, setMinutes] = useState(25)
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const firedRef = useRef(false)

  useEffect(() => {
    if (!running) return
    const t = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(t)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
  }, [running])

  useEffect(() => {
    if (remaining === 0 && running && !firedRef.current) {
      firedRef.current = true
      setRunning(false)
      onComplete({ note: `${minutes}:00 focused` })
    }
  }, [remaining, running, minutes, onComplete])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = minutes > 0 ? 1 - remaining / (minutes * 60) : 0

  function selectPreset(m: number) {
    setMinutes(m)
    setRemaining(m * 60)
    setRunning(false)
    firedRef.current = false
  }

  return (
    <div className="space-y-5">
      {!running && remaining === minutes * 60 && (
        <div className="flex justify-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => selectPreset(m)}
              className={`chip ${minutes === m ? 'chip-active' : ''}`}
            >
              {m} min
            </button>
          ))}
        </div>
      )}

      <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#EFE3DB" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#FF6A5D"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${pct * 100} 100`}
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
        </svg>
        <div className="text-center">
          <div className="font-display text-5xl font-extrabold tabular-nums text-ink">
            {mm}:{ss}
          </div>
          <div className="mt-1 text-xs font-semibold text-muted">
            {running ? 'stay with it' : 'focus block'}
          </div>
        </div>
      </div>

      {remaining === 0 ? (
        <div className="rounded-2xl bg-green/10 py-3 text-center text-sm font-bold text-green">
          {busy ? 'Logging…' : 'Nice. Logging your session…'}
        </div>
      ) : running ? (
        <Button full size="lg" variant="ghost" onClick={() => setRunning(false)}>
          Pause
        </Button>
      ) : (
        <Button full size="lg" onClick={() => setRunning(true)}>
          {remaining === minutes * 60 ? 'Start focusing' : 'Resume'}
        </Button>
      )}
      <p className="text-center text-xs text-muted">
        The timer completes your check-in automatically. No proof needed — the
        focus is the proof.
      </p>
    </div>
  )
}

// --- link proof -------------------------------------------------------------
function LinkProof({
  busy,
  onComplete,
}: {
  busy: boolean
  onComplete: (p: { proof_url?: string | null; note?: string | null }) => void
}) {
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const valid = /^https?:\/\/.+\..+/.test(url.trim())
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Paste your proof link</label>
        <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-surface px-3 focus-within:border-coral focus-within:ring-4 focus-within:ring-coral/15">
          <LinkIcon width={18} height={18} className="text-muted" />
          <input
            className="flex-1 bg-transparent py-3.5 text-ink outline-none placeholder:text-muted"
            placeholder="https://…"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>
      <textarea
        className="input resize-none"
        rows={2}
        placeholder="Optional note…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={200}
      />
      <Button
        full
        size="lg"
        disabled={!valid || busy}
        onClick={() => onComplete({ proof_url: url.trim(), note: note || null })}
      >
        {busy ? 'Saving…' : 'Submit link'}
      </Button>
      {!valid && url.length > 0 && (
        <p className="text-center text-xs text-coral">That doesn't look like a URL yet.</p>
      )}
    </div>
  )
}

// --- file upload (screenshot / photo / video / voice_note) ------------------
function UploadProof({
  kind,
  busy,
  onComplete,
}: {
  kind: 'screenshot' | 'photo' | 'video' | 'voice_note'
  busy: boolean
  onComplete: (p: { proof_url?: string | null; note?: string | null }) => void
}) {
  const store = useStore()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [note, setNote] = useState('')
  const [tooLong, setTooLong] = useState(false)

  const config: Record<
    typeof kind,
    { accept: string; capture?: 'user' | 'environment'; icon: JSX.Element; verb: string }
  > = {
    screenshot: { accept: 'image/*', icon: <CameraIcon width={26} height={26} />, verb: 'Upload a screenshot' },
    photo: { accept: 'image/*', capture: 'environment', icon: <CameraIcon width={26} height={26} />, verb: 'Take or upload a photo' },
    video: { accept: 'video/*', capture: 'user', icon: <VideoIcon width={26} height={26} />, verb: 'Record or upload a clip' },
    voice_note: { accept: 'audio/*', capture: 'user', icon: <MicIcon width={26} height={26} />, verb: 'Record a voice note' },
  }
  const c = config[kind]

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploaded = await store.uploadProof(file)
      setUrl(uploaded)
      if (kind === 'video') checkDuration(uploaded)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function checkDuration(u: string) {
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.onloadedmetadata = () => setTooLong(v.duration > 60)
    v.src = u
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={c.accept}
        capture={c.capture}
        className="hidden"
        onChange={onFile}
      />

      {url ? (
        <div className="overflow-hidden rounded-3xl border border-hairline bg-surface">
          {kind === 'video' ? (
            <video src={url} controls className="max-h-72 w-full bg-black" />
          ) : kind === 'voice_note' ? (
            <div className="p-5">
              <audio src={url} controls className="w-full" />
            </div>
          ) : (
            <img src={url} alt="proof preview" className="max-h-72 w-full object-cover" />
          )}
          <button
            className="w-full border-t border-hairline py-2.5 text-sm font-bold text-plum"
            onClick={() => inputRef.current?.click()}
          >
            Choose a different one
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-hairline bg-surface/60 px-6 py-12 text-center transition-colors hover:border-coral hover:bg-surface"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-plum/10 text-plum">
            {c.icon}
          </span>
          <span className="font-display text-base font-bold text-ink">
            {uploading ? 'Uploading…' : c.verb}
          </span>
          <span className="text-xs text-muted">{PROOF_META[kind].hint}</span>
        </button>
      )}

      {kind === 'video' && (
        <p className={`text-center text-xs ${tooLong ? 'text-coral' : 'text-muted'}`}>
          {tooLong ? 'Try to keep it under 60s ✂️' : 'Keep it short — 60s or less.'}
        </p>
      )}

      <textarea
        className="input resize-none"
        rows={2}
        placeholder="Optional note…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={200}
      />
      <Button
        full
        size="lg"
        disabled={!url || busy || uploading}
        onClick={() => onComplete({ proof_url: url, note: note || null })}
      >
        {busy ? 'Saving…' : 'Submit check-in'}
      </Button>
    </div>
  )
}
