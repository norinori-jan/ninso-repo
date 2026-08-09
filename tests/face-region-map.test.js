var M = require('../app/face-region-map.js');

var pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; console.log('OK   ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

// --- 基本: 中心付近(命宮)が正しく判定される ---
var glabella = M.findNearestRegion(0.5, 0.36);
check('顔の中心(眉間)は命宮と判定される', glabella && glabella.name === '命宮');

// --- 顎先(地閣)が正しく判定される ---
var chin = M.findNearestRegion(0.5, 0.97);
check('顔の下端中央は地閣と判定される', chin && chin.name === '地閣');

// --- 右目尻付近(夫婦)が正しく判定される ---
var rightEyeCorner = M.findNearestRegion(0.78, 0.42);
check('右目尻付近は夫婦と判定される', rightEyeCorner && rightEyeCorner.name === '夫婦');

// --- 範囲外の値でもクラッシュせず、最寄りの部位を返す ---
var outOfRange = M.findNearestRegion(-0.2, 1.5);
check('範囲外座標でもクラッシュせず何らかの部位を返す', outOfRange && typeof outOfRange.name === 'string');

// --- 不正な入力(NaN・文字列)ではnullを返す ---
check('数値でない入力はnullを返す(x)', M.findNearestRegion('a', 0.5) === null);
check('数値でない入力はnullを返す(y)', M.findNearestRegion(0.5, undefined) === null);
check('NaNはnullを返す', M.findNearestRegion(NaN, 0.5) === null);

// --- 各部位にmeaningが設定されている ---
check('全ての部位にmeaningが設定されている', M.REGIONS.every(function (r) { return typeof r.meaning === 'string' && r.meaning.length > 0; }));

// --- 各部位の矩形が妥当な範囲(0〜1)にある ---
check('全ての部位の矩形が0〜1の範囲に収まっている', M.REGIONS.every(function (r) {
  return r.x0 >= 0 && r.x1 <= 1 && r.y0 >= 0 && r.y1 <= 1 && r.x0 < r.x1 && r.y0 < r.y1;
}));

console.log('\n合計: ' + pass + ' 成功 / ' + fail + ' 失敗');
process.exit(fail > 0 ? 1 : 0);
