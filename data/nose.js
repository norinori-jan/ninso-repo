/**
 * data/nose.js
 * 第七輯・第八輯より新規追加。category「顔」role「鼻」。
 * forehead_extra.js / hair.js と同じUMDパターンで
 * root.NOSE としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.NOSE = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "nose_tree_metaphor_structure",
    name: "鼻を幹とする顔全体の樹木比喩",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "幹・枝・花・実の対応",
        tone: "neutral",
        text: "伝統的な人相学の比喩では、鼻を幹、眉を枝、目を芽・花、耳を実、口を大海に見立て、鼻(幹)がしっかりしていなければ他の部位も養われず育たないと説く。鼻を人相の中心(審弁宮・財帛宮)として重視する考え方の背景になっている比喩体系。",
      },
    ],
  },
  {
    key: "nose_length_ratio_standard",
    name: "鼻の長さの基準(顔の長さとの比率)",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "標準比率の考え方",
        tone: "neutral",
        text: "伝統的な基準では、額の生え際から眉間までを顔の長さの三分の一、そこから鼻先までをもう三分の一とする見方がある。この比率から大きくずれる長い鼻・短い鼻を個性として読む。",
      },
    ],
  },
  {
    key: "nose_bridge_shape_types",
    name: "鼻の各部位(山根・年上・寿上・準頭)の名称と対応",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "各部位の対応",
        tone: "neutral",
        text: "鼻筋は目の間の山根から始まり、年上・寿上を経て鼻先の準頭に至るとされ、それぞれが胃・小腸・回腸・大腸など内臓の健康状態と対応づけられる伝統的な見方がある。山根の陥没や色つやの変化は体調のサインとして観察される。",
      },
    ],
  },
  {
    key: "nose_tip_three_qualities",
    name: "準頭(鼻先)に表れる三質論",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "心性質",
        tone: "neutral",
        text: "準頭が高くしっかりしている場合、名誉心・自尊心・知力を示す心性質の傾向が強いとされる。",
      },
      {
        id: "b",
        label: "筋骨質",
        tone: "neutral",
        text: "鼻柱(準頭の付け根)が高く強硬な場合、意志の強さや抵抗性を示す筋骨質の傾向が強いとされる。",
      },
      {
        id: "c",
        label: "営養質",
        tone: "neutral",
        text: "小鼻(金甲)にふくよかな肉づきがある場合、財運や情愛・営養質の豊かさを示すとされる。",
      },
    ],
  },
  {
    key: "nose_wing_size_reading",
    name: "小鼻(金甲)の大小による財運・呼吸器の見方",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "小鼻が大きく張っている",
        tone: "positive",
        text: "小鼻(金甲)が適度に大きく張っている相は財運がよく、呼吸器も丈夫な傾向を示すとされる。",
      },
      {
        id: "b",
        label: "小鼻が小さく貧弱",
        tone: "negative",
        text: "小鼻が小さく貧弱な相は、財を貯めにくく、金銭に几帳面すぎる傾向、あるいは呼吸器がやや弱い傾向として語られる。",
      },
    ],
  },
  {
    key: "nose_bone_prominence_type",
    name: "鼻柱の硬性(強硬性・抵抗性)による性格",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "鼻柱が高く硬い",
        tone: "neutral",
        text: "鼻の中程の柱が高く硬く発達している相は、意志が強く妥協しない強硬性・抵抗性の性格を示すとされる。",
      },
      {
        id: "b",
        label: "鼻柱が柔らかく低い",
        tone: "neutral",
        text: "鼻柱が柔らかく目立たない相は、気分が変わりやすく妥協しやすい性格の傾向を示すとされる。",
      },
    ],
  },
  {
    key: "nose_profile_curve_types",
    name: "鼻の横顔の凹凸(鷲鼻・団子鼻・普通)による性格",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "凸型(鷲鼻・ユダヤ鼻型)",
        tone: "caution",
        text: "鼻筋が凸型に出っ張るタイプは、陰険・狡猾で貪欲な型として伝統的に語られてきたが、これは特定の民族への偏見と結びつきやすい古い分類であり、現代的な性格判断としての根拠は薄いとされる。",
      },
      {
        id: "b",
        label: "凹型",
        tone: "caution",
        text: "鼻筋が凹んでいるタイプは、柔弱・付和雷同しやすい性格として伝統的に語られる。",
      },
      {
        id: "c",
        label: "普通型",
        tone: "positive",
        text: "適度にまっすぐな鼻筋は円満な性格を示すとされる。",
      },
    ],
  },
  {
    key: "nose_tip_shape_hook_droop",
    name: "鼻先の形状(垂れ気味・つまんだよう・平ら)による性格",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "鼻先が下に垂れる",
        tone: "neutral",
        text: "鼻先が下向きに垂れ気味の相は、慎重で用心深い性格を示すとされる。",
      },
      {
        id: "b",
        label: "鼻先がつまんだように細い",
        tone: "neutral",
        text: "鼻先が細くつままれたような形は、繊細で感受性が強い性格を示すとされる。",
      },
      {
        id: "c",
        label: "鼻先が平らで肉づきがない",
        tone: "neutral",
        text: "鼻先に肉づきが乏しく平らな相は、性格がやや冷淡・合理的な傾向として語られる。",
      },
    ],
  },
  {
    key: "nose_length_type_classification",
    name: "長鼻・短鼻・高鼻・低鼻・広鼻・狭鼻の六分類",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "長鼻",
        tone: "neutral",
        text: "顔の三分の一より長い鼻は、慎重で寿命が長い傾向を示すとされる。",
      },
      {
        id: "b",
        label: "短鼻",
        tone: "neutral",
        text: "標準より短い鼻は、気さくで社交的だが短気になりやすい傾向を示すとされる。",
      },
      {
        id: "c",
        label: "広鼻・狭鼻",
        tone: "neutral",
        text: "小鼻の張りが広い鼻は物質欲・生活意欲が強く、狭い鼻は気位が高く感受性が鈍い傾向として語られる。",
      },
    ],
  },
  {
    key: "nose_female_fortune_correlation",
    name: "女性の鼻の高低と夫婦運・自己主張の伝統的解釈",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "鼻が高い女性",
        tone: "neutral",
        text: "伝統的な相法では、女性の鼻が高いほど自己主張が強く、夫婦間で主導権を握りやすい傾向として語られてきた。あくまで古い相法の解釈であり、現代の夫婦関係のあり方を規定するものではない。",
      },
      {
        id: "b",
        label: "鼻が低い女性",
        tone: "neutral",
        text: "鼻が低めの女性は控えめで夫を立てる傾向として伝統的に語られてきた。同様に古い相法上の解釈にとどまる。",
      },
    ],
  },
  {
    key: "nose_climate_adaptation_theory",
    name: "鼻の高低と気候適応の一般論",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "気候による鼻の形態差という考え方",
        tone: "neutral",
        text: "鼻は吸い込む空気を温め加湿する器官でもあるため、寒冷な地域に由来する系統では鼻が高く、温暖・多湿な地域に由来する系統では鼻が低く鼻孔が大きい傾向があるという、環境適応に基づく一般論がある。特定の集団の優劣を示すものではなく、あくまで身体の環境適応に関する一般的な説明にとどめる。",
      },
    ],
  },
  {
    key: "nose_mole_wealth_sign",
    name: "小鼻周辺(食禄・食倉)のホクロと財運",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "食禄・食倉部にホクロがある",
        tone: "caution",
        text: "鼻の下、口の上にあたる食禄・食倉と呼ばれる部位にホクロがある相は、居候(食客)を抱えたり他人の世話で苦労しやすい相として伝統的に語られる。",
      },
    ],
  },
];
});
