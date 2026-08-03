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
process.exit(fail > 0 ? 1 : 0);
