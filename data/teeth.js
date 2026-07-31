/**
 * data/teeth.js
 * 第十一輯「人相学詳論(十八) 歯の相」より新規追加。
 * category「顔」role「歯」。他ファイルと同じUMDパターンで
 * root.TEETH としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TEETH = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "tooth_three_types_function",
    name: "歯の三種類(臼歯・犬歯・門歯)とその役割",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "基本の三分類",
        tone: "neutral",
        text: "歯には臼歯(奥歯)・犬歯(糸切り歯)・門歯(前歯)の三種類があり、それぞれ食物をすり潰す・引き裂く・かみ切るという異なる役割を持つとされる。",
      },
    ],
  },
  {
    key: "tooth_type_ratio_diet_reflection",
    name: "歯の種類の比率と食性の反映",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "肉食寄りの構成",
        tone: "neutral",
        text: "肉食性の強い動物ほど犬歯が発達し、草食性の強い動物ほど臼歯が発達する傾向があるとされる。人間は雑食性のため、三種類の歯をバランスよく備えているとされる。",
      },
    ],
  },
  {
    key: "tooth_organ_correspondence",
    name: "歯と内臓・神経系との伝統的な対応関係",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "門歯と全身状態",
        tone: "neutral",
        text: "門歯(前歯)は精神状態や全身のコンディションと関わりが深いとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "犬歯と体力面",
        tone: "neutral",
        text: "両脇の犬歯は体力面の充実度と関わりが深いとされる伝統的な見方があり、歯科治療で歯を抜く際には全身のバランスにも配慮するのが望ましいとされる。",
      },
    ],
  },
  {
    key: "tooth_anatomy_structure",
    name: "歯の断面構造(琺瑯質・象牙質・歯根)",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "基本構造",
        tone: "neutral",
        text: "歯は表面の硬い琺瑯質(エナメル質)とその内側の象牙質、根の部分の歯根から構成され、内部の髄腔には血管と神経が通っているという解剖学的な基礎知識。",
      },
    ],
  },
  {
    key: "tooth_eruption_timeline",
    name: "歯の生え変わりの一般的な時期",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "乳歯から永久歯へ",
        tone: "neutral",
        text: "生後7〜9ヶ月頃から乳歯が生え始め、2歳半頃までに乳歯20枚が生えそろい、6〜7歳頃から永久歯への生え変わりが始まって、親知らずを含め成人で合計32枚になるという一般的な発育の目安。",
      },
    ],
  },
  {
    key: "tooth_alignment_personality",
    name: "歯並びの乱れと性格の伝統的な見方",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "歯並びが整っている",
        tone: "positive",
        text: "歯並びが整っている人は、性格も落ち着きがあり物事に几帳面な傾向があるという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "歯並びが乱れている(乱杭歯)",
        tone: "caution",
        text: "歯並びが乱れている(乱杭歯)人は、性格にも何らかの偏りやくせが出やすいという伝統的な見方があるが、これは古い相法上の一般論であり、個人の人格を断定するものではない。",
      },
    ],
  },
  {
    key: "tooth_gap_center_incisors",
    name: "前歯の隙間・欠如と家族運・夫婦運の言い伝え",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "前歯の中央に隙間がある",
        tone: "caution",
        text: "前歯の中央に目立つ隙間がある相は、親子関係や夫婦関係にすれ違いが生じやすいという伝統的な言い伝えがある。",
      },
      {
        id: "b",
        label: "前歯が隙間なく揃っている",
        tone: "positive",
        text: "前歯が隙間なくきれいに揃っている相は、家族運・夫婦運が安定しやすいという伝統的な言い伝えがある。",
      },
    ],
  },
  {
    key: "tooth_pointed_canine_personality",
    name: "犬歯の尖りと家族との関係性の伝統的な見方",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "犬歯が鋭く尖って目立つ",
        tone: "caution",
        text: "犬歯が鋭く尖って目立つ相は、目上の人に反発しやすく、家族との関係で摩擦が起きやすい傾向があるという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "犬歯が目立たない",
        tone: "neutral",
        text: "犬歯があまり目立たない相は、家族との関係が穏やかに保たれやすいという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "tooth_size_uniformity_reading",
    name: "歯の大きさの揃い方と性格の伝統的な見方",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "大きさが揃っている",
        tone: "positive",
        text: "歯の大きさが全体的に揃っている人は、周囲との関係も穏やかに保ちやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "大小がまちまち",
        tone: "caution",
        text: "歯の大小がまちまちな人は、身内や親戚付き合いにおいて損得を意識しがちな面があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "tooth_color_whiteness_reading",
    name: "歯の白さ・色と健康・生活状態の伝統的な見方",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "白く艶のある歯",
        tone: "positive",
        text: "白く艶のある歯は健康状態が良く、生活も比較的安定していることの表れとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "黒ずみ・くすみのある歯",
        tone: "caution",
        text: "黒ずみやくすみが目立つ歯は、生活が不規則になりがちであることの表れとされる伝統的な見方がある。日々のケアを心がけることが望ましい。",
      },
    ],
  },
  {
    key: "tooth_folk_belief_hair_nerve",
    name: "歯・体毛・視力にまつわる民間信仰",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "体毛と歯の関係にまつわる言い伝え",
        tone: "neutral",
        text: "ひげなどの体毛と歯・神経系との関わりを説く古い民間信仰が伝統的に語られてきたが、あくまで昔からの言い伝えであり、科学的な根拠を示すものではない。",
      },
    ],
  },
  {
    key: "tooth_omens_collection",
    name: "歯の一行占い(玄竜子相法より・伝統的な短句集)",
    category: "顔",
    role: "歯",
    options: [
      {
        id: "a",
        label: "歯が小さく白い",
        tone: "caution",
        text: "歯が骨の余りとして小さく白く現れる相は、先天的に体が弱く発達が遅い暗示とされる伝統的な短句。",
      },
      {
        id: "b",
        label: "歯並びが密で美しい",
        tone: "positive",
        text: "歯並びが密で美しく艶のある相は、口を開いたときに親しみやすさが常に感じられ、吉相とされる伝統的な短句。",
      },
      {
        id: "c",
        label: "歯と歯の間に隙間がある",
        tone: "caution",
        text: "歯と歯の間に隙間が目立つ相は、身内との縁が薄くなりやすいという伝統的な短句。",
      },
      {
        id: "d",
        label: "笑うときに歯を見せない",
        tone: "neutral",
        text: "笑ったときにほとんど歯を見せない相は、心の内をあまり明かさない性格とされる伝統的な短句。",
      },
      {
        id: "e",
        label: "歯を大きく出さずに笑う",
        tone: "positive",
        text: "笑うときに歯を出しすぎず、程よく見せる相は落ち着いた性格の表れとされる伝統的な短句。",
      },
    ],
  },
];
});
