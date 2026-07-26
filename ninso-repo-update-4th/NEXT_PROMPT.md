# 継続プロンプト(次回セッションの冒頭に貼り付け用)

ninso-offlineリポジトリ(人相占いPWA)の拡張データ作業の続きです。

## 現在の構成

```
ninso-repo/
├── app/     (PWA本体: index.html app.js style.css manifest.json service-worker.js icons/)
│    └── assets/palm-zones.svg  ← 追加済み(掌面八卦の簡易参照SVG、UI実装は保留中)
├── data/    (診断データ、部位ごとに分割)
│    ├── core.js (顔:額眉目鼻口耳顎気色)
│    ├── constitution.js (体質三型)
│    ├── five_elements.js (五行五形)
│    ├── face_shape.js (十字面法の一部)
│    ├── body.js (首肩胸)
│    ├── phrenology.js (骨相学42部位論の抜粋。第四輯分3項目を追記済み:
│    │    眉弓の発達/額の三分割/頭形長頭円頭)
│    ├── palmistry.js (手相学。第四輯より新規20項目、category="手相")
│    └── index.js (↑を1本のPARTS配列に集約、UMD形式でブラウザ/Node両対応)
├── tools/generate-index.js (data/一覧をMarkdown自動生成、npm run index)
├── source/notes.md (出典・採用/除外方針の記録)
├── docs/
│    ├── progress.md (作業ログ)
│    └── UI_PROPOSAL.md (手相の掌マップUI案。実装はまだ)
├── package.json (npm run index)
└── README.md
```

## 直近の状態

- 第四輯(骨相学概説四・手相学概説一〜三)の取り込み完了。
  `data/palmistry.js` 新規追加、`data/phrenology.js` に3項目追記。
- 統合作業(`data/index.js` の require 追加、`tools/generate-index.js` の
  `DATA_FILES` 配列追記、`app/index.html` のscriptタグ追加)は、
  実ファイルを見ずに提案ベースで進めたため、**ローカルでの実マージ結果を
  次回確認・修正すること**。
- UIは今回は保留。掌の八卦マップ(タップ式)の設計案のみ
  `docs/UI_PROPOSAL.md` に用意済み。実装は次のUI着手フェーズで。

## 除外方針(継続、恒久)

- 性的な写真品評企画、身体特徴と生殖器官・体毛を結びつける俗信は、
  詳細を記載せず「発想の存在」のみ `source/notes.md` に記録する。
- 民族・人種を骨相(頭蓋骨形状など)と結びつけて性格や優劣を比較する記述
  (差別的ステレオタイプを含むもの)も同様に、詳細を記載せず
  「発想の存在」のみ記録する。形態上の一般概念(長頭・円頭など)だけを、
  特定の集団に結びつけない形で抽出して採用するのは可。
- 掌の血色等から具体的な病名を示唆する記述は、医療的誤解を避けるため
  運気表現(良い/悪い)にとどめ、疾患名には踏み込まない。

## 未着手で残っている非性的な章

- 十字面法の残り型(王字面・目字面・用字面など) → `data/face_shape.js` に追記
- 身体総論の続き(臍・腰・臀・足・後ろ姿など) → `data/body.js` に追記
- 咽喉・首の高さ、顔面角度(カンペール角) → 新規 `data/head_neck.js` 相当を検討
- 骨相学42部位論の残り(知的部位群: 秩序性・計数性・事実性・位置性・
  時間性・音調性・言語性・推因性・比較性・諧謔性・直覚性・調和性など)
  → `data/phrenology.js` に追記
- 手相の「指の動きによる兆占い」(喜怒哀楽等) → 静的optionsスキーマとは
  構造が異なるため、別データ構造(`data/omens.js`案)を検討するかどうか判断
- 手相の掌線(生命線・感情線・知能線)の本格的な解説 → 今回は情報不足で
  見送り。別資料で扱う

## 将来機能のメモ(今すぐは着手しない)

- 写真(またはFaceTime等での対面リアルタイム撮影)から瞬時に人相/手相を
  鑑定する機能を検討中。UI・データ構造ともに影響が大きい可能性があるため、
  データ拡充がある程度進んでから改めて設計する。

## 今回やってほしいこと

1. 新しいPDF資料(第五輯以降など)を読み込んで、同じスキーマ
   (key/name/category/role/options[{id,label,tone,text}])でデータ化
2. 上記の未着手章があれば優先的にカバー
3. 採用/除外の判断は `source/notes.md` に追記する形で記録
4. `docs/progress.md` に作業ログを追記
5. UIには着手しない(データ拡充を優先)

新しいPDFを添付します。
