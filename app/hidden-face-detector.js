/**
 * app/hidden-face-detector.js
 * 「願相(隠れ相)」の自動候補検出(ヒューリスティック・ラベル付き学習
 * データ不要のアルゴリズム版)。
 *
 * 設計方針(docs/GANSOU_ROADMAP.md 参照):
 *   - 機械学習モデルではなく、古典的な画像処理(閾値処理+連結成分
 *     ラベリング+幾何マッチング)で「点(ほくろ等の暗い斑点)」と
 *     「線(しわ等の暗い筋)」の組み合わせから顔らしいパターン候補を
 *     探す。学習データが無くても動く、というのが最大の特徴。
 *   - このファイルは Canvas の ImageData 相当の入力
 *     ({data: RGBAの配列, width, height}) だけに依存し、DOM操作
 *     (画像の読み込み・キャンバス描画)は行わない。実際の画像→
 *     ImageData変換は app.js 側(ブラウザのCanvas API)が担当する。
 *   - スコア計算は hidden-face-engine.js の
 *     computeFaceLikenessScore() を極力再利用する(呼び出し側から
 *     options.scoreFn として注入。未指定の場合は簡易フォールバックで
 *     単独動作もできるようにしてある)。
 *
 * 精度についての正直な注意(docs/GANSOU_ROADMAP.md にも記載):
 *   - 現状はグローバルな明度閾値(平均-標準偏差)による単純な検出。
 *     照明にムラがある写真、髪の毛、影、瞳孔・鼻孔などとの誤検出は
 *     一定数発生する。
 *   - ほくろ・しわを精緻に見分けるには、(a)顔領域だけに検索範囲を
 *     絞る肌色マスキング、(b)局所適応閾値(画像全体でなく近傍領域の
 *     明度を基準にする)、(c)ノイズ除去(平滑化)といった前処理の
 *     追加が精度向上の具体的な次の一手になる(未実装。ロードマップ参照)。
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

  // -----------------------------------------------------------------
  // 「点」の検出: 暗い斑点(ほくろ・瞳・影の候補)を連結成分として検出
  //
  // options.thresholdK: 平均から何標準偏差分暗い画素を「暗い」とみなすか
  //   (既定 1.0。大きいほど検出が厳しくなる=誤検出は減るが見逃しも増える)
  // options.minArea / options.maxArea: 塊のサイズでノイズ・巨大な影を除外
  // -----------------------------------------------------------------

  function detectDarkBlobs(imageData, options) {
    options = options || {};
    var width = imageData.width, height = imageData.height;
    var gray = toGrayscale(imageData);
    var stats = meanStd(gray);
    var k = typeof options.thresholdK === 'number' ? options.thresholdK : 1.0;
    var threshold = stats.mean - k * stats.std;
    var minArea = options.minArea || 3;
    var maxArea = typeof options.maxArea === 'number' ? options.maxArea : Math.round(width * height * 0.05);

    var visited = new Uint8Array(width * height);
    var blobs = [];

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var idx = y * width + x;
        if (visited[idx]) continue;
        if (gray[idx] >= threshold) { visited[idx] = 1; continue; }

        // 4近傍の幅優先探索で連結成分(暗い塊)を1つ取り出す
        var stack = [idx];
        visited[idx] = 1;
        var pixelIdxs = [];
        var sumGray = 0;
        while (stack.length) {
          var cur = stack.pop();
          pixelIdxs.push(cur);
          sumGray += gray[cur];
          var cx = cur % width, cy = (cur / width) | 0;
          var candidates = [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]];
          for (var n = 0; n < candidates.length; n++) {
            var nx = candidates[n][0], ny = candidates[n][1];
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            var nidx = ny * width + nx;
            if (visited[nidx]) continue;
            if (gray[nidx] >= threshold) { visited[nidx] = 1; continue; }
            visited[nidx] = 1;
            stack.push(nidx);
          }
          // 極端に大きな塊(全体が暗い画像など)で処理が長引かないよう安全弁
          if (pixelIdxs.length > width * height) break;
        }

        if (pixelIdxs.length >= minArea && pixelIdxs.length <= maxArea) {
          var minX = width, maxX = 0, minY = height, maxY = 0;
          for (var pi = 0; pi < pixelIdxs.length; pi++) {
            var px = pixelIdxs[pi] % width, py = (pixelIdxs[pi] / width) | 0;
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
          }
          blobs.push({
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
            area: pixelIdxs.length,
            avgGray: sumGray / pixelIdxs.length,
          });
        }
      }
    }
    return blobs;
  }

  // -----------------------------------------------------------------
  // 「線」の検出: 指定した矩形範囲内で、最も長い暗い横方向の連なりを探す
  // (しわ・口の候補)。しわはほくろより淡いことが多いため、既定の閾値は
  // detectDarkBlobs よりやや緩め(thresholdK既定0.5)にしてある。
  // -----------------------------------------------------------------

  function detectDarkRunInRegion(imageData, region, options) {
    options = options || {};
    var width = imageData.width, height = imageData.height;
    var gray = toGrayscale(imageData);
    var stats = meanStd(gray);
    var k = typeof options.thresholdK === 'number' ? options.thresholdK : 0.5;
    var threshold = stats.mean - k * stats.std;

    var x1 = Math.max(0, Math.floor(region.x1));
    var x2 = Math.min(width - 1, Math.ceil(region.x2));
    var y1 = Math.max(0, Math.floor(region.y1));
    var y2 = Math.min(height - 1, Math.ceil(region.y2));
    if (x2 <= x1 || y2 <= y1) return null;

    var minLength = options.minLength || Math.max(3, Math.round((x2 - x1) * 0.3));
    var best = null;

    for (var y = y1; y <= y2; y++) {
      var runStart = -1, runLen = 0;
      for (var x = x1; x <= x2; x++) {
        var idx = y * width + x;
        var dark = gray[idx] < threshold;
        if (dark) {
          if (runStart === -1) runStart = x;
          runLen++;
        } else {
          if (runStart !== -1 && runLen >= minLength && (!best || runLen > best.length)) {
            best = { x1: runStart, x2: runStart + runLen - 1, y: y, length: runLen };
          }
          runStart = -1; runLen = 0;
        }
      }
      if (runStart !== -1 && runLen >= minLength && (!best || runLen > best.length)) {
        best = { x1: runStart, x2: runStart + runLen - 1, y: y, length: runLen };
      }
    }
    return best;
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
  // もの。
  // -----------------------------------------------------------------

  function findFaceCandidates(imageData, options) {
    options = options || {};
    var width = imageData.width, height = imageData.height;
    var blobs = detectDarkBlobs(imageData, options.blob);
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

        var run = detectDarkRunInRegion(imageData, region, options.line);
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
    detectDarkBlobs: detectDarkBlobs,
    detectDarkRunInRegion: detectDarkRunInRegion,
    findFaceCandidates: findFaceCandidates,
    fallbackScore: fallbackScore,
  };
});
