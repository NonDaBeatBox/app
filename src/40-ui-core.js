/* =========================================================================
   UI — core framework: router, app shell, nav, reusable question session,
   shared render helpers. View modules register themselves into VIEWS.
   ========================================================================= */

const VIEWS = {};                 // name -> { title, render(params)->html, mount(root,params) }
function registerView(name, def) { VIEWS[name] = def; }

const NAV = [
  { route: 'home',       icon: '🏠', label: 'Home' },
  { route: 'learn',      icon: '📖', label: 'Learn' },
  { route: 'path',       icon: '🧭', label: 'Skill Path' },
  { route: 'drills',     icon: '🎯', label: 'Drills' },
  { route: 'extreme',    icon: '💀', label: 'Extreme' },
  { route: 'vocab',      icon: '📚', label: 'Vocabulary' },
  { route: 'mocks',      icon: '📝', label: 'Mock Exams' },
  { route: 'strategies', icon: '♟️', label: 'Strategies' },
  { route: 'progress',   icon: '📈', label: 'Progress' },
  { route: 'mistakes',   icon: '🩹', label: 'Mistake Bank' },
  { route: 'settings',   icon: '⚙️', label: 'Settings' },
];

/* ---------- route parsing (#/route?k=v&...) ---------- */
function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query] = raw.split('?');
  const params = {};
  if (query) for (const kv of query.split('&')) { const [k, v] = kv.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v || ''); }
  return { route: path || 'home', params };
}
function navigate(route, params) {
  let h = '#/' + route;
  if (params && Object.keys(params).length) h += '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  if (location.hash === h) router(); else location.hash = h;
}

/* ---------- app shell ---------- */
function renderShell() {
  const app = document.getElementById('app');
  const nav = NAV.map((n) => `<div class="nav-item" data-route="${n.route}"><span class="ico">${n.icon}</span><span>${n.label}</span></div>`).join('');
  app.innerHTML = `
    <button class="menu-btn" id="menuBtn" aria-label="Menu">☰</button>
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><div class="mark">A</div><div class="name"><b>A</b>ce</div></div>
        ${nav}
        <div class="nav-sep"></div>
        <div class="nav-item" data-route="settings"><span class="ico">🔑</span><span>API &amp; Data</span></div>
        <div class="nav-foot">Digital SAT trainer · runs offline<br>Everything stays on this device.</div>
      </aside>
      <main class="main"><div id="view"></div></main>
    </div>`;
  app.querySelectorAll('.nav-item').forEach((el) => el.addEventListener('click', () => {
    navigate(el.dataset.route);
    document.getElementById('sidebar').classList.remove('open');
  }));
  const mb = document.getElementById('menuBtn');
  if (mb) mb.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
  ensureOrb();
}
function setActiveNav(route) {
  $$('.nav-item').forEach((el) => el.classList.toggle('active', el.dataset.route === route));
}

/* ---------- router ---------- */
let _shellBuilt = false;
function router() {
  const { route, params } = parseHash();
  if (!_shellBuilt) { renderShell(); _shellBuilt = true; }
  else if (!document.querySelector('.shell')) { renderShell(); }  // rebuild after a takeover
  const host = document.getElementById('view');
  const def = VIEWS[route] || VIEWS['_missing'];
  setActiveNav(route);
  try {
    host.innerHTML = def.render ? def.render(params) : '';
    typeset(host);
    if (def.mount) def.mount(host, params);
    window.scrollTo(0, 0);
    host.focus?.();
  } catch (e) {
    console.error('View error:', e);
    host.innerHTML = `<div class="card"><h3>Something went wrong rendering this screen.</h3><p class="muted">${esc(e.message)}</p></div>`;
  }
}
registerView('_missing', { render: () => `<div class="card"><h2>Not found</h2><p class="muted">That screen doesn’t exist yet.</p></div>` });

/* ---------- fullscreen takeover (test mode, match game) ---------- */
let _fsEl = null;
function openFullscreen(className = '') {
  closeFullscreen();
  _fsEl = document.createElement('div');
  _fsEl.className = 'fs ' + className;
  _fsEl.style.cssText = 'position:fixed;inset:0;z-index:75;overflow:auto;';
  document.body.appendChild(_fsEl);
  return _fsEl;
}
function closeFullscreen() { if (_fsEl) { _fsEl.remove(); _fsEl = null; } }

/* =========================================================================
   Shared render helpers.
   ========================================================================= */
function pageHeader(title, sub, right = '') {
  return `<div class="row spread wrap" style="margin-bottom:18px;align-items:flex-end">
    <div><h1 style="margin:0">${esc(title)}</h1>${sub ? `<div class="muted">${sub}</div>` : ''}</div>
    <div class="row wrap" style="gap:8px">${right}</div></div>`;
}
function diffDots(d) {
  const cls = d === 'extreme' ? 'dx' : 'd' + d;
  return `<span class="diff ${cls}" title="${d === 'extreme' ? 'Extreme' : 'Difficulty ' + d}"><i></i><i></i><i></i></span>`;
}
function skillPill(skillId) {
  const s = SKILL_BY_ID[skillId]; if (!s) return '';
  return `<span class="pill violet">${esc(s.name)}</span>`;
}
function masteryCell(skillId) {
  const s = SKILL_BY_ID[skillId], m = getMastery(skillId), t = masteryTier(m);
  return `<div class="cell" data-skill="${skillId}" title="${esc(s.name)} — ${t.label}">
    <div class="fill ${t.cls}"></div>
    <div class="lbl">${esc(s.name)}</div>
    <div class="sc">${Math.round(m)}</div></div>`;
}
function confirmModal(title, body, onYes, yesLabel = 'Confirm', kind = 'primary') {
  const host = document.getElementById('overlays');
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><div class="muted" style="margin-bottom:18px">${body}</div>
    <div class="row" style="justify-content:flex-end;gap:10px"><button class="btn ghost" data-x>Cancel</button><button class="btn ${kind}" data-y>${esc(yesLabel)}</button></div></div>`;
  host.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  wrap.querySelector('[data-x]').onclick = close;
  wrap.querySelector('[data-y]').onclick = () => { close(); onYes(); };
}
function openModal(html, opts = {}) {
  const host = document.getElementById('overlays');
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.innerHTML = `<div class="modal">${html}</div>`;
  host.appendChild(wrap);
  typeset(wrap);
  const close = () => wrap.remove();
  wrap.addEventListener('click', (e) => { if (e.target === wrap && !opts.sticky) close(); });
  return { el: wrap, close };
}

/* =========================================================================
   Reusable Question Session — powers drills, mistakes, checkpoints, path
   practice, extreme, and quizzes. Renders into a container; calls onDone.
   ========================================================================= */
function runQuestionSession(cfg) {
  const box = cfg.container;
  const qs = cfg.questions.slice();
  const S0 = {
    idx: 0, results: [], chosen: null, submitted: false, struck: new Set(),
    hearts: (typeof cfg.hearts === 'number') ? cfg.hearts : (cfg.hearts ? 5 : null), startTs: 0, done: false,
  };
  function cur() { return qs[S0.idx]; }

  function render() {
    if (S0.idx >= qs.length || (S0.hearts !== null && S0.hearts <= 0)) return finish();
    const q = cur();
    S0.chosen = null; S0.submitted = false; S0.struck = new Set(); S0.startTs = Date.now();
    const prog = `${S0.idx + 1} / ${qs.length}`;
    const heartsHtml = S0.hearts !== null ? `<span class="hearts">${Array.from({ length: 5 }, (_, i) => `<span class="h ${i < S0.hearts ? '' : 'lost'}">♥</span>`).join('')}</span>` : '';
    const comboHtml = (!cfg.meta?.silent && S.combo > 1) ? `<span class="pill gold">🔥 ${S.combo} combo</span>` : '';
    box.innerHTML = `
      <div class="player">
        <div class="row spread" style="margin-bottom:14px">
          <div class="row" style="gap:10px">
            <span class="pill">${esc(cfg.title || 'Practice')}</span>
            ${skillPill(q.skill)} ${diffDots(q.difficulty)}
          </div>
          <div class="row" style="gap:10px">${comboHtml}${heartsHtml}<span class="mono muted">${prog}</span></div>
        </div>
        <div class="bar" style="margin-bottom:18px"><span style="width:${(S0.idx) / qs.length * 100}%"></span></div>
        <div class="card pad-lg">${renderQuestionBody(q)}</div>
        <div class="row spread" style="margin-top:16px">
          <div id="qHintSlot"></div>
          <div class="row" style="gap:10px">
            <button class="btn ghost" id="qSkip">Skip</button>
            <button class="btn primary" id="qSubmit" disabled>Submit</button>
          </div>
        </div>
        <div id="qExplain"></div>
      </div>`;
    typeset(box);
    wire(q);
  }

  function renderQuestionBody(q) {
    const passage = q.passage ? `<div class="passage">${mathToHtml(q.passage)}</div>` : '';
    const stem = `<div class="stem">${mathToHtml(q.stem)}</div>`;
    let input;
    if (q.type === 'spr') {
      input = `<div><input type="text" class="spr-input" id="sprIn" placeholder="Type your answer" autocomplete="off" inputmode="text">
        <div class="tag" style="margin-top:6px">Student-produced response — fractions or decimals accepted.</div></div>`;
    } else {
      input = `<div class="choices" id="choices">${q.choices.map((c, i) => `
        <div class="choice" data-i="${i}" data-letter="${LETTERS[i]}">
          <span class="key">${LETTERS[i]}</span>
          <span class="txt">${mathToHtml(c)}</span>
          <button class="elim" title="Cross out (X)" tabindex="-1">✕</button>
        </div>`).join('')}</div>`;
    }
    return passage + stem + input;
  }

  function wire(q) {
    const submitBtn = $('#qSubmit', box);
    if (q.type === 'spr') {
      const inp = $('#sprIn', box);
      inp.addEventListener('input', () => { S0.chosen = inp.value; submitBtn.disabled = inp.value.trim() === ''; });
      inp.focus();
    } else {
      $$('#choices .choice', box).forEach((el) => {
        el.addEventListener('click', () => selectChoice(el));   // whole row is clickable
        el.querySelector('.elim').addEventListener('click', (e) => { e.stopPropagation(); toggleStrike(el); });
      });
    }
    submitBtn.addEventListener('click', () => S0.submitted ? next() : submit(q));
    $('#qSkip', box).addEventListener('click', () => { if (!S0.submitted) { S0.idx++; render(); } });
  }
  function selectChoice(el) {
    if (S0.submitted) return;
    $$('#choices .choice', box).forEach((c) => c.classList.remove('sel'));
    el.classList.add('sel'); el.classList.remove('struck'); S0.struck.delete(el.dataset.letter);
    S0.chosen = el.dataset.letter;
    $('#qSubmit', box).disabled = false;
  }
  function toggleStrike(el) {
    if (S0.submitted) return;
    const L = el.dataset.letter;
    if (S0.struck.has(L)) { S0.struck.delete(L); el.classList.remove('struck'); }
    else { S0.struck.add(L); el.classList.add('struck'); if (el.classList.contains('sel')) { el.classList.remove('sel'); S0.chosen = null; $('#qSubmit', box).disabled = true; } }
  }

  function submit(q) {
    if (S0.chosen == null || (typeof S0.chosen === 'string' && S0.chosen.trim() === '')) return;
    S0.submitted = true;
    const sec = (Date.now() - S0.startTs) / 1000;
    const res = recordAnswer(q, S0.chosen, Object.assign({ sec }, cfg.meta || {}));
    S0.results.push({ q, correct: res.correct, chosen: S0.chosen, sec });
    if (S0.hearts !== null && !res.correct) { S0.hearts--; if (cfg.onMiss) cfg.onMiss(S0.hearts); }
    showFeedback(q, res);
    updateComboFlash(res);
  }

  function showFeedback(q, res) {
    // annotate choices
    if (q.type === 'mcq') {
      $$('#choices .choice', box).forEach((el) => {
        const L = el.dataset.letter;
        if (L === q.answer) el.classList.add('correct');
        else if (L === S0.chosen) el.classList.add('wrong');
        el.querySelector('.txt').style.pointerEvents = 'none';
        el.querySelector('.key').style.pointerEvents = 'none';
      });
    } else {
      const inp = $('#sprIn', box); inp.disabled = true;
      inp.style.borderColor = res.correct ? 'var(--mint)' : 'var(--coral)';
    }
    const correctText = q.type === 'spr' ? `Correct answer: <b>${esc([].concat(q.answer)[0])}</b>` :
      `Correct answer: <b>${q.answer}</b> — ${mathToHtml(q.choices[LETTERS.indexOf(q.answer)])}`;
    const dm = res.mastery;
    const masteryLine = dm ? `<div class="tag" style="margin-top:8px">Mastery of ${esc(SKILL_BY_ID[q.skill].name)}: ${Math.round(dm.from)} → <b style="color:${res.correct ? 'var(--mint)' : 'var(--coral)'}">${Math.round(dm.to)}</b></div>` : '';
    const tutor = tutorButtons(q, S0.chosen, res.correct);
    $('#qExplain', box).innerHTML = `
      <div class="explain ${res.correct ? 'correct' : 'wrong'}">
        <div class="row spread"><h4 style="margin:0">${res.correct ? '✓ Correct' : '✗ Not quite'}</h4>
          ${!cfg.meta?.silent && res.correct ? `<span class="pill gold">+${res.xpGain} XP</span>` : ''}</div>
        ${res.correct ? '' : `<p style="margin:.5em 0">${correctText}</p>`}
        <div>${mathToHtml(q.explanation)}</div>
        ${masteryLine}
        ${tutor}
      </div>`;
    typeset($('#qExplain', box));
    wireTutor(q);
    const sb = $('#qSubmit', box);
    sb.textContent = S0.idx + 1 >= qs.length ? 'Finish' : 'Next';
    sb.disabled = false;
    $('#qSkip', box).style.display = 'none';
    sb.focus();
  }
  function next() { S0.idx++; render(); }

  function updateComboFlash(res) {
    if (!cfg.meta?.silent && res.correct && S.combo >= 3 && S.combo % 3 === 0) {
      const c = document.createElement('div'); c.className = 'combo'; c.textContent = `${S.combo}× COMBO`;
      document.body.appendChild(c); setTimeout(() => c.remove(), 800);
    }
  }

  function finish() {
    S0.done = true; teardownKeys();
    const total = S0.results.length;
    const correct = S0.results.filter((r) => r.correct).length;
    const acc = total ? Math.round(correct / total * 100) : 0;
    const xp = S0.results.filter((r) => r.correct).reduce((a, r) => a + (XP_BASE[r.q.difficulty] || 10), 0);
    const summary = { total, correct, acc, results: S0.results, heartsOut: S0.hearts === 0 };
    if (cfg.mode === 'drill' && total > 0) award('first_drill');
    if (cfg.onDone) { cfg.onDone(summary); return; }
    box.innerHTML = defaultSummary(summary, cfg);
    typeset(box);
    $$('[data-again]', box).forEach((b) => b.onclick = () => cfg.restart && cfg.restart());
    $$('[data-review]', box).forEach((b) => b.onclick = () => reviewSession(summary, cfg));
  }

  // keyboard shortcuts
  function onKey(e) {
    if (S0.done) return;
    const ae = document.activeElement;
    // Don't hijack keys while typing in the assistant / command bar / other inputs.
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.id !== 'sprIn') return;
    const q = cur(); if (!q) return;
    if (e.key === 'Enter') { e.preventDefault(); const sb = $('#qSubmit', box); if (sb && !sb.disabled) sb.click(); return; }
    if (S0.submitted) return;
    if (q.type === 'mcq') {
      const k = e.key.toUpperCase();
      const i = LETTERS.indexOf(k);
      if (i >= 0 && i < q.choices.length) { const el = $$('#choices .choice', box)[i]; if (e.shiftKey) toggleStrike(el); else selectChoice(el); }
    }
  }
  function teardownKeys() { document.removeEventListener('keydown', onKey); }
  document.addEventListener('keydown', onKey);

  render();
  return { finishNow: finish };
}

function reviewSession(summary, cfg) {
  const host = openModal(`<h3>Review</h3><div class="stack" id="revList" style="max-height:64vh;overflow:auto"></div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn" data-close>Close</button></div>`);
  const list = $('#revList', host.el);
  list.innerHTML = summary.results.map((r) => `
    <div class="card" style="border-left:3px solid ${r.correct ? 'var(--mint)' : 'var(--coral)'}">
      ${r.q.passage ? `<div class="muted" style="font-size:.85rem;margin-bottom:6px">${mathToHtml(r.q.passage)}</div>` : ''}
      <div style="font-weight:600;margin-bottom:6px">${mathToHtml(r.q.stem)}</div>
      <div class="tag">Your answer: ${esc(String(r.chosen))} · ${r.correct ? 'correct' : 'answer: ' + esc(String([].concat(r.q.answer)[0]))}</div>
      <div style="margin-top:8px;font-size:.9rem">${mathToHtml(r.q.explanation)}</div>
    </div>`).join('');
  typeset(list);
  host.el.querySelector('[data-close]').onclick = host.close;
}

function defaultSummary(sm, cfg) {
  const grade = sm.acc >= 85 ? 'Excellent' : sm.acc >= 70 ? 'Solid' : sm.acc >= 50 ? 'Getting there' : 'Keep grinding';
  return `<div class="player">
    <div class="card pad-lg tac">
      <div class="eyebrow">${esc(cfg.title || 'Session')} complete</div>
      <div class="stat" style="align-items:center;margin:10px 0"><div class="v" style="font-size:3rem">${sm.acc}%</div><div class="muted">${sm.correct} of ${sm.total} correct · ${grade}</div></div>
      <div class="row" style="justify-content:center;gap:10px;margin-top:14px">
        <button class="btn" data-review>Review answers</button>
        ${cfg.restart ? '<button class="btn primary" data-again>Another set</button>' : ''}
        <button class="btn ghost" onclick="navigate('home')">Home</button>
      </div>
    </div></div>`;
}

/* Tutor buttons appear only when an API key is configured. */
function tutorButtons(q, chosen, correct) {
  if (typeof AI === 'undefined' || !AI.enabled()) return '';
  return `<div class="row wrap" style="gap:8px;margin-top:12px">
    <button class="btn sm" data-tutor="explain">✨ Explain it differently</button>
    <button class="btn sm" data-tutor="chat">💬 Ask ${esc(S.settings.assistantName)}</button>
    <button class="btn sm" data-tutor="similar">➕ 3 similar questions</button>
  </div><div id="tutorOut"></div>`;
}
function wireTutor(q) {
  if (typeof AI === 'undefined' || !AI.enabled()) return;
  $$('[data-tutor]').forEach((b) => b.onclick = () => AI.tutorAction(b.dataset.tutor, q));
}

/* ---------- Sable orb (panel logic lives in the assistant module) ---------- */
function ensureOrb() {
  if (document.getElementById('sableOrb')) return;
  const orb = document.createElement('button');
  orb.id = 'sableOrb'; orb.className = 'orb'; orb.setAttribute('aria-label', 'Open assistant');
  orb.innerHTML = '<span class="core"></span>';
  orb.addEventListener('click', () => { if (typeof Sable !== 'undefined') Sable.togglePanel(); });
  document.body.appendChild(orb);
}
