// Every fact baked into the README images lives here. Re-verify against the
// source repositories before changing a number, and keep README.md in sync
// (the same figures appear in its text and alt attributes).

export const WORKS = [
  {
    id: 'aris2', n: '01', category: 'DESKTOP APP · WINDOWS',
    title: 'A.R.I.S.2', titleFont: 'latin', subtitle: 'Auto Request Invite System 2',
    desc: ['大規模オンラインイベントの抽選と招待を', 'まとめて自動化するデスクトップアプリ'],
    stack: 'RUST · TAURI 2 · SQLITE · CLOUDFLARE D1', status: 'IN OPERATION',
    kind: 'app', frameLabel: 'A.R.I.S.2', src: 'aris2.jpg',
    alt: '01 A.R.I.S.2 — 大規模オンラインイベントの抽選と招待をまとめて自動化するデスクトップアプリ（Rust · Tauri 2 · SQLite · Cloudflare D1、運用中）。ログイン・集計・抽選・送信・監視のステップと参加者一覧が並ぶメイン画面',
  },
  {
    id: 'shinkai', n: '02', category: 'OFFICIAL SITE · IP', mirror: true,
    title: '深海プロジェクト', subtitle: 'SHINKAI Project',
    desc: ['没入型ワールド体験 IP の公式サイト。', '仕様書から組み立て、管理画面まで実装'],
    stack: 'ASTRO 7 · TAILWIND 4 · PAGES + D1 + R2', status: 'LIVE — shinkai-project.com', live: true,
    kind: 'browser', frameLabel: 'shinkai-project.com', src: 'shinkai.jpg',
    alt: '02 深海プロジェクト — 没入型ワールド体験 IP の公式サイト（Astro 7 · Tailwind CSS 4 · Cloudflare Pages + D1 + R2、shinkai-project.com で公開中）。光る階段の上に「仮想電子都市《深海》」の見出し',
  },
  {
    id: 'minaduki', n: '03', category: 'OFFICIAL SITE · EVENT',
    title: '水乃月', subtitle: 'Minaduki — Binaural ASMR Event',
    desc: ['バイノーラル ASMR イベントの公式サイト。', '月額 0 円で回る静的構成'],
    stack: 'ASTRO 6 · TAILWIND 4 · GSAP + LENIS', status: 'LIVE — minaduki-asmr.com', live: true,
    kind: 'browser', frameLabel: 'minaduki-asmr.com', src: 'minaduki.jpg',
    alt: '03 水乃月 — バイノーラル ASMR イベントの公式サイト（Astro 6 · Tailwind CSS 4 · GSAP + Lenis、minaduki-asmr.com で公開中）。木目と行灯の和室を背景にロゴと紹介文',
  },
  {
    id: 'iitemy', n: '04', category: 'PORTFOLIO', mirror: true,
    title: 'iitemy.com', titleFont: 'latin', subtitle: 'Design & Engineering — Japan',
    desc: ['制作物と内製ツールを並べる個人サイト。', 'React はヒーローの粒子の月だけに限定'],
    stack: 'ASTRO 6 · REACT THREE FIBER · WORKERS', status: 'LIVE — iitemy.com', live: true,
    kind: 'browser', frameLabel: 'iitemy.com', src: 'iitemy.jpg',
    alt: '04 iitemy.com — 制作物と内製ツールを並べる個人サイト（Astro 6 · React Three Fiber · Cloudflare Workers、公開中）。粒子の月を背景に「デザインと実装を、ひとつの手で。」',
  },
  {
    id: 'temistreams', n: '05', category: 'STREAMING INFRASTRUCTURE',
    title: 'TemiStreams', titleFont: 'latin', subtitle: 'Low-latency live streaming',
    desc: ['OBS の映像を低遅延で届ける自前の配信基盤。', 'VPS 1 台に Docker Compose で一式を構成'],
    stack: 'GO · MEDIAMTX · CADDY · DOCKER · UNITY', status: 'IN OPERATION',
    diagram: true, frameLabel: 'temistreams — pipeline',
    alt: '05 TemiStreams — OBS の映像を低遅延で届ける自前の配信基盤（Go · MediaMTX · Caddy · Docker · Unity、運用中）。OBS から SRT・RTMP・WHIP で MediaMTX に入り、LL-HLS・RTSP で Unity プレイヤーへ。PC での遅延は 0.5〜1.5 秒',
  },
];

// Verified 2026-10-07: A.R.I.S.2 v4.3.2 test declarations (Rust #[test] +
// #[tokio::test], ui-dist test()/it(), sync-backend it() incl. it.each cases);
// SHINKAI docs/specs/assets-and-budget.md §8.1; Minaduki CLAUDE.md §2.6;
// TemiStreams server/README.md latency table.
export const STATS = [
  { n: '01', tag: 'A.R.I.S.2', value: '548', unit: 'tests', caption: 'CI で毎回走る自動テスト', note: 'rust 313 · ui 57 · sync 178' },
  { n: '02', tag: 'SHINKAI', value: '78', unit: 'KB', caption: 'トップページのフォント転送量', note: 'build-time subset · 2026-07' },
  { n: '03', tag: 'MINADUKI', value: '¥0', unit: '/ month', caption: '月々の運用コスト', note: 'static on pages · domain excl.' },
  { n: '05', tag: 'TEMISTREAMS', value: '~1', unit: 'sec', caption: 'PC 視聴時の配信遅延', note: '0.5 – 1.5 s · srt ingest' },
];
export const STATS_ALT = '数字で見る：A.R.I.S.2 の CI で毎回走る自動テスト 548 件（Rust 313・UI 57・同期 178）／深海プロジェクトのトップページのフォント転送量 78KB（ビルド時サブセット化、2026-07 計測）／水乃月の月々の運用コスト 0 円（ドメイン代を除く）／TemiStreams の PC 視聴時の配信遅延 約 1 秒（0.5〜1.5 秒）';

// Icons are simple-icons export names; null draws a neutral diamond.
export const STACK = [
  { ja: '言語', en: 'LANGUAGES', items: [['Rust', 'siRust'], ['TypeScript', 'siTypescript'], ['Go', 'siGo'], ['C#', null], ['Python', 'siPython']] },
  { ja: 'デスクトップ', en: 'DESKTOP', items: [['Tauri 2', 'siTauri'], ['tokio', null], ['SQLite', 'siSqlite'], ['DPAPI', null]] },
  { ja: 'Web', en: 'WEB', items: [['Astro', 'siAstro'], ['Tailwind CSS', 'siTailwindcss'], ['React Three Fiber', 'siReact'], ['GSAP', 'siGsap']] },
  { ja: 'エッジ', en: 'EDGE', items: [['Workers', 'siCloudflareworkers'], ['Pages', 'siCloudflarepages'], ['D1 · R2', 'siCloudflare']] },
  { ja: '配信・3D', en: 'STREAMING · 3D', items: [['MediaMTX', null], ['Caddy', 'siCaddy'], ['Docker', 'siDocker'], ['Unity', 'siUnity']] },
  { ja: '品質', en: 'QUALITY', items: [['Vitest', 'siVitest'], ['Playwright', null], ['GitHub Actions', 'siGithubactions'], ['clippy', 'siRust'], ['Ruff', 'siRuff']] },
];
export const STACK_ALT = '技術スタック。言語：Rust、TypeScript、Go、C#、Python。デスクトップ：Tauri 2、tokio、SQLite、DPAPI。Web：Astro、Tailwind CSS、React Three Fiber、GSAP。エッジ：Cloudflare Workers、Pages、D1・R2。配信・3D：MediaMTX、Caddy、Docker、Unity。品質：Vitest、Playwright、GitHub Actions、cargo clippy、Ruff';
