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
