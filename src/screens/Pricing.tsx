import { useNavigate } from 'react-router-dom'
import { AppShell, TopBar } from '../components/AppShell'
import { CheckIcon, LockIcon } from '../components/icons'

export default function Pricing() {
  const navigate = useNavigate()
  return (
    <AppShell>
      <TopBar title="Pricing" back onBack={() => navigate(-1)} />
      <div className="flex flex-col gap-5 px-5 pb-12 pt-6">
        <div className="text-center">
          <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-ink">
            You can't even pay <span className="text-coral">alone</span> here.
          </h1>
          <p className="mx-auto mt-2 max-w-[20rem] text-sm text-muted">
            One plan, one circle, split between the people already in it. The
            better you show up, the less it costs.
          </p>
        </div>

        {/* Free */}
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Free forever</h2>
            <span className="font-display text-2xl font-extrabold text-ink">$0</span>
          </div>
          <p className="mt-1 text-sm text-muted">Everything you need to actually start.</p>
          <ul className="mt-4 space-y-2">
            <Feature>1 circle</Feature>
            <Feature>1 goal</Feature>
            <Feature>The full core loop — pulse, check-ins, backing, nudges, chat</Feature>
          </ul>
          <div className="mt-4 rounded-2xl bg-green/10 py-2.5 text-center text-sm font-bold text-green">
            You're on Free
          </div>
        </div>

        {/* Circle Plan */}
        <div className="relative rounded-3xl border-2 border-coral bg-surface p-5 shadow-soft">
          <span className="absolute -top-3 left-5 rounded-full bg-coral px-3 py-1 text-[11px] font-bold text-white">
            the only upgrade
          </span>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Circle Plan</h2>
            <div className="text-right">
              <span className="font-display text-2xl font-extrabold text-ink">$14.99</span>
              <span className="text-sm text-muted">/mo</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted">
            Per <b className="text-ink">circle</b> — not per person. There is no individual
            tier. You can't level up alone, so you can't pay alone either.
          </p>

          <ul className="mt-4 space-y-2">
            <Feature>Unlimited goals per member</Feature>
            <Feature>Check-in calls + video rooms</Feature>
            <Feature>Bigger circles &amp; multiple circles</Feature>
            <Feature>Streak insurance &amp; deeper history</Feature>
          </ul>

          <div className="mt-4 space-y-3 rounded-2xl bg-paper p-4">
            <Callout emoji="📉" title="Show-up pricing">
              Hit <b>80%+ monthly pulse</b> and your circle gets up to a{' '}
              <b>third off</b> next month — down to a floor of <b>$9.99</b>. Follow
              through, pay less.
            </Callout>
            <Callout emoji="🤝" title="Split it, or carry a seat">
              ~<b>$2.50 each</b> across 6. Someone tight this month? Anyone can{' '}
              <b>carry a seat</b> so no one gets left out.
            </Callout>
            <Callout emoji="🎁" title="Pay it forward">
              Gift a <b>free month</b> to a circle that's just getting started.
            </Callout>
          </div>

          <button
            disabled
            className="btn-primary mt-4 w-full cursor-not-allowed opacity-60"
          >
            <LockIcon width={16} height={16} /> Coming soon
            <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold">
              Phase 3
            </span>
          </button>
          <p className="mt-2 text-center text-[11px] text-muted">
            No card needed yet — billing arrives with the Circle Plan.
          </p>
        </div>

        <p className="text-center text-xs text-muted">
          No money-based forfeits, ever. Consequences stay small, kind, and human.
        </p>
      </div>
    </AppShell>
  )
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-ink">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
        <CheckIcon width={13} height={13} />
      </span>
      {children}
    </li>
  )
}

function Callout({
  emoji,
  title,
  children,
}: {
  emoji: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs leading-relaxed text-muted">{children}</p>
      </div>
    </div>
  )
}
