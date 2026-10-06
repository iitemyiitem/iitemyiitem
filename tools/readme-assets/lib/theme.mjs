// 月虹 GEKKOU palette, mirrored from portfolio/src/styles/global.css (dark),
// plus a paper counterpart for GitHub's light theme.
export const THEMES = {
  dark: {
    name: 'dark',
    bg: '#0c0b0a',
    lift: '#141210',
    card: '#1a1815',
    fg: '#ede6d8',
    dim: '#a89f8e',
    faint: '#8b8376',
    line: '#292521',
    lineWarm: '#3b342c',
    gold: '#c9a86a',
    goldHi: '#e8cf9a',
    crimson: '#d4324a',
    crimsonText: '#e8556b',
    crimsonDeep: '#7a0014',
    crimson600: '#b8001f',
    rose: '#db8c9e',
    blue: '#94addb',
    washA: '#7a0014', // crimson wash
    washB: '#c9a86a', // gold wash
    washAOpacity: 0.34,
    washBOpacity: 0.09,
  },
  light: {
    name: 'light',
    bg: '#f4efe6',
    lift: '#ece5d9',
    card: '#e6decf',
    fg: '#1a1612',
    dim: '#5b5348',
    faint: '#6f665a',
    line: '#ddd3c3',
    lineWarm: '#cdbfa9',
    gold: '#8a6a2c',
    goldHi: '#a8843f',
    crimson: '#b8001f',
    crimsonText: '#b8001f',
    crimsonDeep: '#7a0014',
    crimson600: '#b8001f',
    rose: '#b0566c',
    blue: '#4f6c9e',
    washA: '#d4324a',
    washB: '#c9a86a',
    washAOpacity: 0.07,
    washBOpacity: 0.16,
  },
};

export function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mix(a, b, t) {
  const A = hex(a), B = hex(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
