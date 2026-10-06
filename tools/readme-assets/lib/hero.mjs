import { FONTS, text, vtext, esc } from './text.mjs';
import { moonParticles, rng } from './moon.mjs';

const W = 1600, H = 640;

export function hero(T, { grain }) {
  const dark = T.name === 'dark';
  const M = 96; // left margin inside the frame
  const parts = [];
  const p = (d, fill, extra = '') => parts.push(`<path d="${d}" fill="${fill}"${extra}/>`);

  // ── wordmark + handle
  const wm = text(FONTS.latin(500), 'iitemy', { x: M, y: 104, size: 40 });
  p(wm.d, T.fg);
  p(text(FONTS.latin(500), '.', { x: M + wm.width + 1, y: 104, size: 40 }).d, T.crimson);
  p(text(FONTS.mono(), 'tem / @iitemyiitem', { x: W - M, y: 588, size: 16, tracking: 2, anchor: 'end', features: ['kern'] }).d, T.faint);

  // ── eyebrow, headline, lead
  p(text(FONTS.latinItalic(400), 'Design & Engineering — Japan', { x: M, y: 228, size: 31, features: ['kern', 'liga'] }).d, T.gold);
  p(text(FONTS.mincho(), 'デザインと実装を、', { x: M - 4, y: 340, size: 94, tracking: 2 }).d, T.fg);
  p(text(FONTS.mincho(), 'ひとつの手で。', { x: M - 4, y: 458, size: 94, tracking: 2 }).d, T.crimson);
  p(text(FONTS.gothic(), 'オンラインイベントと IP のための、公式サイト・キービジュアル・運営ツール', { x: M, y: 524, size: 24, tracking: 1 }).d, T.dim);

  // ── works index (mirrors the README's numbering)
  const idx = [['01', 'A.R.I.S.2'], ['02', 'SHINKAI'], ['03', 'MINADUKI'], ['04', 'IITEMY.COM'], ['05', 'TEMISTREAMS']];
  let ix = M;
  for (const [n, label] of idx) {
    const a = text(FONTS.monoMedium(), n, { x: ix, y: 588, size: 16, tracking: 1.4, features: ['kern'] });
    p(a.d, T.gold);
    const b = text(FONTS.mono(), label, { x: ix + a.width + 9, y: 588, size: 16, tracking: 1.6, features: ['kern'] });
    p(b.d, T.faint);
    ix += a.width + 9 + b.width + 26;
  }

  // ── vertical caption, as on iitemy.com
  p(vtext(FONTS.gothic(), '日本を拠点に', { x: W - 52, y: 232, size: 16, tracking: 8 }).d, T.faint);

  // ── moon
  const cx = 1218, cy = 322, r = 214;
  const ticks = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const major = i % 10 === 0;
    const r1 = 252, r2 = major ? 263 : 257;
    const f = (v) => +v.toFixed(1);
    ticks.push(`M${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r2)} ${f(cy + Math.sin(a) * r2)}`);
  }
  const majors = ticks.filter((_, i) => i % 10 === 0).join('');
  const minors = ticks.filter((_, i) => i % 10 !== 0).join('');

  // ── drifting gold dust
  const rand = rng(23);
  const dust = [];
  for (let i = 0; i < 54; i++) {
    const nearMoon = i < 30;
    let x, y;
    do {
      x = nearMoon ? cx + (rand() * 2 - 1) * 330 : 40 + rand() * (W - 80);
      y = nearMoon ? cy + (rand() * 2 - 1) * 280 : 40 + rand() * (H - 80);
      // keep the type block and the bottom index row clear of dust
    } while ((x < 1010 && y > 66 && y < 610) || (x > 1260 && y > 560) || x > 1520);
    const rr = (0.7 + rand() * 1.3).toFixed(2);
    const dur = (9 + rand() * 9).toFixed(1);
    const del = (-rand() * 18).toFixed(1);
    dust.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr}" style="animation-duration:${dur}s;animation-delay:${del}s"/>`);
  }

  const frame = 24;
  const corner = (x, y, sx, sy) => `M${x} ${y + sy * 18}V${y}H${x + sx * 18}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t">
<title id="t">${esc('tem / iitemy — デザインと実装を、ひとつの手で。')}</title>
<style>
.dial{transform-origin:${cx}px ${cy}px;animation:dial-in 2.6s cubic-bezier(.16,.8,.24,1) both}
.dial2{transform-origin:${cx}px ${cy}px;animation:dial-in2 2.6s cubic-bezier(.16,.8,.24,1) both}
.halo{animation:fade 2.2s ease-out both}.moon{animation:moon-in 1.8s ease-out both}
.dust circle{fill:${T.goldHi};opacity:${dark ? 0.7 : 0.5}}.dust{animation:rise 3s cubic-bezier(.2,.7,.2,1) .3s both}
.tw1,.tw2,.tw3{animation:blink 2.6s steps(1,end) infinite}
.tw2{animation-delay:-.9s;animation-duration:3.4s}
.tw3{animation-delay:-1.7s;animation-duration:4.2s}
@keyframes dial-in{from{transform:rotate(-48deg);opacity:0}to{transform:none;opacity:1}}@keyframes dial-in2{from{transform:rotate(36deg);opacity:0}to{transform:none;opacity:1}}
@keyframes fade{from{opacity:0}}@keyframes moon-in{from{opacity:0}}
@keyframes rise{from{opacity:0;transform:translateY(22px)}}
@keyframes blink{0%{opacity:1}50%{opacity:.2}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<defs>
<clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
<radialGradient id="washA" cx="0.8" cy="0.55" r="0.62"><stop offset="0" stop-color="${T.washA}" stop-opacity="${T.washAOpacity}"/><stop offset="1" stop-color="${T.washA}" stop-opacity="0"/></radialGradient>
<radialGradient id="washB" cx="0.06" cy="0.02" r="0.55"><stop offset="0" stop-color="${T.washB}" stop-opacity="${T.washBOpacity}"/><stop offset="1" stop-color="${T.washB}" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop offset="0.5" stop-color="${dark ? T.crimson600 : T.crimson}" stop-opacity="0"/><stop offset="0.64" stop-color="${dark ? T.crimson600 : T.crimson}" stop-opacity="${dark ? 0.3 : 0.05}"/><stop offset="1" stop-color="${dark ? T.crimson600 : T.crimson}" stop-opacity="0"/></radialGradient>
<radialGradient id="body" cx="0.3" cy="0.27" r="0.9"><stop offset="0" stop-color="${dark ? T.gold : '#ffffff'}" stop-opacity="${dark ? 0.22 : 0.5}"/><stop offset="0.45" stop-color="${dark ? T.crimson600 : T.gold}" stop-opacity="${dark ? 0.14 : 0.06}"/><stop offset="1" stop-color="${dark ? '#000000' : '#5a2a22'}" stop-opacity="${dark ? 0.55 : 0.16}"/></radialGradient>
<pattern id="grain" width="160" height="160" patternUnits="userSpaceOnUse"><image width="160" height="160" href="${grain}"/></pattern>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="${T.bg}"/>
<rect width="${W}" height="${H}" fill="url(#washA)"/>
<rect width="${W}" height="${H}" fill="url(#washB)"/>
<g class="halo"><circle cx="${cx}" cy="${cy}" r="${r * 1.55}" fill="url(#halo)"/></g>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#body)"/>
<g class="dial2"><circle cx="${cx}" cy="${cy}" r="236" fill="none" stroke="${T.gold}" stroke-opacity="${dark ? 0.32 : 0.45}" stroke-dasharray="1 9" stroke-linecap="round" stroke-width="1.6"/></g>
<g class="dial" fill="none" stroke-linecap="round">
<circle cx="${cx}" cy="${cy}" r="252" stroke="${T.lineWarm}" stroke-width="1"/>
<path d="${minors}" stroke="${T.lineWarm}" stroke-width="1"/>
<path d="${majors}" stroke="${T.gold}" stroke-opacity="0.8" stroke-width="1.4"/>
</g>
<g class="moon" fill="none" stroke-linecap="round">${moonParticles({ cx, cy, r, theme: T })}</g>
<g class="dust">${dust.join('')}</g>
<rect width="${W}" height="${H}" fill="url(#grain)" opacity="${dark ? 0.05 : 0.07}" style="mix-blend-mode:${dark ? 'screen' : 'multiply'}"/>
<rect x="${frame}" y="${frame}" width="${W - frame * 2}" height="${H - frame * 2}" rx="8" fill="none" stroke="${T.line}"/>
<path d="${corner(frame, frame, 1, 1)}${corner(W - frame, frame, -1, 1)}${corner(frame, H - frame, 1, -1)}${corner(W - frame, H - frame, -1, -1)}" fill="none" stroke="${T.gold}" stroke-opacity="0.75" stroke-width="1.4"/>
${parts.join('\n')}
</g>
</svg>`;
}
