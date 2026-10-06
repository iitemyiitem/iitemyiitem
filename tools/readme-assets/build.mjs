// Renders every README image into ../../assets as self-contained SVG
// (text outlined from the fonts, screenshots embedded) in dark and light.
// usage: node build.mjs [hero|works|panels]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { THEMES } from './lib/theme.mjs';
import { hero } from './lib/hero.mjs';
import { rng } from './lib/moon.mjs';
import { workPlate } from './lib/works.mjs';
import { statsPlate, stackPlate } from './lib/panels.mjs';
import { WORKS, STATS, STATS_ALT, STACK, STACK_ALT } from './content.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '..', '..', 'assets');
const SOURCES = path.join(here, 'sources');
fs.mkdirSync(OUT, { recursive: true });

const only = process.argv[2];
const write = (name, svg) => {
  fs.writeFileSync(path.join(OUT, name), svg);
  console.log(name.padEnd(28), (Buffer.byteLength(svg) / 1024).toFixed(1) + 'KB');
};

async function grainTile() {
  const n = 160, rand = rng(5);
  const buf = Buffer.alloc(n * n);
  for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(rand() * 256);
  const png = await sharp(buf, { raw: { width: n, height: n, channels: 1 } }).png({ compressionLevel: 9, palette: true, colors: 16 }).toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

async function screenshot(file) {
  const buf = await sharp(path.join(SOURCES, file)).resize({ width: 1000 }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

const grain = await grainTile();
const themes = Object.values(THEMES);

if (!only || only === 'hero') {
  for (const T of themes) write(`hero-${T.name}.svg`, hero(T, { grain }));
}
if (!only || only === 'works') {
  for (const w of WORKS) {
    const image = w.src ? await screenshot(w.src) : null;
    for (const T of themes) write(`work-${w.id}-${T.name}.svg`, workPlate(T, w, { grain, image }));
  }
}
if (!only || only === 'panels') {
  for (const T of themes) {
    write(`stats-${T.name}.svg`, statsPlate(T, STATS, { grain, alt: STATS_ALT }));
    write(`stack-${T.name}.svg`, stackPlate(T, STACK, { grain, alt: STACK_ALT }));
  }
}
