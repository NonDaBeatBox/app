import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function Coach() {
  return (
    <AppShell>
      <TopBar title="Coach" back />
      <div className="p-6 text-muted">Coach coming up…</div>
    </AppShell>
  )
}
