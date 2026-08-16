# 継続プロンプト(次回セッションの冒頭に貼り付け用・累積版/整理済み)

## ★今回(隠れ相タブ: マーク解釈の文言・UIフロー全面見直し)セッションで行ったこと(更新版15・最新)

**ユーザーからの指摘(実機スクリーンショットつき):**
1. 解釈文が回りくどく、免責(「参考程度に留めてください」等)がマーク
   ごとに繰り返され、何が言いたいのか分かりにくい。もっと断定的に
   言い切ってほしい。
2. 検出位置をプルダウンで人間が選ぶ操作が主経路になっていた。これは
   鑑定される側が自分の位置を自己申告しているだけで、鑑定として意味が
   ない(「鑑定は自分が気付かないことを教えてくれるもの」との指摘)。
3. 検出数の多さを「複雑」「不安定」といった評価に結びつけるべきでは
   ない。1件1件が独立して意味を持つものとして扱ってほしい。
4. 目・口のように並んだ構造(隠れた顔)が見つかった場合は、丸ではなく
   点(●●●)で示してほしい。
5. 線状のマークは、線の始点・終点それぞれの伝統的な部位をつなげて、
   1つの具体的な意味として言い切ってほしい(例として「先祖に守られて
   家財が増える」のような結び方が挙げられた)。
6. 講座動画・音声も次回以降さらに参考にできる、との申し出あり。

**対応(`app/app.js`中心。詳細は`docs/progress.md`の同名エントリを参照):**
- 免責文をマークごとに繰り返す代わりに案内文(`notice`)に一度だけ集約し、
  個々の解釈文は断定的な言い切り調に書き直した(`buildMarkInterpretation()`
  全面書き直し)。
- 位置プルダウンは既定で自動判定を使う設計に変更。選択直後に自動提案の
  部位名をプルダウンへ勝手にセットしていた挙動(自動判定と手動選択の
  区別を壊していたバグ)を削除。プルダウン自体は`<details>`内の
  「任意・通常は不要」な手動修正欄に格下げし、「自分で選ぶと自己申告に
  なり鑑定としての意味が弱くなる」旨を明記した。
- マークをクリックした瞬間にその場で解釈が表示されるよう変更(旧:
  位置等を選んでから「このマークを解釈する」ボタンを押す必要があった。
  ボタンは廃止し、`interpretCurrentMark()`を選択時・手動修正の`change`
  イベント時の両方から呼ぶ共通処理にした)。
- 線状マークは始点・終点それぞれの最寄りの伝統的部位を求め、異なる
  場合は「AからB」という1つの意味としてつなげる文を生成する
  (`regionPhrase()`ヘルパーで部位の意味から名詞句を抜き出して接続)。
- 既存の`hidden-face-detector.js`の`findFaceCandidatesMultiScale()`
  (元は「本物の顔の目・口」検出用)を「自動検出する」ボタンの処理に
  追加で組み込み、目・口のように並んだ構造を`gansouMark.faceMarks`と
  して検出。丸ではなく点3つ(目・目・口、緑色、選択時は赤)+薄い破線で
  canvasに描画し、「F1」「F2」…という独立した番号体系で表示。クリックで
  選択すると新規`buildFaceMarkInterpretation()`が目・口それぞれの最寄り
  の伝統的部位を判定して解釈文を作る。
- `app/service-worker.js`のキャッシュ版数を`v5`→`v6`に更新(network-first
  方式自体は前回のまま)。
- `npm test`全71件に影響なし(今回の変更はすべてapp.js内のDOM依存
  ロジックのみ)。

**正直な注意点:**
- 線の始点・終点をつなぐ解釈文、および目・口構造の部位連結解釈は、
  いずれも今回新しく組み立てた本アプリ独自のロジックであり、文献に
  記載された具体的な組み合わせに基づくものではない。案内文・各解釈文の
  末尾にその旨を明記している。
- **まだ実機での見た目確認はできていない**(今回はコード変更のみ)。

**次回への申し送り(重要):**
1. デプロイ後、(a)マークをクリックしただけで解釈がその場に表示される
   か、(b)目・口構造が丸ではなく点3つで表示されるか、(c)線のつながり文
   が不自然でないか、を実機で確認すること。
2. 点3つ(`faceMarks`)の検出感度(`minEyeDistRatio: 0.015`〜
   `maxEyeDistRatio: 0.5`、`skin.marginRatio: 0.4`)は今回の暫定値であり、
   実写真での検証はまだ。多すぎる/少なすぎる場合は調整が必要。
3. 線のつながり文(`regionPhrase()`)は、部位の意味説明文から末尾の
   「に関わるとされる部位」等を正規表現で取り除く簡易実装。「命宮」の
   ように末尾がその形と一致しない部位では、そのまま長い文がつながって
   読みにくくなることがある(動作はするが文体が不揃い)。気になる部位が
   あれば`face-region-map.js`側の`meaning`文言を短い名詞句に揃える方が
   本質的な解決かもしれない。
4. ユーザーから講座動画・音声を追加で提供できるとの申し出があった。
   次回、実際の講座動画のスクリーンショット・音声内容をもとに、
   個々の部位・線のつながりの意味づけをより具体的に(かつ内容に齟齬が
   ないように)精査していくとよい。
5. 「手動で診断」タブ(`hf-*`、選択式入力のみで完結する別機能)は今回
   変更していない。もしこちらにも同様の「自己申告っぽさ」への懸念が
   あれば、次回ユーザーに確認する。

## 2026-08 他機能への同種の見直し(「続ける」指示への対応)

「隠れ相(自動検出マーク)」タブで行った見直しの考え方を、他の解釈
生成箇所にも同様に適用した(ユーザー指示:「さらに文言・解釈ロジックを
作り込む(他の部位・機能も同様に見直す)」)。

- `app/hidden-face-engine.js`(「手動で診断」タブ・「抽象相JSON解析」の
  解釈エンジン):
  - `countComplexity()`: 「検出数が多い=内面が複雑・強いストレス下」と
    いう、件数の多さをネガティブな評価に結びつける文言を撤廃。件数への
    評価は行わず、「1つ1つが独立して意味を持つ」という考え方に統一
    (隠れ相タブの案内文と方針を揃えた)。
  - `POSITION_MEANINGS`の各項目末尾で繰り返していた
    「(文献上の裏付けはありません)」を削除し、`renderHiddenManualForm()`
    の案内文(`notice`)に1回だけ集約する形に変更。
  - `buildGansouReport()` / `buildAbstractGansouReport()`の
    メッセージ文から、「という本アプリ独自の解釈枠組みです」等の
    冗長な言い回しを削り、断定的な文に短縮(末尾の総合免責文はテストが
    参照しているため維持)。
  - `palaceMeaning`未特定時の「参考程度に留めてください」を削除。
- `app/autonomous-face-reader.js`(「全体解析(自律)」モード):
  - `brightnessTheme`/`colorTheme`/`saturationTheme`/`lightBiasTheme`/
    `asymmetryTheme`/`tensionTheme`の各テキストから「という解釈です」
    「(文献上の裏付けはありません)」等を削除し、言い切り調に変更。
    免責は既存の`LIMITATION_NOTE`(メッセージ末尾に1回だけ付く)に
    一本化されているため、そちらは変更していない。
- いずれも`npm test`全42件(hidden-face-engine 20件・pattern-detector
  13件・face-region-map 9件)で確認し、影響なし
  (autonomous-face-readerのテストはテキスト内容ではなく`level`や
  数値条件のみを検証しているため、文言変更の影響を受けない)。
- `app/service-worker.js`のキャッシュ版数を`v6`→`v7`に更新。

**未着手・次回への申し送り:**
- 「手動で診断」タブ自体の入力フロー(位置・向き・種類をプルダウンで
  選ぶ形式)は、今回は文言のみ見直し、UIフロー自体は変更していない。
  これは「隠れ相」タブと違い、実際の画像解析を行わない、明示的に
  ルールベースの娯楽機能として設計されているため、フロー自体の是非は
  次回ユーザーに確認したい。
- ユーザーから提供予定の講座動画・音声はまだ未着手。

## 2026-08 講座1(全6回中)の自動字幕を読み込んでノート化

ユーザーがYouTube限定公開経由で講座1の自動字幕(srt)を提供。読み込んで
`docs/KOUZA1_NOTES.md`に整理した。個別受講者への実演鑑定(実名つき)は
個人情報のため除外し、一般化できる技法のみ抽出。

**最重要の発見:** 講座で説明されていた「画想」(顔に絵のような像が浮かぶ
現象)・「振動線」(ホクロを通る白い線)・「着眼点」(パッと目についた
所から見る、分析しない)という考え方が、本アプリの「隠れ相」自動検出の
設計思想そのものだった。ここまでの見直し(自動判定優先・断定的な言い切り)
の方向性が、講座の教え方と一致していることを確認できた。

流年法(年齢×部位)・父母宮/兄弟宮の左右とジェンダーの対応は言及が
あったが、音声認識の精度上、具体的な数値・左右を確定できていない
(`docs/KOUZA1_NOTES.md`に詳細と申し送りを記載)。コードの変更はまだ
行っていない(確度の低い情報を実装に混ぜたくないため)。

**次回:** 講座2〜6の字幕が届き次第、同様に整理。特に「具体的な部位の
読み方」が出てきたら`face-region-map.js`の`meaning`文言の精度向上に
反映する。流年法を実装するかどうかはユーザーの意向を確認してから判断。

## 2026-08 講座2(実演)を受けたコード修正

講座2は実際の受講者を鑑定する実演だったため、「現在の実装と食い違う点は
これを正として直す」方針でコードに反映した(ユーザー指示)。詳細は
`docs/KOUZA2_NOTES.md`参照。

**変更したコード:**
1. `app/face-region-map.js`: 「天中」の意味づけを「ご先祖からの加護」を
   含む形に修正(以前は「目上・官運・地位」のみ)。
2. `app/app.js`: 線マークが天中を経路に含む場合の専用解釈を追加
   (明るい色=先祖の加護が及んでいる、暗い色=自分の力ではどうにも
   ならない大事に関わる)。判定は既存の明暗ノート(`周囲より明るい`/
   `暗い`)を利用。
3. `app/app.js`: 線の位置判定を、始点・終点の2点だけでなく、線が通る
   全ての部位を経路(`suggestedRegionPath`)として拾うように変更。
   解釈文も経路上の全部位をつなげて表示するように変更。

`npm test`全42件に影響なし(pattern-detector側の検出ロジックは変更して
いないため)。`app/service-worker.js`のキャッシュ版数を更新。

**見送った内容(`docs/KOUZA2_NOTES.md`に詳細):** 裁判線の向きによる
当事者判定、警察という部位の追加、夫婦宮の性別による左右差、出張線、
人中まわりの色とアレルギー体質の関連(医学的診断に近いため意図的に
見送り)、父母の不仲が夫婦運に影響するという複数部位をまたぐ因果関係。

## 2026-08 訂正: 「天中」の定義変更を取り消し

上記の「天中」の`meaning`変更について、「額=目上、という定義はすでに
確立済みで、講座側はそれを前提に話を飛ばしているだけ。定義は安易に
書き換えるべきではない」という指摘を受け、`meaning`を元の文言に戻した。
線の解釈ロジック(技法)は取り消していない。今後の方針:
**鑑定の技法(検出結果の読み方)は都度直してよいが、部位の定義文は
複数資料での裏付けが取れるまで変更しない。**

## 2026-08 講座字幕をリポジトリに保存 + 講座3・4のノート追加

`docs/kouza-transcripts/`フォルダを新設し、講座1〜4のYouTube自動字幕
(srt)を保存(動画本体は大きすぎるため含めない)。`docs/KOUZA3_NOTES.md`・
`docs/KOUZA4_NOTES.md`を追加。コード変更はなし(講座4の実演で、直前の
セッションで実装した「目・口の点3つ表示」機能の妥当性が裏付けられた
のみ)。「顔色が白っぽい=死亡」といった生死に関する断定は、複数回
言及があったが意図的に実装していない。

**次回:** 5回目(5-1/5-2)・6回目はYouTube側の制限で字幕がまだ取得
できていない。取得でき次第、同様に整理する。

## 2026-08 講座5(5-1/5-2、実演あり)のノート

`docs/KOUZA5_NOTES.md`に整理。**今回はコード変更なし。** 新しく出てきた
内容(顔に内臓の配置を重ねる「小人形図」による健康診断、妊娠線、対話的に
問いかけて画想を呼び出す技法)は、いずれも(a)健康・生死に関わる断定
(方針により実装しない)、(b)対話を前提とし今のアプリの自動検出モデル
では表現できない、(c)座標が実物の図なしには特定できない、のいずれかに
該当したため。「画想」の実例は今回も多数出てきて、既存の点3つ表示機能の
妥当性を改めて裏付けた。

## ★前回(位置推定バグ修正・サービスワーカーのキャッシュ戦略修正・マーク解釈の再設計)セッションで行ったこと(更新版14)

**ユーザーからの指摘(核心):** 前回追加した「マークをクリックすると伝統的な
部位を自動提案する」機能が、実際には機能しておらず、耳のあたりに引かれた
線に対して「右目の下」(=旧・簡易6分類の先頭項目)という無関係な位置が
表示された。さらに、その解釈文には「検出された願相は9個と多く、内面が
複雑…」という、選択した1件のマークとは無関係な、画像全体のマーク総数に
関する文言が混入しており、「全体の鑑定とごちゃごちゃになっている」との
指摘を受けた。

**原因は3つ複合していた:**

1. **サービスワーカーのキャッシュ戦略の問題(最も根本的な原因)**:
   `app/service-worker.js`のfetchハンドラが
   「まずキャッシュを即座に返しつつ裏で更新する(stale-while-revalidate)」
   方式だったため、デプロイ直後の1回目のリロードでは**まだ古いファイルが
   表示され**、2回目のリロードでようやく反映される、という分かりにくい
   挙動になっていた。これにより、`face-region-map.js`が追加された
   `index.html`がまだキャッシュに反映されておらず、`window.FaceRegionMap`
   が存在しないままユーザーの手元で動いていた可能性が高い。
   → `fetch`ハンドラを「まずネットワークを試し、失敗時(オフライン時)
   のみキャッシュを使う」方式に変更(`ninso-cache-v5`)。これで基本的に
   デプロイ後1回のリロードで最新化される。
2. **たとえ`FaceRegionMap`が読み込まれていても、位置推定はcanvas全体を
   顔の外接矩形とみなしていた**: 実際の鑑定写真は顔の周りに大きく背景
   (壁・肩・ネクタイ等)が写っており、canvas全体を基準に正規化すると、
   実際には顔の端(耳のあたり)にあるマークが、大きくズレた位置として
   誤って扱われていた。
   → `app/hidden-face-detector.js`の肌色検出(`computeSkinRegion`)を
   自動検出時に呼び出し、推定した顔の外接矩形(`gansouMark.faceBox`)を
   基準に正規化するよう修正。肌色領域が信頼できない場合はその旨を
   提案文に明示する(画像全体を代用している旨)。
3. **設計不整合: 個別マークの解釈に、全マーク数の「数の意味」や
   「顔らしさスコア」という無関係な文言が混入**: 旧`buildGansouReport()`
   (固定テンプレート時代の解釈エンジン、`count`=全マーク数を渡すと
   「◯個検出されたので内面が複雑」といった文言を生成する設計)を
   そのまま流用していたため。
   → `app/app.js`内に、選択中の1マークの実データ(種別・スコア・note・
   自動提案された位置)だけを材料にする、新しい`buildMarkInterpretation()`
   /`renderMarkInterpretation()`を実装し、mark解釈フローはこちらに
   差し替え。旧`buildGansouReport()`/`renderGansouReport()`は「検出」
   タブ(顔らしさ検出フォーム、`hf-*`)と「手動で3点タップ」フローでは
   引き続き使用(そちらは本来の設計意図に合致するため変更していない)。
   また、検出位置・向き・種類のプルダウンが、ユーザーが何も選んでいない
   のに規定値(先頭の選択肢)を勝手に採用してしまう問題も修正
   (先頭に「(自動提案された位置を使用)」「(選択なし)」という中立的な
   空値オプションを追加し、実際に選んだものだけが解釈に反映されるように
   した)。

**このセッションでのファイル変更:**
- `app/service-worker.js`: fetch戦略変更、`ninso-cache-v4`→`v5`。
- `app/app.js`:
  - 自動検出時に`HiddenFaceDetector.computeSkinRegion()`で顔の外接矩形を
    推定し`gansouMark.faceBox`/`faceBoxEstimated`に保存。
  - `selectMark()`: 顔の外接矩形基準で正規化するよう修正。
    `FaceRegionMap`未読み込み時はその旨を明示(黙って旧デフォルト値の
    ままにしない)。
  - 検出位置/向き/種類のプルダウンに中立的な空値の初期選択肢を追加。
  - `buildMarkInterpretation()`/`renderMarkInterpretation()`/
    `frmGlobal()`を新規追加。`gs-analyze-btn`のハンドラをこちらに差し替え。
  - `gansouMark`の初期値に`faceBox`/`faceBoxEstimated`/`suggestedRegion`
    を追加。
- テストは今回コード変更なし(app.js内のDOM依存ロジックのみのため、
  既存の`npm test`(71件)で影響なしを確認)。

**次回への申し送り(重要):**
1. まずデプロイ後、**1回リロードするだけで新しい挙動になっているか**を
   確認すること(今回のservice-worker修正でここが直るはずだが、
   ブラウザ側に古いservice worker登録が残っている可能性もあるため、
   もし改善しなければ、ユーザーにDevToolsの Application → Service
   Workers → Unregister、またはハードリロード(Ctrl+Shift+R)を
   案内すること)。
2. 耳の線の実例のように、実際に位置推定が正しくなったかどうかは
   まだ実写真で未検証。次回、ユーザーに同じ写真で再度試してもらい、
   「右目の下」ではなく実際に近い伝統的部位(耳周辺なら「遷移」「山林」
   「神光」あたりが近いはず)が提案されるか確認すること。
3. `computeSkinRegion`は眼鏡・照明・肌の色調によって精度が変わる
   ヒューリスティックである。うまく顔範囲を推定できない画像では
   `faceBoxEstimated=false`となり画像全体が代用されるので、その場合は
   位置提案の精度も下がる旨をユーザーに伝えること。
4. ユーザーが「音声・動画を次回添付できる」と申し出ている。もし
   スクリーンショットだけでは判断しづらい挙動があれば、次回はそれらの
   活用も検討する。

## ★前回(実例写真をもとにした精度改善・伝統的部位マップ導入)セッションで行ったこと(更新版13)

**前回セッションの結末の確認:** 前回末に「Update-NinsoRepoの実行がPowerShell
エラーで止まった」状態で終わったが、今回の開始時、ユーザーから
デプロイ後の実機スクリーンショットが提示され、**デプロイは成功していた**
ことを確認した(画像に9件のマークが自動で円描画されている状態)。

**今回ユーザーから提示された重要な実例資料:**
1. 実際の鑑定で使った顔写真へのマーキング例(目尻のシミの丸囲み、額の
   小さな丸2〜3個、眉間の複数の短い横線、頬の崩し字のような線、目の下の
   楕円形の隈の輪郭など)→ 実際の相のマーキングは**かなり小さい**(数px〜
   数十px程度)ことが分かった。
2. 講座資料「顔面部位と事象①」の正式な顔面部位図(天中・命宮・田宅・
   男女・疾厄・法令・地閣など、伝統的な人相学の部位名称と配置)。

**これを受けて行った改善:**
1. `app/face-region-map.js`を新規追加。上記の部位図を正規化座標
   (0〜1)の矩形テーブルとしてコード化(47エントリ、左右対称部位含む)。
   `findNearestRegion(nx, ny)`で、マークの正規化座標から最も近い伝統的
   部位名+意味づけを返す。テスト9件追加。
2. `app/pattern-detector.js`:
   - 中程度に細長い塊(elongation 1.4〜2.2)は真円ではなく楕円
     (`{cx,cy,rx,ry}`)として出力するよう変更(目の下のクマ・涙袋のような
     横長のシミに対応)。`scaleMarking`もrx/ry対応に修正。
   - `minArea`の既定値を`n*0.0006`→`n*0.00015`に縮小(実例で見られる
     ような小さなマークを拾えるように)。
   - テスト2件追加(楕円出力の確認)。
3. `app/app.js`:
   - `sensitivityToOptions()`の閾値を全体的に感度寄りに調整
     (標準: thresholdK 1.35→1.2、minArea明示指定3〜5)。
   - 解析解像度を360px→480px、マルチスケールを[160,240,360]→
     [200,320,480]に引き上げ(小さなマークが解像度不足で消えないように)。
   - canvas描画・クリック判定を楕円(rx/ry)にも対応。
   - マーク選択時(`selectMark`)に`FaceRegionMap.findNearestRegion()`を
     呼び、canvas座標を正規化してマークに最も近い伝統的部位名を自動で
     位置プルダウンにプリセットするように変更(「検出位置」プルダウンに
     簡易分類(本アプリ独自)と伝統的な部位名(講座資料より)の2グループを
     用意)。
4. `app/index.html`・`app/service-worker.js`(キャッシュv3→v4)に
   `face-region-map.js`を追加。
5. `npm test`全71件成功確認済み(既存58件+pattern-detector13件+
   face-region-map9件、内訳は概算)。

**次回への申し送り(重要):**
1. まずデプロイが完了しているか確認すること(今回もPowerShellの操作
   ミスで止まる可能性があるため)。
2. `face-region-map.js`の矩形範囲は、ユーザー提示の図を**目視でおおまか
   に**座標化したものであり、正確な測定に基づくものではない。実際に
   使ってみて「命宮のはずなのに違う部位が提案される」等のズレが
   あれば、該当部位の矩形を調整するとよい。
3. まだ検証できていない点: 実際の顔写真(添付のような、目尻・額・頬の
   実例)を`pattern-detector.js`に通した際に、講座の先生が丸で囲んだ
   のとだいたい同じ大きさ・位置で自動検出できるかは未検証(このセッション
   では感度パラメータを理論的に調整したのみで、実際の写真データでの
   検証は次回ユーザーに実施してもらう必要がある)。感度「広め」でも
   小さすぎるようなら、`minArea`をさらに下げる、`thresholdK`をさらに
   下げる、といった追加調整が必要になる可能性がある。
4. 眉間の複数の短い横線(画像14参照)のように、非常に近接した複数の
   細い線が並ぶパターンは、感度を上げすぎると连结成分同士がくっついて
   1つの塊に誤判定される可能性がある。実写真での検証時に、この現象が
   起きていないか確認すること。
5. `selectMark()`での伝統的部位の自動提案は、**canvas全体を顔の外接
   矩形とみなす**という単純な前提に基づいている。ユーザーが顔全体では
   なく一部だけを拡大した写真(例: 額だけのクローズアップ)をアップロード
   した場合、この前提が崩れて誤った部位が提案される。将来的には、
   肌色領域検出(`hidden-face-detector.js`の`computeSkinRegion`)などを
   使って実際の顔の外接矩形を推定し、それを基準に正規化する改善が
   考えられる。
6. 楕円出力(`rx`/`ry`)は現状、常に画像の縦横軸に平行(回転なし)。
   斜めに傾いた楕円状のシミには対応していない。必要になったら
   主成分分析(PCA)で傾きを求める拡張を検討する。

## ★前回(固定テンプレート廃止・線/色/陰影ベースの自動マーキングへ全面刷新)セッションで行ったこと(更新版12)

**★★★最優先で確認すること★★★**
このセッションの終わりに「まだ全然認識していない」というスクリーンショットが
提示されたが、それは**このセッションでの変更(`app/pattern-detector.js`他)が
まだ実機にデプロイされていない状態**のスクリーンショットである(ユーザーが
`Update-NinsoRepo -CommitMessage "..."` を実行しようとした際、メッセージ文
だけを単独でPowerShellに打ち込んでしまいエラーになり、git push未実行のまま
セッション終了・レート制限に到達した)。次回セッションの最初に、
**ユーザーがその後デプロイを完了できたか、実機の見た目がどう変わったか
（プルダウンではなく円・線が自動で表示されるようになったか）を最初に確認する
こと**。もしまだなら、`Update-NinsoRepo -CommitMessage "..."` をコマンド
全体として1行で実行する必要がある旨を再度案内する。

**このセッションでの変更内容:**
講座動画(人相講座 上級4)のスクリーンショット複数枚をもとに、ユーザーから
「目・鼻・口という固定カテゴリに縛られず、線のつながり・周囲との色や浮き
具合の違いをすべて認識して丸で囲みだすプログラムに変えてほしい」という
強い指摘。加えて、既存の「自動検出する」は候補が1件しか出ず、検出位置・
種類を毎回プルダウンで選んでから解析する必要があり「自動化になっていない」
との指摘も受けた。

これを受けて、旧`app/hidden-face-detector.js`の`findFaceCandidates()`
(暗い点のペア+その下の暗い線、という目・口の固定幾何テンプレート)は
そのまま残しつつ(後方互換・既存テストは無変更)、**新規モジュール
`app/pattern-detector.js`を追加して自動マーキングの主エンジンを全面刷新**。

- アルゴリズム: 局所平均(ボックスブラー)との明度差・RGB色差・Sobel勾配
  強度をそれぞれ局所的なばらつきで正規化し合成した「周囲との違いの大きさ
  (サリエンス)」マップを作成 → 有意な画素を連結成分ラベリング →
  充填率・アスペクト比から「塊(点・シミ状、外接円で表示)」か
  「線(しわ・筋状、主軸に沿った折れ線で表示)」かを判定 →
  複数解像度で統合・重複排除。固定の位置・種類ラベルへの当てはめは行わない。
  各候補は`kind`(blob/line)・`score`(0〜100)・`note`(自由記述の根拠、
  例:「周囲より暗い・陰影の境目が明瞭(浮き上がり・へこみの可能性)」)を持つ。
- `app/app.js`のmarkモードUIを全面刷新: 「自動検出する」を押すと検出した
  全マークを画像に直接、青い円・線で自動描画(候補を1件ずつ選んで「採用する」
  操作は廃止)。感度(広め/標準/狭め)選択可。マークをクリックすると、
  その1件だけに位置・向き・種類を任意で割り当てて解釈文を作れる(必須では
  ない、記録用の補助情報という位置づけ)。従来の3点タップ方式は
  `<details>`内に「手動で3点をタップして指定する(従来方式)」として独立
  して残した。
- `app/index.html`・`app/service-worker.js`(キャッシュv2→v3)に
  `pattern-detector.js`を追加。
- `tests/pattern-detector.test.js`新規11件、`package.json`の`test`スクリプト
  にも追加。`npm test`全件成功確認済み(既存69件+新規11件)。

**次回への申し送り(重要):**
1. 上記の通り、まずデプロイが完了しているか確認すること。
2. デプロイ確認後、ユーザーが実際の画像(顔写真・ネクタイ等)で
   「自動検出する」を試し、検出数・精度を評価してもらうこと。
3. このセッション終了間際に、ユーザーから講座動画(人相講座 上級5)の
   スクリーンショットが追加提示された。前回(上級4)より細かい・多様な
   マーキング例が含まれており、今の`pattern-detector.js`がこれらの
   パターンを拾えるかは未検証(実写真ではなくイラスト・線画に近い画像で
   検証していない)。具体的には:
   - 生え際近くの小さな鉤型・輪っか(細い線が丸まって閉じている形)
   - 額に細い縦線が複数本、間隔を空けて並ぶパターン(現状は1本1本を
     別々の「線」として検出するはずだが、間隔が狭いと連結成分が
     くっついて1つの塊に誤判定される可能性がある。要検証)
   - 眉の上の小さな輪っか(閉じたループ)→現状の分類ロジック
     (`elongation >= 2.2 && fillRatio <= 0.55`で線判定)だと、
     閉じたループは充填率が低くない(輪の外周だけなら低いが、太い線で
     描かれていると塊寄りになる)ため、「線」と「塊」のどちらに
     判定されるか要確認。誤判定するようなら分類ロジックの調整が必要。
   - 鼻筋の雫(しずく)型の塊 → 塊(blob)として円で表示されるはずだが、
     雫型は円よりだいぶ細長いので、外接円だと講座の先生の描く雫型の
     マーキングとは見た目がかなり違う可能性がある。塊の表示形状を
     円だけでなく楕円や輪郭に近い形にする改良も検討の余地あり。
   - 頬から顎への緩やかな曲線(直線的でなく大きくカーブする線)→
     現状の折れ線生成(主軸方向にバケツ分けして中心点をつなぐ)は
     直線に近い線を想定しており、大きくカーブする線をどこまで
     滑らかに追従できるか未検証。
4. これらの例はすべて**人物イラスト(線画)の上に手描きで加えたマーキング**
   であり、実写真とは画像の統計的性質(エッジの鋭さ・色の均一性)がかなり
   異なる。次回、講座動画のスクショそのもの(イラスト部分だけを切り出した
   もの)を`pattern-detector.js`に通してみて、実際にどんなマークが検出
   されるか確認し、必要ならパラメータ(`thresholdK`・`contrastRadius`・
   線/塊の分類しきい値)を調整するとよい。

## ★前回(実写真での検証・探索範囲の「狭さ」対応)セッションで行ったこと(更新版11)

ユーザーが実際の顔写真をアプリにアップロードして検証。手動で額の生え際
付近に画像幅の数%程度しか離れていない小さな3点をマーキングした例を
示した上で、「自動検出するがいまだに広い範囲で目と口を探している。
髪の毛・顔の輪郭まで範囲を広げ、かつもっと狭い範囲で探すこと」との
指摘があった。

`app/hidden-face-detector.js`の`findFaceCandidates()`に
`minEyeDistRatio`/`maxEyeDistRatio`オプション、`computeSkinRegion()`に
`marginRatio`オプションを追加(下位互換のため既定値は変更せず0.03/0.6・
0.15のまま)。`app/app.js`の「自動検出する」ボタンの呼び出しで
`minEyeDistRatio: 0.01, maxEyeDistRatio: 0.12`(画像幅の1〜12%程度の
小さいパターンのみを狙う。実物大の目の間隔(15%以上)は原理的に対象外に
なる)・`skin: { marginRatio: 0.4 }`(肌色領域外接矩形の余白を15%→40%に
拡大し、髪の生え際・顔の輪郭周辺まで探索範囲を拡大)を指定するよう変更。
案内文も更新。テスト4件追加、`npm test`全69件成功済み。

**次回への申し送り(重要):**
1. `minEyeDistRatio: 0.01〜0.12`・`skin.marginRatio: 0.4`という具体的な
   数値は、ユーザーが実際にタップした一例から逆算した暫定値であり、
   最適という保証はない。次回、実写真でさらに検証してもらい、狭すぎる/
   広すぎるようであれば数値を再調整するとよい。
2. これで実物大の目・口が候補に出にくくなったはずだが、
   `splitObviousRealFace()`(前回セッションで追加)による「本物の顔
   らしい候補」の分離ロジックとの役割分担が二重になっている面がある。
   実写真での検証結果を見て、`splitObviousRealFace()`側の重み付けも
   合わせて調整が必要か確認するとよい。
3. `skin.marginRatio: 0.4`だと、画像サイズによっては(肌色領域の
   外接矩形が大きい場合)ほぼ画像全体が探索範囲になり得る。背景に
   ノイズが多い写真では誤検出が増える可能性があるため、実写真での
   誤検出率もあわせて確認するとよい。

## ★前回(講座動画を参考にした「あたりまえの指摘」問題への対応)セッションで行ったこと(更新版10)

ユーザーから人相講座(上級)の動画スクリーンショット10枚が提示された
(イラストの顔で、目・口以外の額・生え際・頬等の領域にも複数の「隠れた
顔・輪郭」を見出す練習をしている場面)。「前回までは本当の目と口を指して
『ここに目があります』となっていた。それは人間からすると当たり前の
指摘にしかなっていない」との重要な指摘があり、対応した。

`app/hidden-face-detector.js`に`splitObviousRealFace(candidates, imageData)`
を追加(検出スコア50%+画像中央への近さ30%+候補群中の目間隔の大きさ20%の
加重平均で「本物の顔の目・口らしい」候補を1件推定して分離)。
`app/app.js`の「自動検出する」ボタンの結果表示を変更し、隠れ相候補には
`obvious`(本物の顔らしいもの)を含めず、「本物の顔らしい候補」として
折りたたみ別枠表示(誤判定時の救済で採用は可能)にした。案内文にも
「顔の中心以外の領域(木目・生え際・輪郭の一部等)も手動タップで探って
みてください」と追記。テスト4件追加、`npm test`全23+12+20件成功済み。

また、「顔とは限らない。ベッドが見えてくると不倫を隠しているといった
把握もできる」という指摘には、**現状のヒューリスティック検出器は顔の
構造(目+口)を前提にしており、寝具等の汎用物体認識はできない**ことを
正直に整理し、当面は「抽象相JSON解析」タブの自由記述(`abstract_components`)
で人間が記録する運用を推奨する、という結論にした(汎用物体認識の自動化は
ML化ロードマップの将来課題)。詳細は`docs/GANSOU_ROADMAP.md`の「『あたり
まえの指摘』問題への対応」節を参照。

**次回への申し送り:**
1. `splitObviousRealFace()`のヒューリスティックはまだ実写真で検証して
   いない(合成データのユニットテストのみ)。実写真で「本物の顔」を
   正しくobvious側に分離できているか、逆に本当に隠れている相を誤って
   obvious側に入れてしまっていないかを確認するとよい。
2. 講座動画にあった「顔の中でも額・生え際・頬など複数箇所に隠れ相を
   見出す」という練習スタイルを、UI側のチュートリアル・お手本表示
   としても取り入れるかは未着手(今回はアルゴリズム・案内文の修正の
   み)。ユーザーの意向があれば次回検討する。
3. 物体認識(ベッド等)の汎用化はMLロードマップ側の将来課題のまま。

## ★前回(願相機能の意味づけ「出典」監査)セッションで行ったこと(更新版9・最重要)

ユーザーから「願相(隠れ相)機能の意味づけ(位置・向き・種類・十二宮・
明るさ/色味の解釈文)は、これまで`data/`に入力してきた文献データに
基づいているか？ 違うならば勝手に意味を作らないでほしい」という重要な
指摘があった。`app/hidden-face-engine.js` と `app/autonomous-face-reader.js`
を監査した結果、**意味づけは`data/`の出典付き文献データに基づいておらず、
過去セッションでこのアプリが独自に設計した解釈フレームワークだった**
ことを確認した(コード上`PARTS`配列への参照が一切ない。「涙堂」等の
用語を借用していても中身が文献記述と食い違う実例あり)。対応として、
両ファイルの出力メッセージ・コード内コメントから「伝統的な言い伝え」
「色彩心理の伝統的な見立て」等の文献裏付けを装う表現を除去し、
「本アプリ独自の解釈枠組みであり、文献データに基づくものではない」と
正直に明記する形に修正した(機能・スコア計算・検出ロジック自体は
変更していない。表示上の出典表記のみの修正)。位置(部位)ラベルの
リストは、文献裏付けなしに無理に拡張することはせず、既存の少数リスト
+「未登録の位置は意味づけなしで正直にフォールバックする」挙動を維持
した(検出層自体はもともと部位名に依存せず画像全体を探索する設計)。
詳細・具体的な食い違いの実例は`docs/GANSOU_ROADMAP.md`の「意味づけの
出典についての正直な監査結果」節、作業ログは`docs/progress.md`の
最新エントリを参照。テスト1件の文言を更新、`npm test`全件成功確認済み
(検出層19件・全体解析12件・願相エンジン20件、合計51件)。

**次回への申し送り(重要):**
1. 今回の監査・修正は「意味づけの出典表記を正確にする」ことが目的で、
   意味づけの中身(位置ごとのテーマ、十二宮の説明等)自体は精査・
   再設計していない。ユーザーが望むなら、今後は
   (a) 独自解釈のまま「娯楽機能」として位置づけを明確にして維持する、
   (b) 文献裏付けのある意味づけだけに絞り込む(裏付けが無い項目は
   削除するか、`data/`の該当項目データを直接参照する形に作り直す)、
   のどちらの方向に進めるか、次回セッション冒頭で確認するとよい。
2. 同様の「文献裏付けの有無」チェックを、他の解釈系コード
   (`app.js`内の願相タブ以外の箇所など)にも横展開すべきかは未確認。
   次回、必要に応じて確認するとよい。

## ★前回(検出層の可能性拡張)セッションで行ったこと(更新版8)

ユーザーから「顔の写真など(顔写真に限らず)で隠れた顔を認識する技術の
可能性を高めてほしい」という要望があり、`app/hidden-face-detector.js`に
(1)局所標準偏差による真の局所適応閾値(Niblack/Sauvola系)、
(2)肌色マスキングのON/OFF切り替え(UIにチェックボックス追加、実写真向け
ON・木目岩肌等の一般パレイドリア探索向けOFF)、
(3)`findFaceCandidatesMultiScale()`によるマルチスケール探索(複数解像度を
統合)、を追加した。テスト9件追加(合計19件、`npm test`で確認可能)。
詳細は`docs/GANSOU_ROADMAP.md`の「検出層 可能性拡張版」節と
`docs/progress.md`の最新エントリを参照。**実写真での検証はまだ**。
また、前回セッションで追加した`npm run serve`が実際にユーザー環境で
機能したか(file://問題が解消したか)もまだ未確認。次回はこの2点を
優先して確認するとよい。

## ★前回(ローカルで開けない問題への対応)セッションで行ったこと(更新版7)

ユーザーから「indexが何も映らない、ローカルで開けない」という報告が
あった。`app/index.html`を**ダブルクリックしてfile://で直接開くと**、
SVGマップ読み込み(fetch)・Service Worker登録・localStorage利用等が
ブラウザのセキュリティ制限で失敗しうることが分かった(app.js自体の
バグではなく、file://で開くこと自体が原因である可能性が高い)。対応として
追加パッケージ不要のローカルサーバー`tools/serve.js`(`npm run serve`)を
新規作成し、`README.md`に使い方を追記した。**ユーザーが実際にどう開いて
いたかはまだ未確認**。次回は、`npm run serve`で`http://localhost:8080/
app/index.html`を開いても症状が改善しない場合、ブラウザの開発者ツール
(F12→Console)のエラー内容を確認しながら切り分けること。

## ★前回(全体解析「自律・選択操作なし」モード追加)セッションで行ったこと(更新版6)

ユーザーから「目・口・眉等のプルダウン選択方式は採用せず、写真を
アップロードするだけでAIが自律的に隠れ相(潜在的な表情・象徴・心理的
ニュアンス)を抽出してほしい」という要望が提示され、新規ファイル
`app/autonomous-face-reader.js`と、隠れ相タブの5つ目のモード
「全体解析(自律・選択操作なし)」を追加した。画像全体の明るさ・色味・
彩度・左右対称性・光の当たり方・明暗の起伏を自動計算し、伝統的な相学・
色彩心理のような発想で言語化する。**ただし「表情筋の微細な動き」
「視線の方向と強度」「パーツ単位の精密な非対称性」は専用MLモデルが
必要なため未実装**であり、その旨をレポートメッセージに必ず明記している
(正直な限界の説明)。`tests/autonomous-face-reader.test.js`(12件)追加、
`npm test`で既存の検出層テストと合わせて実行可能。詳細は
`docs/GANSOU_ROADMAP.md`の「全体解析(自律・選択操作なし)モード」節と
`docs/progress.md`の最新エントリを参照。**実写真での検証はまだ**。
次回はこのモードの実写真検証、および前回持ち越しの検出層(点+線
パターン探索)の実写真検証もあわせて行うとよい。

## ★前回(願相・検出層の精度向上)セッションで行ったこと(更新版5)

データ拡充フェーズとは別に、ユーザーから「隠れ顔(パレイドリア)検出AIの
作り方」資料が提示され、`docs/GANSOU_ROADMAP.md`に以前から「未実装・
提案」として記載していた検出精度向上策4項目(局所適応閾値・肌色
マスキング・平滑化・形状フィルタ)を`app/hidden-face-detector.js`に
実装した。合成ピクセルデータでのユニットテスト
(`tests/hidden-face-detector.test.js`、`npm test`で実行可能)は追加・
成功しているが、**実機・実写真での精度確認はまだ行っていない**。
詳細・既知の限界(肌色マスキングの精度が肌の色みによって偏りうる等)は
`docs/GANSOU_ROADMAP.md`の該当セクションと`docs/progress.md`の最新エントリ
を参照。次回は下記「次回優先」の1番(実機での実写真検証)を最優先で
進めるとよい。本格的なYOLO等によるML化(アノテーション・学習)は
ユーザーも認識の通りまだ着手していない(データが十分に溜まってから)。

## ★フェーズ移行のお知らせ(重要・更新版4)

PDFからの相法データ入力フェーズは第十二輯(合計262項目)で区切りとなり、
UIフェーズに入った。`app/app.js`(辞典/カルテ/隠れ相の3タブ)・
`app/style.css`・`app/manifest.json`・`app/service-worker.js`を実装済み。
隠れ相タブは4モード構成になっている:
- **手動で診断**: 位置/向き/種類/スコア/数を選択式で入力
- **画像マーキング(実験的)**: 画像アップロード→「自動検出する」で
  `hidden-face-detector.js`(ラベル付き学習データ不要のヒューリスティック
  画像処理)が点+線の候補を提案→「採用する」でマーキングに反映、または
  手動で3点タップ
- **抽象相JSON解析**(新規): 画像解析AI+人間選別(Human-in-the-Loop)で
  確定された検出データJSON(`detection_id`/`detected_feature`
  [location/abstract_components/facing_direction/clarity_score]/
  `area_attribute`[palace_name/domain_category])を貼り付けて実行。
  `buildAbstractGansouReport()`が伝統的な**十二宮**の考え方で解釈する。
  外部の検出システムの出力をそのまま流し込むことも想定した機能。
- **顔らしさ検出(意味づけなし)**: 構造情報の整理専用フォーム

いずれもNode/jsdomでのユニットテスト・統合テストで動作確認済み
(`hidden-face-detector.js`は合成ピクセルデータで、
`buildAbstractGansouReport()`はユーザー提示のサンプルJSONで実際に
出力を確認済み)。詳細設計・精度向上の具体策・3段階ワークフローとの
対応関係・将来のML化ロードマップ・辞書データとの関係整理は
`docs/GANSOU_ROADMAP.md` を参照。

次回は以下を優先:
1. 【更新】検出層(点+線パターン探索、局所適応閾値・肌色マスキング・
   平滑化・形状フィルタ)と、新規追加の「全体解析(自律・選択操作なし)」
   モード(`app/autonomous-face-reader.js`)は両方とも実装済み(合成
   データでのユニットテストは`npm test`で確認可能)。**次は実機(実際の
   ブラウザ・スマホ)での実写真を使った、両モードの精度・解釈の妥当性
   確認が優先**。特に検出層は肌色マスキングが様々な肌の色み・光源条件で
   偏りなく機能しているか、局所適応閾値の既定パラメータ(半径・
   thresholdK)が実写真で適切かを確認する。全体解析モードは、実写真で
   明るさ・色味・彩度・左右対称性・起伏の判定境界値が「それらしい」
   解釈につながっているかを確認し、必要ならチューニングする
2. 検出層(3点マーキング形式)と抽象相JSON Schema形式の統一、または
   変換アダプタの検討
3. `abstract_components`の日本語ラベル辞書(`COMPONENT_LABELS`)を、
   実際に使われる値の種類が増えたら随時拡充する
4. `app/assets/face-zones.svg` の座標を `人相記入用.docx` のイラストに
   寄せて調整
5. 正式なアプリアイコンへの差し替え
6. 願相の学習データ(`ninso.gansou_samples.v1`)がある程度溜まってきたら、
   ML化の検討に進む
7. カルテ機能と願相記録の統合(データモデル上は拡張可能、UIは未実装)
8. 頬・顎データ、`core.js`等5ファイルの空データ(データ拡充を再開する場合)

データ拡充(新しいPDFの取り込み)は、ユーザーから明示的な指示があった
場合のみ再開する。

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
