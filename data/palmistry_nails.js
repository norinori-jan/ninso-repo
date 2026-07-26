/**
 * data/palmistry_nails.js
 * 手相学概説(四)「爪」(第五輯 p.174-186)より採用。
 *
 * スキーマは既存 data/*.js と同じ:
 *   { key, name, category, role, options: [{ id, label, tone, text }, ...] }
 *
 * category は "手相"、role は "爪" で統一。
 *
 * 除外方針(source/notes.md 参照):
 *   - 原本では爪の型に直接「脳溢血型」「マヒ症型」「心臓病型」「中風型・肺炎型」
 *     「カリエス型」といった具体的な病名がつけられているが、医療的な誤診断を
 *     招く恐れがあるため、病名は使わず「体力・体質の傾向」として一般化している。
 *   - 爪に寄生する十二指腸虫等の寄生虫に関する解説は、性質診断のデータでは
 *     ないため採用しない。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PALMISTRY_NAILS_PARTS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      key: 'nail_length_overall',
      name: '爪の長さ(総論)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'long',
          label: '長い爪(心性質)',
          tone: 'neutral',
          text: '爪が長い人は心性質に属するとされ、感受性が豊かで神経が細やか。文筆・画家・書家・俳優など、芸術・学芸方面で身を立てる人に多いとされる。反面、繊細な体質で、疲れが体に出やすい傾向があるとも言われる。'
        },
        {
          id: 'short',
          label: '短い爪(営養質)',
          tone: 'neutral',
          text: '爪が短い人は営養質に属するとされ、気分の切り替えが速く好奇心旺盛。精力的で直感的に動くタイプとされ、事務や実務など、体を動かして仕事をする分野に適するとされる。'
        }
      ]
    },
    {
      key: 'nail_shape_square',
      name: '爪の形(四角く厚い爪)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'square_thick',
          label: '四角く厚みのある爪',
          tone: 'neutral',
          text: '横幅が広く厚みのある四角い爪の人は、自分の主張を最後まで押し通そうとする意志の強さがあるとされる。良く言えば意志が強く筋を通す、悪く言えば頑固でぶつかりやすいタイプ。'
        }
      ]
    },
    {
      key: 'nail_shape_round',
      name: '爪の形(丸い爪)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'round',
          label: '丸みのある爪',
          tone: 'good',
          text: '丸みを帯びた爪の人は温和な性格とされる。おっとりとして人当たりが柔らかく、争いごとを好まないタイプ。'
        }
      ]
    },
    {
      key: 'nail_shape_narrow',
      name: '爪の形(縦に細長く幅の狭い爪)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'narrow',
          label: '幅の狭い爪',
          tone: 'neutral',
          text: '爪の板が縦に細長く、幅の狭い人は神経質で用心深い傾向があるとされる。几帳面である反面、心配性になりやすい面もある。'
        }
      ]
    },
    {
      key: 'nail_constitution_delicate',
      name: '爪の形(先端が細くなる爪)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'delicate',
          label: '先端が細くすぼまる爪',
          tone: 'neutral',
          text: '先端が細くすぼまっていく形の爪は、体力があまり強くない繊細な体質と結びつけられることが多いとされる。伝統的な民間の見方であり、実際の健康診断の代わりになるものではない。'
        }
      ]
    },
    {
      key: 'nail_curvature',
      name: '爪の反り方',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'curves_inward',
          label: '内側へ反る爪',
          tone: 'good',
          text: '爪の上相(先端)が内側に反るように向いている人は、陽気で気分の浮き沈みが少ないとされる。'
        },
        {
          id: 'curves_outward',
          label: '外側へ反る爪',
          tone: 'neutral',
          text: '爪の先端が外側へ反り返る人は、常に気分が沈みがちで陰気な傾向があるとされる。'
        }
      ]
    },
    {
      key: 'nail_ridges',
      name: '爪の筋(縦筋・横筋)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'vertical_ridges',
          label: '縦筋が目立つ',
          tone: 'neutral',
          text: '爪に縦の筋が目立つのは、加齢や体調の変化に伴って一般的によく見られる現象とされる。特定の病気を意味するものではなく、体質や生活リズムの目安として捉えるのがよい。'
        },
        {
          id: 'horizontal_ridges',
          label: '横筋(溝)が目立つ',
          tone: 'neutral',
          text: '爪に横方向の溝が入るのは、体調に何らかの変化があった時期のなごりとされることがある。爪は伸びるのに数ヶ月かかるため、少し前の体調変化のサインが後から現れることもあるといわれる。'
        }
      ]
    },
    {
      key: 'nail_white_spots',
      name: '爪の白い斑点',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'white_spots',
          label: '白い斑点がある',
          tone: 'good',
          text: '爪に白い斑点が出るのは、俗に「幸福な兆し」とされ、ちょっとした嬉しい出来事が近いうちにあるという言い伝えがある。子供の爪に見られることも多く、健康的な新陳代謝の表れとみる向きもある。'
        }
      ]
    },
    {
      key: 'nail_moon',
      name: '爪の白い半月(爪甲半月)',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'large_moon',
          label: '半月が大きくはっきりしている',
          tone: 'good',
          text: '爪の根元の白い半月がはっきり大きく出ている人は、新陳代謝が活発で健康的とされる。'
        },
        {
          id: 'small_or_no_moon',
          label: '半月が小さい・出ていない',
          tone: 'neutral',
          text: '半月が小さい、またはほとんど見えない人は、体力的にやや弱いタイプとされる。年齢とともに半月が目立ちにくくなるのは自然な変化でもある。'
        }
      ]
    },
    {
      key: 'nail_biting_habit',
      name: '爪を噛む癖',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'nail_biting',
          label: '爪を噛む癖がある',
          tone: 'neutral',
          text: '爪を噛む癖のある人は神経質な性格の表れとされる。最初に取り組む仕事ではうまくいかないことが多いが、人当たりは素直で、周囲からの助言を気にかけるタイプとされる。'
        }
      ]
    },
    {
      key: 'nail_color',
      name: '爪の色',
      category: '手相',
      role: '爪',
      options: [
        {
          id: 'healthy_pink',
          label: '血色のよいピンク',
          tone: 'good',
          text: '爪自体の色が血色のよいピンク色をしているのは、伝統的に健やかな状態の目安とされる。'
        },
        {
          id: 'pale',
          label: '青白い・白っぽい',
          tone: 'neutral',
          text: '爪の色が青白く白っぽいのは、冷えやすい体質の傾向として語られることがある、あくまで伝統的な民間の見方である。'
        },
        {
          id: 'dark_or_bluish',
          label: '黒ずむ・青みが強い',
          tone: 'bad',
          text: '爪の色が黒ずんだり青みが強くなったりするのは、伝統的な見方では良くない兆しとされる。具体的な病名を示すものではなく、気になる場合は専門家に相談するのがよい。'
        }
      ]
    }
  ];
});
