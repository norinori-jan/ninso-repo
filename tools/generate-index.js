#!/usr/bin/env node
/**
 * tools/generate-index.js
 *
 * data/ 配下の各データファイルを読み込み、全項目(key/name/category/role)
 * の一覧をMarkdownとして docs/DATA_INDEX.md に自動生成するスクリプト。
 * `npm run index` で実行する想定。
 *
 * ★注意★
 * アップロードされた実ファイルが空だったため、ゼロから再構成しました。
 * 実際に運用していたスクリプトと出力先パスや体裁が違う場合があるので、
 * 必要に応じて調整してください。
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'DATA_INDEX.md');

// data/ 配下のデータファイル一覧。新しいファイルを追加したらここにも追記する。
const DATA_FILES = [
  'core.js',
  'constitution.js',
  'five_elements.js',
  'face_shape.js',
  'body.js',
  'phrenology.js',
  'palmistry.js',
  'palmistry_nails.js',
  'palmistry_mounts.js',
  'palmistry_lines.js',
  'forehead_extra.js',
  'hair.js',
  'eyebrows.js',
  'nose.js',
  'nasolabial.js',
  'philtrum.js',
  'mouth.js',
  'teeth.js',
  'ear.js',
  'cheekbone.js',
  'eyes.js',
];

function loadParts(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const mod = require(filePath);
    return Array.isArray(mod) ? mod : [];
  } catch (e) {
    console.warn(`[generate-index] ${filename} の読み込みに失敗しました: ${e.message}`);
    return [];
  }
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function buildMarkdown() {
  const lines = [];
  let total = 0;
  const seenKeys = new Set();
  const duplicateKeys = [];

  lines.push('# データ一覧(自動生成)');
  lines.push('');
  lines.push('`npm run index` で自動生成されます。手動で編集しないでください。');
  lines.push('');

  DATA_FILES.forEach((filename) => {
    const parts = loadParts(filename);
    if (parts.length === 0) {
      lines.push(`## ${filename} (0項目 / 読み込み失敗または空)`);
      lines.push('');
      return;
    }

    lines.push(`## ${filename} (${parts.length}項目)`);
    lines.push('');
    lines.push('| key | name | category | role | options数 |');
    lines.push('|---|---|---|---|---|');

    parts.forEach((part) => {
      const key = part.key || '(no key)';
      const name = part.name || '(no name)';
      const category = part.category || '-';
      const role = part.role || '-';
      const optionCount = Array.isArray(part.options) ? part.options.length : 0;

      if (part.key) {
        if (seenKeys.has(part.key)) {
          duplicateKeys.push(part.key);
        }
        seenKeys.add(part.key);
      }

      lines.push(
        `| \`${escapeCell(key)}\` | ${escapeCell(name)} | ${escapeCell(category)} | ${escapeCell(role)} | ${optionCount} |`
      );
    });

    lines.push('');
    total += parts.length;
  });

  if (duplicateKeys.length > 0) {
    lines.push('## ⚠️ 重複key検出');
    lines.push('');
    duplicateKeys.forEach((k) => lines.push(`- \`${k}\``));
    lines.push('');
  }

  lines.unshift(`<!-- 合計 ${total} 項目 / 生成日時: ${new Date().toISOString()} -->`, '');

  return lines.join('\n');
}

function main() {
  const markdown = buildMarkdown();
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
  console.log(`生成しました: ${OUTPUT_FILE}`);
}

main();
