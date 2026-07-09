/* =========================================================================
   UI + engine — Diagnostic, full adaptive Mock Exams (Bluebook-style runner),
   scoring, and the post-test review. Exposes startMock()/startDiagnostic().
   ========================================================================= */

/* ---------- module assembly ---------- */
// Weighted sampling biased toward a difficulty level ('base'|'hard'|'easy').
function weightedPickByLevel(src, target, level) {
  const w = (q) => { const d = diffNum(q.difficulty); if (level === 'hard') return d === 3 ? 5 : d === 2 ? 2 : 1; if (level === 'easy') return d === 1 ? 5 : d === 2 ? 2 : 1; return d === 2 ? 3 : 2; };
  const pool = src.slice(), out = [];
  while (out.length < target && pool.length) {
    const weights = pool.map(w), tot = sum(weights);
    let r = Math.random() * tot, idx = 0;
    for (; idx < pool.length; idx++) { r -= weights[idx]; if (r <= 0) break; }
    out.push(pool.splice(Math.min(idx, pool.length - 1), 1)[0]);
  }
  return out;
}
// Build one module of `count` questions for a section, respecting domain weights,
// preferring unseen and excluding anything already used in this exam.
function assembleModule(sec, count, opts = {}) {
  const used = opts.used || new Set();
  const level = opts.level || 'base';
  let picked = [];
  for (const d of domainsInSection(sec)) {
    const target = Math.max(1, Math.round(count * d.weight));
    const all = BANK.filter((q) => q.section === sec && q.domain === d.id && !isExtreme(q) && !used.has(q.id));
    const unseen = all.filter((q) => !S.seen[q.id]);
    const src = unseen.length >= target ? unseen : all;
    const chosen = weightedPickByLevel(src, Math.min(target, src.length), level);
    chosen.forEach((q) => used.add(q.id));
    picked = picked.concat(chosen);
  }
  // top up to exact count from anything remaining in the section
  while (picked.length < count) {
    const rest = BANK.filter((q) => q.section === sec && !isExtreme(q) && !used.has(q.id));
    if (!rest.length) break;
    const q = shuffle(rest)[0]; used.add(q.id); picked.push(q);
  }
  picked = picked.slice(0, count);
  picked.sort((a, b) => diffNum(a.difficulty) - diffNum(b.difficulty)); // easy → hard
  return picked;
}

/* Exam plans. Real Digital SAT: RW 27/mod 32min, Math 22/mod 35min. */
function mockPlan() {
  return {
    kind: 'mock', title: 'Full Mock Exam',
    sections: [
      { sec: 'rw', label: 'Reading & Writing', mods: 2, count: 27, timeSec: 32 * 60, routing: true },
      { sec: 'math', label: 'Math', mods: 2, count: 22, timeSec: 35 * 60, routing: true },
    ],
  };
}
function diagnosticPlan() {
  return {
    kind: 'diagnostic', title: 'Diagnostic',
    sections: [
      { sec: 'rw', label: 'Reading & Writing', mods: 1, count: 22, timeSec: 22 * 60, routing: false },
      { sec: 'math', label: 'Math', mods: 1, count: 16, timeSec: 22 * 60, routing: false },
    ],
  };
}

/* ---------- launchers ---------- */
function startMock() { new TestRunner(mockPlan()).begin(); }
function startDiagnostic() { new TestRunner(diagnosticPlan()).begin(); }

/* =========================================================================
   TestRunner — the full-screen, quiet Bluebook-style engine.
   ========================================================================= */
class TestRunner {
  constructor(plan) {
    this.plan = plan;
    this.used = new Set();
    this.secIdx = 0; this.modIdx = 0; this.qIdx = 0;
    this.responses = {};           // qid -> response
    this.flags = new Set();        // qid flagged for review
    this.struck = {};              // qid -> Set of struck letters
    this.moduleResults = [];       // {sec, mod, correct, total, level}
    this.routed = {};              // sec -> 'hard'|'easy'
    this.curQuestions = [];
    this.timer = null; this.remain = 0; this.timerHidden = false;
    this.host = null;
    this.annot = {};               // qid -> [{text, note}]  (Bluebook highlights/notes)
  }
  curSection() { return this.plan.sections[this.secIdx]; }
  begin() {
    this.host = openFullscreen('testmode');
    document.body.style.overflow = 'hidden';
    this.buildCurrentModule();
    this.renderIntro();
  }
  end() { clearInterval(this.timer); document.body.style.overflow = ''; closeFullscreen(); document.removeEventListener('keydown', this._key); }

  buildCurrentModule() {
    const s = this.curSection();
    let level = 'base';
    if (s.routing && this.modIdx === 1) level = this.routed[s.sec] === 'hard' ? 'hard' : 'easy';
    this.curQuestions = assembleModule(s.sec, s.count, { used: this.used, level });
    this.qIdx = 0;
  }

  renderIntro() {
    const s = this.curSection();
    const first = this.secIdx === 0 && this.modIdx === 0;
    this.host.innerHTML = `<div class="break-screen">
      <div style="font-size:2.4rem">${s.sec === 'math' ? '🧮' : '✍️'}</div>
      <h1>${esc(s.label)}${s.mods > 1 ? ` — Module ${this.modIdx + 1}` : ''}</h1>
      <p class="muted">${this.curQuestions.length} questions · ${Math.round(s.timeSec / 60)} minutes${s.sec === 'math' ? ' · calculator allowed throughout' : ''}.</p>
      ${first ? `<p class="muted">This runs like the real thing: no answers shown until you finish. Flag questions, cross out choices, highlight passage text (select it) and add notes, open the math reference, and jump around with the navigator. ${this.plan.kind === 'diagnostic' ? 'It seeds your mastery map and first score estimate.' : ''}</p>` : ''}
      <div class="row" style="justify-content:center;gap:10px;margin-top:20px">
        <button class="btn" id="tabort">Exit</button>
        <button class="btn primary lg" id="tstart">${first ? 'Start' : 'Begin module'} →</button>
      </div></div>`;
    $('#tstart', this.host).onclick = () => this.startModule();
    $('#tabort', this.host).onclick = () => this.confirmAbort();
  }

  startModule() {
    this.remain = this.curSection().timeSec;
    clearInterval(this.timer);
    this.timer = setInterval(() => { this.remain--; this.paintTimer(); if (this.remain <= 0) { clearInterval(this.timer); this.endModule(true); } }, 1000);
    this.renderQuestion();
    this._key = (e) => this.onKey(e);
    document.addEventListener('keydown', this._key);
  }

  renderQuestion() {
    const q = this.curQuestions[this.qIdx];
    const s = this.curSection();
    const n = this.curQuestions.length;
    const chosen = this.responses[q.id];
    const struck = this.struck[q.id] || new Set();
    const flagged = this.flags.has(q.id);
    const passage = q.passage ? `<div class="passage">${mathToHtml(q.passage)}</div>` : '';
    let inputHtml;
    if (q.type === 'spr') {
      inputHtml = `<input type="text" class="spr-input" id="tspr" placeholder="Enter answer" autocomplete="off" value="${chosen != null ? esc(chosen) : ''}">
        <div class="tag" style="margin-top:6px">Student-produced response.</div>`;
    } else {
      inputHtml = `<div class="choices" id="tchoices">${q.choices.map((c, i) => {
        const L = LETTERS[i];
        return `<div class="choice ${chosen === L ? 'sel' : ''} ${struck.has(L) ? 'struck' : ''}" data-letter="${L}">
          <span class="key">${L}</span><span class="txt">${mathToHtml(c)}</span>
          <button class="elim" title="Cross out">${struck.has(L) ? '↺' : '✕'}</button></div>`;
      }).join('')}</div>`;
    }
    const body = s.sec === 'rw' && q.passage
      ? `<div class="test-cols"><div>${passage}</div><div><div class="stem">${mathToHtml(q.stem)}</div>${inputHtml}</div></div>`
      : `<div style="max-width:760px;margin:0 auto">${passage}<div class="stem">${mathToHtml(q.stem)}</div>${inputHtml}</div>`;

    this.host.innerHTML = `
      <div class="test-top">
        <div class="test-title">${esc(s.label)}${s.mods > 1 ? ` · Module ${this.modIdx + 1}` : ''}</div>
        <div class="test-timer ${this.remain < 300 ? 'low' : ''}" id="ttimer">${this.timerHidden ? 'Show' : fmtClock(this.remain)}</div>
        <div class="test-tools">
          ${s.sec === 'math' ? '<button class="btn ghost sm" id="tref" title="Math reference">📐 Reference</button>' : ''}
          <button class="btn ghost sm" id="texit">Exit</button>
        </div>
      </div>
      <div class="test-body">
        <div class="row spread" style="margin-bottom:12px">
          <div class="mono" style="font-weight:700">Question ${this.qIdx + 1} <span class="muted">of ${n}</span></div>
          <button class="btn ghost sm" id="tflag" style="${flagged ? 'color:#b0851b' : ''}">${flagged ? '⚑ Marked' : '⚐ Mark for review'}</button>
        </div>
        ${body}
      </div>
      <div class="test-foot">
        <button class="btn" id="tnav">▤ Question ${this.qIdx + 1} of ${n}</button>
        <div class="row" style="gap:10px">
          <button class="btn" id="tback" ${this.qIdx === 0 ? 'disabled' : ''}>← Back</button>
          <button class="btn primary" id="tnext">${this.qIdx + 1 >= n ? 'Review & submit' : 'Next →'}</button>
        </div>
      </div>`;
    typeset(this.host);
    this.wireQuestion(q);
  }

  wireQuestion(q) {
    if (q.type === 'spr') {
      const inp = $('#tspr', this.host);
      inp.addEventListener('input', () => { this.responses[q.id] = inp.value; });
      inp.focus();
    } else {
      $$('#tchoices .choice', this.host).forEach((el) => {
        el.addEventListener('click', () => { this.responses[q.id] = el.dataset.letter; this.renderQuestion(); });
        el.querySelector('.elim').addEventListener('click', (e) => { e.stopPropagation(); this.toggleStrike(q, el.dataset.letter); });
      });
    }
    $('#ttimer', this.host).onclick = () => { this.timerHidden = !this.timerHidden; this.paintTimer(); };
    $('#tflag', this.host).onclick = () => { if (this.flags.has(q.id)) this.flags.delete(q.id); else this.flags.add(q.id); this.renderQuestion(); };
    $('#tnav', this.host).onclick = () => this.openNavigator();
    $('#texit', this.host).onclick = () => this.confirmAbort();
    $('#tback', this.host).onclick = () => { if (this.qIdx > 0) { this.qIdx--; this.renderQuestion(); } };
    $('#tnext', this.host).onclick = () => { if (this.qIdx + 1 >= this.curQuestions.length) this.openReview(); else { this.qIdx++; this.renderQuestion(); } };
    const ref = $('#tref', this.host); if (ref) ref.onclick = () => openReferenceSheet();
    this.setupAnnotate(q);
    this.applyAnnotations(q);
  }

  /* ---------- Bluebook-style highlight & note ---------- */
  setupAnnotate(q) {
    const pas = this.host.querySelector('.passage') || this.host.querySelector('.stem');
    if (!pas) return;
    pas.addEventListener('mouseup', () => setTimeout(() => this.onSelect(pas, q), 10));
  }
  onSelect(pas, q) {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return this.hideAnnotBar();
    const text = sel.toString().trim();
    if (text.length < 2 || text.length > 240) return this.hideAnnotBar();
    if (!pas.contains(sel.anchorNode) || !pas.contains(sel.focusNode)) return this.hideAnnotBar();
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    this.showAnnotBar(rect, text, q);
  }
  showAnnotBar(rect, text, q) {
    this.hideAnnotBar();
    const bar = document.createElement('div'); bar.className = 'annot-bar';
    bar.innerHTML = `<button data-a="hl">🖊 Highlight</button><button data-a="note">🗒 Note</button>`;
    bar.style.left = (rect.left + rect.width / 2) + 'px';
    bar.style.top = (rect.top - 6) + 'px';
    document.body.appendChild(bar); this._annotBar = bar;
    bar.querySelector('[data-a="hl"]').onmousedown = (e) => { e.preventDefault(); this.addAnn(q, text, null); };
    bar.querySelector('[data-a="note"]').onmousedown = (e) => { e.preventDefault(); this.promptNote(q, text); };
    this._annotDismiss = (e) => { if (this._annotBar && !this._annotBar.contains(e.target)) this.hideAnnotBar(); };
    setTimeout(() => document.addEventListener('mousedown', this._annotDismiss), 0);
  }
  hideAnnotBar() { if (this._annotBar) { this._annotBar.remove(); this._annotBar = null; } if (this._annotDismiss) { document.removeEventListener('mousedown', this._annotDismiss); this._annotDismiss = null; } }
  addAnn(q, text, note) {
    (this.annot[q.id] || (this.annot[q.id] = [])).push({ text, note });
    this.hideAnnotBar(); window.getSelection().removeAllRanges(); this.renderQuestion();
  }
  promptNote(q, text) {
    this.hideAnnotBar();
    const m = openModal(`<h3 style="margin-top:0">Add a note</h3>
      <div class="muted" style="font-size:.85rem;margin-bottom:8px">On: “${esc(text.slice(0, 120))}”</div>
      <textarea id="annNote" rows="4" placeholder="Your note…"></textarea>
      <div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Save note</button></div>`);
    m.el.style.color = '#1b1f2a';
    setTimeout(() => $('#annNote', m.el)?.focus(), 30);
    m.el.querySelector('[data-x]').onclick = m.close;
    m.el.querySelector('[data-s]').onclick = () => { const n = $('#annNote', m.el).value.trim(); m.close(); window.getSelection().removeAllRanges(); this.addAnn(q, text, n || '(note)'); };
  }
  applyAnnotations(q) {
    const list = this.annot[q.id]; if (!list || !list.length) return;
    const pas = this.host.querySelector('.passage') || this.host.querySelector('.stem'); if (!pas) return;
    list.forEach((ann, idx) => {
      const mark = wrapFirstOccurrence(pas, ann.text, 'hl' + (ann.note ? ' noted' : ''));
      if (mark) { mark.dataset.ann = idx; if (ann.note) mark.title = ann.note; mark.onclick = (e) => { e.stopPropagation(); this.markMenu(mark, q, idx); }; }
    });
  }
  markMenu(mark, q, idx) {
    const ann = this.annot[q.id][idx]; const rect = mark.getBoundingClientRect();
    this.hideAnnotBar();
    const bar = document.createElement('div'); bar.className = 'annot-bar';
    bar.innerHTML = `${ann.note ? `<button data-a="view">🗒 ${esc(ann.note.slice(0, 30))}</button>` : ''}<button data-a="rm">✕ Remove</button>`;
    bar.style.left = (rect.left + rect.width / 2) + 'px'; bar.style.top = (rect.top - 6) + 'px';
    document.body.appendChild(bar); this._annotBar = bar;
    const rm = bar.querySelector('[data-a="rm"]'); rm.onclick = () => { this.annot[q.id].splice(idx, 1); this.hideAnnotBar(); this.renderQuestion(); };
    const v = bar.querySelector('[data-a="view"]'); if (v) v.onclick = () => { toast('Note: ' + ann.note, 'sky', 4000); this.hideAnnotBar(); };
    this._annotDismiss = (e) => { if (this._annotBar && !this._annotBar.contains(e.target) && e.target !== mark) this.hideAnnotBar(); };
    setTimeout(() => document.addEventListener('mousedown', this._annotDismiss), 0);
  }
  toggleStrike(q, L) {
    const set = this.struck[q.id] || (this.struck[q.id] = new Set());
    if (set.has(L)) set.delete(L); else { set.add(L); if (this.responses[q.id] === L) delete this.responses[q.id]; }
    this.renderQuestion();
  }
  paintTimer() { const t = $('#ttimer', this.host); if (t) { t.textContent = this.timerHidden ? 'Show' : fmtClock(Math.max(0, this.remain)); t.classList.toggle('low', this.remain < 300); } }

  openNavigator() {
    const n = this.curQuestions.length;
    const grid = this.curQuestions.map((q, i) => {
      const answered = this.responses[q.id] != null && this.responses[q.id] !== '';
      const flagged = this.flags.has(q.id);
      return `<button class="qb ${answered ? 'answered' : ''} ${i === this.qIdx ? 'current' : ''} ${flagged ? 'flagged' : ''}" data-i="${i}">${i + 1}</button>`;
    }).join('');
    const host = openModal(`<h3>Question navigator</h3>
      <div class="muted" style="margin-bottom:12px">${Object.keys(this.responses).filter((k) => this.curQuestions.some((q) => q.id === k)).length} answered · ${this.flags.size} marked</div>
      <div class="navgrid">${grid}</div>
      <div class="row" style="justify-content:space-between;margin-top:16px"><button class="btn" data-close>Close</button><button class="btn primary" data-rev>Go to review →</button></div>`);
    host.el.style.color = '#1b1f2a';
    $$('.qb', host.el).forEach((b) => b.onclick = () => { this.qIdx = parseInt(b.dataset.i); host.close(); this.renderQuestion(); });
    host.el.querySelector('[data-close]').onclick = host.close;
    host.el.querySelector('[data-rev]').onclick = () => { host.close(); this.openReview(); };
  }
  openReview() {
    const n = this.curQuestions.length;
    const unanswered = this.curQuestions.filter((q) => this.responses[q.id] == null || this.responses[q.id] === '').length;
    const host = openModal(`<h3>Before you submit</h3>
      <p class="muted">${this.curSection().label}${this.curSection().mods > 1 ? ' · Module ' + (this.modIdx + 1) : ''}: ${n - unanswered}/${n} answered${unanswered ? `, <b style="color:var(--coral)">${unanswered} left blank</b>` : ''}. ${this.flags.size ? this.flags.size + ' marked for review.' : ''}</p>
      <div class="navgrid" style="margin:12px 0">${this.curQuestions.map((q, i) => { const a = this.responses[q.id] != null && this.responses[q.id] !== ''; return `<button class="qb ${a ? 'answered' : ''} ${this.flags.has(q.id) ? 'flagged' : ''}" data-i="${i}">${i + 1}</button>`; }).join('')}</div>
      <div class="row" style="justify-content:space-between;margin-top:8px"><button class="btn" data-close>Keep working</button><button class="btn primary" data-submit>Submit module →</button></div>`);
    host.el.style.color = '#1b1f2a';
    $$('.qb', host.el).forEach((b) => b.onclick = () => { this.qIdx = parseInt(b.dataset.i); host.close(); this.renderQuestion(); });
    host.el.querySelector('[data-close]').onclick = host.close;
    host.el.querySelector('[data-submit]').onclick = () => { host.close(); this.endModule(false); };
  }

  endModule(auto) {
    clearInterval(this.timer);
    const s = this.curSection();
    // grade this module (silent — updates mastery/mistakes/exposure, no XP/combo)
    let correct = 0;
    for (const q of this.curQuestions) {
      const resp = this.responses[q.id];
      const res = recordAnswer(q, resp == null ? '' : resp, { silent: true, fromMock: true });
      if (res.correct) correct++;
    }
    const level = (s.routing && this.modIdx === 1) ? (this.routed[s.sec] === 'hard' ? 'hard' : 'easy') : 'base';
    this.moduleResults.push({ sec: s.sec, mod: this.modIdx, correct, total: this.curQuestions.length, level, questions: this.curQuestions.map((q) => q.id) });
    if (correct === this.curQuestions.length && this.curQuestions.length >= 10) { S.counters.perfectModules++; award('perfect_module'); }

    // adaptive routing after module 1
    if (s.routing && this.modIdx === 0) {
      const frac = correct / this.curQuestions.length;
      this.routed[s.sec] = frac >= ROUTE_HARD_THRESHOLD ? 'hard' : 'easy';
      this.modIdx = 1;
      this.buildCurrentModule();
      if (auto) toast('Time up — moving to Module 2', 'sky');
      this.renderIntro();
      return;
    }
    // module complete → next module/section or finish
    this.advanceSection();
  }

  advanceSection() {
    this.modIdx = 0;
    this.secIdx++;
    if (this.secIdx >= this.plan.sections.length) return this.finishExam();
    // break screen between sections (mock only)
    this.buildCurrentModule();
    if (this.plan.kind === 'mock') this.renderBreak();
    else this.renderIntro();
  }

  renderBreak() {
    let left = 10 * 60;
    const paint = () => { const el = $('#brk', this.host); if (el) el.textContent = fmtClock(left); };
    this.host.innerHTML = `<div class="break-screen">
      <div style="font-size:2.4rem">☕</div><h1>Break time</h1>
      <p class="muted">You’ve finished Reading & Writing. Take up to 10 minutes. The Math section starts when you’re ready.</p>
      <div class="test-timer" style="display:inline-block;font-size:1.6rem;margin:10px 0" id="brk">10:00</div>
      <div><button class="btn primary lg" id="bresume">Resume with Math →</button></div></div>`;
    paint();
    const iv = setInterval(() => { left--; paint(); if (left <= 0) { clearInterval(iv); this.renderIntro(); } }, 1000);
    $('#bresume', this.host).onclick = () => { clearInterval(iv); this.renderIntro(); };
  }

  finishExam() {
    clearInterval(this.timer);
    // score per section
    const bySec = {};
    for (const r of this.moduleResults) { const b = bySec[r.sec] || (bySec[r.sec] = { correct: 0, total: 0, easy: false }); b.correct += r.correct; b.total += r.total; if (r.mod === 1 && r.level === 'easy') b.easy = true; if (this.plan.kind === 'diagnostic') b.easy = false; }
    const scaled = {};
    for (const sec of ['rw', 'math']) { const b = bySec[sec]; if (b) scaled[sec] = estimateScaledScore(sec, b.correct / b.total, b.easy); }
    const total = (scaled.rw || 0) + (scaled.math || 0);
    const summary = { kind: this.plan.kind, ts: Date.now(), bySec, scaled, total, modules: this.moduleResults };

    // persist
    S.scoreHistory.push({ ts: summary.ts, rw: scaled.rw || 0, math: scaled.math || 0, total, source: this.plan.kind });
    if (S.scoreHistory.length > 40) S.scoreHistory = S.scoreHistory.slice(-40);
    addXP(this.plan.kind === 'mock' ? 300 : 150);
    if (this.plan.kind === 'mock') { S.counters.mocksDone++; award('mock1'); S.mocks.push(summary); markPlanTaskDone('mock'); }
    else { S.diagnostic = { done: true, result: summary }; award('diagnostic'); generatePlan(true); }
    if ((scaled.rw || 0) >= 700 || (scaled.math || 0) >= 700) award('section700');
    touchStreak(); save(true);

    this.renderResults(summary);
  }

  renderResults(sm) {
    document.body.style.overflow = '';
    const domainBreak = (sec) => {
      const doms = domainsInSection(sec);
      const ids = sm.modules.filter((m) => m.sec === sec).flatMap((m) => m.questions);
      return doms.map((d) => {
        const qs = ids.map(getQ).filter((q) => q && q.domain === d.id);
        const c = qs.filter((q) => gradeQuestion(q, this.responses[q.id] == null ? '' : this.responses[q.id])).length;
        const pctv = qs.length ? Math.round(c / qs.length * 100) : 0;
        return `<div style="margin:6px 0"><div class="row spread" style="font-size:.85rem"><span>${esc(d.name)}</span><span class="mono">${c}/${qs.length}</span></div><div class="bar" style="margin-top:3px"><span style="width:${pctv}%"></span></div></div>`;
      }).join('');
    };
    const secCard = (sec) => sm.scaled[sec] == null ? '' : `<div class="card"><div class="row spread"><h3 style="margin:0">${SECTIONS[sec].name}</h3><div class="stat" style="text-align:right"><div class="v">${sm.scaled[sec]}</div></div></div>
      <div class="muted" style="margin:6px 0">${sm.bySec[sec].correct}/${sm.bySec[sec].total} correct${sm.bySec[sec].easy ? ' · routed to easier Module 2 (score capped)' : ''}</div>${domainBreak(sec)}</div>`;

    this.host.className = 'fs';
    this.host.style.cssText = 'position:fixed;inset:0;z-index:75;overflow:auto;';
    this.host.innerHTML = `<div class="main" style="max-width:900px;margin:0 auto;padding:30px 20px 80px">
      <div class="tac"><div class="eyebrow">${sm.kind === 'mock' ? 'Mock exam' : 'Diagnostic'} complete</div>
        <div class="stat" style="align-items:center;margin:10px 0"><div class="v" style="font-size:3.4rem;color:var(--ace)">${sm.total}</div><div class="muted">estimated total · 400–1600 scale</div></div>
        <div class="tag">Scores are estimates based on an approximate scoring curve.</div></div>
      <div class="grid g-2" style="margin:20px 0">${secCard('rw')}${secCard('math')}</div>
      <div class="row" style="justify-content:center;gap:10px">
        <button class="btn primary" id="rreview">Review every question →</button>
        <button class="btn" id="rdone">Done</button>
      </div></div>`;
    $('#rdone', this.host).onclick = () => { this.end(); navigate('home'); };
    $('#rreview', this.host).onclick = () => this.renderReviewAll(sm);
  }

  renderReviewAll(sm) {
    const allIds = sm.modules.flatMap((m) => m.questions);
    const items = allIds.map(getQ).filter(Boolean).map((q) => {
      const resp = this.responses[q.id]; const correct = gradeQuestion(q, resp == null ? '' : resp);
      const yourAns = q.type === 'spr' ? (resp || '(blank)') : (resp || '(blank)');
      return `<div class="card" style="border-left:3px solid ${correct ? 'var(--mint)' : 'var(--coral)'}">
        <div class="row spread"><div class="row" style="gap:8px">${skillPill(q.skill)}${diffDots(q.difficulty)}</div><span class="pill ${correct ? 'mint' : 'coral'}">${correct ? 'correct' : 'incorrect'}</span></div>
        ${q.passage ? `<div class="passage" style="margin-top:8px">${mathToHtml(q.passage)}</div>` : ''}
        <div class="stem" style="margin-top:8px">${mathToHtml(q.stem)}</div>
        ${q.type === 'mcq' ? `<div class="choices">${q.choices.map((c, i) => { const L = LETTERS[i]; const cls = L === q.answer ? 'correct' : (L === resp ? 'wrong' : ''); return `<div class="choice ${cls}"><span class="key">${L}</span><span class="txt">${mathToHtml(c)}</span></div>`; }).join('')}</div>` : `<div class="tag">Your answer: ${esc(String(yourAns))} · Correct: ${esc(String([].concat(q.answer)[0]))}</div>`}
        <div class="explain" style="margin-top:10px">${mathToHtml(q.explanation)}</div></div>`;
    }).join('');
    this.host.innerHTML = `<div class="main" style="max-width:820px;margin:0 auto;padding:24px 20px 80px">
      ${pageHeader('Review — every question', `${sm.kind === 'mock' ? 'Mock exam' : 'Diagnostic'} · estimated ${sm.total}`, `<button class="btn primary" id="rback">Done</button>`)}
      <div class="stack">${items}</div>
      <div class="tac" style="margin-top:16px"><button class="btn primary" id="rback2">Done →</button></div></div>`;
    typeset(this.host);
    const done = () => { this.end(); navigate('progress'); };
    $('#rback', this.host).onclick = done; $('#rback2', this.host).onclick = done;
  }

  confirmAbort() {
    confirmModal('Exit the test?', 'Your progress on this attempt will be lost and not scored.', () => { this.end(); navigate('home'); }, 'Exit test', 'ghost');
  }

  onKey(e) {
    const ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae.id !== 'tspr') return;
    const q = this.curQuestions[this.qIdx]; if (!q) return;
    if (e.key === 'ArrowRight') { $('#tnext', this.host)?.click(); }
    else if (e.key === 'ArrowLeft') { $('#tback', this.host)?.click(); }
    else if (q.type === 'mcq' && ae?.id !== 'tspr') { const i = LETTERS.indexOf(e.key.toUpperCase()); if (i >= 0 && i < q.choices.length) { this.responses[q.id] = LETTERS[i]; this.renderQuestion(); } }
  }
}

/* =========================================================================
   Views — Mocks list + Diagnostic intro.
   ========================================================================= */
registerView('mocks', {
  render() {
    const history = S.scoreHistory.filter((h) => h.source === 'mock');
    const rows = S.mocks.slice().reverse().map((m) => `<div class="card"><div class="row spread">
      <div><b>${m.kind === 'mock' ? 'Mock exam' : 'Diagnostic'}</b><div class="tag">${fmtDate(m.ts)}</div></div>
      <div class="row" style="gap:16px"><div class="stat" style="text-align:right"><div class="v" style="font-size:1.4rem">${m.total}</div><div class="k">total</div></div>
      <div class="muted" style="align-self:center">RW ${m.scaled.rw || '–'} · Math ${m.scaled.math || '–'}</div></div></div></div>`).join('');
    const bankOk = BANK.filter((q) => q.section === 'rw' && !isExtreme(q)).length >= 54 && BANK.filter((q) => q.section === 'math' && !isExtreme(q)).length >= 44;
    return `${pageHeader('Mock Exams', 'Full-length, adaptive, Bluebook-style. Two sections, four modules, timed — assembled from questions you haven’t seen.',
      `<button class="btn primary lg" onclick="startMock()">Start a mock →</button>`)}
      <div class="card" style="margin-bottom:16px">
        <div class="row spread wrap">
          <div><h3 style="margin:0">How it works</h3>
          <div class="muted" style="max-width:640px;margin-top:6px">Reading &amp; Writing (2 × 27 questions, 32 min each), then a 10-minute break, then Math (2 × 22 questions, 35 min each, calculator throughout). Module 2 adapts to your Module 1 performance. At the end you get an estimated 400–1600 score, a per-domain breakdown, and a full review.</div></div>
          <div style="font-size:2.6rem">📝</div>
        </div>
        ${bankOk ? '' : '<div class="tag" style="margin-top:10px;color:var(--ace)">Tip: the bank grows as more questions load — a full mock needs 54 RW + 44 Math unseen questions.</div>'}
      </div>
      ${trendChart(history)}
      ${rows ? `<h3 style="margin:20px 0 10px">History</h3><div class="stack">${rows}</div>` : ''}`;
  },
});

registerView('diagnostic', {
  render() {
    if (S.diagnostic.done) {
      const r = S.diagnostic.result;
      return `${pageHeader('Diagnostic', 'Already complete — this seeded your plan and estimate.')}
        <div class="card tac" style="padding:30px"><div class="eyebrow">Your diagnostic estimate</div>
          <div class="stat" style="align-items:center;margin:8px 0"><div class="v" style="font-size:2.6rem;color:var(--ace)">${r.total}</div><div class="muted">RW ${r.scaled.rw} · Math ${r.scaled.math}</div></div>
          <div class="row" style="justify-content:center;gap:10px;margin-top:10px"><button class="btn" onclick="navigate('progress')">See mastery</button><button class="btn primary" onclick="startMock()">Take a full mock</button></div></div>`;
    }
    return `${pageHeader('Diagnostic', 'A ~40-minute shortened test — one module per section — to seed your mastery map and first score estimate.')}
      <div class="card tac" style="padding:36px">
        <div style="font-size:2.4rem">🧭</div><h2 style="margin:.3em 0">Ready when you are</h2>
        <p class="muted" style="max-width:560px;margin:0 auto 18px">Reading &amp; Writing (22 questions, 22 min) then Math (16 questions, 22 min). Answer honestly — this calibrates everything: your heatmap, projected score, and study plan.</p>
        <button class="btn gold lg" onclick="startDiagnostic()">Begin diagnostic →</button>
      </div>`;
  },
});

/* =========================================================================
   Bluebook-style Math Reference Sheet — the standard SAT reference, available
   during math modules (and math drills). Figures drawn as inline SVG.
   ========================================================================= */
function openReferenceSheet() {
  const st = 'stroke:var(--muted);fill:none;stroke-width:1.5';
  const fig = {
    circle: `<svg width="56" height="52"><circle cx="24" cy="26" r="18" style="${st}"/><line x1="24" y1="26" x2="42" y2="26" style="${st}"/><text x="30" y="22" fill="var(--faint)" font-size="9">r</text></svg>`,
    rect: `<svg width="60" height="52"><rect x="6" y="12" width="48" height="28" style="${st}"/><text x="26" y="50" fill="var(--faint)" font-size="9">ℓ</text><text x="0" y="30" fill="var(--faint)" font-size="9">w</text></svg>`,
    tri: `<svg width="60" height="52"><polygon points="8,42 52,42 34,10" style="${st}"/><line x1="34" y1="10" x2="34" y2="42" style="${st};stroke-dasharray:3"/><text x="26" y="51" fill="var(--faint)" font-size="9">b</text><text x="36" y="30" fill="var(--faint)" font-size="9">h</text></svg>`,
    rtri: `<svg width="60" height="52"><polygon points="10,42 50,42 10,10" style="${st}"/><rect x="10" y="36" width="6" height="6" style="${st}"/><text x="27" y="51" fill="var(--faint)" font-size="9">a</text><text x="0" y="30" fill="var(--faint)" font-size="9">b</text><text x="34" y="22" fill="var(--faint)" font-size="9">c</text></svg>`,
    t3060: `<svg width="70" height="52"><polygon points="10,42 58,42 10,12" style="${st}"/><rect x="10" y="36" width="6" height="6" style="${st}"/><text x="30" y="51" fill="var(--faint)" font-size="8">x√3</text><text x="0" y="30" fill="var(--faint)" font-size="8">x</text><text x="34" y="22" fill="var(--faint)" font-size="8">2x</text></svg>`,
    t4545: `<svg width="60" height="52"><polygon points="10,42 50,42 10,12" style="${st}"/><rect x="10" y="36" width="6" height="6" style="${st}"/><text x="26" y="51" fill="var(--faint)" font-size="8">s</text><text x="0" y="30" fill="var(--faint)" font-size="8">s</text><text x="32" y="22" fill="var(--faint)" font-size="8">s√2</text></svg>`,
    box: `<svg width="64" height="52"><rect x="8" y="16" width="34" height="26" style="${st}"/><path d="M8,16 L20,6 L54,6 L42,16 M42,42 L54,32 L54,6" style="${st}"/></svg>`,
    cyl: `<svg width="52" height="52"><ellipse cx="26" cy="12" rx="16" ry="6" style="${st}"/><path d="M10,12 L10,40 M42,12 L42,40" style="${st}"/><ellipse cx="26" cy="40" rx="16" ry="6" style="${st}"/></svg>`,
    sphere: `<svg width="52" height="52"><circle cx="26" cy="26" r="18" style="${st}"/><ellipse cx="26" cy="26" rx="18" ry="6" style="${st};stroke-dasharray:3"/></svg>`,
    cone: `<svg width="52" height="52"><path d="M26,8 L10,40 M26,8 L42,40" style="${st}"/><ellipse cx="26" cy="40" rx="16" ry="6" style="${st}"/></svg>`,
    pyr: `<svg width="60" height="52"><path d="M30,8 L10,40 L50,40 Z M30,8 L30,40" style="${st};stroke-dasharray:3"/><path d="M30,8 L10,40 M30,8 L50,40" style="${st}"/></svg>`,
  };
  const card = (svg, lbl, fx) => `<div class="rf">${svg}<div class="lbl">${lbl}</div><div class="fx">${mathToHtml(fx)}</div></div>`;
  const html = `<h3 style="margin-top:0">📐 Reference</h3>
    <div class="ref-grid">
      ${card(fig.circle, 'Circle', '$A=\\pi r^2$,  $C=2\\pi r$')}
      ${card(fig.rect, 'Rectangle', '$A=\\ell w$')}
      ${card(fig.tri, 'Triangle', '$A=\\tfrac12 bh$')}
      ${card(fig.rtri, 'Right triangle', '$a^2+b^2=c^2$')}
      ${card(fig.t3060, '30°-60°-90°', '$x,\\ x\\sqrt3,\\ 2x$')}
      ${card(fig.t4545, '45°-45°-90°', '$s,\\ s,\\ s\\sqrt2$')}
      ${card(fig.box, 'Rect. solid', '$V=\\ell wh$')}
      ${card(fig.cyl, 'Cylinder', '$V=\\pi r^2 h$')}
      ${card(fig.sphere, 'Sphere', '$V=\\tfrac43\\pi r^3$')}
      ${card(fig.cone, 'Cone', '$V=\\tfrac13\\pi r^2 h$')}
      ${card(fig.pyr, 'Pyramid', '$V=\\tfrac13\\ell wh$')}
    </div>
    <div class="ref-note">There are 360° (2π radians) of arc in a circle. The measures of the angles in a triangle sum to 180°.</div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn primary" data-refclose>Close</button></div>`;
  const m = openModal(html);
  m.el.querySelector('[data-refclose]').onclick = m.close;
}

// Wrap the first occurrence of `text` (a plain-text run) inside `root` in a
// <mark>. Works across re-renders since it re-finds the text each time.
function wrapFirstOccurrence(root, text, className) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement && node.parentElement.classList.contains('hl')) continue;
    const i = node.nodeValue.indexOf(text);
    if (i >= 0) {
      const range = document.createRange();
      range.setStart(node, i); range.setEnd(node, i + text.length);
      const mark = document.createElement('mark'); mark.className = className;
      try { range.surroundContents(mark); return mark; } catch (e) { return null; }
    }
  }
  return null;
}

/* Small SVG trend line for scores across diagnostics + mocks. */
function trendChart(history) {
  const pts = S.scoreHistory.slice(-10);
  if (pts.length < 2) return '';
  const W = 640, H = 160, pad = 30;
  const xs = (i) => pad + i * (W - 2 * pad) / (pts.length - 1);
  const ys = (v) => H - pad - (v - 400) / 1200 * (H - 2 * pad);
  const line = pts.map((p, i) => `${xs(i)},${ys(p.total)}`).join(' ');
  const dots = pts.map((p, i) => `<circle cx="${xs(i)}" cy="${ys(p.total)}" r="4" fill="var(--ace)"><title>${p.total} (${p.source})</title></circle>`).join('');
  return `<div class="card"><div class="eyebrow">Score trend</div>
    <svg viewBox="0 0 ${W} ${H}" class="chart" style="width:100%;height:auto;margin-top:8px">
      ${[400, 800, 1200, 1600].map((v) => `<line class="grid" x1="${pad}" y1="${ys(v)}" x2="${W - pad}" y2="${ys(v)}"/><text x="4" y="${ys(v) + 4}">${v}</text>`).join('')}
      <polyline fill="none" stroke="var(--violet-2)" stroke-width="2.5" points="${line}"/>${dots}
    </svg></div>`;
}
