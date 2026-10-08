// Renders prompting-menu.html to public/downloads/prompt-smash-prompting-menu.pdf.
// Requirements (not project dependencies): Playwright, Google Chrome, Python 3 with pypdf.
// Optional overrides: PLAYWRIGHT_MODULE (path to playwright's index.mjs),
// CHROME_PATH (Chrome executable) and PYTHON (Python interpreter).
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright'
);

const here = dirname(fileURLToPath(import.meta.url));
const html = pathToFileURL(join(here, 'prompting-menu.html')).href;
const output = resolve(here, '../../public/downloads/prompt-smash-prompting-menu.pdf');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }),
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));
await page.goto(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const burgerDiagram = page.locator('.burger-diagram').first();
if (await burgerDiagram.count()) {
  await burgerDiagram.screenshot({ path: join(here, 'assets/seven-layer-burger-diagram.png'), omitBackground: true });
}
await page.pdf({
  path: output,
  printBackground: true,
  preferCSSPageSize: true,
  tagged: true,
  outline: true,
});
// Bookmark titles come from each heading's real text, in document order. Chrome builds the
// outline from laid-out lines and drops the space wherever a heading wraps
// ("Context andInput"); postprocess.py replaces those titles with these.
await page.emulateMedia({ media: 'print' });
const headings = await page.evaluate(() =>
  [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((h) => h.getClientRects().length > 0)
    .map((h) => h.innerText.replace(/\s+/g, ' ').trim()),
);
const work = mkdtempSync(join(tmpdir(), 'prompting-menu-'));
const headingsFile = join(work, 'headings.json');
writeFileSync(headingsFile, JSON.stringify(headings));
console.log(`PDF ${output}`);
console.log(`pages ${await page.locator('.page').count()}`);
console.log(`errors ${errors.length}`);
if (errors.length) console.log(errors.join('\n'));
await browser.close();
execFileSync(
  process.env.PYTHON ?? 'python3',
  [join(here, 'postprocess.py'), output, headingsFile],
  { stdio: 'inherit' },
);
rmSync(work, { recursive: true, force: true });
