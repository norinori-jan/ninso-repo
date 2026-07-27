/**
 * data/index.js
 * 全パーツデータを1本のPARTS配列に集約するエントリポイント。
 * UMD形式で Node(require) とブラウザ(scriptタグ読み込み)両対応。
 *
 * ★重要な注意★
 * アップロードされた実ファイルが空(0バイト)だったため、このファイルは
 * ゼロから再構成したものです。以下の前提を置いています:
 *
 * 1. Node側: 各データファイルが
 *      module.exports = factory();  // factory() が配列を返す
 *    という形式(phrenology.js / palmistry*.js と同じUMDパターン)である前提。
 *    この前提が正しければ require() の返り値がそのまま配列になります。
 *
 * 2. ブラウザ側: 各データファイルが root.XXX_PARTS という名前で
 *    グローバルに配列を公開している前提です。
 *    - core.js         → root.CORE_PARTS         (要確認・仮定)
 *    - constitution.js → root.CONSTITUTION_PARTS (要確認・仮定)
 *    - five_elements.js→ root.FIVE_ELEMENTS_PARTS (要確認・仮定)
 *    - face_shape.js   → root.FACE_SHAPE_PARTS    (要確認・仮定)
 *    - body.js         → root.BODY_PARTS          (要確認・仮定)
 *    - phrenology.js   → root.PHRENOLOGY_PARTS    (アップロード実物で確認済み)
 *    - palmistry*.js   → root.PALMISTRY_*_PARTS   (今回作成したので確定)
 *
 *    core.js 等5ファイルの実際のグローバル変数名がこれと違う場合は、
 *    下のブラウザ分岐の該当行を実際の名前に書き換えてください。
 *    (Node側のrequireは変数名に依存しないので、その場合でも動作します)
 *
 * 読み込みに失敗したファイルは空配列として扱われ、全体が落ちないように
 * 防御的に書いています(console.warn で分かるようにしています)。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    function safeRequire(relPath) {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        return require(relPath);
      } catch (e) {
        console.warn('[data/index.js] ' + relPath + ' の読み込みに失敗しました: ' + e.message);
        return [];
      }
    }

    module.exports = factory(
      safeRequire('./core.js'),
      safeRequire('./constitution.js'),
      safeRequire('./five_elements.js'),
      safeRequire('./face_shape.js'),
      safeRequire('./body.js'),
      safeRequire('./phrenology.js'),
      safeRequire('./palmistry.js'),
      safeRequire('./palmistry_nails.js'),
      safeRequire('./palmistry_mounts.js'),
      safeRequire('./palmistry_lines.js'),
      safeRequire('./forehead_extra.js'),
      safeRequire('./hair.js')
    );
  } else {
    root.PARTS = factory(
      root.CORE_PARTS,
      root.CONSTITUTION_PARTS,
      root.FIVE_ELEMENTS_PARTS,
      root.FACE_SHAPE_PARTS,
      root.BODY_PARTS,
      root.PHRENOLOGY_PARTS,
      root.PALMISTRY_PARTS,
      root.PALMISTRY_NAILS_PARTS,
      root.PALMISTRY_MOUNTS_PARTS,
      root.PALMISTRY_LINES_PARTS,
      root.FOREHEAD_EXTRA,
      root.HAIR
    );
  }
}(typeof self !== 'undefined' ? self : this, function (
  core,
  constitution,
  fiveElements,
  faceShape,
  body,
  phrenology,
  palmistry,
  palmistryNails,
  palmistryMounts,
  palmistryLines,
  foreheadExtra,
  hair
) {
  function arr(x) {
    return Array.isArray(x) ? x : [];
  }

  return [].concat(
    arr(core),
    arr(constitution),
    arr(fiveElements),
    arr(faceShape),
    arr(body),
    arr(phrenology),
    arr(palmistry),
    arr(palmistryNails),
    arr(palmistryMounts),
    arr(palmistryLines),
    arr(foreheadExtra),
    arr(hair)
  );
}));
