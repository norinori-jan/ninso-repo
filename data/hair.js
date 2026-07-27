(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HAIR = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
    {
      key: "hair_color_depth",
      name: "毛髪の色合い",
      category: "毛髪",
      role: "色",
      options: [
        {
          id: "jet_black_glossy",
          label: "艶のある黒色",
          tone: "positive",
          text: "艶のある濃い黒髪は、生命力や気力が充実していることを示すとされます。",
        },
        {
          id: "dull_brownish",
          label: "艶のない褐色がかった髪",
          tone: "neutral",
          text: "艶が乏しく褐色がかった髪は、体力や気力がやや落ち気味であることを示すとされます。栄養や休養を見直す目安になります。",
        },
        {
          id: "premature_white",
          label: "若い年齢での白髪",
          tone: "neutral",
          text: "若いうちから白髪が目立つ人は、神経を使いすぎる傾向や、責任を早くから背負ってきたことの表れとされます。",
        },
      ],
    },
    {
      key: "hair_whorl_direction",
      name: "つむじの向きと性格",
      category: "毛髪",
      role: "つむじ",
      options: [
        {
          id: "single_clean",
          label: "一つでくっきりしたつむじ",
          tone: "positive",
          text: "つむじが一つだけくっきりしている人は、性格もまとまりがあり、物事に対して素直に向き合うタイプとされます。",
        },
        {
          id: "double_whorl",
          label: "二つあるつむじ",
          tone: "neutral",
          text: "つむじが二つある人は、気性が人一倍強く、負けず嫌いで反抗心も強い傾向があるとされます。",
        },
        {
          id: "off_center",
          label: "中心から外れたつむじ",
          tone: "neutral",
          text: "つむじの位置が中心からずれている人は、独自のこだわりや、周囲とは違う視点を持ちやすいとされます。",
        },
      ],
    },
    {
      key: "hair_texture_type",
      name: "毛質(直毛・くせ毛・縮毛)と気質",
      category: "毛髪",
      role: "質",
      options: [
        {
          id: "straight",
          label: "直毛",
          tone: "positive",
          text: "まっすぐな直毛の人は、比較的単純明快な性格で、素直に物事に反抗したり賛成したりするタイプとされます。",
        },
        {
          id: "wavy",
          label: "くせ毛・波打つ毛",
          tone: "neutral",
          text: "波打つくせ毛の人は、色情が盛んで根気にむらが出やすい傾向があるとされます。",
        },
        {
          id: "curly_tight",
          label: "縮れ毛",
          tone: "neutral",
          text: "強く縮れた毛の人は、傾向が極端に出やすく、色情面でも根気の面でも振れ幅が大きいとされます。",
        },
      ],
    },
    {
      key: "hair_baldness_pattern",
      name: "体質別のはげ方",
      category: "毛髪",
      role: "はげ",
      options: [
        {
          id: "shinsei_type",
          label: "心性質型のはげ方",
          tone: "neutral",
          text: "神経質・思考型の体質の人は、頭頂部から薄くなっていく傾向があるとされます。",
        },
        {
          id: "eiyou_type",
          label: "営養質型のはげ方",
          tone: "neutral",
          text: "ふくよかで穏やかな体質の人は、生え際からじわじわと後退していくM字型の薄毛になりやすいとされます。",
        },
        {
          id: "kinkotsu_type",
          label: "筋骨質型のはげ方",
          tone: "positive",
          text: "がっしりした活動的な体質の人は、比較的はげにくく、薄くなっても進行がゆるやかな傾向があるとされます。",
        },
      ],
    },
    {
      key: "hairline_m_shape",
      name: "生え際のM字後退",
      category: "毛髪",
      role: "生え際",
      options: [
        {
          id: "slow_symmetrical",
          label: "左右均等にゆっくり後退",
          tone: "positive",
          text: "生え際が左右均等にゆっくりと後退していく人は、心身のバランスが取れたまま歳を重ねていくタイプとされます。",
        },
        {
          id: "fast_asymmetrical",
          label: "片側だけ急に後退",
          tone: "neutral",
          text: "生え際の後退が左右非対称で急に進む人は、心労や偏った生活習慣の影響が出やすいとされます。",
        },
      ],
    },
    {
      key: "hair_density_vitality",
      name: "毛の太さ・密度と体力・気力",
      category: "毛髪",
      role: "密度",
      options: [
        {
          id: "thick_dense",
          label: "太くて密度が高い",
          tone: "positive",
          text: "毛が太く密度も高い人は、体力・気力ともに充実しており、粘り強く物事に取り組めるタイプとされます。",
        },
        {
          id: "thin_sparse",
          label: "細くて密度が低い",
          tone: "neutral",
          text: "毛が細く密度も低めの人は、繊細で頭脳労働向きの体質である一方、体力面ではやや無理が利きにくいとされます。",
        },
      ],
    },
    {
      key: "hair_growth_line_marks",
      name: "生え際周辺のホクロ・特徴",
      category: "毛髪",
      role: "生え際",
      options: [
        {
          id: "mole_near_temple",
          label: "こめかみ寄りの生え際にホクロ",
          tone: "neutral",
          text: "こめかみに近い生え際のホクロは、若い頃の環境の変化や、進学・就職などの転機を示すとされます。",
        },
        {
          id: "clean_hairline",
          label: "ホクロや傷のないきれいな生え際",
          tone: "positive",
          text: "生え際にホクロや傷のない人は、若年期を比較的平穏に過ごしてきたことを示すとされます。",
        },
      ],
    },
  ];
});
