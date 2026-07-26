/**
 * data/palmistry.js
 * 手相学概説(一)〜(三)(第四輯 p.138-173)より採用。
 *
 * スキーマは既存 data/*.js と同じ:
 *   { key, name, category, role, options: [{ id, label, tone, text }, ...] }
 *
 * category は "手相" で統一。role は掌全体の中でどの部位・観点の診断かを表す
 * サブ分類(既存ファイルの role 命名規則が異なる場合は合わせて調整してください)。
 *
 * 除外方針(source/notes.md 参照):
 *   - 手頸線(rascettes)の本数と不妊症・インポテンツを結びつける記述は、
 *     既存の「身体特徴と生殖器官を結びつける俗信は除外」方針に基づき不採用。
 *   - 掌の血色から具体的な病名(胃腸病・肺病等)を示唆する記述は、
 *     医療的な誤解を招くため運気全般の吉凶表現に留めている。
 *   - 指の動き(喜怒哀楽等の「兆」占い)は、静的な形質診断という
 *     既存スキーマの前提と構造が異なるため今回は見送り(将来 omens.js 等で検討)。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PALMISTRY_PARTS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    // ── 総論 ─────────────────────────────────────────────
    {
      key: 'hand_reading_side',
      name: '先天・後天(見る手の左右)',
      category: '手相',
      role: '総論',
      options: [
        {
          id: 'male_convention',
          label: '男性は左手を中心に見る',
          tone: 'neutral',
          text: '伝統的な見方では、男は左手・女は右手を中心に鑑定するとされる。左手は先天的な素質や生まれ持った運命の傾向を、右手は後天的な努力や心構えによる変化を表すとされる。'
        },
        {
          id: 'female_convention',
          label: '女性は右手を中心に見る',
          tone: 'neutral',
          text: '女性は右手を中心に見るのが伝統的な作法とされる。右手には日々の努力や環境による後天的な変化があらわれるとされ、左手の先天的な素質と併せて見ることでその人の変化の度合いがわかるとされる。'
        },
        {
          id: 'left_handed_reversed',
          label: '極端な左利きの場合は左右が逆転',
          tone: 'neutral',
          text: '極端に左利きの人は、左手が後天、右手が先天を示すとされ、通常とは逆に扱う。どちらの手も参考にし、両方を見比べることで、生まれ持った資質と現在までの変化の両方を読み取ろうとする考え方である。'
        }
      ]
    },
    {
      key: 'hand_three_qualities',
      name: '掌の三質(筋骨質・営養質・心性質)',
      category: '手相',
      role: '総論',
      options: [
        {
          id: 'muscular',
          label: '筋骨質 ― 硬く角ばった手',
          tone: 'neutral',
          text: '掌が硬く、指や関節が角張ってごつごつした手。皮膚もかたく、握手をすると力強い。意志が強く実行力があり、質実剛健で飾り気のない性格と結びつけられる。'
        },
        {
          id: 'nutritive',
          label: '営養質 ― 厚く柔らかい手',
          tone: 'neutral',
          text: '掌が厚みと丸みがあり、皮膚が非常に柔らかく暖かい感触の手。指の根元がふっくらと太く、指と指の間に隙間ができにくい。金銭感覚がしっかりしていて財を貯めやすいとされる一方、行き過ぎると惰弱(何事も人任せ)になりやすいとも言われる。'
        },
        {
          id: 'sensitive',
          label: '心性質 ― 華奢で細い手',
          tone: 'neutral',
          text: '掌よりも指の方が比較的長く、指先が細く尖り、肌目が細かい手。節立ったところがなく、華奢で贅沢な感じはしない。理屈よりも直感で物事を判断する繊細なタイプとされる。'
        }
      ]
    },
    {
      key: 'hand_hardness',
      name: '掌の硬軟',
      category: '手相',
      role: '触感',
      options: [
        {
          id: 'hard',
          label: '硬い掌',
          tone: 'neutral',
          text: '握った時に硬い感触の掌は筋骨質の特徴で、忍耐強く粘り強い反面、頑固で融通が利きにくい面もあるとされる。'
        },
        {
          id: 'soft',
          label: '柔らかい掌',
          tone: 'neutral',
          text: '柔らかい掌は栄養質・心性質の特徴で、人当たりが柔らかく協調的とされる。ただし柔らかすぎる手は、何をやるにも他人任せになりやすい惰弱さの表れとも見られる。'
        }
      ]
    },
    {
      key: 'hand_temperature',
      name: '手のひらの温度',
      category: '手相',
      role: '触感',
      options: [
        {
          id: 'warm',
          label: '温かい手',
          tone: 'good',
          text: '温かい手の人は情に厚く世話好きで、相手を選ばずどこまでも面倒を見るような、積極的で分け隔てのない愛情表現をするとされる。'
        },
        {
          id: 'cool',
          label: '冷たい手',
          tone: 'neutral',
          text: '冷たい手の人は一見冷めた印象を持たれやすいが、実は心の中に深い情愛を秘めていることが多いとされる。ただし相手を選んで心を開くため、外からは分かりにくい。'
        }
      ]
    },
    {
      key: 'hand_size_body_ratio',
      name: '手の大きさ(体格との対比)',
      category: '手相',
      role: '総論',
      options: [
        {
          id: 'large_for_body',
          label: '体格の割に手が大きい',
          tone: 'neutral',
          text: '体の大きさの割に手が大きい人は、細かい仕事を好み、緻密で計画的な性格とされる。精密機械を扱うような、几帳面さが求められる仕事に適性があるとされる。'
        },
        {
          id: 'small_for_body',
          label: '体格の割に手が小さい',
          tone: 'neutral',
          text: '体の大きさの割に手が小さい人は、大まかで大胆な発想を好み、細部よりも全体の構想や大きな計画を立てることに向くとされる。'
        }
      ]
    },
    // ── 指全体 ───────────────────────────────────────────
    {
      key: 'finger_joint_prominence',
      name: '指の関節の目立ち方',
      category: '手相',
      role: '指全体',
      options: [
        {
          id: 'prominent',
          label: '関節が節立っている',
          tone: 'neutral',
          text: '指の関節がはっきりと節立っている人は、物事に対して自分なりの考えや一家言を持つタイプとされる。主義主張が強く、簡単には人に流されない。'
        },
        {
          id: 'smooth',
          label: '関節が目立たない',
          tone: 'neutral',
          text: '指の関節が滑らかで目立たない人は、物事への執着が薄く、こだわりが少ないとされる。柔軟に人や状況に合わせられる反面、流されやすい面もある。'
        }
      ]
    },
    {
      key: 'fingertip_shape',
      name: '指先の形(尖・丸・四角)',
      category: '手相',
      role: '指全体',
      options: [
        {
          id: 'pointed',
          label: '尖った指先(心性)',
          tone: 'neutral',
          text: '指先が尖っている人は心性質の特徴を示し、感受性が豊かで芸術性や霊感的な直感に優れるとされる。'
        },
        {
          id: 'round',
          label: '丸い指先(営養)',
          tone: 'neutral',
          text: '指先が丸みを帯びている人は営養質の特徴を示し、柔らかく如才ない対人関係を築きやすいとされる。'
        },
        {
          id: 'square',
          label: '四角い指先(筋骨)',
          tone: 'neutral',
          text: '指先が四角い人は筋骨質の特徴を示し、規則正しく几帳面で、精力的に働く働き者のタイプとされる。'
        }
      ]
    },
    // ── 掌の型 ───────────────────────────────────────────
    {
      key: 'palm_five_elements',
      name: '掌の五行型(概略)',
      category: '手相',
      role: '総論',
      options: [
        {
          id: 'long_form',
          label: '長形(実用型)',
          tone: 'good',
          text: '手の甲・指ともに長めで、掌全体にゆったりとした印象がある型。包容力があり寛大で、人から信頼され尊敬されやすいとされる、実用的で癖の少ないタイプ。'
        },
        {
          id: 'square_form',
          label: '方形(几帳面型)',
          tone: 'neutral',
          text: '手も指も角張って堅く、じっとしていられない働き者の型。積極的・進取的で、義理堅く几帳面にコツコツと物事を進めるとされる。'
        },
        {
          id: 'round_form',
          label: '円形(協調型)',
          tone: 'neutral',
          text: '丸みを帯びた栄養質寄りの型。協調性があり、周囲と摩擦を起こしにくいが、流されやすい一面もあるとされる。'
        },
        {
          id: 'exposed_form',
          label: '露形(情に厚い型)',
          tone: 'neutral',
          text: '栄養質がかなり強く出た型で、同情心に厚く協調性がある反面、情に流されやすく物事にのめり込みやすい傾向があるとされる。'
        }
      ]
    },
    // ── 親指 ─────────────────────────────────────────────
    {
      key: 'thumb_length',
      name: '親指(拇指)の長さ',
      category: '手相',
      role: '親指',
      options: [
        {
          id: 'long',
          label: '標準より長い親指',
          tone: 'neutral',
          text: '親指が長い人は判断が早く行動的だが、時に軽率になりやすいとされる。物事をパッと決めて進める行動派。'
        },
        {
          id: 'short',
          label: '標準より短い親指',
          tone: 'neutral',
          text: '親指が短い人は判断に時間がかかるぶん思慮深く、じっくり考えてから動く堅実なタイプとされる。曲がりが鋭い(俗に「マムシ型」と呼ばれる)場合は、自負心が強く才気鋭いとされる一方、理想が高すぎて行動が伴わないこともあるとされる。'
        }
      ]
    },
    {
      key: 'thumb_joint_balance',
      name: '拇指の節のバランス(第一節・第二節)',
      category: '手相',
      role: '親指',
      options: [
        {
          id: 'first_node_long',
          label: '第一節(意志・筋骨)が長い',
          tone: 'neutral',
          text: '親指の先端側の第一節が長い人は、決断力・実行力に富み、思い立ったらすぐ行動に移すタイプとされる。'
        },
        {
          id: 'second_node_long',
          label: '第二節(論理・知恵)が長い',
          tone: 'neutral',
          text: '親指の付け根側の第二節が長い人は、理詰めで筋道立てて考える思慮深いタイプとされる。実行力よりも計画性が先立つ。'
        }
      ]
    },
    {
      key: 'thumb_flexibility',
      name: '拇指の反り返り方',
      category: '手相',
      role: '親指',
      options: [
        {
          id: 'flexible',
          label: '大きく反り返る',
          tone: 'neutral',
          text: '親指が大きく反り返る柔軟な人は、開放的で物おじせず、気前が良く金離れの良い浪費家タイプとされる。'
        },
        {
          id: 'stiff',
          label: 'ほとんど反らない',
          tone: 'neutral',
          text: '親指が硬く反らない人は警戒心が強く、堅実で用心深い。良く言えば倹約家、悪く言えばケチと紙一重とされる。'
        }
      ]
    },
    {
      key: 'thumb_fingerprint',
      name: '拇指の指紋',
      category: '手相',
      role: '親指',
      options: [
        {
          id: 'whorl',
          label: '渦巻紋(仏心紋)',
          tone: 'good',
          text: '指紋が渦を巻く「仏心紋」の人は情に厚く、人に慕われやすいとされる。人当たりが良く後天的に人望を集めやすい。'
        },
        {
          id: 'loop_biased',
          label: '一辺倒紋',
          tone: 'neutral',
          text: '指紋が一方に流れる「一辺倒紋」の人は一途で頑固な面があり、自分の考えに偏りやすいとされる。'
        }
      ]
    },
    // ── 人差し指〜小指 ───────────────────────────────────
    {
      key: 'index_finger_length',
      name: '人差し指(食指)の長短',
      category: '手相',
      role: '人差し指',
      options: [
        {
          id: 'longer_than_middle',
          label: '中指に迫るほど長い',
          tone: 'neutral',
          text: '人差し指が中指に迫るほど長い人は自我が強く支配欲が旺盛で、人の上に立ちたがる傾向があるとされる。第一節は宗教心、第二節は野心、第三節は支配欲を示すとされる。'
        },
        {
          id: 'standard',
          label: '中指より明らかに短い(標準)',
          tone: 'neutral',
          text: '人差し指が中指より明らかに短いのが標準とされ、協調性を保ちやすいタイプとされる。'
        }
      ]
    },
    {
      key: 'middle_finger_traits',
      name: '中指の長短・傾向',
      category: '手相',
      role: '中指',
      options: [
        {
          id: 'long',
          label: '標準より長い中指',
          tone: 'neutral',
          text: '中指が長い人は物事を運命的・成り行き任せに考えがちで、悲観的になりやすく孤独を好む傾向があるとされる。第一節は憂鬱、第二節は機械への関心、第三節は物欲を示すとされる。'
        },
        {
          id: 'standard',
          label: '標準的な長さ',
          tone: 'neutral',
          text: '標準的な長さの中指は、落ち着いて思慮深い性格を示すとされる。'
        }
      ]
    },
    {
      key: 'ring_finger_traits',
      name: '薬指(無名指)の長短',
      category: '手相',
      role: '薬指',
      options: [
        {
          id: 'longer_than_index',
          label: '人差し指より長い',
          tone: 'neutral',
          text: '薬指が人差し指より長い人は、勝負事や投機的なことを好む傾向があるとされる。第一節は陽気さ、第二節は芸術性、第三節は虚飾を示すとされ、派手好きで見栄えを気にするタイプとも言われる。'
        },
        {
          id: 'standard',
          label: '人差し指より短い(標準)',
          tone: 'neutral',
          text: '薬指が人差し指より短いのが標準的で、堅実で見栄を張らないタイプとされる。'
        }
      ]
    },
    {
      key: 'little_finger_traits',
      name: '小指の長短',
      category: '手相',
      role: '小指',
      options: [
        {
          id: 'long',
          label: '標準より長い小指',
          tone: 'neutral',
          text: '小指が長い人は早熟で弁が立ち、要領よく立ち回るタイプとされる。第一節は雄弁、第二節は忍耐、第三節は勤勉を示すとされる。'
        },
        {
          id: 'short',
          label: '標準より短い小指',
          tone: 'neutral',
          text: '小指が短い人は万事に慎重で、じっくり時間をかけて物事に取り組む堅実なタイプとされる。'
        }
      ]
    },
    // ── 掌面八卦(部位対応) ───────────────────────────────
    {
      key: 'palm_bagua_zones',
      name: '掌面八卦(九宮)の意味',
      category: '手相',
      role: '部位対応',
      options: [
        {
          id: 'meido',
          label: '明堂(掌中央のくぼみ)',
          tone: 'neutral',
          text: '掌中央のくぼみは「明堂」と呼ばれ、掌全体の色や運勢を見るときの基準点とされる。ここの血色の良し悪しでその時々の運気の傾向を見るとされる。'
        },
        {
          id: 'rikyu',
          label: '離宮(中指の付け根寄り・掌上部)',
          tone: 'neutral',
          text: '身分・地位・職業上の変化にかかわる部位とされ、転職や役職の昇降といった「立場が変わること」を見るとされる。'
        },
        {
          id: 'sonkyu',
          label: '巽宮(中指の下寄り)',
          tone: 'neutral',
          text: '商売・取引・縁談・依頼ごとにかかわる部位とされる。'
        },
        {
          id: 'shinkyu',
          label: '震宮(人差し指の下寄り)',
          tone: 'neutral',
          text: '子供に関することを見る部位とされる。'
        },
        {
          id: 'konkyu',
          label: '坤宮(薬指の下寄り)',
          tone: 'neutral',
          text: '母親に関することを見る部位とされる。'
        },
        {
          id: 'dakyu',
          label: '兌宮(小指の下寄り)',
          tone: 'neutral',
          text: '子供(特に娘)に関することを見る部位とされる。'
        },
        {
          id: 'kenkyu',
          label: '乾宮(手首寄り・小指側)',
          tone: 'neutral',
          text: '金銭運にかかわる部位とされる。'
        },
        {
          id: 'konkyu2',
          label: '坎宮(手首に最も近い中央)',
          tone: 'neutral',
          text: '住居に関することを見る部位とされる。'
        },
        {
          id: 'gonkyu',
          label: '艮宮(拇指丘・親指の付け根)',
          tone: 'neutral',
          text: '健康・胃腸にかかわる部位とされ、長男に関することを示すとも言われる。'
        }
      ]
    },
    {
      key: 'palm_color_reading',
      name: '掌・明堂の色(気色)',
      category: '手相',
      role: '色',
      options: [
        {
          id: 'good_color',
          label: '紅色・紫がかった良い色',
          tone: 'good',
          text: '伝統的な見方では、明堂や各部位の色が紅みや紫がかった良い色をしているときは運気が上向きの兆しとされる。あくまで民間信仰的な運勢の目安であり、体調の医学的診断ではない。'
        },
        {
          id: 'bad_color',
          label: '黒ずんだ・くすんだ色',
          tone: 'bad',
          text: '色が黒ずんでくすんでいるときは運気が停滞している兆しとされる。伝統的な運勢占いとしての見方であり、実際の体調不良を意味するものではない。'
        }
      ]
    },
    // ── 前腕の骨相(古典的な付随項目) ─────────────────────
    {
      key: 'arm_bone_balance',
      name: '竜骨・虎骨・貫骨(前腕の骨相)',
      category: '手相',
      role: '骨格',
      options: [
        {
          id: 'dragon_longer',
          label: '竜骨(前腕上部)が虎骨より長い(標準)',
          tone: 'neutral',
          text: '前腕の上側の骨(竜骨)が下側の骨(虎骨)より長いのが一般的とされる標準の骨格。'
        },
        {
          id: 'tiger_longer',
          label: '虎骨(前腕下部)が竜骨より長い(特殊型)',
          tone: 'neutral',
          text: '虎骨の方が竜骨より長いのは特殊な発達とされ、独特な才能や技能を発揮する人に見られることがあるとされる例外的な骨格。'
        },
        {
          id: 'wrist_joint_high',
          label: '手首の関節(貫骨)が高く出ている',
          tone: 'neutral',
          text: '手首の関節部分が高く出ている人は世話好きで、困っている人を放っておけず助けてくれるとされる一方、自身は苦労性で心労が多いタイプとも言われる。'
        }
      ]
    }
  ];
});
