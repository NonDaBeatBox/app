import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useStore, useDB, useCurrentUser } from '../lib/store'
import { circleById, usersOfCircle, membershipFor } from '../lib/selectors'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'
import { AppShell, TopBar } from '../components/AppShell'
import { Avatar } from '../components/Avatar'

export default function JoinCircle() {
  const { id = '' } = useParams()
  const store = useStore()
  const db = useDB()
  const me = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const circle = circleById(db, id)
  const alreadyIn = me && membershipFor(db, me.id, id)

  if (alreadyIn) return <Navigate to={`/c/${id}`} replace />

  if (!circle) {
    return (
      <AppShell>
        <TopBar title="Invite" back />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="text-4xl">🕸️</div>
          <p className="font-display text-lg font-bold text-ink">This invite expired</p>
          <p className="text-sm text-muted">
            The link is broken or the circle is gone. Ask for a fresh one.
          </p>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back home
          </Button>
        </div>
      </AppShell>
    )
  }

  const members = usersOfCircle(db, circle.id)
  const full = members.length >= circle.member_cap

  async function join() {
    if (busy) return
    setBusy(true)
    try {
      await store.joinCircle(circle!.id)
      toast.success(`You're in ${circle!.name}`)
      navigate(`/c/${circle!.id}`, { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not join')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell>
      <TopBar title="You're invited" back />
      <div className="flex flex-1 flex-col gap-5 px-5 pt-8">
        <div className="animate-pop-in text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">{circle.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {members.length} of {circle.member_cap} seats filled · circles stay small
          </p>
        </div>
        <div className="card flex flex-wrap justify-center gap-4 p-5">
          {members.map((u) => (
            <div key={u.id} className="flex flex-col items-center gap-1">
              <Avatar user={u} size="md" />
              <span className="text-[11px] font-semibold text-ink">{u.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto pb-6">
          <Button full size="lg" onClick={join} disabled={busy || full}>
            {full ? 'This circle is full' : busy ? 'Joining…' : `Join ${circle.name}`}
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
