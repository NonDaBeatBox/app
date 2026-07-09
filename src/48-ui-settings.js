/* =========================================================================
   UI — Settings (API key, test date, gameplay, data) + question Import screen.
   ========================================================================= */

registerView('settings', {
  render() {
    const st = S.settings;
    const bank = bankStats();
    const acct = (typeof currentUser !== 'undefined' && currentUser) ? ACCOUNTS[currentUser] : null;
    return `
    ${pageHeader('Settings', 'Everything is stored locally in this browser. Nothing is uploaded except your own AI requests.')}
    ${acct ? `<div class="card" style="margin-bottom:16px"><div class="row spread wrap" style="gap:12px">
        <div class="row" style="gap:12px"><div class="user-chip" style="margin:0;border:0;background:none;padding:0"><div class="av">${esc((acct.displayName || acct.username).slice(0, 2).toUpperCase())}</div>
          <div><div class="nm" style="font-size:1rem">${esc(acct.displayName || acct.username)}</div><div class="rl">@${esc(acct.username)} · ${esc(acct.role)}</div></div></div></div>
        <div class="row" style="gap:8px">${acct.role === 'teacher' ? '<button class="btn" onclick="navigate(\'classroom\')">🧑‍🏫 Classroom</button>' : ''}
          <button class="btn" id="chgPass">Change password</button><button class="btn ghost" onclick="signOut()">Sign out</button></div>
      </div></div>` : ''}
    <div class="grid g-2" style="align-items:start">

      <div class="card">
        <h3 style="margin-top:0">✨ AI &amp; ${esc(st.assistantName)}</h3>
        <p class="muted" style="font-size:.9rem">Paste your Anthropic API key to unlock the AI tutor, freeform chat, and the assistant’s voice. The app works fully without one. The key is stored only in this browser’s localStorage.</p>
        <label class="fld"><span>Anthropic API key</span>
          <input type="password" id="setKey" placeholder="sk-ant-..." value="${esc(st.apiKey)}"></label>
        <label class="fld"><span>Model</span>
          <select id="setModel">
            ${['claude-opus-4-8', 'claude-sonnet-5', 'claude-haiku-4-5-20251001'].map((m) => `<option value="${m}" ${st.model === m ? 'selected' : ''}>${m}</option>`).join('')}
          </select></label>
        <label class="fld"><span>Assistant name</span><input type="text" id="setName" value="${esc(st.assistantName)}" maxlength="18"></label>
        <div class="row" style="gap:8px"><button class="btn primary" id="saveAI">Save</button><button class="btn" id="testAI">Test connection</button></div>
        <div id="aiStatus" class="tag" style="margin-top:8px"></div>
        <p class="tag" style="margin-top:10px">Get a key at console.anthropic.com → API Keys. Usage is billed to your own account.</p>
      </div>

      <div class="stack">
        <div class="card">
          <h3 style="margin-top:0">🗓️ Test prep</h3>
          <label class="fld"><span>Test date (optional — switches Ace into countdown mode)</span>
            <input type="date" id="setDate" value="${st.testDate || ''}"></label>
          <label class="fld"><span>Weekly XP goal</span><input type="number" id="setGoal" min="100" step="50" value="${S.weekly.goal}"></label>
          <button class="btn primary" id="savePrep">Save</button>
        </div>
        <div class="card">
          <h3 style="margin-top:0">🎮 Gameplay</h3>
          ${toggleRow('setHearts', 'Hearts mode on the skill path', st.heartsMode)}
          ${toggleRow('setVoice', 'Voice mode for Sable (speech in/out)', st.voice)}
          ${toggleRow('setSound', 'Sound effects & toasts', st.sound)}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h3 style="margin-top:0">🗃️ Data</h3>
      <div class="muted" style="margin-bottom:12px">Question bank: <b>${bank.total}</b> (${bank.math} Math · ${bank.rw} R&amp;W · ${bank.extreme} Extreme). Vocab sets: <b>${Object.keys(S.vocab.sets).length}</b>.</div>
      <div class="row wrap" style="gap:10px">
        <button class="btn" onclick="navigate('import')">➕ Import questions</button>
        <button class="btn" id="exportState">⬇️ Export progress (JSON)</button>
        <button class="btn" id="importState">⬆️ Import progress</button>
        <button class="btn ghost" id="resetState" style="border-color:var(--coral);color:var(--coral)">Reset everything</button>
      </div>
      <input type="file" id="fileState" accept="application/json" class="hidden">
    </div>

    <div class="card" style="margin-top:16px">
      <h3 style="margin-top:0">About Ace</h3>
      <p class="muted">A personal, offline-first Digital SAT trainer. One HTML file. Your assistant is ${esc(st.assistantName)}.
      Data version ${STATE_VERSION}. Built for the long road to 1600.</p>
    </div>`;
  },
  mount(root) {
    const cp = $('#chgPass', root); if (cp) cp.onclick = () => changePassword();
    const setStatus = (m, ok) => { const el = $('#aiStatus', root); el.textContent = m; el.style.color = ok ? 'var(--mint)' : 'var(--coral)'; };
    $('#saveAI', root).onclick = () => {
      S.settings.apiKey = $('#setKey', root).value.trim();
      S.settings.model = $('#setModel', root).value;
      S.settings.assistantName = ($('#setName', root).value.trim() || 'Sable').slice(0, 18);
      save(true); toast('AI settings saved', 'mint'); router();
    };
    $('#testAI', root).onclick = async () => {
      S.settings.apiKey = $('#setKey', root).value.trim(); S.settings.model = $('#setModel', root).value;
      if (!aiConfigured()) return setStatus('Enter a key first.', false);
      setStatus('Testing…', true);
      try { const t = await aiText('You are a test.', 'Reply with the single word: online', { max_tokens: 12, temperature: 0 }); setStatus('✓ Connected — ' + (t || 'ok'), true); save(true); }
      catch (e) { setStatus('✗ ' + e.message, false); }
    };
    $('#savePrep', root).onclick = () => {
      const d = $('#setDate', root).value; S.settings.testDate = d || null;
      S.weekly.goal = clamp(parseInt($('#setGoal', root).value) || 600, 100, 5000);
      generatePlan(true); save(true); toast('Saved', 'mint'); router();
    };
    bindToggle(root, '#setHearts', (v) => { S.settings.heartsMode = v; save(true); });
    bindToggle(root, '#setVoice', (v) => { S.settings.voice = v; save(true); if (v && typeof Sable !== 'undefined') Sable.initVoice(); });
    bindToggle(root, '#setSound', (v) => { S.settings.sound = v; save(true); });

    $('#exportState', root).onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `ace-progress-${dayKey()}.json`; a.click();
    };
    $('#importState', root).onclick = () => $('#fileState', root).click();
    $('#fileState', root).onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const data = JSON.parse(r.result); confirmModal('Import progress?', 'This replaces all current progress on this device.', () => { S = migrate(data); save(true); buildBank(); toast('Progress imported', 'mint'); navigate('home'); }, 'Import', 'primary'); } catch (err) { toast('Invalid file', 'coral'); } };
      r.readAsText(f);
    };
    $('#resetState', root).onclick = () => confirmModal('Reset everything?', 'This permanently erases all progress, mastery, mistakes, vocab, and settings on this device. This cannot be undone.', () => { resetAll(); buildBank(); toast('Reset complete', 'coral'); navigate('home'); }, 'Erase all', 'ghost');
  },
});

function toggleRow(id, label, on) {
  return `<label class="toggle" style="margin:8px 0"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span class="track"></span><span>${esc(label)}</span></label>`;
}
function bindToggle(root, sel, fn) { const el = $(sel, root); if (el) el.onchange = () => fn(el.checked); }

/* ---------- Import questions ---------- */
registerView('import', {
  render() {
    const sample = JSON.stringify([{ id: 'MY001', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq', stem: 'If $2x=10$, what is $x$?', choices: ['3', '4', '5', '6'], answer: 'C', explanation: 'Divide by 2: $x=5$.' }], null, 2);
    return `
    ${pageHeader('Import questions', 'Paste a JSON array of questions in Ace’s schema. They merge into your bank and persist.',
      `<button class="btn ghost" onclick="navigate('settings')">← Settings</button>`)}
    <div class="grid g-2" style="align-items:start">
      <div class="card">
        <label class="fld"><span>Questions JSON</span><textarea id="impQ" rows="16" placeholder='Paste [ ... ] here'></textarea></label>
        <div class="row" style="gap:8px"><button class="btn primary" id="impDo">Import</button><button class="btn" id="impSample">Load example</button></div>
        <div id="impMsg" class="tag" style="margin-top:8px"></div>
      </div>
      <div class="card">
        <h3 style="margin-top:0">Schema</h3>
        <p class="muted" style="font-size:.88rem">Each object needs: <code>id</code>, <code>skill</code>, <code>difficulty</code> (1–3 or "extreme"), <code>type</code> ("mcq"/"spr"), <code>stem</code>, <code>answer</code>, <code>explanation</code>. MCQs also need <code>choices</code> (4 strings) with <code>answer</code> as a letter A–D. SPR <code>answer</code> is the numeric string. <code>section</code> and <code>domain</code> are derived from <code>skill</code> automatically.</p>
        <p class="muted" style="font-size:.88rem">Valid skill ids:</p>
        <div class="row wrap" style="gap:4px">${SKILLS.map((s) => `<span class="tag" title="${esc(s.name)}">${s.id}</span>`).join(' · ')}</div>
        <p class="muted" style="font-size:.88rem;margin-top:10px">Use <code>$...$</code> for math (KaTeX).</p>
      </div>
    </div>`;
  },
  mount(root) {
    $('#impSample', root).onclick = () => { $('#impQ', root).value = $('#impSample', root).dataset.s || JSON.stringify([{ id: 'MY001', skill: 'alg_linear_eq', difficulty: 2, type: 'mcq', stem: 'If $2x=10$, what is the value of $x$?', choices: ['3', '4', '5', '6'], answer: 'C', explanation: 'Divide both sides by 2: $x=5$.' }], null, 2); };
    $('#impDo', root).onclick = () => {
      const msg = $('#impMsg', root);
      let arr; try { arr = JSON.parse($('#impQ', root).value); } catch (e) { msg.textContent = 'Invalid JSON: ' + e.message; msg.style.color = 'var(--coral)'; return; }
      if (!Array.isArray(arr)) { msg.textContent = 'Expected a JSON array.'; msg.style.color = 'var(--coral)'; return; }
      const res = importQuestions(arr);
      msg.style.color = res.added ? 'var(--mint)' : 'var(--coral)';
      msg.textContent = `${res.added} imported${res.skipped ? `, ${res.skipped} skipped (${res.reasons.join('; ')})` : ''}.`;
      if (res.added) toast(`${res.added} questions imported`, 'mint');
    };
  },
});

function importQuestions(arr) {
  let added = 0, skipped = 0; const reasons = new Set();
  for (const q of arr) {
    if (!q || !q.id || !q.skill || !q.stem || q.answer == null) { skipped++; reasons.add('missing fields'); continue; }
    if (!SKILL_BY_ID[q.skill]) { skipped++; reasons.add('bad skill id'); continue; }
    if (BANK_BY_ID[q.id] || S.ai.questions.some((x) => x.id === q.id)) { skipped++; reasons.add('duplicate id'); continue; }
    if (q.type === 'mcq' && (!Array.isArray(q.choices) || q.choices.length < 2)) { skipped++; reasons.add('bad choices'); continue; }
    S.ai.questions.push(Object.assign({}, q, { imported: true }));
    added++;
  }
  if (added) { save(true); buildBank(); }
  return { added, skipped, reasons: Array.from(reasons) };
}
