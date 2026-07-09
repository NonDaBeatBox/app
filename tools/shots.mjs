import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const file = pathToFileURL(path.resolve('ace.html')).href;
const outDir = process.argv[2] || '/tmp/claude-0/-home-user-app/0da3bdd1-82d5-50a3-9254-278fe6fae41c/scratchpad';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.goto(file, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);

// seed a little activity so dashboards aren't empty
await page.evaluate(() => {
  for (let i = 0; i < 18; i++) { const q = BANK[i % BANK.length]; recordAnswer(q, q.type === 'mcq' ? (Math.random() < 0.7 ? q.answer : 'A') : (Math.random() < 0.6 ? [].concat(q.answer)[0] : '0'), { sec: 30 + Math.random() * 40 }); }
  navigate('home');
});
await page.waitForTimeout(400);
await page.screenshot({ path: outDir + '/01-home.png' });

await page.evaluate(() => navigate('progress'));
await page.waitForTimeout(300);
await page.screenshot({ path: outDir + '/02-progress.png', fullPage: true });

await page.evaluate(() => startDrill({ section: 'math', limit: 5 }));
await page.waitForTimeout(300);
await page.screenshot({ path: outDir + '/03-drill.png' });
// answer to show explanation
if (await page.$('#choices .choice')) { await page.click('#choices .choice'); await page.click('#qSubmit'); await page.waitForTimeout(200); await page.screenshot({ path: outDir + '/04-drill-explain.png' }); }

await page.evaluate(() => navigate('settings'));
await page.waitForTimeout(200);
await page.screenshot({ path: outDir + '/05-settings.png', fullPage: true });

await page.evaluate(() => Sable.openPanel());
await page.waitForTimeout(200);
await page.evaluate(() => { document.getElementById('sableIn').value = 'am I on pace for 1600?'; });
await page.click('#sableSend');
await page.waitForTimeout(200);
await page.screenshot({ path: outDir + '/06-sable.png' });

await page.evaluate(() => { CommandBar.open(); });
await page.waitForTimeout(200);
await page.screenshot({ path: outDir + '/07-cmdbar.png' });

await browser.close();
console.log('shots done');
