/**
 * data/eyebrows.js
 * 第七輯より新規追加。category「顔」role「眉」。
 * forehead_extra.js / hair.js と同じUMDパターンで
 * root.EYEBROWS としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EYEBROWS = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "eyebrow_terminology_confidant_palace",
    name: "眉間の異名と交友宮・保寿官・兄弟宮",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "眉全体を重視する見方",
        tone: "neutral",
        text: "眉の上部一帯は交友宮・保寿官・兄弟宮などと呼ばれ、友人関係、寿命の長短、兄弟姉妹との縁を映す部位とされる。眉頭側は兄弟、眉尾側は交友関係を主に見るという伝統的な区分がある。",
      },
      {
        id: "b",
        label: "生理学的価値づけとの対比",
        tone: "neutral",
        text: "西洋の人相学が眉を運命学的な価値の乏しい部位として軽視しがちなのに対し、東洋の相法では眉を非常に重視し、運命・人間関係・寿命に関わる要の部位として扱う。",
      },
    ],
  },
  {
    key: "eyebrow_gender_typical_shape",
    name: "男性的な眉と女性的な眉の典型",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "男性的な太く直線的な眉",
        tone: "positive",
        text: "眉幅が太く、左右がまっすぐに近い形の眉は営養質・筋骨質の型で、行動的で意志が強く、物事をはっきり否定・肯定する率直な性格を示すとされる。",
      },
      {
        id: "b",
        label: "女性的な柳眉・三日月型の眉",
        tone: "neutral",
        text: "画のように弧を描いた細く整った眉は伝統的に女性的な美しさの象徴とされ、愛嬌や魅力を表すとされる一方、本音を出さず駆け引き上手な傾向とも解釈される。",
      },
    ],
  },
  {
    key: "eyebrow_thickness_temperament",
    name: "眉毛の太さと気質",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "太く濃い眉",
        tone: "positive",
        text: "太く濃い眉は営養質・筋骨質の傾向を示し、情に厚く経済的な観念や兄弟縁もよいとされる一方、嫉妬心が強くなりやすいともいわれる。",
      },
      {
        id: "b",
        label: "細く薄い眉",
        tone: "neutral",
        text: "細く薄い眉は繊細で神経質な傾向を示すとされ、几帳面である反面、心配性で消極的になりやすい面があるとされる。",
      },
    ],
  },
  {
    key: "eyebrow_tail_angle_clockface",
    name: "眉尻の傾き(尻上がり・尻下がり)",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "尻上がりの眉",
        tone: "neutral",
        text: "眉頭から眉尾へ時計の針でいう八時二十分ごろのように斜め上に上がる形は、男性的・行動的・積極的な性質を示すとされる。",
      },
      {
        id: "b",
        label: "尻下がりの眉",
        tone: "neutral",
        text: "眉尾が下がる形は同情心が強く受動的・消極的な性質を示すとされ、女性に多く見られる型ともいわれる。",
      },
    ],
  },
  {
    key: "eyebrow_eye_distance_tainaku",
    name: "眉と眼の間隔(田宅)の広狭",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "田宅が広い(眉と眼の間隔が広い)",
        tone: "positive",
        text: "眉と眼の間の田宅が広い相は運命的に恵まれ、家庭円満・不動産や家系にまつわる財運がよいとされる。東洋相法では特にこの部位を家中心の家族制度と結びつけて重視してきた。",
      },
      {
        id: "b",
        label: "田宅が狭い(眉と眼の間隔が狭い)",
        tone: "negative",
        text: "田宅が狭い相は家庭運や不動産運が弱く、性急・気短で身を持ち崩しやすいと伝統的に解釈される。狭すぎる場合は危険人物の相ともいわれる。",
      },
    ],
  },
  {
    key: "eyebrow_glabella_width_personality",
    name: "眉間(命宮)の広狭による性格傾向",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "眉間が広い",
        tone: "positive",
        text: "眉間(命宮)が広く開いている相は、温和・寛大で陽気な性格、こだわりの少ない開放的な気質を示すとされる。",
      },
      {
        id: "b",
        label: "眉間が狭い",
        tone: "negative",
        text: "眉間が狭い相は神経質・気が短い・心配性で、性格に陰気さや狭量さが出やすいとされる。",
      },
    ],
  },
  {
    key: "eyebrow_hair_density_texture",
    name: "眉毛の密度・整い方による運勢",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "毛並みが整い密度が適度",
        tone: "positive",
        text: "眉毛が密集しすぎず整然と生えそろっている相は、性格が安定し人間関係も円満に運びやすいとされる。",
      },
      {
        id: "b",
        label: "逆毛・乱れ毛が多い",
        tone: "negative",
        text: "眉毛の一部が逆立ったり乱れて生える相は、不仕合わせや心中の迷い・トラブルの兆しとされ、整わない間は運気も停滞するといわれる。",
      },
    ],
  },
  {
    key: "eyebrow_color_reading",
    name: "眉の色艶による後継運・財運",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "黒々として艶がある",
        tone: "positive",
        text: "眉の色が黒く艶があるのは良い相とされ、後継者に恵まれ財運も安定するといわれる。",
      },
      {
        id: "b",
        label: "色が薄く艶がない",
        tone: "negative",
        text: "眉の色が薄く艶を欠く相は、極端な場合、後継者に恵まれにくい、または身を誤りやすいと伝統的に解釈される。",
      },
    ],
  },
  {
    key: "eyebrow_double_strand_pattern",
    name: "二筋眉・乱れ眉の相",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "二筋に分かれる眉",
        tone: "negative",
        text: "眉が途中で二筋に分かれて見える相は、妻縁が変わりやすい、あるいは晩年孤独になりやすい相として伝統的に語られてきた。",
      },
    ],
  },
  {
    key: "eyebrow_sparse_gap_pattern",
    name: "間穴眉(毛が疎らで隙間の多い眉)",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "間穴眉",
        tone: "negative",
        text: "眉毛の中に隙間が目立ち断片が寄せ集まったように見える相は、晩年孤独・縁の薄さを示す相として扱われる。",
      },
    ],
  },
  {
    key: "eyebrow_long_hair_longevity",
    name: "眉の長毛(延寿毛)による長寿の相",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "眉から一二本の長毛が伸びる",
        tone: "positive",
        text: "眉の中から一本二本だけ長く伸び出る毛は延寿の吉兆とされ、切らずに残しておくのがよいとされる。ただし体の調子が悪くなると先が枯れたり縮れたりするともいわれる。",
      },
    ],
  },
  {
    key: "eyebrow_mole_three_dangers",
    name: "眉のホクロ・疵と水難・火難・剣難",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "眉頭側のホクロ・疵",
        tone: "caution",
        text: "眉頭に近い側にあるホクロや疵は、伝統的な部位分類で水難に関わる兆しとして扱われる部位とされる。",
      },
      {
        id: "b",
        label: "眉の中央〜眉尾側のホクロ・疵",
        tone: "caution",
        text: "眉の中央から眉尾にかけての部位のホクロ・疵は火難・刃物にまつわる災難(剣難)に関わる兆しとして分類されてきた。あくまで伝統的な部位区分であり、実証的根拠のある医学的診断ではない。",
      },
    ],
  },
  {
    key: "eyebrow_sibling_count_reading",
    name: "眉による兄弟姉妹の人数の見方(概念)",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "基本原則",
        tone: "neutral",
        text: "東洋相法には、眉の起伏や区切りの様子から兄弟姉妹の人数やその中での自分の位置を推測しようとする伝統的な観察法がある。眉頭側を年長、眉尾側を年少とみて区切りを読む考え方が基本になっている。実際の的中率を裏づける客観的な検証はなく、あくまで伝統的な占術の一手法として扱う。",
      },
    ],
  },
  {
    key: "eyebrow_birth_order_zones",
    name: "眉を左右四区分して出生順位を見る方法",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "四区分の考え方",
        tone: "neutral",
        text: "眉を眉頭側から眉尾側へ長男・次男・三男・四男に相当する区画に見立て、各区画の毛並みや起伏の状態から、その順位の兄弟に何らかの事情(縁の薄さ、早世など)がなかったかを推測する伝統的な観察法。あくまで占術上の伝承であり、科学的な裏づけがあるものではない。",
      },
    ],
  },
  {
    key: "eyebrow_omens_collection",
    name: "眉の一行占い(玄龍子相法より・伝統的な短句集)",
    category: "顔",
    role: "眉",
    options: [
      {
        id: "a",
        label: "光沢・潤いがある眉",
        tone: "positive",
        text: "眉に潤いと光沢があるのは、貴に富み寿命にも恵まれる相とされる。",
      },
      {
        id: "b",
        label: "太く濃く整った眉",
        tone: "positive",
        text: "眉が太く濃く、時折大きな眼を見開く相は、人を助け人にも助けられる相とされる。",
      },
      {
        id: "c",
        label: "細くまばらな眉",
        tone: "negative",
        text: "眉が細く器用貧乏で発達に乏しい相は、短命・不仕合わせの傾向を示すとされる。",
      },
      {
        id: "d",
        label: "逆毛が直らない眉",
        tone: "negative",
        text: "眉に逆毛が生じ、揉んでも直らない状態が続く間は運気が悪いとされる伝統的な見立て。",
      },
      {
        id: "e",
        label: "四十才以降の眉の変化",
        tone: "caution",
        text: "四十才を過ぎて眉毛が急に長く伸びたり枯れたりするのは、その先に苦労が多い兆しとされる伝統的な見立て。",
      },
    ],
  },
];
});
