# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版/整理済み)

ninso-repo(人相占いPWA)の拡張データ作業の続きです。
**このリポジトリは整理済みです。** 重複ファイル・古いzip・空ファイルは
削除し、`data/index.js` は実際に動作確認済みです(第四輯〜第十輯分すべて
マージ・動作確認済み。合計130項目・重複keyなし)。

## 現在の構成(第四輯〜第十輯 取り込み後、整理済み)

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
│    ├── forehead_extra.js (額・骨相学 11項目)
│    ├── hair.js (毛髪。新カテゴリ「毛髪」 7項目)
│    ├── eyebrows.js (顔・眉 15項目)
│    ├── nose.js (顔・鼻 24項目)
│    ├── nasolabial.js (顔・法令 12項目)
│    ├── philtrum.js (顔・人中 10項目) ★第九・十輯で追加
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式。動作確認済み・
│         合計130項目、重複key無し)
├── tools/generate-index.js (DATA_FILES配列、`npm run index`で
│    docs/DATA_INDEX.md を自動生成。動作確認済み)
├── source/notes.md (出典・採用/除外方針。第四〜十輯分すべて追記済み)
├── docs/
│    ├── progress.md (作業ログ。第四〜十輯分すべて追記済み)
│    ├── DATA_INDEX.md (自動生成物。npm run index の最新出力)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json ("index"スクリプトあり)
├── .gitignore (node_modules/ *.zip等を除外)
└── README.md (簡単な説明)
```

### 今回(第九・十輯・人相学詳論(十三)人中の相 対応セッション)やったこと

- 第九・十輯PDF(鼻の一行占法の続き、及び「人相学詳論(十三)人中の相」)を
  読み込んだ。ユーザー指示「まずは語彙を増やす戦略」に基づき、今回は
  **人中の章のみ**を対象とし、頬・顎(十四・十五)、口(十六)は次回に
  持ち越した。
- 新規ファイル `data/philtrum.js`(category「顔」role「人中」・10項目)を
  追加。人中の定義と禄倉・食倉、年代による変化(才二図)、長短と寿命、
  曲がりと性格・利き足の対応、ホクロ位置(A〜D)、広さ・狭さと生活安定度、
  横筋と生活苦、カーブ形状による男女判断の言い伝え、ヒゲの生やし方、
  夫婦運・晩年運の総括を収録。
- `data/index.js`(Node側require一覧・ブラウザ側root参照・factory引数・
  concat配列すべて)と `tools/generate-index.js` の `DATA_FILES` 配列を更新。
- `node -e "require('./data/index.js')"` で実行確認し、**合計130項目・
  重複key無し**を確認済み。「顔/人中」10項目(新設)。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成済み。
- `source/notes.md` / `docs/progress.md` に採用/除外の記録・作業ログを追記済み。
- 人中を子宮そのものに対応づけ血色・血点から子宮癌の初期兆候を読むとする
  記述(才五図・才六図)、人中の太さと無精子症・不妊を結びつける記述、
  結婚前の娘の素行に関する読者相談の実例エピソード、戦時中・戦後の人口論
  (マルサスの摂理等)を扱う社会時評的な記述は除外方針に従い除外(詳細は
  `source/notes.md` 参照)。

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

### 顔・額・眉・鼻・法令・人中(category: "顔")

- `data/forehead_extra.js`(役割=額、一部「色」): `forehead_three_sections`,
  `forehead_three_qualities_shape`, `forehead_fuji_shape`,
  `forehead_goose_pattern`, `forehead_official_fortune_zone`,
  `forehead_color_reading`(役割=色), `forehead_mole_position`,
  `forehead_birth_order_belief`, `forehead_symmetry`,
  `glabella_health_sign`(役割=色)
- `data/eyebrows.js`(役割=眉): `eyebrow_terminology_confidant_palace`,
  `eyebrow_gender_typical_shape`, `eyebrow_thickness_temperament`,
  `eyebrow_tail_angle_clockface`, `eyebrow_eye_distance_tainaku`,
  `eyebrow_glabella_width_personality`, `eyebrow_hair_density_texture`,
  `eyebrow_color_reading`, `eyebrow_double_strand_pattern`,
  `eyebrow_sparse_gap_pattern`, `eyebrow_long_hair_longevity`,
  `eyebrow_mole_three_dangers`, `eyebrow_sibling_count_reading`,
  `eyebrow_birth_order_zones`, `eyebrow_omens_collection`
- `data/nose.js`(役割=鼻。計24項目): `nose_tree_metaphor_structure`,
  `nose_length_ratio_standard`, `nose_bridge_shape_types`,
  `nose_tip_three_qualities`, `nose_wing_size_reading`,
  `nose_bone_prominence_type`, `nose_profile_curve_types`,
  `nose_tip_shape_hook_droop`, `nose_length_type_classification`,
  `nose_female_fortune_correlation`, `nose_climate_adaptation_theory`,
  `nose_mole_wealth_sign`, `nose_aging_pattern_by_life_stage`,
  `nose_root_intellect_development`, `nose_root_health_constitution_link`,
  `nose_root_temperament_reading`, `nose_mole_life_stage_omens`,
  `nose_mole_confinement_omen`, `nose_wing_dog_type_wealth`,
  `nose_nostril_visibility_money_type`, `nose_color_red_meaning`,
  `nose_profile_western_classification`, `nose_habit_touch_fidget_sign`,
  `nose_tip_fortune_timing`
- `data/nasolabial.js`(役割=法令。12項目): `nasolabial_concept_and_body_parts`,
  `nasolabial_length_stability`, `nasolabial_width_business_type`,
  `nasolabial_age_flow_reference`, `nasolabial_defect_marks_meaning`,
  `nasolabial_entering_mouth_pattern`, `nasolabial_color_reading`,
  `nasolabial_double_line_pattern`, `nasolabial_mole_position_meaning`,
  `nasolabial_symmetry_curve_reading`, `nasolabial_foot_injury_correlation`,
  `nasolabial_root_metaphor`
- `data/philtrum.js`(役割=人中。★第九・十輯で新規追加、10項目):
  `philtrum_definition_zones`, `philtrum_aging_pattern`,
  `philtrum_length_lifespan_correlation`, `philtrum_curve_and_foot_correlation`,
  `philtrum_mole_position_meaning`, `philtrum_width_life_stability`,
  `philtrum_horizontal_line_hardship`, `philtrum_shape_child_gender_folk_belief`,
  `philtrum_mustache_growth_style`, `philtrum_marriage_and_late_life_fortune`

### 毛髪(category: "毛髪")

- `data/hair.js`: `hair_color_depth`(色), `hair_whorl_direction`(つむじ),
  `hair_texture_type`(質), `hair_baldness_pattern`(はげ),
  `hairline_m_shape`(生え際), `hair_density_vitality`(密度),
  `hair_growth_line_marks`(生え際)

### 顔全体・体質・五行・輪郭・身体(未着手・空ファイル)

`core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
`body.js` は **中身が空(0バイト)** のまま。眉・鼻・法令・人中はそれぞれ
専用ファイルとして埋まったので、`core.js` は残りの顔パーツ(目・口・耳・
気色)を対象にする形になります。頬・顎は次点の候補として新規ファイル
(`data/cheek_jaw.js`案)を検討中。

## 引き継ぎ・注意事項(累積)

1. **私(Claude)はユーザーのローカルPCにもGitHubリモートにも直接
   アクセスできません。** 「zipを作って渡す→ユーザーが手元で展開・
   上書き・commit・push」という流れになります。
2. **実ファイル一式(zip)を受け取り、中を確認しながら直接マージ・
   整理する方式を継続してください。** 差分ファイルだけ渡すよりも、
   整理・重複解消がしやすく確実です。
3. **UIは保留を継続中。** `app/assets/palm-zones.svg` と
   `docs/UI_PROPOSAL.md` は用意済みだが実装はしていない。明示的な
   指示があるまでデータ拡充を優先する。
4. **丘(西洋式7丘 mount_*)と掌面八卦(東洋式9宮 palm_bagua_zones)は
   別の座標系。** UI設計時に要検討(`docs/progress.md`参照)。
5. **将来機能のメモ:** 写真やFaceTime等のリアルタイム対面からの
   即時鑑定機能は、データ拡充が一段落してから設計する。今は着手しない。
6. **`data/core.js` 等5ファイルが空のまま。** 眉・鼻・法令・人中は埋まったので、
   残りは顔全体(目・口・耳・気色)・頬・顎・体質・五行・輪郭・身体。
   優先度高めで着手を検討してよい(次回、着手するか確認してから進める)。
7. **`package.json`が空だと `require()` が全滅する**ことが判明済み。
   今後、空ファイルのプレースホルダーをコミットしないよう注意。
8. **`*.zip` は `.gitignore` 済み。** 今後、配布用zipをリポジトリ内に
   直接コミットしないこと。
9. **章によっては、原本に類似記述が大量に反復収録されていることがある。**
   全項目を逐一データ化するのではなく、代表的な分類にまとめて集約収録する
   ことも許容する(例: 第八輯の鼻の横顔40種→5分類に集約)。
10. **(第九・十輯で追加)** 「まずは語彙を増やす戦略」の指示により、1回の
    セッションで章全体(頬・顎・口など複数トピック)を無理に一度に
    片付けようとせず、区切りのよい1トピックずつ丁寧にデータ化する
    進め方も許容する。今回は人中のみを対象とし、頬・顎・口は次回に
    持ち越した。

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
   (例: 指の歪みと発狂・自殺の相関、悩みを苦にした自殺の実例エピソード)
4. 特定の病名を診断的に示唆する記述(例: 爪の型が直接「脳溢血型」
   「心臓病型」等の病名になっているもの、人中の血色から子宮癌の兆候を
   読み取るとする記述)。一般化した体質・体力表現に置き換えるのは可
5. 診断データそのものではない付随コンテンツ(読者質問コーナー、
   商品広告、寄生虫等の医学豆知識、参考書籍紹介、法医学トリビアや
   作家・有名人にまつわる余談エピソード、美容外科・歴史トリビア、
   実名を用いた具体的な個人の実例エピソード、社会時評・人口論等の
   雑学的コンテンツ)は単純に対象外(除外理由の記録も不要)
6. 人相・骨相を性風俗業(遊女・男娼など)の顧客分類や営業ノウハウ
   として解説する記述は、診断データ化せず、存在した事実のみを
   記録する。単純な風俗史的言及(例:特定の職業で眉を剃る習慣が
   あった、という事実の言及)は対象外として扱ってよい。
7. 「ユダヤ鼻」のように性格描写に民族名が慣用的に使われている古い俗称が
   出てきた場合、①完全除外、②民族名を外して形態のみ抽出、③偏見的解釈を
   戒める注記つきで採用、のいずれかを都度判断する(第七輯の
   `nose_profile_curve_types` では③、第八輯の
   `nose_profile_western_classification` では②を採用した)。
8. 犯罪学(ロンブローゾ流)のように、身体的特徴(顎の形状等)を犯罪傾向
   と直接結びつける記述に遭遇した場合は、方針3(精神疾患・自殺の
   スティグマ化)に準じて慎重に扱う。完全除外するか、歴史的な学説として
   紹介しつつ注記を添えるかは都度判断する(次回、頬・顎の章対応時に
   実際の記述を見て判断する)。

## 未着手で残っている非性的な章

- **頬・顎の相(人相学詳論(十四)(十五))** → 新規 `data/cheek_jaw.js` 案。
  頬の胃穴・消化能力、顎の骨格三質論、二重顎、犯罪学的顎型論(要除外判断)
  など。★次回優先度高め
- **口の相(人相学詳論(十六))** → 新規 `data/mouth.js` 案。上唇・下唇
  (金賦・金才)、覆舟型・仰月型、大海・海角、唇の厚さと性格など。
  ★次回優先度高め
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
- 鼻の横顔40分類カタログの個別詳細化(今回は代表5分類に集約収録のみ)
- 目・口・耳・気色(`core.js`が空のため丸ごと未着手)
- 人中の相の続き(結婚相談実例・目尻の相等、除外済みの読者相談を除く
  診断的な記述があれば追加検討)

## 今回やってほしいこと

1. 新しいPDF資料(または今回持ち越した頬・顎・口の部分)を読み込んで、
   同じスキーマ(key/name/category/role/options[{id,label,tone,text}])で
   データ化
2. 新しいkeyは上記の「key一覧」と重複しないように付ける
3. 上記の未着手章、特に頬・顎・口、及び空のままの `core.js` 等5ファイルが
   あれば優先的にカバー(ただし着手前にユーザーに確認してもよい)
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
