# 統合手順

このセッションでは実際の `ninso-repo` の中身(`data/index.js` /
`tools/generate-index.js` / `app/index.html` / 既存 `data/phrenology.js`)を
見ていないため、以下は「おそらくこの形だろう」という前提での手順です。
次回、これらのファイルをアップロードしてもらえれば、str_replace で
直接マージするところまでやります。

## 1. `data/palmistry.js`

そのまま `data/` 配下に配置。既存ファイルと同じUMDパターンで
`PALMISTRY_PARTS` を export しています(既存ファイルの変数名が
`PHRENOLOGY_PARTS` のような命名なら合わせて `PALMISTRY_PARTS` のままでOK)。

## 2. `data/phrenology.js` への追記

`data/phrenology_additions.js` の中身(配列の3要素)を、既存
`data/phrenology.js` が return している配列の末尾に追記してください。
ラッパー部分は書き換え不要です。

## 3. `data/index.js`

既存ファイルがおそらく以下のような形でPARTSを集約しています:

```js
// 既存イメージ
var CORE = require('./core.js');
var CONSTITUTION = require('./constitution.js');
var FIVE_ELEMENTS = require('./five_elements.js');
var FACE_SHAPE = require('./face_shape.js');
var BODY = require('./body.js');
var PHRENOLOGY = require('./phrenology.js');

var PARTS = [].concat(CORE, CONSTITUTION, FIVE_ELEMENTS, FACE_SHAPE, BODY, PHRENOLOGY);
```

これに合わせて:

```js
var PALMISTRY = require('./palmistry.js');
var PARTS = [].concat(CORE, CONSTITUTION, FIVE_ELEMENTS, FACE_SHAPE, BODY, PHRENOLOGY, PALMISTRY);
```

ブラウザ向けUMD分岐(`root.PARTS = ...`)がある場合も同様に
`root.PALMISTRY_PARTS` を配列へ追加してください。

## 4. `tools/generate-index.js` の `DATA_FILES`

一覧配列に1行追記:

```js
const DATA_FILES = [
  'core.js',
  'constitution.js',
  'five_elements.js',
  'face_shape.js',
  'body.js',
  'phrenology.js',
  'palmistry.js', // ← 追加
];
```

追記後、`npm run index` を実行してMarkdown一覧を再生成してください。

## 5. `app/index.html`

既存の `<script src="../data/xxx.js"></script>` の並びに1行追加:

```html
<script src="../data/palmistry.js"></script>
```

`data/index.js` を1本にまとめて読み込む方式なら、`data/index.js` 側の
require/import 一覧に追加するだけでこちらの変更は不要な場合があります。

## 6. `service-worker.js` のキャッシュ対象

オフライン動作用に静的ファイルをキャッシュしている場合、
`data/palmistry.js` と `app/assets/palm-zones.svg` をキャッシュリストに
追加するのを忘れずに。

## 7. `source/notes.md` / `docs/progress.md`

`source/notes_additions.md` / `docs/progress_addition.md` の内容を、
それぞれ既存ファイルの末尾に追記してください。
