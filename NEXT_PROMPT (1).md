# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版)

ninso-offlineリポジトリ(人相占いPWA)の拡張データ作業の続きです。

## 現在の構成(第四輯・第五輯取り込み後)

```
ninso-repo/
├── app/
│    └── assets/palm-zones.svg  (掌面八卦の簡易参照SVG。UI実装は保留中)
├── data/
│    ├── core.js (顔:額眉目鼻口耳顎気色)
│    ├── constitution.js (体質三型)
│    ├── five_elements.js (五行五形)
│    ├── face_shape.js (十字面法の一部)
│    ├── body.js (首肩胸)
│    ├── phrenology.js (骨相学。第四輯分3項目追記済み)
│    ├── palmistry.js (手相総論・指・掌面八卦・色・前腕骨格。第四輯分20項目)
│    ├── palmistry_nails.js (爪。第五輯分11項目) ★新規
│    ├── palmistry_mounts.js (丘・指紋。第五輯分8項目) ★新規
│    ├── palmistry_lines.js (掌紋・三大線ほか。第五輯分10項目) ★新規
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式)
├── tools/generate-index.js (DATA_FILES配列、npm run index)
├── source/notes.md (出典・採用/除外方針)
├── docs/
│    ├── progress.md (作業ログ)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json
└── README.md
```

## ★重要: これまでに使った key の辞書(重複防止用)

新しいデータを追加するとき、以下と重複しない `key` を使ってください。
(category / role も揃えると管理しやすいので参考に記載)

### 手相(category: "手相")

- role="総論": `hand_reading_side`, `hand_three_qualities`, `hand_hardness`,
  `hand_temperature`, `hand_size_body_ratio`, `palm_five_elements`
- role="指全体": `finger_joint_prominence`, `fingertip_shape`
- role="親指": `thumb_length`, `thumb_joint_balance`, `thumb_flexibility`,
  `thumb_fingerprint`
- role="人差し指"/"中指"/"薬指"/"小指": `index_finger_length`,
  `middle_finger_traits`, `ring_finger_traits`, `little_finger_traits`
- role="部位対応": `palm_bagua_zones`(掌面八卦・九宮=東洋式)
- role="色": `palm_color_reading`
- role="骨格": `arm_bone_balance`
- role="爪": `nail_length_overall`, `nail_shape_square`, `nail_shape_round`,
  `nail_shape_narrow`, `nail_constitution_delicate`, `nail_curvature`,
  `nail_ridges`, `nail_white_spots`, `nail_moon`, `nail_biting_habit`,
  `nail_color`
- role="丘": `mount_jupiter`, `mount_saturn`, `mount_sun`, `mount_mercury`,
  `mount_mars`, `mount_venus`, `mount_moon`(西洋式7丘。掌面八卦とは
  別の座標系なので注意)
- role="指紋": `finger_base_fingerprint_pattern`
- role="掌紋": `line_east_west_correspondence`, `line_life`,
  `line_life_support`, `line_emotion`, `line_intelligence`, `line_fate`,
  `line_sun`, `line_health`, `line_marriage`, `line_age_reference`

### 骨相学(category: "骨相学")

- 第四輯で追加: `brow_ridge_intuition`, `forehead_thirds`,
  `head_shape_long_round`
- (それ以前からある核となる42部位論の抜粋16項目は `data/phrenology.js`
  本体を直接確認してください。実ファイルをまだ見ていないため、
  正確なkey一覧はここに書けていません)

### 顔・体質・五行・輪郭・身体(category: "顔"/"体質論"/"輪郭"/"身体")

- これらは第四輯・第五輯では触っていません。既存の
  `core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
  `body.js` の中身・key一覧は未確認のままです。**新しいkeyを作る前に
  必ず実ファイルを見て重複を避けてください。**

## 引き継ぎ・注意事項(累積)

1. **私(Claude)はユーザーのローカルPCにもGitHubリモートにも直接
   アクセスできません。** 毎回「zipを作って渡す→ユーザーが手元で展開・
   マージ・commit・push」という流れになります。「配置してpullして」
   という指示が来ても、実際にできるのはzip提供までです。
2. **実ファイルを見ずに提案・追記している箇所が多い。**
   `data/index.js` / `tools/generate-index.js` / `app/index.html` /
   `data/phrenology.js` 本体 / `data/core.js` 等は、私はまだ中身を
   見ていない(ユーザー側の説明とINTEGRATION.md記載の「おそらくこう
   だろう」という推測で書いている)。次回、実ファイルをアップロード
   してもらえれば、str_replaceで直接マージする方が確実。
3. **UIは保留を継続中。** `app/assets/palm-zones.svg`(掌面八卦マップ)
   と `docs/UI_PROPOSAL.md` は用意済みだが実装はしていない。
   ユーザーから明示的に着手指示があるまで、UIより先にデータ拡充を
   優先する。
4. **丘(西洋式7丘 mount_*)と掌面八卦(東洋式9宮 palm_bagua_zones)は
   別の座標系。** 同じ手のひらを2通りの方法で区切っているだけなので、
   UI設計時にどちらを使うか、レイヤー切り替えにするか要検討
   (`docs/progress.md` に記録済み)。
5. **将来機能のメモ:** 写真やFaceTime等のリアルタイム対面から
   瞬時に人相/手相を鑑定する機能を検討中。データ構造・UIともに
   影響が大きい可能性があるため、データ拡充が一段落してから
   改めて設計する。今は着手しない。

## 除外方針(恒久・累積)

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
   商品広告、寄生虫等の医学豆知識、参考書籍紹介)は単純に対象外
   (除外理由の記録も不要)

## 未着手で残っている非性的な章

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
2. 新しいkeyは上記の「key辞書」と重複しないように付ける
3. 上記の未着手章があれば優先的にカバー
4. 採用/除外の判断は `source/notes.md` に追記する形で記録
   (除外方針は上記の累積リストに沿う。新しいパターンの除外が
   必要な場合はリストに追加してこの引き継ぎプロンプートにも
   反映されるよう明記する)
5. `docs/progress.md` に作業ログを追記
6. UIには着手しない(データ拡充を優先)
7. 作業が終わったらzip化してdownloadできるようにし、次回に向けた
   この形式の継続プロンプト(累積の key 辞書・注意事項つき)を
   更新して渡す

新しいPDFを添付します。
