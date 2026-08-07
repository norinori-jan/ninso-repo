/**
 * app/hidden-face-engine.js
 * 「願相(隠れ相)」検出・解釈エンジン(純粋ロジック層。DOMに依存しない)。
 *
 * 設計方針(docs/GANSOU_ROADMAP.md 参照):
 *   - このファイルは「検出そのもの」ではなく「解釈」を担当する。
 *   - 検出(座標のマーキング)は app.js 側のUIで人間が行い、
 *     ここではその座標から幾何学的なスコア・向きを計算し、
 *     位置・種類・向き・数から心理的な意味づけ文を組み立てる。
 *   - 将来、実際の画像認識(ML)で検出を自動化する場合も、
 *     「検出結果 → このエンジンの入力形式」に変換するアダプタを
 *     用意すればよく、解釈ロジックはそのまま再利用できる設計にしている。
 *
 * ブラウザ: window.HiddenFaceEngine として公開。
 * Node(テスト用): module.exports で公開。
 */

(function (root, factory) {
  var mod = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = mod;
  }
  if (root) {
    root.HiddenFaceEngine = mod;
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // -----------------------------------------------------------------
  // 位置(願相が検出された領域) → 心理的意味
  // -----------------------------------------------------------------
  var POSITION_MEANINGS = {
    '右目の下': '感情面・直近の心配事に関わる暗示とされる位置です。涙堂に近く、身近な人間関係の機微が表れやすいとされます。',
    '左目の下': '感情面・身内との関係に関わる暗示とされる位置です。伝統的に、古くからの関係や家庭内の機微が表れやすいとされます。',
    '額': '思考・プレッシャー・目上との関係に関わる暗示とされる位置です。',
    'ほほ': '対人関係・社会的な立場・世間からの評価に関わる暗示とされる位置です。',
    '口の横': '言葉・発言・コミュニケーション上の摩擦や本音に関わる暗示とされる位置です。',
    '顎': '晩年の心配事・家庭・生活基盤の安定性に関わる暗示とされる位置です。',
  };

  var POSITION_LIST = Object.keys(POSITION_MEANINGS);

  // -----------------------------------------------------------------
  // 向き(実際の顔の中心を基準とした相対方向) → 心理的意味
  //
  // ユーザー提示の発想: 願相の向きが顔の中心から逆(外向き)なら
  // 「反対意見・敵対」、中心を向く(内向き)なら「内省・身内寄り」。
  // -----------------------------------------------------------------
  var ORIENTATION_MEANINGS = {
    '内向き': '顔の中心の方を向いているため、自己内省・内なる葛藤・身内からの影響・隠れた本音を示すとされます。',
    '外向き': '顔の中心から外側(逆方向)を向いているため、対外的な反発・敵対心・警戒、他者との衝突を示すという解釈です。',
    '上向き': '上を向いているため、願望・向上心・理想を追う気持ちを示すとされます。',
    '下向き': '下を向いている、または影がかかっているため、停滞・抑圧・隠蔽を示すとされます。',
    '不明': '向きがはっきりしないため、方向性に基づく明確な意味づけは行いません。',
  };

  // -----------------------------------------------------------------
  // 種類(願相の見た目の分類) → 心理的な層
  // -----------------------------------------------------------------
  var TYPE_MEANINGS = {
    '子供の顔': '純粋さ・無邪気な願望・幼少期の未解決の感情を象徴するとされます。',
    '老人の顔': '経験・知恵、あるいは疲労や老いへの意識を象徴するとされます。',
    '男性の顔': '論理性・行動力・外向的なエネルギーを象徴するとされます。',
    '女性の顔': '感受性・受容性・内面的なエネルギーを象徴するとされます。',
    '怒りの表情': '抑圧された不満や葛藤を象徴するとされます。',
    '悲しみの表情': '心の傷・まだ消化しきれていない感情を象徴するとされます。',
    '喜びの表情': '満たされた願い・前向きなエネルギーを象徴するとされます。',
    '動物の顔': '本能的・野性的な衝動、原始的な欲求を象徴するとされます(猿・犬などの動物的な顔立ちの場合)。',
    '不明': '種類の分類は行われていません。',
  };

  // -----------------------------------------------------------------
  // 検出数 → 内面の複雑さ
  // -----------------------------------------------------------------
  function countComplexity(count) {
    if (count <= 1) return '検出された願相は1つで、比較的単純明快な心理状態を示すとされます。';
    if (count <= 3) return '検出された願相は' + count + '個で、複数の感情や課題が同時に存在している可能性を示すとされます。';
    return '検出された願相は' + count + '個と多く、内面が複雑になっている、あるいは強いストレス下にある可能性を示すとされます。';
  }

  // -----------------------------------------------------------------
  // 幾何学スコア(顔らしさスコア 0〜100)
  //
  // 入力: points = { eyeLeft: {x,y}, eyeRight: {x,y}, mouth: {x,y} }
  // (画像上でユーザーがマーキングした座標。ピクセル単位)
  //
  // 現時点では「対称性」「口の位置(目の下・中央寄りか)」の幾何学的な
  // 妥当性のみを評価する。画像そのもののコントラストや鮮明度の評価は
  // 次段階の課題(docs/GANSOU_ROADMAP.md 参照)。
  // -----------------------------------------------------------------
  function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  function computeFaceLikenessScore(points) {
    if (!points || !points.eyeLeft || !points.eyeRight || !points.mouth) return 0;
    var eyeLeft = points.eyeLeft, eyeRight = points.eyeRight, mouth = points.mouth;
    var eyeDist = distance(eyeLeft, eyeRight);
    if (eyeDist < 1) return 0;

    var midX = (eyeLeft.x + eyeRight.x) / 2;
    var midY = (eyeLeft.y + eyeRight.y) / 2;

    // 対称性: 目の高さの差が目の間隔に対して小さいほど高スコア
    var heightDiff = Math.abs(eyeLeft.y - eyeRight.y);
    var symmetry = Math.max(0, 1 - heightDiff / eyeDist);

    // 口が目の中間点より下にあるか(自然な顔の配置に近いか)
    var mouthOffsetY = mouth.y - midY;
    var mouthBelowScore = mouthOffsetY > 0 ? Math.min(1, mouthOffsetY / eyeDist) : 0;

    // 口が目の中間点の左右中央に近いか
    var mouthCenteredScore = Math.max(0, 1 - Math.abs(mouth.x - midX) / eyeDist);

    var raw = symmetry * 0.4 + mouthBelowScore * 0.3 + mouthCenteredScore * 0.3;
    return Math.max(0, Math.min(100, Math.round(raw * 100)));
  }

  // -----------------------------------------------------------------
  // 向きの推定(顔全体の中心 faceCenter を基準に、願相の「向き」を
  // 内向き/外向き/上向き/下向きのいずれかに分類する)
  //
  // 入力: points(上記) + faceCenter: {x,y}(元画像における顔全体の中心。
  //   未指定の場合は呼び出し側で画像中心などを渡す想定)
  // -----------------------------------------------------------------
  function computeOrientation(points, faceCenter) {
    if (!points || !points.eyeLeft || !points.eyeRight || !points.mouth || !faceCenter) return '不明';

    var eyeMid = { x: (points.eyeLeft.x + points.eyeRight.x) / 2, y: (points.eyeLeft.y + points.eyeRight.y) / 2 };
    // 願相自体が向いている方向(目の中間点→口への向き。通常は「下向き」寄りになる)
    var forward = { x: points.mouth.x - eyeMid.x, y: points.mouth.y - eyeMid.y };

    // 願相の重心(3点の平均)
    var centroid = {
      x: (points.eyeLeft.x + points.eyeRight.x + points.mouth.x) / 3,
      y: (points.eyeLeft.y + points.eyeRight.y + points.mouth.y) / 3,
    };
    // 顔全体の中心から見た、願相の位置ベクトル(中心から願相へ向かうベクトル)
    var outward = { x: centroid.x - faceCenter.x, y: centroid.y - faceCenter.y };

    var forwardLen = Math.sqrt(forward.x * forward.x + forward.y * forward.y);
    var outwardLen = Math.sqrt(outward.x * outward.x + outward.y * outward.y);
    if (forwardLen < 1 || outwardLen < 1) return '不明';

    // 内積の符号: forward と outward が同じ向きなら「外向き」(中心から逆方向を向く)、
    // 逆向きなら「内向き」(中心の方を向く)
    var dot = (forward.x * outward.x + forward.y * outward.y) / (forwardLen * outwardLen);

    // 上下方向が支配的な場合は上向き/下向きを優先する
    var verticalDominance = Math.abs(forward.y) / forwardLen;
    if (verticalDominance > 0.85) {
      return forward.y < 0 ? '上向き' : '下向き';
    }

    if (dot > 0.3) return '外向き';
    if (dot < -0.3) return '内向き';
    return '不明';
  }

  // -----------------------------------------------------------------
  // 総合レポートの組み立て(ユーザー提示の出力フォーマットに準拠)
  //
  // 入力:
  //   position: string(POSITION_LIST のいずれか、または自由記述)
  //   orientation: string('内向き'|'外向き'|'上向き'|'下向き'|'不明')
  //   type: string(TYPE_MEANINGS のいずれか、または'不明')
  //   score: number(0〜100)
  //   count: number(検出された願相の総数。省略時は1)
  //   regionCoords: object(アプリ用の領域座標。省略可)
  // -----------------------------------------------------------------
  function buildGansouReport(input) {
    input = input || {};
    var position = input.position || '(未指定)';
    var orientation = input.orientation || '不明';
    var type = input.type || '不明';
    var score = typeof input.score === 'number' ? input.score : 0;
    var count = typeof input.count === 'number' && input.count > 0 ? input.count : 1;

    var positionMeaning = POSITION_MEANINGS[position] || 'この位置に対応する伝統的な意味づけは登録されていません。参考程度に留めてください。';
    var orientationMeaning = ORIENTATION_MEANINGS[orientation] || ORIENTATION_MEANINGS['不明'];
    var typeMeaning = TYPE_MEANINGS[type] || TYPE_MEANINGS['不明'];
    var complexityNote = countComplexity(count);

    var featureDescription = '位置: ' + position + ' / 向き: ' + orientation + ' / 種類: ' + type + ' / スコア: ' + score + '点';

    var message = '「' + position + '」に検出された願相は、向き(' + orientation + ')から見て' +
      (orientation === '外向き' ? '対外的な反発や敵対心' : orientation === '内向き' ? '内省や身内への意識' : orientation === '上向き' ? '願望や向上心' : orientation === '下向き' ? '停滞や抑圧' : 'はっきりしない心理状態') +
      'を示すとされます。' + typeMeaning + complexityNote +
      'あくまで伝統的な言い伝え・娯楽的な解釈であり、実際の心理状態や人間関係を断定するものではありません。';
    if (message.length > 220) message = message.slice(0, 217) + '…';

    return {
      position: position,
      orientation: orientation,
      score: score,
      featureDescription: featureDescription,
      regionCoords: input.regionCoords || null,
      detail: {
        positionMeaning: positionMeaning,
        orientationMeaning: orientationMeaning,
        typeMeaning: typeMeaning,
        complexityNote: complexityNote,
      },
      message: message,
    };
  }

  // -----------------------------------------------------------------
  // 抽象相・自動解析判定エンジン
  //
  // 「画像解析AI + ユーザー選別(Human-in-the-Loop)」で確定された
  // JSON(detection_id / detected_feature / area_attribute)を受け取り、
  // 伝統的な十二宮の考え方に沿って解釈する。
  //
  // 検出そのもの(自動抽出ステップ・人間選別ステップ)は、このアプリ内では
  // 既存の「自動検出する」ボタン(hidden-face-detector.js)と
  // 「採用する」ボタンがその役割を担っている。本関数はその後段、
  // 「確定されたデータを解釈する」部分にあたる。外部の画像解析システムが
  // このJSON形式で結果を渡してくる場合も、そのままこの関数に通せる。
  // -----------------------------------------------------------------

  var LOCATION_LABELS = {
    right_cheek: '右頬', left_cheek: '左頬', cheek: '頬',
    forehead: '額', eye_corner: '目尻', hairline: '生え際',
    chin: '顎', jaw: '顎', nose_bridge: '鼻筋',
  };

  var COMPONENT_LABELS = {
    two_dots: '点二つの目', small_dents: '小さな窪みの目',
    top_hair_line: '額上部の髪の毛のようなライン', flow_line: '流線型の影のライン',
    triangle_nose: '三角形の鼻', wedge_shadow: 'くさび状の影の鼻',
    horizontal_line: '横一文字の口', crack_line: '亀裂のような口の線',
  };

  // 伝統的な十二宮(命宮・兄弟宮・夫妻宮・子女宮・財帛宮・疾厄宮・
  // 遷移宮・奴僕宮・官禄宮・田宅宮・福徳宮・父母宮) → 意味
  var PALACE_MEANINGS = {
    '命宮': '性格・人生全体の基本運に関わるとされる宮です。',
    '兄弟宮': '兄弟・友人関係に関わるとされる宮です。',
    '夫妻宮': '恋愛・結婚・パートナーシップに関わるとされる宮です。',
    '子女宮': '子供・目下の者との関係に関わるとされる宮です。',
    '財帛宮': '金銭・財産に関わるとされる宮です。',
    '疾厄宮': '健康・災難に関わるとされる宮です。',
    '遷移宮': '転居・旅行・環境の変化に関わるとされる宮です。',
    '奴僕宮': '部下・使用人・目下との関係に関わるとされる宮です。',
    '官禄宮': '仕事・社会的地位に関わるとされる宮です。',
    '田宅宮': '不動産・家庭に関わるとされる宮です。',
    '福徳宮': '精神的な充足・徳に関わるとされる宮です。',
    '父母宮': '親・目上との関係に関わるとされる宮です。',
  };

  var PALACE_LIST = Object.keys(PALACE_MEANINGS);

  // area_attribute.palace_name が無い/未知の場合の domain_category からの推定
  var DOMAIN_CATEGORY_TO_PALACE = {
    romance: '夫妻宮', career: '官禄宮', interpersonal: '兄弟宮',
    health: '疾厄宮', wealth: '財帛宮',
  };

  var FACING_DIRECTION_LABELS = {
    outward: '外向き', inward: '内向き', downward: '下向き', upward: '上向き',
  };

  function labelOrRaw(dict, key) {
    if (!key) return null;
    return dict[key] || String(key).replace(/_/g, ' ');
  }

  function clarityNoteFromScore(clarity) {
    if (clarity >= 0.75) return '輪郭が非常にはっきりしており、強い印象を持つパターンです。';
    if (clarity >= 0.4) return 'ある程度はっきりした、中程度の鮮明さのパターンです。';
    return '輪郭が淡く、あくまで参考程度のパターンです。';
  }

  // -----------------------------------------------------------------
  // geometry(x, y, width, height) → canvas描画用の丸印指示
  //
  // 半径は既定20px(呼び出し側で上書き可能)。geometryが欠けている・
  // x/yが数値でない場合は「描画できない」ことを明示した指示を返す。
  // -----------------------------------------------------------------
  var DEFAULT_MARK_RADIUS = 20;

  function buildDrawInstruction(geometry, radius) {
    var r = typeof radius === 'number' ? radius : DEFAULT_MARK_RADIUS;
    var hasGeometry = !!geometry && typeof geometry.x === 'number' && typeof geometry.y === 'number';

    if (!hasGeometry) {
      return {
        available: false,
        radius: r,
        x: null,
        y: null,
        width: (geometry && typeof geometry.width === 'number') ? geometry.width : null,
        height: (geometry && typeof geometry.height === 'number') ? geometry.height : null,
        message: '座標が不足しているため描画できません(geometry.x / geometry.y が必要です)。',
        code: null,
      };
    }

    var code = 'ctx.beginPath();\n' +
      'ctx.arc(' + geometry.x + ', ' + geometry.y + ', ' + r + ', 0, Math.PI * 2);\n' +
      'ctx.strokeStyle = "red";\n' +
      'ctx.lineWidth = 3;\n' +
      'ctx.stroke();';

    return {
      available: true,
      radius: r,
      x: geometry.x,
      y: geometry.y,
      width: typeof geometry.width === 'number' ? geometry.width : null,
      height: typeof geometry.height === 'number' ? geometry.height : null,
      message: '(' + geometry.x + ', ' + geometry.y + ') を中心に半径' + r + 'pxの赤い円を描画します。',
      code: code,
    };
  }

  function buildAbstractGansouReport(input) {
    input = input || {};
    var feature = input.detected_feature || {};
    var comps = feature.abstract_components || {};
    var areaAttr = input.area_attribute || {};
    var geometry = input.geometry || null;
    var drawInstruction = buildDrawInstruction(geometry, input.markRadius);

    var locationLabel = labelOrRaw(LOCATION_LABELS, feature.location) || '(未指定)';
    var directionKey = feature.facing_direction || '';
    var directionJa = FACING_DIRECTION_LABELS[directionKey] || '不明';
    var clarity = typeof feature.clarity_score === 'number' ? Math.max(0, Math.min(1, feature.clarity_score)) : 0;

    var palaceNameInput = areaAttr.palace_name;
    var resolvedPalaceName = (palaceNameInput && PALACE_MEANINGS[palaceNameInput])
      ? palaceNameInput
      : (DOMAIN_CATEGORY_TO_PALACE[areaAttr.domain_category] || null);

    var palaceMeaning;
    if (resolvedPalaceName && PALACE_MEANINGS[resolvedPalaceName]) {
      palaceMeaning = PALACE_MEANINGS[resolvedPalaceName];
      if (!(palaceNameInput && PALACE_MEANINGS[palaceNameInput])) {
        palaceMeaning += '(領域カテゴリ「' + areaAttr.domain_category + '」から推定)';
      }
    } else {
      palaceMeaning = 'この位置に対応する伝統的な宮の分類は特定できませんでした。参考程度に留めてください。';
    }

    var orientationMeaning = ORIENTATION_MEANINGS[directionJa] || ORIENTATION_MEANINGS['不明'];

    var componentDescriptions = [];
    ['eyes', 'hair_line', 'nose', 'mouth'].forEach(function (key) {
      if (comps[key]) {
        var lbl = labelOrRaw(COMPONENT_LABELS, comps[key]);
        if (lbl) componentDescriptions.push(lbl);
      }
    });
    var featureDescription = componentDescriptions.length ? componentDescriptions.join(' / ') : '(構成要素の情報なし)';

    var clarityNote = clarityNoteFromScore(clarity);

    var directionThemeText = directionJa === '外向き' ? '対外的な反発や敵対心'
      : directionJa === '内向き' ? '内省や身内への意識'
      : directionJa === '上向き' ? '願望や向上心'
      : directionJa === '下向き' ? '停滞や抑圧'
      : 'はっきりしない心理状態';

    var message = '「' + locationLabel + '」' + (resolvedPalaceName ? '(' + resolvedPalaceName + ')' : '') +
      'に検出された抽象的な隠れ相は、向き(' + directionJa + ')から見て' + directionThemeText + 'を示すとされます。' +
      clarityNote +
      'あくまで伝統的な言い伝え・娯楽的な解釈であり、実際の心理状態や人間関係を断定するものではありません。';
    if (message.length > 220) message = message.slice(0, 217) + '…';

    return {
      detectionId: input.detection_id || null,
      drawInstruction: drawInstruction,
      location: locationLabel,
      palaceName: resolvedPalaceName || '(未分類)',
      domainCategory: areaAttr.domain_category || null,
      direction: directionJa,
      clarityScore: clarity,
      featureDescription: featureDescription,
      detail: {
        palaceMeaning: palaceMeaning,
        orientationMeaning: orientationMeaning,
        clarityNote: clarityNote,
      },
      message: message,
    };
  }

  return {
    POSITION_LIST: POSITION_LIST,
    POSITION_MEANINGS: POSITION_MEANINGS,
    ORIENTATION_MEANINGS: ORIENTATION_MEANINGS,
    TYPE_MEANINGS: TYPE_MEANINGS,
    computeFaceLikenessScore: computeFaceLikenessScore,
    computeOrientation: computeOrientation,
    countComplexity: countComplexity,
    buildGansouReport: buildGansouReport,
    PALACE_LIST: PALACE_LIST,
    PALACE_MEANINGS: PALACE_MEANINGS,
    LOCATION_LABELS: LOCATION_LABELS,
    COMPONENT_LABELS: COMPONENT_LABELS,
    FACING_DIRECTION_LABELS: FACING_DIRECTION_LABELS,
    buildAbstractGansouReport: buildAbstractGansouReport,
    buildDrawInstruction: buildDrawInstruction,
    DEFAULT_MARK_RADIUS: DEFAULT_MARK_RADIUS,
  };
});
