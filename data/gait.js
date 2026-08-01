/**
 * data/gait.js
 * 第十二輯「挙動と音声(挙動)」より新規追加。category「行動」role「挙動」。
 * 他の顔データファイルと同じUMDパターンで root.GAIT としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GAIT = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "gait_reflects_personality_overview",
    name: "歩き方が人柄を映すという伝統的な考え方",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "眼・声と並ぶ観察対象としての挙動",
        tone: "neutral",
        text: "人相学では、眼や声だけでなく、歩き方・座り方・言葉づかいなど日常の立ち居振る舞い(挙動)も、その人の心の状態や個性を映し出す重要な観察対象とされてきた。特に歩き方は無意識のうちに繰り返される動作であるため、その人の性質がそのまま表れやすいと考えられている。",
      },
    ],
  },
  {
    key: "gait_speed_energy_reading",
    name: "歩く速さにまつわる性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "気ぜわしく早足で歩く人",
        tone: "caution",
        text: "常にせかせかと急ぎ足で歩く人は、気持ちが急いていて落ち着きに欠ける傾向があるとされる伝統的な見方がある。精神を落ち着けることが、行動全体を安定させる助けになるとされる。",
      },
      {
        id: "b",
        label: "ゆったりと落ち着いて歩く人",
        tone: "positive",
        text: "足取りが重すぎず軽すぎず、ゆっくりと落ち着いた足取りで歩く人は、心にも余裕があり、物事に動じにくい性格とされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_stride_weight_balance_reading",
    name: "歩幅・足の運びの重心にまつわる性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "前足に力を入れて歩く人",
        tone: "neutral",
        text: "前に出す足にしっかりと力を込め、後ろの足の力を抜くようにして歩く人は、物事に向かっていく積極性を持つタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "足を引きずるように歩く人",
        tone: "caution",
        text: "足を地面から十分に上げず、引きずるように歩く人は、心も足取りと同じように停滞しがちで、物事に対して踏ん切りがつきにくい傾向があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_posture_slouch_reading",
    name: "猫背・前かがみで歩く人の性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "猫背で首を突き出して歩く型",
        tone: "caution",
        text: "背中を丸め、首を前に突き出すようにして歩く人は、自分の個性に従って行動しがちで、周囲との足並みが乱れやすい面があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_animal_metaphor_collection",
    name: "歩き方を動物にたとえる伝統的な分類",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "虎のように力強く歩く型",
        tone: "positive",
        text: "古い相法では、歩き方を動物の動きにたとえて分類することがあった。虎が歩くように、身体を静かに保ちながらも足腰にどっしりとした重みと力がある歩き方は、才覚と度胸を兼ね備えた人物の相として吉とされた。",
      },
      {
        id: "b",
        label: "蛇や雀のように落ち着きなく歩く型",
        tone: "caution",
        text: "蛇がくねるように身体を左右に曲げて歩く型や、雀が跳ねるように地に足がつかない様子で歩く型は、決断力に乏しく、物事が長続きしにくい傾向を示すとされた。あくまで古い比喩的な分類である。",
      },
    ],
  },
  {
    key: "gait_toe_heel_pressure_reading",
    name: "爪先・かかとへの重心のかけ方にまつわる性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "爪先に力を入れて歩く人",
        tone: "neutral",
        text: "爪先にしっかり力を入れて歩く人は、目的に向かって意志を貫こうとする力の強い人であるとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "爪先立ちのような歩き方をする人",
        tone: "neutral",
        text: "爪先立ちのように軽やかに歩く人は、意欲的で機敏な反面、物事を早合点しやすい面があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_looking_around_reading",
    name: "歩きながらきょろきょろする癖にまつわる性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "絶えずあたりを見回しながら歩く型",
        tone: "caution",
        text: "歩きながら絶えず周囲をきょろきょろと見回す癖のある人は、落ち着きに欠け、警戒心が強い一方で信用を得にくい面があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_head_direction_reading",
    name: "うつむき・仰向いて歩く癖にまつわる性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "うつむき加減で歩く型",
        tone: "caution",
        text: "終始うつむき加減で歩く人は、控えめで自己主張が少ない反面、消極的で発展性に欠けやすい傾向があるとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "仰向いて歩く型",
        tone: "caution",
        text: "顔を仰向け気味にして歩く人は、多少なりとも他人を見下したような印象を与えやすく、自信過剰と受け取られやすい面があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_mimicry_self_improvement_belief",
    name: "良い歩き方を意識して真似ることで精神を養うという考え方",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "歩き方を改めることで心も整うという伝統的な発想",
        tone: "positive",
        text: "人相学の古い教えでは、歩き方は生まれつきの癖であっても、意識して丁寧に正しい歩き方を心がけることで、次第に精神状態や運気も好転していくとされる。姿勢を正すことが、後天的な開運法の一つになるという考え方である。",
      },
    ],
  },
  {
    key: "gait_cane_carrying_reading",
    name: "杖を立てるように歩く人の性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "見栄っ張りで実質を伴わない印象を与える型",
        tone: "caution",
        text: "杖を大げさに突き立てるようにして歩く人は、見栄を張りがちで、私通(隠れた交際)に気を配るような心があるとされる古い言い伝えがある。あくまで古い相法上の言い伝えであり、現代の実際の人間関係を断定するものではない。",
      },
    ],
  },
  {
    key: "gait_calm_confident_pace_reading",
    name: "急がず騒がず一定の調子で歩く人の性格傾向",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "呼吸と歩調が一致した落ち着いた歩き方",
        tone: "positive",
        text: "急ぎもせず、だらだらともせず、呼吸と歩調が自然に一致した落ち着いた歩き方をする人は、精神的にも安定しており、大きな仕事を任せても動じにくいタイプとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "gait_inward_outward_toe_historical_pattern",
    name: "内輪・外輪(つま先の向き)にまつわる歴史的な言い伝え",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "つま先を内側に向けて歩く型・外側に向けて歩く型",
        tone: "neutral",
        text: "つま先をやや内側に向けて歩く型を「内輪」、外側に向けて歩く型を「外輪」と呼ぶ古い分類がある。時代や地域の風俗・服装文化によって、どちらが好まれるかが移り変わってきたとされ、一方が優れているというよりも時代背景による流行の違いとして紹介される。",
      },
    ],
  },
  {
    key: "gait_habitual_correction_effort",
    name: "癖のある歩き方を改める努力にまつわる伝統的な戒め",
    category: "行動",
    role: "挙動",
    options: [
      {
        id: "a",
        label: "自分の歩き方の癖に気づき正すことの大切さ",
        tone: "positive",
        text: "外交や交渉ごとに携わる人物ほど、自分の歩き方の癖に気を配り、軽々しく見える動作を改めるべきだという古い戒めがある。歩き方だけでなく、あらゆる挙動について自分の癖を自覚し、必要に応じて正していく姿勢が大切だとされる。",
      },
    ],
  },
  ];
});
