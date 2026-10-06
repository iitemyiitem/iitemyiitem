// Downloads the OFL fonts the generator outlines (same families as iitemy.com)
// into ../.fonts. They are only read at build time and are not committed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(here, '..', '.fonts');
const BASE = 'https://raw.githubusercontent.com/google/fonts/main/ofl';
const FILES = [
  'zenoldmincho/ZenOldMincho-Regular.ttf',
  'zenoldmincho/ZenOldMincho-SemiBold.ttf',
  'zenoldmincho/ZenOldMincho-Bold.ttf',
  'cormorant/Cormorant[wght].ttf',
  'cormorant/Cormorant-Italic[wght].ttf',
  'ibmplexmono/IBMPlexMono-Regular.ttf',
  'ibmplexmono/IBMPlexMono-Medium.ttf',
  'zenkakugothicnew/ZenKakuGothicNew-Regular.ttf',
  'zenkakugothicnew/ZenKakuGothicNew-Medium.ttf',
];

fs.mkdirSync(DIR, { recursive: true });
for (const f of FILES) {
  const dest = path.join(DIR, path.basename(f));
  if (fs.existsSync(dest)) continue;
  const res = await fetch(`${BASE}/${f.replace('[', '%5B').replace(']', '%5D')}`);
  if (!res.ok) throw new Error(`${f}: HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log('fetched', path.basename(f));
}
