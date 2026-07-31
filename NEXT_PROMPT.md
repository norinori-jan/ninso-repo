# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版/整理済み)

ninso-repo(人相占いPWA)の拡張データ作業の続きです。
**このリポジトリは整理済みです。** 重複ファイル・古いzip・空ファイルは
削除し、`data/index.js` は実際に動作確認済みです(第四輯〜第十一輯分すべて
マージ・動作確認済み。合計174項目・重複keyなし)。

## 現在の構成(第四輯〜第十一輯 取り込み後、整理済み)

```
ninso-repo/
├── app/
│    ├── index.html / app.js / style.css / manifest.json / service-worker.js
│    │    ★<script>タグの抜けバグを今回修正済み(下記「重要な修正」参照)
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
│    ├── philtrum.js (顔・人中 10項目)
│    ├── mouth.js (顔・口 12項目) ★第十一輯で追加
│    ├── teeth.js (顔・歯 12項目) ★第十一輯で追加
│    ├── ear.js (顔・耳 11項目) ★第十一輯で追加
│    ├── cheekbone.js (顔・観骨 9項目) ★第十一輯で追加
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式。動作確認済み・
│         合計174項目、重複key無し)
├── tools/generate-index.js (DATA_FILES配列、`npm run index`で
│    docs/DATA_INDEX.md を自動生成。動作確認済み)
├── source/notes.md (出典・採用/除外方針。第四〜十一輯分すべて追記済み)
├── docs/
│    ├── progress.md (作業ログ。第四〜十一輯分すべて追記済み)
│    ├── DATA_INDEX.md (自動生成物。npm run index の最新出力)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json ("index"スクリプトあり)
├── .gitignore (node_modules/ *.zip等を除外)
└── README.md (簡単な説明)
```

### 今回(第十一輯・口の相(二)・歯の相・耳の相・観骨の相 対応セッション)やったこと

- 第十一輯PDFを読み込んだ。**前回の引き継ぎでは「頬・顎」が次点候補として
  想定されていたが、実際のPDFの内容は「口の相の続き・歯の相・耳の相・
  観骨の相」の4章だった。** 頬・顎(人相学詳論十四・十五)は今回も未着手の
  まま持ち越し。
- 新規ファイル4つを追加:
  - `data/mouth.js`(category「顔」role「口」・12項目)
  - `data/teeth.js`(category「顔」role「歯」・12項目)
  - `data/ear.js`(category「顔」role「耳」・11項目)
  - `data/cheekbone.js`(category「顔」role「観骨」・9項目)
- `data/index.js`(Node側require一覧・ブラウザ側root参照・factory引数・
  concat配列すべて)と `tools/generate-index.js` の `DATA_FILES` 配列を更新。
- **重要な修正(バグ発見):** `app/index.html` の `<script>` タグに、
  過去セッションから存在していた抜けを発見・修正した。`data/index.js` は
  以前から `forehead_extra.js` / `hair.js` / `eyebrows.js` / `nose.js` /
  `nasolabial.js` / `philtrum.js` を参照していたが、`app/index.html` には
  これらの `<script>` タグが一つも追加されておらず、**実際にブラウザで
  開くとこれら6ファイル・計79項目のデータが読み込まれない状態だった。**
  今回、不足分6ファイルと新規4ファイル、計10個の `<script>` タグを
  `app/index.html` に追加して修正済み。次回もし `app.js` 側で新しい
  データファイルを追加する場合は、`index.js` の登録だけでなく
  **必ず `app/index.html` の `<script>` タグも追加すること**。
- `node -e "require('./data/index.js')"` で実行確認し、**合計174項目・
  重複keyなし**を確認済み。「顔/口」12項目・「顔/歯」12項目・
  「顔/耳」11項目・「顔/観骨」9項目(いずれも新設)。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成済み。
- `source/notes.md` / `docs/progress.md` に採用/除外の記録・作業ログを追記済み。
- 唇の色と陰部の色の対応(除外方針①)、女囚の歯並び統計と犯罪傾向の直接的
  結びつけ(除外方針8)、皇室・実名俳優/女優・実名経済人への直接言及
  (除外方針⑤に準じ一般化)、貴人・賤人という身分階層と耳の相の対応
  (除外方針②)、観骨の血色から性病罹患リスクを診断的に示唆する記述
  (除外方針①④⑥)などを除外方針に従い除外(詳細は `source/notes.md` 参照)。
- 原本の末尾に「次回はいよいよ画龍点睛の、眼の相法に入る」旨の記載が
  あったため、**次回のPDFは「目の相」の可能性が高い。**

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

### 顔・額・眉・鼻・法令・人中・口・歯・耳・観骨(category: "顔")

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
- `data/philtrum.js`(役割=人中。10項目): `philtrum_definition_zones`,
  `philtrum_aging_pattern`, `philtrum_length_lifespan_correlation`,
  `philtrum_curve_and_foot_correlation`, `philtrum_mole_position_meaning`,
  `philtrum_width_life_stability`, `philtrum_horizontal_line_hardship`,
  `philtrum_shape_child_gender_folk_belief`, `philtrum_mustache_growth_style`,
  `philtrum_marriage_and_late_life_fortune`
- `data/mouth.js`(役割=口。★第十一輯で新規追加、12項目):
  `mouth_lower_lip_taste_sensitivity`, `mouth_size_vitality_elasticity`,
  `mouth_protrusion_instinct_type`, `lip_thickness_altruism_selfishness`,
  `mouth_size_ambition_scale`, `lip_line_clarity_chastity`,
  `lip_color_health_omen`, `mouth_expression_habit_fortune`,
  `lip_mole_speech_caution`, `smile_teeth_gum_visibility`,
  `mouth_intake_outtake_restraint`, `mouth_expression_fortune_cultivation`
- `data/teeth.js`(役割=歯。★第十一輯で新規追加、12項目):
  `tooth_three_types_function`, `tooth_type_ratio_diet_reflection`,
  `tooth_organ_correspondence`, `tooth_anatomy_structure`,
  `tooth_eruption_timeline`, `tooth_alignment_personality`,
  `tooth_gap_center_incisors`, `tooth_pointed_canine_personality`,
  `tooth_size_uniformity_reading`, `tooth_color_whiteness_reading`,
  `tooth_folk_belief_hair_nerve`, `tooth_omens_collection`
- `data/ear.js`(役割=耳。★第十一輯で新規追加、11項目):
  `ear_completion_order_belief`, `ear_age_classification_pattern`,
  `ear_anatomy_terminology`, `ear_position_height_reading`,
  `ear_zone_map_meaning`, `ear_size_lucky_ear_belief`,
  `ear_color_health_link`, `ear_lobe_development_by_age`,
  `ear_rim_development_family_bond`, `ear_folk_omens_collection`,
  `ear_orientation_career_suitability`
- `data/cheekbone.js`(役割=観骨。★第十一輯で新規追加、9項目):
  `cheekbone_bone_vs_flesh_prominence`, `cheekbone_prominent_independence`,
  `cheekbone_overprominent_stubbornness`, `cheekbone_color_trust_reading`,
  `cheekbone_climate_adaptation_theory`, `cheekbone_side_profile_direction_type`,
  `cheekbone_mole_life_stage_omens`, `cheekbone_beard_growth_fortune`,
  `cheekbone_low_prominence_personality`

### 毛髪(category: "毛髪")

- `data/hair.js`: `hair_color_depth`(色), `hair_whorl_direction`(つむじ),
  `hair_texture_type`(質), `hair_baldness_pattern`(はげ),
  `hairline_m_shape`(生え際), `hair_density_vitality`(密度),
  `hair_growth_line_marks`(生え際)

### 顔全体・体質・五行・輪郭・身体(未着手・空ファイル)

`core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
`body.js` は **中身が空(0バイト)** のまま。目・気色は今回も未着手。
頬・顎は次点候補として引き続き持ち越し中(`data/cheek_jaw.js`案)。

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
6. **`data/core.js` 等5ファイルが空のまま。** 顔の目・気色、体質、五行、
   輪郭、身体が残っている。優先度高めで着手を検討してよい(次回、
   着手するか確認してから進める)。
7. **`package.json`が空だと `require()` が全滅する**ことが判明済み。
   今後、空ファイルのプレースホルダーをコミットしないよう注意。
8. **`*.zip` は `.gitignore` 済み。** 今後、配布用zipをリポジトリ内に
   直接コミットしないこと。
9. **章によっては、原本に類似記述が大量に反復収録されていることがある。**
   全項目を逐一データ化するのではなく、代表的な分類にまとめて集約収録する
   ことも許容する(例: 第八輯の鼻の横顔40種→5分類に集約)。
10. **「まずは語彙を増やす戦略」の指示があった場合**、1回のセッションで
    章全体を無理に一度に片付けようとせず、区切りのよい1トピックずつ丁寧に
    データ化する進め方も許容する。
11. **(第十一輯で追加)新しいPDFの内容が、前回の引き継ぎで想定していた
    次章と異なる場合がある。** 実際に受領したPDFの目次・見出しを必ず
    確認し、想定と異なっていたら素直にその内容に沿って作業すること
    (無理に「頬・顎」等の想定済みトピックに寄せようとしない)。
12. **(第十一輯で追加・重要)`data/index.js` に新しいデータファイルを
    登録する際は、`tools/generate-index.js` の `DATA_FILES` 配列だけでなく
    `app/index.html` の `<script>` タグも必ず追加すること。** 過去数
    セッションにわたって `app/index.html` へのスクリプトタグ追加が漏れ
    続けており、今回発覚した時点で6ファイル・79項目が実際のブラウザ実行時
    に読み込まれない状態になっていた(今回修正済み)。

## 除外方針(恒久・累積。`source/notes.md`にも記載済み)

新しいPDFを読み込む際、以下のカテゴリの内容は**詳細を記載せず
「そのような発想・記述が原本に存在した」という事実のみ** `source/notes.md`
に記録し、データ化しない:

1. 性的な写真品評企画、身体的特徴と生殖器官・体毛・性機能を結びつける
   俗信(例: 不感症・不妊症・インポテンツとの相関、体毛の生え方と月経・
   生理現象の対応、性病罹患リスクの示唆)
2. 民族・人種・身分階層を骨相・体格と結びつけて性格や優劣を比較する記述
   (差別的ステレオタイプを含むもの)。形態上の一般概念(長頭・円頭、
   寒冷地・温暖地適応等)だけを、特定の集団や身分に結びつけない形で
   抽出するのは可
3. 精神疾患・自殺を身体的特徴と安易に結びつけるスティグマ的な記述
   (例: 指の歪みと発狂・自殺の相関、悩みを苦にした自殺の実例エピソード)
4. 特定の病名を診断的に示唆する記述(例: 爪の型が直接「脳溢血型」
   「心臓病型」等の病名になっているもの、人中の血色から子宮癌の兆候・
   眼球の色から胃や腎臓の病気を読み取るとする記述)。一般化した体質・
   体力・健康状態の表現に置き換えるのは可
5. 診断データそのものではない付随コンテンツ(読者質問コーナー、
   商品広告、寄生虫等の医学豆知識、参考書籍紹介、法医学トリビアや
   作家・有名人・皇室関係者・実名俳優/女優/経済人にまつわる余談
   エピソード、美容外科・歴史トリビア、実名を用いた具体的な個人の
   実例エピソード、社会時評・人口論・宗教史・気象学トリビア等の
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
8. 犯罪学(ロンブローゾ流)のように、身体的特徴(顎の形状、歯並び等)を
   犯罪傾向と直接結びつける記述に遭遇した場合は、方針3(精神疾患・自殺の
   スティグマ化)に準じて慎重に扱う。統計や学説の存在は記録するが、
   身体的特徴と犯罪傾向を直接結びつける具体的な記述は採用しない、という
   運用で第十一輯(歯の相・女囚の歯並び統計)に対応した。今後もこの運用を
   継続する。

## 未着手で残っている非性的な章

- **頬・顎の相(人相学詳論(十四)(十五))** → 新規 `data/cheek_jaw.js` 案。
  頬の胃穴・消化能力、顎の骨格三質論、二重顎、犯罪学的顎型論(要除外判断)
  など。★前々回から持ち越し、優先度高め
- **目の相(次回PDFの可能性が高い)** → 新規 `data/eyes.js` 案。原本に
  「次回はいよいよ画龍点睛の、眼の相法に入る」旨の記載あり。
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
- 目・気色(`core.js`が空のため丸ごと未着手)

## 今回やってほしいこと

1. 新しいPDF資料(または今回持ち越した頬・顎、あるいは目の相)を読み込んで、
   同じスキーマ(key/name/category/role/options[{id,label,tone,text}])で
   データ化
2. 新しいkeyは上記の「key一覧」と重複しないように付ける
3. 上記の未着手章、特に頬・顎、目、及び空のままの `core.js` 等5ファイルが
   あれば優先的にカバー(ただし着手前にユーザーに確認してもよい)
4. 採用/除外の判断は `source/notes.md` に追記する形で記録
   (除外方針は上記の累積リストに沿う。新しいパターンの除外が
   必要な場合はリストに追加してこの引き継ぎプロンプトにも
   反映されるよう明記する)
5. `docs/progress.md` に作業ログを追記
6. `data/index.js` と `tools/generate-index.js` の両方を更新し、
   可能であれば `node -e "require('./data/index.js')"` 等で
   重複keyやエラーがないか検証する
7. **`app/index.html` の `<script>` タグも忘れずに追加する**
   (第十一輯で判明したバグの再発防止)
8. UIには着手しない(データ拡充を優先)
9. 作業が終わったら、**リポジトリ全体を1つのzip**にしてdownload
   できるようにし(差分zipではなく丸ごと)、この形式の継続プロンプト
   (累積のkey一覧・注意事項つき)を更新して渡す

新しいPDFを添付します。
