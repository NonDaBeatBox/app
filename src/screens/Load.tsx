import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function Load() {
  return (
    <AppShell>
      <TopBar title="Load" back />
      <div className="p-6 text-muted">Load coming up…</div>
    </AppShell>
  )
}
