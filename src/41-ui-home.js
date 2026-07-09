/* =========================================================================
   UI — Home dashboard: Sable briefing, 1600-readiness meter, streak, daily
   quest, projected score, mastery heatmap preview, weakest-3 panel.
   ========================================================================= */

registerView('home', {
  render() {
    ensureToday();
    const proj = projectedScore();
    const li = levelInfo();
    const gaugePct = clamp(proj.total / 1600 * 100, 0, 100);
    const dut = daysUntilTest();
    const quest = getDailyQuest();
    const weak = weakestSkills(3);
    const wk = S.weekly;
    const goalPct = clamp(wk.xp / wk.goal * 100, 0, 100);
    const briefing = templateBriefing();

    const diagCard = !S.diagnostic.done ? `
      <div class="card" style="border:1px solid rgba(255,194,71,.35);background:linear-gradient(180deg,rgba(255,194,71,.08),transparent)">
        <div class="row spread wrap">
          <div><div class="eyebrow">Start here</div><h3 style="margin:.2em 0">Take the diagnostic</h3>
          <div class="muted">A ~40-minute shortened test seeds your mastery map and first score estimate.</div></div>
          <button class="btn gold lg" onclick="navigate('diagnostic')">Begin diagnostic →</button>
        </div>
      </div>` : '';

    return `
    ${pageHeader('Home', `${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`,
      `<button class="btn ghost sm" onclick="Sable.togglePanel()">💬 Ask ${esc(S.settings.assistantName)}</button>
       <button class="btn sm" onclick="startQuickDrill()">🎯 Quick drill</button>`)}

    <div class="grid" style="grid-template-columns: 1.5fr 1fr; align-items:stretch">
      <div class="card pad-lg briefing">
        <div class="glow"></div>
        <div class="row" style="gap:12px;align-items:flex-start">
          <div class="sable-head" style="padding:0;border:0"><div class="av"></div></div>
          <div style="flex:1">
            <div class="row spread"><div class="eyebrow" style="color:var(--ace)">${esc(S.settings.assistantName)} · Daily briefing</div>
            ${aiConfigured() ? `<button class="btn sm ghost" id="briefRewrite" title="Rewrite in Sable's voice">✨</button>` : ''}</div>
            <p id="briefText" style="font-size:1.05rem;line-height:1.6;margin:.4em 0 0">${esc(briefing)}</p>
          </div>
        </div>
      </div>

      <div class="card pad-lg readiness">
        <div class="gauge" style="--p:${gaugePct}"><div class="g-in"><b>${proj.total}</b><small class="muted">of 1600</small></div></div>
        <div style="flex:1">
          <div class="eyebrow">1600 readiness</div>
          <div class="muted" style="font-size:.9rem;margin:.3em 0">Projected estimate · RW ${proj.rw} · Math ${proj.math}</div>
          <div class="bar gold" style="margin:.4em 0"><span style="width:${gaugePct}%"></span></div>
          ${dut != null ? `<div class="pill gold" style="margin-top:6px">🗓️ ${dut >= 0 ? dut + ' days to test day' : 'test date passed'}</div>`
            : `<div class="tag">Set a test date in Settings for countdown mode</div>`}
        </div>
      </div>
    </div>

    <div class="grid g-4" style="margin-top:16px">
      ${statTile('Streak', `<span class="flame"><span class="f">🔥</span>${S.streak.count}</span>`, plural(S.streak.freezes, 'freeze') + ' saved')}
      ${statTile('Level', `${li.level}`, li.title)}
      ${statTile('Weekly XP', `${wk.xp}<small> / ${wk.goal}</small>`, pct(goalPct / 100) + '% of goal')}
      ${statTile('Answered', `${S.stats.answered}`, `${S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0}% all-time`)}
    </div>

    ${diagCard ? `<div style="margin-top:16px">${diagCard}</div>` : ''}

    <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top:16px; align-items:start">
      <div class="card">
        <div class="row spread"><h3 style="margin:0">Today’s quest</h3>${questComplete() ? '<span class="pill mint">Complete ✓</span>' : '<span class="pill">Protects your streak</span>'}</div>
        <div class="stack" style="margin-top:12px">
          ${quest.items.map((it) => `
            <div class="quest-item ${it.done ? 'done' : ''}" ${it.route ? `onclick="navigate('${it.route}'${it.params ? `,${JSON.stringify(it.params).replace(/"/g, '&quot;')}` : ''})"` : ''} style="cursor:${it.route ? 'pointer' : 'default'}">
              <span class="ck">${it.done ? '✓' : ''}</span>
              <span style="flex:1">${esc(it.label)}</span>
              ${it.route ? '<span class="muted">→</span>' : ''}
            </div>`).join('') || '<div class="muted">No tasks yet — take the diagnostic to build your plan.</div>'}
        </div>
      </div>

      <div class="card">
        <div class="row spread"><h3 style="margin:0">Weakest skills</h3><a onclick="navigate('progress')" style="cursor:pointer">All skills →</a></div>
        <div class="stack" style="margin-top:12px">
          ${weak.map((s) => {
            const m = getMastery(s.id), t = masteryTier(m);
            return `<div class="row spread" style="gap:10px">
              <div style="flex:1"><div style="font-weight:600">${esc(s.name)}</div>
                <div class="bar ${t.cls === 'm5' || t.cls === 'm4' ? 'mint' : ''}" style="margin-top:5px"><span style="width:${m}%"></span></div></div>
              <div class="mono" style="width:34px;text-align:right">${Math.round(m)}</div>
              <button class="btn sm primary" onclick="navigate('drills',{skill:'${s.id}'})">Drill</button>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="row spread"><h3 style="margin:0">Mastery heatmap</h3><a onclick="navigate('progress')" style="cursor:pointer">Open full grid →</a></div>
      <div class="heat" id="homeHeat" style="margin-top:12px">${SKILLS.map((s) => masteryCell(s.id)).join('')}</div>
    </div>
    `;
  },
  mount(root) {
    $$('#homeHeat .cell', root).forEach((c) => c.addEventListener('click', () => onHeatCellClick(c.dataset.skill)));
    const rw = $('#briefRewrite', root);
    if (rw) rw.onclick = async () => {
      rw.disabled = true; rw.textContent = '…';
      try {
        const txt = await aiText(SABLE_SYSTEM(), `Rewrite this daily briefing in your own voice — calm, dry, a touch witty, 3-4 sentences, no preamble:\n\n"${templateBriefing()}"`, { max_tokens: 400, temperature: 0.8 });
        if (txt) $('#briefText', root).textContent = txt;
      } catch (e) { toast('Sable: ' + e.message, 'coral'); }
      rw.disabled = false; rw.textContent = '✨';
    };
  },
});

function statTile(k, v, sub) {
  return `<div class="card stat"><div class="k">${esc(k)}</div><div class="v">${v}</div>${sub ? `<div class="muted" style="font-size:.8rem">${esc(sub)}</div>` : ''}</div>`;
}
function onHeatCellClick(skillId) {
  const m = getMastery(skillId);
  const s = SKILL_BY_ID[skillId];
  confirmModalChoice(s.name, `Mastery ${Math.round(m)} — ${masteryTier(m).label}. What would you like to do?`, [
    { label: '📖 Lesson', fn: () => navigate('learn', { skill: skillId }) },
    { label: '🎯 Drill', fn: () => navigate('drills', { skill: skillId }), primary: true },
  ]);
}
// small choice modal
function confirmModalChoice(title, body, choices) {
  const host = document.getElementById('overlays');
  const wrap = document.createElement('div');
  wrap.className = 'modal-overlay';
  wrap.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><div class="muted" style="margin-bottom:18px">${esc(body)}</div>
    <div class="row" style="justify-content:flex-end;gap:10px">${choices.map((c, i) => `<button class="btn ${c.primary ? 'primary' : ''}" data-i="${i}">${esc(c.label)}</button>`).join('')}</div></div>`;
  host.appendChild(wrap);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) wrap.remove(); });
  choices.forEach((c, i) => wrap.querySelector(`[data-i="${i}"]`).onclick = () => { wrap.remove(); c.fn(); });
}

function startQuickDrill() {
  const weak = weakestSkills(1)[0];
  navigate('drills', { skill: weak.id });
}
