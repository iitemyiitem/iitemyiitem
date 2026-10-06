import { createRequire } from 'node:module';
import { FONTS, text, fit, esc } from './text.mjs';
import { plate } from './frame.mjs';

const require = createRequire(import.meta.url);
const si = require('simple-icons');

/** Four headline figures. Every value is sourced in the README's case notes. */
export function statsPlate(T, stats, { grain, alt }) {
  const W = 1600, H = 330;
  const inner = W - 72 * 2;
  const colW = inner / stats.length;
  const parts = [];
  const P = (d, fill) => parts.push(`<path d="${d}" fill="${fill}"/>`);
  stats.forEach((s, i) => {
    const x0 = 72 + i * colW;
    const x = x0 + 34;
    const maxW = colW - 60;
    if (i > 0) parts.push(`<path d="M${x0} 76V${H - 76}" stroke="${T.line}"/>`);
    const tagN = text(FONTS.monoMedium(), s.n, { x, y: 98, size: 16, tracking: 1.4, features: ['kern'] });
    P(tagN.d, T.gold);
    P(text(FONTS.mono(), s.tag, { x: x + tagN.width + 10, y: 98, size: 16, tracking: 2, features: ['kern'] }).d, T.faint);
    const v = text(FONTS.latin(500), s.value, { x: x - 3, y: 200, size: 104, features: ['kern', 'lnum'] });
    P(v.d, T.fg);
    if (s.unit) P(text(FONTS.latinItalic(400), s.unit, { x: x + v.width + 8, y: 200, size: 40, features: ['kern', 'lnum'] }).d, T.gold);
    P(fit(FONTS.gothicMedium(), s.caption, { x, y: 244, size: 22, tracking: 0.6, maxWidth: maxW }).d, T.dim);
    P(fit(FONTS.mono(), s.note, { x, y: 278, size: 15, tracking: 0.6, maxWidth: maxW, features: ['kern'] }).d, T.faint);
  });
  return plate(T, W, H, parts.join('\n'), { title: esc(alt), grain, washX: 0.5, washY: 1.2 });
}

/** Colophon-style stack listing (奥付). */
export function stackPlate(T, rows, { grain, alt }) {
  const W = 1600, rowH = 78, top = 70;
  const H = top * 2 + rows.length * rowH;
  const parts = [];
  const P = (d, fill) => parts.push(`<path d="${d}" fill="${fill}"/>`);
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const mid = y + rowH / 2;
    if (i > 0) parts.push(`<path d="M96 ${y}H${W - 96}" stroke="${T.line}"/>`);
    P(text(FONTS.mincho(), r.ja, { x: 96, y: mid + 4, size: 25, tracking: 2 }).d, T.fg);
    P(text(FONTS.mono(), r.en, { x: 96, y: mid + 27, size: 12.5, tracking: 2.2, features: ['kern'] }).d, T.faint);
    let x = 360;
    for (const [label, ic] of r.items) {
      const icon = ic && si[ic];
      if (icon) {
        parts.push(`<path transform="translate(${x} ${mid - 15}) scale(${30 / 24})" d="${icon.path}" fill="${T.fg}" fill-opacity="0.92"/>`);
      } else {
        parts.push(`<path d="M${x + 15} ${mid - 10}l10 10-10 10-10-10z" fill="none" stroke="${T.gold}" stroke-width="1.6"/>`);
      }
      const t = text(FONTS.mono(), label, { x: x + 44, y: mid + 8, size: 22, tracking: 0.4, features: ['kern'] });
      P(t.d, T.dim);
      x += 44 + t.width + 54;
    }
    if (x > W - 80) console.warn('stack row overflows:', r.en, Math.round(x));
  });
  return plate(T, W, H, parts.join('\n'), { title: esc(alt), grain, washX: 0.9, washY: 0.1 });
}
