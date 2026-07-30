/**
 * data/philtrum.js
 * 第九・十輯「人相学詳論(十三) 人中の相」より新規追加。
 * category「顔」role「人中」。他ファイルと同じUMDパターンで
 * root.PHILTRUM としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PHILTRUM = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "philtrum_definition_zones",
    name: "人中の定義と周辺部位(禄倉・食倉)の位置関係",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "人中の基本定義",
        tone: "neutral",
        text: "人中は鼻の下、口の上にある縦の溝のことで、「山海の通路」の異名を持つ。人中を山、口を海に見立てる比喩体系があり、才一図では人中の左が食倉、右が禄倉と呼ばれる部位にあたるとされる。",
      },
      {
        id: "b",
        label: "食倉・禄倉の意味",
        tone: "neutral",
        text: "食倉・禄倉は家屋・台所にたとえられる部位で、血色がきれいで肉づきがよければ生計にゆとりがあり、逆に血色が悪く肉づきが乏しければ生活が苦しい相と伝統的に読まれる。",
      },
    ],
  },
  {
    key: "philtrum_aging_pattern",
    name: "年代による人中の変化(幼年・中年・老年の長さ・幅・上下の太さ)",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "幼年期",
        tone: "neutral",
        text: "才二図の伝統的な見方では、幼年期の人中は短く反り気味で、幅は細く、上唇側が太く下唇側が細い形をしているとされる。",
      },
      {
        id: "b",
        label: "中年期",
        tone: "positive",
        text: "中年期には人中の長さ・幅とも中程度に整い、上下の太さもほぼ均等になるとされ、比較的安定した時期とされる。",
      },
      {
        id: "c",
        label: "老年期",
        tone: "neutral",
        text: "老年期になると人中は長くなり、幅も太くなる一方、上唇側が細く下唇側が太くなる傾向があるとされる。加齢に伴う自然な変化の一つとして説明される。",
      },
    ],
  },
  {
    key: "philtrum_length_lifespan_correlation",
    name: "人中の長短と寿命・童顔との相関",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "人中が長い",
        tone: "positive",
        text: "人中が顔立ちに対して長めの人は寿命が長い傾向を示す相として伝統的に語られ、童顔ではない、成人した顔立ちに長く現れやすいとされる。",
      },
      {
        id: "b",
        label: "人中が短い",
        tone: "caution",
        text: "人中が短い人は童顔的な相の一つとされ、寿命がその分短めになりやすいという伝統的な見方がある。ただし短命を断定するものではなく、あくまで古典的な相見の一つの目安とされる。",
      },
    ],
  },
  {
    key: "philtrum_curve_and_foot_correlation",
    name: "人中の曲がりと性格・利き足の伝統的対応",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "人中が曲がっている",
        tone: "caution",
        text: "人中が左右どちらかに曲がっている相は、その人の性格に何らかの偏りやくせがあり、あまり信用しきれない面があるという伝統的な見方がある。男性・女性いずれにも見られるとされる。",
      },
      {
        id: "b",
        label: "右足・左足との対応",
        tone: "neutral",
        text: "人中が右に曲がっていれば右足に、左に曲がっていれば左足に、日常の動作のくせや過去の故障(捻挫・古傷など)が現れやすいという対応関係が伝統的に語られてきた。",
      },
    ],
  },
  {
    key: "philtrum_mole_position_meaning",
    name: "人中周辺(A・B・C・D)のホクロ位置による伝統的な意味",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "上部(準頭寄り)のホクロ",
        tone: "neutral",
        text: "人中の上部、準頭にごく近い位置にあるホクロは、家の方角や住まいの選び方に関する言い伝えと結びつけて語られることがある伝統的な見方の一つ。",
      },
      {
        id: "b",
        label: "中ほどのホクロ",
        tone: "caution",
        text: "人中の中ほどにあるホクロは、家庭や縁組み(再縁など)にまつわる相として伝統的に語られる。左右どちらにあるかで意味合いが変わるとされる。",
      },
      {
        id: "c",
        label: "口に近い下部のホクロ",
        tone: "neutral",
        text: "人中の下部、口に近い位置にあるホクロは、短命や家業に関する言い伝えと結びつけて語られることがある。あくまで古い相占いの一つの見方にとどまる。",
      },
    ],
  },
  {
    key: "philtrum_width_life_stability",
    name: "人中の広さ・狭さと生活の安定度",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "人中が広く上がひろがっている",
        tone: "positive",
        text: "人中の上部が広く末広がりになっている相は、まつすぐに運がひらけやすく、生活も早いうちから安定してくる傾向として伝統的に語られる。",
      },
      {
        id: "b",
        label: "人中が細い",
        tone: "caution",
        text: "人中が細く目立って生活が困窮しやすいとされる相もある一方で、性格が小心翼々・臆病になりがちな傾向もあわせて語られる。生活力そのものを断定するものではなく、あくまで古典的な傾向の目安とされる。",
      },
    ],
  },
  {
    key: "philtrum_horizontal_line_hardship",
    name: "人中に入る横筋と生活苦・食物の欠乏の伝統的な見方",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "人中に横筋が入っている",
        tone: "caution",
        text: "人中に横に走る筋が入っている相は、生活苦や食べ物に困窮しやすい相として伝統的に語られる。筋が両脇に出ている場合は生活苦にちぐはぐさが加わり意味合いが悪くなるとされる。",
      },
      {
        id: "b",
        label: "横筋がない",
        tone: "positive",
        text: "人中に横筋が入っていない相は、生活苦や食物に困窮することが少ない相として語られる。",
      },
    ],
  },
  {
    key: "philtrum_shape_child_gender_folk_belief",
    name: "人中のカーブ形状による子供の性別判断の言い伝え",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "カーブが深く縁がはっきりした人中",
        tone: "neutral",
        text: "人中の両脇のカーブが深く、縁がはっきりしている相は、伝統的には男の子に縁がある相として語られてきた。あくまで古い民間の言い伝えであり、科学的な根拠を示すものではない。",
      },
      {
        id: "b",
        label: "カーブが浅く直線に近い人中",
        tone: "neutral",
        text: "人中のカーブが浅く直線に近い相は、伝統的には女の子に縁がある相として語られてきた。同様に古い民間信仰の域を出ないものとして扱う。",
      },
    ],
  },
  {
    key: "philtrum_mustache_growth_style",
    name: "ヒゲの生やし方(人中・法令沿い)と伝統的な運命観",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "法令に沿って左右対称に生やす",
        tone: "positive",
        text: "口から出た筋(法令)に沿って左右対称にヒゲを整える生やし方は、伝統的な相法では運が安定しやすい生やし方として語られる。",
      },
      {
        id: "b",
        label: "斜めに垂れて左右非対称に生やす",
        tone: "caution",
        text: "法令に対して斜めに垂れ、左右非対称になるようなヒゲの生やし方は、伝統的には運気が乱れやすい相として語られる。あくまで髭の整え方に関する古い言い伝えであり、身だしなみの助言として断定するものではない。",
      },
    ],
  },
  {
    key: "philtrum_marriage_and_late_life_fortune",
    name: "人中の形状と夫婦運・晩年運の総括的な伝統的解釈",
    category: "顔",
    role: "人中",
    options: [
      {
        id: "a",
        label: "太くしっかりした人中",
        tone: "positive",
        text: "人中が太くしっかりしている相は、夫婦関係が円満に長続きしやすく、晩年も安定しやすい相として伝統的に語られる。",
      },
      {
        id: "b",
        label: "細くはっきりしない人中",
        tone: "caution",
        text: "人中が細くはっきりしない相は、夫婦間ですれ違いが生じやすく、晩年に孤独になりやすい相として伝統的に語られる。あくまで古典的な相法上の一般論であり、実際の夫婦関係の良し悪しを決めるものではない。",
      },
    ],
  },
];
});
