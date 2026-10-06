<a id="top"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light.svg">
  <img src="assets/hero-dark.svg" width="100%" alt="iitemy — デザインと実装を、ひとつの手で。オンラインイベントと IP のための、公式サイト・キービジュアル・運営ツール。tem / @iitemyiitem">
</picture>

<p align="center">
オンラインイベントや IP を中心に、公式サイトの設計・実装、キービジュアルの制作、<br>
運営を支えるツール開発までを手がけています。
</p>

<p align="center">
<a href="https://iitemy.com"><b>iitemy.com</b></a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://iitemy.com/contact">お仕事のご相談</a>
</p>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/stats-light.svg">
  <img src="assets/stats-dark.svg" width="100%" alt="数字で見る：A.R.I.S.2 の CI で毎回走る自動テスト 548 件（Rust 313・UI 57・同期 178）／深海プロジェクトのトップページのフォント転送量 78KB（ビルド時サブセット化、2026-07 計測）／水乃月の月々の運用コスト 0 円（ドメイン代を除く）／TemiStreams の PC 視聴時の配信遅延 約 1 秒（0.5〜1.5 秒）">
</picture>

<a id="works"></a>

## 作品

<a id="aris2"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/work-aris2-light.svg">
  <img src="assets/work-aris2-dark.svg" width="100%" alt="01 A.R.I.S.2 — 大規模オンラインイベントの抽選と招待をまとめて自動化するデスクトップアプリ（Rust · Tauri 2 · SQLite · Cloudflare D1、運用中）。ログイン・集計・抽選・送信・監視のステップと参加者一覧が並ぶメイン画面">
</picture>

**A.R.I.S.2 — Auto Request Invite System 2**<br>
<sub>v4.3.2（2026-09）運用中　·　<a href="https://iitemy.com/works/aris2">制作事例 →</a></sub>

大規模オンラインイベント向けの抽選・招待自動管理デスクトップアプリ（Windows 10/11）。参加申込の集計、参加履歴で重み付けした抽選、招待送信、入場管理を 1 つのアプリに集約しています。**v4.0 で Python 実装を Rust + Tauri 2 に全面移植**した、個人開発で最大規模のプロジェクトです。

- API と WebSocket を常時接続し、指数バックオフ再接続・HTTP フォールバック・429 リトライで集計を止めない
- 認証情報は Windows **DPAPI** でユーザー単位に暗号化し、パスワードは保存しない
- 複数インスタンス同時開催時の重複申込を同期バックエンド側で自動除外。過去開催は読み取り専用で閲覧できる

<details>
<summary><b>構成とテスト</b></summary>
<br>

| レイヤ | 構成 |
| --- | --- |
| デスクトップ本体 | Rust 1.95+ / tokio / reqwest / tokio-tungstenite / Tauri 2（6 crate 構成）/ SQLite (WAL) |
| フロントエンド | 依存ライブラリなしの HTML / CSS / JavaScript |
| 同期バックエンド | TypeScript / Cloudflare Workers + D1（複数インスタンス間の状態同期） |
| 配布 | GitHub Actions でリリースを自動化。非公開リポジトリでも動くアプリ内自動更新 |

- CI ゲート: `cargo fmt --check` / `cargo clippy -D warnings` / テスト Rust 313・フロント 57・同期バックエンド 178
- 旧 Python 実装（pytest 1,907 ケース）は `legacy/` に凍結し、Ruff + Pyright を CI で維持

</details>

<br>

<a id="shinkai"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/work-shinkai-light.svg">
  <img src="assets/work-shinkai-dark.svg" width="100%" alt="02 深海プロジェクト — 没入型ワールド体験 IP の公式サイト（Astro 7 · Tailwind CSS 4 · Cloudflare Pages + D1 + R2、shinkai-project.com で公開中）。光る階段の上に「仮想電子都市《深海》」の見出し">
</picture>

**深海プロジェクト 公式サイト**<br>
<sub><a href="https://shinkai-project.com">shinkai-project.com</a>（2026-10-01 公開）　·　<a href="https://iitemy.com/works/shinkai-project-web">制作事例 →</a></sub>

没入型のワールド体験 IP「深海プロジェクト」の公式サイト。**4 部構成の仕様書（第 2 部は 9 分冊）を先に書き、そこから実装する**進め方で構築しました。

- Astro 7 の完全静的出力。UI フレームワークは使わず、クライアント JS はインライン **4KB**・外部モジュール **8KB**（brotli）の予算を CI で強制
- **ビルド時フォントサブセット化**で、トップのフォント転送量 **78KB**・ページ全体 **109KB**（2026-07 計測）
- 公開直後のモバイル監査で `/characters/` の初回転送量を **1,960KB → 442KB** に削減（2026-10）
- 管理コンソールでキャラクター・イベント・世界観・作品・お知らせと各ページの文言を編集し、「公開」から GitHub Actions で再ビルド

<details>
<summary><b>構成とテスト</b></summary>
<br>

| レイヤ | 構成 |
| --- | --- |
| サイト | Astro 7（静的出力）/ Tailwind CSS 4 / TypeScript 5.9 / Node 22 |
| ホスティング | Cloudflare Pages。本番は毎日再ビルドして鮮度を確認 |
| 管理コンソール | Cloudflare Pages Functions + D1 + R2、編集内容をその場でプレビュー |

- Vitest 51 ファイルでコンテンツ整合性・フォント予算とグリフ網羅・リンクポリシー・管理用 SQL を検証（本番デプロイ時 1,379 テスト）
- Core Web Vitals はトップ **LCP 807ms / CLS 0.0044**（2026-07、仮素材での計測）

</details>

<br>

<a id="minaduki"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/work-minaduki-light.svg">
  <img src="assets/work-minaduki-dark.svg" width="100%" alt="03 水乃月 — バイノーラル ASMR イベントの公式サイト（Astro 6 · Tailwind CSS 4 · GSAP + Lenis、minaduki-asmr.com で公開中）。木目と行灯の和室を背景にロゴと紹介文">
</picture>

**本格ASMRイベント『水乃月』公式サイト**<br>
<sub><a href="https://minaduki-asmr.com">minaduki-asmr.com</a>　·　<a href="https://iitemy.com/works/minaduki-web">制作事例 →</a></sub>

バイノーラル ASMR イベントの公式サイト。**月額・年額とも 0 円（ドメイン代を除く）での運用**を設計条件に置いた静的構成です。

- Astro 6 / Tailwind CSS 4 / TypeScript strict。出演者情報は Content Collections（Zod スキーマ）で型付き管理
- Cloudflare Pages に本番・ステージングの 2 環境。ステージングと `*.pages.dev` は `X-Robots-Tag: noindex`
- ダークモード単一のデザインシステムをトークンとして文書化し、GSAP + Lenis でモーションを設計
- フォントはセルフホスト、`@astrojs/sitemap` と自作 `BaseHead.astro` で SEO に対応

<br>

<a id="portfolio"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/work-iitemy-light.svg">
  <img src="assets/work-iitemy-dark.svg" width="100%" alt="04 iitemy.com — 制作物と内製ツールを並べる個人サイト（Astro 6 · React Three Fiber · Cloudflare Workers、公開中）。粒子の月を背景に「デザインと実装を、ひとつの手で。」">
</picture>

**iitemy.com — 個人ポートフォリオ**<br>
<sub><a href="https://iitemy.com">iitemy.com</a>　·　<a href="https://iitemy.com/works/edge-first-portfolio">制作事例 →</a></sub>

Web 制作物・キービジュアル・ポスター・内製ツールを展示する個人サイト。

- Astro 6 + TypeScript strict / Tailwind CSS 4 / Cloudflare Workers（Static Assets）
- React 19 + React Three Fiber は、ヒーローで 32,000 粒子の月を描くアイランド 1 か所だけ。ほかはすべてサーバーレンダリング
- Vitest（ユニット 120 ケース）+ Playwright（e2e 14 本をデスクトップ Chrome / Pixel 7 の 2 環境で実行）
- ESLint flat config / Prettier / **release-please** によるリリース自動化、Pages CMS でコンテンツ編集

<br>

<a id="temistreams"></a>

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/work-temistreams-light.svg">
  <img src="assets/work-temistreams-dark.svg" width="100%" alt="05 TemiStreams — OBS の映像を低遅延で届ける自前の配信基盤（Go · MediaMTX · Caddy · Docker · Unity、運用中）。OBS から SRT・RTMP・WHIP で MediaMTX に入り、LL-HLS・RTSP で Unity プレイヤーへ。PC での遅延は 0.5〜1.5 秒">
</picture>

**TemiStreams — 低遅延ライブ配信基盤**<br>
<sub>VPS 1 台で運用中</sub>

OBS から送った映像を、PC なら 0.5〜1.5 秒の遅延で視聴できる自前の配信基盤です。

- Docker Compose で一式を構成し、VPS の上り帯域と同時視聴者数から必要スペックを見積もり
- 取り込みはパケットロスに強い SRT を推奨。RTMP / WebRTC（WHIP）も同じキーで受け付ける
- 配信用トークンと視聴用パスを分離し、1 つのストリームキーを複数の配信者で共有できる

<details>
<summary><b>構成</b></summary>
<br>

| レイヤ | 構成 |
| --- | --- |
| 配信サーバー | MediaMTX（SRT / RTMP / WHIP で受信 → RTSP / LL-HLS で再配信。H264 / AAC の修正パッチ版） |
| 管理アプリ | Go / SQLite（ストリームキーの発行、認証フック、配信状態と SRT 回線品質の表示） |
| HTTPS | Caddy（管理画面 / HLS / WHIP） |
| クライアント | Unity（C#）製の同期再生プレイヤーと、シーンへ配置する Editor 拡張 |

</details>

<sub>いずれも非公開リポジトリで開発しています。</sub>

<a id="stack"></a>

## 技術スタック

<picture>
  <source media="(prefers-color-scheme: light)" srcset="assets/stack-light.svg">
  <img src="assets/stack-dark.svg" width="100%" alt="技術スタック。言語：Rust、TypeScript、Go、C#、Python。デスクトップ：Tauri 2、tokio、SQLite、DPAPI。Web：Astro、Tailwind CSS、React Three Fiber、GSAP。エッジ：Cloudflare Workers、Pages、D1・R2。配信・3D：MediaMTX、Caddy、Docker、Unity。品質：Vitest、Playwright、GitHub Actions、cargo clippy、Ruff">
</picture>

<a id="principles"></a>

## 開発で大事にしていること

**01　テストを CI ゲートにする**<br>
カバレッジだけでなく、性能予算・リンク切れ・フォントのグリフ網羅まで、壊れたら自動で落ちるようにする。

**02　性能を数値で管理する**<br>
「速い」ではなく LCP・CLS・転送量の実測値で判断し、計測日とともに記録する。

**03　固定費を小さく保つ**<br>
静的サイトは Cloudflare のエッジで継続課金なしに運用し、サーバーが要る配信基盤だけを VPS 1 台に収める。

**04　決定を文書に残す**<br>
仕様書・デザインシステム・技術選定の「採用理由と不採用理由」を `docs/` に残してから作る。

**05　AI エージェントと協働する**<br>
`CLAUDE.md` / `AGENTS.md` を同期させ、複数のコーディングエージェントが同じ規約で開発できるようにする。

## 連絡先

- Portfolio — [iitemy.com](https://iitemy.com)
- お仕事のご相談 — [iitemy.com/contact](https://iitemy.com/contact)

<p align="right"><sub><a href="#top">↑ ページの先頭へ</a></sub></p>
