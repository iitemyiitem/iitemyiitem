// Shared plate chrome: ink/paper ground, washes, grain, hairline frame and
// gold registration corners — the same system the hero uses.
export function plate(T, W, H, body, { title, grain, washX = 0.85, washY = 0.5, style = '' }) {
  const dark = T.name === 'dark';
  const f = 24;
  const c = (x, y, sx, sy) => `M${x} ${y + sy * 16}V${y}H${x + sx * 16}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${title}">
${style ? `<style>${style}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>` : ''}
<defs>
<clipPath id="clip"><rect width="${W}" height="${H}" rx="18"/></clipPath>
<radialGradient id="wa" cx="${washX}" cy="${washY}" r="0.7"><stop offset="0" stop-color="${T.washA}" stop-opacity="${dark ? 0.22 : 0.05}"/><stop offset="1" stop-color="${T.washA}" stop-opacity="0"/></radialGradient>
<radialGradient id="wb" cx="${1 - washX}" cy="0" r="0.6"><stop offset="0" stop-color="${T.washB}" stop-opacity="${dark ? 0.07 : 0.12}"/><stop offset="1" stop-color="${T.washB}" stop-opacity="0"/></radialGradient>
${grain ? `<pattern id="grain" width="160" height="160" patternUnits="userSpaceOnUse"><image width="160" height="160" href="${grain}"/></pattern>` : ''}
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="${T.bg}"/>
<rect width="${W}" height="${H}" fill="url(#wa)"/>
<rect width="${W}" height="${H}" fill="url(#wb)"/>
${grain ? `<rect width="${W}" height="${H}" fill="url(#grain)" opacity="${dark ? 0.05 : 0.07}" style="mix-blend-mode:${dark ? 'screen' : 'multiply'}"/>` : ''}
<rect x="${f}" y="${f}" width="${W - 2 * f}" height="${H - 2 * f}" rx="8" fill="none" stroke="${T.line}"/>
<path d="${c(f, f, 1, 1)}${c(W - f, f, -1, 1)}${c(f, H - f, 1, -1)}${c(W - f, H - f, -1, -1)}" fill="none" stroke="${T.gold}" stroke-opacity="0.75" stroke-width="1.4"/>
${body}
</g>
</svg>`;
}
