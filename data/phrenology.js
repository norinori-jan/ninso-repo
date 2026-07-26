/**
 * data/phrenology.js
 *
 * ★このファイルの経緯(重要)★
 * 最初にアップロードされた実ファイルは、他の全データファイルで統一している
 * スキーマ(key/name/category/role/options[{id,label,tone,text}])とは異なる
 * `id/category/title/description` というスキーマで、しかも
 * 「骨相学42部位論の抜粋16項目」の実データは
 *   // 既存の phrenology データ項目群...
 * というコメントのみで実際には入っておらず、追記された3項目
 * (phrenology_add_01/02/03)も、こちらで実際に作成した
 * brow_ridge_intuition 等とは名前・内容が一致しない汎用的な
 * プレースホルダーテキストでした。
 *
 * そのため、この2つの版を「単純に配列として連結」はしていません
 * (スキーマが混在すると options を前提にした表示側が壊れるため)。
 * 代わりに:
 *   1. 実際に使うデータは、統一スキーマに揃えた版を採用
 *   2. 元のプレースホルダー版は、何も失わないよう文末にコメントとして
 *      原文のまま保存(配列には含めない)
 * という形で「合わせて」あります。
 *
 * 本来の16項目の実データが見つかったら ORIGINAL_16_ITEMS_PLACEHOLDER に
 * 同じスキーマで追加してください。
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.PHRENOLOGY_PARTS = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  // ↓↓↓ ここに本来の骨相学42部位論の抜粋16項目(既存データ)を
  //     key/name/category/role/options のスキーマで追加してください。
  //     現状は本物のデータを保有していないため空です。
  var ORIGINAL_16_ITEMS_PLACEHOLDER = [];

  // 第四輯(骨相学概説四)からの追記3項目(統一スキーマ版・実際に使用するデータ)
  var ADDED_FROM_4TH_VOLUME = [
    {
      key: 'brow_ridge_intuition',
      name: '眉弓(眉丘)の発達',
      category: '骨相学',
      role: '額',
      options: [
        {
          id: 'developed',
          label: '眉弓がよく発達している',
          tone: 'neutral',
          text: '眉の上の骨(眉弓・眉丘)がよく発達している人は直観力・観察力に優れるとされる。とっさの判断が必要な場面に強く、猟師や軍人のような瞬時の判断力を要する仕事に向くとされる。'
        },
        {
          id: 'flat',
          label: '眉弓があまり目立たない',
          tone: 'neutral',
          text: '眉弓の発達が目立たない人は、直感よりも理詰めでじっくり考えて判断するタイプとされる。'
        }
      ]
    },
    {
      key: 'forehead_thirds',
      name: '額の三分割(推理・記憶・直観)',
      category: '骨相学',
      role: '額',
      options: [
        {
          id: 'upper_developed',
          label: '額の上部が発達(推理)',
          tone: 'neutral',
          text: '額を上・中・下の三等分に見たとき、上部がよく発達している人は推理的な知力に優れるとされる。'
        },
        {
          id: 'middle_developed',
          label: '額の中央部が発達(記憶)',
          tone: 'neutral',
          text: '額の中央部がよく発達している人は記憶力に優れるとされる。'
        },
        {
          id: 'lower_developed',
          label: '額の下部・眉弓が発達(直観)',
          tone: 'neutral',
          text: '額の下部、特に眉弓のあたりがよく発達している人は直観力に優れるとされる。'
        }
      ]
    },
    {
      key: 'head_shape_long_round',
      name: '頭形(長頭・円頭)',
      category: '骨相学',
      role: '頭部全体',
      options: [
        {
          id: 'long_head',
          label: '長頭(縦に長い頭形)',
          tone: 'neutral',
          text: '頭を上から見たとき縦の長さが横幅に対して長い「長頭」タイプ。伝統的な見方では、堅実で持続性があり、一つのことをじっくり続ける保守的な気質と結びつけられてきた。'
        },
        {
          id: 'round_head',
          label: '円頭(丸みのある頭形)',
          tone: 'neutral',
          text: '頭を上から見たとき丸みのある「円頭」タイプ。伝統的な見方では、新しいものを取り入れるのが早く、社交的で環境の変化に順応しやすい気質と結びつけられてきた。'
        }
      ]
    }
  ];

  return [].concat(ORIGINAL_16_ITEMS_PLACEHOLDER, ADDED_FROM_4TH_VOLUME);
}));

/**
 * ↓↓↓ 参考: 最初にアップロードされたファイルの原文(未使用・記録目的のみ)
 *
 * スキーマが id/category/title/description で、他ファイルと不整合なため
 * 上のexport対象には含めていません。中身が汎用的なプレースホルダー
 * テキストであり実データではなさそうだったため、単に「アップロードされた
 * ものをそのまま残す」目的でここにコメントアウトして保存してあります。
 * 実データでないと判断できるなら、このコメントブロックごと削除して
 * かまいません。
 *
 * (function (root, factory) {
 *   if (typeof define === 'function' && define.amd) {
 *     define([], factory);
 *   } else if (typeof exports === 'object') {
 *     module.exports = factory();
 *   } else {
 *     root.PHRENOLOGY_PARTS = factory();
 *   }
 * }(typeof self !== 'undefined' ? self : this, function () {
 *   return [
 *     // 既存の phrenology データ項目群...
 *     {
 *       id: "phrenology_add_01",
 *       category: "phrenology",
 *       title: "頭頂部・骨相補足",
 *       description: "頭頂部の隆起および前後バランスに関する補足鑑定データ。"
 *     },
 *     {
 *       id: "phrenology_add_02",
 *       category: "phrenology",
 *       title: "側頭部・耳上部の骨相",
 *       description: "側頭部の張り出しと直感力・実践力に関する統合指標。"
 *     },
 *     {
 *       id: "phrenology_add_03",
 *       category: "phrenology",
 *       title: "後頭部・首筋接続部",
 *       description: "後頭結節の形状に基づく体力および耐性補足データ。"
 *     }
 *   ];
 * }));
 */
