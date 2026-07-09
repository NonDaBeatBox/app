/* =========================================================================
   UI + engine — Vocabulary (Quizlet-style).
   Import (CSV/JSON, multiple named sets), simplified SM-2 spaced repetition,
   daily queue (~40 new + due reviews), mastery tiers, and four game modes:
   flashcards, Learn (adaptive), Match (timed), cloze — plus a quiz generator.
   ========================================================================= */

/* ---------- vocab engine ---------- */
const VOCAB_NEW_PER_DAY = 40;
function cardKey(setId, w) { return setId + '::' + w.toLowerCase(); }
function vocabSeedStarterIfEmpty() {
  if (Object.keys(S.vocab.sets).length) return;
  if (!(typeof VOCAB_STARTER !== 'undefined' && VOCAB_STARTER.length)) return;
  const id = 'starter';
  S.vocab.sets[id] = { id, name: 'Starter SAT Words', createdAt: Date.now(), words: VOCAB_STARTER.map((x) => ({ w: x.w, def: x.def, ex: x.ex || '' })) };
  S.vocab.activeSet = id;
  save();
}
function vocabSets() { return Object.values(S.vocab.sets); }
function activeSet() { const a = S.vocab.activeSet; return S.vocab.sets[a] || vocabSets()[0] || null; }
function setCards(set) { return set ? set.words.map((x) => ({ key: cardKey(set.id, x.w), w: x.w, def: x.def, ex: x.ex, set: set.id })) : []; }
function getSrs(key) {
  let s = S.vocab.srs[key];
  if (!s) { s = S.vocab.srs[key] = { ef: 2.5, interval: 0, due: 0, reps: 0, lapses: 0, new: true }; }
  return s;
}
function vocabTier(s) {
  if (!s || (s.new && s.reps === 0)) return 'New';
  if (s.interval >= 21) return 'Mastered';
  if (s.interval >= 7) return 'Known';
  return 'Learning';
}
// Simplified SM-2. quality: 5 easy, 4 good, 3 hard, <3 fail.
function vocabGrade(key, quality) {
  const s = getSrs(key); s.new = false;
  if (quality < 3) { s.reps = 0; s.interval = 1; s.lapses++; }
  else {
    s.reps++;
    if (s.reps === 1) s.interval = 1;
    else if (s.reps === 2) s.interval = 6;
    else s.interval = Math.round(s.interval * s.ef);
    s.ef = Math.max(1.3, s.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }
  s.due = Date.now() + s.interval * DAY;
  bumpToday('vocab'); markPlanTaskDone('vocab');
  recomputeWordsMastered();
  save();
  return s;
}
function recomputeWordsMastered() {
  let n = 0;
  for (const set of vocabSets()) for (const c of setCards(set)) if (vocabTier(S.vocab.srs[c.key]) === 'Mastered') n++;
  S.counters.wordsMastered = n;
  if (n >= 100) award('vocab100');
}
function ensureVocabDaily() {
  const d = dayKey();
  if (S.vocab.dailyKey !== d) { S.vocab.dailyKey = d; S.vocab.newToday = 0; }
}
function vocabQueue(set) {
  ensureVocabDaily();
  const now = Date.now();
  const cards = setCards(set);
  const due = cards.filter((c) => { const s = S.vocab.srs[c.key]; return s && !s.new && s.due <= now; });
  const fresh = cards.filter((c) => { const s = S.vocab.srs[c.key]; return !s || s.new; });
  const newAllowed = Math.max(0, VOCAB_NEW_PER_DAY - (S.vocab.newToday || 0));
  return { due, fresh: fresh.slice(0, newAllowed), freshTotal: fresh.length };
}
function vocabTierCounts(set) {
  const c = { New: 0, Learning: 0, Known: 0, Mastered: 0 };
  for (const card of setCards(set)) c[vocabTier(S.vocab.srs[card.key])]++;
  return c;
}

/* ---------- import ---------- */
function parseVocabCSV(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue;
    if (/^word\s*,\s*definition/i.test(line)) continue; // header
    const parts = line.split(',');
    if (parts.length < 2) continue;
    const w = parts[0].trim().replace(/^"|"$/g, '');
    const def = parts[1].trim().replace(/^"|"$/g, '');
    const ex = parts.slice(2).join(',').trim().replace(/^"|"$/g, '');
    if (w && def) out.push({ w, def, ex });
  }
  return out;
}
function importVocabSet(name, words) {
  const id = 'set_' + (name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 20) || uid('s'));
  S.vocab.sets[id] = { id, name: name || 'Imported set', createdAt: Date.now(), words };
  S.vocab.activeSet = id;
  save(); recomputeWordsMastered();
  return id;
}

/* ---------- Vocab view ---------- */
registerView('vocab', {
  render() {
    vocabSeedStarterIfEmpty();
    const sets = vocabSets();
    if (!sets.length) return renderVocabEmpty();
    const set = activeSet();
    const q = vocabQueue(set);
    const tc = vocabTierCounts(set);
    const total = set.words.length;
    const best = S.bests.match[set.id];
    return `
    ${pageHeader('Vocabulary', `${set.name} · ${total} words`,
      `<select id="vsel" style="width:auto">${sets.map((s) => `<option value="${s.id}" ${s.id === set.id ? 'selected' : ''}>${esc(s.name)} (${s.words.length})</option>`).join('')}</select>
       <button class="btn sm" onclick="navigate('vocabimport')">＋ Import</button>`)}

    <div class="grid" style="grid-template-columns:1.3fr 1fr">
      <div class="card pad-lg">
        <div class="row spread"><div class="eyebrow">Today’s queue</div><span class="tag">${S.vocab.newToday || 0}/${VOCAB_NEW_PER_DAY} new introduced today</span></div>
        <div class="row" style="gap:24px;margin:12px 0;align-items:baseline">
          <div class="stat"><div class="v" style="color:var(--ace)">${q.due.length}</div><div class="k">due reviews</div></div>
          <div class="stat"><div class="v" style="color:var(--violet-2)">${q.fresh.length}</div><div class="k">new words</div></div>
        </div>
        <button class="btn primary lg block" onclick="startVocabSession()" ${q.due.length + q.fresh.length ? '' : 'disabled'}>
          ${q.due.length + q.fresh.length ? `Study ${q.due.length + q.fresh.length} cards →` : 'All caught up for today 🎉'}</button>
      </div>
      <div class="card">
        <div class="eyebrow">Mastery</div>
        ${['New', 'Learning', 'Known', 'Mastered'].map((t) => {
          const col = { New: 'var(--faint)', Learning: 'var(--sky)', Known: 'var(--violet-2)', Mastered: 'var(--mint)' }[t];
          const w = total ? tc[t] / total * 100 : 0;
          return `<div style="margin:8px 0"><div class="row spread" style="font-size:.85rem"><span>${t}</span><span class="mono">${tc[t]}</span></div>
            <div class="bar" style="margin-top:3px"><span style="width:${w}%;background:${col}"></span></div></div>`;
        }).join('')}
      </div>
    </div>

    <h3 style="margin:22px 0 10px">Practice modes</h3>
    <div class="grid g-4">
      ${vocabModeCard('🃏', 'Flashcards', 'Flip & self-grade', `runVocabMode('flash')`)}
      ${vocabModeCard('🧠', 'Learn', 'Adaptive MC + typing', `runVocabMode('learn')`)}
      ${vocabModeCard('⚡', 'Match', `Timed grid${best ? ' · best ' + fmtClock(best) : ''}`, `runVocabMode('match')`)}
      ${vocabModeCard('✍️', 'Cloze', 'Fill in the blank', `runVocabMode('cloze')`)}
    </div>
    <div class="row" style="margin-top:12px;gap:10px">
      <button class="btn" onclick="runVocabMode('quiz')">📋 Quiz me — 20 mixed questions</button>
      <button class="btn ghost" onclick="manageSets()">Manage sets</button>
    </div>`;
  },
  mount(root) {
    const sel = $('#vsel', root);
    if (sel) sel.onchange = () => { S.vocab.activeSet = sel.value; save(); router(); };
  },
});
function vocabModeCard(icon, name, sub, onclick) {
  return `<div class="card" style="cursor:pointer;text-align:center" onclick="${onclick}">
    <div style="font-size:2rem">${icon}</div><div style="font-weight:700;margin-top:6px">${name}</div><div class="tag">${sub}</div></div>`;
}
function renderVocabEmpty() {
  return `${pageHeader('Vocabulary', 'Import your word list to begin — CSV or JSON.')}
    <div class="card tac" style="padding:44px">
      <div style="font-size:2.4rem">📚</div><h3>No vocabulary sets yet</h3>
      <p class="muted">Import your 1,500-word list (or any set) as CSV <span class="mono">word,definition,example</span> or JSON.</p>
      <button class="btn primary" onclick="navigate('vocabimport')">Import a set →</button>
    </div>`;
}

/* ---------- session dispatch ---------- */
function startVocabSession() {
  const set = activeSet(); if (!set) return navigate('vocabimport');
  const q = vocabQueue(set);
  const cards = shuffle(q.due.concat(q.fresh));
  q.fresh.forEach(() => { S.vocab.newToday = (S.vocab.newToday || 0) + 1; });
  save();
  if (!cards.length) { toast('Nothing due — try a practice mode.', 'sky'); return; }
  runFlashcards(cards, true);
}
function runVocabMode(mode) {
  const set = activeSet(); if (!set) return navigate('vocabimport');
  const cards = setCards(set);
  if (cards.length < 4) { toast('Add at least 4 words to this set first.', 'coral'); return; }
  if (mode === 'flash') runFlashcards(shuffle(cards).slice(0, 20), false);
  else if (mode === 'learn') runLearn(shuffle(cards).slice(0, 12));
  else if (mode === 'match') runMatch(set);
  else if (mode === 'cloze') runCloze(shuffle(cards).slice(0, 12));
  else if (mode === 'quiz') runVocabQuiz(shuffle(cards).slice(0, 20));
}

/* ---------- Flashcards (self-graded, updates SRS) ---------- */
function runFlashcards(cards, isSrs) {
  const host = document.getElementById('view');
  let i = 0, flipped = false;
  function render() {
    if (i >= cards.length) return done();
    const c = cards[i];
    host.innerHTML = `<div class="player">
      ${pageHeader('Flashcards', `${i + 1} / ${cards.length}${isSrs ? ' · daily queue' : ''}`, `<button class="btn ghost sm" onclick="navigate('vocab')">✕ End</button>`)}
      <div class="card pad-lg tac" id="fcard" style="cursor:pointer;min-height:220px;display:flex;flex-direction:column;justify-content:center">
        <div class="eyebrow">${flipped ? 'Definition' : 'Word'}</div>
        <div style="font-family:var(--font-display);font-size:${flipped ? '1.5rem' : '2.4rem'};margin:10px 0">${flipped ? esc(c.def) : esc(c.w)}</div>
        ${flipped && c.ex ? `<div class="muted" style="font-style:italic">“${esc(c.ex)}”</div>` : ''}
        <div class="tag" style="margin-top:14px">${flipped ? '' : 'Click or press Space to flip'}</div>
      </div>
      ${flipped ? `<div class="row" style="justify-content:center;gap:10px;margin-top:16px">
        <button class="btn" style="border-color:var(--coral)" data-g="2">Again</button>
        <button class="btn" data-g="4">Good</button>
        <button class="btn" style="border-color:var(--mint)" data-g="5">Easy</button></div>
        <div class="tag tac" style="margin-top:8px">1 = Again · 2 = Good · 3 = Easy</div>` : ''}
    </div>`;
    const card = $('#fcard', host);
    card.onclick = () => { if (!flipped) { flipped = true; render(); } };
    $$('[data-g]', host).forEach((b) => b.onclick = () => { vocabGrade(c.key, parseInt(b.dataset.g)); i++; flipped = false; render(); });
  }
  function done() {
    host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div style="font-size:2.4rem">🎉</div><h2>Session complete</h2>
      <p class="muted">${cards.length} cards reviewed.</p><button class="btn primary" onclick="navigate('vocab')">Back to vocabulary</button></div></div>`;
    touchStreak();
  }
  function key(e) {
    if (e.key === ' ') { e.preventDefault(); if (!flipped) { flipped = true; render(); } }
    else if (flipped && ['1', '2', '3'].includes(e.key)) { const g = { '1': 2, '2': 4, '3': 5 }[e.key]; vocabGrade(cards[i].key, g); i++; flipped = false; render(); }
  }
  document.addEventListener('keydown', key);
  const obs = new MutationObserver(() => { if (!document.getElementById('fcard') && !document.querySelector('.player')) { document.removeEventListener('keydown', key); obs.disconnect(); } });
  render();
}

/* ---------- Learn (adaptive: MC + typed, repeat until mastered) ---------- */
function runLearn(cards) {
  const host = document.getElementById('view');
  const all = setCards(activeSet());
  const queue = cards.map((c) => ({ c, correct: 0 }));
  let done = 0; const need = 2;
  function next() {
    const pending = queue.filter((q) => q.correct < need);
    if (!pending.length) return finish();
    const item = pending[Math.floor(Math.random() * Math.min(3, pending.length))];
    const typed = item.correct >= 1; // escalate to typed after one MC correct
    render(item, typed);
  }
  function render(item, typed) {
    const c = item.c;
    const learned = queue.filter((q) => q.correct >= need).length;
    let body;
    if (typed) {
      body = `<div class="stem">Type the word that means:</div><div class="card" style="background:var(--midnight);margin-bottom:14px">${esc(c.def)}</div>
        <input type="text" id="lin" placeholder="the word…" autocomplete="off"><div class="tag" style="margin-top:6px">Enter to check</div>`;
    } else {
      const opts = shuffle([c].concat(shuffle(all.filter((x) => x.key !== c.key)).slice(0, 3)));
      body = `<div class="stem">Which word means: <b>${esc(c.def)}</b>?</div>
        <div class="choices">${opts.map((o) => `<div class="choice" data-w="${esc(o.w)}"><span class="txt">${esc(o.w)}</span></div>`).join('')}</div>`;
    }
    host.innerHTML = `<div class="player">
      ${pageHeader('Learn', `${learned} / ${queue.length} learned`, `<button class="btn ghost sm" onclick="navigate('vocab')">✕ End</button>`)}
      <div class="bar" style="margin-bottom:16px"><span style="width:${learned / queue.length * 100}%"></span></div>
      <div class="card pad-lg">${body}</div><div id="lfb"></div></div>`;
    if (typed) {
      const inp = $('#lin', host); inp.focus();
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(item, normalizeWord(inp.value) === normalizeWord(c.w)); });
    } else {
      $$('.choice', host).forEach((el) => el.onclick = () => check(item, el.dataset.w.toLowerCase() === c.w.toLowerCase(), el));
    }
  }
  function check(item, correct, el) {
    const c = item.c;
    if (correct) { item.correct++; vocabGrade(c.key, item.correct >= need ? 5 : 4); }
    else { item.correct = 0; vocabGrade(c.key, 2); }
    $('#lfb', host).innerHTML = `<div class="explain ${correct ? 'correct' : 'wrong'}" style="margin-top:14px">
      <b>${correct ? '✓ Correct' : '✗ ' + esc(c.w)}</b> — ${esc(c.def)}${c.ex ? `<div class="muted" style="font-style:italic;margin-top:6px">“${esc(c.ex)}”</div>` : ''}
      <div style="margin-top:10px"><button class="btn sm primary" id="lnext">Next →</button></div></div>`;
    if (el) { el.classList.add(correct ? 'correct' : 'wrong'); }
    $('#lnext', host).focus();
    $('#lnext', host).onclick = next;
    const kn = (e) => { if (e.key === 'Enter') { e.preventDefault(); document.removeEventListener('keydown', kn); next(); } };
    document.addEventListener('keydown', kn, { once: true });
  }
  function finish() {
    host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div style="font-size:2.4rem">🧠</div><h2>All learned!</h2>
      <p class="muted">${queue.length} words practiced to mastery this session.</p><button class="btn primary" onclick="navigate('vocab')">Done</button></div></div>`;
    touchStreak();
  }
  next();
}
function normalizeWord(s) { return String(s || '').trim().toLowerCase().replace(/[^a-z]/g, ''); }

/* ---------- Match (timed grid, personal best per set) ---------- */
function runMatch(set) {
  const host = document.getElementById('view');
  const chosen = shuffle(setCards(set)).slice(0, 6);
  const tiles = shuffle(chosen.flatMap((c) => [{ id: c.key, t: c.w, kind: 'w' }, { id: c.key, t: c.def, kind: 'd' }]));
  let first = null, matched = 0, start = 0, timerId = null, tenths = 0;
  host.innerHTML = `<div class="player">
    ${pageHeader('Match', 'Pair each word with its definition — fast!', `<span class="mono" id="mtimer" style="font-size:1.2rem">0.0s</span> <button class="btn ghost sm" onclick="navigate('vocab')">✕</button>`)}
    <div class="grid" id="mgrid" style="grid-template-columns:repeat(3,1fr);gap:10px">
      ${tiles.map((t, i) => `<div class="card" data-i="${i}" style="cursor:pointer;min-height:84px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:${t.kind === 'w' ? '1.05rem' : '.82rem'}">${esc(t.t)}</div>`).join('')}
    </div></div>`;
  start = performance.now ? 0 : 0;
  timerId = setInterval(() => { tenths++; const el = $('#mtimer', host); if (el) el.textContent = (tenths / 10).toFixed(1) + 's'; }, 100);
  const els = $$('#mgrid .card', host);
  els.forEach((el) => el.onclick = () => {
    const i = parseInt(el.dataset.i); const tile = tiles[i];
    if (el.classList.contains('done') || el === first) return;
    el.style.borderColor = 'var(--violet)';
    if (!first) { first = el; first._i = i; return; }
    const a = tiles[first._i], b = tile;
    if (a.id === b.id && a.kind !== b.kind) {
      [first, el].forEach((x) => { x.classList.add('done'); x.style.background = 'rgba(47,217,166,.18)'; x.style.borderColor = 'var(--mint)'; x.style.pointerEvents = 'none'; });
      matched++; first = null;
      if (matched === chosen.length) finishMatch();
    } else {
      const f = first; el.style.borderColor = 'var(--coral)'; f.style.borderColor = 'var(--coral)';
      setTimeout(() => { el.style.borderColor = ''; f.style.borderColor = ''; }, 450); first = null;
    }
  });
  function finishMatch() {
    clearInterval(timerId);
    const secs = tenths / 10;
    const prev = S.bests.match[set.id];
    const isBest = !prev || secs < prev;
    if (isBest) { S.bests.match[set.id] = secs; save(); }
    touchStreak();
    host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div style="font-size:2.4rem">⚡</div>
      <h2>${secs.toFixed(1)} seconds</h2>${isBest ? '<div class="pill gold">🏆 New personal best!</div>' : `<div class="muted">Personal best: ${fmtClock(prev)}</div>`}
      <div class="row" style="justify-content:center;gap:10px;margin-top:16px"><button class="btn" onclick="runMatch(activeSet())">Again</button><button class="btn primary" onclick="navigate('vocab')">Done</button></div></div></div>`;
  }
}

/* ---------- Cloze (word blanked from a sentence) ---------- */
function runCloze(cards) {
  const host = document.getElementById('view');
  let i = 0;
  function render() {
    if (i >= cards.length) return done();
    const c = cards[i];
    let sentence = c.ex && new RegExp(c.w, 'i').test(c.ex)
      ? c.ex.replace(new RegExp('\\b' + c.w + '\\w*', 'i'), '_____')
      : `Someone described as _____ is best defined as: “${c.def}.”`;
    host.innerHTML = `<div class="player">
      ${pageHeader('Cloze', `${i + 1} / ${cards.length}`, `<button class="btn ghost sm" onclick="navigate('vocab')">✕ End</button>`)}
      <div class="card pad-lg"><div class="stem">Fill in the blank:</div>
        <div class="passage">${esc(sentence)}</div>
        <input type="text" id="czin" placeholder="the missing word…" autocomplete="off"><div class="tag" style="margin-top:6px">Hint: ${esc(c.def)}</div></div>
      <div id="czfb"></div></div>`;
    const inp = $('#czin', host); inp.focus();
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(c, normalizeWord(inp.value) === normalizeWord(c.w)); });
  }
  function check(c, correct) {
    vocabGrade(c.key, correct ? 4 : 2);
    $('#czfb', host).innerHTML = `<div class="explain ${correct ? 'correct' : 'wrong'}" style="margin-top:14px"><b>${correct ? '✓ Correct' : '✗ Answer: ' + esc(c.w)}</b> — ${esc(c.def)}
      <div style="margin-top:10px"><button class="btn sm primary" id="cznext">Next →</button></div></div>`;
    const b = $('#cznext', host); b.focus(); b.onclick = () => { i++; render(); };
  }
  function done() {
    host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div style="font-size:2.4rem">✍️</div><h2>Cloze complete</h2><button class="btn primary" onclick="navigate('vocab')">Done</button></div></div>`;
    touchStreak();
  }
  render();
}

/* ---------- Quiz me (20 mixed MC) ---------- */
function runVocabQuiz(cards) {
  const host = document.getElementById('view');
  const all = setCards(activeSet());
  let i = 0, correct = 0;
  function render() {
    if (i >= cards.length) return done();
    const c = cards[i];
    const wordToDef = Math.random() < 0.5;
    const pool = shuffle(all.filter((x) => x.key !== c.key)).slice(0, 3);
    const opts = shuffle([c].concat(pool));
    host.innerHTML = `<div class="player">
      ${pageHeader('Vocab quiz', `${i + 1} / ${cards.length} · ${correct} correct`, `<button class="btn ghost sm" onclick="navigate('vocab')">✕ End</button>`)}
      <div class="bar" style="margin-bottom:16px"><span style="width:${i / cards.length * 100}%"></span></div>
      <div class="card pad-lg"><div class="stem">${wordToDef ? `What does <b>${esc(c.w)}</b> mean?` : `Which word means: <b>${esc(c.def)}</b>?`}</div>
        <div class="choices">${opts.map((o) => `<div class="choice" data-k="${o.key}"><span class="txt">${esc(wordToDef ? o.def : o.w)}</span></div>`).join('')}</div></div>
      <div id="qzfb"></div></div>`;
    $$('.choice', host).forEach((el) => el.onclick = () => {
      const ok = el.dataset.k === c.key;
      if (ok) correct++;
      vocabGrade(c.key, ok ? 4 : 2);
      $$('.choice', host).forEach((x) => { x.style.pointerEvents = 'none'; if (x.dataset.k === c.key) x.classList.add('correct'); else if (x === el) x.classList.add('wrong'); });
      $('#qzfb', host).innerHTML = `<div class="tac" style="margin-top:14px"><button class="btn primary" id="qznext">${i + 1 >= cards.length ? 'See score' : 'Next →'}</button></div>`;
      const b = $('#qznext', host); b.focus(); b.onclick = () => { i++; render(); };
    });
  }
  function done() {
    const acc = Math.round(correct / cards.length * 100);
    host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div class="eyebrow">Quiz complete</div>
      <div class="stat" style="align-items:center;margin:10px 0"><div class="v" style="font-size:3rem">${acc}%</div><div class="muted">${correct} of ${cards.length} correct</div></div>
      <div class="row" style="justify-content:center;gap:10px"><button class="btn" onclick="runVocabMode('quiz')">Again</button><button class="btn primary" onclick="navigate('vocab')">Done</button></div></div></div>`;
    touchStreak();
  }
  render();
}

/* ---------- set management + import screen ---------- */
function manageSets() {
  const sets = vocabSets();
  const host = openModal(`<h3>Manage sets</h3><div class="stack" id="msets" style="max-height:60vh;overflow:auto"></div>
    <div class="row" style="justify-content:space-between;margin-top:14px"><button class="btn" onclick="navigate('vocabimport')">＋ Import new</button><button class="btn ghost" data-close>Close</button></div>`);
  $('#msets', host.el).innerHTML = sets.map((s) => `<div class="row spread card" style="padding:10px">
    <div><b>${esc(s.name)}</b><div class="tag">${s.words.length} words</div></div>
    <button class="btn sm" style="border-color:var(--coral);color:var(--coral)" data-del="${s.id}">Delete</button></div>`).join('') || '<div class="muted">No sets.</div>';
  host.el.querySelector('[data-close]').onclick = host.close;
  $$('[data-del]', host.el).forEach((b) => b.onclick = () => confirmModal('Delete set?', `Remove “${esc(S.vocab.sets[b.dataset.del].name)}” and its progress?`, () => { delete S.vocab.sets[b.dataset.del]; if (S.vocab.activeSet === b.dataset.del) S.vocab.activeSet = vocabSets()[0]?.id || null; save(); host.close(); router(); }, 'Delete', 'ghost'));
}

registerView('vocabimport', {
  render() {
    return `${pageHeader('Import vocabulary', 'Paste CSV or JSON. CSV format: word,definition,example (one per line).',
      `<button class="btn ghost" onclick="navigate('vocab')">← Back</button>`)}
    <div class="grid g-2" style="align-items:start">
      <div class="card">
        <label class="fld"><span>Set name</span><input type="text" id="vname" placeholder="e.g. My 1500 List" value="My List"></label>
        <label class="fld"><span>Data (CSV or JSON)</span><textarea id="vdata" rows="14" placeholder="ambiguous,unclear or open to interpretation,Her ambiguous answer confused us.&#10;candid,honest and direct,He gave a candid review."></textarea></label>
        <div class="row" style="gap:8px"><button class="btn primary" id="vimport">Import</button><button class="btn" id="vfile">Upload file</button><input type="file" id="vfilei" accept=".csv,.json,.txt" class="hidden"></div>
        <div id="vmsg" class="tag" style="margin-top:8px"></div>
      </div>
      <div class="card"><h3 style="margin-top:0">Formats</h3>
        <p class="muted" style="font-size:.88rem"><b>CSV</b> — one word per line: <span class="mono">word,definition,example</span>. The example is optional. A header row <span class="mono">word,definition,example</span> is skipped automatically.</p>
        <p class="muted" style="font-size:.88rem"><b>JSON</b> — an array like <span class="mono">[{"w":"candid","def":"honest","ex":"a candid reply"}]</span> (keys <span class="mono">word/definition/example</span> also accepted).</p>
        <p class="muted" style="font-size:.88rem">Built for large lists — paste all 1,500 at once. Each set keeps its own spaced-repetition progress.</p>
      </div>
    </div>`;
  },
  mount(root) {
    const doImport = (text) => {
      const name = $('#vname', root).value.trim() || 'Imported set';
      let words = [];
      const t = text.trim();
      if (t.startsWith('[') || t.startsWith('{')) {
        try { const arr = JSON.parse(t); words = (Array.isArray(arr) ? arr : []).map((x) => ({ w: (x.w || x.word || '').trim(), def: (x.def || x.definition || '').trim(), ex: (x.ex || x.example || '').trim() })).filter((x) => x.w && x.def); }
        catch (e) { return msg('Invalid JSON: ' + e.message, true); }
      } else words = parseVocabCSV(text);
      if (!words.length) return msg('No valid rows found. Check the format.', true);
      importVocabSet(name, words);
      toast(`Imported ${words.length} words`, 'mint');
      navigate('vocab');
    };
    const msg = (m, bad) => { const el = $('#vmsg', root); el.textContent = m; el.style.color = bad ? 'var(--coral)' : 'var(--mint)'; };
    $('#vimport', root).onclick = () => doImport($('#vdata', root).value);
    $('#vfile', root).onclick = () => $('#vfilei', root).click();
    $('#vfilei', root).onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('#vdata', root).value = r.result; if (!$('#vname', root).value || $('#vname', root).value === 'My List') $('#vname', root).value = f.name.replace(/\.[^.]+$/, ''); }; r.readAsText(f); };
  },
});
