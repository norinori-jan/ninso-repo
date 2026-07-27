# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版/整理済み)

ninso-repo(人相占いPWA)の拡張データ作業の続きです。
**このリポジトリは今回全体を棚卸しして整理済みです。** 重複ファイル・
古いzip・空ファイルは削除し、`data/index.js` は実際に動作確認済みです。

## 現在の構成(第四輯・第五輯・第六輯 取り込み後、整理済み)

```
ninso-repo/
├── app/
│    ├── index.html / app.js / style.css / manifest.json / service-worker.js
│    └── assets/palm-zones.svg (掌面八卦の簡易参照SVG。UI実装は保留中)
├── data/
│    ├── core.js         ← ★中身が空(0バイト)。未実装のまま
│    ├── constitution.js ← ★中身が空(0バイト)。未実装のまま
│    ├── five_elements.js← ★中身が空(0バイト)。未実装のまま
│    ├── face_shape.js   ← ★中身が空(0バイト)。未実装のまま
│    ├── body.js         ← ★中身が空(0バイト)。未実装のまま
│    ├── phrenology.js (骨相学 3項目)
│    ├── palmistry.js (手相総論・指・掌面八卦・色・前腕骨格 19項目)
│    ├── palmistry_nails.js (爪 11項目)
│    ├── palmistry_mounts.js (丘・指紋 8項目)
│    ├── palmistry_lines.js (掌紋・三大線ほか 10項目)
│    ├── forehead_extra.js (額・骨相学 11項目) ★第六輯で追加
│    ├── hair.js (毛髪。新カテゴリ「毛髪」 7項目) ★第六輯で追加
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式。動作確認済み・
│         合計69項目、重複key無し)
├── tools/generate-index.js (DATA_FILES配列、`npm run index`で
│    docs/DATA_INDEX.md を自動生成。動作確認済み)
├── source/notes.md (出典・採用/除外方針。第四〜六輯分すべて追記済み)
├── docs/
│    ├── progress.md (作業ログ。第四〜六輯分すべて追記済み)
│    ├── DATA_INDEX.md (自動生成物。npm run index の最新出力)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json (★今回作成。"index"スクリプトあり)
├── .gitignore (★今回作成。node_modules/ *.zip等を除外)
└── README.md (★今回作成。簡単な説明)
```

### 今回(整理セッション)やったこと

- リポジトリ全体がかなり散らかっていた(ルート直下に `data/` や
  `docs/` と同じファイルが重複、`files/` フォルダ、
  `ninso-repo-update-4th/` フォルダ、`*.zip` が複数リポジトリ内に
  そのままコミットされていた)ため、すべて棚卸しして削除・統合した。
- `source/notes_additions.md` → `source/notes.md` に統合(削除)。
- `docs/progress_addition.md` → `docs/progress.md` に統合(削除)。
- `data/phrenology_additions.js` は中身が `data/phrenology.js` と
  完全に同じ3項目だった(=既にマージ済み)ため削除。
- `package.json` / `.gitignore` / `README.md` が0バイトだったため
  最低限の内容で新規作成。特に `package.json` が空だと
  `require()` が壊れる(Invalid package config)ことが判明したため
  修正必須だった。
- 第六輯分(`forehead_extra.js` / `hair.js`)を `data/` に追加し、
  `data/index.js` と `tools/generate-index.js` の両方に反映。
- `node -e "require('./data/index.js')"` で実行確認し、
  **合計69項目・重複key無し・カテゴリ = 骨相学/手相/顔/毛髪** を確認済み。
- `npm run index` の実行も確認済み(`docs/DATA_INDEX.md` 生成成功)。

## ★重要: これまでに使った key の完全一覧(実ファイルから確認済み)

### 骨相学(category: "骨相学")

- `data/phrenology.js`: `brow_ridge_intuition`(役割=額),
  `forehead_thirds`(役割=額), `head_shape_long_round`(役割=頭部全体)
- `data/forehead_extra.js`: `skull_width_reasoning`(役割=頭部)

### 手相(category: "手相")

- `data/palmistry.js`:
  - 総論: `hand_reading_side`, `hand_three_qualities`,
    `hand_size_body_ratio`, `palm_five_elements`
  - 触感: `hand_hardness`, `hand_temperature`
  - 指全体: `finger_joint_prominence`, `fingertip_shape`
  - 親指: `thumb_length`, `thumb_joint_balance`, `thumb_flexibility`,
    `thumb_fingerprint`
  - 人差し指/中指/薬指/小指: `index_finger_length`,
    `middle_finger_traits`, `ring_finger_traits`, `little_finger_traits`
  - 部位対応: `palm_bagua_zones`
  - 色: `palm_color_reading`
  - 骨格: `arm_bone_balance`
- `data/palmistry_nails.js`(役割=爪): `nail_length_overall`,
  `nail_shape_square`, `nail_shape_round`, `nail_shape_narrow`,
  `nail_constitution_delicate`, `nail_curvature`, `nail_ridges`,
  `nail_white_spots`, `nail_moon`, `nail_biting_habit`, `nail_color`
- `data/palmistry_mounts.js`: 丘=`mount_jupiter`, `mount_saturn`,
  `mount_sun`, `mount_mercury`, `mount_mars`, `mount_venus`,
  `mount_moon`(西洋式7丘。掌面八卦とは別座標系); 指紋=
  `finger_base_fingerprint_pattern`
- `data/palmistry_lines.js`(役割=掌紋): `line_east_west_correspondence`,
  `line_life`, `line_life_support`, `line_emotion`, `line_intelligence`,
  `line_fate`, `line_sun`, `line_health`, `line_marriage`,
  `line_age_reference`

### 顔・額(category: "顔")

- `data/forehead_extra.js`(役割=額、一部「色」): `forehead_three_sections`,
  `forehead_three_qualities_shape`, `forehead_fuji_shape`,
  `forehead_goose_pattern`, `forehead_official_fortune_zone`,
  `forehead_color_reading`(役割=色), `forehead_mole_position`,
  `forehead_birth_order_belief`, `forehead_symmetry`,
  `glabella_health_sign`(役割=色)

### 毛髪(category: "毛髪") ★第六輯で新設

- `data/hair.js`: `hair_color_depth`(色), `hair_whorl_direction`(つむじ),
  `hair_texture_type`(質), `hair_baldness_pattern`(はげ),
  `hairline_m_shape`(生え際), `hair_density_vitality`(密度),
  `hair_growth_line_marks`(生え際)

### 顔全体・体質・五行・輪郭・身体(未着手・空ファイル)

`core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
`body.js` は **中身が空(0バイト)** のままです。過去のセッションで
「実ファイルが空だった」という前提のもと放置されてきました。
これらは第四〜六輯では触れていません。**このリポジトリでは
まだ一切のデータが入っていない**ので、新しいkeyを作る際に
重複を心配する必要はありませんが、逆に言うと顔・体質・五行・輪郭・
身体まわりのデータが丸ごと空白になっている状態です。優先度高めで
着手する価値があります。

## 引き継ぎ・注意事項(累積)

1. **私(Claude)はユーザーのローカルPCにもGitHubリモートにも直接
   アクセスできません。** 「zipを作って渡す→ユーザーが手元で展開・
   上書き・commit・push」という流れになります。
2. **今回、実ファイル一式(zip)を受け取り、中を確認しながら
   直接マージ・整理しました。** 今後もこの形(リポジトリ全体を
   zipでアップロードしてもらう)を継続してください。差分ファイルだけ
   渡すよりも、整理・重複解消がしやすく確実です。
3. **UIは保留を継続中。** `app/assets/palm-zones.svg` と
   `docs/UI_PROPOSAL.md` は用意済みだが実装はしていない。明示的な
   指示があるまでデータ拡充を優先する。
4. **丘(西洋式7丘 mount_*)と掌面八卦(東洋式9宮 palm_bagua_zones)は
   別の座標系。** UI設計時に要検討(`docs/progress.md`参照)。
5. **将来機能のメモ:** 写真やFaceTime等のリアルタイム対面からの
   即時鑑定機能は、データ拡充が一段落してから設計する。今は着手しない。
6. **`data/core.js` 等5ファイルが空のまま。** 優先度高めで着手を
   検討してよい(次回、着手するか確認してから進める)。
7. **`package.json`が空だと `require()` が全滅する**ことが判明済み。
   今後、空ファイルのプレースホルダーをコミットしないよう注意。
8. **`*.zip` は `.gitignore` 済み。** 今後、配布用zipをリポジトリ内に
   直接コミットしないこと。

## 除外方針(恒久・累積。`source/notes.md`にも記載済み)

新しいPDFを読み込む際、以下のカテゴリの内容は**詳細を記載せず
「そのような発想・記述が原本に存在した」という事実のみ** `source/notes.md`
に記録し、データ化しない:

1. 性的な写真品評企画、身体的特徴と生殖器官・体毛・性機能を結びつける
   俗信(例: 不感症・不妊症・インポテンツとの相関)
2. 民族・人種を骨相・体格と結びつけて性格や優劣を比較する記述
   (差別的ステレオタイプを含むもの)。形態上の一般概念(長頭・円頭等)
   だけを、特定の集団に結びつけない形で抽出するのは可
3. 精神疾患・自殺を身体的特徴と安易に結びつけるスティグマ的な記述
   (例: 指の歪みと発狂・自殺の相関)
4. 特定の病名を診断的に示唆する記述(例: 爪の型が直接「脳溢血型」
   「心臓病型」等の病名になっているもの)。一般化した体質・体力表現に
   置き換えるのは可
5. 診断データそのものではない付随コンテンツ(読者質問コーナー、
   商品広告、寄生虫等の医学豆知識、参考書籍紹介、法医学トリビアや
   作家・有名人にまつわる余談エピソード)は単純に対象外
   (除外理由の記録も不要)
6. 人相・骨相を性風俗業(遊女・男娼など)の顧客分類や営業ノウハウ
   として解説する記述は、診断データ化せず、存在した事実のみを
   記録する。

## 未着手で残っている非性的な章

- **顔・体質・五行・輪郭・身体の基礎データ全般**(`core.js` 等5ファイル
  が空)→ 優先度高め
- 十字面法の残り型(王字面・目字面・用字面など) → `data/face_shape.js`
- 身体総論の続き(臍・腰・臀・足・後ろ姿など) → `data/body.js`
- 咽喉・首の高さ、顔面角度(カンペール角) → 新規 `data/head_neck.js` 案
- 骨相学42部位論の残り(秩序性・計数性・事実性・位置性・時間性・
  音調性・言語性・推因性・比較性・諧謔性・直覚性・調和性など)
  → `data/phrenology.js`
- 手相の「指の動きによる兆占い」→ 別データ構造(`data/omens.js`案)を
  検討するか判断
- 掌線と年齢目盛りの精密な図解(今回は概念のみ採用、精密な座標は未採用)

## 今回やってほしいこと

1. 新しいPDF資料を読み込んで、同じスキーマ
   (key/name/category/role/options[{id,label,tone,text}])でデータ化
2. 新しいkeyは上記の「key一覧」と重複しないように付ける
3. 上記の未着手章、特に空のままの `core.js` 等5ファイルがあれば
   優先的にカバー(ただし着手前にユーザーに確認してもよい)
4. 採用/除外の判断は `source/notes.md` に追記する形で記録
   (除外方針は上記の累積リストに沿う。新しいパターンの除外が
   必要な場合はリストに追加してこの引き継ぎプロンプトにも
   反映されるよう明記する)
5. `docs/progress.md` に作業ログを追記
6. `data/index.js` と `tools/generate-index.js` の両方を更新し、
   可能であれば `node -e "require('./data/index.js')"` 等で
   重複keyやエラーがないか検証する
7. UIには着手しない(データ拡充を優先)
8. 作業が終わったら、**リポジトリ全体を1つのzip**にしてdownload
   できるようにし(差分zipではなく丸ごと)、この形式の継続プロンプト
   (累積のkey一覧・注意事項つき)を更新して渡す

新しいPDFを添付します。
