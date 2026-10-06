### デザインと実装を、ひとつの手で。

オンラインイベントや IP の公式サイト、キービジュアル、運営を支えるツールをつくっている tem です。

[iitemy.com](https://iitemy.com) · [お仕事のご相談](https://iitemy.com/contact)

#### Projects

- **[A.R.I.S.2](https://iitemy.com/works/aris2)** — 大規模オンラインイベントの抽選・招待を自動化する Windows アプリ<br>
  <sub>Rust · Tauri 2 · SQLite · Cloudflare Workers + D1 · v4.3.2</sub>
- **[深海プロジェクト 公式サイト](https://shinkai-project.com)** — 没入型ワールド体験 IP の公式サイトと管理コンソール。2026 年 10 月公開<br>
  <sub>Astro 7 · Tailwind CSS 4 · Cloudflare Pages + D1 + R2</sub>
- **[水乃月 公式サイト](https://minaduki-asmr.com)** — バイノーラル ASMR イベントの公式サイト。月額 0 円で運用する静的構成<br>
  <sub>Astro 6 · Tailwind CSS 4 · Cloudflare Pages</sub>
- **[iitemy.com](https://iitemy.com)** — ポートフォリオ。React はヒーローの 3D 表現 1 か所だけに限定<br>
  <sub>Astro 6 · React Three Fiber · Cloudflare Workers</sub>
- **TemiStreams** — OBS の映像を PC で 0.5〜1.5 秒の遅延で届ける自前の配信基盤<br>
  <sub>Go · MediaMTX · Caddy · Docker · Unity</sub>

<sub>いずれも非公開リポジトリで開発しています。</sub>

#### Tech

Rust · TypeScript · Go · C# · Python<br>
Tauri · Astro · Tailwind CSS · React Three Fiber · Unity<br>
Cloudflare Workers / Pages / D1 / R2 · Docker · GitHub Actions

#### How I work

- テストと性能予算を CI で強制する（A.R.I.S.2 はテスト 548 件、深海は JS サイズ・フォント・リンクを検証）
- 静的サイトは Cloudflare のエッジで固定費をかけずに運用する
- 仕様と判断の理由を `docs/` に書いてから作る
