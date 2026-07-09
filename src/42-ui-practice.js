/* =========================================================================
   UI — Practice: Drills, Mistake Bank, Extreme arena, Progress/heatmap.
   ========================================================================= */

/* ---------- Drills ----------
   startDrill() stashes a pending config and routes to the drills view; the
   view's mount runs it. This avoids a race where navigate()'s async re-render
   would clobber a synchronously-rendered session. */
let PENDING_DRILL = null;
registerView('drills', {
  render(params) {
    if (PENDING_DRILL || params.skill || params.section || params.domain || params.run) {
      return `<div id="drillRun"></div>`;   // session runs in mount
    }
    const bySec = (sec) => domainsInSection(sec).map((d) => `
      <div style="margin-top:10px"><div class="eyebrow">${esc(d.name)}</div>
        <div class="row wrap" style="gap:6px;margin-top:6px">
          ${skillsInDomain(d.id).map((s) => `<button class="btn sm ghost" onclick="navigate('drills',{skill:'${s.id}'})">${esc(s.name)} <span class="mono faint">${Math.round(getMastery(s.id))}</span></button>`).join('')}
        </div></div>`).join('');
    return `
      ${pageHeader('Drills', 'Targeted practice sets. Answers feed your mastery scores and mistake bank.',
        `<button class="btn primary" onclick="startDrill({mixed:true,limit:10})">🎲 Mixed set</button>
         <button class="btn" onclick="startDrill({skill:weakestSkills(1)[0].id,limit:10})">🩹 Weakest skill</button>`)}
      <div class="grid g-2">
        <div class="card"><h3 style="margin-top:0">Math</h3>
          <button class="btn block" onclick="startDrill({section:'math',limit:10})">All Math · mixed skills</button>
          ${bySec('math')}</div>
        <div class="card"><h3 style="margin-top:0">Reading &amp; Writing</h3>
          <button class="btn block" onclick="startDrill({section:'rw',limit:10})">All R&amp;W · mixed skills</button>
          ${bySec('rw')}</div>
      </div>`;
  },
  mount(root, params) {
    let opts = PENDING_DRILL; PENDING_DRILL = null;
    if (!opts) {
      if (params.skill) opts = { skill: params.skill, limit: 10 };
      else if (params.section) opts = { section: params.section, limit: 10 };
      else if (params.domain) opts = { domain: params.domain, limit: 10 };
    }
    if (opts) runDrill(opts, root);
  },
});

// Central drill starter (also used by Sable tool-use). opts: {skill,section,domain,difficulty,limit,mixed,extreme}
// Stashes config and routes to the drills view, which runs it in mount().
function startDrill(opts = {}) {
  PENDING_DRILL = opts;
  navigate('drills', { run: 1 });
}
function runDrill(opts, root) {
  const limit = opts.limit || 10;
  const pool = pickQuestions({
    skill: opts.skill, section: opts.section, domain: opts.domain,
    difficulty: opts.difficulty ? Number(opts.difficulty) : undefined,
    extreme: opts.extreme, limit, sortByDifficulty: !opts.mixed,
  });
  const host = (root && root.querySelector('#drillRun')) || document.getElementById('drillRun') || document.getElementById('view');
  if (!pool.length) { host.innerHTML = `<div class="card">No questions match that filter yet. <button class="btn sm" onclick="navigate('drills')">Back</button></div>`; return; }
  const label = opts.extreme ? 'Extreme' : opts.skill ? SKILL_BY_ID[opts.skill].name : opts.section ? SECTIONS[opts.section].name + ' mixed' : 'Mixed drill';
  runQuestionSession({
    container: host, questions: pool, mode: opts.extreme ? 'extreme' : 'drill', title: label,
    restart: () => startDrill(opts),
  });
}

/* ---------- Mistake Bank ---------- */
registerView('mistakes', {
  render() {
    const due = dueMistakes(), all = allMistakes();
    if (!all.length) return `${pageHeader('Mistake Bank', 'Every wrong answer lands here for spaced review.')}
      <div class="card tac" style="padding:40px"><div style="font-size:2.4rem">🎉</div><h3>Empty — nothing to review.</h3>
      <p class="muted">Miss a question in a drill or mock and it will appear here, re-served after 2 days, then 5.</p>
      <button class="btn primary" onclick="navigate('drills')">Go drill</button></div>`;
    return `
      ${pageHeader('Mistake Bank', `${all.length} in the bank · ${due.length} due for review now`,
        due.length ? `<button class="btn primary" onclick="startMistakeReview(true)">Review ${due.length} due →</button>` : '')}
      <div class="row wrap" style="gap:10px;margin-bottom:14px">
        <button class="btn" onclick="startMistakeReview(false)">Review all ${all.length}</button>
        <span class="muted" style="align-self:center">A question leaves the bank after 2 correct retries in a row.</span>
      </div>
      <div class="stack">
        ${all.map((m) => { const q = getQ(m.qid); const due = m.dueTs <= Date.now();
          return `<div class="card" style="border-left:3px solid ${due ? 'var(--ace)' : 'var(--line)'}">
            <div class="row spread"><div class="row" style="gap:8px">${skillPill(q.skill)}${diffDots(q.difficulty)}</div>
              <span class="tag">${due ? 'due now' : 'due ' + fmtDate(m.dueTs)} · ${m.streak}/2 cleared</span></div>
            <div style="margin-top:8px">${mathToHtml(q.stem)}</div>
          </div>`;
        }).join('')}
      </div>`;
  },
});
function startMistakeReview(dueOnly) {
  const qs = dueOnly ? dueMistakes() : allMistakes().map((m) => getQ(m.qid));
  if (!qs.length) { toast('Nothing due right now.', 'sky'); return; }
  const host = document.getElementById('view');
  host.innerHTML = `<div id="mrun"></div>`;
  runQuestionSession({
    container: document.getElementById('mrun'), questions: shuffle(qs), mode: 'mistake',
    title: 'Mistake review', meta: { fromMistake: true },
    onDone: (sm) => { host.innerHTML = defaultSummary(sm, { title: 'Mistake review' }); typeset(host);
      $$('[data-review]', host).forEach((b) => b.onclick = () => reviewSession(sm, {})); }
  });
}

/* ---------- Extreme arena — its own badge track ---------- */
const EXTREME_TIERS = [[1, '💀', 'Initiate'], [10, '🔥', 'Challenger'], [25, '⚡', 'Gladiator'], [50, '👑', 'Ascendant']];
registerView('extreme', {
  render() {
    const pool = pickQuestions({ extreme: true });
    const byDom = {};
    pool.forEach((q) => { byDom[q.section] = (byDom[q.section] || 0) + 1; });
    const solved = S.counters.extremeSolved;
    const nextTier = EXTREME_TIERS.find((t) => solved < t[0]);
    const track = EXTREME_TIERS.map(([n, em, name]) => `<div class="badge-chip ${solved >= n ? 'earned' : ''}" style="flex:1">
      <span class="em">${em}</span><div><div style="font-weight:600;font-size:.85rem">${name}</div><div class="tag">${n} solved</div></div></div>`).join('');
    return `${pageHeader('Extreme Mode', 'Harder than a real hard Module 2 — built for the 1500 → 1600 stretch. These pay the most XP.',
      pool.length ? `<button class="btn gold lg" onclick="startDrill({extreme:true,limit:8})">Enter the arena →</button>` : '')}
      <div class="grid g-4" style="margin-bottom:16px">
        ${statTile('Extreme solved', String(solved), nextTier ? `${nextTier[0] - solved} to ${nextTier[2]}` : 'Ascendant — maxed')}
        ${statTile('In the arena', String(pool.length), 'unseen served first')}
        ${statTile('Math', String(byDom.math || 0), 'extreme items')}
        ${statTile('R&W', String(byDom.rw || 0), 'extreme items')}
      </div>
      <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Badge track</h3>
        <div class="row wrap" style="gap:10px">${track}</div></div>
      ${pool.length ? `<div class="card tac" style="padding:30px;border:1px solid rgba(255,93,115,.35);background:linear-gradient(180deg,rgba(255,93,115,.06),transparent)">
        <div style="font-size:2.4rem">💀</div><h2 style="margin:.2em 0">Think you’re ready?</h2>
        <p class="muted">Eight of the hardest questions in the bank. No mercy.</p>
        <button class="btn gold lg" onclick="startDrill({extreme:true,limit:8})">Enter the arena →</button></div>`
      : `<div class="card tac" style="padding:30px"><p class="muted">Extreme questions are still loading into the bank.</p></div>`}`;
  },
});

/* ---------- Progress / mastery + analytics ---------- */
registerView('progress', {
  render() {
    const secRow = ['rw', 'math'].map((sec) => {
      const m = sectionMastery(sec), proj = projectedScore()[sec];
      return `<div class="card"><div class="row spread"><h3 style="margin:0">${SECTIONS[sec].name}</h3><span class="pill">${proj} est.</span></div>
        <div class="bar mint" style="margin:10px 0"><span style="width:${m}%"></span></div>
        <div class="muted">Average mastery ${Math.round(m)} / 100</div></div>`;
    }).join('');
    const badges = BADGES.map((b) => `<div class="badge-chip ${S.badges[b.id] ? 'earned' : ''}" title="${esc(b.desc)}">
      <span class="em">${b.em}</span><div><div style="font-weight:600;font-size:.85rem">${esc(b.name)}</div><div class="tag">${esc(b.desc)}</div></div></div>`).join('');
    return `
      ${pageHeader('Progress', 'Your mastery across all skills, plus achievements.',
        `<button class="btn sm" onclick="navigate('mocks')">Take a mock</button>`)}
      <div class="grid g-2">${secRow}</div>
      <div class="card" style="margin-top:16px">
        <div class="row spread"><h3 style="margin:0">Skill mastery heatmap</h3><span class="muted">Click any skill to drill or learn it</span></div>
        <div class="heat" id="progHeat" style="margin-top:12px">${SKILLS.map((s) => masteryCell(s.id)).join('')}</div>
        <div class="row wrap muted" style="gap:12px;margin-top:14px;font-size:.78rem">
          ${[['m0', '0–19'], ['m1', '20–39'], ['m2', '40–59'], ['m3', '60–79'], ['m4', '80–89'], ['m5', '90–100 · Challenge Zone']].map(([c, l]) => `<span class="row" style="gap:6px"><span class="${c}" style="width:14px;height:14px;border-radius:4px;display:inline-block"></span>${l}</span>`).join('')}
        </div>
      </div>
      ${analyticsCards()}
      <div class="card" style="margin-top:16px"><h3 style="margin-top:0">Achievements</h3>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${badges}</div></div>`;
  },
  mount(root) { $$('#progHeat .cell', root).forEach((c) => c.addEventListener('click', () => onHeatCellClick(c.dataset.skill))); },
});

/* Pacing (sec/question vs targets), study-plan progress, and score trend. */
function analyticsCards() {
  const paceFor = (sec) => { const arr = S.stats.secByQ.filter((x) => x.s === sec).map((x) => x.sec); return arr.length ? avg(arr) : null; };
  const paceRow = (sec) => {
    const p = paceFor(sec), target = SECTIONS[sec].paceSec;
    if (p == null) return `<div class="row spread"><span>${SECTIONS[sec].name}</span><span class="muted">no timed data yet</span></div>`;
    const ok = p <= target * 1.1;
    return `<div style="margin:8px 0"><div class="row spread" style="font-size:.9rem"><span>${SECTIONS[sec].name}</span>
      <span class="mono" style="color:${ok ? 'var(--mint)' : 'var(--coral)'}">${p.toFixed(0)}s <span class="faint">/ ${target}s target</span></span></div>
      <div class="bar" style="margin-top:4px"><span class="${ok ? '' : ''}" style="width:${clamp(target / p * 100, 5, 100)}%;background:${ok ? 'var(--mint)' : 'var(--coral)'}"></span></div></div>`;
  };
  const quest = getDailyQuest();
  const doneCount = quest.items.filter((i) => i.done).length;
  const trend = (typeof trendChart === 'function') ? trendChart() : '';
  return `<div class="grid g-3" style="margin-top:16px;align-items:start">
    <div class="card"><h3 style="margin-top:0">Pacing</h3>
      <div class="muted" style="font-size:.85rem;margin-bottom:6px">Avg time per question vs. target.</div>
      ${paceRow('rw')}${paceRow('math')}</div>
    <div class="card"><h3 style="margin-top:0">Today’s plan</h3>
      <div class="row" style="gap:14px;align-items:baseline"><div class="stat"><div class="v">${doneCount}<small>/${quest.items.length}</small></div><div class="k">tasks done</div></div>
      <div class="stat"><div class="v">${todayXP()}</div><div class="k">XP today</div></div></div>
      <div class="stack" style="margin-top:10px">${quest.items.slice(0, 4).map((it) => `<div class="row" style="gap:8px"><span style="color:${it.done ? 'var(--mint)' : 'var(--faint)'}">${it.done ? '✓' : '○'}</span><span style="font-size:.85rem;${it.done ? 'opacity:.6' : ''}">${esc(it.label)}</span></div>`).join('')}</div></div>
    ${weeklyCard()}
  </div>
  ${trend}`;
}
// Weekly XP goal + personal-best history (solo replacement for leagues).
function weeklyCard() {
  const hist = S.weekly.history.slice(-8);
  const best = Math.max(S.weekly.xp, ...hist.map((h) => h.xp), 1);
  const goalPct = clamp(S.weekly.xp / S.weekly.goal * 100, 0, 100);
  const bestEver = Math.max(S.weekly.xp, ...hist.map((h) => h.xp), 0);
  const bars = hist.concat([{ week: 'now', xp: S.weekly.xp }]).map((h) => {
    const isBest = h.xp === bestEver && bestEver > 0;
    return `<div title="${esc(h.week)}: ${h.xp} XP" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:56px">
      <div style="height:${clamp(h.xp / best * 100, 4, 100)}%;border-radius:4px 4px 0 0;background:${isBest ? 'linear-gradient(180deg,#ff9e3d,var(--ace))' : 'var(--violet)'}"></div></div>`;
  }).join('');
  return `<div class="card"><h3 style="margin-top:0">Weekly XP</h3>
    <div class="row spread" style="font-size:.85rem"><span>${S.weekly.xp} / ${S.weekly.goal}</span><span class="pill gold">🏆 best ${bestEver}</span></div>
    <div class="bar gold" style="margin:6px 0 10px"><span style="width:${goalPct}%"></span></div>
    <div class="row" style="gap:4px;align-items:flex-end">${bars}</div>
    <div class="tag" style="margin-top:4px">last ${hist.length + 1} weeks · gold = personal best</div></div>`;
}
