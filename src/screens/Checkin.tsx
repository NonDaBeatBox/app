import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function Checkin() {
  return (
    <AppShell>
      <TopBar title="Checkin" back />
      <div className="p-6 text-muted">Checkin coming up…</div>
    </AppShell>
  )
}
