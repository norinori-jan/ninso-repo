/**
 * app/autonomous-face-reader.js
 * 「全体解析(自律・選択操作なし)」モードの検出・解釈エンジン。
 *
 * ユーザー要望: 「目」「口」「眉」等をプルダウンで選択させる方式ではなく、
 * 画像をアップロードするだけで、AIが自律的に画像全体を俯瞰して
 * 特徴を抽出し、解釈文を返してほしい。
 *
 * このファイルが実際にやっていること:
 *   画像全体のピクセル値(明るさ・色・彩度・左右対称性・コントラストの
 *   起伏)を計算し(`computeGlobalFeatures`)、それを伝統的な相学・
 *   色彩心理のような発想枠で言語化する(`buildAutonomousGansouReport`)。
 *   利用者の操作は画像をアップロードすることだけで、パーツの選択・
 *   3点マーキング等は一切不要(既存の`hidden-face-detector.js`が
 *   「点+線パターンの候補位置」を探すのに対し、こちらは位置を問わず
 *   画像"全体"の大づかみな特徴だけを見る、という違いがある)。
 *
 * ★正直な注意(このファイルがやっていないこと):
 *   ユーザー要望にあった「表情筋の微細な動き」「顔の左右差(パーツ単位の
 *   精密な非対称性)」「視線の方向と強度」「顔のパーツ間のバランス」
 *   「無意識的な緊張や弛緩」を字義通りに検出するには、本来は顔ランド
 *   マーク検出・視線推定(gaze estimation)といった専用の機械学習
 *   モデルが必要です。本アプリはオフラインで動く古典的画像処理のみで
 *   構成されており、そうしたモデルは組み込んでいません。
 *   そのため、このファイルが計算しているのは:
 *     - 画像全体の明るさ(気分の明暗の代理指標)
 *     - 画像全体の色味・彩度(色彩心理の代理指標)
 *     - 画像の左半分と右半分(鏡映)の画素差(顔のパーツ単位の非対称性
 *       ではなく、画像全体としての左右差の大づかみな代理指標)
 *     - 光の当たり方(上下左右どちらが明るいか)
 *     - 明暗の起伏(コントラスト・エッジの多さ。緊張感の代理指標)
 *   という「画像レベルの大づかみな特徴」だけであり、実際の表情筋の
 *   動きや視線方向そのものを検出しているわけではありません。
 *   出力メッセージには常にこの限界を明記した注記を含めます。
 *   将来、実際の顔ランドマーク・視線推定モデルを組み込む場合は、
 *   `docs/GANSOU_ROADMAP.md`のML化ロードマップを参照してください。
 *
 * ブラウザ: window.AutonomousFaceReader として公開。
 * Node(テスト用): module.exports で公開。
 */

(function (root, factory) {
  var mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (root) {
    root.AutonomousFaceReader = mod;
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // -----------------------------------------------------------------
  // 特徴抽出(画像全体・DOM非依存の純粋関数)
  // -----------------------------------------------------------------

  function toGrayscale(imageData) {
    var data = imageData.data;
    var width = imageData.width, height = imageData.height;
    var gray = new Float64Array(width * height);
    for (var i = 0, p = 0; p < width * height; i += 4, p++) {
      gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    return gray;
  }

  function computeGlobalFeatures(imageData) {
    var data = imageData.data, width = imageData.width, height = imageData.height;
    var gray = toGrayscale(imageData);
    var n = width * height;
    if (n === 0) {
      return {
        width: 0, height: 0, avgBrightness: 0,
        avgColor: { r: 0, g: 0, b: 0 }, avgSaturation: 0,
        lightBias: { horizontal: 0, vertical: 0 },
        asymmetryScore: 0, tensionScore: 0,
      };
    }

    // 明るさ・色・彩度(全画素平均)
    var totalGray = 0, sumR = 0, sumG = 0, sumB = 0, sumSat = 0;
    for (var p = 0, i = 0; p < n; p++, i += 4) {
      totalGray += gray[p];
      var r = data[i], g = data[i + 1], b = data[i + 2];
      sumR += r; sumG += g; sumB += b;
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      sumSat += mx > 0 ? (mx - mn) / mx : 0;
    }
    var avgGray = totalGray / n;
    var avgColor = { r: sumR / n, g: sumG / n, b: sumB / n };
    var avgSaturation = sumSat / n;

    // 上下左右の明るさの偏り(光の当たり方の代理指標)
    var leftSum = 0, leftN = 0, rightSum = 0, rightN = 0;
    var topSum = 0, topN = 0, bottomSum = 0, bottomN = 0;
    var midX = width / 2, midY = height / 2;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var v = gray[y * width + x];
        if (x < midX) { leftSum += v; leftN++; } else { rightSum += v; rightN++; }
        if (y < midY) { topSum += v; topN++; } else { bottomSum += v; bottomN++; }
      }
    }
    var leftAvg = leftN ? leftSum / leftN : 0, rightAvg = rightN ? rightSum / rightN : 0;
    var topAvg = topN ? topSum / topN : 0, bottomAvg = bottomN ? bottomSum / bottomN : 0;

    // 左右対称性(画像全体を鏡映で比較する大づかみな代理指標。パーツ単位の
    // 精密な非対称性検出ではない点に注意 — 上部の「正直な注意」参照)
    var symDiffSum = 0, symCount = 0;
    var halfW = Math.floor(width / 2);
    for (var y2 = 0; y2 < height; y2++) {
      for (var x2 = 0; x2 < halfW; x2++) {
        var leftVal = gray[y2 * width + x2];
        var mirroredX = width - 1 - x2;
        var rightVal = gray[y2 * width + mirroredX];
        symDiffSum += Math.abs(leftVal - rightVal);
        symCount++;
      }
    }
    var avgSymDiff = symCount ? symDiffSum / symCount : 0;
    var asymmetryScore = Math.max(0, Math.min(100, Math.round((avgSymDiff / 80) * 100)));

    // 明暗の起伏(隣接画素との勾配の平均。緊張感・活発さの代理指標)
    var gradSum = 0, gradCount = 0;
    for (var y3 = 0; y3 < height - 1; y3++) {
      for (var x3 = 0; x3 < width - 1; x3++) {
        var idx = y3 * width + x3;
        var gx = gray[idx + 1] - gray[idx];
        var gy = gray[idx + width] - gray[idx];
        gradSum += Math.sqrt(gx * gx + gy * gy);
        gradCount++;
      }
    }
    var avgGradient = gradCount ? gradSum / gradCount : 0;
    var tensionScore = Math.max(0, Math.min(100, Math.round((avgGradient / 40) * 100)));

    return {
      width: width, height: height,
      avgBrightness: avgGray,
      avgColor: avgColor,
      avgSaturation: avgSaturation,
      lightBias: { horizontal: leftAvg - rightAvg, vertical: topAvg - bottomAvg },
      asymmetryScore: asymmetryScore,
      tensionScore: tensionScore,
    };
  }

  // -----------------------------------------------------------------
  // 解釈(特徴量 → 娯楽的な言語化)
  // -----------------------------------------------------------------

  function brightnessTheme(avgGray) {
    if (avgGray >= 170) return { level: '明るい', text: '画面全体が明るく、開放的・前向きなエネルギーが強調される場面という示唆です。' };
    if (avgGray >= 90) return { level: '中間', text: '明暗のバランスが取れており、落ち着いた心理状態を示すという解釈です。' };
    return { level: '暗い', text: '画面全体が暗めで、内省的・慎重な心理状態、あるいは疲労や緊張を示すという解釈です。' };
  }

  function colorTheme(avgColor) {
    var warm = avgColor.r - avgColor.b;
    if (warm > 15) return { level: '暖色寄り', text: '暖色(赤み)が強く、情熱・活力・行動的なエネルギーを象徴するという色彩心理の伝統的な見立てです。' };
    if (warm < -15) return { level: '寒色寄り', text: '寒色(青み)が強く、冷静さ・落ち着き・内省的な心理状態を象徴するという色彩心理の伝統的な見立てです。' };
    return { level: '中間色', text: '色味に大きな偏りがなく、穏やかで安定した心理状態を示すという解釈です。' };
  }

  function saturationTheme(avgSat) {
    if (avgSat > 0.35) return { level: '鮮やか', text: '色彩が鮮やかで、感情表現が豊かで活発な状態を示すという解釈です。' };
    if (avgSat > 0.15) return { level: '中程度', text: '色彩の鮮やかさは中程度で、感情面のバランスが取れているという解釈です。' };
    return { level: '控えめ', text: '色彩が控えめ(グレイッシュ)で、感情を内に秘めている、あるいは落ち着いた状態を示すという解釈です。' };
  }

  function lightBiasTheme(lightBias) {
    lightBias = lightBias || { horizontal: 0, vertical: 0 };
    var h = lightBias.horizontal, v = lightBias.vertical;
    var parts = [];
    if (Math.abs(h) > 5) {
      parts.push(h > 0
        ? '光は向かって左側から強く当たっており、過去・身内・伝統的なものとの結びつきを象徴するという伝統的な見立てです。'
        : '光は向かって右側から強く当たっており、未来・対外的な活動・新しい物事への意識を象徴するという伝統的な見立てです。');
    }
    if (Math.abs(v) > 5) {
      parts.push(v > 0
        ? '光は上側から当たっており、理想・向上心・目上からの影響を示すという解釈です。'
        : '光は下側(あるいは影)が強く、地に足の着いた現実志向、または抑圧された感情を示すという解釈です。');
    }
    if (!parts.length) parts.push('光の当たり方に強い偏りがなく、心理的なバランスが取れている状態を示すという解釈です。');
    return { text: parts.join('') };
  }

  function asymmetryTheme(score) {
    if (score >= 60) return { level: '高い', text: '画像全体の左右差が比較的大きく、内面の葛藤や複数の側面(表の顔・内なる顔)が同居している可能性を示すという解釈です。' };
    if (score >= 30) return { level: '中程度', text: '画像全体の左右差は中程度で、個性や表情の豊かさの表れという解釈です。' };
    return { level: '低い', text: '画像全体の左右差は小さく、安定した心理状態・調和のとれた印象を示すという解釈です。' };
  }

  function tensionTheme(score) {
    if (score >= 60) return { level: '高い', text: '画像全体の起伏(明暗の変化)が大きく、緊張感・活発なエネルギー、あるいは強い感情の起伏を示すという解釈です。' };
    if (score >= 30) return { level: '中程度', text: '適度な起伏があり、活動と休息のバランスが取れている状態を示すという解釈です。' };
    return { level: '低い', text: '画像全体が滑らかで、リラックスした・穏やかな状態を示すという解釈です。' };
  }

  var LIMITATION_NOTE = 'これらは画像全体の明暗・色彩・左右対称性・起伏(コントラスト)といった' +
    '大づかみな特徴から導いた、伝統的な相学・色彩心理の発想を借りた娯楽的な解釈です。' +
    '実際の表情筋の動きや視線の方向そのものを検出しているわけではなく、' +
    '実在の人物の心理状態や性格を診断・断定するものではありません。';

  function buildAutonomousGansouReport(features) {
    features = features || {};
    var brightness = brightnessTheme(features.avgBrightness || 0);
    var color = colorTheme(features.avgColor || { r: 0, g: 0, b: 0 });
    var saturation = saturationTheme(features.avgSaturation || 0);
    var light = lightBiasTheme(features.lightBias);
    var asym = asymmetryTheme(features.asymmetryScore || 0);
    var tension = tensionTheme(features.tensionScore || 0);

    var message = [brightness.text, color.text, saturation.text, light.text, asym.text, tension.text, LIMITATION_NOTE].join('');

    return {
      summary: {
        brightness: brightness.level,
        color: color.level,
        saturation: saturation.level,
        asymmetry: asym.level,
        tension: tension.level,
      },
      rawFeatures: features,
      detail: {
        brightness: brightness.text,
        color: color.text,
        saturation: saturation.text,
        light: light.text,
        asymmetry: asym.text,
        tension: tension.text,
      },
      message: message,
      limitationNote: LIMITATION_NOTE,
    };
  }

  // 画像(ImageData相当)から特徴抽出〜解釈文組み立てまでを一括で行う便利関数。
  // app.js側は「画像をアップロード→この関数を1回呼ぶ」だけでよく、
  // ユーザー側の選択操作は一切不要。
  function analyzeImageAutonomously(imageData) {
    var features = computeGlobalFeatures(imageData);
    return buildAutonomousGansouReport(features);
  }

  return {
    toGrayscale: toGrayscale,
    computeGlobalFeatures: computeGlobalFeatures,
    buildAutonomousGansouReport: buildAutonomousGansouReport,
    analyzeImageAutonomously: analyzeImageAutonomously,
    LIMITATION_NOTE: LIMITATION_NOTE,
  };
});
