#!/usr/bin/env node
// QA only: drive headless Chrome over the DevTools protocol to capture
// scroll states, reduced motion and exact viewports.
//
// Usage: node qa/tools/cdp-shot.mjs <plan.json>
// plan = { url, out, shots: [{ name, w, h, reduced?, hash?, scroll?, keys?: [{ key, shift?, wait? }], eval?: "js", wait?: ms, full?: bool }] }
// Each shot writes <out>/<name>.png and prints any JSON returned by `eval`.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const plan = JSON.parse(readFileSync(process.argv[2], 'utf8'));
mkdirSync(plan.out, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'ps-cdp-'));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  await sleep(250);
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
  } catch {}
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const logs = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  } else if (d.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + JSON.stringify(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text));
  else if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) logs.push(d.params.type.toUpperCase() + ' ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (d) => (d.error ? reject(new Error(method + ': ' + d.error.message)) : resolve(d.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await send('Page.enable');
await send('Runtime.enable');
let lastKey = '';
for (const s of plan.shots) {
  await send('Emulation.setDeviceMetricsOverride', { width: s.w, height: s.h, deviceScaleFactor: 1, mobile: s.w < 768 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: s.reduced ? 'reduce' : 'no-preference' }] });
  const url = plan.url + (s.hash ?? '#/');
  const key = `${url}|${s.w}x${s.h}|${s.reduced}`;
  if (key !== lastKey || s.reload) {
    await send('Page.navigate', { url: 'about:blank' });
    await sleep(100);
    await send('Page.navigate', { url });
    await sleep(s.loadWait ?? 1800);
    lastKey = key;
  }
  if (s.scroll !== undefined) {
    const expr = typeof s.scroll === 'number' ? String(s.scroll) : s.scroll;
    await evaluate(`document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0, ${expr}); document.documentElement.style.scrollBehavior=''; true`);
  }
  for (const k of s.keys ?? []) {
    // Real key presses, e.g. { key: 'Tab', shift?: true, wait?: ms }
    const code = k.key === 'Tab' ? 9 : k.key === 'Enter' ? 13 : k.key === 'Escape' ? 27 : 0;
    const base = { key: k.key, code: k.key, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, modifiers: k.shift ? 8 : 0 };
    if (k.key === 'Enter') await send('Input.dispatchKeyEvent', { type: 'keyDown', text: '\r', unmodifiedText: '\r', ...base });
    else await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    await sleep(k.wait ?? 120);
  }
  if (s.eval) {
    const v = await evaluate(s.eval);
    if (v !== undefined) console.log(s.name, JSON.stringify(v));
  }
  await sleep(s.wait ?? 700);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!s.full });
  writeFileSync(join(plan.out, s.name + '.png'), Buffer.from(shot.data, 'base64'));
  console.log('saved', s.name);
}
if (logs.length) console.log('CONSOLE:\n' + logs.join('\n'));
else console.log('CONSOLE: no errors or warnings');
ws.close();
chrome.kill();
await sleep(300);
rmSync(profile, { recursive: true, force: true });
