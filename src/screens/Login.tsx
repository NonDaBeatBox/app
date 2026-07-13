import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, useCurrentUser } from '../lib/store'
import { useToast } from '../components/Toast'
import { Button } from '../components/Button'
import { AppShell } from '../components/AppShell'
import { Navigate, Link } from 'react-router-dom'

export default function Login() {
  const store = useStore()
  const me = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  if (me) return <Navigate to="/" replace />

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const { magicLinkSent } = await store.signInWithEmail(email || 'you@demo.circle')
      if (magicLinkSent) {
        setSent(true)
      } else {
        // demo: instant sign-in
        navigate('/', { replace: true })
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not sign in')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-16">
        <div className="animate-slide-up">
          <div className="mb-6 flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-xl font-extrabold tracking-tight text-ink">
              Circle
            </span>
          </div>

          <h1 className="font-display text-[34px] font-extrabold leading-[1.08] tracking-tight text-ink">
            You can't level up{' '}
            <span className="text-coral">alone.</span>
          </h1>
          <p className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-muted">
            A tiny circle of people who actually know you. Everyone chases one
            goal, everyone backs someone, and every check-in feeds one shared
            pulse.
          </p>
        </div>

        {sent ? (
          <div className="card animate-pop-in p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green/15 text-2xl">
              📬
            </div>
            <h2 className="font-display text-lg font-bold text-ink">Check your email</h2>
            <p className="mt-1 text-sm text-muted">
              We sent a magic link to <b className="text-ink">{email}</b>. Tap it
              to hop into your circle.
            </p>
            <button
              className="mt-4 text-sm font-bold text-coral"
              onClick={() => setSent(false)}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="animate-slide-up">
            <label className="label" htmlFor="email">
              Your email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              className="input mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" full size="lg" disabled={busy}>
              {busy ? 'One sec…' : 'Send me a magic link ✨'}
            </Button>

            {store.isDemo && (
              <button
                type="button"
                onClick={() => submit(new Event('submit') as unknown as React.FormEvent)}
                className="mt-3 w-full rounded-2xl border border-dashed border-hairline bg-surface/60 px-4 py-3 text-sm font-bold text-plum transition-colors hover:bg-surface"
              >
                or peek inside the demo →
              </button>
            )}
            <p className="mt-4 text-center text-xs text-muted">
              No passwords. No feeds. No strangers. Ever.
            </p>
            <p className="mt-1 text-center text-xs text-muted">
              <Link to="/pricing" className="font-semibold text-plum underline-offset-2 hover:underline">
                See how pricing works
              </Link>
            </p>
          </form>
        )}
      </div>
    </AppShell>
  )
}

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="20" fill="none" stroke="#EFE3DB" strokeWidth="7" />
      <path
        d="M32 12 a20 20 0 0 1 17.3 30"
        fill="none"
        stroke="#FF6A5D"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="7" fill="#25BE86" />
    </svg>
  )
}
