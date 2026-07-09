/* =========================================================================
   UI — Sable, the command assistant. Floating orb + Cmd/Ctrl+K command bar,
   a chat panel, rule-based answers with no API key, and full tool-use chat
   with a key. Voice mode via the browser's Web Speech APIs.
   Personality: calm, dry, hyper-competent — an AI butler for your prep.
   ========================================================================= */

/* Live state handed to Sable on every request so it actually knows your prep. */
function sableContext() {
  const proj = projectedScore();
  const weak = weakestSkills(4).map((s) => ({ skill: s.name, id: s.id, mastery: Math.round(getMastery(s.id)) }));
  const li = levelInfo();
  return {
    projected: proj, target: 1600,
    daysUntilTest: daysUntilTest(),
    streak: S.streak.count, level: li.level, title: li.title, xp: S.xp,
    weeklyXP: S.weekly.xp, weeklyGoal: S.weekly.goal,
    sectionMastery: { rw: Math.round(sectionMastery('rw')), math: Math.round(sectionMastery('math')) },
    weakestSkills: weak,
    mistakesDue: dueMistakes().length, mistakesTotal: allMistakes().length,
    answeredAllTime: S.stats.answered, accuracyAllTime: S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0,
    today: { answered: S.today?.answered || 0, correct: S.today?.correct || 0 },
    questComplete: questComplete(),
    diagnosticDone: S.diagnostic.done, mocksDone: S.counters.mocksDone,
    vocabSets: Object.keys(S.vocab.sets).length,
  };
}
function SABLE_SYSTEM() {
  const name = S.settings.assistantName;
  return `You are ${name}, the command assistant inside "Ace", a personal Digital SAT trainer used by one student aiming for a perfect 1600.
Persona: calm, dry, hyper-competent, quietly witty — an AI butler. Concise. Never sycophantic. You address the student directly.
You have their LIVE state as JSON below. Use real numbers from it; never invent stats. Scores are ESTIMATES — say so when it matters.
When the student asks you to DO something (start a drill, mock, vocab session, open a lesson, add a plan task), CALL THE MATCHING TOOL rather than only describing it. Prefer action.
Keep replies to a few sentences unless asked for depth. Use plain text (this renders in a small panel).

LIVE STATE:
${JSON.stringify(sableContext(), null, 0)}`;
}

/* Client-side tools Sable can call. */
const SABLE_TOOLS = [
  { name: 'startDrill', description: 'Start a practice drill. Optionally target a skill id, a section (math|rw), and/or difficulty (1-3).',
    input_schema: { type: 'object', properties: { skill: { type: 'string' }, section: { type: 'string', enum: ['math', 'rw'] }, difficulty: { type: 'integer' }, count: { type: 'integer' } } } },
  { name: 'startVocabSession', description: 'Open the vocabulary study session (daily SRS queue).', input_schema: { type: 'object', properties: {} } },
  { name: 'startMock', description: 'Start a full-length adaptive mock exam.', input_schema: { type: 'object', properties: {} } },
  { name: 'openLesson', description: 'Open the Learn lesson for a given skill id.', input_schema: { type: 'object', properties: { skill: { type: 'string' } }, required: ['skill'] } },
  { name: 'getStats', description: 'Get detailed current stats for a scope: overall|math|rw|mastery|plan.', input_schema: { type: 'object', properties: { scope: { type: 'string' } } } },
  { name: 'addToPlan', description: 'Add a custom task to the study plan / daily quest.', input_schema: { type: 'object', properties: { task: { type: 'string' } }, required: ['task'] } },
];
function runSableTool(name, input) {
  switch (name) {
    case 'startDrill': { const opts = { limit: input.count || 10 }; if (input.skill && SKILL_BY_ID[input.skill]) opts.skill = input.skill; if (input.section) opts.section = input.section; if (input.difficulty) opts.difficulty = input.difficulty; Sable.closePanel(); startDrill(opts); return { ok: true, started: opts }; }
    case 'startVocabSession': { Sable.closePanel(); navigate('vocab'); return { ok: true }; }
    case 'startMock': { Sable.closePanel(); navigate('mocks'); if (typeof startMock === 'function') setTimeout(startMock, 30); return { ok: true }; }
    case 'openLesson': { if (!SKILL_BY_ID[input.skill]) return { ok: false, error: 'unknown skill' }; Sable.closePanel(); navigate('learn', { skill: input.skill }); return { ok: true }; }
    case 'getStats': return { ok: true, stats: sableContext() };
    case 'addToPlan': { generatePlan(); S.plan.tasks.push({ id: uid('t'), type: 'custom', label: input.task, done: false }); const q = getDailyQuest(); if (q.items.length < 5) q.items.push({ id: uid('t'), type: 'custom', label: input.task, done: false }); save(); return { ok: true }; }
    default: return { ok: false, error: 'unknown tool' };
  }
}

/* ---------- The Sable object (panel, command bar, chat, voice) ---------- */
const Sable = (() => {
  let panel = null, history = [], voiceReady = false, recog = null, listening = false, chosenVoice = null;

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'sable-panel';
    panel.innerHTML = `
      <div class="sable-head">
        <div class="av"></div>
        <div style="flex:1"><div style="font-weight:700">${esc(S.settings.assistantName)}</div><div class="tag" id="sableSub">at your service</div></div>
        ${'speechSynthesis' in window ? `<button class="btn sm ghost" id="sableVoiceBtn" title="Toggle voice">${S.settings.voice ? '🔊' : '🔇'}</button>` : ''}
        <button class="btn sm ghost" id="sableClose">✕</button>
      </div>
      <div class="sable-msgs" id="sableMsgs"></div>
      <div class="sable-foot">
        <div class="row wrap" id="sableChips" style="gap:6px;margin-bottom:8px"></div>
        <div class="row">
          <input type="text" id="sableIn" placeholder="${aiConfigured() ? 'Ask ' + esc(S.settings.assistantName) + '…' : 'Ask about your stats…'}" autocomplete="off">
          ${('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? `<button class="btn" id="sableMic" title="Speak">🎤</button>` : ''}
          <button class="btn primary" id="sableSend">➤</button>
        </div>
      </div>`;
    document.body.appendChild(panel);
    $('#sableClose', panel).onclick = closePanel;
    $('#sableSend', panel).onclick = () => submit();
    $('#sableIn', panel).addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    const vb = $('#sableVoiceBtn', panel); if (vb) vb.onclick = toggleVoiceMode;
    const mic = $('#sableMic', panel); if (mic) mic.onclick = toggleListen;
    renderChips();
    if (!history.length) greet();
    return panel;
  }

  function greet() {
    pushMsg('sable', templateBriefing());
  }
  function renderChips() {
    const chips = [
      ['What should I work on?', 'work'],
      ['Am I on pace for 1600?', 'pace'],
      ['How am I trending in math?', 'math'],
      ['Review my mistakes', 'mistakes'],
    ];
    const host = $('#sableChips', panel);
    host.innerHTML = chips.map(([t, k]) => `<button class="btn sm ghost" data-chip="${k}">${esc(t)}</button>`).join('');
    $$('[data-chip]', host).forEach((b) => b.onclick = () => { $('#sableIn', panel).value = b.textContent; submit(); });
  }

  function pushMsg(who, text) {
    history.push({ who, text });
    const box = $('#sableMsgs', panel);
    const el = document.createElement('div');
    el.className = 'bub ' + (who === 'me' ? 'me' : who === 'tool' ? 'tool' : 'sable');
    el.innerHTML = (who === 'sable' ? `<div class="who">${esc(S.settings.assistantName)}</div>` : '') + mathToHtml(text);
    box.appendChild(el); typeset(el); box.scrollTop = box.scrollHeight;
    if (who === 'sable' && S.settings.voice) speak(text);
    return el;
  }
  function setSub(t) { const s = $('#sableSub', panel); if (s) s.textContent = t; }

  async function submit() {
    const inp = $('#sableIn', panel); const text = inp.value.trim(); if (!text) return;
    inp.value = ''; pushMsg('me', text);
    // Try a rule-based answer first (works with no key); if AI available, prefer it for freeform.
    if (!aiConfigured()) { pushMsg('sable', ruleBasedAnswer(text)); return; }
    setSub('thinking…'); orbBusy(true);
    try { await chatWithTools(text); } catch (e) { pushMsg('sable', 'I hit a snag: ' + e.message); }
    setSub('at your service'); orbBusy(false);
  }

  // Full tool-use loop against the Messages API.
  async function chatWithTools(userText) {
    const messages = history.filter((m) => m.who === 'me' || m.who === 'sable')
      .slice(-8).map((m) => ({ role: m.who === 'me' ? 'user' : 'assistant', content: m.text }));
    // ensure the latest user turn is present
    if (!messages.length || messages[messages.length - 1].role !== 'user') messages.push({ role: 'user', content: userText });
    let guard = 0;
    while (guard++ < 5) {
      const data = await aiCall({ system: SABLE_SYSTEM(), messages, tools: SABLE_TOOLS, max_tokens: 900, temperature: 0.6 });
      const blocks = data.content || [];
      const text = blocks.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
      const toolUses = blocks.filter((b) => b.type === 'tool_use');
      if (text) pushMsg('sable', text);
      if (!toolUses.length || data.stop_reason !== 'tool_use') return;
      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const tu of toolUses) {
        const out = runSableTool(tu.name, tu.input || {});
        pushMsg('tool', `↳ ${tu.name}(${JSON.stringify(tu.input || {})})`);
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(out) });
      }
      messages.push({ role: 'user', content: results });
    }
  }

  // Rule-based answers (no API key) — canned but data-driven.
  function ruleBasedAnswer(q) {
    const t = q.toLowerCase();
    const ctx = sableContext();
    if (/pace|1600|on track|track|ready/.test(t)) {
      const gap = 1600 - ctx.projected.total;
      const dd = ctx.daysUntilTest;
      return `Projected total is about ${ctx.projected.total} — roughly ${gap} shy of 1600 (an estimate). ` +
        (dd != null ? `${dd} days remain. ` : 'No test date set. ') +
        `Close the gap where it's cheapest: ${ctx.weakestSkills.slice(0, 2).map((w) => w.skill).join(' and ')}.`;
    }
    if (/math/.test(t)) return `Math mastery averages ${ctx.sectionMastery.math}/100, projecting about ${ctx.projected.math}. Weakest math skill on file: ${weakestSkills(1, 'math')[0]?.name || '—'}. Shall I run a drill? Type: drill math.`;
    if (/reading|writing|\brw\b|verbal|english/.test(t)) return `Reading & Writing mastery averages ${ctx.sectionMastery.rw}/100, projecting about ${ctx.projected.rw}. Weakest: ${weakestSkills(1, 'rw')[0]?.name || '—'}.`;
    if (/work on|study|focus|today|next|should/.test(t)) return `Today I'd focus on ${ctx.weakestSkills.slice(0, 2).map((w) => `${w.skill} (${w.mastery})`).join(' and ')}. ${ctx.mistakesDue ? `You also have ${ctx.mistakesDue} mistakes due. ` : ''}Say "drill" and I'll start one.`;
    if (/mistake/.test(t)) { closePanel(); navigate('mistakes'); return `Opening your mistake bank — ${ctx.mistakesDue} due now.`; }
    if (/drill/.test(t)) { const sec = /math/.test(t) ? 'math' : /read|writ|rw/.test(t) ? 'rw' : null; closePanel(); startDrill(sec ? { section: sec, limit: 10 } : { skill: weakestSkills(1)[0].id, limit: 10 }); return 'Starting a drill.'; }
    if (/streak/.test(t)) return `Your streak is ${ctx.streak} days. ${ctx.questComplete ? 'Today is already secured.' : 'Finish today\'s quest to extend it.'}`;
    if (/vocab|word/.test(t)) { closePanel(); navigate('vocab'); return 'Opening vocabulary.'; }
    if (/mock|exam|test/.test(t)) { closePanel(); navigate('mocks'); return 'Heading to mock exams.'; }
    if (/level|xp/.test(t)) return `You're level ${ctx.level} — ${ctx.title} — with ${ctx.xp} XP. Weekly: ${ctx.weeklyXP}/${ctx.weeklyGoal}.`;
    if (/hello|hi|hey|help/.test(t)) return `At your service. Ask about your pace, what to work on, or say "drill math". For freeform conversation, add an API key in Settings.`;
    return `Without an API key I answer from your stats only. Try: "what should I work on", "am I on pace for 1600", "drill math", or "review my mistakes". Add a key in Settings for full conversation.`;
  }

  /* ---------- voice ---------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices();
    const prefer = ['Daniel', 'Google UK English Male', 'Arthur', 'Oliver', 'Microsoft Ryan', 'en-GB'];
    for (const p of prefer) { const v = vs.find((x) => x.name.includes(p) || x.lang === p); if (v) return v; }
    return vs.find((x) => /en/i.test(x.lang)) || vs[0] || null;
  }
  function speak(text) {
    if (!('speechSynthesis' in window) || !S.settings.voice) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/[*_#`$]/g, '')); chosenVoice = chosenVoice || pickVoice(); if (chosenVoice) u.voice = chosenVoice; u.rate = 1.0; u.pitch = 0.9; speechSynthesis.speak(u); } catch (e) { }
  }
  function initVoice() {
    if ('speechSynthesis' in window) { chosenVoice = pickVoice(); if (!chosenVoice) speechSynthesis.onvoiceschanged = () => { chosenVoice = pickVoice(); }; }
  }
  function toggleVoiceMode() { S.settings.voice = !S.settings.voice; save(true); const b = $('#sableVoiceBtn', panel); if (b) b.textContent = S.settings.voice ? '🔊' : '🔇'; if (S.settings.voice) { initVoice(); speak('Voice enabled.'); } else speechSynthesis.cancel(); }
  function toggleListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return toast('Speech input not available in this browser.', 'coral');
    if (listening) { recog && recog.stop(); return; }
    try {
      recog = new SR(); recog.lang = 'en-US'; recog.interimResults = false; recog.maxAlternatives = 1;
      listening = true; const mic = $('#sableMic', panel); if (mic) mic.textContent = '⏹️';
      recog.onresult = (e) => { const txt = e.results[0][0].transcript; $('#sableIn', panel).value = txt; };
      recog.onend = () => { listening = false; const m = $('#sableMic', panel); if (m) m.textContent = '🎤'; if ($('#sableIn', panel).value.trim()) submit(); };
      recog.onerror = () => { listening = false; const m = $('#sableMic', panel); if (m) m.textContent = '🎤'; toast('Mic error — if on file://, use typed input.', 'coral'); };
      recog.start();
    } catch (e) { toast('Speech input blocked (common on file://). Type instead.', 'coral'); listening = false; }
  }

  function orbBusy(on) { const o = document.getElementById('sableOrb'); if (o) o.classList.toggle('busy', on); }
  function openPanel() { ensurePanel(); panel.classList.add('open'); setTimeout(() => $('#sableIn', panel)?.focus(), 60); }
  function closePanel() { if (panel) panel.classList.remove('open'); }
  function togglePanel() { ensurePanel(); panel.classList.contains('open') ? closePanel() : openPanel(); }
  function ask(text) { openPanel(); $('#sableIn', panel).value = text; submit(); }

  return { togglePanel, openPanel, closePanel, ask, initVoice, speak, ensurePanel, _rule: ruleBasedAnswer };
})();

/* ---------- Command bar (Cmd/Ctrl+K) ---------- */
const CommandBar = (() => {
  let overlay = null, actions = [], hi = 0, filtered = [];
  function baseActions() {
    const nav = NAV.map((n) => ({ icon: n.icon, t: n.label, d: 'Go to ' + n.label, run: () => navigate(n.route) }));
    const acts = [
      { icon: '🎯', t: 'Drill weakest skill', d: 'Targeted practice', run: () => startDrill({ skill: weakestSkills(1)[0].id, limit: 10 }) },
      { icon: '🎲', t: 'Mixed drill', d: '10 mixed questions', run: () => startDrill({ mixed: true, limit: 10 }) },
      { icon: '🧮', t: 'Drill Math', d: 'All math skills', run: () => startDrill({ section: 'math', limit: 10 }) },
      { icon: '✍️', t: 'Drill Reading & Writing', d: 'All RW skills', run: () => startDrill({ section: 'rw', limit: 10 }) },
      { icon: '💀', t: 'Extreme mode', d: 'Hardest questions', run: () => navigate('extreme') },
      { icon: '📝', t: 'Start a mock exam', d: 'Full adaptive test', run: () => navigate('mocks') },
      { icon: '🧭', t: 'Take the diagnostic', d: 'Seed your plan', run: () => navigate('diagnostic') },
      { icon: '🩹', t: 'Review mistakes', d: 'Spaced retry queue', run: () => navigate('mistakes') },
      { icon: '💬', t: 'Ask ' + S.settings.assistantName, d: 'Open the assistant', run: () => Sable.openPanel() },
      { icon: '✨', t: 'Study Studio', d: 'Notes → flashcards or quiz (AI)', run: () => navigate('studio') },
    ];
    return acts.concat(nav);
  }
  function open() {
    close();
    actions = baseActions();
    overlay = document.createElement('div');
    overlay.className = 'cmd-overlay';
    overlay.innerHTML = `<div class="cmd"><div class="cmd-in"><span class="dot"></span><input id="cmdIn" placeholder="Type a command or ask ${esc(S.settings.assistantName)}…" autocomplete="off"></div>
      <div class="cmd-body" id="cmdBody"></div>
      <div class="cmd-hint"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> run</span><span><kbd>esc</kbd> close</span>${aiConfigured() ? '<span>type a question, then ↵ to ask</span>' : ''}</div></div>`;
    document.body.appendChild(overlay);
    const inp = $('#cmdIn', overlay);
    inp.addEventListener('input', () => refresh(inp.value));
    inp.addEventListener('keydown', onKey);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    refresh('');
    setTimeout(() => inp.focus(), 30);
  }
  function refresh(q) {
    hi = 0;
    const query = q.trim().toLowerCase();
    filtered = !query ? actions : actions.filter((a) => (a.t + ' ' + a.d).toLowerCase().includes(query));
    const body = $('#cmdBody', overlay);
    let html = filtered.slice(0, 8).map((a, i) => `<div class="cmd-act ${i === hi ? 'hi' : ''}" data-i="${i}"><span class="ico">${a.icon}</span><div><div class="t">${esc(a.t)}</div><div class="d">${esc(a.d)}</div></div></div>`).join('');
    if (query && aiConfigured()) html = `<div class="cmd-act ask ${filtered.length === 0 ? 'hi' : ''}" data-ask="1"><span class="ico">💬</span><div><div class="t">Ask ${esc(S.settings.assistantName)}: “${esc(q)}”</div><div class="d">Freeform — Sable can act on it</div></div></div>` + html;
    body.innerHTML = html || `<div class="muted" style="padding:14px">No matches. ${aiConfigured() ? '' : 'Add an API key to ask freeform questions.'}</div>`;
    $$('.cmd-act', body).forEach((el) => el.onclick = () => { if (el.dataset.ask) { const v = $('#cmdIn', overlay).value; close(); Sable.ask(v); } else run(parseInt(el.dataset.i)); });
  }
  function onKey(e) {
    const items = $$('.cmd-act', overlay);
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(items.length - 1, hi + 1); paint(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(0, hi - 1); paint(items); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const el = items[hi];
      if (el && el.dataset.ask) { const v = $('#cmdIn', overlay).value; close(); Sable.ask(v); }
      else { const askOffset = ($('#cmdIn', overlay).value.trim() && aiConfigured()) ? 1 : 0; run(hi - askOffset); }
    }
  }
  function paint(items) { items.forEach((el, i) => el.classList.toggle('hi', i === hi)); }
  function run(i) { const a = filtered[i]; close(); if (a) a.run(); }
  function close() { if (overlay) { overlay.remove(); overlay = null; } }
  function toggle() { overlay ? close() : open(); }
  return { open, close, toggle };
})();

/* AI facade used by the question player's tutor buttons. */
const AI = {
  enabled: () => aiConfigured(),
  async tutorAction(kind, q) {
    const out = document.getElementById('tutorOut'); if (!out) return;
    out.innerHTML = `<div class="tag" style="margin-top:8px">${esc(S.settings.assistantName)} is thinking…</div>`;
    try {
      if (kind === 'explain') {
        const t = await aiText(SABLE_SYSTEM(), `Explain this SAT question in a different, simpler way than the official explanation. Be concrete and brief.\n\nQuestion: ${q.stem}\n${q.choices ? 'Choices: ' + q.choices.map((c, i) => LETTERS[i] + ') ' + c).join('  ') : ''}\nCorrect answer: ${[].concat(q.answer)[0]}\nOfficial explanation: ${q.explanation}`, { max_tokens: 500 });
        out.innerHTML = `<div class="explain" style="margin-top:10px"><div class="who" style="color:var(--ace);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em">${esc(S.settings.assistantName)} · another angle</div>${mathToHtml(t)}</div>`; typeset(out);
      } else if (kind === 'similar') {
        out.innerHTML = `<div class="tag" style="margin-top:8px">Generating 3 similar questions…</div>`;
        const n = await AI.generateSimilar(q, 3);
        out.innerHTML = `<div class="explain" style="margin-top:10px">Added <b>${n}</b> AI-generated question${n === 1 ? '' : 's'} on ${esc(SKILL_BY_ID[q.skill].name)} to your drills. <button class="btn sm" onclick="navigate('drills',{skill:'${q.skill}'})">Drill them →</button></div>`;
      } else if (kind === 'chat') {
        Sable.ask(`Coach me through this question without giving the answer away immediately: "${q.stem}". I answered ${q.type === 'spr' ? 'wrong' : ''}. The correct answer is ${[].concat(q.answer)[0]}.`);
      }
    } catch (e) { out.innerHTML = `<div class="tag" style="color:var(--coral);margin-top:8px">${esc(e.message)}</div>`; }
  },
  async notesToFlashcards(notes) {
    const t = await aiText('You are a study aide. Output valid JSON only.',
      `From these notes, extract the key terms and produce vocabulary flashcards. Return ONLY a JSON array like [{"w":"term","def":"concise definition","ex":"a short example sentence"}]. 8–20 cards.\n\nNOTES:\n${notes}`, { max_tokens: 1500, temperature: 0.4 });
    let arr; try { arr = JSON.parse(t.replace(/^```json?/i, '').replace(/```$/, '').trim()); } catch (e) { throw new Error('Could not parse the generated cards.'); }
    const words = arr.map((x) => ({ w: (x.w || x.term || '').trim(), def: (x.def || x.definition || '').trim(), ex: (x.ex || x.example || '').trim() })).filter((x) => x.w && x.def);
    if (!words.length) throw new Error('No cards found in the notes.');
    importVocabSet('From notes · ' + new Date().toLocaleDateString(), words);
    return words.length;
  },
  async notesToQuiz(notes) {
    const t = await aiText('You are a study aide and item writer. Output valid JSON only.',
      `From these notes, write 8 multiple-choice quiz questions that test understanding. Return ONLY a JSON array like [{"stem":"...","choices":["a","b","c","d"],"answer":"B","explanation":"why"}]. answer is the correct letter A–D.\n\nNOTES:\n${notes}`, { max_tokens: 1800, temperature: 0.5 });
    let arr; try { arr = JSON.parse(t.replace(/^```json?/i, '').replace(/```$/, '').trim()); } catch (e) { throw new Error('Could not parse the generated quiz.'); }
    return arr.filter((q) => q.stem && Array.isArray(q.choices) && q.answer);
  },
  async generateSimilar(q, count = 3) {
    const schema = `Return ONLY a JSON array of ${count} objects, no prose. Each: {"skill":"${q.skill}","difficulty":${q.difficulty === 'extreme' ? '"extreme"' : q.difficulty},"type":"${q.type}","stem":"...","choices":["a","b","c","d"](omit for spr),"answer":"${q.type === 'mcq' ? 'A-D letter' : 'numeric string'}","explanation":"full worked solution + why wrong choices are wrong"}. Use $...$ for math.`;
    const t = await aiText('You are an expert Digital SAT item writer. Output valid JSON only.', `Write ${count} NEW questions similar to this one (same skill and difficulty), original stems:\n\n${q.stem}\n\n${schema}`, { max_tokens: 1600, temperature: 0.9 });
    let arr; try { arr = JSON.parse(t.replace(/^```json?/i, '').replace(/```$/, '').trim()); } catch (e) { throw new Error('Could not parse generated questions.'); }
    let added = 0;
    for (const item of arr) {
      const id = 'AI_' + uid('q');
      if (!item.stem || item.answer == null) continue;
      S.ai.questions.push(Object.assign({ id, skill: q.skill, difficulty: q.difficulty, type: q.type }, item, { id, aiGenerated: true }));
      added++;
    }
    if (added) { save(true); buildBank(); }
    return added;
  },
};

/* ---------- Studio: notes → study material (AI) ---------- */
registerView('studio', {
  render() {
    if (!aiConfigured()) return `${pageHeader('Study Studio', 'Turn your class notes into flashcards or a quiz — powered by AI.')}
      <div class="card tac" style="padding:40px"><div style="font-size:2.2rem">✨</div><h3>Add your API key to unlock</h3>
      <p class="muted">Paste an Anthropic API key in Settings to generate flashcards and quizzes from your notes.</p>
      <button class="btn primary" onclick="navigate('settings')">Open Settings →</button></div>`;
    return `${pageHeader('Study Studio', 'Paste class notes or a passage; ' + esc(S.settings.assistantName) + ' turns them into study material.',
      `<button class="btn ghost sm" onclick="navigate('learn')">← Learn</button>`)}
      <div class="card">
        <label class="fld"><span>Your notes</span><textarea id="notesIn" rows="12" placeholder="Paste lecture notes, a textbook section, or a vocab list…"></textarea></label>
        <div class="row" style="gap:10px"><button class="btn primary" id="mkCards">🃏 Make flashcards</button><button class="btn" id="mkQuiz">📋 Make a quiz</button></div>
        <div id="studioMsg" class="tag" style="margin-top:10px"></div>
      </div>`;
  },
  mount(root) {
    const msg = (m, bad) => { const el = $('#studioMsg', root); el.textContent = m; el.style.color = bad ? 'var(--coral)' : 'var(--muted)'; };
    $('#mkCards', root).onclick = async () => {
      const notes = $('#notesIn', root).value.trim(); if (notes.length < 20) return msg('Paste a bit more text first.', true);
      msg('Generating flashcards…'); try { const n = await AI.notesToFlashcards(notes); toast(`Created a ${n}-card set`, 'mint'); navigate('vocab'); } catch (e) { msg(e.message, true); }
    };
    $('#mkQuiz', root).onclick = async () => {
      const notes = $('#notesIn', root).value.trim(); if (notes.length < 20) return msg('Paste a bit more text first.', true);
      msg('Writing a quiz…'); try { const qs = await AI.notesToQuiz(notes); if (!qs.length) return msg('No questions generated.', true); runNotesQuiz(qs); } catch (e) { msg(e.message, true); }
    };
  },
});
// Self-contained quiz over AI-generated note questions (no engine side effects).
function runNotesQuiz(questions) {
  const host = document.getElementById('view');
  let i = 0, correct = 0;
  function render() {
    if (i >= questions.length) { host.innerHTML = `<div class="player"><div class="card pad-lg tac"><div class="eyebrow">Quiz complete</div><div class="v stat" style="font-size:2.4rem">${Math.round(correct / questions.length * 100)}%</div><div class="muted">${correct}/${questions.length}</div><div style="margin-top:14px"><button class="btn primary" onclick="navigate('studio')">Back to Studio</button></div></div></div>`; return; }
    const q = questions[i];
    host.innerHTML = `<div class="player">${pageHeader('Notes quiz', `${i + 1} / ${questions.length} · ${correct} correct`, `<button class="btn ghost sm" onclick="navigate('studio')">✕ End</button>`)}
      <div class="card pad-lg"><div class="stem">${mathToHtml(q.stem)}</div>
      <div class="choices">${q.choices.map((c, k) => `<div class="choice" data-l="${LETTERS[k]}"><span class="key">${LETTERS[k]}</span><span class="txt">${mathToHtml(c)}</span></div>`).join('')}</div></div><div id="nqfb"></div></div>`;
    typeset(host);
    $$('.choice', host).forEach((el) => el.onclick = () => {
      const ok = el.dataset.l === q.answer; if (ok) correct++;
      $$('.choice', host).forEach((x) => { x.style.pointerEvents = 'none'; if (x.dataset.l === q.answer) x.classList.add('correct'); else if (x === el) x.classList.add('wrong'); });
      $('#nqfb', host).innerHTML = `<div class="explain ${ok ? 'correct' : 'wrong'}" style="margin-top:12px">${q.explanation ? mathToHtml(q.explanation) : ''}<div style="margin-top:10px"><button class="btn primary" id="nqn">${i + 1 >= questions.length ? 'See score' : 'Next →'}</button></div></div>`;
    typeset($('#nqfb', host)); $('#nqn', host).focus(); $('#nqn', host).onclick = () => { i++; render(); };
    });
  }
  render();
}
