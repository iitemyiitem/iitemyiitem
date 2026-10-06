import { createRequire } from 'node:module';
import { FONTS, text, fit, esc } from './text.mjs';
import { plate } from './frame.mjs';

const require = createRequire(import.meta.url);
const si = require('simple-icons');

export const W = 1600, H = 700;
const MW = 900; // media width
const BAR = 36;
const MH = BAR + Math.round((MW * 10) / 16);
const CW = W - 72 - MW - 88 - 96; // caption column width

function icon(name, x, y, size, fill) {
  const ic = si[name];
  if (!ic) return '';
  const s = size / 24;
  return `<path transform="translate(${x} ${y}) scale(${s})" d="${ic.path}" fill="${fill}"/>`;
}

/** Window chrome around a screenshot (browser for sites, title bar for the app). */
function windowFrame(T, x, y, { kind, label, image, inner = '' }) {
  const dark = T.name === 'dark';
  const barFill = dark ? '#16130f' : '#ebe4d8';
  const out = [];
  out.push(`<defs><clipPath id="win"><rect x="${x}" y="${y}" width="${MW}" height="${MH}" rx="10"/></clipPath>
<filter id="shadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="${dark ? 0.55 : 0.18}"/></filter></defs>`);
  out.push(`<rect x="${x}" y="${y}" width="${MW}" height="${MH}" rx="10" fill="${barFill}" filter="url(#shadow)"/>`);
  out.push(`<g clip-path="url(#win)">`);
  out.push(`<rect x="${x}" y="${y}" width="${MW}" height="${BAR}" fill="${barFill}"/>`);
  if (kind === 'browser') {
    for (let i = 0; i < 3; i++) out.push(`<circle cx="${x + 22 + i * 18}" cy="${y + BAR / 2}" r="5" fill="none" stroke="${T.lineWarm}" stroke-width="1.4"/>`);
    const pillW = 300;
    const px = x + MW / 2 - pillW / 2;
    out.push(`<rect x="${px}" y="${y + 8}" width="${pillW}" height="${BAR - 16}" rx="10" fill="${dark ? '#0f0d0b' : '#f6f1e8'}" stroke="${T.line}"/>`);
    out.push(`<path d="${text(FONTS.mono(), label, { x: x + MW / 2, y: y + BAR / 2 + 5, size: 13, anchor: 'middle', features: ['kern'] }).d}" fill="${T.dim}"/>`);
  } else {
    out.push(`<path d="${text(FONTS.mono(), label, { x: x + 18, y: y + BAR / 2 + 5, size: 13, tracking: 1, features: ['kern'] }).d}" fill="${T.dim}"/>`);
    const cx = x + MW - 26, cy = y + BAR / 2, k = 5;
    out.push(`<g fill="none" stroke="${T.faint}" stroke-width="1.3"><path d="M${cx - 2 * 34 - k} ${cy}h${2 * k}"/><rect x="${cx - 34 - k}" y="${cy - k}" width="${2 * k}" height="${2 * k}"/><path d="M${cx - k} ${cy - k}l${2 * k} ${2 * k}m0 ${-2 * k}l${-2 * k} ${2 * k}"/></g>`);
  }
  if (image) out.push(`<image x="${x}" y="${y + BAR}" width="${MW}" height="${MH - BAR}" preserveAspectRatio="xMidYMin slice" href="${image}"/>`);
  out.push(inner);
  out.push(`</g>`);
  out.push(`<rect x="${x + 0.5}" y="${y + 0.5}" width="${MW - 1}" height="${MH - 1}" rx="10" fill="none" stroke="${dark ? '#ffffff' : '#000000'}" stroke-opacity="${dark ? 0.08 : 0.08}"/>`);
  return out.join('\n');
}

/** TemiStreams pipeline diagram, drawn inside the same window chrome. */
function pipeline(T, x, y) {
  const dark = T.name === 'dark';
  const out = [];
  const node = (nx, ny, w, h, title, sub, ic, accent = false) => {
    out.push(`<rect x="${nx}" y="${ny}" width="${w}" height="${h}" rx="10" fill="${dark ? '#171410' : '#f7f2ea'}" stroke="${accent ? T.gold : T.lineWarm}" stroke-width="${accent ? 1.4 : 1}"/>`);
    let tx = nx + 20;
    if (ic) { out.push(icon(ic, nx + 20, ny + h / 2 - 13, 26, T.fg)); tx += 40; }
    out.push(`<path d="${text(FONTS.monoMedium(), title, { x: tx, y: ny + h / 2 - 2, size: 19, features: ['kern'] }).d}" fill="${T.fg}"/>`);
    out.push(`<path d="${text(FONTS.mono(), sub, { x: tx, y: ny + h / 2 + 22, size: 13.5, features: ['kern'] }).d}" fill="${T.faint}"/>`);
  };
  const lab = (lx, ly, s, anchor = 'middle', fill = T.gold) =>
    out.push(`<path d="${text(FONTS.mono(), s, { x: lx, y: ly, size: 13.5, tracking: 0.6, anchor, features: ['kern'] }).d}" fill="${fill}"/>`);
  const iy = y + BAR; // inner top
  const ih = MH - BAR;
  out.push(`<rect x="${x}" y="${iy}" width="${MW}" height="${ih}" fill="${dark ? '#0f0d0b' : '#f3ede3'}"/>`);
  // faint grid
  let grid = '';
  for (let gx = x + 30; gx < x + MW; gx += 30) grid += `M${gx} ${iy}v${ih}`;
  for (let gy = iy + 30; gy < iy + ih; gy += 30) grid += `M${x} ${gy}h${MW}`;
  out.push(`<path d="${grid}" stroke="${T.line}" stroke-opacity="${dark ? 0.55 : 0.5}" stroke-width="1"/>`);

  const rowY = iy + 168, nh = 84;
  const A = { x: x + 36, w: 180 }, B = { x: x + 360, w: 200 }, C = { x: x + 704, w: 160 };
  node(A.x, rowY, A.w, nh, 'OBS', 'encoder', 'siObsstudio');
  node(B.x, rowY, B.w, nh, 'MediaMTX', 'docker · vps', null, true);
  node(C.x, rowY, C.w, nh, 'Player', 'unity', 'siUnity');
  // flows; protocol names stack under each arrow
  const fy = rowY + nh / 2;
  out.push(`<g fill="none" stroke="${T.gold}" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 10"><path d="M${A.x + A.w + 8} ${fy}H${B.x - 12}"/><path d="M${B.x + B.w + 8} ${fy}H${C.x - 12}"/></g>`);
  out.push(`<path d="M${B.x - 20} ${fy - 6}l8 6-8 6M${C.x - 20} ${fy - 6}l8 6-8 6" fill="none" stroke="${T.gold}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
  const stack = (sx, list) => list.forEach((s, i) => lab(sx, fy + 34 + i * 21, s));
  stack((A.x + A.w + B.x) / 2, ['SRT', 'RTMP', 'WHIP']);
  stack((B.x + B.w + C.x) / 2, ['LL-HLS', 'RTSP']);
  lab((A.x + A.w + B.x) / 2, fy - 16, 'ingest', 'middle', T.faint);
  lab((B.x + B.w + C.x) / 2, fy - 16, 'playback', 'middle', T.faint);

  // control plane under MediaMTX
  const cyy = rowY + nh + 110;
  node(x + 210, cyy, 240, 76, 'Go console', 'keys · auth hook', 'siGo');
  node(x + 480, cyy, 190, 76, 'Caddy', 'https', 'siCaddy');
  out.push(`<path d="M${x + 400} ${cyy}V${rowY + nh + 8}M${x + 520} ${cyy}V${rowY + nh + 8}" fill="none" stroke="${T.lineWarm}" stroke-width="1.4" stroke-dasharray="3 5"/>`);

  // footer
  out.push(`<path d="M${x} ${iy + ih - 46}h${MW}" stroke="${T.line}"/>`);
  out.push(`<path d="${text(FONTS.mono(), '1 × VPS  ·  docker compose  ·  srt link quality: rtt / loss', { x: x + 24, y: iy + ih - 18, size: 13.5, tracking: 0.4, features: ['kern'] }).d}" fill="${T.faint}"/>`);

  // latency bracket
  const by = iy + 92;
  out.push(`<path d="M${A.x + 10} ${by + 12}V${by}H${C.x + C.w - 10}V${by + 12}" fill="none" stroke="${T.crimson}" stroke-width="1.6"/>`);
  const t = text(FONTS.monoMedium(), 'glass-to-glass  0.5 – 1.5 s  (PC)', { x: x + MW / 2, y: by - 14, size: 15, tracking: 0.6, anchor: 'middle', features: ['kern'] });
  out.push(`<rect x="${t.x0 - 12}" y="${by - 34}" width="${t.width + 24}" height="28" fill="${dark ? '#0f0d0b' : '#f3ede3'}"/>`);
  out.push(`<path d="${t.d}" fill="${T.crimsonText}"/>`);
  return out.join('\n');
}

export function workPlate(T, w, { grain, image }) {
  const dark = T.name === 'dark';
  const mirror = w.mirror;
  const mx = mirror ? 72 : W - 72 - MW;
  const my = Math.round((H - MH) / 2);
  const cx = mirror ? MW + 72 + 88 : 96; // caption left edge
  const parts = [];
  const P = (d, fill) => parts.push(`<path d="${d}" fill="${fill}"/>`);

  // caption block
  let y = 168 + (w.shift ?? 0);
  const num = text(FONTS.latin(400), w.n, { x: cx - 4, y, size: 116, features: ['kern', 'lnum'] });
  P(num.d, T.gold);
  P(text(FONTS.mono(), w.category, { x: cx + num.width + 20, y: y - 14, size: 18, tracking: 2.4, features: ['kern'] }).d, T.faint);
  y += 98;
  if (w.titleFont === 'latin') P(fit(FONTS.latin(500), w.title, { x: cx - 2, y, size: 76, maxWidth: CW, features: ['kern', 'liga', 'lnum'] }).d, T.fg);
  else P(fit(FONTS.mincho(), w.title, { x: cx - 4, y, size: 66, tracking: 3, maxWidth: CW }).d, T.fg);
  y += 46;
  P(fit(FONTS.latinItalic(400), w.subtitle, { x: cx, y, size: 28, maxWidth: CW, features: ['kern', 'liga', 'lnum'] }).d, T.gold);
  y += 58;
  for (const line of w.desc) {
    P(fit(FONTS.gothic(), line, { x: cx, y, size: 24, tracking: 0.6, maxWidth: CW }).d, T.dim);
    y += 38;
  }
  y += 14;
  parts.push(`<path d="M${cx} ${y}h64" stroke="${T.gold}" stroke-width="1.4"/>`);
  y += 42;
  P(fit(FONTS.mono(), w.stack, { x: cx, y, size: 18, tracking: 1.4, maxWidth: CW, features: ['kern'] }).d, T.dim);
  y += 36;
  parts.push(`<circle cx="${cx + 6}" cy="${y - 6.5}" r="5.5" fill="${w.live ? T.crimsonText : T.gold}"/>`);
  if (w.live) parts.push(`<circle cx="${cx + 6}" cy="${y - 6.5}" r="10" fill="none" stroke="${T.crimsonText}" stroke-opacity="0.35" stroke-width="1.2"/>`);
  P(fit(FONTS.monoMedium(), w.status, { x: cx + 22, y, size: 18, tracking: 1.4, maxWidth: CW - 22, features: ['kern'] }).d, T.fg);

  const media = w.diagram
    ? windowFrame(T, mx, my, { kind: 'app', label: w.frameLabel, inner: pipeline(T, mx, my) })
    : windowFrame(T, mx, my, { kind: w.kind, label: w.frameLabel, image });

  const style = '';
  return plate(T, W, H, media + '\n' + parts.join('\n'), { title: esc(w.alt), grain, washX: mirror ? 0.15 : 0.85, style });
}
