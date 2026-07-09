/* =========================================================================
   UI — Strategy Playbook (CookSAT-style). List + detail with practice sets.
   ========================================================================= */

registerView('strategies', {
  render(params) {
    if (params.id) return renderStrategy(params.id);
    return `${pageHeader('Strategy Playbook', 'Digital-SAT tactics your school won’t teach — Desmos moves, plugging in, backsolving, elimination, and pacing.')}
      <div class="grid g-2">
        ${STRATEGIES.map((s) => `<div class="card" style="cursor:pointer" onclick="navigate('strategies',{id:'${s.id}'})">
          <div class="row" style="gap:12px"><div style="font-size:1.8rem">${s.icon}</div>
            <div style="flex:1"><h3 style="margin:0 0 4px">${esc(s.title)}</h3><div class="muted" style="font-size:.9rem">${esc(s.blurb)}</div></div>
            <div class="muted">→</div></div></div>`).join('')}
      </div>`;
  },
});

function strategyPractice(s) {
  const tagged = BANK.filter((q) => q.strategyTag === s.tag && !isExtreme(q));
  const seen = new Set(tagged.map((q) => q.id));
  let fill = BANK.filter((q) => {
    if (seen.has(q.id) || isExtreme(q)) return false;
    const f = s.practice || {};
    if (f.section && q.section !== f.section) return false;
    if (f.type && q.type !== f.type) return false;
    if (f.skills && !f.skills.includes(q.skill)) return false;
    return true;
  });
  return shuffle(tagged).concat(shuffle(fill)).slice(0, 6);
}

function renderStrategy(id) {
  const s = STRATEGY_BY_ID[id]; if (!s) return comingSoon('Strategy');
  const practice = strategyPractice(s);
  const isDesmos = /desmos/.test(s.id);
  return `${pageHeader(s.title, s.blurb, `<button class="btn ghost sm" onclick="navigate('strategies')">← All strategies</button>`)}
    <div class="player">
      ${s.body.map((sec) => `<div class="card pad-lg" style="margin-bottom:14px">
        <div class="eyebrow">${esc(sec.h)}</div>
        ${sec.p.map((p) => `<p style="font-size:1.02rem;line-height:1.65">${mathToHtml(p)}</p>`).join('')}
      </div>`).join('')}
      ${isDesmos ? `<div class="card" style="border-left:3px solid var(--sky)"><div class="row spread wrap"><div><b>Practice the workflow live</b><div class="muted">Ace can’t embed Desmos, but the real test uses the same calculator.</div></div>
        <a class="btn" href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Open Desmos ↗</a></div></div>` : ''}
      <div class="card pad-lg tac" style="margin-top:14px">
        <h3 style="margin-top:0">Drill where this strategy is fastest</h3>
        <p class="muted">${practice.length} tagged questions where “${esc(s.title.split(':')[0])}” is the quickest route.</p>
        ${practice.length ? `<button class="btn primary lg" onclick="startStrategyDrill('${s.id}')">Practice these ${practice.length} →</button>` : '<span class="muted">Practice questions load with the full bank.</span>'}
      </div>
    </div>`;
}

function startStrategyDrill(id) {
  const s = STRATEGY_BY_ID[id];
  const qs = strategyPractice(s);
  if (!qs.length) { toast('No practice questions available yet.', 'coral'); return; }
  const host = document.getElementById('view');
  host.innerHTML = `<div id="stratRun"></div>`;
  runQuestionSession({
    container: document.getElementById('stratRun'), questions: qs, mode: 'drill',
    title: s.title.split(':')[0] + ' practice',
    onDone: (sm) => { host.innerHTML = defaultSummary(sm, { title: s.title.split(':')[0] }); typeset(host);
      $$('[data-review]', host).forEach((b) => b.onclick = () => reviewSession(sm, {}));
      host.insertAdjacentHTML('beforeend', `<div class="tac" style="margin-top:10px"><button class="btn" onclick="navigate('strategies',{id:'${id}'})">← Back to strategy</button></div>`); },
  });
}
