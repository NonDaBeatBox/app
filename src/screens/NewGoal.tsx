import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function NewGoal() {
  return (
    <AppShell>
      <TopBar title="NewGoal" back />
      <div className="p-6 text-muted">NewGoal coming up…</div>
    </AppShell>
  )
}
