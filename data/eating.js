/**
 * data/eating.js
 * 第十二輯「食事」の章より新規追加。category「行動」role「食事」。
 * 他の顔データファイルと同じUMDパターンで root.EATING としてブラウザに公開する。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EATING = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return [
  {
    key: "eating_speed_reading",
    name: "食べる速さにまつわる性格傾向",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "早く食べる人",
        tone: "neutral",
        text: "食事を早く済ませる人は、物事の発達や成功が早い相応の吉相とされる伝統的な見方がある。一方で、食事が早すぎる場合は落ち着きのなさの表れとも言われ、程度によって受け止め方が変わる。",
      },
      {
        id: "b",
        label: "ゆっくり食べる人",
        tone: "neutral",
        text: "食事に時間をかけてゆっくり食べる人は、物事にじっくり取り組むタイプとされる一方、あまりに時間がかかりすぎる場合は、発達が遅れがちになるという伝統的な見方もある。",
      },
    ],
  },
  {
    key: "eating_amount_body_type_correlation",
    name: "体型と食事量の組み合わせにまつわる性格傾向",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "痩せているのによく食べる人",
        tone: "neutral",
        text: "痩せ型なのに大食いの人は、活動的で行動力のあるタイプとされ、食べた分をエネルギーに変えて活発に動き回るという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "太っているのに少食の人",
        tone: "neutral",
        text: "恰幅が良いのに食が細い人は、実は繊細で気苦労の多いタイプであることが多いという伝統的な見方がある。見た目の印象と実際の性質が異なる典型例として語られる。",
      },
    ],
  },
  {
    key: "overeating_fortune_reading",
    name: "暴飲暴食と身代・家計にまつわる伝統的な見方",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "暴飲暴食を好む人は身代を崩しやすいとされる型",
        tone: "caution",
        text: "食欲や飲酒の欲求のままに暴飲暴食を繰り返す人は、金銭感覚も同様にだらしなくなりやすく、家計や身代を崩しやすいという伝統的な戒めがある。健康面でも節度ある食生活が望ましいとされる。",
      },
    ],
  },
  {
    key: "eating_manner_elegance_reading",
    name: "食べ方の品位・行儀にまつわる性格傾向",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "行儀よく静かに食べる人",
        tone: "positive",
        text: "口を大きく開けず、音を立てずに落ち着いて食事をする人は、品位があり、周囲への気配りができるタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "食べ方が乱雑になりがちな人",
        tone: "caution",
        text: "食器を投げるように置いたり、口いっぱいに頬張ったりと食べ方が乱雑になりがちな人は、日頃の落ち着きのなさが食事の場にも表れているとされる伝統的な見方がある。",
      },
    ],
  },
  {
    key: "eating_culture_duration_comparison",
    name: "食事にかける時間の文化的な違いにまつわる伝統的な見方",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "食事の長さは生活文化によっても異なるという視点",
        tone: "neutral",
        text: "食事にかける時間の長さは個人の性格だけでなく、育った生活文化によっても大きく異なるとされる。ゆっくり時間をかけて会話を楽しみながら食べる文化もあれば、手早く済ませることを良しとする文化もあり、一概にどちらが優れているとは言えないという視点も古くから示されている。",
      },
    ],
  },
  {
    key: "picky_eating_reading",
    name: "好き嫌いの多さにまつわる性格傾向",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "好き嫌いが少ない人",
        tone: "positive",
        text: "食べ物の好き嫌いが少なく何でもよく食べる人は、おおらかで柔軟性のある性格とされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "好き嫌いが多い人",
        tone: "neutral",
        text: "好き嫌いが多い人は、こだわりが強く自分の基準を大切にするタイプとされる一方、周囲との調整に苦労しやすい面もあるという伝統的な見方がある。",
      },
    ],
  },
  {
    key: "eating_age_appetite_change_reading",
    name: "年齢による食欲の変化にまつわる伝統的な見方",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "壮年期の大食いと老年期の大食いの違い",
        tone: "neutral",
        text: "壮年期(三十五歳前後)までの大食いは活力の表れとして問題視されないことが多いが、老年になってからも変わらず大食いを続ける場合は、かえって生活が困窮しやすい相であるという伝統的な見方がある。年齢に応じて食生活を見直すことの大切さを説く戒めとして語られる。",
      },
    ],
  },
  {
    key: "poverty_wealth_eating_manner_reading",
    name: "富貴・貧困の相と食事の仕方の結びつきにまつわる伝統的な見方",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "落ち着いて静かに食べ始める人",
        tone: "positive",
        text: "空腹であってもすぐに慌てて食べ始めず、まず静かに箸をつけてから食事を進める人は、富貴に恵まれやすいタイプとされる伝統的な見方がある。",
      },
      {
        id: "b",
        label: "口を開けてから先に食べ物を持ってくる人",
        tone: "caution",
        text: "先に口を開けてから食べ物を口元へ運ぶような食べ方をする人は、生活が困窮しやすい相であるという伝統的な言い伝えがある。あくまで古い相法上の言い伝えである。",
      },
    ],
  },
  {
    key: "eating_habit_fixed_routine_reading",
    name: "食事の量や時間が一定かどうかにまつわる伝統的な見方",
    category: "行動",
    role: "食事",
    options: [
      {
        id: "a",
        label: "食事量・時間が一定している人",
        tone: "positive",
        text: "毎日ほぼ決まった量・決まった時間に食事をとる習慣のある人は、生活が安定し、運気も比較的安定しやすいという伝統的な見方がある。",
      },
      {
        id: "b",
        label: "食事量・時間が不規則な人",
        tone: "caution",
        text: "食事の量や時間が日によって大きくばらつく人は、運気も浮き沈みしやすい傾向があるという伝統的な見方があるが、これはあくまで生活リズムの安定を促す戒めとして受け止めるのが適切である。",
      },
    ],
  },
  ];
});
