# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版/整理済み)

## ★フェーズ移行のお知らせ(重要)

PDFからの相法データ入力フェーズは第十二輯(眼の相(五)+挙動+食事+声、
合計262項目)でひとまず区切りとなった。ユーザーの指示により、**次回以降は
UIフェーズ**(`app/app.js` `app/style.css` 等、まだ空ファイルの実装)に
入る。特に「カルテ機能」(実際の人物の顔を見ながら部位ごとに観察内容を
記録し、蓄積していく機能)の実装を最優先で進める。設計の土台は
`docs/KARTE_DESIGN.md` と `app/assets/face-zones.svg`(第十二輯セッションの
続きで追加済み)を参照。データ拡充(新しいPDFの取り込み)は、ユーザーから
明示的な指示があった場合のみ再開する。

---

ninso-repo(人相占いPWA)の拡張データ作業の続きです。
**このリポジトリは整理済みです。** 重複ファイル・古いzip・空ファイルは
削除し、`data/index.js` は実際に動作確認済みです(第四輯〜第十二輯分
すべてマージ・動作確認済み。**合計262項目・重複keyなし**)。

## 現在の構成(第十二輯取り込み後、整理済み)

```
ninso-repo/
├── app/
│    ├── index.html / app.js / style.css / manifest.json / service-worker.js
│    │    ★ <script>タグは data/ 配下の全ファイル分を網羅済み(要確認習慣は継続)
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
│    ├── mouth.js (顔・口 12項目)
│    ├── teeth.js (顔・歯 12項目)
│    ├── ear.js (顔・耳 11項目)
│    ├── cheekbone.js (顔・観骨 9項目)
│    ├── eyes.js (顔・眼 55項目) ★第十一・十二輯で追加、第十二輯で16項目追加
│    ├── gait.js (行動・挙動 13項目) ★第十二輯で新規追加
│    ├── eating.js (行動・食事 9項目) ★第十二輯で新規追加
│    ├── voice.js (行動・声 11項目) ★第十二輯で新規追加
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式。動作確認済み・
│         合計262項目、重複key無し)
├── tools/generate-index.js (DATA_FILES配列、`npm run index`で
│    docs/DATA_INDEX.md を自動生成。動作確認済み)
├── source/notes.md (出典・採用/除外方針。第四〜十二輯分すべて追記済み)
├── docs/
│    ├── progress.md (作業ログ。第四〜十二輯分すべて追記済み)
│    ├── DATA_INDEX.md (自動生成物。npm run index の最新出力)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json ("index"スクリプトあり)
├── .gitignore (node_modules/ *.zip等を除外)
└── README.md (簡単な説明)
```

### 今回(表紙「第十二・集・輯」・実質「眼の相(五)」+「挙動と音声」+
### 「食事」対応セッション)やったこと

- 受領したPDFの表紙号数表記は「第十二・集・輯」だったが、実際の内容は
  人相学詳論(二十五)「眼の相(五)」から始まり、五眼(仏教)・眼相の
  一行占(玄龍相法より)で眼の章が完結、続けて「挙動と音声」(挙動・
  音声)、「食事」の各章が収録された構成だった。
- `data/eyes.js` に16項目追加(39→55項目)。まぶたの三区画観察法
  (目頭側い/中央ろ/目尻側は)、上まぶた中央の隆起/下垂パターン各種
  (落ち着き型・老成型・芸術型・現実型)、下まぶたの隆起パターン
  (意欲・自信型)、涙堂・臥蚕の隆起/平坦(家庭運)、陰徳部(目の下)の
  色つや俗信、下まぶたの技術者型、まつ毛の多寡の俗信、眼球周囲に
  十二宮を対応させる観法の概要、赤脈の位置による意味づけ、眼光の盛衰、
  仏教の五眼(肉眼・天眼・慧眼・法眼・仏眼・慈眼)、玄龍相法の一行占
  集成(円眼・凹眼・白目の色・近視眼など)。
- 新規ファイル3つを追加(新カテゴリ「行動」を新設):
  - `data/gait.js`(category「行動」role「挙動」・13項目)。歩く速さ・
    歩幅と重心・姿勢(猫背)・動物にたとえた歩き方の分類(虎行・蛇行等、
    実名の人物例は除外)・爪先とかかとの重心・きょろきょろする癖・
    うつむき/仰向き・良い歩き方を意識して精神を養う発想・杖の突き方・
    落ち着いた歩調・内輪/外輪(つま先の向き)の歴史的変遷・癖を自覚し
    正すことの大切さ。
  - `data/eating.js`(category「行動」role「食事」・9項目)。食べる速さ・
    体型と食事量の組み合わせ・暴飲暴食と身代・食べ方の品位・食文化に
    よる食事時間の違い・好き嫌い・年齢による食欲の変化・富貴貧困と
    食べ始め方・食事量や時間の規則性。
  - `data/voice.js`(category「行動」role「声」・11項目)。声・音声の
    重要性の総論・年齢性別による声の違い・鐘の音にたとえた余韻の聞き
    方・声の太さ強さ・話す速さ/話し方の癖・五行にあてはめた声質分類
    (木火土金水)・どもり/つっかえ・感情による声の変化・泣き声笑い声・
    声の大小・語尾の締まり方。
- `data/index.js`(Node側require一覧・ブラウザ側root参照・factory引数・
  concat配列すべて)と `tools/generate-index.js` の `DATA_FILES` 配列を
  `gait.js` / `eating.js` / `voice.js` 追加で更新。
- `app/index.html` に3ファイル分の `<script>` タグを `eyes.js` の直後・
  `index.js` の直前に追加し、`grep -n "script src" app/index.html` で
  全ファイル分そろっていることを目視確認済み。
- `node -e "require('./data/index.js')"` で実行確認し、**合計262項目・
  重複keyなし**を確認済み。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成済み。
- `source/notes.md` / `docs/progress.md` に採用/除外の記録・作業ログを追記済み。
- 実在の俳優・女優(「娼婦型」の例示に使われたソフィア・ローレン、
  市川雷蔵、島倉千代子等)、歴史上の人物(西郷隆盛、芥川龍之介、
  徳川末期の遊女、梅田雲浜、李鴻章、清国曾紀沢、織田信長、加藤清正、
  武田信玄、豊臣秀吉、水野南北先生)への直接言及、涙堂・陰徳部の色を
  特定病名(腎臓炎・腎虚等)や性機能と結びつける記述、眼相一行占の
  「人を殺す相」等の殺傷断定条文、近視眼の原因を自慰とする記述などを
  除外方針に従い除外(詳細は `source/notes.md` 参照)。

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

### 顔・額・眉・鼻・法令・人中・口・歯・耳・観骨・眼(category: "顔")

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
- `data/mouth.js`(役割=口。12項目):
  `mouth_lower_lip_taste_sensitivity`, `mouth_size_vitality_elasticity`,
  `mouth_protrusion_instinct_type`, `lip_thickness_altruism_selfishness`,
  `mouth_size_ambition_scale`, `lip_line_clarity_chastity`,
  `lip_color_health_omen`, `mouth_expression_habit_fortune`,
  `lip_mole_speech_caution`, `smile_teeth_gum_visibility`,
  `mouth_intake_outtake_restraint`, `mouth_expression_fortune_cultivation`
- `data/teeth.js`(役割=歯。12項目):
  `tooth_three_types_function`, `tooth_type_ratio_diet_reflection`,
  `tooth_organ_correspondence`, `tooth_anatomy_structure`,
  `tooth_eruption_timeline`, `tooth_alignment_personality`,
  `tooth_gap_center_incisors`, `tooth_pointed_canine_personality`,
  `tooth_size_uniformity_reading`, `tooth_color_whiteness_reading`,
  `tooth_folk_belief_hair_nerve`, `tooth_omens_collection`
- `data/ear.js`(役割=耳。11項目):
  `ear_completion_order_belief`, `ear_age_classification_pattern`,
  `ear_anatomy_terminology`, `ear_position_height_reading`,
  `ear_zone_map_meaning`, `ear_size_lucky_ear_belief`,
  `ear_color_health_link`, `ear_lobe_development_by_age`,
  `ear_rim_development_family_bond`, `ear_folk_omens_collection`,
  `ear_orientation_career_suitability`
- `data/cheekbone.js`(役割=観骨。9項目):
  `cheekbone_bone_vs_flesh_prominence`, `cheekbone_prominent_independence`,
  `cheekbone_overprominent_stubbornness`, `cheekbone_color_trust_reading`,
  `cheekbone_climate_adaptation_theory`, `cheekbone_side_profile_direction_type`,
  `cheekbone_mole_life_stage_omens`, `cheekbone_beard_growth_fortune`,
  `cheekbone_low_prominence_personality`
- `data/eyes.js`(役割=眼。第十一・十二輯で追加、55項目):
  `eye_importance_overview`, `eye_light_dominant_weight`,
  `eye_anatomical_parts_names`, `eye_age_related_changes_table`,
  `eye_pupil_light_response`, `eye_three_qualities_correspondence`,
  `eye_shape_terminology_types`, `eye_size_personality_large`,
  `eye_size_personality_small`, `eye_protrusion_type`, `eye_sunken_type`,
  `tianzhai_eyelid_area_meaning`, `tianzhai_width_fortune`,
  `tianzhai_texture_reading`, `eye_mole_position_folk_belief`,
  `eye_asymmetry_left_right_reading`, `eye_asymmetry_inheritance_folk_belief`,
  `elephant_eye_type`, `eye_tilt_up_down_type`, `eye_corner_shape_reading`,
  `eyelid_heaviness_type`, `sanbaku_upper_variant_types`,
  `four_white_eye_caution_reading`, `gyobi_sen_crows_feet_presence`,
  `gyobi_sen_count_folk_belief`, `peach_blossom_eye_folk_term`,
  `snake_eye_folk_type`, `double_eyelid_personality`,
  `single_eyelid_personality`, `epicanthic_fold_description`,
  `red_vein_pupil_omens_collection`, `eye_color_pupil_meaning`,
  `eye_color_climate_theory`, `sangan_rokushin_method_intro`,
  `tai_shirome_color_reading`, `pupil_twelve_palace_method_intro`,
  `daruma_eye_method_seven_conditions`, `pupil_size_willpower_reading`,
  `pupil_size_region_folk_theory`,
  **(★第十二輯で追加)** `eyelid_zone_division_method`,
  `eyelid_middle_zone_rise_restrained_type`,
  `eyelid_middle_zone_sag_sophisticated_type`,
  `eyelid_middle_zone_sag_artistic_type`,
  `eyelid_middle_zone_flat_realistic_type`,
  `eyelid_lower_business_vitality_type`, `tear_duct_swelling_rise_type`,
  `tear_duct_flat_lonely_type`, `hidden_virtue_skin_color_belief`,
  `lower_eyelid_craftsman_technical_type`, `eyelash_density_reading`,
  `eye_twelve_palace_mapping_method`, `red_vein_palace_position_collection`,
  `eye_vigor_life_stage_reading`, `five_buddhist_eyes_concept`,
  `eye_folk_one_line_readings_collection`

### 毛髪(category: "毛髪")

- `data/hair.js`: `hair_color_depth`(色), `hair_whorl_direction`(つむじ),
  `hair_texture_type`(質), `hair_baldness_pattern`(はげ),
  `hairline_m_shape`(生え際), `hair_density_vitality`(密度),
  `hair_growth_line_marks`(生え際)

### ★新設: 行動(category: "行動") — 第十二輯で新規追加

- `data/gait.js`(役割=挙動。13項目): `gait_reflects_personality_overview`,
  `gait_speed_energy_reading`, `gait_stride_weight_balance_reading`,
  `gait_posture_slouch_reading`, `gait_animal_metaphor_collection`,
  `gait_toe_heel_pressure_reading`, `gait_looking_around_reading`,
  `gait_head_direction_reading`, `gait_mimicry_self_improvement_belief`,
  `gait_cane_carrying_reading`, `gait_calm_confident_pace_reading`,
  `gait_inward_outward_toe_historical_pattern`,
  `gait_habitual_correction_effort`
- `data/eating.js`(役割=食事。9項目): `eating_speed_reading`,
  `eating_amount_body_type_correlation`, `overeating_fortune_reading`,
  `eating_manner_elegance_reading`, `eating_culture_duration_comparison`,
  `picky_eating_reading`, `eating_age_appetite_change_reading`,
  `poverty_wealth_eating_manner_reading`, `eating_habit_fixed_routine_reading`
- `data/voice.js`(役割=声。11項目): `voice_importance_overview`,
  `voice_age_gender_typical_tone`, `voice_resonance_bell_metaphor`,
  `voice_strength_clarity_reading`, `voice_speed_talkativeness_reading`,
  `voice_five_elements_type_overview`, `voice_stutter_hesitation_reading`,
  `voice_emotional_pitch_change_reading`, `crying_laughing_voice_reading`,
  `voice_volume_reading`, `voice_trailing_pitch_direction_reading`

### 顔全体・体質・五行・輪郭・身体(未着手・空ファイル)

`core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
`body.js` は **中身が空(0バイト)** のまま。眼・気色は眼の相データで
かなりカバーしたが、`core.js` ファイル自体はまだ未実装。
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
6. **`data/core.js` 等5ファイルが空のまま。** 顔の気色(眼以外の部分)、
   体質、五行、輪郭、身体が残っている。優先度高めで着手を検討してよい
   (次回、着手するか確認してから進める)。
7. **`package.json`が空だと `require()` が全滅する**ことが判明済み。
   今後、空ファイルのプレースホルダーをコミットしないよう注意。
8. **`*.zip` は `.gitignore` 済み。** 今後、配布用zipをリポジトリ内に
   直接コミットしないこと。
9. **章によっては、原本に類似記述が大量に反復収録されていることがある。**
   全項目を逐一データ化するのではなく、代表的な分類にまとめて集約収録する
   ことも許容する(例: 第八輯の鼻の横顔40種→5分類に集約、瞳孔十二相秘伝も
   逐条列挙せず概要に要約、第十二輯の挙動の動物比喩も代表数種に集約)。
10. **「まずは語彙を増やす戦略」の指示があった場合**、1回のセッションで
    章全体を無理に一度に片付けようとせず、区切りのよい1トピックずつ丁寧に
    データ化する進め方も許容する。
11. **新しいPDFの内容が、前回の引き継ぎで想定していた次章と異なる場合が
    ある(表紙の号数表記と実際の内容が一致しないこともある)。**
    実際に受領したPDFの目次・見出しを必ず確認し、想定と異なっていたら
    素直にその内容に沿って作業すること(第十一輯・第十二輯とも該当)。
12. **(重要・繰り返し注意)`data/index.js` に新しいデータファイルを
    登録する際は、`tools/generate-index.js` の `DATA_FILES` 配列だけでなく
    `app/index.html` の `<script>` タグも必ず追加すること。** 過去
    セッションで `app/index.html` へのスクリプトタグ追加漏れが繰り返し
    発生していたため、追加後に `grep -n "script src" app/index.html` で
    全ファイル分そろっているか必ず目視確認すること(第十二輯でも実施済み)。
13. **性的な内容や病名の診断的示唆に触れる話題ほど、「そのような俗称・
    俗信が存在した」という形に一般化して抽出すると データとして残しやすい。**
    完全除外一辺倒にせず、`tone: "caution"` や注記文で読者に配慮しつつ、
    鑑定アプリとしての面白さも損なわないバランスを今後も意識する。
14. **(今回追加)新カテゴリ「行動」を新設した。** これまでの「顔」
    「手相」「毛髪」「骨相学」に加え、挙動(歩き方)・食事・声のような
    身体動作・生活習慣系のデータは category「行動」、role にそれぞれの
    トピック名(挙動/食事/声)を用いる方針とする。今後、視線・表情の
    細かい挙動や、他の生活習慣データを追加する際もこのカテゴリを使う。

## 除外方針(恒久・累積。`source/notes.md`にも記載済み)

新しいPDFを読み込む際、以下のカテゴリの内容は**詳細を記載せず
「そのような発想・記述が原本に存在した」という事実のみ** `source/notes.md`
に記録し、データ化しない:

1. 性的な写真品評企画、身体的特徴と生殖器官・体毛・性機能を結びつける
   俗信(例: 不感症・不妊症・インポテンツとの相関、体毛の生え方と月経・
   生理現象の対応、性病罹患リスクの示唆、まぶたの折れ方と愛人関係の
   結びつけ)
2. 民族・人種・身分階層を骨相・体格と結びつけて性格や優劣を比較する記述
   (差別的ステレオタイプを含むもの)。形態上の一般概念(長頭・円頭、
   寒冷地・温暖地適応、蒙古ひだの形状等)だけを、特定の集団や身分に
   結びつけない形で抽出するのは可
3. 精神疾患・自殺を身体的特徴と安易に結びつけるスティグマ的な記述
   (例: 指の歪みと発狂・自殺の相関、悩みを苦にした自殺の実例エピソード、
   眼の形と殺傷・剣難を直接断定する条文)
4. 特定の病名を診断的に示唆する記述(例: 爪の型が直接「脳溢血型」
   「心臓病型」等の病名になっているもの、人中の血色から子宮癌の兆候・
   眼球の色から胃や腎臓の病気、出眼と甲状腺疾患、涙堂・陰徳部の色から
   腎臓炎・腎虚等を診断的に読み取るとする記述)。一般化した体質・体力・
   健康状態の表現に置き換えるのは可
5. 診断データそのものではない付随コンテンツ(読者質問コーナー、
   商品広告、寄生虫等の医学豆知識、参考書籍紹介、法医学トリビアや
   作家・有名人・皇室関係者・実名俳優/女優/経済人/政治家/歴史上の人物に
   まつわる余談エピソード、美容外科・歴史トリビア、実名を用いた具体的な
   個人の実例エピソード、社会時評・人口論・宗教史・気象学トリビア・
   ナショナリズム的言辞等の雑学的コンテンツ)は単純に対象外
   (除外理由の記録も不要)
6. 人相・骨相を性風俗業(遊女・男娼など)の顧客分類や営業ノウハウ
   として解説する記述は、診断データ化せず、存在した事実のみを
   記録する。単純な風俗史的言及(例:特定の職業で眉を剃る習慣が
   あった、という事実の言及)は対象外として扱ってよい。
7. 「ユダヤ鼻」のように性格描写に民族名が慣用的に使われている古い俗称が
   出てきた場合、①完全除外、②民族名を外して形態のみ抽出、③偏見的解釈を
   戒める注記つきで採用、のいずれかを都度判断する。
8. 犯罪学(ロンブローゾ流)のように、身体的特徴(顎の形状、歯並び、
   眼の形状等)を犯罪傾向と直接結びつける記述に遭遇した場合は、方針3
   (精神疾患・自殺のスティグマ化)に準じて慎重に扱う。統計や学説の
   存在は記録するが、身体的特徴と犯罪傾向を直接結びつける具体的な
   記述は採用しない、という運用を継続する。

## 未着手で残っている非性的な章

- **頬・顎の相(人相学詳論(十四)(十五))** → 新規 `data/cheek_jaw.js` 案。
  頬の胃穴・消化能力、顎の骨格三質論、二重顎、犯罪学的顎型論(要除外判断)
  など。★数回前から持ち越し、優先度高め
- **顔・体質・五行・輪郭・身体の基礎データ全般**(`core.js` 等5ファイル
  が空)→ 優先度高め。
- 挙動の章末尾にある、対座時の視線の外し方・瞬きの多さ・眼を閉じて
  話す癖などの視線・表情寄りの細かい挙動 → 今回は歩行・姿勢の主要
  パターンを優先したため持ち越し。次回、`data/eyes.js` への追加か
  新規 `data/facial_expression.js` かを検討する。
- 十字面法の残り型(王字面・目字面・用字面など) → `data/face_shape.js`
- 身体総論の続き(臍・腰・臀・足・後ろ姿など) → `data/body.js`
- 咽喉・首の高さ、顔面角度(カンペール角) → 新規 `data/head_neck.js` 案
- 骨相学42部位論の残り(秩序性・計数性・事実性・位置性・時間性・
  音調性・言語性・推因性・比較性・諧謔性・直覚性・調和性など)
  → `data/phrenology.js`
- 手相の「指の動きによる兆占い」→ 別データ構造(`data/omens.js`案)を
  検討するか判断
- 掌線と年齢目盛りの精密な図解(概念のみ採用、精密な座標は未採用)
- 鼻の横顔40分類カタログの個別詳細化(代表5分類に集約収録のみ)
- 瞳孔十二相秘伝の逐条の精密な図解・座標(概要のみ採用)

## 今回やってほしいこと

1. 新しいPDF資料(または今回持ち越した頬・顎、視線・表情の細かい挙動、
   あるいは `core.js` 等の基礎データ)を読み込んで、同じスキーマ
   (key/name/category/role/options[{id,label,tone,text}])でデータ化
2. 新しいkeyは上記の「key一覧」と重複しないように付ける
3. 上記の未着手章、特に頬・顎、及び空のままの `core.js` 等5ファイルが
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
   (過去複数回発覚したバグの再発防止。追加後に
   `grep -n "script src" app/index.html` で全ファイル分そろっているか
   必ず確認する)
8. UIには着手しない(データ拡充を優先)
9. 作業が終わったら、**リポジトリ全体を1つのzip**にしてdownload
   できるようにし(差分zipではなく丸ごと)、この形式の継続プロンプト
   (累積のkey一覧・注意事項つき)を更新して渡す

新しいPDFを添付します。
