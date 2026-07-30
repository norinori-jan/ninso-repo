# 作業ログ

★注意★ アップロードされた実ファイルが空(0バイト)だったため、
このファイルは第四輯・第五輯・今回のマージ作業の記録から再構成した
ものです。それ以前のログがもし別途存在していた場合は、このファイルの
先頭に追加してください。

---

## セッション: 第四輯(骨相学概説四・手相学概説一〜三)取り込み

- 入力: 第四輯 PDF (p.124-173)
- 追加ファイル: `data/palmistry.js` (新規、20項目、category="手相")
- 追記: `data/phrenology.js` に3項目(眉弓・額三分割・頭形長頭円頭)
  → `data/phrenology_additions.js` に追記用スニペットとして保存(要マージ)
- 除外事項: `source/notes.md` に記載
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

---

## セッション: 第五輯(手相学概説四・爪 / 五・丘掌紋)取り込み

- 入力: 第五輯・第六輯 PDF (p.174-215)
- 追加ファイル(すべて新規、既存ファイルへの追記なし):
  - `data/palmistry_nails.js` (11項目、role="爪")
  - `data/palmistry_mounts.js` (8項目、role="丘"/"指紋")
  - `data/palmistry_lines.js` (10項目、role="掌紋")
- 除外事項: `source/notes.md` に記載
  (知能線の島と性病遺伝の相関/女性の不感症・不妊症相関/
   小指の歪みと発狂・自殺の相関/爪型の具体的病名診断は一般化)
- 未実施(次回持ち越し):
  - `data/index.js` への3ファイル登録
  - `tools/generate-index.js` の `DATA_FILES` 配列への追記
  - `app/index.html` の `<script>` 読み込み追加
  - 前回(第四輯)分の実マージ結果の確認もまだの場合は合わせて確認
- UIは引き続き保留(データ拡充を優先する方針を継続)

### データの重複整理メモ

- `data/palmistry_mounts.js` の「丘」概念は、前回作成した
  `data/palmistry.js` の `palm_bagua_zones`(掌面八卦)とは別の
  座標系(東洋式の九宮 vs 西洋式の7つの丘)。両方とも同じ手のひらの
  異なる区切り方なので、UI設計時にどちらを採用するか、あるいは
  両方をレイヤーとして切り替えられるようにするか、要検討。

---

## セッション: 実ファイルマージ作業(index.js / generate-index.js / index.html / notes.md / progress.md / phrenology.js)

- ユーザーから上記6ファイルのアップロードを受けたが、以下の状況が判明:
  - `data/index.js` / `tools/generate-index.js` / `app/index.html` /
    `source/notes.md` / `docs/progress.md` の5ファイルは **0バイト(空)**
    だった。ローカルにまだ実体がない、もしくはアップロード時に空の
    まま送られた可能性がある。
  - `data/phrenology.js` は中身が入っていたが、これまで前提にしてきた
    スキーマ(`key/name/category/role/options[{id,label,tone,text}]`)
    ではなく `id/category/title/description` という別スキーマで、
    しかも実際の「骨相学42部位論の抜粋16項目」は
    `// 既存の phrenology データ項目群...` というコメントのみで
    実データが入っていなかった。追記された3項目
    (`phrenology_add_01/02/03`)も、実際にこちらで作成した
    `brow_ridge_intuition` 等とは名前も中身も一致しない汎用的な
    プレースホルダーだった。
  - このため「本物の現状ファイルへの正確なマージ」ではなく、
    **ゼロからの再構成**として全ファイルを作成した。
    `data/phrenology.js` は、実在するはずの16項目部分を
    「ここに実データをマージしてください」という空配列のプレースホルダーとし、
    今回作成した3項目(`brow_ridge_intuition` / `forehead_thirds` /
    `head_shape_long_round`)のみをスキーマ統一の上で実データとして
    含めた。
- 次回、本物の `data/phrenology.js`(16項目入り)や、実際に運用している
  `data/index.js` 等が見つかった場合は、今回作成したものと突き合わせて
  正しくマージし直す必要がある。

---

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

---

# 第六輯 作業ログ(docs/progress.md への追記用)

## 実施内容

- 第六輯(骨相学・額の相・毛髪の相 掲載箇所)のPDFを読み込み、
  以下の新規データファイルを作成:
  - `data/forehead_extra.js`(額・骨相学関連 12項目)
    - forehead_three_sections
    - forehead_three_qualities_shape
    - forehead_fuji_shape
    - forehead_goose_pattern
    - forehead_official_fortune_zone
    - forehead_color_reading
    - forehead_mole_position
    - forehead_birth_order_belief
    - skull_width_reasoning
    - forehead_symmetry
    - glabella_health_sign
  - `data/hair.js`(毛髪関連・新カテゴリ「毛髪」 7項目)
    - hair_color_depth
    - hair_whorl_direction
    - hair_texture_type
    - hair_baldness_pattern
    - hairline_m_shape
    - hair_density_vitality
    - hair_growth_line_marks

- 除外判断は `source/notes_vol6_addendum.md` に記録
  (陰毛の相、巻末の性風俗業向け顔分類、毛髪トリビア類を除外)

- 除外方針に新パターンを1件追加提案
  (人相・骨相を性風俗業の営業ノウハウとして解説する記述の除外)

## 未確認・要注意事項(継続)

- 今回も実ファイル(`data/index.js` / `tools/generate-index.js` /
  `data/phrenology.js` 本体など)は未確認のまま。
  `forehead_extra.js` は category「顔」、`data/phrenology.js` は
  category「骨相学」としているため、`skull_width_reasoning` のみ
  骨相学カテゴリとして `forehead_extra.js` 内に含めている点に注意
  (ファイル名と中身のカテゴリが完全一致しない設計になっている)。
  次回、実ファイルを見た上で `phrenology.js` 側に移動したほうが
  自然であれば移動してよい。

- `data/hair.js` は「毛髪」という新カテゴリを追加した。
  UIやフィルタ機能を将来作る場合はカテゴリ一覧にこれを加える必要が
  ある。

## 未着手で残っている非性的な章(前回からの持ち越し・変更なし)

- 十字面法の残り型(王字面・目字面・用字面など) → `data/face_shape.js`
- 身体総論の続き(臍・腰・臀・足・後ろ姿など) → `data/body.js`
- 咽喉・首の高さ、顔面角度(カンペール角) → 新規 `data/head_neck.js` 案
- 骨相学42部位論の残り → `data/phrenology.js`
- 手相の「指の動きによる兆占い」→ `data/omens.js` 案
- 掌線と年齢目盛りの精密な図解(概念のみ採用済み)
# 作業ログ追記(第七輯・第八輯分)

## 実施内容

- 入力: 『観相発秘録』第七輯・第八輯(眉の相・鼻の相冒頭)PDF
- 出力:
  - `data/eyebrows.js` (新規ファイル。category「顔」role「眉」。15項目。
    key はすべて `eyebrow_` プレフィックス)
  - `data/nose.js` (新規ファイル。category「顔」role「鼻」。12項目。
    key はすべて `nose_` プレフィックス)
  - `source/notes_vol7_addition.md` (採用/除外の記録)

## 重要な注意(今回特有)

- **今回のセッションではリポジトリの実ファイルが一切アップロードされて
  いない。** `core.js` に既存の眉・鼻関連キーがあるかどうか未確認のまま
  作業した。重複防止のため、新規キーはすべて `eyebrow_` / `nose_` の
  プレフィックスを付けたが、これは暫定的な安全策であり、根本的な解決には
  ならない。**次回、必ず実ファイル(especially core.js)を確認し、重複
  キーや役割分担の整理を行うこと。**
- 第六輯までと同様、`tools/generate-index.js` の `DATA_FILES` 配列に
  `data/eyebrows.js` と `data/nose.js` を追加する必要があるが、これも
  実ファイル未確認のため、ユーザー側で反映すること。
- 鼻の凹凸型に関する記述で、民族名を冠した古い俗称(ユダヤ鼻型など)を
  含むオプションを1件採用した。完全除外ではなく、偏見的解釈を戒める注記を
  本文に追加する形で処理した。この判断基準は次回引き継ぎプロンプトにも
  明記した。

## 未着手で残っている章(第七輯・第八輯からの追加分)

- 鼻の相の続き(第八輯以降、準頭・人中・法令・鼻孔の詳細、鼻と口の対応など)
  はPDFの範囲外、または今回は総論部分のみの収録。続きが別冊にあれば
  次回対応。
- 従来からの未着手章(十字面法の残り型、身体総論の続き、骨相学42部位論の
  残り等)は今回も未着手のまま。

## 次回への引き継ぎ

- 次回引き継ぎプロンプト(累積版)を更新し、渡す。

## 追記(実ファイル受領後の追記・本セッション)

上記「今回特有の注意」に記載した「実ファイル未確認」の状態は、本セッション中に
ユーザーから `ninso-repo-clean.zip`(実際のリポジトリ一式)がアップロードされた
ことで解消した。実際に確認した結果:

- `data/core.js` / `constitution.js` / `five_elements.js` / `face_shape.js` /
  `body.js` / `app/app.js` は**すべて0バイト(空ファイル)** だった。つまり
  これまでの懸念(眉・鼻の既存キーとの重複)は杞憂であり、実データは何も
  入っていなかった。
- `data/phrenology.js` は実データとして統一スキーマの3項目
  (`brow_ridge_intuition` 等)のみが有効で、本来の42部位論16項目は
  プレースホルダーのまま(`ORIGINAL_16_ITEMS_PLACEHOLDER = []`)だった。
- これを受けて `data/eyebrows.js` / `data/nose.js` を、他のデータファイル
  (`forehead_extra.js` 等)と同じUMDパターン
  (`root.EYEBROWS` / `root.NOSE` としてブラウザにも公開)に整形し直し、
  `data/index.js`(require一覧・root参照・concat配列すべて)と
  `tools/generate-index.js` の `DATA_FILES` 配列に正式登録した。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成。
  全96項目、重複keyなしを確認済み(Node上で実行検証済み)。
- `source/notes.md` / `docs/progress.md` は、これまで別ファイル
  (`*_vol6_addendum.md` 等)に分けて渡していた追記分を、本セッションで
  実ファイル本体に直接統合した。次回以降は同様に本体への直接マージを
  基本方針とする。

## 第八輯(鼻の相続き・法令の相)対応セッション

- 入力: 『観相発秘録』第八輯(鼻の相の続き、及び「人相学詳論(五)法令の相」)PDF
- 出力:
  - `data/nose.js` に12項目追加(計24項目。年代による鼻の変化、山根の高さと
    知能・体質・気性、鼻のホクロの年代別暗示、犬鼻型の金銭感覚、鼻の穴の見え方、
    鼻の赤みの意味、横顔輪郭の分類(ローマ鼻・ギリシャ鼻等)、鼻をいじる癖、
    準頭の発達時期)
  - `data/nasolabial.js` (新規ファイル。category「顔」role「法令」。12項目。
    key はすべて `nasolabial_` プレフィックス。法令の定義、長さと職業安定性、
    広がり方と職業タイプ、年齢の目安、切れ目・ホクロ・キズ、口へ入る相、
    色の読み方、二重法令、ホクロと家業、左右対称性、足のケガとの対応、
    木の根の比喩)
  - `source/notes.md` に採用/除外の記録を追記(第八輯分)
  - `docs/progress.md` (本追記)

## 作業内容の詳細

- `data/index.js` の Node側 `safeRequire` 一覧、ブラウザ側 `root.NASOLABIAL`
  参照、factory引数、concat配列のすべてに `nasolabial.js` / `nasolabial` を追加。
- `tools/generate-index.js` の `DATA_FILES` 配列に `'nasolabial.js'` を追加。
- `node -e "require('./data/index.js')"` で実行確認し、**合計120項目・
  重複keyなし**を確認済み。カテゴリ内訳は「顔/鼻」24項目、「顔/法令」12項目
  (新設)を含む。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成済み。

## 除外の要点(詳細は `source/notes.md` 参照)

- 山根・横筋と夫婦の性的相性・不感症を結びつける章の大部分(除外方針①)、
  生殖器官(睾丸・卵巣)と鼻の形状を対応づける記述(除外方針①)、
  脱税を苦にした自殺の実例エピソード(除外方針③)、
  芥川龍之介の小説・隆鼻術の歴史逸話・実名を用いた具体例(除外方針⑤)
  などを除外した。
- 「ユダヤ鼻」等の民族名を冠した性格描写は、前回同様、民族名を外して
  形態・性格描写のみを抽出する方針で処理した
  (`nose_profile_western_classification`)。
- 第八輯収録の40種類前後の鼻の横顔カタログ(278〜289ページ)は類似記述が
  多いため、代表的な5分類にまとめて集約収録した。個別の図ごとの詳細差分は
  今回は未収録(将来、必要なら原本を再確認して細分化可能)。

## 未着手で残っている章(累積)

- `core.js` 等5ファイル(顔全体の目・口・耳・顎・気色、体質、五行、輪郭、身体)
  は依然として空のまま。優先度高めで着手を検討してよい。
- 十字面法の残り型、身体総論の続き、骨相学42部位論の残り、鼻の横顔40分類の
  個別詳細化などは今回も未着手(または簡略集約のみ)。

## 次回への引き継ぎ

- 次回引き継ぎプロンプト(累積版)を更新し、渡す。

## 第九・十輯(人相学詳論(十三)人中の相)対応セッション

- 入力: 『観相発秘録』第九・十輯 PDF(人中の相の部分のみ今回対応。
  頬・顎・口の部分は次回持ち越し)
- 方針: ユーザーからの指示「まずは語彙を増やす戦略」に基づき、人中の
  基本用語(禄倉・食倉、才一〜四図)と代表的な読み方を優先してデータ化した。
- 出力:
  - `data/philtrum.js`(新規ファイル。category「顔」role「人中」。10項目。
    key はすべて `philtrum_` プレフィックス。定義・禄倉食倉、年代変化、
    長短と寿命、曲がりと利き足、ホクロ位置、広さ狭さと生活安定度、
    横筋と生活苦、男女判断の言い伝え、ヒゲの生やし方、夫婦運・晩年運)
  - `source/notes.md` に採用/除外の記録を追記(第九・十輯分)
  - `docs/progress.md` (本追記)

## 作業内容の詳細

- `data/index.js` の Node側 `safeRequire` 一覧、ブラウザ側 `root.PHILTRUM`
  参照、factory引数、concat配列のすべてに `philtrum.js` / `philtrum` を追加。
- `tools/generate-index.js` の `DATA_FILES` 配列に `'philtrum.js'` を追加。
- `node -e "require('./data/index.js')"` で実行確認し、**合計130項目・
  重複keyなし**を確認済み。カテゴリ内訳に「顔/人中」10項目(新設)を追加。
- `node tools/generate-index.js` を実行し `docs/DATA_INDEX.md` を再生成済み。

## 除外の要点(詳細は `source/notes.md` 参照)

- 人中を子宮そのものに対応づけ、血色・血点から子宮癌の初期兆候を読む
  とする記述(除外方針①④に強く該当)を全面除外。
- 人中の太さと無精子症・不妊等を結びつける記述(除外方針①)を除外。
- 結婚を控えた娘の素行に関する読者相談の実例エピソード(除外方針⑤)を除外。
- 戦時中・戦後の人口論・出生率の社会時評的な記述(除外方針⑤に準じる)を対象外。

## 未着手で残っている章(累積)

- 頬・顎の相(人相学詳論(十四)(十五))、口の相(人相学詳論(十六))は
  今回未着手。次回のセッションで対応予定。
- `core.js` 等5ファイル(顔全体の目・耳・気色、体質、五行、輪郭、身体)は
  依然として空のまま。優先度高めで着手を検討してよい。

## 次回への引き継ぎ

- 次回引き継ぎプロンプト(累積版)を更新し、渡す。
