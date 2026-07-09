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

/* ---------- Extreme arena (full version in Phase 4; basic here) ---------- */
registerView('extreme', {
  render() {
    const pool = pickQuestions({ extreme: true });
    return `${pageHeader('Extreme Mode', 'Harder than a real hard Module 2 — for the 1500 → 1600 stretch.',
      pool.length ? `<button class="btn gold" onclick="startDrill({extreme:true,limit:8})">Enter the arena →</button>` : '')}
      <div class="card">
        <div class="row spread"><div><h3 style="margin:0">${pool.length} Extreme questions</h3>
          <div class="muted">Solved: ${S.counters.extremeSolved} · These pay the most XP.</div></div>
          <div style="font-size:2.4rem">💀</div></div>
      </div>`;
  },
  mount() { const p = pickQuestions({ extreme: true }); if (!p.length) $('#view').querySelector('.card').insertAdjacentHTML('beforeend', '<p class="muted" style="margin-top:10px">Extreme questions arrive in a later build phase.</p>'); },
});

/* ---------- Progress / mastery (full analytics in Phase 5) ---------- */
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
      <div class="card" style="margin-top:16px"><h3 style="margin-top:0">Achievements</h3>
        <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">${badges}</div></div>`;
  },
  mount(root) { $$('#progHeat .cell', root).forEach((c) => c.addEventListener('click', () => onHeatCellClick(c.dataset.skill))); },
});
