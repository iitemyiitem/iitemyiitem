// A particle moon in pure SVG, after portfolio/src/components/MoonSphere.tsx:
// gold key light, crimson shadow grains, 月虹 tint on the lit rim.
// Dots are zero-length round-capped subpaths bucketed by colour, so a few
// thousand particles cost one <path> per bucket instead of one node each.
import { mix } from './theme.mjs';

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const fade = (t) => t * t * (3 - 2 * t);
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  ) * 2 - 1;
}
function fbm(x, y, z) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < 4; i++) { v += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
  return v;
}
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/**
 * Returns SVG markup (no wrapper) for the moon's particles.
 * Sparkle dots get classes tw1..tw3 so the caller can animate a shimmer.
 */
export function moonParticles({ cx, cy, r, n = 19000, theme, seed = 11 }) {
  const T = theme;
  const rand = rng(seed);
  const L = (() => { const v = [-0.66, -0.5, 0.56]; const m = Math.hypot(...v); return v.map((x) => x / m); })();
  const buckets = new Map();
  const add = (key, stroke, opacity, width, x, y, cls = '') => {
    const k = `${key}|${width}|${cls}`;
    if (!buckets.has(k)) buckets.set(k, { stroke, opacity, width, cls, pts: [] });
    buckets.get(k).pts.push([x, y]);
  };
  const dark = T.name === 'dark';
  for (let i = 0; i < n; i++) {
    let x, y, z, m;
    do { x = rand() * 2 - 1; y = rand() * 2 - 1; z = rand() * 2 - 1; m = x * x + y * y + z * z; } while (m > 1 || m < 1e-4);
    m = Math.sqrt(m); x /= m; y /= m; z /= m;
    if (z < 0.02) continue; // back hemisphere is hidden
    const lam = x * L[0] + y * L[1] + z * L[2];
    const nz = fbm(x * 2.6 + 3.1, y * 2.6 - 1.7, z * 2.6 + 0.4);
    const lit = smooth(-0.15, 0.85, lam + nz * 0.3); // 0 = night side, 1 = full key
    const rim = Math.pow(1 - z, 2.2); // 0 centre → 1 limb
    const limbLit = rim * smooth(0.0, 0.5, lam + 0.25);
    let keep;
    if (dark) keep = 0.05 + 0.5 * Math.pow(lit, 1.4) + 0.9 * limbLit;
    else keep = 0.03 + 0.62 * Math.pow(1 - lit, 1.5) + 0.55 * limbLit;
    if (rand() > keep) continue;
    const px = cx + x * r, py = cy + y * r;
    const level = Math.round(lit * 8);
    const tt = level / 8;
    let color, alpha, key = `l${level}`;
    if (dark) {
      color = tt < 0.55 ? mix(T.crimson600, T.gold, tt / 0.55) : mix(T.gold, T.goldHi, (tt - 0.55) / 0.45);
      alpha = 0.22 + 0.78 * Math.pow(tt, 0.9);
    } else {
      color = tt < 0.5 ? mix('#2b1d17', T.crimson600, tt / 0.5) : mix(T.crimson600, T.gold, (tt - 0.5) / 0.5);
      alpha = 0.85 - 0.35 * tt;
    }
    // 月虹 — spectral tint on the lit limb: gold → rose → pale blue
    if (limbLit > 0.45 && rand() < 0.7) {
      const ang = Math.atan2(y, x);
      const band = ang < -2.2 || ang > 2.6 ? 'blue' : ang < -1.2 ? 'rose' : null;
      if (band) { color = band === 'blue' ? T.blue : T.rose; key = band; alpha = dark ? 0.95 : 0.8; }
      else { color = dark ? T.goldHi : T.gold; key = 'limb'; alpha = dark ? 1 : 0.85; }
    }
    const big = rand() < (dark ? 0.04 + 0.22 * tt : 0.1);
    const w = big ? 2.6 : 1.5;
    const sparkle = dark && tt > 0.6 && rand() < 0.14;
    add(key, color, alpha.toFixed(2), w, px, py, sparkle ? `tw${1 + Math.floor(rand() * 3)}` : '');
  }
  let out = '';
  for (const b of buckets.values()) {
    let d = '';
    let lx = 0, ly = 0, first = true;
    for (const [x, y] of b.pts) {
      const rx = Math.round(x * 2) / 2, ry = Math.round(y * 2) / 2;
      if (first) { d += `M${rx} ${ry}h0`; first = false; }
      else d += `m${+(rx - lx).toFixed(1)} ${+(ry - ly).toFixed(1)}h0`;
      lx = rx; ly = ry;
    }
    d = d.replace(/ -/g, '-');
    out += `<path${b.cls ? ` class="${b.cls}"` : ''} d="${d}" stroke="${b.stroke}" stroke-opacity="${b.opacity}" stroke-width="${b.width}"/>`;
  }
  return out;
}
