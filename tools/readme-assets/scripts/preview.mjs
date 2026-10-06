// Renders README.md with GitHub's own Markdown API (`gh api markdown`), wraps it in
// github-markdown-css and screenshots it in segments into ../.preview/.
// usage: node scripts/preview.mjs [dark-desktop,light-desktop,dark-mobile,light-mobile] [open]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, '..', '..', '..');
const OUT = path.join(here, '..', '.preview');
fs.mkdirSync(OUT, { recursive: true });

const css = path.join(OUT, 'github-markdown.css');
if (!fs.existsSync(css)) {
  const res = await fetch('https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown.css');
  fs.writeFileSync(css, await res.text());
}

// GitHub's <themed-picture> swaps sources by theme with JS; without it, the <a> GitHub
// wraps around each <img> hides the <img> from <picture>, so unwrap it for the preview.
const body = execFileSync('gh', ['api', 'markdown', '-F', `text=@${path.join(ROOT, 'README.md')}`], { encoding: 'utf8' })
  .replace(/(<source[^>]*>\s*)<a target="_blank"[^>]*>(<img[^>]*>)<\/a>/g, '$1$2');

const html = (scheme, mobile) => `<!doctype html><html><head><meta charset="utf-8">
<base href="${pathToFileURL(ROOT).href}/"><link rel="stylesheet" href="${pathToFileURL(css).href}"><style>
body{margin:0;background:${scheme === 'dark' ? '#0d1117' : '#ffffff'}}
.box{max-width:${mobile ? 'none' : '878px'};margin:${mobile ? '0' : '24px auto'};padding:${mobile ? '16px' : '24px'};
border:${mobile ? '0' : `1px solid ${scheme === 'dark' ? '#30363d' : '#d0d7de'}`};border-radius:6px}
</style></head><body><div class="box"><article class="markdown-body">${body}</article></div></body></html>`;

const runs = (process.argv[2] || 'dark-desktop,light-desktop,dark-mobile').split(',');
const browser = await chromium.launch();
for (const run of runs) {
  const [scheme, kind] = run.split('-');
  const mobile = kind === 'mobile';
  const width = mobile ? 390 : 1000;
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, colorScheme: scheme });
  const page = await ctx.newPage();
  const file = path.join(OUT, `${run}.html`);
  fs.writeFileSync(file, html(scheme, mobile));
  await page.goto(pathToFileURL(file).href);
  if (process.argv[3] === 'open') await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  await page.waitForTimeout(4000); // let the hero's entrance animation finish
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const seg = mobile ? 1500 : 1300;
  for (let y = 0, i = 0; y < height; y += seg, i++) {
    await page.screenshot({ path: path.join(OUT, `${run}-${i}.png`), clip: { x: 0, y, width, height: Math.min(seg, height - y) }, fullPage: true });
  }
  console.log(run, `${height}px`);
  await ctx.close();
}
await browser.close();
