// Text → SVG path outlines via fontkit, so the README's SVGs never depend on
// fonts being installed on the viewer's machine (GitHub serves SVG through
// <img>, which cannot load web fonts).
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');
const here = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(here, '..', '.fonts');

const cache = new Map();
function open(file, variation) {
  const key = file + JSON.stringify(variation ?? {});
  if (!cache.has(key)) {
    let f = fontkit.openSync(path.join(FONT_DIR, file));
    if (variation) f = f.getVariation(variation);
    cache.set(key, f);
  }
  return cache.get(key);
}

export const FONTS = {
  mincho: () => open('ZenOldMincho-SemiBold.ttf'),
  minchoBold: () => open('ZenOldMincho-Bold.ttf'),
  minchoRegular: () => open('ZenOldMincho-Regular.ttf'),
  gothic: () => open('ZenKakuGothicNew-Regular.ttf'),
  gothicMedium: () => open('ZenKakuGothicNew-Medium.ttf'),
  latin: (wght = 500) => open('Cormorant[wght].ttf', { wght }),
  latinItalic: (wght = 400) => open('Cormorant-Italic[wght].ttf', { wght }),
  mono: () => open('IBMPlexMono-Regular.ttf'),
  monoMedium: () => open('IBMPlexMono-Medium.ttf'),
};

const round = (d, p) => d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (n) => {
  const v = Number(n);
  const r = Math.round(v * 10 ** p) / 10 ** p;
  return String(r === 0 ? 0 : r);
});

/** Shape a run and return per-glyph pen positions (px) and total advance. */
export function measure(font, text, size, { tracking = 0, features = ['kern'] } = {}) {
  const run = font.layout(text, features);
  const s = size / font.unitsPerEm;
  let pen = 0;
  const items = run.glyphs.map((g, i) => {
    const p = run.positions[i];
    const item = { glyph: g, x: pen + p.xOffset * s, y: p.yOffset * s };
    pen += p.xAdvance * s + tracking;
    return item;
  });
  return { items, width: Math.max(0, pen - tracking), scale: s };
}

/**
 * Outline a single line of text.
 * anchor: 'start' | 'middle' | 'end'. Returns { d, width }.
 */
export function text(font, str, { x = 0, y = 0, size = 16, tracking = 0, anchor = 'start', features, precision } = {}) {
  const feats = features ?? ['kern', 'palt'];
  const { items, width, scale } = measure(font, str, size, { tracking, features: feats });
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const p = precision ?? 1;
  let d = '';
  for (const it of items) {
    const gp = it.glyph.path;
    if (!gp.commands.length) continue;
    // font units are y-up; flip and place on the baseline.
    const placed = gp.transform(scale, 0, 0, -scale, x0 + it.x, y - it.y);
    d += placed.toSVG();
  }
  return { d: round(d, p), width, x0 };
}

/** Like text(), but shrinks the size so the run never exceeds maxWidth. */
export function fit(font, str, opts) {
  const { maxWidth, size } = opts;
  const probe = measure(font, str, size, { tracking: opts.tracking ?? 0, features: opts.features ?? ['kern', 'palt'] });
  const k = probe.width > maxWidth ? maxWidth / probe.width : 1;
  return text(font, str, { ...opts, size: size * k, tracking: (opts.tracking ?? 0) * k });
}

/** Stack CJK characters vertically (no vert alternates needed for kana/kanji). */
export function vtext(font, str, { x, y, size, tracking = 0 }) {
  let d = '';
  let cy = y;
  for (const ch of [...str]) {
    const r = text(font, ch, { x, y: cy + size * 0.88, size, anchor: 'middle', features: ['kern'] });
    d += r.d;
    cy += size + tracking;
  }
  return { d, height: cy - y - tracking };
}

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
