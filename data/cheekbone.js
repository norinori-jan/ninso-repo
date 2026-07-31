/**
 * data/cheekbone.js
 * 第十一輯「人相学詳論(二十) 観骨の相」より新規追加。
 * category「顔」role「観骨」。他ファイルと同じUMDパターンで
 * root.CHEEKBONE としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CHEEKBONE = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "cheekbone_bone_vs_flesh_prominence",
    name: "観骨の張り方(骨によるものと肉づきによるもの)",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "骨格そのものが張っている",
        tone: "neutral",
        text: "観骨(頬骨)が骨格そのものによって張っている相は、先天的な意志の強さを示すという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "肉づきによって張って見える",
        tone: "neutral",
        text: "観骨が肉づきによって後天的に張って見える相は、生活の中で培われた粘り強さを示すという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "cheekbone_prominent_independence",
    name: "観骨が張った人の仕事運・独立志向の伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "観骨が程よく張っている",
        tone: "positive",
        text: "観骨が程よく張っている人は、テキパキとした仕事ぶりで、交渉事でも簡単には引き下がらない独立心の強いタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "観骨が目立たない",
        tone: "neutral",
        text: "観骨があまり目立たない人は、穏やかで周囲に合わせるのが得意なタイプとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "cheekbone_overprominent_stubbornness",
    name: "観骨の張りすぎと頑固さの伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "観骨が過度に張っている",
        tone: "caution",
        text: "観骨が過度に張っている相は、意志が強すぎて頑固になりやすく、家庭内でも自分の意見を譲らない傾向があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "cheekbone_color_trust_reading",
    name: "観骨の血色と商売上の信用の伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "観骨の血色が良い",
        tone: "positive",
        text: "観骨の血色が良い人は、商売上の信用状態も良く、周囲から資金面の相談を持ちかけられやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "観骨の血色が悪い",
        tone: "caution",
        text: "観骨の血色が悪い人は、そのときの体調や信用状態がやや不安定であることを示す暗示として伝統的に語られる。",
      },
    ],
  },
  {
    key: "cheekbone_climate_adaptation_theory",
    name: "観骨の張りと気候適応の一般論",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "寒冷な地域に多いとされる型",
        tone: "neutral",
        text: "寒冷な気候に適応する過程で観骨が発達しやすくなるという一般論が伝統的に語られてきた(体温保持のための形態適応という考え方)。",
      },
      {
        id: "b",
        label: "温暖な地域に多いとされる型",
        tone: "neutral",
        text: "温暖な気候に適応する過程では観骨の張りが控えめになりやすいという一般論が伝統的に語られてきた。",
      },
    ],
  },
  {
    key: "cheekbone_side_profile_direction_type",
    name: "観骨の側面での張り方向による性格の伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "上向きに張るタイプ",
        tone: "positive",
        text: "観骨が側面から見て上向きに張っているタイプは、知的な仕事に向いた学者肌の性格とされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "外向きに張るタイプ",
        tone: "neutral",
        text: "観骨が側面から見て外向きに張っているタイプは、手に職をつける技術者肌の性格とされる伝統的な見方がある。",
      },
      {
        id: "c",
        label: "下向きに張るタイプ",
        tone: "caution",
        text: "観骨が側面から見て下向きに張っているタイプは、苦労が絶えず生活が安定しにくい傾向があるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "cheekbone_mole_life_stage_omens",
    name: "観骨のホクロ位置と年代別の伝統的な暗示",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "上部のホクロ",
        tone: "neutral",
        text: "観骨の上部にあるホクロは、比較的若いうちに運が開けやすい暗示として伝統的に語られる。",
      },
      {
        id: "b",
        label: "中央のホクロ",
        tone: "caution",
        text: "観骨の中央付近にあるホクロは、中年期に何らかの障害・失敗を経験しやすい暗示として伝統的に語られる。",
      },
      {
        id: "c",
        label: "下部のホクロ",
        tone: "caution",
        text: "観骨の下部にあるホクロは、晩年に注意が必要な暗示として伝統的に語られる。いずれも古典的な相法上の目安であり、断定的なものではない。",
      },
    ],
  },
  {
    key: "cheekbone_beard_growth_fortune",
    name: "観骨まわりのヒゲの生え方と中年以降の運勢の伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "ヒゲが観骨まで生える",
        tone: "positive",
        text: "頬のヒゲが観骨のあたりまで生える人は、中年期以降に運が開けやすく、隠れた才能を発揮しやすいという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "cheekbone_low_prominence_personality",
    name: "観骨が目立たない人の性格の伝統的な見方",
    category: "顔",
    role: "観骨",
    options: [
      {
        id: "a",
        label: "観骨がほとんど目立たない",
        tone: "neutral",
        text: "観骨がほとんど目立たない、なだらかな輪郭の人は、穏やかで人当たりが良く、対立を好まない性格とされる伝統的な見方がある。",
      },
    ],
  },
];
});
