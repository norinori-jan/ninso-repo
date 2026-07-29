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

  /* ===== 第八輯(鼻の相 続き)より追加分 ===== */

  {
    key: "nose_aging_pattern_by_life_stage",
    name: "年代による鼻の変化(幼年・中年・老年の鼻向き)",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "幼年期",
        tone: "neutral",
        text: "伝統的な見方では、幼年期の鼻は先端が上を向き、山根・年寿(鼻筋の中央部)が低く短く、小鼻(金甲)は小さめ、準頭は尖った形をしているとされる。",
      },
      {
        id: "b",
        label: "壮年・中年期",
        tone: "positive",
        text: "中年期になると鼻筋は中くらいの高さ・長さに整い、金甲も中程度に発達し、準頭は男性では引き締まり女性では丸みを帯びるとされ、この時期が最も安定した相とされる。",
      },
      {
        id: "c",
        label: "老年期",
        tone: "neutral",
        text: "老年期には鼻先が下向きになり、山根・年寿は長く高くなり、小鼻は大きくなり、準頭は再び尖ってくるとされる。加齢に伴う自然な変化の一つとして説明される。",
      },
    ],
  },
  {
    key: "nose_root_intellect_development",
    name: "山根の高さと知能・思春期の発達",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "幼児期の低い山根",
        tone: "neutral",
        text: "幼児期は山根が低く平らなのが普通で、これは幼年時代の未発達な状態を示すに過ぎないとされる。",
      },
      {
        id: "b",
        label: "思春期以降の隆起",
        tone: "positive",
        text: "思春期(年頃)にかけて山根が徐々に隆起してくるのが通常の発達とされ、中には成人しても山根が十分に隆起しきらない人もいるとされる。",
      },
      {
        id: "c",
        label: "山根の高さと理知性の関係",
        tone: "neutral",
        text: "山根から鼻先までがっしり通っている相は理知が発達している人と見られ、逆に山根が低く鼻筋が細いままの人は、理知的な面がまだ発達途上にあると伝統的に語られる。",
      },
    ],
  },
  {
    key: "nose_root_health_constitution_link",
    name: "山根の高低と生来の体質・疾厄運",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "山根が低くくぼむ",
        tone: "caution",
        text: "山根が低くくぼんでいる人は生来体が弱い相とされ、親(とくに母親)の体質の弱さが遺伝したものと考えられている。",
      },
      {
        id: "b",
        label: "山根が高く立派",
        tone: "positive",
        text: "山根が立派に通っている人は生まれた境遇に恵まれ、体力にも比較的恵まれる傾向があるとされる。",
      },
      {
        id: "c",
        label: "胃腸・扁桃腺との対応",
        tone: "neutral",
        text: "先天的に胃腸が弱い体質の場合や扁桃腺を患いやすい子供は山根が低くくぼみやすいという対応関係が伝統的に語られる。あくまで体質全般の強弱を示す一般論として扱う。",
      },
    ],
  },
  {
    key: "nose_root_temperament_reading",
    name: "山根の太さ・陥没度と気性の傾向",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "山根が細く陥没気味",
        tone: "caution",
        text: "山根が細く陥没気味の人は感情の起伏が激しく、興奮しやすい気性の傾向があると伝統的に語られる。",
      },
      {
        id: "b",
        label: "山根がどっしり太い",
        tone: "positive",
        text: "山根が太くどっしりしている人は情緒が安定しやすく、家庭内でも波風を立てにくい傾向があるとされる。",
      },
    ],
  },
  {
    key: "nose_mole_life_stage_omens",
    name: "鼻の中心線上のホクロ位置と年代別の伝統的な暗示",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "中心線から離れた位置",
        tone: "positive",
        text: "鼻の中心線からある程度離れた位置にあるホクロは、比較的影響が軽いと見る伝統的な考え方がある。",
      },
      {
        id: "b",
        label: "中心線に近く年代の目盛りに重なる位置",
        tone: "caution",
        text: "鼻筋に想定した年齢の目盛り(若年・中年・老年に対応する位置)に重なる形で中心線に近いホクロがある場合、その年代前後に配偶者との死別や事業の失敗など人生の転機となる出来事が起こりやすいという言い伝えがある。古い相占いの一つの見方であり、実際の運命を確定するものではない。",
      },
    ],
  },
  {
    key: "nose_mole_confinement_omen",
    name: "山根周辺のホクロにまつわる伝統的な言い伝え",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "目頭寄りのホクロ",
        tone: "caution",
        text: "山根の左右、目頭に近い位置にあるホクロは、伝統的な相法では法的なトラブルや身柄の拘束といった出来事に一生に一度は縁があるという古い言い伝えがある。あくまで昔の相占いの一つであり、現代における法的リスクを示すものではない。",
      },
      {
        id: "b",
        label: "山根中央に複数並ぶホクロ",
        tone: "neutral",
        text: "山根の中央に複数のホクロが並ぶ相は、伝統的には養子縁組など家族関係の変化に縁がある相として語られてきた。",
      },
    ],
  },
  {
    key: "nose_wing_dog_type_wealth",
    name: "小鼻(金甲)が肉厚で丸く張った「犬鼻」型の金銭感覚",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "犬鼻型(肉厚で丸みのある小鼻)",
        tone: "positive",
        text: "小鼻が肉厚で丸みを帯び、鼻の穴が正面からあまり見えないタイプは伝統的に「犬鼻」と呼ばれ、貯蓄志向で堅実な金銭感覚を持つ相とされる。堅実さの反面、慎重すぎたり見栄を張りやすい面もあるとされる。",
      },
    ],
  },
  {
    key: "nose_nostril_visibility_money_type",
    name: "正面から見た鼻の穴の見え方と金銭感覚",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "鼻の穴が正面からほとんど見えない",
        tone: "positive",
        text: "小鼻がしっかり張って鼻の穴が正面から見えにくいタイプは、金銭を堅実に管理し、無駄遣いが少ない相とされる。",
      },
      {
        id: "b",
        label: "鼻の穴が正面から大きく見える",
        tone: "caution",
        text: "鼻の穴が正面から大きく見えるタイプは、金銭が穴から漏れるように出ていきやすく、浪費や思わぬ損失を被りやすい相として伝統的に語られる。",
      },
    ],
  },
  {
    key: "nose_color_red_meaning",
    name: "鼻の色が赤みを帯びる相の伝統的な意味",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "恒常的に赤みがある",
        tone: "caution",
        text: "鼻がいつも赤みを帯びている人は、金銭に細かくなりがちで、住まいや生活面で苦労が多い相として伝統的に語られる。体質やホルモンバランスの変化など、体調面の影響で赤みが出ることもあるとされる。",
      },
      {
        id: "b",
        label: "一時的な赤み",
        tone: "neutral",
        text: "普段は赤くない鼻が何かの拍子に一時的に赤らむ場合は、体調や感情の変化による一時的なものであり、恒常的な相とは区別して見るべきとされる。",
      },
    ],
  },
  {
    key: "nose_profile_western_classification",
    name: "横顔の輪郭による分類(ローマ鼻・ギリシャ鼻・団子鼻など)",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "ローマ鼻(鼻筋に強い凸型)",
        tone: "neutral",
        text: "鼻筋に強い凸型の張り出しがあるタイプはローマ鼻と呼ばれ、進取的で自己主張が強く、政治・経済分野で活躍しやすい半面、自己中心的になりやすい傾向があるとされる。",
      },
      {
        id: "b",
        label: "ギリシャ鼻(直線的で優美)",
        tone: "positive",
        text: "鼻筋が直線的でまっすぐ通っているタイプはギリシャ鼻と呼ばれ、理財感覚に優れ実務能力が高いとされる。",
      },
      {
        id: "c",
        label: "獅子っ鼻・団子鼻(丸みを帯び幅広)",
        tone: "neutral",
        text: "鼻全体が丸みを帯び幅広に広がるタイプは人当たりがよく人望を集めやすい反面、判断が甘くなりやすい傾向があるとされる。",
      },
      {
        id: "d",
        label: "シラノ型(全体に大きい鼻)",
        tone: "neutral",
        text: "鼻全体が大ぶりなタイプは自尊心・自我が強く発達し、孤立しやすい面と行動力を併せ持つとされる。",
      },
      {
        id: "e",
        label: "くぼみ型・凹型(横から見て中央がへこむ)",
        tone: "neutral",
        text: "横から見て鼻筋の中央がへこむタイプは消極的・堅実な性格で、時代の流れを見て慎重に構える傾向があるとされる。",
      },
    ],
  },
  {
    key: "nose_habit_touch_fidget_sign",
    name: "鼻を触る・いじる癖と心理状態の伝統的な見方",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "頻繁に鼻を触る・いじる",
        tone: "caution",
        text: "話しながら頻繁に鼻に手をやったりいじったりする癖のある人は、内心の落ち着きのなさや、見栄・金銭の工面についての心配ごとを抱えていることの表れと伝統的に語られる。",
      },
      {
        id: "b",
        label: "小鼻がひくひく動く",
        tone: "neutral",
        text: "話す際に小鼻が細かく動く癖は、感情の変化が表情に出やすい性質の表れとされる。",
      },
    ],
  },
  {
    key: "nose_tip_fortune_timing",
    name: "準頭(鼻先)の発達時期と運の巡り方の伝統的対応",
    category: "顔",
    role: "鼻",
    options: [
      {
        id: "a",
        label: "準頭の発達が早い",
        tone: "positive",
        text: "準頭が若いうちからしっかり発達しているタイプは、比較的早くから運が安定してくる相とされる。",
      },
      {
        id: "b",
        label: "準頭の発達が遅い・段になっている",
        tone: "neutral",
        text: "準頭の発達が遅く、鼻筋に段(くぼみ)があるタイプは、運が巡ってくるのが中年以降になりやすい相として語られる。",
      },
    ],
  },
];
});
