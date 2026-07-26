/**
 * data/palmistry_lines.js
 * 手相学概説(五)「丘・掌紋」後半、および掌紋各論(第五輯 p.187-215)より採用。
 * 三大線(生命線・感情線・知能線)と、運命線・太陽線・健康線・結婚線など。
 *
 * category は "手相"、role は "掌紋" で統一。
 *
 * 除外方針(source/notes.md 参照):
 *   - 知能線の先端にできる「島」を父親の性病(梅毒)の遺伝と結びつける記述、
 *     女性の相を「不感症・不妊症の傾向」と結びつける記述は、既存の
 *     「身体的特徴と生殖器官・性機能を結びつける俗信は詳細を記載しない」
 *     方針の対象として不採用。
 *   - 小指の歪みを「発狂・自殺の相」と結びつける記述は、精神疾患・自殺を
 *     身体的特徴と安易に結びつけるスティグマ的内容のため不採用。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PALMISTRY_LINES_PARTS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      key: 'line_east_west_correspondence',
      name: '三大線の東西対応(豆知識)',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'note',
          label: '天紋・人紋・地紋と西洋の三大線',
          tone: 'neutral',
          text: '東洋手相では一番上の線を天紋(感情線に相当)、中央を人紋(知能線に相当)、下側を地紋(生命線に相当)と呼ぶ。西洋手相の感情線・知能線・生命線とほぼ同じ位置の線を指しているとされ、見方の名称が違うだけで対応関係は東西でおおむね一致しているとされる。'
        }
      ]
    },
    {
      key: 'line_life',
      name: '生命線',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'long_clear',
          label: '長くはっきりしている',
          tone: 'good',
          text: '生命線が長くはっきりしている人は、体力・生命力が充実している目安とされる。ただし「生命線が短い人は短命」という単純な話ではなく、知能線の長短や他の線との組み合わせも合わせて見る必要があるとされる。'
        },
        {
          id: 'short_or_faint',
          label: '短い・薄い',
          tone: 'neutral',
          text: '生命線が短い、または薄い人でも、必ずしも寿命が短いことを意味するわけではないとされる。伝統的な手相学でも「生命線の長短だけで寿命を占うのは的中しない」という考え方があり、他の線と合わせて総合的に見るべきとされている。'
        }
      ]
    },
    {
      key: 'line_life_support',
      name: '副生命線',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'present',
          label: '副生命線がある',
          tone: 'good',
          text: '生命線に寄り添うように現れる短い線を副生命線と呼ぶ。生命線を裏付け支える線とされ、これがあると、たとえ生命線自体が途切れていても健康面で助けが入るとされる。'
        }
      ]
    },
    {
      key: 'line_emotion',
      name: '感情線(愛情線)',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'standard',
          label: '標準的な長さ・カーブ',
          tone: 'neutral',
          text: '感情線は心臓や感情面の状態を示すとされる線。標準的な長さとカーブを持つ人は、落ち着いたバランスの良い愛情表現をするタイプとされる。'
        },
        {
          id: 'long_reaching',
          label: '指の間まで長く伸びる',
          tone: 'neutral',
          text: '感情線が人差し指の下あたりまで長く伸びている人は、情熱的で一途な愛情表現をするタイプとされる。のめり込みやすい面もあるといわれる。'
        },
        {
          id: 'short',
          label: '短め',
          tone: 'neutral',
          text: '感情線が標準より短い人は、恋愛においてやや醒めやすく現実的な判断をするタイプとされる。'
        },
        {
          id: 'curving_to_saturn',
          label: '中指の下(土星丘)へ向けてカーブする',
          tone: 'neutral',
          text: '感情線が中指の下へ向けて折れ下がるようにカーブする人は、独占欲が強く、一つの恋愛にとことん打ち込むタイプとされる。'
        }
      ]
    },
    {
      key: 'line_intelligence',
      name: '知能線(智能線)',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'joined_with_life',
          label: '生命線と同じ場所から出ている',
          tone: 'neutral',
          text: '知能線が生命線と同じ起点から出ている人は、慎重で、行動する前によく考えるタイプとされる。'
        },
        {
          id: 'separated_from_life',
          label: '生命線から離れて出ている',
          tone: 'neutral',
          text: '知能線が生命線から離れた位置から出ている人は、独立心が強く、思い立ったらすぐ行動するタイプとされる。'
        },
        {
          id: 'double_intelligence_line',
          label: '二重知能線(線が二本ある)',
          tone: 'neutral',
          text: '知能線が二本ある「二重知能線」の人は、二つの仕事や才能を同時に持つ可能性があるとされる。転職や副業など、複数の道を歩む傾向として語られることがある。'
        }
      ]
    },
    {
      key: 'line_fate',
      name: '運命線(天柱紋)',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'present_clear',
          label: 'はっきり伸びている',
          tone: 'good',
          text: '手首や月丘のあたりから中指へ向かってはっきり伸びる運命線がある人は、職業や人生の方向性が定まりやすいとされる。'
        },
        {
          id: 'faint_or_absent',
          label: '薄い・目立たない',
          tone: 'neutral',
          text: '運命線が薄い、あるいはほとんど見えない人は、決まった一つの道よりも、その時々の状況に応じて柔軟に進路を変えていくタイプとされる。'
        }
      ]
    },
    {
      key: 'line_sun',
      name: '太陽線',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'present',
          label: '太陽丘へ向かう線がある',
          tone: 'good',
          text: '火星丘や木星丘のあたりから太陽丘へ向かって伸びる線を太陽線と呼び、才能や人気運を示すとされる。'
        }
      ]
    },
    {
      key: 'line_health',
      name: '健康線',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'present',
          label: '水星丘へ向かって伸びている',
          tone: 'neutral',
          text: '水星丘の方向へ伸びる健康線は、体調やエネルギーの巡りの目安とされる。線がはっきりしすぎている場合よりも、控えめに出ている方がよいとする見方もある。'
        }
      ]
    },
    {
      key: 'line_marriage',
      name: '結婚線',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'present',
          label: '小指の下(水星丘側面)に横線がある',
          tone: 'neutral',
          text: '小指の付け根、水星丘の側面に現れる横線が結婚線とされる。恋愛や結婚に関する時期や出来事の目安として見られる線とされる。'
        }
      ]
    },
    {
      key: 'line_age_reference',
      name: '掌紋上の年齢の目安(豆知識)',
      category: '手相',
      role: '掌紋',
      options: [
        {
          id: 'note',
          label: '線の各点に年齢を対応させる見方',
          tone: 'neutral',
          text: '生命線・知能線・感情線には、それぞれ「線上のどのあたりが何歳頃の出来事に対応するか」というおおまかな目安をつける見方がある。中指の中心を通る線を基準に、線の起点を1歳、終点をおおよそ70歳前後とみなし、線上の変化(切れ目や乱れなど)が起きた年齢の見当をつける、という考え方である。'
        }
      ]
    }
  ];
});
