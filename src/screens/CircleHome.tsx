import { AppShell, TopBar } from '../components/AppShell'

// Fully built in Phase 2 (PulseRing + computed pulse hero).
export default function CircleHome() {
  return (
    <AppShell nav>
      <TopBar title="Circle" />
      <div className="p-6 text-muted">Circle home coming up…</div>
    </AppShell>
  )
}
