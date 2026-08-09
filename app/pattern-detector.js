/**
 * app/pattern-detector.js
 * 「隠れ相」自動マーキングの新エンジン(テンプレート非依存版)。
 *
 * ここに至った経緯:
 *   従来の hidden-face-detector.js は「暗い点(目候補)のペア + その下の
 *   暗い横線(口候補)」という固定テンプレートで探索していたため、
 *     1. ネクタイの写真等、目・口の幾何配置に一致するパターンがまず
 *        存在しない画像では候補が1件(もしくは0件)しか出ない
 *     2. 出力が eyeLeft/eyeRight/mouth という固定の3点形式のため、
 *        UI側で「検出位置」「種類」を毎回人間がプルダウンで選び直す
 *        必要があった(=自動化になっていない)
 *   という問題があった(ユーザー指摘・講座動画のスクリーンショット参照)。
 *
 * このファイルの設計方針:
 *   人相講座(上級)の先生が実際にやっているのは、目・鼻・口という
 *   パーツ名を最初に決めてから探すのではなく、
 *     - 意味のありそうな「線のつながり」(しわ・筋・輪郭の一部)
 *     - 周囲との「色の違い」(シミ・アザ・血色の差など)
 *     - 周囲との「浮き具合(陰影)の違い」(ほくろ・こぶ・くぼみなど、
 *       立体的な起伏を示唆する明暗のペア)
 *   を自由に丸や線で囲んでいくという作業(添付スクリーンショット参照)。
 *   これをそのままアルゴリズム化し、目・鼻・口・子供の顔…といった
 *   固定カテゴリへの当てはめは一切行わず、「周囲から浮いて見える
 *   領域・線」をすべて検出して返す。
 *
 * アルゴリズム概要(古典的画像処理のみ、学習データ不要):
 *   1. 各画素について、局所平均(ボックスブラー)との明度差・色差を計算する
 *      → 周囲より暗い/明るい/色味が違う、をまとめて「周囲との違い
 *        (サリエンス)」として扱う(白黒の濃淡だけでなく色も見る)。
 *   2. Sobel勾配強度も加味する(エッジが強い=陰影の境目が明瞭=
 *      浮き上がり/へこみを示唆する、という簡易な代理指標)。
 *   3. サリエンスが局所的な統計から見て「有意に高い」画素を連結成分
 *      ラベリングでグルーピングする(4近傍)。
 *   4. 各グループの形状(充填率・アスペクト比)から「塊(点・シミ状)」か
 *      「線(しわ・筋状)」かを判定し、塊は外接円、線は主軸に沿って
 *      間引いた折れ線として出力する(先生の丸囲み・線囲みと同じ形式)。
 *   5. 複数解像度で実行し、座標を統合・重複排除する。
 *
 * ★正直な注意:
 *   - あくまで2次元画像の明暗・色・エッジから「浮き具合」を近似的に
 *     推定しているだけで、実際の立体形状(深度)を計測しているわけ
 *     ではない。強い陰影のペア(明→暗の急な変化)がある、という
 *     間接的な手がかりに基づく簡易ヒューリスティックである。
 *   - 固定テンプレートを廃したことで検出数は増えるが、その分
 *     「本当に意味のある相」と「単なる質感のノイズ」を区別する判断は
 *     従来以上に人間側(占い師役のユーザー)に委ねられる。スコア順に
 *     表示するのはそのための補助であり、最終判断の代替ではない。
 *
 * ブラウザ: window.PatternDetector として公開。
 * Node(テスト用): module.exports で公開。
 */

(function (root, factory) {
  var mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (root) {
    root.PatternDetector = mod;
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // -----------------------------------------------------------------
  // 基礎ユーティリティ(他ファイルと重複するが、読み込み順に依存せず
  // 単独で動作させるため、あえて重複させている。既存ファイル群と同じ方針)
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

  function boxBlur(arr, width, height, radius) {
    if (!radius || radius < 1) return arr.slice ? arr.slice() : new Float64Array(arr);
    var tmp = new Float64Array(width * height);
    var out = new Float64Array(width * height);
    var x, y, xx, yy, s, c, x0, x1, y0, y1;
    for (y = 0; y < height; y++) {
      var rowBase = y * width;
      for (x = 0; x < width; x++) {
        x0 = Math.max(0, x - radius); x1 = Math.min(width - 1, x + radius);
        s = 0; c = 0;
        for (xx = x0; xx <= x1; xx++) { s += arr[rowBase + xx]; c++; }
        tmp[rowBase + x] = s / c;
      }
    }
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        y0 = Math.max(0, y - radius); y1 = Math.min(height - 1, y + radius);
        s = 0; c = 0;
        for (yy = y0; yy <= y1; yy++) { s += tmp[yy * width + x]; c++; }
        out[y * width + x] = s / c;
      }
    }
    return out;
  }

  // -----------------------------------------------------------------
  // Sobel勾配強度(エッジ・陰影境界の強さ)
  // -----------------------------------------------------------------

  function sobelMagnitude(gray, width, height) {
    var mag = new Float64Array(width * height);
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var xm1 = Math.max(0, x - 1), xp1 = Math.min(width - 1, x + 1);
        var ym1 = Math.max(0, y - 1), yp1 = Math.min(height - 1, y + 1);
        var tl = gray[ym1 * width + xm1], tc = gray[ym1 * width + x], tr = gray[ym1 * width + xp1];
        var ml = gray[y * width + xm1], mr = gray[y * width + xp1];
        var bl = gray[yp1 * width + xm1], bc = gray[yp1 * width + x], br = gray[yp1 * width + xp1];
        var gx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
        var gy = (bl + 2 * bc + br) - (tl + 2 * tc + tr);
        mag[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }
    return mag;
  }

  // -----------------------------------------------------------------
  // サリエンスマップ(周囲との違いの大きさ)の構築。
  //   - 明度差(局所平均との差、符号を保持=暗いか明るいかの判定に使う)
  //   - 色差(RGB各chの局所平均とのユークリッド距離。色味だけが違う
  //     領域…例えばシミやアザのような、暗さでは説明できない違いを拾う)
  //   - 勾配強度(陰影の境目の明瞭さ。「浮き具合」の簡易な代理指標)
  // それぞれを局所的なばらつき(標準偏差)で正規化してから加重和する。
  // -----------------------------------------------------------------

  function computeSalienceContext(imageData, options) {
    options = options || {};
    var width = imageData.width, height = imageData.height;
    var data = imageData.data;
    var n = width * height;
    var gray = toGrayscale(imageData);

    var contrastRadius = typeof options.contrastRadius === 'number'
      ? options.contrastRadius
      : Math.max(3, Math.round(Math.min(width, height) * 0.06));

    var blurredGray = boxBlur(gray, width, height, contrastRadius);

    var rCh = new Float64Array(n), gCh = new Float64Array(n), bCh = new Float64Array(n);
    for (var p = 0, i = 0; p < n; p++, i += 4) {
      rCh[p] = data[i]; gCh[p] = data[i + 1]; bCh[p] = data[i + 2];
    }
    var rBlur = boxBlur(rCh, width, height, contrastRadius);
    var gBlur = boxBlur(gCh, width, height, contrastRadius);
    var bBlur = boxBlur(bCh, width, height, contrastRadius);

    var lumDiff = new Float64Array(n);   // 符号あり(負=周囲より暗い)
    var colorDist = new Float64Array(n); // 色味の違いの大きさ(符号なし)
    for (p = 0; p < n; p++) {
      lumDiff[p] = gray[p] - blurredGray[p];
      var dr = rCh[p] - rBlur[p], dg = gCh[p] - gBlur[p], db = bCh[p] - bBlur[p];
      colorDist[p] = Math.sqrt(dr * dr + dg * dg + db * db);
    }

    var edgeMag = sobelMagnitude(gray, width, height);
    // 陰影の"急さ"を見るため、勾配強度も軽く平滑化してから使う
    // (単一画素のノイズで過検出しないように)。
    var edgeMagSmoothed = boxBlur(edgeMag, width, height, 1);

    var lumStats = meanStd(lumDiff);
    var colorStats = meanStd(colorDist);
    var edgeStats = meanStd(edgeMagSmoothed);

    var lumDenom = Math.max(lumStats.std, 1e-6);
    var colorDenom = Math.max(colorStats.std, 1e-6);
    var edgeDenom = Math.max(edgeStats.std, 1e-6);

    var colorWeight = typeof options.colorWeight === 'number' ? options.colorWeight : 0.7;
    var edgeWeight = typeof options.edgeWeight === 'number' ? options.edgeWeight : 0.35;

    var salience = new Float64Array(n);
    for (p = 0; p < n; p++) {
      var lumZ = Math.abs(lumDiff[p]) / lumDenom;
      var colorZ = colorDist[p] / colorDenom;
      var edgeZ = edgeMagSmoothed[p] / edgeDenom;
      salience[p] = lumZ + colorWeight * colorZ + edgeWeight * edgeZ;
    }

    return {
      width: width, height: height,
      gray: gray, lumDiff: lumDiff, colorDist: colorDist, edgeMag: edgeMagSmoothed,
      salience: salience,
      lumStats: lumStats, colorStats: colorStats, edgeStats: edgeStats,
    };
  }

  // -----------------------------------------------------------------
  // 連結成分ラベリング(4近傍)+ 塊/線の形状判定 + 円/折れ線への変換
  // -----------------------------------------------------------------

  function classifyAndShapeComponent(pixelIdxs, width, ctx) {
    var n = pixelIdxs.length;
    var minX = width, maxX = 0, minY = Infinity, maxY = -1;
    var sumX = 0, sumY = 0, sumLumDiff = 0, sumColorDist = 0, sumEdge = 0;
    var i, px, py;
    for (i = 0; i < n; i++) {
      px = pixelIdxs[i] % width;
      py = Math.floor(pixelIdxs[i] / width);
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
      sumX += px; sumY += py;
      sumLumDiff += ctx.lumDiff[pixelIdxs[i]];
      sumColorDist += ctx.colorDist[pixelIdxs[i]];
      sumEdge += ctx.edgeMag[pixelIdxs[i]];
    }
    var cx = sumX / n, cy = sumY / n;
    var bboxW = maxX - minX + 1, bboxH = maxY - minY + 1;
    var bboxArea = bboxW * bboxH;
    var fillRatio = bboxArea > 0 ? n / bboxArea : 0;
    var longSide = Math.max(bboxW, bboxH), shortSide = Math.max(1, Math.min(bboxW, bboxH));
    var elongation = longSide / shortSide;
    var avgLumDiff = sumLumDiff / n;
    var avgColorDist = sumColorDist / n;
    var avgEdge = sumEdge / n;

    // 線状(しわ・筋)か、塊状(点・シミ)かを、細長さと充填率で判定する。
    var isLine = elongation >= 2.2 && fillRatio <= 0.55 && n >= 5;

    var shape;
    if (isLine) {
      // 主軸(長い方の辺)に沿ってバケツに分け、各バケツの中心座標を
      // つないだ折れ線を作る(先生のフリーハンドの線囲みに相当)。
      var horizontal = bboxW >= bboxH;
      var bucketCount = Math.max(3, Math.min(8, Math.round(longSide / 4)));
      var buckets = [];
      for (i = 0; i < bucketCount; i++) buckets.push({ sum: 0, sumOther: 0, count: 0 });
      for (i = 0; i < n; i++) {
        px = pixelIdxs[i] % width;
        py = Math.floor(pixelIdxs[i] / width);
        var mainVal = horizontal ? px : py;
        var otherVal = horizontal ? py : px;
        var mainMin = horizontal ? minX : minY;
        var mainSpan = Math.max(1, (horizontal ? bboxW : bboxH) - 1);
        var bi = Math.min(bucketCount - 1, Math.floor(((mainVal - mainMin) / mainSpan) * bucketCount));
        buckets[bi].sum += mainVal;
        buckets[bi].sumOther += otherVal;
        buckets[bi].count++;
      }
      var points = [];
      for (i = 0; i < buckets.length; i++) {
        if (!buckets[i].count) continue;
        var mainAvg = buckets[i].sum / buckets[i].count;
        var otherAvg = buckets[i].sumOther / buckets[i].count;
        points.push(horizontal ? { x: mainAvg, y: otherAvg } : { x: otherAvg, y: mainAvg });
      }
      // 主軸順に並んでいることを保証(バケツ順=主軸順なのでソート不要だが念のため)
      points.sort(function (a, b) { return horizontal ? a.x - b.x : a.y - b.y; });
      var strokeWidth = Math.max(1.5, Math.min(6, n / longSide));
      shape = { points: points, strokeWidth: strokeWidth };
    } else {
      // 塊: 中程度に細長い場合は楕円(目の下のクマ・涙袋のような横長の
      // シミ・くぼみを、無理に真円にしないため)、それ以外は外接円。
      var maxDist = 0;
      for (i = 0; i < n; i++) {
        px = pixelIdxs[i] % width;
        py = Math.floor(pixelIdxs[i] / width);
        var d = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
        if (d > maxDist) maxDist = d;
      }
      var isOval = elongation >= 1.4 && elongation < 2.2;
      if (isOval) {
        var rx = Math.max(2, (bboxW / 2) * 1.15 + 1);
        var ry = Math.max(2, (bboxH / 2) * 1.15 + 1);
        shape = { cx: cx, cy: cy, rx: rx, ry: ry };
      } else {
        var r = Math.max(2, maxDist * 1.15 + 1);
        shape = { cx: cx, cy: cy, r: r };
      }
    }

    return {
      kind: isLine ? 'line' : 'blob',
      shape: shape,
      area: n,
      bbox: { x: minX, y: minY, w: bboxW, h: bboxH },
      avgLumDiff: avgLumDiff,
      avgColorDist: avgColorDist,
      avgEdge: avgEdge,
    };
  }

  function buildNote(comp, ctx) {
    var notes = [];
    if (comp.avgLumDiff < -2) notes.push('周囲より暗い');
    else if (comp.avgLumDiff > 2) notes.push('周囲より明るい');
    var colorZ = comp.avgColorDist / Math.max(ctx.colorStats.std, 1e-6);
    if (colorZ > 1.2) notes.push('周囲と色味が異なる');
    var edgeZ = comp.avgEdge / Math.max(ctx.edgeStats.std, 1e-6);
    if (edgeZ > 1.3) notes.push('陰影の境目が明瞭(浮き上がり・へこみの可能性)');
    if (comp.kind === 'line') notes.unshift('線状のつながり(しわ・筋の候補)');
    else if (!notes.length) notes.push('周囲からわずかに浮いて見える領域');
    return notes.join('・');
  }

  // -----------------------------------------------------------------
  // メイン検出関数: 単一解像度での検出
  // -----------------------------------------------------------------

  function detectMarkings(imageData, options) {
    options = options || {};
    var ctx = computeSalienceContext(imageData, options);
    var width = ctx.width, height = ctx.height;
    var n = width * height;

    var thresholdK = typeof options.thresholdK === 'number' ? options.thresholdK : 1.35;
    var minArea = typeof options.minArea === 'number' ? options.minArea : Math.max(3, Math.round(n * 0.00015));
    var maxArea = typeof options.maxArea === 'number' ? options.maxArea : Math.round(n * 0.15);

    var visited = new Uint8Array(n);
    var comps = [];

    for (var idx = 0; idx < n; idx++) {
      if (visited[idx]) continue;
      if (ctx.salience[idx] < thresholdK) { visited[idx] = 1; continue; }

      var stack = [idx];
      visited[idx] = 1;
      var pixelIdxs = [];
      while (stack.length) {
        var cur = stack.pop();
        pixelIdxs.push(cur);
        var cx = cur % width, cy = (cur / width) | 0;
        var neighbors = [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]];
        for (var k = 0; k < neighbors.length; k++) {
          var nx = neighbors[k][0], ny = neighbors[k][1];
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          var nidx = ny * width + nx;
          if (visited[nidx]) continue;
          if (ctx.salience[nidx] < thresholdK) { visited[nidx] = 1; continue; }
          visited[nidx] = 1;
          stack.push(nidx);
        }
        if (pixelIdxs.length > n) break; // 安全弁
      }

      if (pixelIdxs.length >= minArea && pixelIdxs.length <= maxArea) {
        var comp = classifyAndShapeComponent(pixelIdxs, width, ctx);
        comps.push(comp);
      }
    }

    // スコア化: サリエンスの強さ(明度差・色差・エッジ)とサイズを合成し、
    // 0〜100に正規化する。線は面積が小さくなりがちなので長さも加味する。
    comps.forEach(function (c) {
      var lumZ = Math.abs(c.avgLumDiff) / Math.max(ctx.lumStats.std, 1e-6);
      var colorZ = c.avgColorDist / Math.max(ctx.colorStats.std, 1e-6);
      var edgeZ = c.avgEdge / Math.max(ctx.edgeStats.std, 1e-6);
      var sizeFactor = c.kind === 'line'
        ? Math.sqrt(Math.max(c.bbox.w, c.bbox.h))
        : Math.sqrt(c.area);
      var raw = (lumZ * 1.0 + colorZ * 0.8 + edgeZ * 0.6) * (1 + sizeFactor * 0.15);
      c.score = Math.max(1, Math.min(100, Math.round(raw * 8)));
      c.note = buildNote(c, ctx);
    });

    comps.sort(function (a, b) { return b.score - a.score; });

    var maxMarks = typeof options.maxMarks === 'number' ? options.maxMarks : 14;
    return comps.slice(0, maxMarks);
  }

  // -----------------------------------------------------------------
  // マルチスケール探索: 複数解像度に縮小して検出し、元画像の座標系に
  // 統合する(小さい起伏も大きい起伏も両方拾える可能性を上げるため)。
  // -----------------------------------------------------------------

  function resizeImageDataBoxAverage(imageData, maxDim) {
    var srcW = imageData.width, srcH = imageData.height;
    var scale = Math.min(1, maxDim / Math.max(srcW, srcH));
    var dstW = Math.max(1, Math.round(srcW * scale));
    var dstH = Math.max(1, Math.round(srcH * scale));
    if (dstW >= srcW && dstH >= srcH) return imageData;

    var srcData = imageData.data;
    var dstData = new Uint8ClampedArray(dstW * dstH * 4);
    for (var dy = 0; dy < dstH; dy++) {
      var sy0 = Math.floor(dy * srcH / dstH);
      var sy1 = Math.max(sy0 + 1, Math.floor((dy + 1) * srcH / dstH));
      for (var dx = 0; dx < dstW; dx++) {
        var sx0 = Math.floor(dx * srcW / dstW);
        var sx1 = Math.max(sx0 + 1, Math.floor((dx + 1) * srcW / dstW));
        var rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
        for (var sy = sy0; sy < sy1 && sy < srcH; sy++) {
          for (var sx = sx0; sx < sx1 && sx < srcW; sx++) {
            var sidx = (sy * srcW + sx) * 4;
            rSum += srcData[sidx]; gSum += srcData[sidx + 1]; bSum += srcData[sidx + 2]; aSum += srcData[sidx + 3];
            count++;
          }
        }
        var didx = (dy * dstW + dx) * 4;
        if (count > 0) {
          dstData[didx] = rSum / count; dstData[didx + 1] = gSum / count;
          dstData[didx + 2] = bSum / count; dstData[didx + 3] = aSum / count;
        }
      }
    }
    return { data: dstData, width: dstW, height: dstH };
  }

  function shallowMerge(base, extra) {
    var out = {}, k;
    if (base) for (k in base) if (base.hasOwnProperty(k)) out[k] = base[k];
    if (extra) for (k in extra) if (extra.hasOwnProperty(k)) out[k] = extra[k];
    return out;
  }

  function markingCenter(m) {
    if (m.kind === 'line') {
      var pts = m.shape.points;
      var mid = pts[Math.floor(pts.length / 2)] || pts[0];
      return mid;
    }
    return { x: m.shape.cx, y: m.shape.cy };
  }

  function scaleMarking(m, sx, sy) {
    var out = shallowMerge(m, {});
    if (m.kind === 'line') {
      out.shape = {
        points: m.shape.points.map(function (p) { return { x: p.x * sx, y: p.y * sy }; }),
        strokeWidth: m.shape.strokeWidth * ((sx + sy) / 2),
      };
    } else if (typeof m.shape.rx === 'number') {
      out.shape = { cx: m.shape.cx * sx, cy: m.shape.cy * sy, rx: m.shape.rx * sx, ry: m.shape.ry * sy };
    } else {
      out.shape = { cx: m.shape.cx * sx, cy: m.shape.cy * sy, r: m.shape.r * ((sx + sy) / 2) };
    }
    if (m.bbox) {
      out.bbox = {
        x: m.bbox.x * sx, y: m.bbox.y * sy,
        w: m.bbox.w * sx, h: m.bbox.h * sy,
      };
    }
    return out;
  }

  function findMarkingsMultiScale(imageData, options) {
    options = options || {};
    var scales = options.scales || [160, 240, 320];
    var maxMarks = typeof options.maxMarks === 'number' ? options.maxMarks : 14;
    var width = imageData.width, height = imageData.height;

    var all = [];
    var doneDims = {};
    scales.forEach(function (maxDim) {
      var scaled = resizeImageDataBoxAverage(imageData, maxDim);
      var dimKey = scaled.width + 'x' + scaled.height;
      if (doneDims[dimKey]) return;
      doneDims[dimKey] = true;
      if (scaled.width < 16 || scaled.height < 16) return;

      var sx = width / scaled.width, sy = height / scaled.height;
      var perScaleOptions = shallowMerge(options, { maxMarks: maxMarks * 2 });
      var found = detectMarkings(scaled, perScaleOptions);
      found.forEach(function (m) {
        var mapped = scaleMarking(m, sx, sy);
        mapped.scale = maxDim;
        all.push(mapped);
      });
    });

    all.sort(function (a, b) { return b.score - a.score; });

    var tolX = width * 0.04, tolY = height * 0.04;
    var deduped = [];
    all.forEach(function (m) {
      var c = markingCenter(m);
      var overlaps = deduped.some(function (d) {
        var dc = markingCenter(d);
        return Math.abs(dc.x - c.x) < tolX && Math.abs(dc.y - c.y) < tolY && d.kind === m.kind;
      });
      if (!overlaps) deduped.push(m);
    });

    return deduped.slice(0, maxMarks).map(function (m, i) { m.id = i; return m; });
  }

  return {
    toGrayscale: toGrayscale,
    boxBlur: boxBlur,
    sobelMagnitude: sobelMagnitude,
    computeSalienceContext: computeSalienceContext,
    detectMarkings: detectMarkings,
    resizeImageDataBoxAverage: resizeImageDataBoxAverage,
    findMarkingsMultiScale: findMarkingsMultiScale,
  };
});
