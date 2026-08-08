var Det = require('../app/hidden-face-detector.js');

function makeSkinCanvas(w, h, skinRGB, bgRGB) {
  var data = new Uint8ClampedArray(w * h * 4);
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var idx = (y * w + x) * 4;
      // 中央70%を肌色領域、周囲を背景色にする(髪・服・背景を模す)
      var inSkin = x > w * 0.15 && x < w * 0.85 && y > h * 0.1 && y < h * 0.9;
      var rgb = inSkin ? skinRGB : bgRGB;
      data[idx] = rgb[0]; data[idx + 1] = rgb[1]; data[idx + 2] = rgb[2]; data[idx + 3] = 255;
    }
  }
  return { data: data, width: w, height: h };
}

function drawDot(img, cx, cy, r, gray) {
  var w = img.width;
  for (var y = -r; y <= r; y++) {
    for (var x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      var px = cx + x, py = cy + y;
      if (px < 0 || py < 0 || px >= w || py >= img.height) continue;
      var idx = (py * w + px) * 4;
      img.data[idx] = gray; img.data[idx + 1] = gray; img.data[idx + 2] = gray;
    }
  }
}

function drawHLine(img, x1, x2, y, gray) {
  var w = img.width;
  for (var x = x1; x <= x2; x++) {
    var idx = (y * w + x) * 4;
    img.data[idx] = gray; img.data[idx + 1] = gray; img.data[idx + 2] = gray;
  }
  // support row for line continuity
  for (var x2b = x1; x2b <= x2; x2b++) {
    var idx2 = ((y + 1) * w + x2b) * 4;
    img.data[idx2] = gray; img.data[idx2 + 1] = gray; img.data[idx2 + 2] = gray;
  }
}

function drawHair(img, x, y1, y2, gray) {
  var w = img.width;
  for (var y = y1; y <= y2; y++) {
    var idx = (y * w + x) * 4;
    img.data[idx] = gray; img.data[idx + 1] = gray; img.data[idx + 2] = gray;
  }
}

var pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; console.log('OK   ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

// --- Test 1: skin-colored face photo with a clear "eyes+mouth" pareidolia
// pattern inside the skin region, plus hair-like thin streaks and a
// dark blob in the background (outside skin) that should NOT be picked up.
var skinRGB = [210, 170, 140]; // 典型的な肌色寄りのRGB
var bgRGB = [20, 20, 20];      // 背景(暗い服・影を想定)
var w = 120, h = 120;
var img1 = makeSkinCanvas(w, h, skinRGB, bgRGB);
drawDot(img1, 40, 50, 4, 30);
drawDot(img1, 80, 50, 4, 30);
drawHLine(img1, 50, 70, 75, 40);
// hair-like thin vertical streaks near top of skin region (should be filtered by fillRatio/aspect)
drawHair(img1, 30, 20, 40, 25);
drawHair(img1, 90, 20, 40, 25);
// a stray dark blob far in the background corner (outside skin bbox) that
// should be excluded by the skin-region restriction
drawDot(img1, 5, 5, 4, 10);

var candidates1 = Det.findFaceCandidates(img1, { maxCandidates: 5 });
check('検出できる(点+線パターン)', candidates1.length > 0);
if (candidates1.length) {
  var top = candidates1[0];
  check('目の位置がだいたい正しい(左)', Math.abs(top.points.eyeLeft.x - 40) < 8);
  check('目の位置がだいたい正しい(右)', Math.abs(top.points.eyeRight.x - 80) < 8);
  check('口の位置がだいたい正しい', Math.abs(top.points.mouth.y - 75) < 8);
}

// --- Test 2: skin region restriction — background-only blob pair (both
// blobs entirely outside the skin bbox, in the corner) should not survive
// once a valid skin region is found, even though geometrically it might
// look like eyes.
var img2 = makeSkinCanvas(140, 140, skinRGB, bgRGB);
// two dots entirely in the excluded background corner (top-left, small area)
drawDot(img2, 4, 4, 2, 30);
drawDot(img2, 10, 4, 2, 30);
var skinRegion2 = Det.computeSkinRegion(img2);
check('肌色領域が検出される', skinRegion2.used === true);
check('背景の隅は肌色領域の外', skinRegion2.x1 > 4);

// --- Test 3: fallback when skin detection is unreliable (e.g. a mostly
// uniform gray image with no skin-like colors at all) — should not crash
// and should fall back to searching the whole image.
var w3 = 100, h3 = 100;
var img3 = { data: new Uint8ClampedArray(w3 * h3 * 4), width: w3, height: h3 };
for (var p = 0; p < w3 * h3; p++) {
  var idx3 = p * 4;
  img3.data[idx3] = 128; img3.data[idx3 + 1] = 128; img3.data[idx3 + 2] = 128; img3.data[idx3 + 3] = 255;
}
drawDot(img3, 35, 40, 4, 40);
drawDot(img3, 65, 40, 4, 40);
drawHLine(img3, 42, 58, 60, 60);
var region3 = Det.computeSkinRegion(img3);
check('肌色なし画像はフォールバック(全体探索)', region3.used === false);
var candidates3 = Det.findFaceCandidates(img3, { maxCandidates: 5 });
check('肌色なし画像でもフォールバックで検出できる', candidates3.length > 0);

// --- Test 4: pure noise image should not produce spurious high-confidence
// candidates as easily as before (shape/roundness filter should reject
// most single-pixel noise specks from being treated as blobs of area>=3
// contiguous, and random noise rarely forms coherent blob+line geometry).
var w4 = 80, h4 = 80;
var img4 = { data: new Uint8ClampedArray(w4 * h4 * 4), width: w4, height: h4 };
var seed = 42;
function rand() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
for (var p4 = 0; p4 < w4 * h4; p4++) {
  var idx4 = p4 * 4;
  var v = Math.round(100 + rand() * 100);
  img4.data[idx4] = v; img4.data[idx4 + 1] = v; img4.data[idx4 + 2] = v; img4.data[idx4 + 3] = 255;
}
var candidatesNoise = Det.findFaceCandidates(img4, { maxCandidates: 5 });
console.log('ノイズ画像での検出数(参考値、0や少数が望ましい): ' + candidatesNoise.length);

// --- Test 5: existing low-level functions still behave sanely
var blurred = Det.boxBlur(Det.toGrayscale(img1), w, h, 1);
check('boxBlurが配列を返す', blurred.length === w * h);
var stats = Det.meanStd(blurred);
check('meanStdが妥当な値を返す', stats.mean > 0 && stats.std >= 0);

console.log('\n合計: ' + pass + ' 成功 / ' + fail + ' 失敗');

// ===========================================================================
// 可能性拡張版: 局所標準偏差・マルチスケール探索・肌色マスキングOFFのテスト
// ===========================================================================

// --- Test 6: 局所標準偏差が「明暗のコントラストが場所によって違う画像」で
// それぞれの領域に応じた値になること(左半分は平坦、右半分は起伏あり)
var w6 = 100, h6 = 100;
var img6 = { data: new Uint8ClampedArray(w6 * h6 * 4), width: w6, height: h6 };
var seed6 = 7;
function rand6() { seed6 = (seed6 * 1103515245 + 12345) & 0x7fffffff; return seed6 / 0x7fffffff; }
for (var y6 = 0; y6 < h6; y6++) {
  for (var x6 = 0; x6 < w6; x6++) {
    var idx6 = (y6 * w6 + x6) * 4;
    var v6 = x6 < w6 / 2 ? 128 : Math.round(80 + rand6() * 140); // 左:平坦 右:起伏大
    img6.data[idx6] = v6; img6.data[idx6 + 1] = v6; img6.data[idx6 + 2] = v6; img6.data[idx6 + 3] = 255;
  }
}
var ctx6 = Det.buildContext(img6, { skinMask: false });
var stdFlat = Det.localStd(ctx6.integral, ctx6.integralSq, w6, h6, 20, 50, 10, ctx6.stdFloor);
var stdNoisy = Det.localStd(ctx6.integral, ctx6.integralSq, w6, h6, 80, 50, 10, ctx6.stdFloor);
check('平坦な領域の局所標準偏差は下限(stdFloor)に近い', Math.abs(stdFlat - ctx6.stdFloor) < 1);
check('起伏のある領域の局所標準偏差は平坦な領域より大きい', stdNoisy > stdFlat);

// --- Test 7: resizeImageDataBoxAverage が正しい寸法・平均色になること
var w7 = 40, h7 = 20;
var img7 = { data: new Uint8ClampedArray(w7 * h7 * 4), width: w7, height: h7 };
for (var p7 = 0; p7 < w7 * h7; p7++) {
  var idx7 = p7 * 4;
  img7.data[idx7] = 100; img7.data[idx7 + 1] = 150; img7.data[idx7 + 2] = 200; img7.data[idx7 + 3] = 255;
}
var resized7 = Det.resizeImageDataBoxAverage(img7, 20);
check('縮小後の幅が長辺基準で正しい', resized7.width === 20);
check('縮小後の高さがアスペクト比を保っている', resized7.height === 10);
check('均一な色の画像は縮小してもほぼ同じ色になる', Math.abs(resized7.data[0] - 100) <= 1 && Math.abs(resized7.data[1] - 150) <= 1);
var resizedNoop = Det.resizeImageDataBoxAverage(img7, 1000);
check('拡大が必要なmaxDimでは等倍のまま返す', resizedNoop.width === w7 && resizedNoop.height === h7);

// --- Test 8: findFaceCandidatesMultiScale が単一スケール探索と同様に
// 点+線パターンを検出でき、座標が元画像の座標系になっていること
var w8 = 200, h8 = 200;
var img8 = { data: new Uint8ClampedArray(w8 * h8 * 4), width: w8, height: h8 };
for (var p8 = 0; p8 < w8 * h8; p8++) {
  var idx8 = p8 * 4;
  img8.data[idx8] = 200; img8.data[idx8 + 1] = 170; img8.data[idx8 + 2] = 150; img8.data[idx8 + 3] = 255;
}
drawDot(img8, 70, 80, 6, 30);
drawDot(img8, 130, 80, 6, 30);
drawHLine(img8, 85, 115, 120, 40);
var multiCandidates = Det.findFaceCandidatesMultiScale(img8, { maxCandidates: 5, scales: [100, 200] });
check('マルチスケール探索でも点+線パターンが検出できる', multiCandidates.length > 0);
if (multiCandidates.length) {
  check('マルチスケール探索の座標が元画像スケールに変換されている(目の間隔が概ね60px)',
    Math.abs((multiCandidates[0].points.eyeRight.x - multiCandidates[0].points.eyeLeft.x) - 60) < 25);
}

// --- Test 9: skinMask:false を指定すると、肌色でない画像(木目・岩肌等を
// 想定した非肌色の一様な背景)でも点+線パターンが検出できること
// (肌色マスキングは実写真向けの機能で、一般的なパレイドリア探索では
// 無効化できることの確認)
var w9 = 120, h9 = 120;
var img9 = { data: new Uint8ClampedArray(w9 * h9 * 4), width: w9, height: h9 };
for (var p9 = 0; p9 < w9 * h9; p9++) {
  var idx9 = p9 * 4;
  // 木目調の茶色っぽいが肌色判定には入らない色味を想定
  img9.data[idx9] = 90; img9.data[idx9 + 1] = 60; img9.data[idx9 + 2] = 30; img9.data[idx9 + 3] = 255;
}
drawDot(img9, 40, 50, 4, 15);
drawDot(img9, 80, 50, 4, 15);
drawHLine(img9, 50, 70, 75, 18);
var skinRegion9 = Det.computeSkinRegion(img9);
var noSkinMaskCandidates = Det.findFaceCandidates(img9, { maxCandidates: 5, skinMask: false });
check('非肌色画像でもskinMask:falseで点+線パターンが検出できる', noSkinMaskCandidates.length > 0);

// --- Test 10〜13: splitObviousRealFace() ---
// 「本物の目・口を指すだけの、当たり前の指摘になってしまう」問題への
// 対応関数のテスト。画像中央・大きめの目間隔の候補が「本物の顔らしい」
// と判定され、隅にある小さな候補群が「隠れ相候補」として残ることを確認。
var imgSize = { width: 300, height: 300 };
var centerBig = { points: { eyeLeft: { x: 120, y: 140 }, eyeRight: { x: 180, y: 140 }, mouth: { x: 150, y: 170 } }, score: 80 };
var cornerSmall1 = { points: { eyeLeft: { x: 20, y: 20 }, eyeRight: { x: 35, y: 20 }, mouth: { x: 27, y: 30 } }, score: 60 };
var cornerSmall2 = { points: { eyeLeft: { x: 260, y: 270 }, eyeRight: { x: 275, y: 270 }, mouth: { x: 267, y: 280 } }, score: 55 };

var split10 = Det.splitObviousRealFace([centerBig, cornerSmall1, cornerSmall2], imgSize);
check('splitObviousRealFaceは中央・大きい候補をobviousと判定する', !!split10.obvious && split10.obvious === centerBig);
check('splitObviousRealFaceはobvious以外をhiddenとして返す', split10.hidden.length === 2 &&
  split10.hidden.indexOf(cornerSmall1) !== -1 && split10.hidden.indexOf(cornerSmall2) !== -1);

var split11 = Det.splitObviousRealFace([], imgSize);
check('splitObviousRealFaceは空配列でobvious=null・hidden=[]を返す', split11.obvious === null && split11.hidden.length === 0);

var split12 = Det.splitObviousRealFace([cornerSmall1], imgSize);
check('splitObviousRealFaceは候補が1件だけならobviousを立てずhiddenのみ返す(誤って唯一の候補を除外しない)',
  split12.obvious === null && split12.hidden.length === 1);

console.log('\n合計(拡張分含む): ' + pass + ' 成功 / ' + fail + ' 失敗');
process.exit(fail > 0 ? 1 : 0);
