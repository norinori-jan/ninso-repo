# UI提案: 手相カテゴリの追加とインタラクティブな掌マップ

## 前提

`app/app.js` / `app/index.html` / `app/style.css` の現物を見ていないため、
以下は「こういう構造なら合う」という提案です。実ファイルを共有してもらえれば
具体的な差分(str_replace)に落とし込みます。

## 1. 情報構造(データ側は準備済み)

- カテゴリタブに **「手相」** を追加(既存: 顔・体質論・輪郭・身体・骨相学)
- 手相内は `role` でサブグループ化:
  総論 / 触感 / 指全体 / 親指 / 人差し指 / 中指 / 薬指 / 小指 / 部位対応 / 色 / 骨格

既存カテゴリと同じ「リスト選択→該当optionsをカード表示」という導線であれば、
`data/palmistry.js` を読み込むだけでそのまま動くはずです(スキーマ互換)。

## 2. 追加提案: 掌の八卦マップ(タップ式)

手相は「体の部位をタップして診断する」という直感的なUIと相性が良いカテゴリです。
`app/assets/palm-zones.svg` を土台に、以下のような体験を提案します。

1. 「手相」カテゴリを開くと、まず**手のひらのSVGイラスト**が表示される
2. 指・親指・八卦の9領域(明堂+8宮)がそれぞれタップ可能なゾーンになっている
   (SVG側は `data-key` / `data-option` を各要素に付与済み)
3. ゾーンをタップすると、下(またはモーダル)に該当する
   `data/palmistry.js` のエントリ(name + options)が展開表示される
4. 指のゾーン(親指〜小指)は `data-key` のみで `options` が複数あるので、
   タップ後にさらに選択肢(長い/短い 等)を選ばせる二段階UIにする

### 実装イメージ(疑似コード、既存app.jsのイベントハンドラ登録方式に合わせて調整)

```js
document.querySelectorAll('#palm-map [data-key]').forEach(zone => {
  zone.addEventListener('click', () => {
    const key = zone.dataset.key;
    const optionId = zone.dataset.option; // 八卦ゾーンは固定オプション
    const part = PARTS.find(p => p.key === key);
    if (!part) return;

    if (optionId) {
      showResultCard(part, part.options.find(o => o.id === optionId));
    } else {
      showOptionPicker(part); // 指のように複数選択肢がある場合
    }
  });
});
```

### CSSカスタムプロパティ

SVG側は色をCSS変数に逃がしてあります(`--palm-fill` `--palm-stroke` `--palm-label`)。
既存の `style.css` のテーマ変数(ダークモード対応があれば特に)に合わせて
上書きするだけで配色を統一できます。

```css
:root {
  --palm-fill: #f3e6d8;
  --palm-stroke: #7a5c3e;
  --palm-label: #4a3826;
}
.zone { fill: transparent; cursor: pointer; }
.zone:hover, .zone:focus { fill: rgba(122,92,62,0.15); }
.finger { fill: var(--palm-fill); stroke: var(--palm-stroke); stroke-width: 2; cursor: pointer; }
```

## 3. アクセシビリティ / PWAとしての配慮

- 各ゾーンに `role="button"` `tabindex="0"` と `aria-label`(例: 「離宮: 身分・地位の変化」)
  を付与し、キーボード・スクリーンリーダーでも操作可能にする
- タップ領域が小さくなりがちなので、実際のヒットエリアはSVGの見た目より
  ひとまわり大きい透明な `<rect>`/`<circle>` を重ねるか、CSSの `touch-action` と
  最小44px相当のタップ領域を確保する
- オフライン動作が前提のPWAなので、SVGは `app/assets/` に静的配置し、
  fetchではなく `<img>` かインラインSVGで直接埋め込む(service-worker.jsの
  キャッシュ対象にも忘れず追加)

## 4. 既存カテゴリとの整合性

骨相学カテゴリも本来「頭部のどこを見ているか」という部位性が強いので、
同じタップ式マップのパターンを頭部シルエットにも展開できる可能性があります
(将来の拡張候補として `docs/progress.md` に記録済み)。今回はまず手相で
このパターンを検証し、良ければ骨相学・顔の各部位にも横展開する、という
順序を提案します。

## 5. 次のアクション

- 実際の `app/index.html` `app/app.js` `app/style.css` を共有してもらえれば、
  上記提案を実ファイルへの具体的な差分として起こします
- `app/assets/palm-zones.svg` の扇形ジオメトリは概略なので、デザインを
  詰める場合は元画像(第四輯 p.164の掌面八卦配位図)を参照しながら
  座標を微調整することを推奨します
