import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Circle } from '../types'
import { useStore, useDB, useCurrentUser } from '../lib/store'
import { usersOfCircle } from '../lib/selectors'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'
import { AppShell, TopBar } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { CopyIcon, ShareIcon, CheckIcon } from '../components/icons'

const FLOOR = 3

export default function NewCircle() {
  const store = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [circle, setCircle] = useState<Circle | null>(null)

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !name.trim()) return
    setBusy(true)
    try {
      const c = await store.createCircle(name)
      setCircle(c)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create circle')
    } finally {
      setBusy(false)
    }
  }

  if (circle) return <ShareStep circle={circle} onEnter={() => navigate(`/c/${circle.id}`)} />

  return (
    <AppShell>
      <TopBar title="Start a circle" back />
      <form onSubmit={create} className="flex flex-1 flex-col gap-5 px-5 pt-6">
        <div className="animate-slide-up">
          <label className="label" htmlFor="cname">
            Name your circle
          </label>
          <input
            id="cname"
            className="input text-lg"
            placeholder="The Grind Squad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <p className="mt-2 text-xs text-muted">
            Pick something that feels like the group chat, not a company.
          </p>
        </div>

        <div className="card animate-slide-up p-5">
          <p className="text-sm font-bold text-plum">Circles stay small on purpose</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {FLOOR}–6 people. Small enough that missing a day is noticed, big
            enough to carry each other. You can't do this one solo.
          </p>
          <div className="mt-4 flex items-center gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-lg border-2 ${
                  i === 0
                    ? 'border-coral bg-coral/10'
                    : i < FLOOR
                      ? 'border-dashed border-amber/60 bg-amber/5'
                      : 'border-dashed border-hairline'
                }`}
                title={i === 0 ? 'You' : i < FLOOR ? 'Needed' : 'Optional'}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            You're seat 1. Bring at least {FLOOR - 1} more.
          </p>
        </div>

        <div className="mt-auto pb-6">
          <Button type="submit" full size="lg" disabled={busy || !name.trim()}>
            {busy ? 'Creating…' : 'Create circle'}
          </Button>
        </div>
      </form>
    </AppShell>
  )
}

function ShareStep({ circle, onEnter }: { circle: Circle; onEnter: () => void }) {
  const store = useStore()
  const db = useDB()
  const me = useCurrentUser()
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const members = usersOfCircle(db, circle.id)
  const link = store.inviteLink(circle.id)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast.success('Invite link copied')
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.info(link)
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${circle.name} on Circle`,
          text: `I started a circle. Come hold me accountable 👀`,
          url: link,
        })
        return
      } catch {
        /* cancelled */
      }
    }
    copy()
  }

  return (
    <AppShell>
      <TopBar title={circle.name} subtitle="Invite your people" />
      <div className="flex flex-1 flex-col gap-5 px-5 pt-6">
        <div className="animate-pop-in text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-green/15 text-3xl">
            🎉
          </div>
          <h2 className="font-display text-xl font-extrabold text-ink">
            {circle.name} is live
          </h2>
          <p className="mt-1 text-sm text-muted">
            Now fill the seats. It only clicks with your people in it.
          </p>
        </div>

        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-plum">
            {members.length} of {circle.member_cap} seats
          </p>
          <div className="flex flex-wrap gap-3">
            {members.map((u) => (
              <div key={u.id} className="flex flex-col items-center gap-1">
                <Avatar user={u} size="md" />
                <span className="text-[11px] font-semibold text-ink">
                  {u.id === me?.id ? 'You' : u.name}
                </span>
              </div>
            ))}
            {Array.from({ length: circle.member_cap - members.length }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed border-hairline text-muted">
                  +
                </div>
                <span className="text-[11px] text-muted">open</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={copy}
          className="card flex items-center gap-3 p-4 text-left transition-colors hover:bg-paper"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-plum/10 text-plum">
            {copied ? <CheckIcon width={20} height={20} /> : <CopyIcon width={20} height={20} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink">Invite link</p>
            <p className="truncate text-xs text-muted">{link}</p>
          </div>
        </button>

        <div className="mt-auto space-y-3 pb-6">
          <Button full size="lg" onClick={share}>
            <ShareIcon width={20} height={20} /> Share invite
          </Button>
          <Button full variant="ghost" onClick={onEnter}>
            Enter the circle
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
