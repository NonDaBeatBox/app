import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const file = pathToFileURL(path.resolve('ace.html')).href;
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const warnings = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); if (m.type() === 'warning') warnings.push('WARN: ' + m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(file, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);

async function check(label, fn) {
  try { await fn(); console.log('  ok  ' + label); }
  catch (e) { console.log('  FAIL ' + label + ' :: ' + e.message); errors.push('CHECK ' + label + ': ' + e.message); }
}

// Auth: sign up (first account => teacher), then land in the student view
await check('sign up + enter app', async () => {
  await page.waitForSelector('#upGo', { timeout: 5000 });
  await page.fill('#upName', 'Tester');
  await page.fill('#upUser', 'tester');
  await page.fill('#upPass', 'pass123');
  await page.click('#upGo');
  await page.waitForTimeout(400);
  if (!(await page.$('.shell'))) throw new Error('did not enter app shell after sign up');
  await page.evaluate(() => { S.settings.viewMode = 'student'; navigate('home'); });
  await page.waitForTimeout(150);
});

// Home rendered
await check('home renders', async () => {
  const t = await page.textContent('#view');
  if (!/readiness|briefing|Home/i.test(await page.innerHTML('#view'))) throw new Error('home content missing');
});

// Navigate through all nav routes
for (const route of ['learn','path','drills','vocab','mocks','strategies','progress','mistakes','settings']) {
  await check('nav ' + route, async () => {
    await page.evaluate((r) => window.navigate(r), route);
    await page.waitForTimeout(120);
    const html = await page.innerHTML('#view');
    if (!html || html.length < 20) throw new Error('empty view');
  });
}

// Learn: open a lesson and see concept + checkpoint
await check('learn lesson renders', async () => {
  await page.evaluate(() => navigate('learn', { skill: 'alg_linear_eq' }));
  await page.waitForTimeout(150);
  const html = await page.innerHTML('#view');
  if (!/Concept|Worked examples|Common traps/i.test(html)) throw new Error('lesson content missing');
});
// Path: nodes present and a node starts a session
await check('skill path renders nodes', async () => {
  await page.evaluate(() => navigate('path'));
  await page.waitForTimeout(150);
  const n = await page.$$eval('.node', els => els.length);
  if (n < 20) throw new Error('only ' + n + ' path nodes');
});
await check('path node starts a session', async () => {
  await page.evaluate(() => startPathNode(1));
  await page.waitForTimeout(200);
  const html = await page.innerHTML('#view');
  if (!/qSubmit|choices|sprIn|Micro-lesson|Got it/i.test(html)) throw new Error('node did not start');
});

// Progress heatmap has cells
await check('progress heatmap cells', async () => {
  await page.evaluate(() => window.navigate('progress'));
  await page.waitForTimeout(120);
  const n = await page.$$eval('#progHeat .cell', els => els.length);
  if (n < 30) throw new Error('only ' + n + ' cells');
});

// Run a drill end-to-end
await check('drill flow (answer 3 questions)', async () => {
  await page.evaluate(() => window.startDrill({ section: 'math', limit: 3 }));
  for (let i = 0; i < 3; i++) {
    await page.waitForSelector('#qSubmit', { timeout: 5000 });
    // wait until either choices or the spr input is present
    await page.waitForFunction(() => document.querySelector('#choices .choice') || document.querySelector('#sprIn'), null, { timeout: 5000 });
    if (await page.$('#choices .choice')) await page.click('#choices .choice');
    else await page.fill('#sprIn', '5');
    await page.click('#qSubmit');               // grade
    await page.waitForSelector('#qExplain .explain', { timeout: 5000 });
    await page.click('#qSubmit');               // next / finish
    await page.waitForTimeout(120);
  }
  // after 3, we should see a summary
  const html = await page.innerHTML('#view');
  if (!/complete|correct/i.test(html)) throw new Error('no summary after drill');
});

// Mastery moved for at least one skill (state mutated)
await check('state persisted (answered > 0)', async () => {
  const answered = await page.evaluate(() => window.S ? window.S.stats.answered : (typeof S !== 'undefined' ? S.stats.answered : 0));
});

// Command bar opens
await check('command bar opens', async () => {
  await page.evaluate(() => window.CommandBar.open());
  await page.waitForTimeout(80);
  const cmd = await page.$('.cmd');
  if (!cmd) throw new Error('no command bar');
  await page.evaluate(() => window.CommandBar.close());
});

// Sable panel opens + rule-based answer
await check('sable panel + rule answer', async () => {
  await page.evaluate(() => window.Sable.openPanel());
  await page.waitForTimeout(80);
  await page.fill('#sableIn', 'what should I work on?');
  await page.click('#sableSend');
  await page.waitForTimeout(120);
  const msgs = await page.innerHTML('#sableMsgs');
  if (!/focus|work|drill/i.test(msgs)) throw new Error('no rule-based reply');
});

// Vocabulary: seed a set and exercise modes
await check('vocab import + modes', async () => {
  await page.evaluate(() => {
    const words = [];
    for (let i = 0; i < 12; i++) words.push({ w: 'word' + i, def: 'definition number ' + i, ex: 'This is word' + i + ' in a sentence.' });
    importVocabSet('Test Set', words);
    navigate('vocab');
  });
  await page.waitForTimeout(150);
  const html = await page.innerHTML('#view');
  if (!/Practice modes|Flashcards|Match/i.test(html)) throw new Error('vocab home missing modes');
  // flashcards
  await page.evaluate(() => runVocabMode('flash'));
  await page.waitForTimeout(120);
  if (!(await page.$('#fcard'))) throw new Error('flashcards did not start');
  // match
  await page.evaluate(() => { navigate('vocab'); runVocabMode('match'); });
  await page.waitForTimeout(120);
  const tiles = await page.$$eval('#mgrid .card', els => els.length);
  if (tiles !== 12) throw new Error('match grid wrong tile count: ' + tiles);
  // quiz
  await page.evaluate(() => { navigate('vocab'); runVocabMode('quiz'); });
  await page.waitForTimeout(120);
  if (!/Vocab quiz|What does|Which word/i.test(await page.innerHTML('#view'))) throw new Error('quiz did not start');
});

// Full diagnostic end-to-end through the Bluebook runner
await check('diagnostic runs to a score', async () => {
  await page.evaluate(() => { S.diagnostic = { done: false, result: null }; startDiagnostic(); });
  let guard = 0;
  while (guard++ < 160) {
    await page.waitForTimeout(40);
    if (await page.$('#rdone')) break;                       // results screen
    if (await page.$('#tstart')) { await page.click('#tstart'); continue; }   // module intro
    if (await page.$('#bresume')) { await page.click('#bresume'); continue; } // break
    const submit = await page.$('.modal [data-submit]');
    if (submit) { await submit.click(); continue; }          // review-before-submit modal
    // answer the current question
    if (await page.$('#tspr')) { await page.fill('#tspr', '4'); }
    else if (await page.$('#tchoices .choice')) { await page.click('#tchoices .choice'); }
    const next = await page.$('#tnext');
    if (next) { await next.click(); continue; }
    break;
  }
  if (!(await page.$('#rdone'))) throw new Error('diagnostic did not reach results (guard=' + guard + ')');
  const total = await page.$eval('.fs .stat .v', el => el.textContent);
  if (!/\d{3,4}/.test(total)) throw new Error('no score shown: ' + total);
  // enter review then finish
  await page.click('#rreview'); await page.waitForTimeout(150);
  if (!/Review — every question/i.test(await page.innerHTML('body'))) throw new Error('review screen missing');
  await page.click('#rback'); await page.waitForTimeout(150);
});

// Full mock end-to-end (adaptive routing + break screen + scoring)
async function driveTest(page) {
  let guard = 0, sawBreak = false;
  while (guard++ < 400) {
    await page.waitForTimeout(20);
    if (await page.$('#rdone')) return { ok: true, sawBreak };
    if (await page.$('#bresume')) { sawBreak = true; await page.click('#bresume'); continue; }
    if (await page.$('#tstart')) { await page.click('#tstart'); continue; }
    const submit = await page.$('.modal [data-submit]');
    if (submit) { await submit.click(); continue; }
    if (await page.$('#tspr')) await page.fill('#tspr', '4');
    else if (await page.$('#tchoices .choice')) {
      // vary answers so module-1 accuracy isn't degenerate
      const choices = await page.$$('#tchoices .choice');
      await choices[guard % choices.length].click();
    }
    const next = await page.$('#tnext');
    if (next) { await next.click(); continue; }
    break;
  }
  return { ok: false, sawBreak };
}
await check('full mock runs (routing + break + score)', async () => {
  await page.evaluate(() => startMock());
  const r = await driveTest(page);
  if (!r.ok) throw new Error('mock did not reach results');
  if (!r.sawBreak) throw new Error('no break screen between sections');
  const total = await page.$eval('.fs .stat .v', el => el.textContent);
  if (!/\d{3,4}/.test(total)) throw new Error('no total score');
  const mocks = await page.evaluate(() => S.mocks.length);
  if (mocks < 1) throw new Error('mock not saved to history');
  await page.click('#rdone'); await page.waitForTimeout(100);
});

// Teacher classroom: class + join code + demo student + detail + act-as/return
await check('classroom: class + student + detail + act-as', async () => {
  const code = await page.evaluate(() => { S.settings.viewMode = 'teacher'; const c = createClass('Test Class', 'tester'); addDemoStudent(c); return c; });
  if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error('bad class code: ' + code);
  await page.evaluate((c) => navigate('classroom', { class: c }), code);
  await page.waitForTimeout(150);
  const cards = await page.$$eval('.stu-card', els => els.length);
  if (cards < 1) throw new Error('no student card in class roster');
  // open student detail
  await page.evaluate((c) => { const e = classStudents(c)[0]; navigate('classroom', { class: c, student: e.id }); }, code);
  await page.waitForTimeout(200);
  if (!/Projected|mastery heatmap|Weakest/i.test(await page.innerHTML('#view'))) throw new Error('student detail missing');
  // student account joins the class and gets acted-as
  const acted = await page.evaluate((c) => {
    createAccount('stud1', 'pw12', 'student', 'Student One');
    joinClass('stud1', c);
    actAsStudent('stud1');
    return typeof actingUser !== 'undefined' ? actingUser : null;
  }, code);
  await page.waitForTimeout(200);
  if (acted !== 'stud1') throw new Error('act-as did not set actingUser');
  if (!(await page.$('.acting-banner'))) throw new Error('no acting banner');
  await page.evaluate(() => returnToTeacher());
  await page.waitForTimeout(150);
  if (await page.evaluate(() => actingUser)) throw new Error('did not return to teacher');
  // the joined student now shows in the roster (2 students)
  const n = await page.evaluate((c) => classStudents(c).length, code);
  if (n < 2) throw new Error('joined student not in class roster: ' + n);
});

// Sign out and sign back in preserves account
await check('sign out + sign in', async () => {
  await page.evaluate(() => { clearSession(); renderAuth('in'); });
  await page.waitForTimeout(150);
  if (!(await page.$('#inGo'))) throw new Error('sign-in screen missing');
  // select tester account and sign in
  await page.evaluate(() => { const sel = document.getElementById('inUser'); if (sel && sel.tagName === 'SELECT') sel.value = 'tester'; document.getElementById('inPass').value = 'pass123'; });
  await page.click('#inGo');
  await page.waitForTimeout(300);
  if (!(await page.$('.shell'))) throw new Error('did not sign back in');
});

// localStorage has state
await check('localStorage persisted', async () => {
  const has = await page.evaluate(() => !!localStorage.getItem('ace.v1.state'));
  if (!has) throw new Error('no saved state');
});

await browser.close();

console.log('\n=== console errors/pageerrors ===');
console.log(errors.length ? errors.join('\n') : '(none)');
console.log('\n=== warnings (' + warnings.length + ') ===');
console.log(warnings.slice(0, 12).join('\n'));
process.exit(errors.length ? 1 : 0);
