/* =========================================================================
   UI — Learn (Khan-style courses + lessons + checkpoints) and the Skill Path
   (Duolingo-style winding path with unlocking nodes + optional hearts mode).
   ========================================================================= */

function comingSoon(title, note) {
  return `${pageHeader(title)}<div class="card tac" style="padding:44px">
    <div style="font-size:2.2rem">🚧</div><h3>${esc(title)} is being built.</h3>
    <p class="muted">${esc(note || 'Arriving in an upcoming build phase.')}</p></div>`;
}

/* ---------- lesson status helpers ---------- */
function lessonDone(skill) { return !!S.path['lesson_' + skill]; }
function markLessonDone(skill) { if (!lessonDone(skill)) { S.path['lesson_' + skill] = Date.now(); bumpToday('lessons'); markPlanTaskDone('lesson'); save(); } }

/* ---------- Learn: units per domain ---------- */
registerView('learn', {
  render(params) {
    if (params.skill) return renderLesson(params.skill);
    const unit = (dom) => {
      const skills = skillsInDomain(dom.id);
      return `<div class="card">
        <div class="row spread"><h3 style="margin:0">${esc(dom.name)}</h3><span class="pill">${SECTIONS[dom.section].name}</span></div>
        <div class="stack" style="margin-top:12px">
          ${skills.map((s) => {
            const m = getMastery(s.id), t = masteryTier(m), has = !!LESSON_BY_SKILL[s.id];
            return `<div class="row spread" style="gap:10px">
              <div style="flex:1;cursor:pointer" onclick="navigate('learn',{skill:'${s.id}'})">
                <div class="row" style="gap:8px"><span style="font-weight:600">${esc(s.name)}</span>
                  ${lessonDone(s.id) ? '<span class="pill mint">✓ read</span>' : ''}${!has ? '<span class="tag">lesson soon</span>' : ''}</div>
                <div class="bar ${t.cls === 'm5' || t.cls === 'm4' ? 'mint' : ''}" style="margin-top:5px"><span style="width:${m}%"></span></div>
              </div>
              <button class="btn sm" onclick="navigate('learn',{skill:'${s.id}'})">Open</button>
            </div>`;
          }).join('')}
        </div></div>`;
    };
    return `${pageHeader('Learn', 'Courses that actually teach. Each unit holds one mini-lesson per skill, with a checkpoint quiz.',
      `<button class="btn primary" onclick="navigate('path')">Follow the Skill Path →</button>`)}
      <div class="grid g-2">
        <div class="stack">${domainsInSection('math').map(unit).join('')}</div>
        <div class="stack">${domainsInSection('rw').map(unit).join('')}</div>
      </div>`;
  },
  mount() { },
});

function renderLesson(skill) {
  const s = SKILL_BY_ID[skill]; if (!s) return comingSoon('Lesson');
  const L = LESSON_BY_SKILL[skill];
  const m = getMastery(skill), t = masteryTier(m);
  const checkpointCount = pickQuestions({ skill }).length;
  if (!L) {
    return `${pageHeader(s.name, DOMAINS[s.domain].name)}
      <div class="card"><p class="muted">A written lesson for this skill is on the way. You can still run a checkpoint drill from the current question bank.</p>
      ${checkpointCount >= 1 ? `<button class="btn primary" onclick="startCheckpoint('${skill}')">Start ${Math.min(6, checkpointCount)}-question checkpoint →</button>` : '<span class="muted">No questions yet for this skill.</span>'}</div>`;
  }
  return `
    ${pageHeader(s.name, `${DOMAINS[s.domain].name} · ${SECTIONS[skillSection(skill)].name}`,
      `<span class="pill ${t.cls === 'm5' ? 'gold' : 'violet'}">Mastery ${Math.round(m)}</span>
       <button class="btn ghost sm" onclick="navigate('learn')">← All units</button>`)}
    <div class="player">
      <div class="card pad-lg">
        <div class="eyebrow">Concept</div>
        ${L.concept.map((p) => `<p style="font-size:1.04rem;line-height:1.65">${mathToHtml(p)}</p>`).join('')}
      </div>

      <div class="card pad-lg" style="margin-top:14px">
        <div class="eyebrow">Worked examples</div>
        ${L.examples.map((ex, i) => `
          <div style="margin-top:${i ? 16 : 8}px">
            <div style="font-weight:600;margin-bottom:6px">${i + 1}. ${mathToHtml(ex.q)}</div>
            <div class="stack" style="gap:4px">${ex.steps.map((st) => `<div class="row" style="gap:8px;align-items:flex-start"><span style="color:var(--violet-2)">→</span><div>${mathToHtml(st)}</div></div>`).join('')}</div>
          </div>`).join('')}
      </div>

      <div class="card pad-lg" style="margin-top:14px;border-left:3px solid var(--coral)">
        <div class="eyebrow" style="color:var(--coral)">⚠ Common traps</div>
        <ul style="margin:8px 0 0;padding-left:20px">${L.traps.map((tr) => `<li style="margin:4px 0">${mathToHtml(tr)}</li>`).join('')}</ul>
      </div>

      <div class="card pad-lg tac" style="margin-top:14px">
        <h3 style="margin-top:0">Ready to check yourself?</h3>
        <p class="muted">A 6-question checkpoint feeds your mastery score for ${esc(s.name)}.</p>
        ${checkpointCount >= 1 ? `<button class="btn primary lg" onclick="markLessonDone('${skill}');startCheckpoint('${skill}')">Start checkpoint →</button>`
          : '<span class="muted">Checkpoint questions arrive with the full bank.</span>'}
      </div>
    </div>`;
}

function startCheckpoint(skill) {
  markLessonDone(skill);
  const qs = pickQuestions({ skill, limit: 6, difficultyMax: 3 });
  if (!qs.length) { toast('No questions yet for this skill.', 'coral'); return; }
  const host = document.getElementById('view');
  host.innerHTML = `<div id="cp"></div>`;
  runQuestionSession({
    container: document.getElementById('cp'), questions: qs, mode: 'checkpoint',
    title: SKILL_BY_ID[skill].name + ' checkpoint',
    onDone: (sm) => {
      host.innerHTML = defaultSummary(sm, { title: 'Checkpoint' });
      typeset(host);
      $$('[data-review]', host).forEach((b) => b.onclick = () => reviewSession(sm, {}));
      const extra = document.createElement('div'); extra.className = 'player'; extra.style.marginTop = '10px';
      extra.innerHTML = `<div class="tac"><button class="btn" onclick="navigate('learn',{skill:'${skill}'})">← Back to lesson</button> <button class="btn primary" onclick="navigate('path')">Skill Path →</button></div>`;
      host.appendChild(extra);
    },
  });
}

/* =========================================================================
   Skill Path — a curated winding sequence of bite-sized nodes.
   ========================================================================= */
const PATH_ORDER = [
  'alg_linear_eq', 'rw_boundaries', 'alg_linear_fn', 'rw_vocab', 'alg_systems',
  'rw_sva', 'alg_inequal', 'rw_transitions', 'alg_word', 'rw_main',
  'adv_quadratic', 'rw_verb', 'adv_exponents', 'rw_purpose', 'adv_exponential',
  'rw_evidence', 'adv_polynomial', 'rw_modifiers', 'adv_rational', 'rw_inference',
  'adv_functions', 'rw_synthesis', 'psda_ratio', 'rw_quant', 'psda_percent',
  'rw_connections', 'psda_data', 'psda_stats', 'psda_prob', 'geo_angles',
  'geo_trig', 'geo_circles', 'geo_volume',
];
let PATH = [];
function buildPath() {
  PATH = [];
  let recent = [];
  PATH_ORDER.forEach((skill, i) => {
    PATH.push({ id: `p${PATH.length}`, kind: 'micro', skill });
    PATH.push({ id: `p${PATH.length}`, kind: 'practice', skill });
    recent.push(skill);
    if ((i + 1) % 3 === 0 || i === PATH_ORDER.length - 1) {
      PATH.push({ id: `p${PATH.length}`, kind: 'checkpoint', skills: recent.slice() });
      recent = [];
    }
  });
}
function nodeDone(n) { return !!S.path[n.id]; }
function firstUndoneIndex() { for (let i = 0; i < PATH.length; i++) if (!nodeDone(PATH[i])) return i; return PATH.length; }
function nodeUnlocked(i) { return i <= firstUndoneIndex(); }
function markNodeDone(n) { if (!S.path[n.id]) { S.path[n.id] = Date.now(); bumpToday('nodes'); if (n.kind === 'micro') markLessonDone(n.skill); save(); } }

const NODE_ICON = { micro: '📘', practice: '✏️', checkpoint: '🏁' };
function nodeLabel(n) {
  if (n.kind === 'checkpoint') return 'Checkpoint';
  return SKILL_BY_ID[n.skill].name;
}

registerView('path', {
  render() {
    const cur = firstUndoneIndex();
    const heartsBar = S.settings.heartsMode ? `<span class="hearts" title="Hearts">${Array.from({ length: S.hearts.max }, (_, i) => `<span class="h ${i < S.hearts.count ? '' : 'lost'}">♥</span>`).join('')}</span>` : '';
    // group nodes into "chapters" by checkpoint boundaries for headers
    let html = '', chapter = 1, sinceHeader = true;
    PATH.forEach((n, i) => {
      if (sinceHeader) { html += `<div class="path-unit-h"><span class="dot"></span><span class="eyebrow">Chapter ${chapter}</span></div>`; sinceHeader = false; }
      const done = nodeDone(n), unlocked = nodeUnlocked(i), isCur = i === cur;
      const off = Math.sin(i * 0.9) * 90; // zigzag
      const cls = done ? 'done' : isCur ? 'current' : unlocked ? '' : 'locked';
      html += `<div class="path-nodes" style="display:flex;justify-content:center">
        <div class="node ${cls}" style="transform:translateX(${off}px)" data-i="${i}" title="${esc(nodeLabel(n))}">
          <span class="ic">${done ? '✓' : NODE_ICON[n.kind]}</span>
          <span class="cap">${esc(nodeLabel(n))}${n.kind === 'checkpoint' ? '' : ' · ' + (n.kind === 'micro' ? 'lesson' : 'practice')}</span>
        </div></div>`;
      if (n.kind === 'checkpoint') { chapter++; sinceHeader = true; }
    });
    const doneCount = PATH.filter(nodeDone).length;
    return `${pageHeader('Skill Path', `${doneCount} / ${PATH.length} nodes complete · bite-sized, ~5 minutes each`,
      `${heartsBar}<button class="btn sm" onclick="navigate('learn')">Browse units</button>`)}
      ${S.settings.heartsMode && S.hearts.count === 0 ? `<div class="card" style="border-color:var(--coral);margin-bottom:12px"><b style="color:var(--coral)">Out of hearts.</b> Clear questions in your <a onclick="navigate('mistakes')" style="cursor:pointer">mistake bank</a> to earn them back.</div>` : ''}
      <div class="path-wrap">${html}</div>`;
  },
  mount(root) {
    $$('.node', root).forEach((el) => el.addEventListener('click', () => {
      const i = parseInt(el.dataset.i);
      if (!nodeUnlocked(i)) { toast('Finish the earlier nodes first.', 'sky'); return; }
      startPathNode(i);
    }));
  },
});

function startPathNode(i) {
  const n = PATH[i];
  const heartsOn = S.settings.heartsMode;
  if (heartsOn && S.hearts.count === 0) { toast('Out of hearts — clear mistake reviews first.', 'coral'); navigate('mistakes'); return; }

  if (n.kind === 'micro') {
    // show the lesson, then a 3-question quick check
    const host = document.getElementById('view');
    const L = LESSON_BY_SKILL[n.skill];
    host.innerHTML = `<div class="player">
      ${pageHeader(SKILL_BY_ID[n.skill].name, 'Micro-lesson · ~5 min', `<button class="btn ghost sm" onclick="navigate('path')">← Path</button>`)}
      <div class="card pad-lg">${L ? L.concept.map((p) => `<p style="font-size:1.04rem;line-height:1.65">${mathToHtml(p)}</p>`).join('') : '<p class="muted">Quick practice for this skill.</p>'}
        ${L && L.traps ? `<div style="margin-top:10px;border-left:3px solid var(--coral);padding-left:12px"><div class="eyebrow" style="color:var(--coral)">Watch out</div><div>${mathToHtml(L.traps[0])}</div></div>` : ''}</div>
      <div class="tac" style="margin-top:14px"><button class="btn primary lg" id="microGo">Got it — quick check →</button></div>`;
    typeset(host);
    $('#microGo', host).onclick = () => runNodeSession(i, pickQuestions({ skill: n.skill, limit: 3, difficultyMax: 2 }));
    return;
  }
  if (n.kind === 'practice') { runNodeSession(i, pickQuestions({ skill: n.skill, limit: 8 })); return; }
  if (n.kind === 'checkpoint') {
    const qs = shuffle([].concat(...n.skills.map((sk) => pickQuestions({ skill: sk, limit: 4 })))).slice(0, 10);
    runNodeSession(i, qs);
  }
}

function runNodeSession(i, qs) {
  const n = PATH[i];
  if (!qs.length) { toast('No questions available for this node yet — marking complete.', 'sky'); markNodeDone(n); navigate('path'); return; }
  const heartsOn = S.settings.heartsMode;
  const host = document.getElementById('view');
  host.innerHTML = `<div id="pnode"></div>`;
  runQuestionSession({
    container: document.getElementById('pnode'), questions: qs, mode: 'path',
    title: nodeLabel(n) + (n.kind === 'checkpoint' ? ' · Checkpoint' : ''),
    hearts: heartsOn ? S.hearts.count : null,
    onMiss: heartsOn ? () => { S.hearts.count = Math.max(0, S.hearts.count - 1); save(); } : null,
    onDone: (sm) => {
      const passed = !sm.heartsOut;
      if (passed) { markNodeDone(n); touchStreak(); }
      host.innerHTML = `<div class="player"><div class="card pad-lg tac">
        <div style="font-size:2.6rem">${passed ? '🎉' : '💔'}</div>
        <h2 style="margin:.2em 0">${passed ? 'Node complete!' : 'Out of hearts'}</h2>
        <div class="muted">${sm.correct}/${sm.total} correct${passed ? '' : ' — refill hearts by clearing mistake reviews'}</div>
        <div class="row" style="justify-content:center;gap:10px;margin-top:16px">
          <button class="btn" data-review>Review answers</button>
          ${passed ? `<button class="btn primary" onclick="navigate('path')">Continue path →</button>` : `<button class="btn" onclick="navigate('mistakes')">Mistake bank</button><button class="btn primary" onclick="startPathNode(${i})">Retry</button>`}
        </div></div></div>`;
      typeset(host);
      $$('[data-review]', host).forEach((b) => b.onclick = () => reviewSession(sm, {}));
    },
  });
}
