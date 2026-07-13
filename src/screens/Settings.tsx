import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function Settings() {
  return (
    <AppShell>
      <TopBar title="Settings" back />
      <div className="p-6 text-muted">Settings coming up…</div>
    </AppShell>
  )
}
