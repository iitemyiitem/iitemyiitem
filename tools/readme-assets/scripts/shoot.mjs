// Re-captures the public sites into ../sources (1440×900, dark scheme).
// The A.R.I.S.2 app screenshot (sources/aris2.jpg) is not captured here.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCES = path.join(here, '..', 'sources');
const SITES = [
  ['shinkai', 'https://shinkai-project.com/', 6000],
  ['minaduki', 'https://minaduki-asmr.com/', 5000],
  ['iitemy', 'https://iitemy.com/', 9000], // WebGL moon needs time to settle
];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', locale: 'ja-JP' });
for (const [name, url, settle] of SITES) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: 'html{scrollbar-width:none}::-webkit-scrollbar{display:none}' });
  await page.waitForTimeout(settle);
  const png = await page.screenshot();
  await sharp(png).jpeg({ quality: 90, progressive: true }).toFile(path.join(SOURCES, `${name}.jpg`));
  console.log('captured', name);
  await page.close();
}
await browser.close();
