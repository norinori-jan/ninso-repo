var Reader = require('../app/autonomous-face-reader.js');

var pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; console.log('OK   ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

function makeUniformImage(w, h, rgb) {
  var data = new Uint8ClampedArray(w * h * 4);
  for (var p = 0; p < w * h; p++) {
    var idx = p * 4;
    data[idx] = rgb[0]; data[idx + 1] = rgb[1]; data[idx + 2] = rgb[2]; data[idx + 3] = 255;
  }
  return { data: data, width: w, height: h };
}

// --- Test 1: 真っ暗な均一画像 → 明るさ「暗い」、彩度・対称性・起伏は低め
var darkImg = makeUniformImage(60, 60, [10, 10, 10]);
var darkFeatures = Reader.computeGlobalFeatures(darkImg);
check('暗い画像のavgBrightnessが低い', darkFeatures.avgBrightness < 30);
check('均一画像は対称性スコアが低い(ほぼ0)', darkFeatures.asymmetryScore === 0);
check('均一画像は起伏スコアが低い(ほぼ0)', darkFeatures.tensionScore === 0);
var darkReport = Reader.buildAutonomousGansouReport(darkFeatures);
check('暗い画像のレポートで明るさが「暗い」と判定される', darkReport.summary.brightness === '暗い');
check('レポートに限界注記(表情筋・視線は検出していない旨)が含まれる', darkReport.message.indexOf('視線の方向そのものを検出しているわけではなく') !== -1);

// --- Test 2: 明るい均一画像
var brightImg = makeUniformImage(60, 60, [230, 230, 230]);
var brightReport = Reader.analyzeImageAutonomously(brightImg);
check('明るい画像のレポートで明るさが「明るい」と判定される', brightReport.summary.brightness === '明るい');

// --- Test 3: 暖色(赤み)寄りの画像 → 暖色寄りと判定される
var warmImg = makeUniformImage(60, 60, [220, 120, 80]);
var warmFeatures = Reader.computeGlobalFeatures(warmImg);
var warmReport = Reader.buildAutonomousGansouReport(warmFeatures);
check('暖色画像が暖色寄りと判定される', warmReport.summary.color === '暖色寄り');

// --- Test 4: 寒色(青み)寄りの画像
var coolImg = makeUniformImage(60, 60, [80, 120, 220]);
var coolReport = Reader.analyzeImageAutonomously(coolImg);
check('寒色画像が寒色寄りと判定される', coolReport.summary.color === '寒色寄り');

// --- Test 5: 左右非対称な画像(左半分が明るい・右半分が暗い)
// → asymmetryScoreが高くなり、光の左右差(lightBias.horizontal)も検出される
var w5 = 80, h5 = 80;
var asymImg = { data: new Uint8ClampedArray(w5 * h5 * 4), width: w5, height: h5 };
for (var y = 0; y < h5; y++) {
  for (var x = 0; x < w5; x++) {
    var idx = (y * w5 + x) * 4;
    var v = x < w5 / 2 ? 220 : 30;
    asymImg.data[idx] = v; asymImg.data[idx + 1] = v; asymImg.data[idx + 2] = v; asymImg.data[idx + 3] = 255;
  }
}
var asymFeatures = Reader.computeGlobalFeatures(asymImg);
check('左右非対称な画像はasymmetryScoreが高い', asymFeatures.asymmetryScore > 60);
check('左が明るい画像はlightBias.horizontalが正', asymFeatures.lightBias.horizontal > 0);

// --- Test 6: 空(0x0)画像でもクラッシュしない
var emptyImg = { data: new Uint8ClampedArray(0), width: 0, height: 0 };
var emptyFeatures = Reader.computeGlobalFeatures(emptyImg);
check('0x0画像でもクラッシュしない', emptyFeatures.avgBrightness === 0);
var emptyReport = Reader.buildAutonomousGansouReport(emptyFeatures);
check('0x0画像でもレポートを生成できる', typeof emptyReport.message === 'string' && emptyReport.message.length > 0);

console.log('\n合計: ' + pass + ' 成功 / ' + fail + ' 失敗');
process.exit(fail > 0 ? 1 : 0);
