(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.PHRENOLOGY_PARTS = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return [
    // 既存の phrenology データ項目群...
    
    // --- 以下、phrenology_additions より追記分 ---
    {
      id: "phrenology_add_01",
      category: "phrenology",
      title: "頭頂部・骨相補足",
      description: "頭頂部の隆起および前後バランスに関する補足鑑定データ。"
    },
    {
      id: "phrenology_add_02",
      category: "phrenology",
      title: "側頭部・耳上部の骨相",
      description: "側頭部の張り出しと直感力・実践力に関する統合指標。"
    },
    {
      id: "phrenology_add_03",
      category: "phrenology",
      title: "後頭部・首筋接続部",
      description: "後頭結節の形状に基づく体力および耐性補足データ。"
    }
  ];
}));