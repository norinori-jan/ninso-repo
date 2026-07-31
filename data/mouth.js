/**
 * data/mouth.js
 * 第十一輯「人相学詳論(十七) 口の相(二)」より新規追加。
 * category「顔」role「口」。他ファイルと同じUMDパターンで
 * root.MOUTH としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MOUTH = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "mouth_lower_lip_taste_sensitivity",
    name: "下唇の発達と味覚の鋭さ・料理の才能",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "下唇が厚く発達している",
        tone: "positive",
        text: "下唇は味覚と関わりが深い部位とされ、下唇が厚く発達している人は味覚が鋭敏で、見た目にも美味しそうな盛り付けを工夫するセンスに恵まれ、料理の才能に結びつきやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "下唇が薄く小さい",
        tone: "caution",
        text: "下唇が薄く小さい人は、味覚がやや鈍感で、料理を作ることがあまり得意ではない傾向があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "mouth_size_vitality_elasticity",
    name: "口の大きさ・弾力性と生活力",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "大きく弾力のある口",
        tone: "positive",
        text: "口が大きく、開閉に弾力性・伸縮性がある人は生命力にあふれ、家庭運も晩年にかけて豊かになりやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "小さく引き締まった口",
        tone: "caution",
        text: "口が小さく引き締まっている人は、金銭に堅実で経済観念がしっかりしている一方、変化に乏しく、思い切った勝負に出る度胸にはやや欠ける傾向があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "mouth_protrusion_instinct_type",
    name: "口元の突出度と本能的傾向",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "横から見て唇が突き出ている",
        tone: "caution",
        text: "横から見たときに唇がとび出したように見える口は、本能的・野性的な傾向が強い相として伝統的に語られる。欲求に素直で、行動力を伴いやすいタイプとされる。",
      },
      {
        id: "b",
        label: "唇があまり突き出ていない",
        tone: "neutral",
        text: "唇の突出があまり目立たない口は、消極的・温厚な傾向として伝統的に語られる。人と争うことを好まず、落ち着いた家庭を築きやすいとされる。",
      },
    ],
  },
  {
    key: "lip_thickness_altruism_selfishness",
    name: "上唇・下唇の厚さと利他性・利己性",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "上唇が下唇より厚い",
        tone: "positive",
        text: "上唇が下唇より厚い相は利他的な心の表れとされ、家庭をよくまとめる人が多いという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "下唇が上唇より厚い",
        tone: "caution",
        text: "下唇が上唇より厚い相は利己的な面が出やすいとされる一方、実務的でしっかり者という側面もあわせて語られる。",
      },
    ],
  },
  {
    key: "mouth_size_ambition_scale",
    name: "口の大きさと事業欲・度量",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "大きい口",
        tone: "positive",
        text: "口が大きい人は度量が大きく、思い切った事業を興す実業家タイプに向いているという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "小さい口",
        tone: "neutral",
        text: "口が小さい人は堅実で倹約家、金銭にシマリのあるタイプとされる。宗教・芸術・学問といった方面への関心はやや薄めとされることもある。",
      },
    ],
  },
  {
    key: "lip_line_clarity_chastity",
    name: "上唇の輪郭線と自制心の伝統的な見方",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "上唇の線が直線的で鮮明",
        tone: "positive",
        text: "上唇の輪郭線が直線的で鮮明な人は、育ちの良い家庭で規律正しく育った相とされ、自制心や貞操観念が強い傾向として伝統的に語られる。",
      },
      {
        id: "b",
        label: "上唇の線がぼやけて厚みがある",
        tone: "neutral",
        text: "上唇の輪郭線がぼやけて厚みのある人は、情に厚く能動的な性格とされる一方、誘惑にやや流されやすい面もあわせて語られる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "lip_color_health_omen",
    name: "唇の色と健康状態・体調の目安",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "血色の良い赤み",
        tone: "positive",
        text: "唇に自然な赤みがあり血色が良い人は、健康で運気も安定しやすい相として伝統的に語られる。",
      },
      {
        id: "b",
        label: "白っぽい・青白い唇",
        tone: "caution",
        text: "唇が白っぽく血色に乏しい人は、体調を崩しやすい・無理をしている暗示とされる伝統的な見方がある。体調に不安がある場合は専門家に相談するのが望ましい。",
      },
      {
        id: "c",
        label: "赤みが強すぎる唇",
        tone: "caution",
        text: "唇の赤みが不自然に強い場合は、のぼせやすい・興奮しやすい体質の暗示として語られることがある伝統的な見方であり、断定的な診断ではない。",
      },
    ],
  },
  {
    key: "mouth_expression_habit_fortune",
    name: "話す時の口元の癖と運気の目安",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "口角が自然に上がっている",
        tone: "positive",
        text: "普段から口角が自然に上がっている人は、運気が良く晩年も安定しやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "口を歪める・口角が下がる癖",
        tone: "caution",
        text: "話すときに口を歪める癖がある人や、普段から口角が下がりがちな人は、生活の面で行き詰まりを感じている表れとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "lip_mole_speech_caution",
    name: "唇周辺のホクロと言葉・出費を慎む戒め",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "唇の近くにホクロがある",
        tone: "caution",
        text: "唇の近くにホクロがある相は、うっかりした失言や不用意な出費に注意すべきという伝統的な戒めとして語られる。",
      },
    ],
  },
  {
    key: "smile_teeth_gum_visibility",
    name: "笑った時の歯・歯茎の見え方による性格の伝統的な見方",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "上下の歯がバランスよく見える笑顔",
        tone: "positive",
        text: "笑ったときに上下の歯がバランスよく見える人は、素直で朗らかな性格の表れとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "歯茎まで見える笑顔",
        tone: "caution",
        text: "笑ったときに歯茎まで大きく見える人は、感情表現が大きく率直なタイプとされる一方、家庭内のことにルーズになりやすい面もあわせて語られる伝統的な見方がある。",
      },
      {
        id: "c",
        label: "歯をあまり見せずに笑う・口をすぼめる",
        tone: "neutral",
        text: "笑うときに歯をあまり見せない、口をすぼめて笑う人は、用心深く秘密主義な傾向があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "mouth_intake_outtake_restraint",
    name: "口の役割と言語・飲食の慎みの伝統的な戒め",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "出入りを司る器官としての口",
        tone: "neutral",
        text: "口は言葉を発する出口であると同時に食を摂り入れる入口でもあるとされ、話し方と食べ方の両方に節度を持つことが大切だという伝統的な戒めが語られる。",
      },
    ],
  },
  {
    key: "mouth_expression_fortune_cultivation",
    name: "口の表情による後天的な開運法",
    category: "顔",
    role: "口",
    options: [
      {
        id: "a",
        label: "明るい表情を意識する",
        tone: "positive",
        text: "口元の表情は先天的な相だけでなく、日頃の心がけによって後天的に変化しうる重要なポイントとされる。明るい表情を意識することが開運につながるという伝統的な考え方がある。",
      },
    ],
  },
];
});
