import { AppShell, TopBar } from '../components/AppShell'

// Placeholder — built in a later phase.
export default function Chat() {
  return (
    <AppShell>
      <TopBar title="Chat" back />
      <div className="p-6 text-muted">Chat coming up…</div>
    </AppShell>
  )
}
