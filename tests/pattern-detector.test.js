var PD = require('../app/pattern-detector.js');

var pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; console.log('OK   ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

function makeImg(w, h, bgRGB) {
  var data = new Uint8ClampedArray(w * h * 4);
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var idx = (y * w + x) * 4;
      data[idx] = bgRGB[0]; data[idx + 1] = bgRGB[1]; data[idx + 2] = bgRGB[2]; data[idx + 3] = 255;
    }
  }
  return { data: data, width: w, height: h };
}

function drawDot(img, cx, cy, r, rgb) {
  var w = img.width;
  for (var y = -r; y <= r; y++) {
    for (var x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      var px = cx + x, py = cy + y;
      if (px < 0 || py < 0 || px >= w || py >= img.height) continue;
      var idx = (py * w + px) * 4;
      img.data[idx] = rgb[0]; img.data[idx + 1] = rgb[1]; img.data[idx + 2] = rgb[2];
    }
  }
}

function drawLine(img, x1, y1, x2, y2, rgb, thickness) {
  var steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (var i = 0; i <= steps; i++) {
    var t = steps ? i / steps : 0;
    var x = Math.round(x1 + (x2 - x1) * t), y = Math.round(y1 + (y2 - y1) * t);
    drawDot(img, x, y, thickness, rgb);
  }
}

// --- Test 1: 完全に均一な画像では何も検出しない(過検出しない) ---
var uniform = makeImg(100, 100, [60, 60, 60]);
var uniformMarks = PD.findMarkingsMultiScale(uniform, { scales: [80, 100] });
check('均一な画像では誤検出が(ほぼ)無い', uniformMarks.length === 0);

// --- Test 2: 目・口の幾何配置に一致しない画像(ネクタイ的な柄)でも
// 複数の候補が見つかる(固定テンプレートに依存しないことの確認) ---
var tie = makeImg(200, 260, [25, 35, 60]);
drawLine(tie, 60, 20, 140, 240, [70, 90, 120], 3); // 斜めのハイライト筋
drawDot(tie, 150, 80, 6, [140, 40, 40]);           // 色味の違う斑点
drawDot(tie, 60, 180, 5, [10, 10, 10]);            // 暗い斑点
var tieMarks = PD.findMarkingsMultiScale(tie, { scales: [100, 160, 200], maxMarks: 14 });
check('目・口配置でない画像でも複数候補が見つかる(1件だけに留まらない)', tieMarks.length >= 2);
check('線状パターンが少なくとも1件検出される', tieMarks.some(function (m) { return m.kind === 'line'; }));
check('塊状パターンが少なくとも1件検出される', tieMarks.some(function (m) { return m.kind === 'blob'; }));

// --- Test 3: 色だけが違う(明度はほぼ同じ)パッチも拾える ---
var colorOnly = makeImg(120, 120, [120, 120, 120]);
drawDot(colorOnly, 60, 60, 8, [150, 90, 90]); // 明度は近いが色味が違う
var colorMarks = PD.findMarkingsMultiScale(colorOnly, { scales: [100, 120] });
check('明度がほぼ同じでも色味が違えば検出される', colorMarks.length > 0);
if (colorMarks.length) {
  check('色味の違いがnoteに含まれる', colorMarks.some(function (m) { return m.note.indexOf('色味') !== -1; }));
}

// --- Test 4: 各候補が固定の「目/口」ラベルではなく、汎用的な形状情報を持つ ---
if (tieMarks.length) {
  var m0 = tieMarks[0];
  check('候補がkind(blob/line)を持つ', m0.kind === 'blob' || m0.kind === 'line');
  check('候補がスコアを持つ', typeof m0.score === 'number');
  check('候補が座標情報(shape)を持つ', !!m0.shape);
  check('eyeLeft/eyeRight/mouthのような固定パーツ名を持たない', !m0.points || (!m0.points.eyeLeft && !m0.points.eyeRight));
}

// --- Test 5: マルチスケールでも画像座標系に正しくマッピングされる(座標が画像範囲内) ---
if (tieMarks.length) {
  var within = tieMarks.every(function (m) {
    var c = m.kind === 'blob' ? { x: m.shape.cx, y: m.shape.cy } : m.shape.points[0];
    return c.x >= -5 && c.x <= tie.width + 5 && c.y >= -5 && c.y <= tie.height + 5;
  });
  check('検出座標が画像範囲内にマッピングされている', within);
}

// --- Test 6: 横長の楕円状の色ムラ(目の下のクマのような形)は楕円として
// 出力される(真円に押し込めない) ---
var ovalImg = makeImg(160, 120, [180, 150, 130]);
// 横長の楕円を塗る(幅24 x 高さ10 程度)
for (var oy = -5; oy <= 5; oy++) {
  for (var ox = -12; ox <= 12; ox++) {
    if ((ox * ox) / (12 * 12) + (oy * oy) / (5 * 5) <= 1) {
      var px2 = 80 + ox, py2 = 60 + oy;
      var idx2 = (py2 * 160 + px2) * 4;
      ovalImg.data[idx2] = 120; ovalImg.data[idx2 + 1] = 90; ovalImg.data[idx2 + 2] = 90;
    }
  }
}
var ovalMarks = PD.findMarkingsMultiScale(ovalImg, { scales: [120, 160], thresholdK: 1.0 });
var ovalBlob = ovalMarks.filter(function (m) { return m.kind === 'blob'; })[0];
check('横長の色ムラが塊として検出される', !!ovalBlob);
if (ovalBlob) {
  check('中程度に細長い塊は楕円(rx/ry)として出力される', typeof ovalBlob.shape.rx === 'number' && typeof ovalBlob.shape.ry === 'number');
}

console.log('\n合計: ' + pass + ' 成功 / ' + fail + ' 失敗');
process.exit(fail > 0 ? 1 : 0);
