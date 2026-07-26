## セッション: 第四輯(骨相学概説四・手相学概説一〜三)取り込み

- 入力: 第四輯 PDF (p.124-173)
- 追加ファイル: `data/palmistry.js` (新規、20項目、category="手相")
- 追記: `data/phrenology.js` に3項目(眉弓・額三分割・頭形長頭円頭)
  → `data/phrenology_additions.js` に追記用スニペットとして保存(要マージ)
- 除外事項: `source/notes_additions.md` に記載
  (民族・人種の骨相比較 / 手頸線と不妊症の相関 / 血色による病名示唆 /
  指の動きによる兆占い)
- 未実施(次回持ち越し):
  - `data/index.js` への `palmistry.js` 登録
  - `tools/generate-index.js` の `DATA_FILES` 配列への追記
  - `app/index.html` の `<script>` 読み込み追加
  - `data/phrenology.js` 本体への実マージ(現状はスニペットのみ)
  - UI: 掌の八卦ゾーンをクリック/タップして該当データを表示する
    インタラクティブな手のひらマップを検討開始(下記UI提案参照)

### 次回への引き継ぎ

- 実際の `data/index.js` / `tools/generate-index.js` / `app/index.html` /
  既存 `data/phrenology.js` の中身を共有してもらえれば、次回は
  スニペットではなく実ファイルへの直接マージ(str_replace)を行う。
- 新規PDF(第五輯以降)が来たら、今回と同様に
  「採用データ化 → 除外方針をnotes.mdに記録 → progress.mdに要約」
  の3点セットで進める。
- UI: `app/assets/palm-zones.svg` (今回追加)を土台に、九宮の各領域に
  `data-key="palm_bagua_zones"` 的な属性を振ってクリックイベントで
  該当 options を表示する実装を想定。app.js 側の既存の「部位選択→
  結果表示」ロジックと合流できるか要確認。
