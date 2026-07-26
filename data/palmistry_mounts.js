/**
 * data/palmistry_mounts.js
 * 手相学概説(五)「丘・掌紋」前半(第五輯 p.196-200)より採用。
 * 掌の7つの丘(西洋手相での呼び方)と、指の付け根の指紋パターン。
 *
 * category は "手相"、role は "丘" で統一。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PALMISTRY_MOUNTS_PARTS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      key: 'mount_jupiter',
      name: '木星丘(人差し指の付け根)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'neutral',
          text: '木星丘がよく盛り上がっている人は信仰心があり、支配欲・名誉欲を持つとされる。盛り上がりすぎる場合は、迷信的になったり野心が過剰になったりする面もあるといわれる。'
        },
        {
          id: 'flat',
          label: 'あまり目立たない',
          tone: 'neutral',
          text: '木星丘があまり発達していない人は、控えめで支配欲が強くないタイプとされる。'
        }
      ]
    },
    {
      key: 'mount_saturn',
      name: '土星丘(中指の付け根)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'neutral',
          text: '土星丘が盛り上がっている人は、瞑想的で反省的な性格とされる。孤独を好み、思索にふけるような哲学的なタイプで、学者に見られやすいとされる。'
        },
        {
          id: 'flat',
          label: '陥没気味・目立たない',
          tone: 'neutral',
          text: '土星丘が陥没気味の人は、深く考え込むよりも軽やかに行動するタイプとされる。'
        }
      ]
    },
    {
      key: 'mount_sun',
      name: '太陽丘(薬指の付け根)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'good',
          text: '太陽丘が盛り上がっている人は芸術的な才能や社交的な魅力を持つとされる。盛り上がりすぎる場合は虚栄心が強くなりやすいともいわれる。'
        },
        {
          id: 'flat',
          label: 'あまり目立たない',
          tone: 'neutral',
          text: '太陽丘が目立たない人は、華やかさよりも実質を重んじるタイプとされる。'
        }
      ]
    },
    {
      key: 'mount_mercury',
      name: '水星丘(小指の付け根)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'good',
          text: '水星丘がよく発達している人は、商才があり口が達者で、機転が利くとされる。学問や商売など、頭の回転の速さを活かせる分野に向くとされる。'
        },
        {
          id: 'flat',
          label: 'あまり目立たない',
          tone: 'neutral',
          text: '水星丘が目立たない人は、駆け引きよりも実直さで物事を進めるタイプとされる。'
        }
      ]
    },
    {
      key: 'mount_mars',
      name: '火星丘・火星平原(掌の中央〜側面)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: '火星丘がよく発達している',
          tone: 'neutral',
          text: '火星丘(第一・第二)がよく発達している人は、勇気と忍耐力を兼ね備えているとされる。'
        },
        {
          id: 'wide_plain',
          label: '火星平原(中央のくぼみ)が広い',
          tone: 'neutral',
          text: '掌中央のくぼんだ部分(火星平原)が広い人は、性格が穏やかで争いを好まないとされる。'
        }
      ]
    },
    {
      key: 'mount_venus',
      name: '金星丘(親指の付け根)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'good',
          text: '金星丘が豊かに盛り上がっている人は、愛情深く情熱的でエネルギーに満ちているとされる。'
        },
        {
          id: 'flat',
          label: '貧弱・平坦',
          tone: 'neutral',
          text: '金星丘が貧弱で平らな人は、愛情表現が控えめで淡白なタイプとされる。'
        }
      ]
    },
    {
      key: 'mount_moon',
      name: '月丘(手首寄り・小指側)',
      category: '手相',
      role: '丘',
      options: [
        {
          id: 'developed',
          label: 'よく発達している',
          tone: 'neutral',
          text: '月丘がよく発達している人は、想像力が豊かで、神秘的なことや直感的なことに関心を持つとされる。芸術や霊感に近い分野に惹かれる傾向があるといわれる。'
        },
        {
          id: 'flat',
          label: 'あまり目立たない',
          tone: 'neutral',
          text: '月丘が目立たない人は、空想よりも現実的な判断を優先するタイプとされる。'
        }
      ]
    },
    {
      key: 'finger_base_fingerprint_pattern',
      name: '指の付け根の指紋(渦巻き・流れ紋)',
      category: '手相',
      role: '指紋',
      options: [
        {
          id: 'whorl',
          label: '渦巻き紋',
          tone: 'neutral',
          text: '指の付け根の指紋が渦を巻いている人は、営養質の傾向を示すとされる。物事への執着や行動力が強く、思うことを最後までやり遂げようとするタイプとされる。'
        },
        {
          id: 'loop_flow',
          label: '流れ紋(曲線的な流れ)',
          tone: 'neutral',
          text: '指紋が渦を巻かず、なめらかな曲線で流れている人は心性質の傾向を示すとされる。繊細で、物事を見た目や雰囲気で判断しやすいタイプとされる。'
        }
      ]
    }
  ];
});
