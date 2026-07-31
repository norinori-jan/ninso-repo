/**
 * data/ear.js
 * 第十一輯「人相学詳論(十九) 耳の相」より新規追加。
 * category「顔」role「耳」。他ファイルと同じUMDパターンで
 * root.EAR としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EAR = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "ear_completion_order_belief",
    name: "耳が顔の中で最も早く完成するという伝統的な言い伝え",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "胎児期の発達順序",
        tone: "neutral",
        text: "耳は顔の部位の中で最も早く完成するとされ、聴覚器官としての役割と同時に、遺伝的な傾向や環境・運勢を映す部位としても古くから重視されてきたという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "ear_age_classification_pattern",
    name: "年代による耳の変化(童・中・老の目安)",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "幼少期(童)",
        tone: "neutral",
        text: "幼少期の耳は全体に短めで小さく、前方寄りに位置し、耳たぶの張り出しが少ない傾向があるという伝統的な見方の目安。",
      },
      {
        id: "b",
        label: "壮年期(中)",
        tone: "positive",
        text: "壮年期には耳の長さ・大きさとも中程度に整い、位置も中位で、厚みも増して安定した形になるという伝統的な見方の目安。",
      },
      {
        id: "c",
        label: "老年期(老)",
        tone: "neutral",
        text: "老年期には耳が長くなり、位置がやや後方に下がり、耳たぶが目立って張り出してくる傾向があるという伝統的な見方の目安。",
      },
    ],
  },
  {
    key: "ear_anatomy_terminology",
    name: "耳介各部の名称(天輪・人輪・地輪・風門)",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "基本の部位名称",
        tone: "neutral",
        text: "耳の外側の縁を天輪(輪)、その内側の隆起を人輪(廓)、耳たぶを地輪(垂珠)と呼び、耳の穴の入口周辺を風門と呼ぶ、相学上の伝統的な名称体系がある。",
      },
    ],
  },
  {
    key: "ear_position_height_reading",
    name: "耳の位置の高さと知性の伝統的な見方",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "眉・目の高さより上に位置する耳",
        tone: "positive",
        text: "眉や目の位置を結んだ線より耳が高い位置にある人は、頭脳が発達しているという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "眉・目の高さより下に位置する耳",
        tone: "neutral",
        text: "眉や目の位置を結んだ線より耳が低い位置にある人は、その分知的な発達がゆるやかであるという伝統的な見方があるが、あくまで古い相法上の一般論にとどまる。",
      },
    ],
  },
  {
    key: "ear_zone_map_meaning",
    name: "耳の部位対応(心性・智恵・筋骨・意志・営養など)",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "耳を分割して読む伝統的な区分",
        tone: "neutral",
        text: "耳を上部(心性・名誉心・智恵)・中部(筋骨・意志・権力心)・下部(営養・物質心・締括り・実行)のように区分し、それぞれの発達具合から性格の傾向を読むという相学上の伝統的な区分法がある。",
      },
    ],
  },
  {
    key: "ear_size_lucky_ear_belief",
    name: "耳の大きさ・福耳の伝統的な意味",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "大きくふくよかな耳(福耳)",
        tone: "positive",
        text: "大きくふくよかな耳は「福耳」と呼ばれ、古くから縁起の良い相として親しまれてきた伝統的な見方がある。",
      },
      {
        id: "b",
        label: "小さく薄い耳",
        tone: "caution",
        text: "小さく薄い耳は、身内との縁がやや薄くなりやすいという伝統的な見方があるが、断定的なものではない。",
      },
    ],
  },
  {
    key: "ear_color_health_link",
    name: "耳の色つやと健康状態の伝統的な関連",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "艶やかで血色の良い耳",
        tone: "positive",
        text: "耳が艶やかで血色が良い人は、体調が整っていて将来性のある相とされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "色つやに乏しい耳",
        tone: "caution",
        text: "耳の色つやに乏しい人は、体調を崩しやすい傾向にあるという伝統的な見方があるが、気になる場合は医療機関に相談するのが望ましい。",
      },
    ],
  },
  {
    key: "ear_lobe_development_by_age",
    name: "耳たぶ(垂珠)の発達具合の年代変化",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "幼少期の耳たぶ",
        tone: "neutral",
        text: "幼少期は耳たぶがまだ小さく、成長とともに徐々にふくよかになっていくのが一般的な発達の目安とされる。",
      },
    ],
  },
  {
    key: "ear_rim_development_family_bond",
    name: "耳の輪(天輪)の発達具合と親との縁の伝統的な言い伝え",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "耳の輪がしっかり発達している",
        tone: "positive",
        text: "耳の輪(天輪)がしっかり発達している人は、両親との縁も安定しやすいという伝統的な言い伝えがある。",
      },
      {
        id: "b",
        label: "耳の輪の発達が乏しい",
        tone: "caution",
        text: "耳の輪の発達が乏しい人は、片方の親との縁がやや薄くなりやすいという伝統的な言い伝えがあるが、あくまで古い相法上の一般論にとどまる。",
      },
    ],
  },
  {
    key: "ear_folk_omens_collection",
    name: "耳にまつわる伝統的な言い伝え集",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "耳の穴に毛が生えている",
        tone: "positive",
        text: "耳の穴から毛が生えている人は長命の相であるという伝統的な言い伝え。",
      },
      {
        id: "b",
        label: "耳あかが湿っている",
        tone: "neutral",
        text: "耳あかが乾いていず湿り気を帯びている体質は、体臭が出やすい体質と結びつけて語られることがある伝統的な言い伝え(医学的な断定ではない)。",
      },
      {
        id: "c",
        label: "耳にホクロがある",
        tone: "neutral",
        text: "耳にホクロがある相は、その位置によって家族運や財運に関する伝統的な言い伝えと結びつけて語られることがある。",
      },
    ],
  },
  {
    key: "ear_orientation_career_suitability",
    name: "耳の向き・立ち方と職業適性の伝統的な見方",
    category: "顔",
    role: "耳",
    options: [
      {
        id: "a",
        label: "前向きに立っている耳",
        tone: "neutral",
        text: "耳がやや前を向いて立っている人は、聡明で頭の回転が速いタイプとされ、文筆業に向いているという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "普通の向きの耳",
        tone: "neutral",
        text: "耳が標準的な向きで頭に沿っている人は、特定の職業への向き不向きが極端に出にくいという伝統的な見方がある。",
      },
    ],
  },
];
});
