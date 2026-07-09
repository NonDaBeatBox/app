/* =========================================================================
   ENGINE (extra) — daily activity, study planner + daily quest, Sable
   briefing generator, and the AI client + assistant tools. Split out to keep
   the core engine readable. (Vocab SRS and mock assembly live in their own
   UI/engine sections but persist through the same state `S`.)
   ========================================================================= */

/* ---------- per-day activity counters (drive quests & briefing) ---------- */
function ensureToday() {
  const d = dayKey();
  if (!S.today || S.today.day !== d) {
    // archive yesterday's snapshot for the briefing before resetting
    if (S.today && S.today.day) S.yesterday = S.today;
    S.today = { day: d, answered: 0, correct: 0, math: 0, rw: 0, lessons: 0, vocab: 0, nodes: 0, mocks: 0, xpStart: S.xp };
  }
}
function bumpToday(field, n = 1) { ensureToday(); S.today[field] = (S.today[field] || 0) + n; }
function todayXP() { ensureToday(); return S.xp - (S.today.xpStart || S.xp); }

/* =========================================================================
   Study planner — a rolling weekly plan (or day-by-day countdown when a test
   date is set). Produces the daily quest. Regenerated weekly, or when empty.
   ========================================================================= */
function daysUntilTest() {
  if (!S.settings.testDate) return null;
  const d = daysBetween(dayKey(), S.settings.testDate);
  return d;
}
function generatePlan(force = false) {
  const wk = weekKey();
  if (!force && S.plan && S.plan.week === wk) return S.plan;
  const weak = weakestSkills(6);
  const countdown = daysUntilTest();
  const tasks = [];
  const push = (t) => tasks.push(Object.assign({ id: uid('t'), done: false }, t));

  // Core recurring tasks
  push({ type: 'lesson', label: `Study a lesson: ${SKILL_BY_ID[weak[0].id].name}`, skill: weak[0].id, route: 'learn', params: { skill: weak[0].id } });
  push({ type: 'drill', label: `Drill your weakest skill: ${SKILL_BY_ID[weak[0].id].name}`, skill: weak[0].id, route: 'drills', params: { skill: weak[0].id }, goal: 8 });
  push({ type: 'drill', label: `Drill: ${SKILL_BY_ID[weak[1].id].name}`, skill: weak[1].id, route: 'drills', params: { skill: weak[1].id }, goal: 8 });
  push({ type: 'vocab', label: 'Clear your vocabulary review queue', route: 'vocab', goal: 15 });
  if (allMistakes().length) push({ type: 'mistakes', label: 'Review your mistake bank', route: 'mistakes' });

  // Weekly rhythm: a mock roughly weekly (or more often near a test date)
  const mocksDone = S.counters.mocksDone || 0;
  const wantMock = countdown != null ? countdown <= 21 : (mocksDone < 3 || (Date.now() % 7 === 0));
  if (wantMock) push({ type: 'mock', label: 'Take a full adaptive mock exam', route: 'mocks' });

  S.plan = { week: wk, ts: Date.now(), tasks, countdown };
  save();
  return S.plan;
}

/* The daily quest = a slice of the plan for today, plus streak-safety hint.
   Completion is derived live from today's activity counters. */
function getDailyQuest() {
  ensureToday();
  const plan = generatePlan();
  const day = dayKey();
  if (!S.quest || S.quest.day !== day) {
    // pick up to 4 tasks for today, rotating by day
    const items = plan.tasks.slice(0, 4).map((t) => ({ ...t, done: false }));
    S.quest = { day, items };
    save();
  }
  // derive completion from live activity
  for (const it of S.quest.items) {
    if (it.type === 'drill' || it.type === 'mistakes') it.done = it.done || (S.today.answered >= (it.goal || 8));
    if (it.type === 'lesson') it.done = it.done || (S.today.lessons >= 1);
    if (it.type === 'vocab') it.done = it.done || (S.today.vocab >= (it.goal || 15));
    if (it.type === 'mock') it.done = it.done || (S.today.mocks >= 1);
  }
  return S.quest;
}
function questComplete() { const q = getDailyQuest(); return q.items.length > 0 && q.items.every((i) => i.done); }
function markPlanTaskDone(type) {
  // called when a matching activity happens; the derived logic mostly handles it
  const q = getDailyQuest();
  const it = q.items.find((i) => i.type === type && !i.done);
  if (it) { it.done = true; save(); }
}

/* =========================================================================
   Sable briefing — template-generated from local data (works with no key).
   Phase 5 optionally rewrites this in Sable's voice via the API.
   ========================================================================= */
function briefingFacts() {
  ensureToday();
  const proj = projectedScore();
  const streak = S.streak.count;
  const yd = S.yesterday;
  const weak = weakestSkills(3).map((s) => s.name);
  const dut = daysUntilTest();
  return { proj, streak, yesterday: yd, weak, daysUntilTest: dut, quest: getDailyQuest(), due: dueMistakes().length };
}
function templateBriefing() {
  const f = briefingFacts();
  const name = S.settings.assistantName;
  const parts = [];
  // greeting
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  parts.push(`${greet}. ${f.proj.total >= 1500 ? 'You are knocking on the door of a perfect score.' : `Projected total sits at about ${f.proj.total} (${f.proj.rw} RW · ${f.proj.math} Math) — an estimate, of course.`}`);
  // yesterday
  if (f.yesterday && f.yesterday.answered) {
    const acc = f.yesterday.answered ? Math.round(f.yesterday.correct / f.yesterday.answered * 100) : 0;
    parts.push(`Yesterday you answered ${f.yesterday.answered} question${f.yesterday.answered === 1 ? '' : 's'} at ${acc}% accuracy.`);
  }
  // streak
  parts.push(f.streak > 0 ? `Your streak stands at ${f.streak} day${f.streak === 1 ? '' : 's'}${questComplete() ? ' and today is already secured' : '; finish today\'s quest to keep it'}.` : `No streak yet — a single completed quest starts one.`);
  // plan / focus
  parts.push(`Today I\'d focus on ${f.weak.slice(0, 2).join(' and ')}${f.due ? `, and you have ${f.due} question${f.due === 1 ? '' : 's'} due in the mistake bank` : ''}.`);
  // countdown
  if (f.daysUntilTest != null) parts.push(f.daysUntilTest >= 0 ? `${f.daysUntilTest} day${f.daysUntilTest === 1 ? '' : 's'} until test day. We have a plan.` : `Test day has passed — set a new date when you\'re ready.`);
  return parts.join(' ');
}

/* =========================================================================
   AI client — Anthropic Messages API, called directly from the browser.
   Small, well-commented. Everything degrades gracefully with no key.
   Assistant tools + tutor actions are wired in the assistant UI module; this
   is the low-level transport plus a helper for tool-use loops.
   ========================================================================= */
const AI_ENDPOINT = 'https://api.anthropic.com/v1/messages';
function aiConfigured() { return !!(S.settings.apiKey && S.settings.apiKey.trim()); }

async function aiCall({ system, messages, tools, max_tokens = 1024, temperature = 0.7 }) {
  if (!aiConfigured()) throw new Error('No API key set.');
  const body = { model: S.settings.model || 'claude-opus-4-8', max_tokens, messages };
  if (system) body.system = system;
  if (tools) body.tools = tools;
  if (temperature != null) body.temperature = temperature;
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': S.settings.apiKey.trim(),
      'anthropic-version': '2023-06-01',
      // Required to call the API directly from a browser (local personal use).
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { const j = await res.json(); msg = j.error?.message || msg; } catch (e) { }
    throw new Error(msg);
  }
  return res.json();
}
// Convenience: single-turn text completion.
async function aiText(system, userText, opts = {}) {
  const data = await aiCall({ system, messages: [{ role: 'user', content: userText }], ...opts });
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
}
