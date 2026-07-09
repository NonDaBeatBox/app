/* =========================================================================
   ENGINE — state, persistence, question bank, mastery, scoring, XP,
   streaks, mistake bank, math rendering. No DOM view code here (that's UI).
   Everything is plain functions over a single persisted state object `S`.
   ========================================================================= */

/* ---------- tiny utilities ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);
const uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = (n) => Math.round(n * 100);
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

function shuffle(arr) {              // Fisher-Yates (non-mutating)
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sample(arr, n) { return shuffle(arr).slice(0, n); }

/* date helpers use local day boundaries */
const DAY = 86400000;
function dayKey(ts = Date.now()) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function daysBetween(k1, k2) { return Math.round((Date.parse(k2 + 'T00:00') - Date.parse(k1 + 'T00:00')) / DAY); }
function weekKey(ts = Date.now()) {  // ISO-ish week bucket
  const d = new Date(ts); const onejan = new Date(d.getFullYear(), 0, 1);
  const wk = Math.ceil(((d - onejan) / DAY + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(wk).padStart(2, '0')}`;
}
function fmtDate(ts) { return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
function fmtClock(sec) { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return `${m}:${String(s).padStart(2, '0')}`; }

/* =========================================================================
   Persistence — namespaced, versioned localStorage.
   ========================================================================= */
const LS = {
  state: 'ace.v1.state',          // legacy single-profile key (migrated on first sign-up)
  accounts: 'ace.v1.accounts',    // { username -> {username, displayName, pass, role, createdAt, classes:[code]} }
  classes: 'ace.v1.classes',      // { code -> {code, name, teacher, createdAt} }
  session: 'ace.v1.session',      // currently signed-in username
  profilePrefix: 'ace.v1.profile.', // per-account state key prefix
};
const STATE_VERSION = 1;

// Auth / multi-profile session state.
let ACCOUNTS = {};
let CLASSES = {};         // code -> { code, name, teacher, createdAt }  (Google-Classroom style)
let currentUser = null;   // signed-in username
let actingUser = null;    // set when a teacher is "acting as" a student
const profileKey = (u) => LS.profilePrefix + u;
const activeUser = () => actingUser || currentUser;
const currentRole = () => (currentUser && ACCOUNTS[currentUser] ? ACCOUNTS[currentUser].role : 'student');
const isTeacher = () => currentRole() === 'teacher';

function defaultState() {
  const now = Date.now();
  return {
    version: STATE_VERSION,
    createdAt: now, lastActive: now,
    settings: {
      apiKey: '', model: 'claude-opus-4-8',
      heartsMode: false, voice: false, sound: true,
      testDate: null, assistantName: 'Sable', viewMode: 'teacher',
    },
    classroom: { imported: {} },   // teacher-only: imported student snapshots
    onboarded: false,
    xp: 0,
    combo: 0,                 // transient-ish; reset each session start
    streak: { count: 0, lastDay: null, freezes: 1, freezeWeek: weekKey(now) },
    weekly: { week: weekKey(now), xp: 0, goal: 600, history: [] },
    hearts: { count: 5, max: 5 }, // optional hearts mode (path practice)
    mastery: {},              // skillId -> 0..100
    seen: {},                 // qid -> count (exposure)
    stats: { answered: 0, correct: 0, bySkill: {}, secByQ: [] },
    mistakes: {},             // qid -> {qid, chosen, ts, stage, dueTs, streak}
    badges: {},               // badgeId -> ts
    bests: { match: {} },     // setId -> best seconds
    vocab: { sets: {}, srs: {}, dailyKey: null, newToday: 0, activeSet: null },
    plan: null,               // {week, tasks:[...], ts}
    diagnostic: { done: false, result: null },
    mocks: [],                // finished mock summaries
    scoreHistory: [],         // {ts, total, rw, math, source}
    path: {},                 // nodeId -> 'done'
    ai: { questions: [] },    // AI-generated question objects appended to bank
    counters: { extremeSolved: 0, mocksDone: 0, wordsMastered: 0, perfectModules: 0 },
    quest: { day: null, items: [] },
    seenTutorial: false,
  };
}

let S = defaultState();

function migrate(st) {
  if (!st || typeof st !== 'object') return defaultState();
  if (st.version !== STATE_VERSION) {
    // Shallow-merge unknown/older shapes onto defaults so new keys appear.
    const base = defaultState();
    const merged = Object.assign(base, st);
    merged.settings = Object.assign(base.settings, st.settings || {});
    merged.version = STATE_VERSION;
    return merged;
  }
  // Ensure any newly-added top-level keys exist even on same version.
  const base = defaultState();
  for (const k of Object.keys(base)) if (!(k in st)) st[k] = base[k];
  st.settings = Object.assign(base.settings, st.settings || {});
  return st;
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS.state);
    if (raw) S = migrate(JSON.parse(raw));
    else S = defaultState();
  } catch (e) { console.warn('State load failed, starting fresh:', e); S = defaultState(); }
  return S;
}

let _saveTimer = null;
function save(now = false) {
  S.lastActive = Date.now();
  const write = () => {
    try {
      const key = activeUser() ? profileKey(activeUser()) : LS.state;
      localStorage.setItem(key, JSON.stringify(S));
    } catch (e) { console.error('Save failed', e); toast('Storage full — some progress may not persist', 'coral'); }
  };
  if (now) { clearTimeout(_saveTimer); write(); }
  else { clearTimeout(_saveTimer); _saveTimer = setTimeout(write, 400); }
}
// Load a profile's state into S (does not change currentUser).
function loadProfile(username) {
  try { const r = localStorage.getItem(profileKey(username)); S = r ? migrate(JSON.parse(r)) : defaultState(); }
  catch (e) { console.warn('Profile load failed:', e); S = defaultState(); }
  return S;
}
// Read a profile snapshot WITHOUT changing the active S (for the teacher roster).
function readProfile(username) {
  try { const r = localStorage.getItem(profileKey(username)); return r ? migrate(JSON.parse(r)) : null; } catch (e) { return null; }
}
// Temporarily compute against another state object, then restore (read-only use).
function withState(st, fn) { const prev = S; try { S = st; return fn(); } finally { S = prev; } }
function resetAll() { const key = activeUser() ? profileKey(activeUser()) : LS.state; localStorage.removeItem(key); S = defaultState(); save(true); }

/* =========================================================================
   Question bank — normalize authored questions, add AI + imported ones.
   ========================================================================= */
function normalizeQuestion(q) {
  const skill = SKILL_BY_ID[q.skill];
  const domain = skill ? DOMAINS[skill.domain] : null;
  return Object.assign({}, q, {
    domain: skill ? skill.domain : (q.domain || 'algebra'),
    section: domain ? domain.section : (q.section || 'math'),
    difficulty: q.difficulty === 'extreme' ? 'extreme' : Number(q.difficulty) || 1,
  });
}

let BANK = [];
let BANK_BY_ID = {};
function buildBank() {
  const authored = [].concat(
    typeof QUESTIONS_MATH !== 'undefined' ? QUESTIONS_MATH : [],
    typeof QUESTIONS_RW !== 'undefined' ? QUESTIONS_RW : [],
    typeof GEN_BANK !== 'undefined' ? GEN_BANK : [],
    (S.ai && S.ai.questions) ? S.ai.questions : []
  );
  BANK = []; BANK_BY_ID = {};
  for (const raw of authored) {
    if (!raw || !raw.id || BANK_BY_ID[raw.id]) continue;   // skip dupes by id
    const q = normalizeQuestion(raw);
    BANK.push(q); BANK_BY_ID[q.id] = q;
  }
}
const getQ = (id) => BANK_BY_ID[id];

/* difficulty helpers */
const diffNum = (d) => (d === 'extreme' ? 4 : d);
const isExtreme = (q) => q.difficulty === 'extreme';

/* Filtered selection. opts: {section, domain, skill, difficulty, excludeSeen, limit, extreme} */
function pickQuestions(opts = {}) {
  let pool = BANK.filter((q) => {
    if (opts.extreme) { if (!isExtreme(q)) return false; }
    else if (isExtreme(q) && !opts.includeExtreme) return false;
    if (opts.section && q.section !== opts.section) return false;
    if (opts.domain && q.domain !== opts.domain) return false;
    if (opts.skill && q.skill !== opts.skill) return false;
    if (opts.difficulty && q.difficulty !== opts.difficulty) return false;
    if (opts.difficultyMax && diffNum(q.difficulty) > opts.difficultyMax) return false;
    return true;
  });
  if (opts.excludeSeen) {
    const fresh = pool.filter((q) => !S.seen[q.id]);
    if (fresh.length >= (opts.limit || 1)) pool = fresh;   // only exclude if enough remain
  }
  if (opts.excludeIds) pool = pool.filter((q) => !opts.excludeIds.includes(q.id));
  pool = shuffle(pool);
  if (opts.sortByDifficulty) pool.sort((a, b) => diffNum(a.difficulty) - diffNum(b.difficulty));
  return opts.limit ? pool.slice(0, opts.limit) : pool;
}
function bankStats() {
  const s = { total: BANK.length, math: 0, rw: 0, extreme: 0, bySkill: {}, byDiff: { 1: 0, 2: 0, 3: 0, extreme: 0 } };
  for (const q of BANK) {
    if (isExtreme(q)) s.extreme++; else s[q.section]++;
    s.byDiff[q.difficulty] = (s.byDiff[q.difficulty] || 0) + 1;
    s.bySkill[q.skill] = (s.bySkill[q.skill] || 0) + 1;
  }
  return s;
}

/* =========================================================================
   Math rendering — KaTeX when available, readable plain-text fallback offline.
   Content uses $...$ (inline) and $$...$$ (display).
   ========================================================================= */
function katexReady() { return typeof window.katex !== 'undefined' && window.katex && !window.__KATEX_JS_FAILED; }

function texFallback(tex) {
  // Make raw TeX readable when KaTeX is unavailable (offline).
  let t = tex;
  t = t.replace(/\\text(?:rm|bf|it)?\s*{([^{}]*)}/g, '$1');   // \text{...} -> plain
  t = t.replace(/\\ell/g, 'ℓ');
  t = t.replace(/\\[dt]?frac\s*{([^{}]*)}\s*{([^{}]*)}/g, '($1)/($2)');  // \frac \dfrac \tfrac (braced)
  t = t.replace(/\\[dt]?frac\s*(\w)\s*(\w)/g, '$1/$2');       // brace-less two-token frac (e.g. \tfrac12)
  t = t.replace(/\\sqrt\s*{([^{}]*)}/g, '√($1)');
  t = t.replace(/\\sqrt\s*(\w)/g, '√$1');                     // brace-less \sqrt3
  t = t.replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\div/g, '÷');
  t = t.replace(/\\pm/g, '±').replace(/\\mp/g, '∓').replace(/\\leq?/g, '≤').replace(/\\geq?/g, '≥').replace(/\\neq/g, '≠');
  t = t.replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Rightarrow/g, '⇒').replace(/\\rightarrow/g, '→').replace(/\\approx/g, '≈');
  t = t.replace(/\\circ/g, '°').replace(/\\infty/g, '∞').replace(/\\angle/g, '∠').replace(/\\sim/g, '~');
  t = t.replace(/\\left|\\right/g, '');
  t = t.replace(/\^{([^{}]*)}/g, (m, p) => toSup(p)).replace(/\^(\w)/g, (m, p) => toSup(p));
  t = t.replace(/_{([^{}]*)}/g, (m, p) => toSub(p)).replace(/_(\w)/g, (m, p) => toSub(p));
  t = t.replace(/\\(sin|cos|tan|log|ln)\b/g, '$1');
  t = t.replace(/[{}]/g, '').replace(/\\,/g, ' ').replace(/\\ /g, ' ').replace(/\\!/g, '');
  return t;
}
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'x': 'ˣ', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 't': 'ᵗ' };
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ', 'x': 'ₓ' };
const toSup = (s) => s.split('').map((c) => SUP[c] || c).join('');
const toSub = (s) => s.split('').map((c) => SUB[c] || c).join('');

// Convert a string with $...$ segments into safe HTML.
// A backslash-escaped \$ is a literal dollar sign (money) and never a delimiter.
const _DOLLAR = String.fromCharCode(1);
function mathToHtml(text) {
  if (text == null) return '';
  const s = String(text).replace(/\\\$/g, _DOLLAR);
  const parts = s.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/g);
  return parts.map((p) => {
    if (/^\$\$[^$]*\$\$$/.test(p)) return mathSpan(p.slice(2, -2), true);
    if (/^\$[^$]*\$$/.test(p)) return mathSpan(p.slice(1, -1), false);
    return esc(p).split(_DOLLAR).join('$').replace(/\n/g, '<br>');
  }).join('');
}
function mathSpan(tex, display) {
  return `<span class="math" data-tex="${esc(tex)}" data-display="${display ? 1 : 0}">` +
    `<span class="math-fallback">${esc(texFallback(tex))}</span></span>`;
}
// After inserting HTML, typeset any .math spans with KaTeX (if ready).
function typeset(root = document) {
  if (!katexReady()) return;
  $$('.math', root).forEach((span) => {
    if (span.dataset.done) return;
    const tex = span.dataset.tex;
    try {
      span.innerHTML = window.katex.renderToString(tex, { throwOnError: false, displayMode: span.dataset.display === '1' });
      span.dataset.done = '1';
    } catch (e) { /* keep fallback */ }
  });
}
// Re-typeset once KaTeX finishes loading (deferred script).
window.addEventListener('load', () => { setTimeout(() => typeset(document), 60); });

/* =========================================================================
   SmartScore mastery (IXL-style, 0..100).
   - correct raises more for harder Qs, diminishing near the top;
   - the 90..100 Challenge Zone only opens to difficulty-3 / extreme questions;
   - misses drop more when your score is high (an easy miss stings).
   ========================================================================= */
const CHALLENGE_ZONE = 90;
function getMastery(skillId) { return S.mastery[skillId] ?? 0; }

function applyMastery(skillId, correct, difficulty) {
  const m = getMastery(skillId);
  const hard = difficulty === 3 || difficulty === 'extreme';
  let next = m;
  if (correct) {
    const base = { 1: 6, 2: 9, 3: 13, extreme: 16 }[difficulty] || 8;
    const gain = base * (0.35 + 0.65 * (1 - m / 100));     // diminishing near top
    next = m + gain;
    if (!hard) next = Math.min(next, Math.max(m, CHALLENGE_ZONE)); // easy Qs can't climb the zone
    next = Math.min(100, next);
  } else {
    const penaltyBase = m >= CHALLENGE_ZONE ? 12 : m >= 70 ? 9 : m >= 40 ? 6 : 4;
    const soften = hard ? 0.65 : 1;                        // missing a hard Q hurts a bit less
    next = Math.max(0, m - penaltyBase * soften);
  }
  S.mastery[skillId] = Math.round(next * 10) / 10;
  return { from: m, to: S.mastery[skillId] };
}
function masteryTier(m) {           // -> {cls, label}
  if (m >= 90) return { cls: 'm5', label: 'Mastered' };
  if (m >= 80) return { cls: 'm4', label: 'Strong' };
  if (m >= 60) return { cls: 'm3', label: 'Proficient' };
  if (m >= 40) return { cls: 'm2', label: 'Developing' };
  if (m >= 20) return { cls: 'm1', label: 'Beginning' };
  return { cls: 'm0', label: 'Not started' };
}
function sectionMastery(sec) {
  const skills = skillsInSection(sec);
  // weight each skill by its domain weight (so heavy domains matter more)
  let wsum = 0, msum = 0;
  for (const sk of skills) {
    const w = DOMAINS[sk.domain].weight;
    wsum += w; msum += w * getMastery(sk.id);
  }
  return wsum ? msum / wsum : 0;
}
function weakestSkills(n = 3, sec = null) {
  let list = SKILLS.slice();
  if (sec) list = list.filter((s) => skillSection(s.id) === sec);
  // prioritize skills that have been touched but are low, then untouched
  return list
    .map((s) => ({ s, m: getMastery(s.id), seen: (S.stats.bySkill[s.id]?.n || 0) }))
    .sort((a, b) => (a.m - b.m) || (b.seen - a.seen))
    .slice(0, n).map((x) => x.s);
}

/* =========================================================================
   Scoring model — raw -> scaled (200..800) via anchor tables approximating
   released Digital SAT curves; easier Module 2 imposes a lower ceiling.
   Clearly an ESTIMATE; every UI surface labels it so.
   ========================================================================= */
const SCORE_ANCHORS = {
  // percent-correct -> scaled score (per section). Interpolated linearly.
  rw:   [[0, 200], [10, 230], [20, 290], [30, 360], [40, 430], [50, 500], [60, 560], [70, 620], [80, 680], [90, 740], [97, 780], [100, 800]],
  math: [[0, 200], [10, 240], [20, 310], [30, 390], [40, 460], [50, 530], [60, 590], [70, 650], [80, 710], [90, 760], [97, 785], [100, 800]],
};
const EASY_MODULE_CEIL = 630;  // routing to the easier Module 2 caps the section (approx.)
const ROUTE_HARD_THRESHOLD = 0.65; // module-1 accuracy to unlock the harder Module 2

function interp(anchors, x) {
  if (x <= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < anchors.length; i++) {
    if (x <= anchors[i][0]) {
      const [x0, y0] = anchors[i - 1], [x1, y1] = anchors[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
  }
  return last[1];
}
// estimateScaledScore: section 'rw'|'math', fraction correct 0..1, easyModule bool
function estimateScaledScore(section, fractionCorrect, easyModule = false) {
  const raw = interp(SCORE_ANCHORS[section], clamp(fractionCorrect, 0, 1) * 100);
  let scaled = Math.round(raw / 10) * 10;
  if (easyModule) scaled = Math.min(scaled, EASY_MODULE_CEIL);
  return clamp(scaled, 200, 800);
}
// Projected total from mastery, blended toward recent mocks/diagnostics.
function projectedScore() {
  const fromMastery = (sec) => {
    const m = sectionMastery(sec) / 100;
    const acc = clamp(0.32 + 0.63 * m, 0, 0.99);   // mastery -> expected accuracy
    return estimateScaledScore(sec, acc, false);
  };
  let rw = fromMastery('rw'), math = fromMastery('math');
  // blend with recent measured results (weighted toward most recent)
  const recent = S.scoreHistory.slice(-4);
  if (recent.length) {
    let wsum = 0, rwS = 0, mS = 0;
    recent.forEach((h, i) => { const w = i + 1; wsum += w; rwS += w * h.rw; mS += w * h.math; });
    const mRw = rwS / wsum, mMath = mS / wsum;
    rw = Math.round(0.45 * rw + 0.55 * mRw);
    math = Math.round(0.45 * math + 0.55 * mMath);
  }
  rw = clamp(Math.round(rw / 10) * 10, 200, 800);
  math = clamp(Math.round(math / 10) * 10, 200, 800);
  return { rw, math, total: rw + math };
}

/* =========================================================================
   XP, levels, combo, streak.
   ========================================================================= */
const XP_BASE = { 1: 10, 2: 15, 3: 25, extreme: 50 };
function comboMultiplier() { return Math.min(2, 1 + Math.min(S.combo, 10) * 0.1); }
function xpForAnswer(difficulty) { return Math.round((XP_BASE[difficulty] || 10) * comboMultiplier()); }

const LEVEL_TITLES = [
  [1, 'Rookie'], [3, 'Apprentice'], [5, 'Scholar'], [8, 'Sharpshooter'],
  [11, 'Strategist'], [15, 'Analyst'], [19, 'Tactician'], [24, 'Virtuoso'],
  [30, 'Ace Cadet'], [37, 'Ace'], [45, 'Grandmaster'], [55, 'Perfectionist'],
];
function xpToReach(level) { return Math.round(80 * (level - 1) + 20 * (level - 1) * (level - 1)); } // cumulative
function levelInfo(xp = S.xp) {
  let level = 1;
  while (xpToReach(level + 1) <= xp) level++;
  const curMin = xpToReach(level), nextMin = xpToReach(level + 1);
  let title = LEVEL_TITLES[0][1];
  for (const [lvl, t] of LEVEL_TITLES) if (level >= lvl) title = t;
  return { level, title, curMin, nextMin, into: xp - curMin, span: nextMin - curMin, pct: (xp - curMin) / (nextMin - curMin) };
}
function addXP(n) {
  const before = levelInfo().level;
  S.xp += n;
  S.weekly.xp += n;
  const after = levelInfo();
  if (after.level > before) toast(`Level ${after.level} — ${after.title}!`, 'gold', 4000);
  return after;
}

function rolloverWeekIfNeeded() {
  const wk = weekKey();
  if (S.weekly.week !== wk) {
    S.weekly.history.push({ week: S.weekly.week, xp: S.weekly.xp, goal: S.weekly.goal });
    if (S.weekly.history.length > 20) S.weekly.history = S.weekly.history.slice(-20);
    S.weekly.week = wk; S.weekly.xp = 0;
  }
  if (S.streak.freezeWeek !== wk) {   // grant the weekly earnable freeze
    S.streak.freezeWeek = wk;
    S.streak.freezes = Math.min(2, (S.streak.freezes || 0) + 1);
  }
}
// Record daily activity; maintains the streak (auto-uses a freeze for a single gap).
function touchStreak() {
  const today = dayKey();
  const st = S.streak;
  if (st.lastDay === today) return st.count;
  if (st.lastDay == null) { st.count = 1; }
  else {
    const gap = daysBetween(st.lastDay, today);
    if (gap === 1) st.count += 1;
    else if (gap === 2 && st.freezes > 0) { st.freezes -= 1; st.count += 1; toast('Streak-freeze used — streak saved ❄️', 'sky'); }
    else st.count = 1;
  }
  st.lastDay = today;
  if (st.count > 0 && st.count % 7 === 0) award('streak7');
  save();
  return st.count;
}

/* =========================================================================
   Mistake bank — auto-capture, spaced retry (2 then 5 days), leave after
   2 consecutive correct retries.
   ========================================================================= */
const MISTAKE_STEPS = [2, 5];  // days
function recordMistake(q, chosen) {
  const ex = S.mistakes[q.id];
  const now = Date.now();
  if (ex) { ex.chosen = chosen; ex.ts = now; ex.streak = 0; ex.stage = Math.min(ex.stage, MISTAKE_STEPS.length - 1); ex.dueTs = now + MISTAKE_STEPS[ex.stage] * DAY; }
  else S.mistakes[q.id] = { qid: q.id, chosen, ts: now, stage: 0, streak: 0, dueTs: now + MISTAKE_STEPS[0] * DAY };
}
function resolveMistakeAttempt(qid, correct) {
  const m = S.mistakes[qid]; if (!m) return;
  if (correct) {
    m.streak += 1;
    if (m.streak >= 2) { delete S.mistakes[qid]; toast('Cleared from mistake bank ✓', 'mint'); return; }
    m.stage = Math.min(m.stage + 1, MISTAKE_STEPS.length - 1);
    m.dueTs = Date.now() + MISTAKE_STEPS[m.stage] * DAY;
  } else { m.streak = 0; m.stage = 0; m.dueTs = Date.now() + MISTAKE_STEPS[0] * DAY; }
}
function dueMistakes() {
  const now = Date.now();
  return Object.values(S.mistakes).filter((m) => m.dueTs <= now && getQ(m.qid)).map((m) => getQ(m.qid));
}
function allMistakes() { return Object.values(S.mistakes).filter((m) => getQ(m.qid)); }

/* =========================================================================
   SPR grading — accept equivalent fraction/decimal forms.
   ========================================================================= */
function parseNumeric(str) {
  if (str == null) return null;
  let s = String(str).trim().replace(/\s+/g, '');
  if (s === '') return null;
  if (/^[-+]?\d*\.?\d+$/.test(s)) return parseFloat(s);
  const frac = s.match(/^([-+]?\d*\.?\d+)\/([-+]?\d*\.?\d+)$/);
  if (frac) { const d = parseFloat(frac[2]); return d === 0 ? null : parseFloat(frac[1]) / d; }
  return null;
}
function gradeSPR(userStr, q) {
  const answers = [].concat(q.answer, q.answers || []);
  const un = parseNumeric(userStr);
  for (const a of answers) {
    const an = parseNumeric(a);
    if (un != null && an != null && Math.abs(un - an) < 1e-6) return true;
    if (String(userStr).trim() === String(a).trim()) return true;
  }
  return false;
}
function gradeQuestion(q, response) {
  if (q.type === 'spr') return gradeSPR(response, q);
  return response === q.answer; // mcq: response is a letter
}
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* =========================================================================
   Central answer recorder — the one place a graded answer updates all state.
   meta: { sec (seconds taken), fromMistake, fromMock, silent (no xp/combo) }
   ========================================================================= */
function recordAnswer(q, response, meta = {}) {
  const correct = gradeQuestion(q, response);
  // exposure
  S.seen[q.id] = (S.seen[q.id] || 0) + 1;
  // stats
  S.stats.answered++; if (correct) S.stats.correct++;
  const bs = S.stats.bySkill[q.skill] || (S.stats.bySkill[q.skill] = { n: 0, c: 0 });
  bs.n++; if (correct) bs.c++;
  bumpToday('answered', 1); if (correct) bumpToday('correct', 1);
  if (q.section === 'math') bumpToday('math', 1); else if (q.section === 'rw') bumpToday('rw', 1);
  if (typeof meta.sec === 'number') { S.stats.secByQ.push({ s: q.section, sec: meta.sec }); if (S.stats.secByQ.length > 400) S.stats.secByQ = S.stats.secByQ.slice(-400); }
  // mastery
  const mv = applyMastery(q.skill, correct, q.difficulty);
  // combo + xp (skip for silent/mock scoring which is handled separately)
  let xpGain = 0;
  if (!meta.silent) {
    if (correct) { S.combo++; xpGain = xpForAnswer(q.difficulty); addXP(xpGain); }
    else S.combo = 0;
  }
  // mistake bank
  if (!correct) recordMistake(q, response);
  else if (S.mistakes[q.id]) resolveMistakeAttempt(q.id, true);
  if (meta.fromMistake) {
    resolveMistakeAttempt(q.id, correct);
    // clearing a mistake in review earns back a heart (hearts mode)
    if (correct && S.settings.heartsMode && S.hearts.count < S.hearts.max) { S.hearts.count++; }
  }
  // counters + badges
  if (correct && isExtreme(q)) { S.counters.extremeSolved++; award('extreme1'); }
  checkAnswerBadges(q, correct);
  touchStreak();
  save();
  return { correct, xpGain, mastery: mv, combo: S.combo };
}

/* =========================================================================
   Badges / achievements.
   ========================================================================= */
const BADGES = [
  { id: 'first_drill', em: '🎯', name: 'First Steps', desc: 'Finish your first drill.' },
  { id: 'streak7', em: '🔥', name: 'Weeklong', desc: 'Reach a 7-day streak.' },
  { id: 'extreme1', em: '💀', name: 'Into the Deep', desc: 'Solve your first Extreme question.' },
  { id: 'section700', em: '🚀', name: 'Sky High', desc: 'Estimate 700+ on a section.' },
  { id: 'mock1', em: '📝', name: 'Test Pilot', desc: 'Finish your first full mock exam.' },
  { id: 'perfect_module', em: '💯', name: 'Flawless', desc: 'Get a perfect module on a mock.' },
  { id: 'vocab100', em: '📚', name: 'Wordsmith', desc: 'Master 100 vocabulary words.' },
  { id: 'heatcol', em: '🏛️', name: 'Pillar', desc: 'Master every skill in one domain.' },
  { id: 'combo10', em: '⚡', name: 'On Fire', desc: 'Hit a 10-answer combo.' },
  { id: 'level10', em: '⭐', name: 'Rising Star', desc: 'Reach level 10.' },
  { id: 'diagnostic', em: '🧭', name: 'Know Thyself', desc: 'Complete the diagnostic.' },
  { id: 'full_heatmap', em: '🌟', name: 'Complete Command', desc: 'Reach 90+ mastery on every skill.' },
];
const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]));
function award(id) {
  if (S.badges[id]) return false;
  S.badges[id] = Date.now();
  const b = BADGE_BY_ID[id];
  if (b) toast(`Badge unlocked: ${b.em} ${b.name}`, 'gold', 4500);
  save();
  return true;
}
function checkAnswerBadges(q, correct) {
  if (S.combo >= 10) award('combo10');
  if (levelInfo().level >= 10) award('level10');
  // domain-column mastery
  for (const dom of Object.values(DOMAINS)) {
    if (skillsInDomain(dom.id).every((s) => getMastery(s.id) >= 90)) award('heatcol');
  }
  if (SKILLS.every((s) => getMastery(s.id) >= 90)) award('full_heatmap');
}

/* =========================================================================
   Toast (used across engine + UI). Defined here so engine can call it.
   ========================================================================= */
let _toastHost = null;
function toast(msg, kind = '', ms = 2600) {
  if (!_toastHost) _toastHost = document.getElementById('toasts');
  if (!_toastHost) return;
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = mathToHtml(msg);
  _toastHost.appendChild(el);
  typeset(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(() => el.remove(), 300); }, ms);
}
