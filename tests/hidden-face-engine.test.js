var Engine = require('../app/hidden-face-engine.js');

var pass = 0, fail = 0;
function check(label, cond) {
  if (cond) { pass++; console.log('OK   ' + label); }
  else { fail++; console.log('FAIL ' + label); }
}

var sampleWithGeometry = {
  detection_id: 'det-0001',
  user_selected: true,
  detected_feature: {
    location: 'right_cheek',
    abstract_components: {
      eyes: 'two_dots',
      hair_line: 'top_hair_line',
      nose: 'triangle_nose',
      mouth: 'horizontal_line',
    },
    facing_direction: 'outward',
    clarity_score: 0.72,
  },
  area_attribute: {
    palace_name: '夫妻宮',
    domain_category: 'romance',
  },
  geometry: { x: 120, y: 96, width: 24, height: 24 },
};

// --- Test 1: geometryありの場合、描画指示が生成される(最優先タスク)
var reportWithGeometry = Engine.buildAbstractGansouReport(sampleWithGeometry);
check('drawInstructionが存在する', !!reportWithGeometry.drawInstruction);
check('geometryありの場合はavailable=true', reportWithGeometry.drawInstruction.available === true);
check('中心座標xが正しい', reportWithGeometry.drawInstruction.x === 120);
check('中心座標yが正しい', reportWithGeometry.drawInstruction.y === 96);
check('既定半径は20px', reportWithGeometry.drawInstruction.radius === 20);
check('canvasコードにarcが含まれる', reportWithGeometry.drawInstruction.code.indexOf('ctx.arc(120, 96, 20') !== -1);
check('canvasコードに赤円の指定が含まれる', reportWithGeometry.drawInstruction.code.indexOf('strokeStyle = "red"') !== -1);

// --- Test 2: geometryが欠けている場合、「描画できない」ことを明示する
var sampleNoGeometry = JSON.parse(JSON.stringify(sampleWithGeometry));
delete sampleNoGeometry.geometry;
var reportNoGeometry = Engine.buildAbstractGansouReport(sampleNoGeometry);
check('geometryなしの場合はavailable=false', reportNoGeometry.drawInstruction.available === false);
check('geometryなしの場合はcodeがnull', reportNoGeometry.drawInstruction.code === null);
check('geometryなしの場合は不足メッセージを含む', reportNoGeometry.drawInstruction.message.indexOf('座標が不足しているため描画できません') !== -1);

// --- Test 3: geometry.x/yが数値でない(壊れたデータ)場合も安全に「描画不可」を返す
var sampleBadGeometry = JSON.parse(JSON.stringify(sampleWithGeometry));
sampleBadGeometry.geometry = { x: 'abc', y: null };
var reportBadGeometry = Engine.buildAbstractGansouReport(sampleBadGeometry);
check('x/yが不正な型の場合もavailable=false', reportBadGeometry.drawInstruction.available === false);

// --- Test 4: markRadiusで半径を上書きできる
var sampleCustomRadius = JSON.parse(JSON.stringify(sampleWithGeometry));
sampleCustomRadius.markRadius = 35;
var reportCustomRadius = Engine.buildAbstractGansouReport(sampleCustomRadius);
check('markRadius指定時はその半径が使われる', reportCustomRadius.drawInstruction.radius === 35);
check('カスタム半径がcanvasコードに反映される', reportCustomRadius.drawInstruction.code.indexOf(', 35, 0, Math.PI * 2') !== -1);

// --- Test 5: 相学ロジック(十二宮・向き・鮮明度)は従来通り動作する
check('検出部位が右頬と解釈される', reportWithGeometry.location === '右頬');
check('相学的位置が夫妻宮と解釈される', reportWithGeometry.palaceName === '夫妻宮');
check('向きがoutward→外向きと解釈される', reportWithGeometry.direction === '外向き');
check('鮮明度スコアがそのまま保持される', reportWithGeometry.clarityScore === 0.72);
check('総合診断メッセージに免責文言が含まれる', reportWithGeometry.message.indexOf('あくまで伝統的な言い伝え') !== -1);

// --- Test 6: 入力が空でもクラッシュしない
var emptyReport = Engine.buildAbstractGansouReport({});
check('空入力でもレポートを生成できる', typeof emptyReport.message === 'string' && emptyReport.message.length > 0);
check('空入力ではdrawInstructionがavailable=false', emptyReport.drawInstruction.available === false);

console.log('\n合計: ' + pass + ' 成功 / ' + fail + ' 失敗');
process.exit(fail > 0 ? 1 : 0);
