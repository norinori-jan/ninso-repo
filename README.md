# ninso-repo

人相学・手相学の伝統的な文献をデータ化し、オフラインで動作する
簡易鑑定PWA(Progressive Web App)として提供するプロジェクトです。

## 構成

- `app/` — PWA本体(HTML/CSS/JS、アイコン、Service Worker)
- `data/` — 鑑定データ本体。各ファイルが `key/name/category/role/options` の
  配列を返すUMDモジュールになっており、`data/index.js` が1本の
  `PARTS` 配列に集約します。
- `tools/generate-index.js` — `data/` 配下の全項目一覧を
  `docs/DATA_INDEX.md` に自動生成するスクリプト(`npm run index`)。
- `docs/` — 作業ログ・UI案・自動生成データ一覧。
- `source/notes.md` — 出典と採用/除外方針の記録。

## データの追加方法

1. `data/` に新しいファイルを追加(既存ファイルと同じUMDパターン)。
2. `data/index.js` の `safeRequire` 呼び出しと `factory` 引数に追加。
3. `tools/generate-index.js` の `DATA_FILES` 配列に追加。
4. `npm run index` で `docs/DATA_INDEX.md` を再生成。
5. 出典・採用/除外方針を `source/notes.md` に、作業ログを
   `docs/progress.md` に追記。

## 採用/除外方針

`source/notes.md` の「恒久的な除外方針」を参照してください。
性的に他者を消費・分類する内容、差別的な民族比較、精神疾患・自殺の
スティグマ化、特定病名の診断的示唆などは、データ化せず記録のみに
とどめる方針です。
