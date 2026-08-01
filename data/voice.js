/**
 * data/voice.js
 * 第十二輯「挙動と音声(音声)」の章より新規追加。category「行動」role「声」。
 * 他の顔データファイルと同じUMDパターンで root.VOICE としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.VOICE = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "voice_importance_overview",
    name: "人相学における声・音声の重要性",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "眼・鼻と並ぶ重要な観察対象としての声",
        tone: "neutral",
        text: "伝統的な人相学では「富を問うは鼻にあり、精神を問うは眼にあり、全てを求むるは声にあり」と言われるほど、声はその人の富・成功・発達の度合いを総合的に映し出す重要な観察対象とされてきた。",
      },
    ],
  },
  {
    key: "voice_age_gender_typical_tone",
    name: "年齢・性別による声の典型的な違い",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "幼少・青年・老年の声の変化",
        tone: "neutral",
        text: "伝統的な見方では、幼少期の声は甲高く可愛らしく、青年期は喜怒哀楽がはっきり表れた張りのある声、老年期は落ち着いた声になりやすいとされる。年齢に応じた自然な声の変化として捉えられている。",
      },
      {
        id: "b",
        label: "男女で異なるとされる声の傾向",
        tone: "neutral",
        text: "男性の声は総じて太く力強い傾向、女性の声は総じて高く柔らかい傾向にあるとされ、それぞれの性差を聞き分けることも人相学上の基本的な観察の一つとされてきた。",
      },
    ],
  },
  {
    key: "voice_resonance_bell_metaphor",
    name: "声の余韻を鐘の音にたとえる伝統的な聞き方",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "余韻が長く響く声・余韻がすぐ途切れる声",
        tone: "neutral",
        text: "声は「音」そのものと、発したあとに残る「余韻」の二つに分けて聞くとされる。鐘をついた後に長く響く余韻があるように、話し終えたあとも耳に心地よく残る声は、豊かさや発展性を示すとされる一方、余韻がなくすぐに途切れる声は、発展性に乏しいとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "voice_strength_clarity_reading",
    name: "声の太さ・力強さ・明瞭さにまつわる性格傾向",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "太くはっきりした声の人",
        tone: "positive",
        text: "声が太くはっきりしていて力のある人は、心身ともに充実しており、物事をやり遂げる力に恵まれるタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "細く力のない声の人",
        tone: "caution",
        text: "声が細く弱々しい人は、体力や気力が十分でないことが多く、物事の実現に時間がかかりやすい傾向があるとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "voice_speed_talkativeness_reading",
    name: "話す速さ・話し方の癖にまつわる性格傾向",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "早口で一気にまくし立てるように話す人",
        tone: "caution",
        text: "早口で息もつかせぬように話す人は、頭の回転は速いものの、せっかちで最後までやり遂げずに途中で投げ出しやすい傾向があるとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "ゆっくりと丁寧に話す人",
        tone: "positive",
        text: "落ち着いてゆっくりと丁寧に話す人は、思慮深く、じっくりと物事を進める力に富むタイプとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "voice_five_elements_type_overview",
    name: "声を五つの型に分類する伝統的な考え方(木火土金水)",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "五行にあてはめた声質の分類",
        tone: "neutral",
        text: "古い相法には、声質を五行(木・火・土・金・水)にあてはめて分類する考え方がある。木の声は高く澄んで耳によく通る、火の声は焦げたようにパッとして余韻がない、土の声は重厚で静かに正しく発達する、金の声は張りがあり締まりがある、水の声は潤いがあり伸びやかというように、それぞれの質に応じた特徴があるとされる。",
      },
    ],
  },
  {
    key: "voice_stutter_hesitation_reading",
    name: "どもり・つっかえながら話す癖にまつわる伝統的な見方",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "言葉に詰まりやすい癖",
        tone: "caution",
        text: "話す際に言葉に詰まったり、つっかえたりする癖のある人は、心の中に迷いやためらいを抱えていることが多いという伝統的な見方があるが、あくまで緊張や体質による面も大きく、断定的に性格を決めつけるものではない。",
      },
    ],
  },
  {
    key: "voice_emotional_pitch_change_reading",
    name: "怒った時・喜んだ時に変化する声の調子にまつわる観察",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "感情の変化が声にはっきり表れる人",
        tone: "neutral",
        text: "怒ったとき、悲しんだとき、喜んでいるときで声の調子がはっきりと変わる人は、感情表現が豊かで、周囲からもその時々の心情を読み取りやすいタイプとされる。声の変化を注意深く聞き分けることは、相手の心の動きを知る手がかりになるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "crying_laughing_voice_reading",
    name: "泣き声・笑い声にまつわる性格傾向",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "笑い声が明るく屈託のない人",
        tone: "positive",
        text: "笑うときの声が明るく屈託のない人は、素直で裏表のない性格とされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "泣き声・悲しみの表現が控えめな人",
        tone: "neutral",
        text: "悲しいときにも取り乱さず、控えめに感情を表す人は、忍耐強く自制心のあるタイプとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "voice_volume_reading",
    name: "声の大小にまつわる性格傾向",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "大声で話す人",
        tone: "neutral",
        text: "常に大声で話す人は、力強く堂々とした印象を与える一方、余韻や締まりのない大声は、かえって発達に乏しく短命の相とされる伝統的な見方もある。声の大きさよりも締まりや余韻の質が重視される。",
      },
      {
        id: "b",
        label: "小声で話す人",
        tone: "neutral",
        text: "小声で控えめに話す人は、慎み深い印象を与える一方、あまりに力のない小声は自信のなさの表れとされることもあるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "voice_trailing_pitch_direction_reading",
    name: "語尾が上がる・下がる話し方にまつわる性格傾向",
    category: "行動",
    role: "声",
    options: [
      {
        id: "a",
        label: "語尾がしっかり締まって終わる話し方",
        tone: "positive",
        text: "話の語尾までしっかりと声を保ち、締まりよく話し終える人は、物事をきちんとやり遂げる責任感のあるタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "語尾が尻すぼみになる話し方",
        tone: "caution",
        text: "話の語尾にいくにつれて声が小さくしぼんでいく人は、物事を最後までやり遂げる粘り強さにやや欠ける傾向があるとされる伝統的な見方がある。",
      },
    ],
  },
  ];
});
