/**
 * app/hidden-face-detector.js
 * 「願相(隠れ相)」の自動候補検出(ヒューリスティック・ラベル付き学習
 * データ不要のアルゴリズム版)。
 *
 * 設計方針(docs/GANSOU_ROADMAP.md 参照):
 *   - 機械学習モデルではなく、古典的な画像処理(平滑化+局所適応閾値+
 *     連結成分ラベリング+形状フィルタ+幾何マッチング)で「点(ほくろ等の
 *     暗い斑点)」と「線(しわ等の暗い筋)」の組み合わせから顔らしい
 *     パターン候補を探す。学習データが無くても動く、というのが最大の特徴。
 *     (ユーザー提示の資料にある「最初の一歩(ルールのプログラム化)」に
 *     相当する段階。本格的なYOLO等の学習は別途データ収集・アノテーション
 *     フェーズが必要で、今はまだそこには進んでいない)。
 *   - このファイルは Canvas の ImageData 相当の入力
 *     ({data: RGBAの配列, width, height}) だけに依存し、DOM操作
 *     (画像の読み込み・キャンバス描画)は行わない。実際の画像→
 *     ImageData変換は app.js 側(ブラウザのCanvas API)が担当する。
 *   - スコア計算は hidden-face-engine.js の
 *     computeFaceLikenessScore() を極力再利用する(呼び出し側から
 *     options.scoreFn として注入。未指定の場合は簡易フォールバックで
 *     単独動作もできるようにしてある)。
 *
 * 今回(精度向上版)で追加した前処理(docs/GANSOU_ROADMAP.md記載の
 * 「精度向上のための具体的な次の一手」1〜4番をすべて実装):
 *   1. 局所適応閾値: 画像全体の平均ではなく、各画素の近傍(積分画像で
 *      高速計算)の明度を基準に閾値を決める。照明ムラへの耐性が上がる。
 *   2. 肌色マスキング: YCbCr色空間で肌色らしい画素の外接矩形(+余白)を
 *      算出し、検索範囲をその中に限定する(髪・服・背景の誤検出を抑制)。
 *      肌色画素がほとんど無い/画像全体が肌色に近い等、判定が信頼できない
 *      場合は自動的に画像全体にフォールバックする(検出範囲を誤って
 *      ゼロにしないため。単純なYCbCr判定は肌の色みの違いで外れやすい
 *      という限界があるため、このフォールバックは精度面・公平性の両面で
 *      重要)。
 *   3. 平滑化: 閾値判定の前に軽いボックスブラーをかけ、ノイズ由来の
 *      小さな誤検出を減らす。
 *   4. 候補の形状フィルタ: 点候補は外接矩形に対する充填率(丸み・塊らしさ)
 *      とアスペクト比で、毛髪のような細長い塊を除外する。線候補は隣接行に
 *      同程度の暗い連なりがあるか(線としての連続性)を優先する。
 *
 * 精度についての正直な注意(docs/GANSOU_ROADMAP.md にも記載):
 *   - 上記の改善後も、あくまで古典的画像処理による近似であり、実際の
 *     ほくろ・しわとの完全な一致は保証できない。特に肌色マスキングは
 *     単純なYCbCr範囲判定のため、写真の色味・光源・肌の色みによっては
 *     うまく機能しないことがある(その場合は自動的に画像全体を対象に
 *     フォールバックする)。
 *   - 最終的な精度向上には、ラベル付きデータを集めてのML化
 *     (YOLO等の物体検出モデル学習)が本筋になる。詳細は
 *     docs/GANSOU_ROADMAP.md の「将来、本当にAIモデル化する場合の
 *     ロードマップ」を参照。
 *
 * ブラウザ: window.HiddenFaceDetector として公開。
 * Node(テスト用): module.exports で公開。
 */

(function (root, factory) {
  var mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (root) {
    root.HiddenFaceDetector = mod;
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // -----------------------------------------------------------------
  // 基礎ユーティリティ
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

  function meanStd(arr) {
    var n = arr.length, sum = 0, i;
    for (i = 0; i < n; i++) sum += arr[i];
    var mean = n ? sum / n : 0;
    var sqSum = 0;
    for (i = 0; i < n; i++) { var d = arr[i] - mean; sqSum += d * d; }
    var std = n ? Math.sqrt(sqSum / n) : 0;
    return { mean: mean, std: std };
  }

  // 平滑化(ノイズ除去): 分離可能なボックスブラー(横→縦の2パス)。
  // 解析用画像は長辺240px程度に縮小済みの前提なので、素朴な実装でも
  // 実用上十分な速度で動く。
  function boxBlur(gray, width, height, radius) {
    if (!radius || radius < 1) return gray;
    var tmp = new Float64Array(width * height);
    var out = new Float64Array(width * height);
    var x, y, xx, yy, s, c, x0, x1, y0, y1;

    for (y = 0; y < height; y++) {
      var rowBase = y * width;
      for (x = 0; x < width; x++) {
        x0 = Math.max(0, x - radius);
        x1 = Math.min(width - 1, x + radius);
        s = 0; c = 0;
        for (xx = x0; xx <= x1; xx++) { s += gray[rowBase + xx]; c++; }
        tmp[rowBase + x] = s / c;
      }
    }
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        y0 = Math.max(0, y - radius);
        y1 = Math.min(height - 1, y + radius);
        s = 0; c = 0;
        for (yy = y0; yy <= y1; yy++) { s += tmp[yy * width + x]; c++; }
        out[y * width + x] = s / c;
      }
    }
    return out;
  }

  // 局所適応閾値のための積分画像(サミングエリアテーブル)。
  // integral[(y+1)*(width+1)+(x+1)] = (0,0)〜(x,y) の画素値の総和。
  function computeIntegralImage(gray, width, height) {
    var w1 = width + 1;
    var integral = new Float64Array(w1 * (height + 1));
    for (var y = 0; y < height; y++) {
      var rowSum = 0;
      for (var x = 0; x < width; x++) {
        rowSum += gray[y * width + x];
        integral[(y + 1) * w1 + (x + 1)] = integral[y * w1 + (x + 1)] + rowSum;
      }
    }
    return integral;
  }

  function localMean(integral, width, height, x, y, radius) {
    var w1 = width + 1;
    var x0 = Math.max(0, x - radius), x1 = Math.min(width - 1, x + radius);
    var y0 = Math.max(0, y - radius), y1 = Math.min(height - 1, y + radius);
    var A = integral[y0 * w1 + x0];
    var B = integral[y0 * w1 + (x1 + 1)];
    var C = integral[(y1 + 1) * w1 + x0];
    var D = integral[(y1 + 1) * w1 + (x1 + 1)];
    var count = (x1 - x0 + 1) * (y1 - y0 + 1);
    return count > 0 ? (D - B - C + A) / count : 0;
  }

  // -----------------------------------------------------------------
  // 肌色マスキング: YCbCr色空間の経験的な範囲判定(Chai & Ngan方式に近い
  // 簡易版)で肌色らしい画素を判定し、外接矩形+余白を検索範囲とする。
  // 判定が信頼できない場合(肌色画素が少なすぎる/多すぎる)は画像全体に
  // フォールバックする。
  // -----------------------------------------------------------------

  function isSkinPixel(r, g, b) {
    var y = 0.299 * r + 0.587 * g + 0.114 * b;
    var cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    var cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    return y > 40 && cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
  }

  function computeSkinRegion(imageData, options) {
    options = options || {};
    var data = imageData.data, width = imageData.width, height = imageData.height;
    var minX = width, maxX = -1, minY = height, maxY = -1, count = 0;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var idx = (y * width + x) * 4;
        if (isSkinPixel(data[idx], data[idx + 1], data[idx + 2])) {
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    var totalPixels = width * height;
    var ratio = totalPixels ? count / totalPixels : 0;
    var minRatio = typeof options.minSkinRatio === 'number' ? options.minSkinRatio : 0.06;
    var maxRatio = typeof options.maxSkinRatio === 'number' ? options.maxSkinRatio : 0.97;

    if (count === 0 || ratio < minRatio || ratio > maxRatio) {
      // 肌色判定が信頼できない(検出できない、または画像全体が肌色に
      // 近すぎる)場合は画像全体を対象にする安全弁。
      return { x1: 0, y1: 0, x2: width - 1, y2: height - 1, used: false, ratio: ratio };
    }

    var marginX = Math.round((maxX - minX) * 0.15) + 2;
    var marginY = Math.round((maxY - minY) * 0.15) + 2;
    return {
      x1: Math.max(0, minX - marginX),
      y1: Math.max(0, minY - marginY),
      x2: Math.min(width - 1, maxX + marginX),
      y2: Math.min(height - 1, maxY + marginY),
      used: true,
      ratio: ratio,
    };
  }

  function intersectRegion(a, b) {
    var x1 = Math.max(a.x1, b.x1), y1 = Math.max(a.y1, b.y1);
    var x2 = Math.min(a.x2, b.x2), y2 = Math.min(a.y2, b.y2);
    if (x2 < x1 || y2 < y1) return null;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  // -----------------------------------------------------------------
  // 前処理コンテキストの構築: 平滑化・積分画像・肌色領域を一度だけ計算し、
  // findFaceCandidates() 内のループ全体で使い回す(毎回再計算しない)。
  // -----------------------------------------------------------------

  function buildContext(imageData, options) {
    options = options || {};
    var width = imageData.width, height = imageData.height;
    var gray = toGrayscale(imageData);
    var blurRadius = typeof options.blurRadius === 'number' ? options.blurRadius : 1;
    var blurred = boxBlur(gray, width, height, blurRadius);
    var stats = meanStd(blurred);
    var integral = computeIntegralImage(blurred, width, height);
    var useSkinMask = options.skinMask !== false; // 既定でON
    var skinRegion = useSkinMask
      ? computeSkinRegion(imageData, options.skin)
      : { x1: 0, y1: 0, x2: width - 1, y2: height - 1, used: false, ratio: null };
    return {
      width: width, height: height,
      gray: gray, blurred: blurred, stats: stats, integral: integral,
      skinRegion: skinRegion,
    };
  }

  // -----------------------------------------------------------------
  // 「点」の検出: 暗い斑点(ほくろ・瞳・影の候補)を連結成分として検出。
  //
  // options.thresholdK: 局所平均から画像全体の標準偏差の何倍分暗い画素を
  //   「暗い」とみなすか(既定 1.0。大きいほど検出が厳しくなる=誤検出は
  //   減るが見逃しも増える)
  // options.adaptiveRadius: 局所適応閾値の近傍半径(既定: 画像の短辺の
  //   約8%、最低4px)
  // options.minArea / options.maxArea: 塊のサイズでノイズ・巨大な影を除外
  // options.minFillRatio: 外接矩形に対する充填率の下限(丸み・塊らしさ。
  //   毛髪等の細長い塊を除外する形状フィルタ。既定0.35)
  // options.maxAspect: 外接矩形の縦横比の許容上限(既定3.0)
  // -----------------------------------------------------------------

  function detectDarkBlobsFromContext(ctx, options) {
    options = options || {};
    var width = ctx.width, height = ctx.height;
    var blurred = ctx.blurred;
    var k = typeof options.thresholdK === 'number' ? options.thresholdK : 1.0;
    var minArea = options.minArea || 3;
    var maxArea = typeof options.maxArea === 'number' ? options.maxArea : Math.round(width * height * 0.05);
    var minFillRatio = typeof options.minFillRatio === 'number' ? options.minFillRatio : 0.35;
    var maxAspect = typeof options.maxAspect === 'number' ? options.maxAspect : 3.0;
    var adaptiveRadius = typeof options.adaptiveRadius === 'number'
      ? options.adaptiveRadius
      : Math.max(4, Math.round(Math.min(width, height) * 0.08));
    var region = ctx.skinRegion;

    var visited = new Uint8Array(width * height);
    var blobs = [];

    for (var y = region.y1; y <= region.y2; y++) {
      for (var x = region.x1; x <= region.x2; x++) {
        var idx = y * width + x;
        if (visited[idx]) continue;
        var localThresh = localMean(ctx.integral, width, height, x, y, adaptiveRadius) - k * ctx.stats.std;
        if (blurred[idx] >= localThresh) { visited[idx] = 1; continue; }

        // 4近傍のスタックベース探索で連結成分(暗い塊)を1つ取り出す。
        // 探索範囲は肌色領域(+余白)に限定する。
        var stack = [idx];
        visited[idx] = 1;
        var pixelIdxs = [];
        var sumGray = 0;
        while (stack.length) {
          var cur = stack.pop();
          pixelIdxs.push(cur);
          sumGray += blurred[cur];
          var cx = cur % width, cy = (cur / width) | 0;
          var candidates = [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]];
          for (var n = 0; n < candidates.length; n++) {
            var nx = candidates[n][0], ny = candidates[n][1];
            if (nx < region.x1 || ny < region.y1 || nx > region.x2 || ny > region.y2) continue;
            var nidx = ny * width + nx;
            if (visited[nidx]) continue;
            var neighborThresh = localMean(ctx.integral, width, height, nx, ny, adaptiveRadius) - k * ctx.stats.std;
            if (blurred[nidx] >= neighborThresh) { visited[nidx] = 1; continue; }
            visited[nidx] = 1;
            stack.push(nidx);
          }
          if (pixelIdxs.length > width * height) break; // 安全弁
        }

        if (pixelIdxs.length >= minArea && pixelIdxs.length <= maxArea) {
          var minXb = width, maxXb = 0, minYb = height, maxYb = 0;
          for (var pi = 0; pi < pixelIdxs.length; pi++) {
            var px = pixelIdxs[pi] % width, py = (pixelIdxs[pi] / width) | 0;
            if (px < minXb) minXb = px;
            if (px > maxXb) maxXb = px;
            if (py < minYb) minYb = py;
            if (py > maxYb) maxYb = py;
          }
          var bboxW = maxXb - minXb + 1, bboxH = maxYb - minYb + 1;
          var bboxArea = bboxW * bboxH;
          var fillRatio = bboxArea > 0 ? pixelIdxs.length / bboxArea : 0;
          var aspect = bboxH > 0 ? bboxW / bboxH : bboxW;
          var aspectOk = aspect <= maxAspect && aspect >= 1 / maxAspect;

          // 形状フィルタ: 充填率が低い(細長い/中空な形)や、縦横比が
          // 極端な塊(毛髪の一部等)は「点(ほくろ・瞳)候補」から除外する。
          if (fillRatio >= minFillRatio && aspectOk) {
            blobs.push({
              x: (minXb + maxXb) / 2,
              y: (minYb + maxYb) / 2,
              width: bboxW,
              height: bboxH,
              area: pixelIdxs.length,
              avgGray: sumGray / pixelIdxs.length,
              fillRatio: fillRatio,
              aspect: aspect,
            });
          }
        }
      }
    }
    return blobs;
  }

  function detectDarkBlobs(imageData, options) {
    var ctx = buildContext(imageData, options);
    return detectDarkBlobsFromContext(ctx, options && options.blob ? options.blob : options);
  }

  // -----------------------------------------------------------------
  // 「線」の検出: 指定した矩形範囲内で、最も長い暗い横方向の連なりを探す
  // (しわ・口の候補)。しわはほくろより淡いことが多いため、既定の閾値は
  // detectDarkBlobs よりやや緩め(thresholdK既定0.5)にしてある。
  //
  // 形状フィルタ: 単一行だけのノイズ由来の暗い連なりを避けるため、隣接行
  // (上下1px)にX範囲が重なる同程度の暗い連なりがあるもの(=「線として
  // 連続性がある」もの)を優先して選ぶ。連続性のある候補が1つも無い場合は
  // (見逃しを増やさないため)従来通り単一行のベスト候補にフォールバックする。
  // -----------------------------------------------------------------

  function rowDarkRuns(blurred, integral, width, x1, x2, y, threshFn) {
    var runs = [];
    var runStart = -1;
    for (var x = x1; x <= x2; x++) {
      var idx = y * width + x;
      var dark = blurred[idx] < threshFn(x, y);
      if (dark) {
        if (runStart === -1) runStart = x;
      } else if (runStart !== -1) {
        runs.push({ x1: runStart, x2: x - 1 });
        runStart = -1;
      }
    }
    if (runStart !== -1) runs.push({ x1: runStart, x2: x2 });
    return runs;
  }

  function runsOverlap(a, b, minOverlapRatio) {
    var overlap = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) + 1;
    if (overlap <= 0) return false;
    var shorter = Math.min(a.x2 - a.x1 + 1, b.x2 - b.x1 + 1);
    return overlap >= shorter * minOverlapRatio;
  }

  function detectDarkRunInRegionFromContext(ctx, region, options) {
    options = options || {};
    var width = ctx.width, height = ctx.height;
    var blurred = ctx.blurred;
    var k = typeof options.thresholdK === 'number' ? options.thresholdK : 0.5;
    var adaptiveRadius = typeof options.adaptiveRadius === 'number'
      ? options.adaptiveRadius
      : Math.max(4, Math.round(Math.min(width, height) * 0.08));
    var threshFn = function (x, y) {
      return localMean(ctx.integral, width, height, x, y, adaptiveRadius) - k * ctx.stats.std;
    };

    var clipped = intersectRegion(
      { x1: Math.floor(region.x1), y1: Math.floor(region.y1), x2: Math.ceil(region.x2), y2: Math.ceil(region.y2) },
      ctx.skinRegion
    );
    if (!clipped) return null;
    var x1 = Math.max(0, clipped.x1), x2 = Math.min(width - 1, clipped.x2);
    var y1 = Math.max(0, clipped.y1), y2 = Math.min(height - 1, clipped.y2);
    if (x2 <= x1 || y2 <= y1) return null;

    var minLength = options.minLength || Math.max(3, Math.round((x2 - x1) * 0.3));

    var rowsCache = {};
    function getRuns(y) {
      if (!rowsCache.hasOwnProperty(y)) {
        rowsCache[y] = rowDarkRuns(blurred, ctx.integral, width, x1, x2, y, threshFn);
      }
      return rowsCache[y];
    }

    var bestSupported = null;
    var bestAny = null;

    for (var y = y1; y <= y2; y++) {
      var runs = getRuns(y).filter(function (r) { return (r.x2 - r.x1 + 1) >= minLength; });
      if (!runs.length) continue;
      var prevRuns = y > y1 ? getRuns(y - 1) : [];
      var nextRuns = y < y2 ? getRuns(y + 1) : [];
      for (var ri = 0; ri < runs.length; ri++) {
        var r = runs[ri];
        var length = r.x2 - r.x1 + 1;
        var candidate = { x1: r.x1, x2: r.x2, y: y, length: length };
        if (!bestAny || length > bestAny.length) bestAny = candidate;

        var supported = prevRuns.some(function (pr) { return runsOverlap(pr, r, 0.4); }) ||
          nextRuns.some(function (nr) { return runsOverlap(nr, r, 0.4); });
        if (supported && (!bestSupported || length > bestSupported.length)) {
          bestSupported = candidate;
        }
      }
    }

    return bestSupported || bestAny;
  }

  function detectDarkRunInRegion(imageData, region, options) {
    var ctx = buildContext(imageData, options);
    return detectDarkRunInRegionFromContext(ctx, region, options && options.line ? options.line : options);
  }

  // -----------------------------------------------------------------
  // 簡易フォールバックスコア(hidden-face-engine.js が読み込まれていない
  // 環境で単独動作させるための最低限の計算。本来は
  // HiddenFaceEngine.computeFaceLikenessScore を options.scoreFn で
  // 注入して使うことを推奨)
  // -----------------------------------------------------------------

  function fallbackScore(points) {
    var eyeLeft = points.eyeLeft, eyeRight = points.eyeRight, mouth = points.mouth;
    var eyeDist = Math.sqrt(Math.pow(eyeRight.x - eyeLeft.x, 2) + Math.pow(eyeRight.y - eyeLeft.y, 2));
    if (eyeDist < 1) return 0;
    var midX = (eyeLeft.x + eyeRight.x) / 2, midY = (eyeLeft.y + eyeRight.y) / 2;
    var heightDiff = Math.abs(eyeLeft.y - eyeRight.y);
    var symmetry = Math.max(0, 1 - heightDiff / eyeDist);
    var mouthOffsetY = mouth.y - midY;
    var mouthBelowScore = mouthOffsetY > 0 ? Math.min(1, mouthOffsetY / eyeDist) : 0;
    var mouthCenteredScore = Math.max(0, 1 - Math.abs(mouth.x - midX) / eyeDist);
    return Math.max(0, Math.min(100, Math.round((symmetry * 0.4 + mouthBelowScore * 0.3 + mouthCenteredScore * 0.3) * 100)));
  }

  // -----------------------------------------------------------------
  // 「点+線」の組み合わせ探索: 暗い斑点のペア(目候補)を総当たりで調べ、
  // その下に口候補となる横方向の暗い線があるものだけを候補として残す。
  // ユーザー提示の願相検出プロンプトの1〜4番をそのままアルゴリズム化した
  // もの。前処理(平滑化・積分画像・肌色領域)は buildContext() で一度だけ
  // 計算し、ループ全体で使い回す。
  // -----------------------------------------------------------------

  function findFaceCandidates(imageData, options) {
    options = options || {};
    var ctx = buildContext(imageData, options);
    var width = ctx.width, height = ctx.height;
    var blobs = detectDarkBlobsFromContext(ctx, options.blob);
    var scoreFn = typeof options.scoreFn === 'function' ? options.scoreFn : fallbackScore;
    var maxCandidates = options.maxCandidates || 5;
    var minScore = typeof options.minScore === 'number' ? options.minScore : 0;

    var candidates = [];

    for (var i = 0; i < blobs.length; i++) {
      for (var j = i + 1; j < blobs.length; j++) {
        var a = blobs[i], b = blobs[j];
        var left = a.x <= b.x ? a : b;
        var right = a.x <= b.x ? b : a;
        var dx = right.x - left.x;
        var dy = Math.abs(a.y - b.y);

        // 目の間隔として妥当な範囲か(画像幅に対する比率で判定)
        if (dx < width * 0.03 || dx > width * 0.6) continue;
        // 左右の高さがある程度そろっているか(傾きすぎていないか)
        if (dy > dx * 0.6) continue;

        var midY = (a.y + b.y) / 2;
        var region = {
          x1: left.x - dx * 0.25,
          x2: right.x + dx * 0.25,
          y1: midY + dx * 0.15,
          y2: Math.min(height - 1, midY + dx * 1.2),
        };
        if (region.y2 <= region.y1) continue;

        var run = detectDarkRunInRegionFromContext(ctx, region, options.line);
        if (!run) continue;

        var mouthPoint = { x: (run.x1 + run.x2) / 2, y: run.y };
        var points = { eyeLeft: { x: left.x, y: left.y }, eyeRight: { x: right.x, y: right.y }, mouth: mouthPoint };
        var score = scoreFn(points);
        if (score < minScore) continue;

        candidates.push({
          points: points,
          score: score,
          regionCoords: {
            x: Math.round(region.x1),
            y: Math.round(Math.min(left.y, right.y)),
            w: Math.round(region.x2 - region.x1),
            h: Math.round(region.y2 - Math.min(left.y, right.y)),
          },
        });
      }
    }

    candidates.sort(function (c1, c2) { return c2.score - c1.score; });

    // 重なりの大きい候補(ほぼ同じ目のペアから複数の口候補が拾われた場合
    // など)を間引く簡易な重複排除
    var deduped = [];
    candidates.forEach(function (c) {
      var overlaps = deduped.some(function (d) {
        return Math.abs(d.points.eyeLeft.x - c.points.eyeLeft.x) < width * 0.05 &&
          Math.abs(d.points.eyeRight.x - c.points.eyeRight.x) < width * 0.05 &&
          Math.abs(d.points.eyeLeft.y - c.points.eyeLeft.y) < width * 0.05;
      });
      if (!overlaps) deduped.push(c);
    });

    return deduped.slice(0, maxCandidates);
  }

  return {
    toGrayscale: toGrayscale,
    meanStd: meanStd,
    boxBlur: boxBlur,
    computeIntegralImage: computeIntegralImage,
    localMean: localMean,
    isSkinPixel: isSkinPixel,
    computeSkinRegion: computeSkinRegion,
    buildContext: buildContext,
    detectDarkBlobs: detectDarkBlobs,
    detectDarkRunInRegion: detectDarkRunInRegion,
    findFaceCandidates: findFaceCandidates,
    fallbackScore: fallbackScore,
  };
});
