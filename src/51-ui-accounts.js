/* =========================================================================
   UI — Accounts (local sign in / sign up) + Teacher Classroom.
   Local, single-device profiles. The first account becomes the teacher and
   inherits any existing progress. Teachers can switch between Teacher and
   Student views, monitor each student's progress, and "act as" a student.
   ========================================================================= */

/* ---------- auth screen (full-screen, before the app shell) ---------- */
function renderAuth(mode) {
  _shellBuilt = false;
  const orb = document.getElementById('sableOrb'); if (orb) orb.remove();
  const panel = document.querySelector('.sable-panel'); if (panel) panel.remove();
  const hasAccounts = Object.keys(ACCOUNTS).length > 0;
  const tab = mode || (hasAccounts ? 'in' : 'up');
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="auth-brand"><div class="mark">A</div><div class="name"><b>A</b>ce</div></div>
        <p class="tac muted" style="margin:0">Your personal Digital SAT trainer</p>
        <div class="auth-tabs">
          <button data-tab="in" class="${tab === 'in' ? 'on' : ''}">Sign in</button>
          <button data-tab="up" class="${tab === 'up' ? 'on' : ''}">Sign up</button>
        </div>
        <div id="authBody"></div>
        <p class="tag tac" style="margin-top:16px;line-height:1.5">Accounts are stored only in this browser — a lightweight local profile, not real security. ${hasAccounts ? Object.keys(ACCOUNTS).length + ' account(s) on this device.' : ''}</p>
      </div>
    </div>`;
  $$('.auth-tabs button', app).forEach((b) => b.onclick = () => renderAuth(b.dataset.tab));
  (tab === 'in' ? authSignIn : authSignUp)();
}

function authSignIn() {
  const body = document.getElementById('authBody');
  const names = Object.keys(ACCOUNTS);
  body.innerHTML = `
    ${names.length ? `<label class="fld"><span>Account</span><select id="inUser">${names.map((u) => `<option value="${esc(u)}">${esc(ACCOUNTS[u].displayName || u)} · ${ACCOUNTS[u].role}</option>`).join('')}</select></label>`
      : `<label class="fld"><span>Username</span><input type="text" id="inUser" placeholder="username"></label>`}
    <label class="fld"><span>Password</span><input type="password" id="inPass" placeholder="••••••"></label>
    <div id="authMsg" class="tag" style="color:var(--coral);min-height:16px"></div>
    <button class="btn primary block lg" id="inGo">Sign in →</button>`;
  const go = () => {
    const u = document.getElementById('inUser').value;
    const r = verifyLogin(u, document.getElementById('inPass').value);
    if (!r.ok) { document.getElementById('authMsg').textContent = r.error; return; }
    enterApp(r.username);
  };
  document.getElementById('inGo').onclick = go;
  document.getElementById('inPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
}

function authSignUp() {
  const body = document.getElementById('authBody');
  const isFirst = Object.keys(ACCOUNTS).length === 0;
  const defRole = isFirst ? 'teacher' : 'student';
  body.innerHTML = `
    <label class="fld"><span>Display name</span><input type="text" id="upName" placeholder="e.g. Alex"></label>
    <label class="fld"><span>Username</span><input type="text" id="upUser" placeholder="letters, numbers, _ . -"></label>
    <label class="fld"><span>Password</span><input type="password" id="upPass" placeholder="at least 4 characters"></label>
    <label class="fld"><span>I am a…</span>
      <div class="role-pick" id="rolePick">
        <label class="${defRole === 'student' ? 'on' : ''}" data-role="student"><input type="radio" name="role" value="student" ${defRole === 'student' ? 'checked' : ''}><div class="em">🎓</div><div class="rl">Student</div></label>
        <label class="${defRole === 'teacher' ? 'on' : ''}" data-role="teacher"><input type="radio" name="role" value="teacher" ${defRole === 'teacher' ? 'checked' : ''}><div class="em">👩‍🏫</div><div class="rl">Teacher</div></label>
      </div></label>
    <label class="fld ${defRole === 'student' ? '' : 'hidden'}" id="joinField"><span>Class code <span class="faint">(optional — are you in a class? you can also join later)</span></span>
      <input type="text" id="upCode" placeholder="e.g. ABC123" style="text-transform:uppercase"></label>
    ${isFirst ? `<p class="tag ${defRole === 'teacher' ? '' : 'hidden'}" id="firstNote" style="color:var(--ace)">This first account keeps any progress already on this device.</p>` : ''}
    <div id="authMsg" class="tag" style="color:var(--coral);min-height:16px"></div>
    <button class="btn primary block lg" id="upGo">Create account →</button>`;
  $$('#rolePick label', body).forEach((l) => l.onclick = () => {
    $$('#rolePick label', body).forEach((x) => x.classList.remove('on')); l.classList.add('on');
    document.getElementById('joinField').classList.toggle('hidden', l.dataset.role !== 'student');
    const fn = document.getElementById('firstNote'); if (fn) fn.classList.toggle('hidden', l.dataset.role !== 'teacher');
  });
  document.getElementById('upGo').onclick = () => {
    const role = (body.querySelector('input[name=role]:checked') || {}).value || defRole;
    const r = createAccount(document.getElementById('upUser').value, document.getElementById('upPass').value, role, document.getElementById('upName').value);
    if (!r.ok) { document.getElementById('authMsg').textContent = r.error; return; }
    // optional: join a class by code (students only)
    if (role === 'student') {
      const code = document.getElementById('upCode').value.trim();
      if (code) { const j = joinClass(r.username, code); if (!j.ok) { document.getElementById('authMsg').textContent = j.error + ' You can join later from Settings.'; } }
    }
    setSession(r.username);
    enterApp(r.username);
    toast('Welcome to Ace, ' + (document.getElementById('upName').value || r.username) + '!', 'gold', 3500);
  };
}

/* ---------- profile activation & session ---------- */
function activateProfile() { ensureToday(); buildBank(); rolloverWeekIfNeeded(); generatePlan(); save(); }
function enterApp(username) {
  setSession(username); actingUser = null;
  loadProfile(username); activateProfile();
  if (S.settings.voice && typeof Sable !== 'undefined') Sable.initVoice();
  _shellBuilt = false;
  const landing = (isTeacher() && S.settings.viewMode === 'teacher') ? 'classroom' : 'home';
  if (location.hash === '#/' + landing) router(); else location.hash = '#/' + landing;
}
function signOut() {
  if (actingUser) return returnToTeacher();
  confirmModal('Sign out?', 'You can sign back in anytime — your progress stays on this device.', () => { clearSession(); renderAuth('in'); }, 'Sign out', 'primary');
}

function changePassword() {
  const m = openModal(`<h3 style="margin-top:0">Change password</h3>
    <label class="fld"><span>Current password</span><input type="password" id="cpOld"></label>
    <label class="fld"><span>New password</span><input type="password" id="cpNew" placeholder="at least 4 characters"></label>
    <div id="cpMsg" class="tag" style="color:var(--coral)"></div>
    <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Save</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-s]').onclick = () => {
    const a = ACCOUNTS[currentUser];
    if (a.pass !== hashPass($('#cpOld', m.el).value)) { $('#cpMsg', m.el).textContent = 'Current password is incorrect.'; return; }
    const nw = $('#cpNew', m.el).value; if (!nw || nw.length < 4) { $('#cpMsg', m.el).textContent = 'New password must be at least 4 characters.'; return; }
    a.pass = hashPass(nw); saveAccounts(); m.close(); toast('Password updated', 'mint');
  };
}

/* ---------- teacher/student view toggle ---------- */
function setViewMode(mode) {
  S.settings.viewMode = mode; save();
  navigate(mode === 'teacher' ? 'classroom' : 'home');
}
function leaveClassUI(code) {
  const c = CLASSES[code];
  confirmModal('Leave ' + (c ? c.name : 'this class') + '?', 'You can rejoin anytime with the code.', () => { leaveClass(currentUser, code); toast('Left the class', 'sky'); router(); }, 'Leave', 'ghost');
}

/* ---------- acting as a student ---------- */
function actAsStudent(username) {
  save(true);
  actingUser = username;
  loadProfile(username); activateProfile();
  _shellBuilt = false;
  toast('Now acting as ' + (ACCOUNTS[username]?.displayName || username), 'sky');
  navigate('home');
}
function returnToTeacher() {
  if (!actingUser) return;
  save(true);                       // persists the student's profile (activeUser = actingUser)
  actingUser = null;
  loadProfile(currentUser); activateProfile();
  _shellBuilt = false;
  navigate('classroom');
}

/* ---------- classroom data (Google-Classroom style: classes + join codes) ---------- */
function classStudents(code) {
  const list = [];
  for (const a of Object.values(ACCOUNTS)) {
    if (a.role === 'student' && (a.classes || []).includes(code)) list.push({ kind: 'account', id: a.username, name: a.displayName || a.username, username: a.username, state: readProfile(a.username) });
  }
  for (const [id, imp] of Object.entries((S.classroom && S.classroom.imported) || {})) if (imp.classCode === code) list.push({ kind: 'import', id, name: imp.name, state: imp.state });
  return list;
}
function classEntry(code, id) { return classStudents(code).find((e) => e.id === id); }
function avg2(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }

registerView('classroom', {
  render(params) {
    if (!isTeacher()) return `<div class="card"><h3>Teacher tools</h3><p class="muted">Sign in with a teacher account to use the classroom.</p></div>`;
    if (params.class && !CLASSES[params.class]) return `<div class="card"><p class="muted">Class not found.</p><button class="btn" onclick="navigate('classroom')">← Classes</button></div>`;
    if (params.class && params.student) return renderStudentDetail(params.class, params.student);
    if (params.class) return renderClassRoster(params.class);
    return renderClassList();
  },
  mount(root, params) {
    if (params.class && params.student) $$('#stuHeat .cell', root).forEach((c) => c.addEventListener('click', () => { const e = classEntry(params.class, params.student); if (e) toast(SKILL_BY_ID[c.dataset.skill].name + ': ' + Math.round(withState(e.state, () => getMastery(c.dataset.skill))), 'sky'); }));
  },
});

function renderClassList() {
  const classes = teacherClasses(currentUser);
  return `${pageHeader('Classroom', 'Your classes. Share a join code and students hop in — like Google Classroom.',
    `<button class="btn primary" onclick="createClassPrompt()">＋ Create class</button>`)}
    ${classes.length ? `<div class="roster">${classes.map((c) => { const n = classStudents(c.code).length; return `<div class="card stu-card" onclick="navigate('classroom',{class:'${c.code}'})">
        <div class="row spread"><div><h3 style="margin:0">${esc(c.name)}</h3><div class="tag">${n} student${n === 1 ? '' : 's'}</div></div><div style="font-size:1.8rem">📚</div></div>
        <div class="row spread" style="margin-top:12px;align-items:center"><span class="tag">Class code</span><span class="pill gold mono" style="letter-spacing:2px">${c.code}</span></div></div>`; }).join('')}</div>`
    : `<div class="card tac" style="padding:44px"><div style="font-size:2.4rem">🧑‍🏫</div><h3>Create your first class</h3>
       <p class="muted" style="max-width:520px;margin:0 auto 16px">You’ll get a class code to share. Students enter it when they sign up — or anytime from Settings — to join. Nobody is required to be in a class.</p>
       <button class="btn primary" onclick="createClassPrompt()">＋ Create a class</button></div>`}`;
}

function renderClassRoster(code) {
  const cls = CLASSES[code];
  const roster = classStudents(code);
  const reports = roster.map((e) => ({ e, r: studentReport(e.state) })).filter((x) => x.r);
  const avg = (f) => reports.length ? Math.round(reports.reduce((a, x) => a + f(x.r), 0) / reports.length) : 0;
  let weakAgg = '';
  if (reports.length) { const sums = {}; SKILLS.forEach((s) => { sums[s.id] = avg2(reports.map((x) => withState(x.e.state, () => getMastery(s.id)))); }); weakAgg = SKILLS.slice().sort((a, b) => sums[a.id] - sums[b.id]).slice(0, 4).map((s) => `<span class="pill coral">${esc(s.name)} · ${Math.round(sums[s.id])}</span>`).join(' '); }
  return `${pageHeader(cls.name, `Class code <b class="mono" style="letter-spacing:2px;color:var(--ace)">${code}</b> · ${roster.length} student${roster.length === 1 ? '' : 's'}`,
    `<button class="btn" onclick="shareClass('${code}')">📣 Share code</button><button class="btn primary" onclick="addStudentMenu('${code}')">＋ Add student</button><button class="btn ghost sm" title="Class settings" onclick="classSettings('${code}')">⚙</button>`)}
    <button class="btn ghost sm" onclick="navigate('classroom')" style="margin-bottom:12px">← All classes</button>
    ${roster.length ? `<div class="grid g-4" style="margin-bottom:16px">
        ${statTile('Students', String(roster.length), 'joined')}
        ${statTile('Avg projected', String(avg((r) => r.projected.total)), 'of 1600 (est.)')}
        ${statTile('Avg mastery', avg((r) => r.overallMastery) + '/100', 'across skills')}
        ${statTile('Mocks taken', String(reports.reduce((a, x) => a + x.r.mocks, 0)), 'class total')}
      </div>
      ${weakAgg ? `<div class="card" style="margin-bottom:16px"><div class="eyebrow">Class needs work on</div><div class="row wrap" style="gap:8px;margin-top:8px">${weakAgg}</div></div>` : ''}
      <div class="roster">${roster.map((e) => studentCard(code, e)).join('')}</div>`
    : `<div class="card tac" style="padding:40px"><div style="font-size:2.2rem">👋</div><h3>No students yet</h3>
       <p class="muted">Share code <b class="mono" style="letter-spacing:2px;color:var(--ace)">${code}</b> so students can join, or add one directly.</p>
       <div class="row" style="justify-content:center;gap:10px;margin-top:12px"><button class="btn" onclick="shareClass('${code}')">📣 Share code</button><button class="btn primary" onclick="addStudentMenu('${code}')">＋ Add student</button></div></div>`}`;
}

function studentCard(code, e) {
  const r = studentReport(e.state); if (!r) return '';
  const initials = e.name.slice(0, 2).toUpperCase();
  const col = ['#7b6cf6', '#2fd9a6', '#47c6f4', '#ff9e3d', '#ef476f'][e.name.charCodeAt(0) % 5];
  return `<div class="card stu-card" onclick="navigate('classroom',{class:'${code}',student:'${e.id}'})">
    <div class="top"><div class="av" style="background:${col}">${esc(initials)}</div>
      <div style="flex:1;min-width:0"><div class="nm" style="font-weight:700">${esc(e.name)}</div><div class="tag">${e.kind === 'account' ? '@' + esc(e.username) : 'imported'} · ${r.answered} answered</div></div>
      <div class="ring-mini" style="--p:${clamp(r.projected.total / 1600 * 100, 0, 100)};position:relative"><span>${r.projected.total}</span></div></div>
    <div class="row" style="gap:10px;margin-top:12px">
      <div class="stat" style="flex:1"><div class="v" style="font-size:1.1rem">${r.rwMastery}<small>/100</small></div><div class="k">RW</div></div>
      <div class="stat" style="flex:1"><div class="v" style="font-size:1.1rem">${r.mathMastery}<small>/100</small></div><div class="k">Math</div></div>
      <div class="stat" style="flex:1"><div class="v" style="font-size:1.1rem"><span class="flame"><span class="f">🔥</span>${r.streak}</span></div><div class="k">streak</div></div></div>
    ${r.weakest.length ? `<div class="tag" style="margin-top:10px">Weakest: ${r.weakest.map(esc).join(', ')}</div>` : ''}</div>`;
}

function renderStudentDetail(code, id) {
  const e = classEntry(code, id);
  if (!e) return `<div class="card"><p class="muted">Student not found in this class.</p><button class="btn" onclick="navigate('classroom',{class:'${code}'})">← Back</button></div>`;
  const html = withState(e.state, () => {
    const proj = projectedScore(), li = levelInfo();
    const heat = SKILLS.map((s) => masteryCell(s.id)).join('');
    const trend = trendChart();
    const weak = weakestSkills(5);
    const mocks = (S.mocks || []).slice().reverse().slice(0, 5);
    const badges = BADGES.filter((b) => S.badges[b.id]);
    const paceRw = S.stats.secByQ.filter((x) => x.s === 'rw').map((x) => x.sec);
    const paceMath = S.stats.secByQ.filter((x) => x.s === 'math').map((x) => x.sec);
    return `
      <div class="grid g-4" style="margin:6px 0 16px">
        ${statTile('Projected', String(proj.total), `RW ${proj.rw} · Math ${proj.math}`)}
        ${statTile('Level', String(li.level), li.title)}
        ${statTile('Streak', `${S.streak.count}d`, `${S.counters.mocksDone} mocks`)}
        ${statTile('Accuracy', `${S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0}%`, `${S.stats.answered} answered`)}
      </div>
      <div class="grid g-2" style="align-items:start">
        <div class="card"><h3 style="margin-top:0">Weakest skills</h3>
          <div class="stack" style="margin-top:8px">${weak.map((s) => { const m = getMastery(s.id), t = masteryTier(m); return `<div class="row spread" style="gap:10px"><div style="flex:1"><div style="font-weight:600;font-size:.9rem">${esc(s.name)}</div><div class="bar ${t.cls === 'm5' || t.cls === 'm4' ? 'mint' : ''}" style="margin-top:4px"><span style="width:${m}%"></span></div></div><span class="mono">${Math.round(m)}</span></div>`; }).join('')}</div></div>
        <div class="card"><h3 style="margin-top:0">Pacing &amp; activity</h3>
          <div class="muted" style="font-size:.85rem">Avg sec/question · targets RW 71 · Math 95</div>
          <div class="row" style="gap:16px;margin:10px 0"><div class="stat"><div class="v" style="font-size:1.3rem">${paceRw.length ? Math.round(avg(paceRw)) : '–'}<small>s</small></div><div class="k">RW pace</div></div><div class="stat"><div class="v" style="font-size:1.3rem">${paceMath.length ? Math.round(avg(paceMath)) : '–'}<small>s</small></div><div class="k">Math pace</div></div><div class="stat"><div class="v" style="font-size:1.3rem">${S.counters.wordsMastered || 0}</div><div class="k">words</div></div></div>
          <div class="tag">Diagnostic: ${S.diagnostic.done ? 'done' : 'not taken'} · Last active ${S.lastActive ? fmtDate(S.lastActive) : '—'}</div></div>
      </div>
      ${trend}
      <div class="card" style="margin-top:16px"><h3 style="margin-top:0">Skill mastery heatmap</h3><div class="heat" id="stuHeat" style="margin-top:10px">${heat}</div></div>
      ${mocks.length ? `<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Recent mock exams</h3><div class="stack">${mocks.map((m) => `<div class="row spread"><span class="tag">${fmtDate(m.ts)} · ${m.kind}</span><b>${m.total}</b> <span class="muted">RW ${m.scaled.rw || '–'} · Math ${m.scaled.math || '–'}</span></div>`).join('')}</div></div>` : ''}
      ${badges.length ? `<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Achievements (${badges.length})</h3><div class="row wrap" style="gap:8px">${badges.map((b) => `<span class="pill gold">${b.em} ${esc(b.name)}</span>`).join('')}</div></div>` : ''}`;
  });
  const actions = `<button class="btn ghost sm" onclick="navigate('classroom',{class:'${code}'})">← Class</button>
    ${e.kind === 'account' ? `<button class="btn" onclick="actAsStudent('${e.username}')">👤 Act as student</button>` : ''}
    <button class="btn ghost sm" style="border-color:var(--coral);color:var(--coral)" onclick="removeFromClass('${code}','${e.id}','${e.kind}')">Remove</button>`;
  return `${pageHeader(e.name, e.kind === 'account' ? '@' + e.username + ' · in ' + esc(CLASSES[code].name) : 'imported snapshot · ' + esc(CLASSES[code].name), actions)}${html}`;
}

/* ---------- class management ---------- */
function createClassPrompt() {
  const m = openModal(`<h3 style="margin-top:0">Create a class</h3>
    <label class="fld"><span>Class name</span><input type="text" id="clName" placeholder="e.g. Period 3 SAT Prep"></label>
    <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Create</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-s]').onclick = () => { const code = createClass($('#clName', m.el).value, currentUser); m.close(); toast('Class created — share code ' + code, 'mint', 3500); navigate('classroom', { class: code }); };
}
function shareClass(code) {
  const cls = CLASSES[code];
  const m = openModal(`<div class="tac"><div class="eyebrow">Class join code</div>
    <div class="mono" style="font-size:2.6rem;letter-spacing:8px;color:var(--ace);margin:10px 0">${code}</div>
    <p class="muted">Students join <b>${esc(cls.name)}</b> by entering this code on the sign-up page, or in <b>Settings → Join a class</b> if they already have an account.</p>
    <div class="row" style="justify-content:center;gap:8px;margin-top:12px"><button class="btn" data-copy>Copy code</button><button class="btn primary" data-x>Done</button></div></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-copy]').onclick = () => { try { navigator.clipboard.writeText(code); toast('Copied', 'mint'); } catch (e) { toast('Your code is ' + code, 'sky'); } };
}
function classSettings(code) {
  const cls = CLASSES[code];
  const m = openModal(`<h3 style="margin-top:0">Class settings</h3>
    <label class="fld"><span>Class name</span><input type="text" id="csName" value="${esc(cls.name)}"></label>
    <div class="row spread" style="margin-top:8px"><button class="btn ghost" style="border-color:var(--coral);color:var(--coral)" data-del>Delete class</button>
      <div class="row" style="gap:8px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Save</button></div></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-s]').onclick = () => { renameClass(code, $('#csName', m.el).value); m.close(); router(); };
  m.el.querySelector('[data-del]').onclick = () => { m.close(); confirmModal('Delete “' + cls.name + '”?', 'Students are unenrolled (their accounts and progress remain). Imported snapshots in this class are also removed from your view.', () => { deleteClass(code); if (S.classroom) { for (const k of Object.keys(S.classroom.imported || {})) if (S.classroom.imported[k].classCode === code) delete S.classroom.imported[k]; save(true); } toast('Class deleted', 'coral'); navigate('classroom'); }, 'Delete class', 'ghost'); };
}
function joinClassPrompt() {
  const m = openModal(`<h3 style="margin-top:0">Join a class</h3>
    <p class="muted" style="margin-top:0">Enter the code your teacher shared. Joining is optional — you can leave anytime.</p>
    <label class="fld"><span>Class code</span><input type="text" id="jcCode" placeholder="e.g. ABC123" style="text-transform:uppercase"></label>
    <div id="jcMsg" class="tag" style="color:var(--coral)"></div>
    <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Join</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-s]').onclick = () => { const j = joinClass(currentUser, $('#jcCode', m.el).value); if (!j.ok) { $('#jcMsg', m.el).textContent = j.error; return; } m.close(); toast('Joined ' + j.name, 'mint'); router(); };
}

/* ---------- add / import / demo students (scoped to a class) ---------- */
function addStudentMenu(code) {
  const m = openModal(`<h3 style="margin-top:0">Add a student to ${esc(CLASSES[code].name)}</h3>
    <div class="stack">
      <button class="btn block" data-a="share">📣 Share the class code <span class="muted" style="font-weight:400">— students self-join (recommended)</span></button>
      <button class="btn block" data-a="account">🎓 Create a student login <span class="muted" style="font-weight:400">— auto-joined to this class</span></button>
      <button class="btn block" data-a="import">📥 Import a progress file <span class="muted" style="font-weight:400">— from a student’s export</span></button>
      <button class="btn block" data-a="demo">✨ Add a demo student</button>
    </div>
    <div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn ghost" data-x>Cancel</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-a="share"]').onclick = () => { m.close(); shareClass(code); };
  m.el.querySelector('[data-a="account"]').onclick = () => { m.close(); addStudentAccount(code); };
  m.el.querySelector('[data-a="import"]').onclick = () => { m.close(); importStudent(code); };
  m.el.querySelector('[data-a="demo"]').onclick = () => { m.close(); addDemoStudent(code); };
}
function addStudentAccount(code) {
  const m = openModal(`<h3 style="margin-top:0">Create a student login</h3>
    <label class="fld"><span>Display name</span><input type="text" id="saName" placeholder="e.g. Jordan"></label>
    <label class="fld"><span>Username</span><input type="text" id="saUser" placeholder="username"></label>
    <label class="fld"><span>Password</span><input type="text" id="saPass" placeholder="they can change it later"></label>
    <div id="saMsg" class="tag" style="color:var(--coral)"></div>
    <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Create</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-s]').onclick = () => {
    const r = createAccount($('#saUser', m.el).value, $('#saPass', m.el).value, 'student', $('#saName', m.el).value);
    if (!r.ok) { $('#saMsg', m.el).textContent = r.error; return; }
    joinClass(r.username, code);
    m.close(); toast('Student account created & joined', 'mint'); router();
  };
}
function importStudent(code) {
  const m = openModal(`<h3 style="margin-top:0">Import a student’s progress</h3>
    <label class="fld"><span>Student name</span><input type="text" id="isName" placeholder="e.g. Sam"></label>
    <label class="fld"><span>Progress JSON (their Settings → Export)</span><textarea id="isData" rows="8" placeholder="Paste the exported JSON…"></textarea></label>
    <div class="row" style="gap:8px"><button class="btn" data-file>Upload file</button><input type="file" id="isFile" accept="application/json" class="hidden"></div>
    <div id="isMsg" class="tag" style="color:var(--coral);margin-top:6px"></div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn ghost" data-x>Cancel</button><button class="btn primary" data-s>Import</button></div>`);
  m.el.querySelector('[data-x]').onclick = m.close;
  m.el.querySelector('[data-file]').onclick = () => $('#isFile', m.el).click();
  $('#isFile', m.el).onchange = (ev) => { const f = ev.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { $('#isData', m.el).value = rd.result; if (!$('#isName', m.el).value) $('#isName', m.el).value = f.name.replace(/\.[^.]+$/, ''); }; rd.readAsText(f); };
  m.el.querySelector('[data-s]').onclick = () => {
    let st; try { st = migrate(JSON.parse($('#isData', m.el).value)); } catch (e) { $('#isMsg', m.el).textContent = 'Invalid JSON: ' + e.message; return; }
    const name = $('#isName', m.el).value.trim() || 'Imported student';
    const id = 'imp_' + uid('s');
    if (!S.classroom) S.classroom = { imported: {} };
    S.classroom.imported[id] = { name, state: st, addedAt: Date.now(), classCode: code };
    save(true); m.close(); toast('Imported ' + name, 'mint'); router();
  };
}
function addDemoStudent(code) {
  const names = ['Ava', 'Mateo', 'Priya', 'Liam', 'Zoe', 'Noah', 'Emma', 'Kai'];
  const name = names[Math.floor(Math.random() * names.length)] + ' (demo)';
  const st = makeDemoState(name);
  const id = 'imp_' + uid('s');
  if (!S.classroom) S.classroom = { imported: {} };
  S.classroom.imported[id] = { name, state: st, addedAt: Date.now(), classCode: code };
  save(true); toast('Added ' + name, 'mint'); router();
}
function makeDemoState(name) {
  const st = defaultState();
  const skill = 0.3 + Math.random() * 0.55;                       // overall ability
  SKILLS.forEach((s) => { st.mastery[s.id] = Math.round(clamp((skill * 100) + (Math.random() * 44 - 22), 2, 99)); });
  st.xp = Math.round(400 + Math.random() * 6000);
  st.streak = { count: Math.floor(Math.random() * 22), lastDay: dayKey(), freezes: 1, freezeWeek: weekKey() };
  st.stats.answered = Math.round(60 + Math.random() * 500);
  st.stats.correct = Math.round(st.stats.answered * (0.5 + Math.random() * 0.4));
  ['rw', 'math'].forEach((sec) => { for (let i = 0; i < 20; i++) st.stats.secByQ.push({ s: sec, sec: (sec === 'rw' ? 60 : 85) + Math.random() * 40 }); });
  st.counters = { extremeSolved: Math.floor(Math.random() * 8), mocksDone: Math.floor(Math.random() * 4), wordsMastered: Math.floor(Math.random() * 120), perfectModules: 0 };
  // fabricate a couple of mock results consistent with mastery
  const base = Math.round((skill * 600 + 400) / 10) * 10;
  for (let i = 0; i < st.counters.mocksDone; i++) {
    const rw = clamp(base + Math.round((Math.random() * 80 - 40)), 200, 800), ma = clamp(base + Math.round((Math.random() * 80 - 40)), 200, 800);
    const ts = Date.now() - (st.counters.mocksDone - i) * 6 * DAY;
    st.scoreHistory.push({ ts, rw, math: ma, total: rw + ma, source: 'mock' });
    st.mocks.push({ kind: 'mock', ts, scaled: { rw, math: ma }, total: rw + ma, bySec: {}, modules: [] });
  }
  if (st.counters.mocksDone) st.diagnostic = { done: true, result: st.mocks[0] };
  st.lastActive = Date.now() - Math.floor(Math.random() * 5) * DAY;
  return st;
}
function removeFromClass(code, id, kind) {
  const e = classEntry(code, id); const name = e ? e.name : 'this student';
  confirmModal('Remove ' + name + ' from class?', kind === 'account' ? 'They are unenrolled from this class. Their account and progress remain.' : 'This removes the imported snapshot (the student’s own copy is unaffected).', () => {
    if (kind === 'account') leaveClass(id, code);
    else if (S.classroom && S.classroom.imported) { delete S.classroom.imported[id]; save(true); }
    toast('Removed from class', 'coral'); navigate('classroom', { class: code });
  }, 'Remove', 'ghost');
}
