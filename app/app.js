/**
 * app/app.js
 * 人相占い・鑑定カルテPWA 本体。
 *
 * 3つのモード(タブ)で構成:
 *   1. 辞典  … PARTS配列(全262項目)をカテゴリ/ロール別にブラウズする
 *   2. カルテ … 実際の人物の観察記録を蓄積する(docs/KARTE_DESIGN.md 参照)
 *   3. 隠れ相 … 画像内に浮かび上がる「顔らしきもの」の構造化情報を受け取り、
 *               伝統的な相学の考え方に沿ってルールベースで解釈する簡易エンジン
 *
 * 画像認識そのもの(ピクセル解析)はこのファイルの範囲外。
 * あくまで「位置・向き・構成要素」を人間が入力(または将来的に外部の
 * 画像認識結果を差し込む)した上で、判定ロジックだけをここで受け持つ。
 */

(function () {
  'use strict';

  var PARTS = (typeof window !== 'undefined' && Array.isArray(window.PARTS)) ? window.PARTS : [];
  var STORAGE_KEY = 'ninso.kartes.v1';
  var CATEGORY_ORDER = ['顔', '手相', '骨相学', '毛髪', '行動'];

  // ---------------------------------------------------------------------
  // ユーティリティ
  // ---------------------------------------------------------------------

  function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function formatDateTime(iso) {
    try {
      var d = new Date(iso);
      return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() +
        ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    } catch (e) {
      return iso;
    }
  }

  function escapeHTML(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function uniqueInOrder(list) {
    var seen = {};
    var out = [];
    list.forEach(function (v) {
      if (!seen[v]) { seen[v] = true; out.push(v); }
    });
    return out;
  }

  function toneLabel(tone) {
    if (tone === 'positive') return '吉';
    if (tone === 'caution') return '注意';
    return '中立';
  }

  // ---------------------------------------------------------------------
  // カルテの永続化(端末内のみ。docs/KARTE_DESIGN.md の方針に従い
  // サーバー送信・外部同期は一切行わない)
  // ---------------------------------------------------------------------

  function loadKartes() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[app] カルテの読み込みに失敗しました', e);
      return [];
    }
  }

  function saveKartes(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[app] カルテの保存に失敗しました', e);
    }
  }

  function findPart(key) {
    return PARTS.filter(function (p) { return p.key === key; })[0] || null;
  }

  // ---------------------------------------------------------------------
  // アプリ状態
  // ---------------------------------------------------------------------

  var state = {
    tab: 'dict',
    dict: { category: '顔', role: null, highlightKey: null },
    karte: { currentId: null },
    kartes: loadKartes(),
    hidden: { mode: 'manual' }, // 'manual' | 'mark' | 'json' | 'detect' | 'auto'
  };

  var root = null; // #app 要素

  function setState(patch) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    render();
  }

  // ---------------------------------------------------------------------
  // 辞典パネル
  // ---------------------------------------------------------------------

  function categoriesPresent() {
    var present = uniqueInOrder(PARTS.map(function (p) { return p.category; }));
    var ordered = CATEGORY_ORDER.filter(function (c) { return present.indexOf(c) !== -1; });
    present.forEach(function (c) { if (ordered.indexOf(c) === -1) ordered.push(c); });
    return ordered;
  }

  function rolesInCategory(category) {
    return uniqueInOrder(
      PARTS.filter(function (p) { return p.category === category; })
        .map(function (p) { return p.role; })
    );
  }

  function renderDictPanel() {
    var cats = categoriesPresent();
    var cat = state.dict.category || cats[0];
    var roles = rolesInCategory(cat);
    var role = state.dict.role;

    var html = '';

    html += '<div class="chip-row" id="cat-chips">';
    cats.forEach(function (c) {
      html += '<button class="chip' + (c === cat ? ' active' : '') + '" data-cat="' + escapeHTML(c) + '">' + escapeHTML(c) + '</button>';
    });
    html += '</div>';

    // 顔・手相カテゴリは、タップ式マップを併せて表示する
    if (cat === '顔') {
      html += '<div class="zone-map-wrap" id="face-map-wrap" aria-label="顔のタップ式マップ(読み込み中)"></div>';
    } else if (cat === '手相') {
      html += '<div class="zone-map-wrap" id="palm-map-wrap" aria-label="手相のタップ式マップ(読み込み中)"></div>';
    }

    html += '<div class="chip-row" id="role-chips">';
    html += '<button class="chip' + (!role ? ' active' : '') + '" data-role="">すべて</button>';
    roles.forEach(function (r) {
      html += '<button class="chip' + (r === role ? ' active' : '') + '" data-role="' + escapeHTML(r) + '">' + escapeHTML(r) + '</button>';
    });
    html += '</div>';

    if (state.karte.currentId) {
      var current = state.kartes.filter(function (k) { return k.id === state.karte.currentId; })[0];
      html += '<div class="notice">現在「' + escapeHTML(current ? current.label : '(削除済み)') +
        '」のカルテに追加できます。各項目の「カルテに追加」ボタンから記録してください。</div>';
    } else {
      html += '<div class="notice">カルテタブで記録先を選ぶと、ここから直接「カルテに追加」できるようになります。</div>';
    }

    var items = PARTS.filter(function (p) {
      return p.category === cat && (!role || p.role === role);
    });

    html += '<div id="dict-items">';
    if (!items.length) {
      html += '<p>このカテゴリのデータはまだありません。</p>';
    } else {
      items.forEach(function (item) {
        html += renderItemCard(item);
      });
    }
    html += '</div>';

    return html;
  }

  function renderItemCard(item) {
    var html = '<div class="item-card" id="item-' + escapeHTML(item.key) + '">';
    html += '<h3>' + escapeHTML(item.name) + '</h3>';
    (item.options || []).forEach(function (opt) {
      html += '<div class="option-row">';
      html += '<span class="option-label">' + escapeHTML(opt.label) + '</span>';
      html += '<span class="tone-badge tone-' + escapeHTML(opt.tone || 'neutral') + '">' + toneLabel(opt.tone) + '</span>';
      html += '<p class="option-text">' + escapeHTML(opt.text) + '</p>';
      if (state.karte.currentId) {
        html += '<button class="btn add-to-karte" data-key="' + escapeHTML(item.key) + '" data-option="' + escapeHTML(opt.id) + '">カルテに追加</button>';
      }
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function loadZoneMap(url, containerId, roleAttr) {
    var container = document.getElementById(containerId);
    if (!container) return;
    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (svgText) {
        container.innerHTML = svgText;
        container.setAttribute('aria-label', containerId === 'face-map-wrap' ? '顔のタップ式マップ' : '手相のタップ式マップ');
        var zones = container.querySelectorAll('[' + roleAttr + ']');
        zones.forEach(function (zone) {
          zone.setAttribute('tabindex', '0');
          zone.setAttribute('role', 'button');
          zone.addEventListener('click', function () { onZoneTap(zone, roleAttr); });
          zone.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onZoneTap(zone, roleAttr); }
          });
        });
      })
      .catch(function (err) {
        container.innerHTML = '<p style="font-size:0.8rem;color:#a1472f;">図の読み込みに失敗しました(' + escapeHTML(String(err)) + ')</p>';
      });
  }

  function onZoneTap(zone, roleAttr) {
    if (roleAttr === 'data-role') {
      setState({ dict: { category: '顔', role: zone.getAttribute('data-role'), highlightKey: null } });
    } else {
      // 手相マップ: data-key(必須) / data-option(任意)
      var key = zone.getAttribute('data-key');
      if (!key) return;
      var part = findPart(key);
      if (!part) return;
      setState({ dict: { category: '手相', role: part.role, highlightKey: key } });
      window.setTimeout(function () {
        var el = document.getElementById('item-' + key);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }

  // ---------------------------------------------------------------------
  // カルテパネル
  // ---------------------------------------------------------------------

  function renderKartePanel() {
    var html = '';
    html += '<button class="btn" id="new-karte-btn">+ 新しいカルテを作る</button>';
    html += '<div style="margin-top:14px;">';

    if (!state.kartes.length) {
      html += '<p>まだカルテがありません。「+ 新しいカルテを作る」から始めてください。</p>';
    } else {
      state.kartes.forEach(function (k) {
        html += '<div class="karte-list-item" data-karte-id="' + escapeHTML(k.id) + '">';
        html += '<span>' + escapeHTML(k.label) + '<br><small>更新: ' + escapeHTML(formatDateTime(k.updatedAt)) + ' / 記録' + (k.entries || []).length + '件</small></span>';
        html += '<button class="btn danger delete-karte-btn" data-karte-id="' + escapeHTML(k.id) + '">削除</button>';
        html += '</div>';
      });
    }
    html += '</div>';

    var current = state.kartes.filter(function (k) { return k.id === state.karte.currentId; })[0];
    if (current) {
      html += '<hr style="border:none;border-top:1px solid var(--border);margin:18px 0;">';
      html += '<h2 style="font-size:1rem;">' + escapeHTML(current.label) + ' のカルテ</h2>';
      html += '<label class="field-label">全体メモ(紙のカルテの余白に相当)</label>';
      html += '<textarea id="karte-memo">' + escapeHTML(current.memo || '') + '</textarea>';
      html += '<button class="btn secondary" id="save-memo-btn" style="margin-top:6px;">メモを保存</button>';

      html += '<p style="margin-top:16px;"><a href="#" id="go-to-dict-link">→ 辞典タブから観察を追加する</a></p>';

      html += '<h3 style="font-size:0.95rem;">記録一覧</h3>';
      var entries = (current.entries || []).slice().sort(function (a, b) { return b.recordedAt.localeCompare(a.recordedAt); });
      if (!entries.length) {
        html += '<p>まだ記録がありません。</p>';
      } else {
        entries.forEach(function (entry) {
          var part = entry.key ? findPart(entry.key) : null;
          var opt = part ? (part.options || []).filter(function (o) { return o.id === entry.optionId; })[0] : null;
          html += '<div class="karte-entry">';
          html += '<time>' + escapeHTML(formatDateTime(entry.recordedAt)) + '</time>';
          if (part && opt) {
            html += '<strong>' + escapeHTML(part.role) + '・' + escapeHTML(part.name) + '</strong> — ' + escapeHTML(opt.label);
            html += '<p style="margin:4px 0;">' + escapeHTML(opt.text) + '</p>';
          }
          if (entry.note) {
            html += '<p style="margin:4px 0;color:#6b5842;">メモ: ' + escapeHTML(entry.note) + '</p>';
          }
          html += '<button class="btn danger delete-entry-btn" data-entry-id="' + escapeHTML(entry.id) + '">削除</button>';
          html += '</div>';
        });
      }
    }

    return html;
  }

  function createKarte() {
    var label = window.prompt('カルテの名前(実名でなくニックネームやイニシャルでも構いません):', '');
    if (label === null) return;
    label = label.trim() || '無題のカルテ';
    var karte = {
      id: uid(),
      label: label,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      memo: '',
      entries: [],
    };
    state.kartes.push(karte);
    saveKartes(state.kartes);
    setState({ karte: { currentId: karte.id } });
  }

  function deleteKarte(id) {
    if (!window.confirm('このカルテを削除します。よろしいですか?')) return;
    state.kartes = state.kartes.filter(function (k) { return k.id !== id; });
    saveKartes(state.kartes);
    if (state.karte.currentId === id) state.karte.currentId = null;
    render();
  }

  function addEntryToCurrentKarte(key, optionId) {
    var karte = state.kartes.filter(function (k) { return k.id === state.karte.currentId; })[0];
    if (!karte) return;
    var note = window.prompt('補足メモ(任意・空欄でも登録できます):', '') || '';
    karte.entries = karte.entries || [];
    karte.entries.push({ id: uid(), recordedAt: nowISO(), key: key, optionId: optionId, note: note });
    karte.updatedAt = nowISO();
    saveKartes(state.kartes);
    render();
  }

  function deleteEntry(entryId) {
    var karte = state.kartes.filter(function (k) { return k.id === state.karte.currentId; })[0];
    if (!karte) return;
    karte.entries = (karte.entries || []).filter(function (e) { return e.id !== entryId; });
    karte.updatedAt = nowISO();
    saveKartes(state.kartes);
    render();
  }

  function saveMemo() {
    var karte = state.kartes.filter(function (k) { return k.id === state.karte.currentId; })[0];
    var textarea = document.getElementById('karte-memo');
    if (!karte || !textarea) return;
    karte.memo = textarea.value;
    karte.updatedAt = nowISO();
    saveKartes(state.kartes);
    render();
  }

  // ---------------------------------------------------------------------
  // 隠れ相(願相)診断エンジン
  //
  // 実際の解釈ロジック(位置/向き/種類/数 → 意味づけ、幾何スコア計算)は
  // app/hidden-face-engine.js に分離してある(DOMに依存しない純粋関数)。
  // ここでは3つの入力モードを提供する:
  //   1. manual … 位置・向き・種類・スコア・数を手入力して解釈を見る
  //   2. mark   … 画像をアップロードし、目2つ+口をタップでマーキング
  //               →幾何学的にスコア・向きを自動計算(実験的機能)
  //   3. detect … 意味づけを行わない、構造情報の整理専用フォーム(既存)
  //
  // 画像そのものの自動認識(ML)はまだ行っていない。mark モードで
  // 蓄積される「画像+マーキング座標+人が選んだ位置/種類」の記録は、
  // 将来ML化する際の学習データの土台になる(docs/GANSOU_ROADMAP.md 参照)。
  // ---------------------------------------------------------------------

  var GANSOU_STORAGE_KEY = 'ninso.gansou_samples.v1';
  var gansouMark = null; // マーキング作業中の一時状態(render()を跨いで保持しない)

  function engine() {
    return (typeof window !== 'undefined' && window.HiddenFaceEngine) || null;
  }

  function autoReader() {
    return (typeof window !== 'undefined' && window.AutonomousFaceReader) || null;
  }

  function renderHiddenManualForm() {
    var eng = engine();
    var html = '';
    html += '<div class="notice">位置・向き・種類・スコア・検出数を選ぶと、解釈文を組み立てます。実際の画像解析は行わず、入力内容にルールを当てはめるだけの娯楽的な機能です。ここでの位置・向き・種類の意味づけは、`data/`配下の出典付き文献データとは別物の、本アプリ独自の解釈枠組みです(伝統的な人相学の言い伝えそのものではありません)。</div>';

    html += '<label class="field-label">検出位置</label>';
    html += '<select id="hf-position">';
    (eng ? eng.POSITION_LIST : []).forEach(function (p) {
      html += '<option value="' + escapeHTML(p) + '">' + escapeHTML(p) + '</option>';
    });
    html += '</select>';

    html += '<label class="field-label">向き(顔全体の中心を基準とした相対方向)</label>';
    html += '<select id="hf-orientation">';
    ['内向き', '外向き', '上向き', '下向き', '不明'].forEach(function (d) {
      html += '<option value="' + d + '">' + d + '</option>';
    });
    html += '</select>';

    html += '<label class="field-label">種類</label>';
    html += '<select id="hf-type">';
    Object.keys(eng ? eng.TYPE_MEANINGS : {}).forEach(function (t) {
      html += '<option value="' + escapeHTML(t) + '">' + escapeHTML(t) + '</option>';
    });
    html += '</select>';

    html += '<label class="field-label">顔らしさスコア(0〜100・目安でよい)</label>';
    html += '<input type="text" id="hf-score" placeholder="例: 70">';

    html += '<label class="field-label">検出数(同じ画像内にいくつ願相が見えるか)</label>';
    html += '<input type="text" id="hf-count" placeholder="例: 1">';

    html += '<button class="btn" id="hf-run-btn" style="margin-top:12px;">判定する</button>';
    html += '<div id="hf-result"></div>';
    return html;
  }

  function renderGansouReport(container, report) {
    if (!container || !report) return;
    var html = '';
    html += '<div class="result-block"><dl>';
    html += '<dt>願相の位置</dt><dd>' + escapeHTML(report.position) + '</dd>';
    html += '<dt>顔の向き</dt><dd>' + escapeHTML(report.orientation) + '</dd>';
    html += '<dt>顔らしさスコア</dt><dd>' + report.score + ' / 100</dd>';
    html += '<dt>願相の特徴説明</dt><dd>' + escapeHTML(report.featureDescription) + '</dd>';
    if (report.regionCoords) {
      html += '<dt>領域座標(アプリ用)</dt><dd>' + escapeHTML(JSON.stringify(report.regionCoords)) + '</dd>';
    }
    html += '</dl></div>';

    html += '<div class="result-block"><h4>詳細解釈</h4><dl>';
    html += '<dt>位置の意味</dt><dd>' + escapeHTML(report.detail.positionMeaning) + '</dd>';
    html += '<dt>向きの意味</dt><dd>' + escapeHTML(report.detail.orientationMeaning) + '</dd>';
    html += '<dt>種類の意味</dt><dd>' + escapeHTML(report.detail.typeMeaning) + '</dd>';
    html += '<dt>数の意味</dt><dd>' + escapeHTML(report.detail.complexityNote) + '</dd>';
    html += '</dl></div>';

    html += '<div class="result-block"><h4>総合診断メッセージ</h4><p>' + escapeHTML(report.message) + '</p></div>';
    container.innerHTML = html;
  }

  function runHiddenManualDiagnosis() {
    var eng = engine();
    if (!eng) return;
    var score = parseInt((document.getElementById('hf-score') || {}).value, 10);
    var count = parseInt((document.getElementById('hf-count') || {}).value, 10);
    var input = {
      position: (document.getElementById('hf-position') || {}).value || '(未指定)',
      orientation: (document.getElementById('hf-orientation') || {}).value || '不明',
      type: (document.getElementById('hf-type') || {}).value || '不明',
      score: isNaN(score) ? 0 : Math.max(0, Math.min(100, score)),
      count: isNaN(count) ? 1 : Math.max(1, count),
    };
    var report = eng.buildGansouReport(input);
    renderGansouReport(document.getElementById('hf-result'), report);
  }

  // --- mark モード: 画像アップロード + 自動マーキング ---
  //
  // 2026-08版で全面刷新: 従来は「暗い点(目候補)のペア+その下の暗い線
  // (口候補)」という固定テンプレートで探索し、検出位置・種類をプル
  // ダウンで選んでから解析する方式だった。これだと
  //   - 目・口の幾何配置に一致しない画像(ネクタイの柄など)では
  //     候補が1件しか出ない、あるいは0件になる
  //   - 「候補を選ぶ→採用する」を毎回人間がやる必要があり、自動化に
  //     なっていない
  // という問題があった(講座動画のスクリーンショット・ユーザー指摘を
  // 踏まえての作り直し)。
  //
  // 新方式(app/pattern-detector.js)は、目・鼻・口という固定カテゴリを
  // 一切前提とせず、「意味のありそうな線のつながり」「周囲との色の
  // 違い」「周囲との陰影(浮き具合)の違い」を持つ領域をすべて検出し、
  // 講座の先生と同じように画像の上へ直接、円や線で自動的に囲んで
  // 表示する。ユーザーは候補を1件ずつ選んでから解析する必要はなく、
  // 検出結果がそのまま見える。位置・種類・向きの割り当ては、記録用の
  // 補助情報として「気になるマークをクリック(タップ)した時だけ」
  // 任意で行える。

  function renderGansouMarkForm() {
    var eng = engine();
    var html = '';
    html += '<div class="notice">画像をアップロードして「自動検出する」を押すと、目・鼻・口といった顔のパーツに当てはめようとはせず、①意味のありそうな線のつながり(しわ・筋)、②周囲との色の違い、③周囲との陰影(浮き具合)の違いを持つ領域を、見つかった分だけ画像の上に直接、円や線で自動的にマーキングします(講座の先生が手描きで丸囲みするのと同じ発想です)。目と口のように並んだ構造(隠れた顔)が見つかった場合は、丸ではなく点(●●●)3点で位置を示します。候補を1件ずつ選んで採用する操作は不要で、マークをクリック(タップ)するとその場で解釈が表示されます。位置は自動で判定されるので、鑑定される側が自分で位置を選ぶ必要はありません(必要なら手動修正もできます)。検出数が多いことは「複雑」「不安定」といった評価にはつながりません。1件1件がそれぞれ独立して意味を持つものとして扱います。学習データとして意味のある画像であれば、木目・岩肌・服の柄・小物など、顔写真以外にも使えます。まだ実験的な機能で、精度には限界があり、文献的な裏付けのある鑑定ではなく本アプリ独自の解釈です(docs/GANSOU_ROADMAP.md 参照)。</div>';

    html += '<input type="file" accept="image/*" id="gs-image-input">';
    html += '<div id="gs-image-wrap" style="position:relative;margin-top:10px;max-width:100%;">';
    html += '<img id="gs-image" style="max-width:100%;display:block;" alt="">';
    html += '<canvas id="gs-canvas" style="position:absolute;top:0;left:0;cursor:crosshair;"></canvas>';
    html += '</div>';
    html += '<p id="gs-status" style="font-size:0.8rem;color:#6b5842;">まず画像を選択してください。</p>';

    html += '<label class="field-label" style="margin-top:10px;">検出の感度</label>';
    html += '<select id="gs-sensitivity">';
    html += '<option value="wide">広め(小さな違いも拾う。誤検出は増える)</option>';
    html += '<option value="normal" selected>標準</option>';
    html += '<option value="strict">狭め(はっきり違う所だけ)</option>';
    html += '</select>';

    html += '<div style="margin-top:8px;">';
    html += '<button class="btn" id="gs-autodetect-btn" type="button">自動検出する(線・色・陰影の違いをまとめて検出)</button> ';
    html += '<button class="btn secondary" id="gs-reset-btn" type="button">マーキングをリセット</button>';
    html += '</div>';
    html += '<div id="gs-auto-summary"></div>';
    html += '<div id="gs-auto-list"></div>';

    html += '<div id="gs-select-form" style="display:none;margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);">';
    html += '<p style="font-size:0.8rem;color:#6b5842;" id="gs-select-label"></p>';
    html += '<div id="gs-result"></div>';
    html += '<details style="margin-top:10px;"><summary style="font-size:0.8rem;color:#8a7860;cursor:pointer;">位置・向き・種類を手動で修正する(任意・通常は不要です)</summary>';
    html += '<p style="font-size:0.78rem;color:#6b5842;margin-top:6px;">位置は自動で判定されています。ここで自分から位置を選び直すと、その時点でそれは「自己申告」になり、鑑定としての意味は弱くなります。ズレを感じたときだけ使ってください。</p>';
    html += '<label class="field-label">検出位置</label>';
    html += '<select id="gs-position">';
    html += '<option value="">(自動判定された位置を使用)</option>';
    html += '<optgroup label="伝統的な部位名(講座資料より・概算)">';
    var frm = (typeof window !== 'undefined' && window.FaceRegionMap) || null;
    if (frm) {
      var seenNames = {};
      frm.REGIONS.forEach(function (r) {
        if (seenNames[r.name]) return;
        seenNames[r.name] = true;
        html += '<option value="' + escapeHTML(r.name) + '">' + escapeHTML(r.name) + '</option>';
      });
    }
    html += '</optgroup>';
    html += '<optgroup label="簡易分類(本アプリ独自)">';
    (eng ? eng.POSITION_LIST : []).forEach(function (p) {
      html += '<option value="' + escapeHTML(p) + '">' + escapeHTML(p) + '</option>';
    });
    html += '</optgroup>';
    html += '</select>';

    html += '<label class="field-label">向き(関連しそうな場合のみ・任意)</label>';
    html += '<select id="gs-orientation">';
    ['(選択なし)', '内向き', '外向き', '上向き', '下向き'].forEach(function (o) {
      html += '<option value="' + escapeHTML(o) + '">' + escapeHTML(o) + '</option>';
    });
    html += '</select>';

    html += '<label class="field-label">種類(関連しそうな場合のみ・任意。パレイドリア的に何かの形に見える場合のみ選んでください)</label>';
    html += '<select id="gs-type">';
    html += '<option value="">(選択なし)</option>';
    Object.keys(eng ? eng.TYPE_MEANINGS : {}).forEach(function (t) {
      html += '<option value="' + escapeHTML(t) + '">' + escapeHTML(t) + '</option>';
    });
    html += '</select>';
    html += '</details>';
    html += '</div>';

    html += '<details style="margin-top:14px;"><summary style="font-size:0.8rem;color:#8a7860;cursor:pointer;">手動で3点(目・目・口)をタップして指定する(従来方式)</summary>';
    html += '<p style="font-size:0.8rem;color:#6b5842;margin-top:6px;">画像上を3回タップすると、目(左)→目(右)→口の順でマーキングできます。自動検出のマークとは独立して使えます。</p>';
    html += '<button class="btn secondary" id="gs-manual-analyze-btn" type="button">3点マーキングを解析する</button>';
    html += '<div id="gs-manual-result"></div>';
    html += '</details>';

    html += '<hr style="border:none;border-top:1px solid var(--border);margin:16px 0;">';
    html += '<label style="font-size:0.85rem;"><input type="checkbox" id="gs-include-image"> 画像データも一緒に保存する(端末の保存容量に注意)</label>';
    html += '<div style="margin-top:8px;">';
    html += '<button class="btn secondary" id="gs-save-sample-btn" type="button">この結果を学習データとして保存</button> ';
    html += '<button class="btn secondary" id="gs-export-btn" type="button">学習データをエクスポート(JSON)</button>';
    html += '</div>';
    html += '<p style="font-size:0.8rem;color:#6b5842;margin-top:6px;">保存済み: <span id="gs-sample-count">0</span>件(端末内のみ・外部送信なし)</p>';

    return html;
  }

  function loadGansouSamples() {
    try {
      var raw = window.localStorage.getItem(GANSOU_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveGansouSample(sample) {
    var list = loadGansouSamples();
    sample.id = uid();
    sample.recordedAt = nowISO();
    list.push(sample);
    try {
      window.localStorage.setItem(GANSOU_STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      window.alert('保存に失敗しました(端末の保存容量が不足している可能性があります)。画像を含めずに保存するか、エクスポート後にデータを整理してください。');
      return false;
    }
  }

  function exportGansouSamples() {
    var list = loadGansouSamples();
    if (!list.length) {
      window.alert('保存された学習データがまだありません。');
      return;
    }
    var blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gansou-training-samples.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 感度プリセット → PatternDetector のオプションへの変換
  // 2026-08版で調整: 実際の鑑定写真では小さなほくろ・シミ・数本の
  // 眉間の横じわなど、かなり小さいマークが対象になることが分かった
  // ため(ユーザー提示の実例より)、既定値(標準)を全体的に感度寄りに
  // 調整し、`minArea`も画像サイズに対してごく小さく設定する。
  function sensitivityToOptions(level) {
    if (level === 'wide') return { thresholdK: 0.95, maxMarks: 20, minArea: 3 };
    if (level === 'strict') return { thresholdK: 1.55, maxMarks: 12, minArea: 5 };
    return { thresholdK: 1.2, maxMarks: 16, minArea: 3 };
  }

  function initGansouMarking(panel) {
    var fileInput = panel.querySelector('#gs-image-input');
    var wrap = panel.querySelector('#gs-image-wrap');
    var img = panel.querySelector('#gs-image');
    var canvas = panel.querySelector('#gs-canvas');
    var statusEl = panel.querySelector('#gs-status');
    var resultEl = panel.querySelector('#gs-result');
    var manualResultEl = panel.querySelector('#gs-manual-result');
    var positionSelect = panel.querySelector('#gs-position');
    var orientationSelect = panel.querySelector('#gs-orientation');
    var typeSelect = panel.querySelector('#gs-type');
    var includeImageCheckbox = panel.querySelector('#gs-include-image');
    var sampleCountEl = panel.querySelector('#gs-sample-count');
    var sensitivitySelect = panel.querySelector('#gs-sensitivity');
    var autoSummaryEl = panel.querySelector('#gs-auto-summary');
    var autoListEl = panel.querySelector('#gs-auto-list');
    var selectFormEl = panel.querySelector('#gs-select-form');
    var selectLabelEl = panel.querySelector('#gs-select-label');
    if (!fileInput || !canvas) return;

    var POINT_LABELS_JA = ['目(左)', '目(右)', '口'];
    gansouMark = {
      points: [], imgLoaded: false, imgDataURL: null,
      lastReport: null, lastPoints: null, lastFaceCenter: null,
      autoMarks: [], selectedMarkId: null, analysisSize: null,
      faceBox: null, faceBoxEstimated: false, suggestedRegion: null,
      faceMarks: [], selectedFaceMarkId: null,
    };

    function updateStatus() {
      if (!gansouMark.imgLoaded) { statusEl.textContent = 'まず画像を選択してください。'; return; }
      var total = gansouMark.autoMarks.length + gansouMark.faceMarks.length;
      if (total) {
        statusEl.textContent = total + '件のマークを自動検出済み(うち目・口のように並んだ構造が' + gansouMark.faceMarks.length + '件・点で表示)。気になるマークをクリックすると、その場で解釈が表示されます(3点タップは下の「手動で指定」欄で独立して使えます)。';
      } else {
        statusEl.textContent = '「自動検出する」を押すか、下の「手動で3点をタップして指定する」を開いてください。';
      }
    }

    function markStrokeStyle(m, selected) {
      if (selected) return { stroke: '#c0392b', width: 2.6 };
      return { stroke: '#2f8fb0', width: 1.8 };
    }

    function redraw() {
      if (!canvas.getContext) return;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 自動検出マーク(円=塊、折れ線=線状パターン)
      gansouMark.autoMarks.forEach(function (m) {
        var selected = gansouMark.selectedMarkId === m.id;
        var style = markStrokeStyle(m, selected);
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.width;
        ctx.globalAlpha = selected ? 0.95 : 0.8;
        if (m.kind === 'blob') {
          ctx.beginPath();
          if (typeof m.shape.rx === 'number') {
            ctx.ellipse(m.shape.cx, m.shape.cy, Math.max(4, m.shape.rx), Math.max(4, m.shape.ry), 0, 0, Math.PI * 2);
          } else {
            ctx.arc(m.shape.cx, m.shape.cy, Math.max(4, m.shape.r), 0, Math.PI * 2);
          }
          ctx.stroke();
        } else {
          var pts = m.shape.points;
          if (pts.length) {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        // 番号ラベル
        var labelR = m.kind === 'blob' ? (typeof m.shape.rx === 'number' ? Math.max(m.shape.rx, m.shape.ry) : m.shape.r) : 0;
        var labelPos = m.kind === 'blob' ? { x: m.shape.cx + labelR + 3, y: m.shape.cy - labelR - 3 } : m.shape.points[0];
        ctx.fillStyle = style.stroke;
        ctx.font = '11px sans-serif';
        ctx.fillText(String(m.id + 1), labelPos.x + 4, labelPos.y - 2);
      });

      // 目・口のように並んだ構造(隠れた顔)の候補: 丸ではなく点3つで示す。
      gansouMark.faceMarks.forEach(function (fm) {
        var selected = gansouMark.selectedFaceMarkId === fm.id;
        var dotColor = selected ? '#c0392b' : '#2e7d4f';
        var pts = [fm.points.eyeLeft, fm.points.eyeRight, fm.points.mouth];
        ctx.strokeStyle = dotColor;
        ctx.globalAlpha = selected ? 0.9 : 0.7;
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = dotColor;
        pts.forEach(function (p) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.font = '11px sans-serif';
        ctx.fillText('F' + (fm.id + 1), pts[0].x - 14, pts[0].y - 6);
      });

      // 手動3点マーキング
      ctx.fillStyle = '#a1472f';
      ctx.font = '12px sans-serif';
      gansouMark.points.forEach(function (p, i) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText(POINT_LABELS_JA[i], p.x + 8, p.y - 8);
      });
      if (gansouMark.points.length >= 2) {
        ctx.strokeStyle = '#7a5c3e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gansouMark.points[0].x, gansouMark.points[0].y);
        ctx.lineTo(gansouMark.points[1].x, gansouMark.points[1].y);
        ctx.stroke();
      }
    }

    function updateSampleCount() {
      if (sampleCountEl) sampleCountEl.textContent = String(loadGansouSamples().length);
    }

    function renderAutoList() {
      if (!gansouMark.autoMarks.length && !gansouMark.faceMarks.length) {
        autoListEl.innerHTML = '';
        return;
      }
      var html = '';
      gansouMark.autoMarks.forEach(function (m) {
        var kindLabel = m.kind === 'line' ? '線' : '塊';
        var selected = gansouMark.selectedMarkId === m.id;
        html += '<div class="option-row' + (selected ? ' active' : '') + '" data-mark-id="' + m.id + '" style="cursor:pointer;' + (selected ? 'font-weight:bold;' : '') + '">' +
          '<span class="option-label">#' + (m.id + 1) + ' ' + kindLabel + '・スコア' + m.score + '</span> ' +
          '<span style="font-size:0.78rem;color:#6b5842;">' + escapeHTML(m.note) + '</span></div>';
      });
      gansouMark.faceMarks.forEach(function (fm) {
        var selected = gansouMark.selectedFaceMarkId === fm.id;
        html += '<div class="option-row' + (selected ? ' active' : '') + '" data-face-mark-id="' + fm.id + '" style="cursor:pointer;' + (selected ? 'font-weight:bold;' : '') + '">' +
          '<span class="option-label">#F' + (fm.id + 1) + ' 目・口のように並んだ構造・スコア' + fm.score + '</span> ' +
          '<span style="font-size:0.78rem;color:#6b5842;">丸ではなく点3つで位置を示しています</span></div>';
      });
      autoListEl.innerHTML = html;
      autoListEl.querySelectorAll('[data-mark-id]').forEach(function (row) {
        row.addEventListener('click', function () {
          selectMark(parseInt(row.getAttribute('data-mark-id'), 10));
        });
      });
      autoListEl.querySelectorAll('[data-face-mark-id]').forEach(function (row) {
        row.addEventListener('click', function () {
          selectFaceMark(parseInt(row.getAttribute('data-face-mark-id'), 10));
        });
      });
    }

    // canvas座標(cx,cy)から、顔の外接矩形基準で最も近い伝統的部位を返す。
    // face-region-map.jsが読み込まれていない場合はnull。
    function regionAt(cx, cy) {
      var frm = (typeof window !== 'undefined' && window.FaceRegionMap) || null;
      if (!frm) return null;
      var box = gansouMark.faceBox || { x: 0, y: 0, w: canvas.width, h: canvas.height };
      if (!(box.w > 0 && box.h > 0)) return null;
      var nx = (cx - box.x) / box.w, ny = (cy - box.y) / box.h;
      return frm.findNearestRegion(nx, ny);
    }

    function selectMark(id) {
      var m = gansouMark.autoMarks.filter(function (x) { return x.id === id; })[0];
      if (!m) return;
      gansouMark.selectedMarkId = id;
      gansouMark.selectedFaceMarkId = null;
      redraw();
      renderAutoList();
      selectFormEl.style.display = '';
      if (positionSelect) positionSelect.value = '';
      if (orientationSelect) orientationSelect.value = '(選択なし)';
      if (typeSelect) typeSelect.value = '';

      var frm = (typeof window !== 'undefined' && window.FaceRegionMap) || null;
      gansouMark.suggestedRegion = null;
      gansouMark.suggestedRegionStart = null;
      gansouMark.suggestedRegionEnd = null;
      gansouMark.suggestedRegionPath = null;
      if (frm) {
        if (m.kind === 'line') {
          var pts = m.shape.points;
          // 2026-08版で見直し: 講座2(実演)で「線はその途中で通る部位を
          // 全部拾って、それらが全部その意味に絡んでくる」という具体的な
          // 教えがあったため、始点・終点の2点だけでなく、線が通る全ての
          // 点で部位を判定し、連続して同じ部位が続く場合はまとめて
          // (区間を潰して)経路として保持する。
          var path = [];
          pts.forEach(function (p) {
            var r = regionAt(p.x, p.y);
            if (r && (!path.length || path[path.length - 1].name !== r.name)) path.push(r);
          });
          gansouMark.suggestedRegionPath = path;
          gansouMark.suggestedRegionStart = path[0] || null;
          gansouMark.suggestedRegionEnd = path[path.length - 1] || null;
          gansouMark.suggestedRegion = gansouMark.suggestedRegionStart;
        } else {
          gansouMark.suggestedRegion = regionAt(m.shape.cx, m.shape.cy);
        }
      }
      var kindLabel = m.kind === 'line' ? '線状のパターン' : '塊状のパターン';
      selectLabelEl.textContent = '選択中: #' + (m.id + 1) + '(' + kindLabel + '・スコア' + m.score + ')';
      interpretCurrentMark();
    }

    fileInput.addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        img.onload = function () {
          var w = img.clientWidth || img.naturalWidth || 300;
          var h = img.clientHeight || img.naturalHeight || 300;
          canvas.width = w;
          canvas.height = h;
          wrap.style.width = w + 'px';
          wrap.style.height = h + 'px';
          gansouMark.points = [];
          gansouMark.autoMarks = [];
          gansouMark.faceMarks = [];
          gansouMark.selectedMarkId = null;
          gansouMark.selectedFaceMarkId = null;
          gansouMark.imgDataURL = e.target.result;
          gansouMark.imgLoaded = true;
          resultEl.innerHTML = '';
          manualResultEl.innerHTML = '';
          autoSummaryEl.innerHTML = '';
          autoListEl.innerHTML = '';
          selectFormEl.style.display = 'none';
          updateStatus();
          redraw();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    canvas.addEventListener('click', function (ev) {
      if (!gansouMark.imgLoaded) return;
      var rect = canvas.getBoundingClientRect();
      var cx = ev.clientX - rect.left, cy = ev.clientY - rect.top;

      // まず、既存の自動マークの近くをクリックしたかどうかを判定する
      // (円は中心からの距離、線は各点までの最短距離で判定)。
      var hitId = null, hitDist = Infinity;
      gansouMark.autoMarks.forEach(function (m) {
        var d;
        if (m.kind === 'blob') {
          var dx = cx - m.shape.cx, dy = cy - m.shape.cy;
          if (typeof m.shape.rx === 'number') {
            // 楕円: 正規化距離(1以下なら内側)を疑似的な距離として使う
            var normDist = Math.sqrt((dx / m.shape.rx) * (dx / m.shape.rx) + (dy / m.shape.ry) * (dy / m.shape.ry));
            d = normDist <= 1 ? 0 : (normDist - 1) * Math.max(m.shape.rx, m.shape.ry);
          } else {
            d = Math.abs(Math.sqrt(dx * dx + dy * dy) - m.shape.r);
            d = Math.min(d, Math.sqrt(dx * dx + dy * dy) <= m.shape.r ? 0 : d);
          }
        } else {
          d = Infinity;
          var pts = m.shape.points;
          for (var i = 0; i < pts.length; i++) {
            var ddx = cx - pts[i].x, ddy = cy - pts[i].y;
            var dd = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd < d) d = dd;
          }
        }
        if (d < 14 && d < hitDist) { hitDist = d; hitId = m.id; }
      });

      if (hitId !== null) {
        selectMark(hitId);
        return;
      }

      // 目・口のように並んだ構造(点3つ)の近くをクリックしたかどうか
      var hitFaceId = null, hitFaceDist = Infinity;
      gansouMark.faceMarks.forEach(function (fm) {
        [fm.points.eyeLeft, fm.points.eyeRight, fm.points.mouth].forEach(function (p) {
          var ddx = cx - p.x, ddy = cy - p.y;
          var dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < 14 && dd < hitFaceDist) { hitFaceDist = dd; hitFaceId = fm.id; }
        });
      });
      if (hitFaceId !== null) {
        selectFaceMark(hitFaceId);
        return;
      }

      // 自動マークにヒットしなかった場合、手動3点マーキング欄がまだ
      // 埋まっていなければ、そちらへ座標を追加する(従来の挙動を維持)。
      if (gansouMark.points.length < 3) {
        gansouMark.points.push({ x: cx, y: cy });
        redraw();
      }
    });

    var autoDetectBtn = panel.querySelector('#gs-autodetect-btn');
    if (autoDetectBtn) autoDetectBtn.addEventListener('click', function () {
      if (!gansouMark.imgLoaded) {
        autoSummaryEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">先に画像を選択してください。</p>';
        return;
      }
      var pd = (typeof window !== 'undefined' && window.PatternDetector) || null;
      if (!pd) {
        autoSummaryEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">検出モジュールを読み込めませんでした。</p>';
        return;
      }
      autoSummaryEl.innerHTML = '<p style="font-size:0.8rem;color:#6b5842;">解析中(複数解像度で線・色・陰影の違いを探索しています)…</p>';
      autoListEl.innerHTML = '';
      selectFormEl.style.display = 'none';
      gansouMark.selectedMarkId = null;

      var naturalW = img.naturalWidth || canvas.width;
      var naturalH = img.naturalHeight || canvas.height;
      // 2026-08版で解析解像度を引き上げ(360→480): 実際の鑑定写真では
      // 小さなほくろ・数本の眉間の横じわなど、かなり小さいマークが
      // 対象になるため、解析解像度が低いと消えてしまう(ユーザー提示の
      // 実例より)。
      var maxDim = 480;
      var scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
      var analysisW = Math.max(1, Math.round(naturalW * scale));
      var analysisH = Math.max(1, Math.round(naturalH * scale));

      var offCanvas = document.createElement('canvas');
      offCanvas.width = analysisW;
      offCanvas.height = analysisH;
      var offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0, analysisW, analysisH);

      var imageData;
      try {
        imageData = offCtx.getImageData(0, 0, analysisW, analysisH);
      } catch (e) {
        autoSummaryEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">画像の解析に失敗しました(' + escapeHTML(String(e)) + ')。</p>';
        return;
      }

      var sensOptions = sensitivityToOptions(sensitivitySelect ? sensitivitySelect.value : 'normal');
      var marks = pd.findMarkingsMultiScale(imageData, shallowMergeLocal({
        scales: [200, 320, 480],
      }, sensOptions));

      // 顔の外接矩形を推定(肌色領域から)。これを基準に正規化しないと、
      // 背景(壁・服・ネクタイ等)が写り込んだ写真では、実際には顔の外側
      // (例: 耳のあたり)にあるマークが、canvas全体を基準にした場合と
      // 大きくズレた位置として誤って扱われてしまう(例: 耳の線が「右目の
      // 下」として提案される、といった誤動作の原因になっていた)。
      var hfd = (typeof window !== 'undefined' && window.HiddenFaceDetector) || null;
      var faceBoxAnalysis = hfd ? hfd.computeSkinRegion(imageData, {}) : null;

      // 解析用の縮小座標 → 表示canvas座標へのスケール
      var scaleX = canvas.width / analysisW;
      var scaleY = canvas.height / analysisH;

      if (faceBoxAnalysis && faceBoxAnalysis.used) {
        gansouMark.faceBox = {
          x: faceBoxAnalysis.x1 * scaleX, y: faceBoxAnalysis.y1 * scaleY,
          w: (faceBoxAnalysis.x2 - faceBoxAnalysis.x1) * scaleX,
          h: (faceBoxAnalysis.y2 - faceBoxAnalysis.y1) * scaleY,
        };
      } else {
        // 肌色領域が信頼できない場合は画像全体を代用するが、その旨を
        // 位置提案の際に明示する(faceBoxEstimated=falseで判別)。
        gansouMark.faceBox = { x: 0, y: 0, w: canvas.width, h: canvas.height };
      }
      gansouMark.faceBoxEstimated = !!(faceBoxAnalysis && faceBoxAnalysis.used);

      gansouMark.autoMarks = marks.map(function (m) {
        var scaled = { id: m.id, kind: m.kind, score: m.score, note: m.note, scale: m.scale };
        if (m.kind === 'blob') {
          if (typeof m.shape.rx === 'number') {
            scaled.shape = { cx: m.shape.cx * scaleX, cy: m.shape.cy * scaleY, rx: m.shape.rx * scaleX, ry: m.shape.ry * scaleY };
          } else {
            scaled.shape = { cx: m.shape.cx * scaleX, cy: m.shape.cy * scaleY, r: m.shape.r * ((scaleX + scaleY) / 2) };
          }
        } else {
          scaled.shape = {
            points: m.shape.points.map(function (p) { return { x: p.x * scaleX, y: p.y * scaleY }; }),
            strokeWidth: m.shape.strokeWidth,
          };
        }
        if (m.bbox) {
          scaled.bbox = { x: m.bbox.x * scaleX, y: m.bbox.y * scaleY, w: m.bbox.w * scaleX, h: m.bbox.h * scaleY };
        }
        return scaled;
      });
      gansouMark.analysisSize = { w: analysisW, h: analysisH };

      // 目・口のように並んだ構造(隠れた顔)の検出。
      // 従来の`findFaceCandidatesMultiScale`(元は「本物の顔の目・口」を
      // 見つけるための検出器)を流用し、丸(塊)ではなく点3つ(目・目・口)
      // でマーキングする。感度は「広め〜標準」寄り(小さいものから
      // 実物大に近いものまで拾う)に設定し、肌色領域の余白も広めに取って
      // 髪の生え際・輪郭付近まで探索する。
      var faceCandidates = [];
      if (hfd) {
        try {
          faceCandidates = hfd.findFaceCandidatesMultiScale(imageData, {
            scales: [200, 320, 480],
            minEyeDistRatio: 0.015,
            maxEyeDistRatio: 0.5,
            maxCandidates: 8,
            skin: { marginRatio: 0.4 },
          }) || [];
        } catch (e) {
          faceCandidates = [];
        }
      }
      gansouMark.faceMarks = faceCandidates.map(function (c, idx) {
        return {
          id: idx,
          score: c.score,
          points: {
            eyeLeft: { x: c.points.eyeLeft.x * scaleX, y: c.points.eyeLeft.y * scaleY },
            eyeRight: { x: c.points.eyeRight.x * scaleX, y: c.points.eyeRight.y * scaleY },
            mouth: { x: c.points.mouth.x * scaleX, y: c.points.mouth.y * scaleY },
          },
        };
      });

      var totalFound = gansouMark.autoMarks.length + gansouMark.faceMarks.length;
      if (!totalFound) {
        autoSummaryEl.innerHTML = '<p style="font-size:0.85rem;color:#6b5842;">この設定では、周囲から明確に浮いて見える線・色・陰影のパターンは見つかりませんでした。「検出の感度」を「広め」に変えて再度お試しいただくか、手動で3点マーキングしてください。</p>';
      } else {
        autoSummaryEl.innerHTML = '<p style="font-size:0.85rem;color:#6b5842;">' + totalFound + '件のマークを検出しました(スコア順)。画像に直接、円・楕円(塊状のパターン)、線(線状のつながり)、点3つ(目・口のように並んだ構造・' + gansouMark.faceMarks.length + '件)で表示しています。気になるマークをクリックすると、その場で解釈が表示されます。</p>';
      }
      renderAutoList();
      redraw();
      updateStatus();
    });

    function shallowMergeLocal(a, b) {
      var out = {}, k;
      if (a) for (k in a) if (a.hasOwnProperty(k)) out[k] = a[k];
      if (b) for (k in b) if (b.hasOwnProperty(k)) out[k] = b[k];
      return out;
    }

    // 2026-08版で新規追加: 自動検出マーク専用の解釈生成。
    //
    // 経緯: 以前はここで`eng.buildGansouReport()`(旧・固定テンプレート
    // 時代の解釈エンジン)をそのまま流用していたため、
    //   - 「検出された願相は9個と多く…」という、画像全体のマーク総数に
    //     関する話が、選択した1件だけの解釈に紛れ込む
    //   - 「顔らしさスコア」という、目・口テンプレートへの当てはまり度を
    //     表す旧概念のラベルが、無関係なサリエンススコアに使われる
    //   - 位置・種類のプルダウンが未選択でも規定値(先頭の選択肢)が
    //     勝手に採用され、ユーザーが選んでいない情報が解釈に混入する
    //   という、ユーザー指摘の「全体の鑑定とごちゃごちゃになっている」
    //   問題があった。
    // このため、選択中の1マークの実データ(種別・スコア・note・自動提案
    // された位置)だけを材料にした、独立した解釈文を組み立てる。
    //
    // さらに(今回の見直し): 「位置をプルダウンで自分から選ぶのは
    // 自己申告になってしまい、鑑定として意味がない」という指摘を受け、
    // 位置は既定で自動判定を使い、手動選択があった場合だけ「(手動選択)」
    // と明示して区別する。また文言は「参考程度に留めてください」を
    // マークごとに繰り返さず、断定的に言い切る形に改めた
    // (全体的な免責は上の案内文に一度だけ書く)。
    // 線状のマークは、始点・終点それぞれの部位が異なる場合、両者を
    // つなぐ1つの意味として言い切る(「AからBへ」という形)。
    function regionPhrase(region) {
      // 「◯◯に関わるとされる部位」→「◯◯」だけを取り出す(接続しやすくするため)
      if (!region) return '';
      return region.meaning.replace(/(に関わるとされる部位|を意味するとされる部位)([^、。]*)?$/, '$2').replace(/とされる部位$/, '');
    }

    function buildMarkInterpretation(m) {
      var kindLabel = m.kind === 'line' ? '線状のつながり(しわ・筋の候補)' : '塊状の領域(色・陰影の違い)';
      var positionValue = (positionSelect && positionSelect.value) || '';
      var manualRegion = null;
      if (frmGlobal() && positionValue) {
        manualRegion = frmGlobal().REGIONS.filter(function (r) { return r.name === positionValue; })[0] || null;
      }
      var orientationValue = (orientationSelect && orientationSelect.value) || '';
      var typeValue = (typeSelect && typeSelect.value) || '';
      var eng = engine();

      var lines = [];
      lines.push('種別: ' + kindLabel);
      lines.push('検出スコア: ' + m.score + '点(周囲との違いの大きさを表す、本アプリ独自の指標。他の一般的な「顔らしさ」とは無関係です)');
      lines.push('検出された特徴: ' + m.note);

      var summaryParts = [];
      var path = (m.kind === 'line' && !manualRegion) ? (gansouMark.suggestedRegionPath || []) : null;
      var regionStart = manualRegion || gansouMark.suggestedRegionStart || gansouMark.suggestedRegion;
      var regionEnd = manualRegion ? null : gansouMark.suggestedRegionEnd;
      var basis = manualRegion ? '(手動選択)' : (gansouMark.faceBoxEstimated ? '(自動判定)' : '(自動判定・顔の範囲を特定できなかったため精度は低め)');

      // 2026-08版で追加: 講座2(実演)で「天中から下る線・色は先祖の
      // 加護、天中へ登る線は自分の力ではどうにもならない大事に関わる相」
      // という具体的な教えがあり、その見分けは検出された色(明るい/暗い)
      // で行う、との説明だった。天中が経路に含まれる線については、この
      // 教えを優先して適用する。
      var passesTenchu = path && path.some(function (r) { return r.name === '天中'; });
      if (m.kind === 'line' && passesTenchu) {
        var otherRegions = path.filter(function (r) { return r.name !== '天中'; });
        var isBright = /明るい/.test(m.note);
        var isDark = /暗い/.test(m.note);
        var otherNames = otherRegions.map(function (r) { return r.name; }).join('→') || '周辺部位';
        lines.push('位置: 天中を含む経路(' + path.map(function (r) { return r.name; }).join('→') + ')' + basis);
        summaryParts.push('この線(または色の変化)は、人相で最重要とされる「天中」につながっています。');
        if (isBright) {
          summaryParts.push('天中からきれいに降りている(明るい)ことから、伝統的にはご先祖からの加護・応援が' + otherNames + 'の方向へ及んでいる相として読み取れます。');
        } else if (isDark) {
          summaryParts.push('天中へと(暗い色で)つながっていることから、伝統的には自分の力だけではどうにもならない大きな出来事(裁判・不可抗力の事態など)に関わる相として読み取れます。');
        } else {
          summaryParts.push('天中は、ご先祖からの加護(明るい色で下る場合)と、自分の力ではどうにもならない大事(暗い色で天中へ向かう場合)の両方に関わる、特に重要な部位とされます。今回は色の判定がはっきりしないため、どちらの意味合いが強いかは判断できません。');
        }
      } else if (m.kind === 'line' && path && path.length >= 2) {
        var pathNames = path.map(function (r) { return r.name; });
        lines.push('位置: 「' + pathNames.join('」→「') + '」' + basis);
        summaryParts.push('この線は「' + pathNames.join('」→「') + '」という経路でつながっています' + basis + '。');
        var phraseList = path.map(function (r) { return r.name + '(' + regionPhrase(r) + ')'; }).join('、');
        summaryParts.push('伝統的には、線が通る部位(' + phraseList + ')はすべてこの相に関わってくるとされ、' + regionPhrase(path[0]) + 'の力が' + regionPhrase(path[path.length - 1]) + 'へとつながっていく相として読み取れます。');
      } else if (regionStart) {
        lines.push('位置: ' + regionStart.name + basis + ' — ' + regionStart.meaning);
        summaryParts.push('位置は「' + regionStart.name + '」にあたり、伝統的にはこの部位は' + regionStart.meaning + 'です。');
      } else if (positionValue) {
        var oldMeaning = eng && eng.POSITION_MEANINGS ? eng.POSITION_MEANINGS[positionValue] : null;
        lines.push('位置: ' + positionValue + (oldMeaning ? ' — ' + oldMeaning : ''));
        summaryParts.push('位置は「' + positionValue + '」です。');
      } else {
        lines.push('位置: (判定できませんでした)');
      }

      if (orientationValue && orientationValue !== '(選択なし)') {
        lines.push('向き: ' + orientationValue);
        summaryParts.push('向きは' + orientationValue + 'です。');
      }
      if (typeValue) {
        var typeMeaning = eng && eng.TYPE_MEANINGS ? eng.TYPE_MEANINGS[typeValue] : null;
        lines.push('種類: ' + typeValue + (typeMeaning ? ' — ' + typeMeaning : ''));
        summaryParts.push('種類は「' + typeValue + '」に近い見え方です。');
      }
      summaryParts.push('このマーク単体についての、本アプリ独自の解釈です(他の検出数や画像全体の評価とは無関係)。');

      return { lines: lines, summary: summaryParts.join('') };
    }

    function frmGlobal() {
      return (typeof window !== 'undefined' && window.FaceRegionMap) || null;
    }

    function renderMarkInterpretation(container, m, interp) {
      var html = '';
      html += '<div class="result-block"><h4>検出内容</h4><dl>';
      interp.lines.forEach(function (line) {
        var parts = line.split(/: (.+)/);
        if (parts.length >= 2) {
          html += '<dt>' + escapeHTML(parts[0]) + '</dt><dd>' + escapeHTML(parts[1]) + '</dd>';
        } else {
          html += '<dd>' + escapeHTML(line) + '</dd>';
        }
      });
      if (m.bbox) {
        html += '<dt>領域座標(アプリ用)</dt><dd>' + escapeHTML(JSON.stringify({ x: Math.round(m.bbox.x), y: Math.round(m.bbox.y), w: Math.round(m.bbox.w), h: Math.round(m.bbox.h) })) + '</dd>';
      }
      html += '</dl></div>';
      html += '<div class="result-block"><h4>このマークについての解釈(このマーク単体のみ)</h4><p>' + escapeHTML(interp.summary) + '</p></div>';
      container.innerHTML = html;
    }

    // 目・口のように並んだ構造(隠れた顔)専用の解釈生成。
    // 目の中点と口の位置、それぞれの伝統的な部位を判定し、
    // 「顔の中の顔」として断定的に言い切る。
    function buildFaceMarkInterpretation(fm) {
      var eyeMidX = (fm.points.eyeLeft.x + fm.points.eyeRight.x) / 2;
      var eyeMidY = (fm.points.eyeLeft.y + fm.points.eyeRight.y) / 2;
      var eyeRegion = regionAt(eyeMidX, eyeMidY);
      var mouthRegion = regionAt(fm.points.mouth.x, fm.points.mouth.y);
      var basis = gansouMark.faceBoxEstimated ? '(自動判定)' : '(自動判定・顔の範囲を特定できなかったため精度は低め)';

      var lines = [];
      lines.push('種別: 目・口のように並んだ構造(隠れた顔)');
      lines.push('検出スコア: ' + fm.score + '点(目・口らしい配置の明確さを表す、本アプリ独自の指標)');
      if (eyeRegion) lines.push('目にあたる位置: ' + eyeRegion.name + basis + ' — ' + eyeRegion.meaning);
      if (mouthRegion) lines.push('口にあたる位置: ' + mouthRegion.name + basis + ' — ' + mouthRegion.meaning);

      var summaryParts = [];
      summaryParts.push('ここに、目と口のように並んだ構造(顔の中に隠れたもう1つの顔)が見えます。');
      if (eyeRegion) {
        summaryParts.push('目にあたる位置は「' + eyeRegion.name + '」で、' + regionPhrase(eyeRegion) + 'を表す部位です。');
      }
      if (mouthRegion) {
        summaryParts.push('口にあたる位置は「' + mouthRegion.name + '」で、' + regionPhrase(mouthRegion) + 'を表す部位です。');
      }
      if (eyeRegion && mouthRegion && eyeRegion.name !== mouthRegion.name) {
        summaryParts.push('この隠れた顔は、' + regionPhrase(eyeRegion) + 'と' + regionPhrase(mouthRegion) + 'が重なり合って表に出てきている相として読み取れます。');
      }
      summaryParts.push('このマーク単体についての、本アプリ独自の解釈です(他の検出数や画像全体の評価とは無関係)。');

      return { lines: lines, summary: summaryParts.join('') };
    }

    function renderFaceMarkInterpretation(container, fm, interp) {
      var html = '';
      html += '<div class="result-block"><h4>検出内容</h4><dl>';
      interp.lines.forEach(function (line) {
        var parts = line.split(/: (.+)/);
        if (parts.length >= 2) {
          html += '<dt>' + escapeHTML(parts[0]) + '</dt><dd>' + escapeHTML(parts[1]) + '</dd>';
        } else {
          html += '<dd>' + escapeHTML(line) + '</dd>';
        }
      });
      html += '</dl></div>';
      html += '<div class="result-block"><h4>このマークについての解釈(このマーク単体のみ)</h4><p>' + escapeHTML(interp.summary) + '</p></div>';
      container.innerHTML = html;
    }

    // 現在選択中のマーク(塊/線、または目・口の隠れた顔)を判定し、
    // 選択直後・手動修正の変更直後の両方から呼ばれる共通の描画関数。
    // クリックしただけでその場に解釈が出るようにし、「解釈する」ボタンを
    // 別途押す必要はない(位置プルダウンでの自己申告を主経路にしない)。
    function interpretCurrentMark() {
      if (gansouMark.selectedFaceMarkId !== null) {
        var fm = gansouMark.faceMarks.filter(function (x) { return x.id === gansouMark.selectedFaceMarkId; })[0];
        if (!fm) return;
        var finterp = buildFaceMarkInterpretation(fm);
        renderFaceMarkInterpretation(resultEl, fm, finterp);
        return;
      }
      var m = gansouMark.autoMarks.filter(function (x) { return x.id === gansouMark.selectedMarkId; })[0];
      if (!m) return;
      var interp = buildMarkInterpretation(m);
      renderMarkInterpretation(resultEl, m, interp);
    }

    [positionSelect, orientationSelect, typeSelect].forEach(function (sel) {
      if (sel) sel.addEventListener('change', interpretCurrentMark);
    });

    function selectFaceMark(id) {
      var fm = gansouMark.faceMarks.filter(function (x) { return x.id === id; })[0];
      if (!fm) return;
      gansouMark.selectedFaceMarkId = id;
      gansouMark.selectedMarkId = null;
      redraw();
      renderAutoList();
      selectFormEl.style.display = '';
      selectLabelEl.textContent = '選択中: #F' + (fm.id + 1) + '(目・口のように並んだ構造・スコア' + fm.score + ')';
      interpretCurrentMark();
    }

    var resetBtn = panel.querySelector('#gs-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      gansouMark.points = [];
      gansouMark.autoMarks = [];
      gansouMark.faceMarks = [];
      gansouMark.selectedMarkId = null;
      gansouMark.selectedFaceMarkId = null;
      gansouMark.lastReport = null;
      redraw();
      updateStatus();
      resultEl.innerHTML = '';
      manualResultEl.innerHTML = '';
      autoSummaryEl.innerHTML = '';
      autoListEl.innerHTML = '';
      selectFormEl.style.display = 'none';
    });

    var manualAnalyzeBtn = panel.querySelector('#gs-manual-analyze-btn');
    if (manualAnalyzeBtn) manualAnalyzeBtn.addEventListener('click', function () {
      var eng = engine();
      if (!eng) return;
      if (gansouMark.points.length < 3) {
        manualResultEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">先に画像上で3点(目2つ・口)をタップしてください。</p>';
        return;
      }
      var points = { eyeLeft: gansouMark.points[0], eyeRight: gansouMark.points[1], mouth: gansouMark.points[2] };
      var faceCenter = { x: canvas.width / 2, y: canvas.height / 2 };
      var score = eng.computeFaceLikenessScore(points);
      var orientation = eng.computeOrientation(points, faceCenter);
      var minX = Math.min(points.eyeLeft.x, points.eyeRight.x, points.mouth.x);
      var minY = Math.min(points.eyeLeft.y, points.eyeRight.y, points.mouth.y);
      var maxX = Math.max(points.eyeLeft.x, points.eyeRight.x, points.mouth.x);
      var maxY = Math.max(points.eyeLeft.y, points.eyeRight.y, points.mouth.y);
      var report = eng.buildGansouReport({
        position: positionSelect.value,
        orientation: orientation,
        type: typeSelect.value,
        score: score,
        count: 1,
        regionCoords: { x: Math.round(minX - 15), y: Math.round(minY - 15), w: Math.round(maxX - minX + 30), h: Math.round(maxY - minY + 30) },
      });
      gansouMark.lastReport = report;
      gansouMark.lastPoints = points;
      gansouMark.lastFaceCenter = faceCenter;
      renderGansouReport(manualResultEl, report);
    });

    var saveBtn = panel.querySelector('#gs-save-sample-btn');
    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (!gansouMark.lastReport) {
        window.alert('先に「このマークを解釈する」または「3点マーキングを解析する」を実行してください。');
        return;
      }
      var ok = saveGansouSample({
        points: gansouMark.lastPoints,
        faceCenter: gansouMark.lastFaceCenter,
        selectedMark: gansouMark.selectedMarkId !== null ? gansouMark.autoMarks.filter(function (x) { return x.id === gansouMark.selectedMarkId; })[0] : null,
        canvasSize: { w: canvas.width, h: canvas.height },
        position: positionSelect.value,
        type: typeSelect.value,
        orientation: gansouMark.lastReport.orientation,
        score: gansouMark.lastReport.score,
        image: includeImageCheckbox.checked ? gansouMark.imgDataURL : null,
      });
      if (ok) updateSampleCount();
    });

    var exportBtn = panel.querySelector('#gs-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportGansouSamples);

    updateSampleCount();
  }

  // ---------------------------------------------------------------------
  // 顔らしさ検出フォーム(意味づけを行わない、構造化情報の入力のみ)
  // ---------------------------------------------------------------------

  function renderFaceLikelihoodForm() {
    var html = '';
    html += '<div class="notice">こちらは意味づけ(敵意・恋愛・象徴など)を行わない、構造情報の整理専用フォームです。実際の画像解析は行わず、目視で確認した内容を入力して整理するための機能です。</div>';

    html += '<label class="field-label">顔らしさの有無</label>';
    html += '<select id="fl-presence"><option value="あり">あり</option><option value="なし">なし</option></select>';

    html += '<label class="field-label">顔らしさの位置(座標やおおまかな場所)</label>';
    html += '<input type="text" id="fl-position" placeholder="例: 画像中央やや右上">';

    html += '<label class="field-label">顔らしさの信頼度(0〜1)</label>';
    html += '<input type="text" id="fl-confidence" placeholder="例: 0.6">';

    html += '<label class="field-label">構成要素の検出状況</label>';
    ['目', '鼻', '口', '輪郭'].forEach(function (part) {
      html += '<label style="display:inline-block;margin-right:12px;font-size:0.85rem;">' +
        '<input type="checkbox" class="fl-component" value="' + part + '"> ' + part + '</label>';
    });

    html += '<label class="field-label">顔の向き</label>';
    html += '<select id="fl-orientation"><option value="正面">正面</option><option value="横">横</option><option value="不明">不明</option></select>';

    html += '<button class="btn" id="fl-run-btn" style="margin-top:12px;">整理する</button>';
    html += '<div id="fl-result"></div>';
    return html;
  }

  function runFaceLikelihoodReport() {
    var presence = (document.getElementById('fl-presence') || {}).value || 'なし';
    var position = (document.getElementById('fl-position') || {}).value || '(未入力)';
    var confidence = (document.getElementById('fl-confidence') || {}).value || '(未入力)';
    var orientation = (document.getElementById('fl-orientation') || {}).value || '不明';
    var components = Array.prototype.slice.call(document.querySelectorAll('.fl-component:checked')).map(function (el) { return el.value; });

    var out = document.getElementById('fl-result');
    if (!out) return;
    var html = '';
    html += '<div class="result-block"><dl>';
    html += '<dt>1. 顔らしさの有無</dt><dd>' + escapeHTML(presence) + '</dd>';
    html += '<dt>2. 顔らしさの位置(座標)</dt><dd>' + escapeHTML(position) + '</dd>';
    html += '<dt>3. 顔らしさの信頼度(0〜1)</dt><dd>' + escapeHTML(confidence) + '</dd>';
    html += '<dt>4. 顔の構成要素の検出状況</dt><dd>' + (components.length ? escapeHTML(components.join('・')) : '(検出要素なし)') + '</dd>';
    html += '<dt>5. 顔の向き</dt><dd>' + escapeHTML(orientation) + '</dd>';
    html += '</dl></div>';
    out.innerHTML = html;
  }

  // ---------------------------------------------------------------------
  // 全体解析(自律・選択操作なし)フォーム
  //
  // ユーザー要望への対応: 「目」「口」等をプルダウンで選択させず、画像を
  // アップロードするだけで自動的に解釈する。パーツ単位の選択は行わない。
  // ただし正直な注意として、実際の表情筋の動き・視線方向そのものを検出
  // しているわけではなく、画像全体の明暗・色彩・左右対称性・起伏という
  // 大づかみな特徴からの解釈である旨を、フォーム上の注意書きと結果の
  // どちらにも明記する(`app/autonomous-face-reader.js`参照)。
  // ---------------------------------------------------------------------

  function renderAutonomousForm() {
    var html = '';
    html += '<div class="notice">画像をアップロードするだけで、目・口・眉などのパーツ選択は行わずに自動で解釈します(実験的)。画面全体の明暗・色彩・左右対称性・コントラスト(起伏)という大づかみな特徴から、伝統的な相学・色彩心理の発想で言語化するもので、実際の表情筋の動きや視線方向そのものを検出しているわけではありません。実在の人物の心理状態を診断・断定するものではなく、あくまで娯楽的な解釈です。</div>';

    html += '<input type="file" accept="image/*" id="af-image-input">';
    html += '<div id="af-image-wrap" style="margin-top:10px;max-width:100%;">';
    html += '<img id="af-image" style="max-width:100%;display:block;" alt="">';
    html += '</div>';
    html += '<p id="af-status" style="font-size:0.8rem;color:#6b5842;">画像を選択すると、自動的に全体を解析します(選択操作は不要です)。</p>';
    html += '<div id="af-result"></div>';
    return html;
  }

  function renderAutonomousReport(container, report) {
    if (!container) return;
    var html = '';
    html += '<div class="result-block"><h4>画像全体の特徴(自動計算)</h4><dl>';
    html += '<dt>明るさ</dt><dd>' + escapeHTML(report.summary.brightness) + '</dd>';
    html += '<dt>色味</dt><dd>' + escapeHTML(report.summary.color) + '</dd>';
    html += '<dt>彩度</dt><dd>' + escapeHTML(report.summary.saturation) + '</dd>';
    html += '<dt>左右差(対称性)</dt><dd>' + escapeHTML(report.summary.asymmetry) + '</dd>';
    html += '<dt>起伏(コントラスト)</dt><dd>' + escapeHTML(report.summary.tension) + '</dd>';
    html += '</dl></div>';

    html += '<div class="result-block"><h4>詳細解釈</h4><dl>';
    html += '<dt>明るさの意味</dt><dd>' + escapeHTML(report.detail.brightness) + '</dd>';
    html += '<dt>色味の意味</dt><dd>' + escapeHTML(report.detail.color) + '</dd>';
    html += '<dt>彩度の意味</dt><dd>' + escapeHTML(report.detail.saturation) + '</dd>';
    html += '<dt>光の当たり方の意味</dt><dd>' + escapeHTML(report.detail.light) + '</dd>';
    html += '<dt>左右差の意味</dt><dd>' + escapeHTML(report.detail.asymmetry) + '</dd>';
    html += '<dt>起伏の意味</dt><dd>' + escapeHTML(report.detail.tension) + '</dd>';
    html += '</dl></div>';

    html += '<div class="result-block"><h4>総合診断メッセージ</h4><p>' + escapeHTML(report.message) + '</p></div>';
    container.innerHTML = html;
  }

  function initAutonomousAnalysis(panel) {
    var fileInput = panel.querySelector('#af-image-input');
    var img = panel.querySelector('#af-image');
    var statusEl = panel.querySelector('#af-status');
    var resultEl = panel.querySelector('#af-result');
    if (!fileInput || !img) return;

    fileInput.addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      resultEl.innerHTML = '';
      statusEl.textContent = '画像を読み込んでいます…';

      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        img.onload = function () {
          var readerMod = autoReader();
          if (!readerMod) {
            statusEl.textContent = '解析モジュールを読み込めませんでした。';
            return;
          }
          statusEl.textContent = '解析中…';

          // 処理負荷を抑えるため、長辺を最大200pxに縮小したオフスクリーン
          // canvasに描画してからピクセルデータを取得する。
          var naturalW = img.naturalWidth || 1;
          var naturalH = img.naturalHeight || 1;
          var maxDim = 200;
          var scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
          var w = Math.max(1, Math.round(naturalW * scale));
          var h = Math.max(1, Math.round(naturalH * scale));

          var offCanvas = document.createElement('canvas');
          offCanvas.width = w;
          offCanvas.height = h;
          var ctx = offCanvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          var imageData;
          try {
            imageData = ctx.getImageData(0, 0, w, h);
          } catch (err) {
            statusEl.textContent = '画像の解析に失敗しました(' + escapeHTML(String(err)) + ')。';
            return;
          }

          var report = readerMod.analyzeImageAutonomously(imageData);
          statusEl.textContent = '解析が完了しました(選択操作は行っていません)。';
          renderAutonomousReport(resultEl, report);
        };
        img.src = e.target.result;
      };
      fileReader.readAsDataURL(file);
    });
  }

  function renderAbstractJsonForm() {
    var sample = {
      detection_id: 'det-0001',
      user_selected: true,
      detected_feature: {
        location: 'right_cheek',
        abstract_components: {
          eyes: 'two_dots',
          hair_line: 'top_hair_line',
          nose: 'triangle_nose',
          mouth: 'horizontal_line',
        },
        facing_direction: 'outward',
        clarity_score: 0.72,
      },
      area_attribute: {
        palace_name: '夫妻宮',
        domain_category: 'romance',
      },
      geometry: {
        x: 120,
        y: 96,
        width: 24,
        height: 24,
      },
    };
    var html = '';
    html += '<div class="notice">画像解析AI+人間選別(Human-in-the-Loop)で確定された検出データ(JSON)を貼り付けると、(1)丸印の描画指示、(2)十二宮の考え方に沿った解釈、(3)娯楽的な総合診断、の順に出力します。外部の検出システムの出力や、このアプリの「画像マーキング」タブでの検出結果を、この形式に整えて渡すことを想定した機能です。`geometry`(x, y, width, height)が無い場合は、描画指示の代わりにその旨を明示します。</div>';
    html += '<label class="field-label">検出データ(JSON)</label>';
    html += '<textarea id="aj-input" style="min-height:220px;font-family:monospace;font-size:0.8rem;">' + escapeHTML(JSON.stringify(sample, null, 2)) + '</textarea>';
    html += '<button class="btn" id="aj-run-btn" style="margin-top:10px;">このJSONを解析する</button>';
    html += '<div id="aj-result"></div>';
    return html;
  }

  function runAbstractJsonDiagnosis() {
    var eng = engine();
    var textarea = document.getElementById('aj-input');
    var out = document.getElementById('aj-result');
    if (!eng || !textarea || !out) return;
    var parsed;
    try {
      parsed = JSON.parse(textarea.value);
    } catch (e) {
      out.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">JSONの形式が正しくありません: ' + escapeHTML(String(e.message || e)) + '</p>';
      return;
    }
    var report = eng.buildAbstractGansouReport(parsed);
    var draw = report.drawInstruction;
    var html = '';

    // 1. 画像描画指示(丸印)— 最優先タスクとして最初に表示
    html += '<div class="result-block"><h4>1. 画像描画指示(丸印)</h4>';
    if (draw && draw.available) {
      html += '<p>' + escapeHTML(draw.message) + '</p>';
      html += '<pre style="white-space:pre-wrap;font-size:0.8rem;background:#f4f0e8;padding:8px;border-radius:6px;">' + escapeHTML(draw.code) + '</pre>';
    } else {
      html += '<p style="color:#a1472f;">' + escapeHTML((draw && draw.message) || '座標が不足しているため描画できません。') + '</p>';
    }
    html += '</div>';

    // 2. JSON解釈(相学ロジック)
    html += '<div class="result-block"><h4>2. JSON解釈(相学ロジック)</h4><dl>';
    html += '<dt>検出ID</dt><dd>' + escapeHTML(report.detectionId || '(なし)') + '</dd>';
    html += '<dt>検出部位</dt><dd>' + escapeHTML(report.location) + '</dd>';
    html += '<dt>相学的位置(宮)</dt><dd>' + escapeHTML(report.palaceName) + (report.domainCategory ? '(領域: ' + escapeHTML(report.domainCategory) + ')' : '') + '</dd>';
    html += '<dt>向き</dt><dd>' + escapeHTML(report.direction) + '</dd>';
    html += '<dt>鮮明度スコア</dt><dd>' + report.clarityScore + '</dd>';
    html += '<dt>抽象パーツの構成</dt><dd>' + escapeHTML(report.featureDescription) + '</dd>';
    html += '<dt>宮の意味(詳細解釈)</dt><dd>' + escapeHTML(report.detail.palaceMeaning) + '</dd>';
    html += '<dt>向きの意味(詳細解釈)</dt><dd>' + escapeHTML(report.detail.orientationMeaning) + '</dd>';
    html += '<dt>鮮明度の意味(詳細解釈)</dt><dd>' + escapeHTML(report.detail.clarityNote) + '</dd>';
    html += '</dl></div>';

    // 3. 総合診断メッセージ
    html += '<div class="result-block"><h4>3. 総合診断メッセージ</h4><p>' + escapeHTML(report.message) + '</p></div>';
    out.innerHTML = html;
  }

  function renderHiddenPanel() {
    var html = '';
    html += '<div class="chip-row">';
    html += '<button class="chip' + (state.hidden.mode === 'manual' ? ' active' : '') + '" data-hidden-mode="manual">手動で診断</button>';
    html += '<button class="chip' + (state.hidden.mode === 'auto' ? ' active' : '') + '" data-hidden-mode="auto">全体解析(自律・選択操作なし)</button>';
    html += '<button class="chip' + (state.hidden.mode === 'mark' ? ' active' : '') + '" data-hidden-mode="mark">画像マーキング(実験的)</button>';
    html += '<button class="chip' + (state.hidden.mode === 'json' ? ' active' : '') + '" data-hidden-mode="json">抽象相JSON解析</button>';
    html += '<button class="chip' + (state.hidden.mode === 'detect' ? ' active' : '') + '" data-hidden-mode="detect">顔らしさ検出(意味づけなし)</button>';
    html += '</div>';
    if (state.hidden.mode === 'mark') html += renderGansouMarkForm();
    else if (state.hidden.mode === 'json') html += renderAbstractJsonForm();
    else if (state.hidden.mode === 'detect') html += renderFaceLikelihoodForm();
    else if (state.hidden.mode === 'auto') html += renderAutonomousForm();
    else html += renderHiddenManualForm();
    return html;
  }


  // ---------------------------------------------------------------------
  // 全体レンダリング
  // ---------------------------------------------------------------------

  var TABS = [
    { id: 'dict', label: '辞典' },
    { id: 'karte', label: 'カルテ' },
    { id: 'hidden', label: '隠れ相' },
  ];

  function render() {
    if (!root) return;

    var html = '';
    html += '<header class="app-header">';
    html += '<h1>人相占い・鑑定カルテ</h1>';
    html += '<nav class="tabs">';
    TABS.forEach(function (t) {
      html += '<button class="' + (state.tab === t.id ? 'active' : '') + '" data-tab="' + t.id + '">' + t.label + '</button>';
    });
    html += '</nav></header>';

    html += '<section class="panel" id="panel">';
    if (state.tab === 'dict') html += renderDictPanel();
    else if (state.tab === 'karte') html += renderKartePanel();
    else if (state.tab === 'hidden') html += renderHiddenPanel();
    html += '</section>';

    root.innerHTML = html;
    bindEvents();

    if (state.tab === 'dict' && state.dict.category === '顔') {
      loadZoneMap('assets/face-zones.svg', 'face-map-wrap', 'data-role');
    } else if (state.tab === 'dict' && state.dict.category === '手相') {
      loadZoneMap('assets/palm-zones.svg', 'palm-map-wrap', 'data-key');
    } else if (state.tab === 'hidden' && state.hidden.mode === 'mark') {
      var panelEl = document.getElementById('panel');
      if (panelEl) initGansouMarking(panelEl);
    } else if (state.tab === 'hidden' && state.hidden.mode === 'auto') {
      var autoPanelEl = document.getElementById('panel');
      if (autoPanelEl) initAutonomousAnalysis(autoPanelEl);
    }
  }

  function bindEvents() {
    // タブ切り替え
    root.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { setState({ tab: btn.getAttribute('data-tab') }); });
    });

    // 辞典: カテゴリ・ロール
    root.querySelectorAll('#cat-chips [data-cat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setState({ dict: { category: btn.getAttribute('data-cat'), role: null, highlightKey: null } });
      });
    });
    root.querySelectorAll('#role-chips [data-role]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newDict = {};
        Object.keys(state.dict).forEach(function (k) { newDict[k] = state.dict[k]; });
        newDict.role = btn.getAttribute('data-role') || null;
        setState({ dict: newDict });
      });
    });
    root.querySelectorAll('.add-to-karte').forEach(function (btn) {
      btn.addEventListener('click', function () {
        addEntryToCurrentKarte(btn.getAttribute('data-key'), btn.getAttribute('data-option'));
      });
    });

    // カルテ
    var newKarteBtn = document.getElementById('new-karte-btn');
    if (newKarteBtn) newKarteBtn.addEventListener('click', createKarte);

    root.querySelectorAll('.karte-list-item').forEach(function (row) {
      row.addEventListener('click', function (ev) {
        if (ev.target && ev.target.classList.contains('delete-karte-btn')) return;
        setState({ karte: { currentId: row.getAttribute('data-karte-id') } });
      });
    });
    root.querySelectorAll('.delete-karte-btn').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        deleteKarte(btn.getAttribute('data-karte-id'));
      });
    });
    root.querySelectorAll('.delete-entry-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteEntry(btn.getAttribute('data-entry-id')); });
    });
    var saveMemoBtn = document.getElementById('save-memo-btn');
    if (saveMemoBtn) saveMemoBtn.addEventListener('click', saveMemo);
    var goToDictLink = document.getElementById('go-to-dict-link');
    if (goToDictLink) goToDictLink.addEventListener('click', function (ev) { ev.preventDefault(); setState({ tab: 'dict' }); });

    // 隠れ相
    root.querySelectorAll('[data-hidden-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () { setState({ hidden: { mode: btn.getAttribute('data-hidden-mode') } }); });
    });
    var hfRunBtn = document.getElementById('hf-run-btn');
    if (hfRunBtn) hfRunBtn.addEventListener('click', runHiddenManualDiagnosis);
    var flRunBtn = document.getElementById('fl-run-btn');
    if (flRunBtn) flRunBtn.addEventListener('click', runFaceLikelihoodReport);
    var ajRunBtn = document.getElementById('aj-run-btn');
    if (ajRunBtn) ajRunBtn.addEventListener('click', runAbstractJsonDiagnosis);
  }

  // ---------------------------------------------------------------------
  // 起動
  // ---------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    root = document.getElementById('app');
    if (!root) return;
    render();
  });
})();
