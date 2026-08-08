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
    html += '<div class="notice">位置・向き・種類・スコア・検出数を選ぶと、伝統的な相学の考え方に沿った解釈文を組み立てます。実際の画像解析は行わず、入力内容にルールを当てはめるだけの娯楽的な機能です。</div>';

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

  // --- mark モード: 画像アップロード + タップでのマーキング(実験的) ---

  function renderGansouMarkForm() {
    var eng = engine();
    var html = '';
    html += '<div class="notice">画像をアップロードすると「自動検出する」ボタンで、暗い斑点(ほくろ等)のペア+その下の暗い線(しわ・口)の組み合わせを画像処理だけで(学習データ不要のアルゴリズムで)、複数の解像度を横断して探します。実物大の目・口ではなく、髪の生え際やこめかみ・輪郭付近に小さくまとまった2〜3点のパターン(間隔は画像幅のおおむね1〜12%程度)を狙って狭い範囲で探すよう調整しています。探索範囲も肌色領域だけでなく、髪の毛や顔の輪郭周辺まで広めに含めています。候補から選ぶか、自分で3点タップして手動マーキングすることもできます。肌色マスキング(下のチェックボックス)は実在の顔写真向けの機能で、木目・岩肌・壁のシミ等、顔以外のパレイドリア現象を探す場合はオフにすると検出範囲がさらに広がります。本物の顔の目・口に一致すると判定された候補は「本物の顔らしい候補」として分けて表示し、隠れ相候補には含めません(本物の目・口を指すだけの当たり前の指摘を避けるため)。人間の顔以外(物のシルエット等)を見つけた場合は「抽象相JSON解析」タブで自由に記述できます。まだ実験的な機能で、精度には限界があります(docs/GANSOU_ROADMAP.md 参照)。ここで保存した記録は、将来のAIモデル学習用データの土台になります。</div>';

    html += '<input type="file" accept="image/*" id="gs-image-input">';
    html += '<div id="gs-image-wrap" style="position:relative;margin-top:10px;max-width:100%;">';
    html += '<img id="gs-image" style="max-width:100%;display:block;" alt="">';
    html += '<canvas id="gs-canvas" style="position:absolute;top:0;left:0;cursor:crosshair;"></canvas>';
    html += '</div>';
    html += '<p id="gs-status" style="font-size:0.8rem;color:#6b5842;">まず画像を選択してください。</p>';
    html += '<label style="display:block;font-size:0.8rem;margin:6px 0;"><input type="checkbox" id="gs-skinmask-toggle" checked> 肌色マスキングを使う(顔写真向け。木目・岩肌・壁のシミ等、顔以外のパレイドリア探索ではオフにすると検出範囲が広がります)</label>';
    html += '<button class="btn" id="gs-autodetect-btn" type="button">自動検出する(実験的・点+線のパターン探索、複数解像度で探索)</button> ';
    html += '<button class="btn secondary" id="gs-reset-btn" type="button">マーキングをリセット</button>';
    html += '<div id="gs-auto-candidates"></div>';

    html += '<label class="field-label">検出位置</label>';
    html += '<select id="gs-position">';
    (eng ? eng.POSITION_LIST : []).forEach(function (p) {
      html += '<option value="' + escapeHTML(p) + '">' + escapeHTML(p) + '</option>';
    });
    html += '</select>';

    html += '<label class="field-label">種類</label>';
    html += '<select id="gs-type">';
    Object.keys(eng ? eng.TYPE_MEANINGS : {}).forEach(function (t) {
      html += '<option value="' + escapeHTML(t) + '">' + escapeHTML(t) + '</option>';
    });
    html += '</select>';

    html += '<button class="btn" id="gs-analyze-btn" type="button" style="margin-top:10px;">解析する</button>';
    html += '<div id="gs-result"></div>';

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

  function initGansouMarking(panel) {
    var fileInput = panel.querySelector('#gs-image-input');
    var wrap = panel.querySelector('#gs-image-wrap');
    var img = panel.querySelector('#gs-image');
    var canvas = panel.querySelector('#gs-canvas');
    var statusEl = panel.querySelector('#gs-status');
    var resultEl = panel.querySelector('#gs-result');
    var positionSelect = panel.querySelector('#gs-position');
    var typeSelect = panel.querySelector('#gs-type');
    var includeImageCheckbox = panel.querySelector('#gs-include-image');
    var sampleCountEl = panel.querySelector('#gs-sample-count');
    if (!fileInput || !canvas) return;

    var POINT_LABELS_JA = ['目(左)', '目(右)', '口'];
    gansouMark = { points: [], imgLoaded: false, imgDataURL: null, lastReport: null, lastPoints: null, lastFaceCenter: null };

    function updateStatus() {
      var idx = gansouMark.points.length;
      statusEl.textContent = idx >= 3
        ? '3点マーキング完了。「解析する」を押してください(やり直す場合はリセット)。'
        : (gansouMark.imgLoaded ? '次にタップ: ' + POINT_LABELS_JA[idx] : 'まず画像を選択してください。');
    }

    function redraw() {
      if (!canvas.getContext) return;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        ctx.beginPath();
        ctx.moveTo(gansouMark.points[0].x, gansouMark.points[0].y);
        ctx.lineTo(gansouMark.points[1].x, gansouMark.points[1].y);
        ctx.stroke();
      }
    }

    function updateSampleCount() {
      if (sampleCountEl) sampleCountEl.textContent = String(loadGansouSamples().length);
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
          gansouMark.imgDataURL = e.target.result;
          gansouMark.imgLoaded = true;
          resultEl.innerHTML = '';
          updateStatus();
          redraw();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    canvas.addEventListener('click', function (ev) {
      if (!gansouMark.imgLoaded || gansouMark.points.length >= 3) return;
      var rect = canvas.getBoundingClientRect();
      gansouMark.points.push({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
      redraw();
      updateStatus();
    });

    var autoDetectBtn = panel.querySelector('#gs-autodetect-btn');
    var autoCandidatesEl = panel.querySelector('#gs-auto-candidates');
    var skinMaskToggle = panel.querySelector('#gs-skinmask-toggle');
    if (autoDetectBtn) autoDetectBtn.addEventListener('click', function () {
      if (!gansouMark.imgLoaded) {
        autoCandidatesEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">先に画像を選択してください。</p>';
        return;
      }
      var det = (typeof window !== 'undefined' && window.HiddenFaceDetector) || null;
      var eng = engine();
      if (!det) {
        autoCandidatesEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">検出モジュールを読み込めませんでした。</p>';
        return;
      }
      autoCandidatesEl.innerHTML = '<p style="font-size:0.8rem;color:#6b5842;">解析中(複数解像度で探索しています)…</p>';

      // 解析用に縮小したオフスクリーンcanvasへ描画してImageDataを取得
      // (マルチスケール探索の中で更に複数解像度へ縮小するため、ここでは
      // 少し大きめの長辺360pxを上限にしておく)
      var naturalW = img.naturalWidth || canvas.width;
      var naturalH = img.naturalHeight || canvas.height;
      var maxDim = 360;
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
        autoCandidatesEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">画像の解析に失敗しました(' + escapeHTML(String(e)) + ')。</p>';
        return;
      }

      var useSkinMask = !skinMaskToggle || skinMaskToggle.checked;
      var candidates = det.findFaceCandidatesMultiScale(imageData, {
        maxCandidates: 8,
        scales: [160, 240, 360],
        skinMask: useSkinMask,
        // 「まだ広い範囲で目と口を探している」というユーザー指摘への対応。
        // 既定(0.03〜0.6)は実物大の顔の目の間隔を想定した広い範囲だった。
        // ここでは、髪の生え際等に小さくまとまった2〜3点のパターンを
        // 狙って、間隔の許容範囲を大きく狭める(画像幅の1%〜12%程度)。
        minEyeDistRatio: 0.01,
        maxEyeDistRatio: 0.12,
        // 肌色領域の外接矩形に対する余白を広げ、髪の毛や顔の輪郭(髪の
        // 生え際・こめかみ・輪郭線の周辺)まで探索範囲に含める
        // (既定15%→40%)。
        skin: { marginRatio: 0.4 },
        scoreFn: eng ? eng.computeFaceLikenessScore : undefined,
      });

      if (!candidates.length) {
        autoCandidatesEl.innerHTML = '<p style="font-size:0.85rem;color:#6b5842;">点+線の組み合わせパターンは見つかりませんでした。手動でマーキングするか、肌色マスキングのオン/オフを切り替えて再度お試しください。</p>';
        return;
      }

      // 「本物の目・口を指して"ここに目があります"と言うだけの、
      // 当たり前の指摘になってしまう」というユーザー指摘への対応。
      // 候補群から「おそらく本物の顔」を1件推定して分離し、隠れ相
      // 候補としては提示しない(ただし完全な判定ではないため、
      // 折りたたみで参照・採用は可能にする)。
      var split = det.splitObviousRealFace ? det.splitObviousRealFace(candidates, imageData) : { obvious: null, hidden: candidates };
      var hiddenCandidates = split.hidden;
      var obviousCandidate = split.obvious;

      // 解析用の縮小座標 → 表示canvas座標へのスケール
      var scaleX = canvas.width / analysisW;
      var scaleY = canvas.height / analysisH;

      function candidateRowHtml(c, i, keyPrefix) {
        return '<div class="option-row"><span class="option-label">候補' + (i + 1) + '(スコア ' + c.score + (c.scale ? '・解像度' + c.scale + 'px' : '') + ')</span> ' +
          '<button class="btn secondary gs-adopt-btn" type="button" data-candidate-key="' + keyPrefix + i + '">採用する</button></div>';
      }

      var html;
      if (!hiddenCandidates.length) {
        html = '<p style="font-size:0.85rem;color:#6b5842;">検出された点+線パターンは、本物の顔の目・口である可能性が高いと判定されたもの以外に見つかりませんでした(単なる「本物の目・口を指すだけ」の指摘を避けるため、隠れ相候補からは除外しています)。下の「本物の顔らしい候補」からも採用はできますが、隠れ相の練習としては、木目・岩肌・髪の生え際・輪郭の一部など、目・口以外の領域も手動でタップしてみることをおすすめします。</p>';
      } else {
        html = '<p style="font-size:0.85rem;color:#6b5842;">隠れ相候補が' + hiddenCandidates.length + '件見つかりました(スコア順、複数解像度を統合。本物の顔の目・口とみられる候補は下記「本物の顔らしい候補」側に分けています)。採用すると3点マーキングが自動入力されます。</p>';
        hiddenCandidates.forEach(function (c, i) { html += candidateRowHtml(c, i, 'h'); });
      }

      if (obviousCandidate) {
        html += '<details style="margin-top:8px;"><summary style="font-size:0.8rem;color:#8a7860;cursor:pointer;">本物の顔らしい候補(参考・通常は隠れ相ではないため折りたたみ)</summary>';
        html += candidateRowHtml(obviousCandidate, 0, 'o');
        html += '</details>';
      }
      autoCandidatesEl.innerHTML = html;

      var candidateByKey = {};
      hiddenCandidates.forEach(function (c, i) { candidateByKey['h' + i] = c; });
      if (obviousCandidate) candidateByKey['o0'] = obviousCandidate;

      autoCandidatesEl.querySelectorAll('.gs-adopt-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.getAttribute('data-candidate-key');
          var c = candidateByKey[key];
          if (!c) return;
          gansouMark.points = [
            { x: c.points.eyeLeft.x * scaleX, y: c.points.eyeLeft.y * scaleY },
            { x: c.points.eyeRight.x * scaleX, y: c.points.eyeRight.y * scaleY },
            { x: c.points.mouth.x * scaleX, y: c.points.mouth.y * scaleY },
          ];
          redraw();
          updateStatus();
        });
      });
    });

    var resetBtn = panel.querySelector('#gs-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      gansouMark.points = [];
      gansouMark.lastReport = null;
      redraw();
      updateStatus();
      resultEl.innerHTML = '';
    });

    var analyzeBtn = panel.querySelector('#gs-analyze-btn');
    if (analyzeBtn) analyzeBtn.addEventListener('click', function () {
      var eng = engine();
      if (!eng) return;
      if (gansouMark.points.length < 3) {
        resultEl.innerHTML = '<p style="color:#a1472f;font-size:0.85rem;">先に3点(目2つ・口)をタップしてください。</p>';
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
      renderGansouReport(resultEl, report);
    });

    var saveBtn = panel.querySelector('#gs-save-sample-btn');
    if (saveBtn) saveBtn.addEventListener('click', function () {
      if (!gansouMark.lastReport) {
        window.alert('先に「解析する」を実行してください。');
        return;
      }
      var ok = saveGansouSample({
        points: gansouMark.lastPoints,
        faceCenter: gansouMark.lastFaceCenter,
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
