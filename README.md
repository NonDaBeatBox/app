# Circle 🟠

A warm, mobile-first web app where a small circle of 4–6 trusted friends or
family each pursue a personal goal and hold each other accountable. The core
inversion: **you can't level up alone.** Everyone's follow-through feeds one
shared circle meter — the **pulse** — and each member is paired to back another
member's goal.

<p align="center"><em>You can't level up alone.</em></p>

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

That's it — **no env keys required.** With no `VITE_SUPABASE_URL` set, the app
runs entirely on an in-memory mock store seeded with a full demo circle ("The
Grind Squad" — 5 members, active goals, contracts, a week of check-ins, and
chat history). Open `/login` and tap **"peek inside the demo"**.

```bash
npm run build        # typecheck + production build
npm test             # unit tests for the compute layer (pulse, load, streak, …)
```

## The loop

A brand-new user can: **sign in → create a circle → invite via link (or use the
demo members) → set a goal with a contract → get it approved → check in with
proof → watch the pulse and their streak move → cheer/nudge the partner they
back → see their load change when they join a second circle → chat with inline
check-in cards.** All of it works in demo mode with zero keys.

### Screens

| Route | What it is |
|---|---|
| `/login` | Magic-link email (instant in demo) |
| `/circles/new` | Name a circle, share an invite link, fill the seats (3–6) |
| `/c/:id` | **Circle Home** — the `<PulseRing>` hero, your goal + check-in CTA, who you're backing |
| `/c/:id/goal/new` | Goal + contract flow → sent to the circle for approval |
| `/checkin/:goalId` | Proof UI per method (upload / focus timer / link / honest toggle) |
| `/partner` | The goal you hold — weekly grid, streak, earned-power nudge ladder |
| `/load` | Your load across every circle (easy / sustainable / stretched) |
| `/c/:id/chat` | Realtime thread with inline check-in / nudge / system / approve cards |
| `/coach` | Chat coach → an "Add this goal" suggestion (mind/skill/character lanes) |
| `/pricing` | Free forever + the one Circle Plan ("you can't even pay alone here") |
| `/settings` | Leave a circle instantly, sign out |

## Stack

- **React 18 + Vite + TypeScript**, **Tailwind CSS**, **React Router**
- **Supabase** (optional): magic-link auth, Postgres + RLS, Realtime, Storage
- Fonts: Bricolage Grotesque (display) + Hanken Grotesk (UI)
- No `localStorage` / `sessionStorage` anywhere — demo state is purely in memory.

### Going live with Supabase

Set the env vars (see `.env.example`) and the app swaps the mock store for a
Supabase-backed one automatically:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ANTHROPIC_KEY=...      # optional — powers /coach; falls back to an offline heuristic
```

1. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor
   (tables + RLS so users only ever read circles they belong to).
2. Add the listed tables to the `supabase_realtime` publication (chat + live pulse).
3. Create a public Storage bucket named `proofs` for check-in uploads.

## How the numbers work

All progress values are pure, unit-tested functions in
[`src/lib/compute.ts`](src/lib/compute.ts):

- **Pulse** — per member, `done / expected` check-ins over the last 7 days;
  `round(avg × 100)`. ≥75 *rising*, 45–74 *steady*, <45 *slipping*. A recent
  `meter_hit` miss shows a temporary −10.
- **Load** — Σ active-goal weekly frequency + 1 per circle. ≤7 easy, 8–14
  sustainable, ≥15 stretched.
- **Streak** — consecutive scheduled days done (today is a grace day).
- **Earned power** — your own 14-day follow-through gates how hard you can push
  a partner: <50% cheer + ping, 50–79% adds "you good?", ≥80% adds the call.

## Guardrails

Members leave any circle instantly (pending goals pause). Consequences never
involve money. Fuzzy goals are never auto-scored — honest check-ins are always
accepted. No DMs, no stranger discovery — everything is circle-level.
