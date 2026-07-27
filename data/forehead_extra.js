(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FOREHEAD_EXTRA = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
    {
      key: "forehead_three_sections",
      name: "額の三部構成(推理・記憶・直観)",
      category: "顔",
      role: "額",
      options: [
        {
          id: "upper_wide",
          label: "上部(生え際寄り)が発達",
          tone: "positive",
          text: "額の上部、生え際に近い部分がよく発達している人は、抽象的に考えたり見識を広げたりする推理的な働きに優れる傾向があるとされます。新しい知識を取り入れる吸収力にも恵まれます。",
        },
        {
          id: "middle_wide",
          label: "中部(眉丘の上あたり)が発達",
          tone: "neutral",
          text: "額の中央、眉のすぐ上あたりが豊かに盛り上がっている人は、物事を記憶しとどめておく力の中心がしっかりしているとされ、経験を蓄積して活かすタイプと見られます。",
        },
        {
          id: "lower_wide",
          label: "下部(眉丘そのもの)が発達",
          tone: "neutral",
          text: "眉丘そのものが張り出している人は、理屈より先に感覚的なひらめきで動く直観型とされます。とっさの判断力に長ける一方、じっくり考える前に動いてしまう面もあります。",
        },
        {
          id: "balanced",
          label: "三部がおおむね均等",
          tone: "positive",
          text: "上・中・下の三部の発達に極端な偏りがない人は、推理・記憶・直観のバランスが取れており、状況に応じて柔軟に頭の使い方を切り替えられるタイプです。",
        },
      ],
    },
    {
      key: "forehead_three_qualities_shape",
      name: "額の形と三質論(心性質・営養質・筋骨質)",
      category: "顔",
      role: "額",
      options: [
        {
          id: "shinsei_upper",
          label: "心性質型(丸く秀でた上相)",
          tone: "positive",
          text: "額が丸みを帯びて秀でている心性質型は、繊細で頭脳労働に向く神経質な体質とされ、考えることや工夫することを好みます。",
        },
        {
          id: "shinsei_lower",
          label: "心性質型(中央がへこんだ下相)",
          tone: "neutral",
          text: "同じ心性質でも額の中央がややへこんで見えるタイプは、上相ほどの発達はないものの、依然として思考型・神経質な傾向を持つとされます。",
        },
        {
          id: "kinkotsu",
          label: "筋骨質型(角張った額)",
          tone: "neutral",
          text: "角張ってがっしりした筋骨質型の額は、実行力や行動力を重視する体質とされ、じっと考えるより体を動かして結果を出すタイプに向くとされます。",
        },
        {
          id: "eiyou",
          label: "営養質型(丸くふくよかな額・女額)",
          tone: "neutral",
          text: "丸くふくよかな営養質型の額(俗にいう女額)は、穏やかで人当たりのよい性質を示すとされ、対人関係の柔らかさが特徴です。",
        },
        {
          id: "fuji_eiyou",
          label: "富士額(参差)営養質型",
          tone: "neutral",
          text: "富士額のように中央がやや尖り、生え際に凹凸(参差)がある営養質型は、穏やかさの中にも独自の主張やこだわりを併せ持つタイプとされます。",
        },
        {
          id: "mixed",
          label: "筋骨・心性・営養の混合質",
          tone: "positive",
          text: "三質が入り混じった混合質の額は、一つの傾向に偏らず、状況に応じて実行力・思考力・協調性を使い分けられるバランス型とされます。",
        },
      ],
    },
    {
      key: "forehead_fuji_shape",
      name: "富士額の諸相",
      category: "顔",
      role: "額",
      options: [
        {
          id: "single_v",
          label: "中央に一つのV字",
          tone: "neutral",
          text: "生え際中央が一つだけV字に下がる典型的な富士額は、意志が強く物事を最後までやり抜く粘り強さの表れとされます。",
        },
        {
          id: "double_peak",
          label: "二つの山(参差)がある富士額",
          tone: "neutral",
          text: "富士額の山が二つに分かれて見えるタイプは、一つのことに集中しきれず気持ちが揺れやすい面がある一方、多方面に関心を持てる柔軟さもあるとされます。",
        },
        {
          id: "shallow",
          label: "浅く目立たない富士額",
          tone: "positive",
          text: "富士額の凹凸が浅く目立たない人は、こだわりが強すぎず周囲と協調しやすいタイプとされます。",
        },
      ],
    },
    {
      key: "forehead_goose_pattern",
      name: "雁紋(額の横皺の本数)",
      category: "顔",
      role: "額",
      options: [
        {
          id: "one_line",
          label: "一本だけ通った横皺",
          tone: "neutral",
          text: "額に一本だけくっきりと通った横皺(雁紋)がある人は、他人に頼らず自分の考えで道を切り開こうとする独立独歩の気質が強いとされ、良くも悪くも単独行動になりがちです。",
        },
        {
          id: "two_lines",
          label: "二本の横皺",
          tone: "positive",
          text: "雁紋が二本ある人は、自分の意志を貫きつつも周囲との交際や金銭のやりくりにそつがなく、バランスの取れた生き方をするとされます。",
        },
        {
          id: "three_lines",
          label: "三本きれいに通った横皺",
          tone: "positive",
          text: "雁が並んで飛ぶような形にきれいに三本通った雁紋は、宗教家や精神的な仕事に通じるような信念の強さを示すとされます。",
        },
        {
          id: "broken_messy",
          label: "切れ切れ・乱れた横皺",
          tone: "negative",
          text: "雁紋が途中で途切れたり乱れたりしている人は、一貫した方針を貫きにくく、計画が変わりやすい傾向があるとされます。",
        },
      ],
    },
    {
      key: "forehead_official_fortune_zone",
      name: "命宮・官禄の部位",
      category: "顔",
      role: "額",
      options: [
        {
          id: "meikyu_full",
          label: "命宮(眉間)が広く豊か",
          tone: "positive",
          text: "眉間にあたる命宮が広くふっくらとしている人は、自我や意志の力が安定しており、物事に動じにくいとされます。",
        },
        {
          id: "meikyu_narrow",
          label: "命宮が狭い・くぼんでいる",
          tone: "negative",
          text: "命宮が狭くくぼんでいる人は、些細なことに気を取られやすく、心配性になりがちな面があるとされます。",
        },
        {
          id: "kanroku_high",
          label: "官禄の部位(命宮上部)が高く豊か",
          tone: "positive",
          text: "命宮の上、官禄にあたる部分が高くしっかりしている人は、組織の中で信頼を得て地位を築きやすいとされます。",
        },
        {
          id: "kanroku_low",
          label: "官禄の部位が低い・狭い",
          tone: "neutral",
          text: "官禄の部位が低め・狭めの人は、組織に属するより独立自営で小回りよく動くほうが性に合うとされます。",
        },
      ],
    },
    {
      key: "forehead_color_reading",
      name: "額の色つや",
      category: "顔",
      role: "色",
      options: [
        {
          id: "bright_clear",
          label: "明るく血色がよい",
          tone: "positive",
          text: "額の血色がよく明るく見える時は、気力・運気ともに充実している状態とされます。",
        },
        {
          id: "dull_dark",
          label: "くすんで血色が悪い",
          tone: "negative",
          text: "額がくすんで血色が悪く見える時は、心身の疲労や運気の停滞を示しているとされ、無理をせず休養を取ることが勧められます。",
        },
        {
          id: "reddish",
          label: "赤みが強く出ている",
          tone: "negative",
          text: "額に赤みが強く出ている時は、気持ちが高ぶって短気になりやすい状態を示すとされます。",
        },
      ],
    },
    {
      key: "forehead_mole_position",
      name: "額のホクロ・傷の位置",
      category: "顔",
      role: "額",
      options: [
        {
          id: "center_glabella",
          label: "眉間(命宮)のホクロ",
          tone: "negative",
          text: "命宮にあたる眉間のホクロは、心配事や気苦労が絶えないことを示すとされます。",
        },
        {
          id: "upper_forehead",
          label: "額の上部(官禄)のホクロ",
          tone: "neutral",
          text: "額の上部にあるホクロは、仕事や地位の面での波乱を示すとされ、転機が訪れやすい相とされます。",
        },
        {
          id: "side_forehead",
          label: "こめかみ寄りのホクロ",
          tone: "neutral",
          text: "額の両端、こめかみに近い位置のホクロは、人間関係や交際面での変化を示すとされます。",
        },
      ],
    },
    {
      key: "forehead_birth_order_belief",
      name: "額の形と兄弟順にまつわる俗信",
      category: "顔",
      role: "額",
      options: [
        {
          id: "eldest_wide",
          label: "額が広く発達",
          tone: "neutral",
          text: "古くからの俗信として、額が広く発達している人は家督や責任を担う立場になりやすいと言われてきました。実際の出生順とは必ずしも一致しない、あくまで伝統的な見方の一つです。",
        },
        {
          id: "narrow_forehead",
          label: "額が狭くこぢんまり",
          tone: "neutral",
          text: "額が狭くこぢんまりとした人は、家を継ぐより早くに独立して外へ出ていく気質が強いとされてきました。こちらも伝統的な俗信であり、個人の資質を決めるものではありません。",
        },
      ],
    },
    {
      key: "skull_width_reasoning",
      name: "頭部の幅と推理力・見識(C1/C2比較)",
      category: "骨相学",
      role: "頭部",
      options: [
        {
          id: "wide_c2",
          label: "こめかみ付近まで幅広い",
          tone: "positive",
          text: "頭部がこめかみ付近まで幅広く発達している人は、推理推考の及ぶ範囲が広く、見識も広いタイプとされます。",
        },
        {
          id: "narrow_c1",
          label: "幅が狭くまとまっている",
          tone: "neutral",
          text: "頭部の幅が比較的狭くまとまっている人は、広く浅くよりも一点を掘り下げて考える集中型の思考をするとされます。",
        },
      ],
    },
    {
      key: "forehead_symmetry",
      name: "額の左右対称性",
      category: "顔",
      role: "額",
      options: [
        {
          id: "symmetrical",
          label: "左右がよく揃っている",
          tone: "positive",
          text: "額の左右のふくらみがよく揃っている人は、物事の判断が偏りにくく、公平にものを見られるとされます。",
        },
        {
          id: "asymmetrical",
          label: "左右差がある",
          tone: "neutral",
          text: "額の左右に差がある人は、感情や考え方に偏りが出やすい一方、独自の視点を持ちやすいともされます。",
        },
      ],
    },
    {
      key: "glabella_health_sign",
      name: "眉間(攢竹)の色つやによる健康・気力の見立て",
      category: "顔",
      role: "色",
      options: [
        {
          id: "clear_bright",
          label: "眉間の色つやが良い",
          tone: "positive",
          text: "眉間(攢竹)の色つやが良く血色がある時は、心身ともに充実し、物事に取り組む気力が満ちている状態とされます。",
        },
        {
          id: "dull_stagnant",
          label: "眉間の色がくすんでいる",
          tone: "negative",
          text: "眉間の色がくすみ生気に欠ける時は、疲労の蓄積や気力の低下を示すサインとされ、無理を控えることが勧められます。",
        },
      ],
    },
  ];
});
