# readme-assets

プロフィール README の画像（`../../assets/*.svg`）を生成するスクリプトです。README 本体の表示にビルドは不要で、画像を作り直すときだけ使います。

- 文字はフォントからパスに変換して SVG に埋め込むため、閲覧環境のフォントに依存しません
- 各画像はダーク／ライトの 2 種類を出力し、README の `<picture>` で GitHub のテーマに合わせて切り替えます
- ヒーローのアニメーションは読み込み時の一度だけで、以後は低頻度の瞬きのみです（`<img>` 内の SVG はフレームごとに画像全体を再描画するため）。作品プレートは静止画です

## 使い方

```sh
npm install
npx playwright install chromium   # shoot / preview を使う場合のみ
npm run build                     # フォント取得 → assets/ を再生成
npm run shoot                     # 公開サイトのスクリーンショットを sources/ に撮り直す
npm run preview                   # gh api markdown で GitHub と同じ HTML を作り .preview/ に撮影
```

## 事実の更新

画像に焼き込んでいる数値・バージョン・状態はすべて `content.mjs` にあります。変更前に各リポジトリで事実を確認し、README.md の本文と `alt` も同じ値にそろえてください。

## 素材

- フォント: Zen Old Mincho / Zen Kaku Gothic New / Cormorant / IBM Plex Mono（SIL OFL、`.fonts/` に取得してビルド時のみ使用）
- アイコン: [simple-icons](https://simpleicons.org/)（CC0）
- `sources/`: 公開中サイトのスクリーンショットと A.R.I.S.2 の画面
