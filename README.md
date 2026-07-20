# tem — @iitemyiitem

VRChat カルチャーの周辺を、**自動化ツール**と **Web** の両側からつくっています。
イベント運営の実務を支えるデスクトップアプリと、エッジ配信の静的サイトが主戦場です。

---

## 🛠 技術スタック

**言語**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white)

**フロントエンド**

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)

**バックエンド / インフラ**

![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages_%26_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![D1](https://img.shields.io/badge/D1-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri_2-24C8DB?style=flat-square&logo=tauri&logoColor=black)

**品質 / 開発基盤**

![pytest](https://img.shields.io/badge/pytest-0A9EDC?style=flat-square&logo=pytest&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![Ruff](https://img.shields.io/badge/Ruff-D7FF64?style=flat-square&logo=ruff&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

---

## 📦 プロジェクト

### A.R.I.S.2 — イベント運営自動化デスクトップアプリ

大規模 VRChat イベントの参加受付・抽選・招待送信を一元管理する Windows アプリ。
**個人開発の中で最も規模が大きく、Python 本体・Rust 移植 PoC・エッジバックエンドの 3 層構成**です。

| レイヤ | 構成 |
| --- | --- |
| 本体 | Python 3.11+ / `asyncio` + `aiohttp` / CustomTkinter / SQLite (WAL) |
| 同期バックエンド | TypeScript / Cloudflare Workers + D1（複数インスタンス間の状態同期） |
| 移植 PoC | Rust + Tauri 2（5 crate 構成）/ React + TypeScript + Tailwind + shadcn/ui |
| 配布 | PyInstaller / GitHub Actions によるリリース自動化 |

- **pytest 1,847 ケース・カバレッジ 96%** を CI ゲートとして運用
- Ruff + Pyright で lint と型検査を常時強制
- 認証情報は Windows **DPAPI** でユーザー単位に暗号化（パスワードは保存しない）
- WebSocket による常時接続、自動再接続・HTTP フォールバック・レート制限順守を実装

### 深海プロジェクト — [shinkai-project.com](https://shinkai-project.com)

VRChat 上のワールド体験 IP の公式サイト。**設計書を先に書き、そこから実装する**進め方で構築しました。

- Astro 7（完全静的出力）/ Tailwind CSS 4 / TypeScript 5.9 / Node 22
- React は**アイランド限定**。既定はクライアント JS ゼロ
- **ビルド時フォントサブセット化**によりトップページの実転送量 **78KB**
- Core Web Vitals 実測で全ルート予算内（トップ **LCP 807ms / CLS 0.004**）
- Vitest によるコンテンツ整合性・フォント予算・リンクポリシーの自動検証を CI ゲート化

### 本格ASMRイベント『水乃月』 — [minaduki-asmr.com](https://minaduki-asmr.com)

VRChat イベントの公式サイト。**月額 $0 での運用**を制約条件に置いた構成です。

- Astro 6 / Tailwind CSS v4 / TypeScript strict / Node 22.12+
- Cloudflare Pages に本番・ステージングの 2 環境（ステージングは `X-Robots-Tag: noindex`）
- Content Collections でお知らせ・出演者・FAQ を管理
- フォントはセルフホスト、`@astrojs/sitemap` と自作 `BaseHead.astro` で SEO 対応
- ダークモード単一のデザインシステムをトークンとして文書化

### portfolio — エッジファーストな個人サイト

- Astro 6 + TypeScript strict / Tailwind CSS v4 / Cloudflare Pages・Workers
- Vitest（ユニット）+ Playwright（e2e）の二層テスト
- ESLint flat config / Prettier / **release-please** によるリリース自動化

---

## 🎯 開発で大事にしていること

- **テストを CI ゲートにする** — カバレッジだけでなく、パフォーマンス予算やリンク切れ、フォントのグリフ網羅まで自動で落とす
- **性能を数値で管理する** — 「速い」ではなく LCP・CLS・転送量の実測値で判断する
- **ゼロコスト運用** — Cloudflare のエッジ基盤を活かし、継続課金なしで本番を維持する
- **決定を文書に残す** — 設計書・デザインシステム・技術選定の「採用理由と不採用理由」を `docs/` に残す
- **AI エージェントとの協働** — `CLAUDE.md` / `AGENTS.md` を同期させ、複数のコーディングエージェントで一貫した規約のもと開発する

---

## 📫 Contact

- GitHub: [@iitemyiitem](https://github.com/iitemyiitem)

<sub>公開リポジトリの多くは準備中です。上記プロジェクトは非公開リポジトリで開発しています。</sub>
