/**
 * data/nasolabial.js
 * 第八輯「人相学詳論(五)法令の相」より新規追加。category「顔」role「法令」。
 * forehead_extra.js / hair.js / eyebrows.js / nose.js と同じUMDパターンで
 * root.NASOLABIAL としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.NASOLABIAL = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "nasolabial_concept_and_body_parts",
    name: "法令とは何か(君主・将軍・小人形法との対応)",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "小人形法での位置づけ",
        tone: "neutral",
        text: "法令とは、鼻の両脇から口の脇へ向かって流れる線のこと。伝統的な小人形法では鼻を「君主」、頬骨を「将軍」に見立て、そこから命令が下方の民(口元から下)へ流れていく筋という意味で「法令」と名づけられたと説明される。",
      },
    ],
  },
  {
    key: "nasolabial_length_stability",
    name: "法令の長さと職業の安定性",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令がはっきり長く出ている",
        tone: "positive",
        text: "法令がはっきりと長く出ている人は、一定の職業を長く継続しやすい相とされる。二十五歳前後から法令が現れ始めるのが一般的とされる。",
      },
      {
        id: "b",
        label: "法令があまり出ていない・出るのが遅い",
        tone: "neutral",
        text: "法令が薄い、またはなかなか出てこない人は職業や仕事の方向性が定まりにくく、転職を重ねやすい傾向として語られる。",
      },
    ],
  },
  {
    key: "nasolabial_width_business_type",
    name: "法令の広がり方と職業タイプ(組織向き・自由業向き)",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令の間隔が狭く直線的",
        tone: "neutral",
        text: "法令の間隔が狭くまっすぐ下りるタイプは、一つの仕事に専念し安定を求める傾向があるとされる。",
      },
      {
        id: "b",
        label: "法令の間隔が広く末広がり",
        tone: "neutral",
        text: "法令が末広がりに大きく開くタイプは生活力・職業能力が高く、二つの仕事を兼ねる、あるいは副業を持ちやすい傾向として語られる。",
      },
    ],
  },
  {
    key: "nasolabial_age_flow_reference",
    name: "法令にまつわる年齢の目安(流年)",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "二十五歳前後",
        tone: "neutral",
        text: "二十五歳ぐらいから法令がはっきりと出てくることが多く、これ以前に職業が定まっていない人も、この年齢を境に一定の職業へ落ち着きやすいという伝統的な目安がある。",
      },
      {
        id: "b",
        label: "六十五歳前後",
        tone: "neutral",
        text: "法令が口の脇の線と交わる六十五歳前後の年齢は商売・仕事の面で一つの節目とされ、この時期の法令の状態(切れ目やホクロの有無など)で当時の運気を占う伝統的な見方がある。",
      },
    ],
  },
  {
    key: "nasolabial_defect_marks_meaning",
    name: "法令の切れ目・ホクロ・キズの意味",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令に切れ目や傷がある",
        tone: "caution",
        text: "法令の途中に切れ目や傷がある相は、その年齢に対応する時期に事業や仕事が一時的に途切れる、あるいは健康を損ねる暗示として伝統的に語られる。",
      },
      {
        id: "b",
        label: "法令にホクロがある",
        tone: "caution",
        text: "法令上にホクロがある場合、そのホクロの位置に対応する年齢の頃に仕事上のつまずきや家庭内のもめごとが起きやすいという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "nasolabial_entering_mouth_pattern",
    name: "法令が口へ入る相の伝統的な解釈",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令が口の中まで入り込む",
        tone: "caution",
        text: "法令が口の中にまで入り込むように見える相は、伝統的には生活に困窮しやすい、あるいは健康面で無理を重ねやすい相として語られてきた。",
      },
      {
        id: "b",
        label: "法令が口を避けて外側を通る",
        tone: "positive",
        text: "法令が口を囲むことなく外側を通っていく相は、経済的に安定し生涯食べるものに困らない相として伝統的に語られる。",
      },
    ],
  },
  {
    key: "nasolabial_color_reading",
    name: "法令に現れる色(赤み)の伝統的な意味",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令に赤い糸のような筋が出る",
        tone: "caution",
        text: "法令に赤い糸のような筋や赤みが差す場合、商売上のトラブルや急な出費など慌ただしい出来事の前触れとして伝統的に語られる。",
      },
      {
        id: "b",
        label: "法令の気血色が良い",
        tone: "positive",
        text: "法令の気血色がつやよく整っている場合は、仕事や商売が順調に進んでいる相とされる。",
      },
    ],
  },
  {
    key: "nasolabial_double_line_pattern",
    name: "二重法令・支線のある相",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令が二本ある",
        tone: "neutral",
        text: "法令の脇にもう一本細い支線(副法令)がある相は、本業のほかに副業を持つ、あるいは親の家業を継ぎながら別の仕事も手がける傾向として語られる。",
      },
      {
        id: "b",
        label: "法令が片側だけ二重",
        tone: "neutral",
        text: "左右どちらか一方だけ法令が二重になっている相は、両親どちらか一方の生業(家業)との縁が深いことを示すと伝統的に語られる。",
      },
    ],
  },
  {
    key: "nasolabial_mole_position_meaning",
    name: "法令上のホクロの位置と家業・境界の暗示",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令にホクロが複数連なる",
        tone: "neutral",
        text: "法令の線上、家の境界に見立てられる部分にホクロが連なる相は、家業や商売の範囲・境界にまつわる出来事に縁がある相として伝統的に語られる。",
      },
    ],
  },
  {
    key: "nasolabial_symmetry_curve_reading",
    name: "法令の左右対称性・曲がり方と運勢",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "左右の法令の大きさが極端に違う",
        tone: "caution",
        text: "左右の法令の大きさや長さに大きな差があるタイプは、運の浮き沈みが大きくなりやすいと伝統的に語られる。",
      },
      {
        id: "b",
        label: "法令が大きく曲がっている",
        tone: "neutral",
        text: "法令が大きく曲線を描くタイプは器用で企画力に優れる反面、運の巡り合わせにムラが出やすいとされる。",
      },
    ],
  },
  {
    key: "nasolabial_foot_injury_correlation",
    name: "法令の色の黒ずみと足のケガ・事故の伝統的対応",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "法令に黒ずんだ気色が出る",
        tone: "caution",
        text: "法令の色が黒ずんで見える時期は、足のケガや事故などのトラブルが起きやすい時期として伝統的に語られる。骨折した箇所に近い側の法令に黒みが出やすいという見方もある。",
      },
      {
        id: "b",
        label: "法令の気色に変化がない",
        tone: "neutral",
        text: "法令の気色に特に変化が見られない場合は、当面大きなトラブルは起こりにくいとされる。",
      },
    ],
  },
  {
    key: "nasolabial_root_metaphor",
    name: "法令をなだらかな木の根にたとえる比喩",
    category: "顔",
    role: "法令",
    options: [
      {
        id: "a",
        label: "木の根の比喩",
        tone: "neutral",
        text: "法令をその人の家の周りに張る木の根にたとえ、法令がなだらかに長く伸びている人は、地域や家系との結びつきが強く、地に足のついた安定した生き方をする人と伝統的に語られる。",
      },
    ],
  },
];
});
