/**
 * tools/serve.js
 * 依存パッケージなし(Node標準モジュールのみ)のローカル静的ファイルサーバー。
 *
 * なぜ必要か:
 *   index.htmlをブラウザで直接ダブルクリックして開く(file://で開く)と、
 *   以下の理由でうまく動かないことがある:
 *     - fetch()によるSVGファイル読み込み(顔・手相の相位置マップ)が
 *       ブラウザのセキュリティ制限でブロックされる
 *     - Service Worker(オフライン対応)はhttp(s)またはlocalhost経由でしか
 *       登録できず、file://では登録に失敗する
 *     - ブラウザによってはlocalStorageの利用も制限される場合がある
 *   これらはすべて「http://localhost 経由で開く」ことで解決する。
 *
 * 使い方:
 *   このリポジトリのルート(package.jsonがある場所)で:
 *     node tools/serve.js
 *   もしくは:
 *     npm run serve
 *   と実行すると、http://localhost:8080/app/index.html でアプリが開ける
 *   (ターミナルにも表示されるURLをクリック、またはコピーしてブラウザで
 *   開いてください)。ポート番号は環境変数PORTで変更可能(例:
 *   `PORT=3000 node tools/serve.js`)。
 */

'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

var MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function safeJoin(root, requestPath) {
  // パストラバーサル("../"での上位ディレクトリ脱出)を防ぐ
  var decoded = decodeURIComponent(requestPath.split('?')[0]);
  var normalized = path.normalize(path.join(root, decoded));
  if (normalized !== root && !normalized.startsWith(root + path.sep)) {
    return null; // ルート外へのアクセスは拒否
  }
  return normalized;
}

var server = http.createServer(function (req, res) {
  var reqPath = req.url === '/' ? '/app/index.html' : req.url;
  var filePath = safeJoin(ROOT, reqPath);

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, function (err, stats) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + reqPath);
      return;
    }
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, function (readErr, data) {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found: ' + reqPath);
        return;
      }
      var ext = path.extname(filePath).toLowerCase();
      var contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, function () {
  console.log('ninso-repo をローカルで配信しています:');
  console.log('  http://localhost:' + PORT + '/app/index.html');
  console.log('(終了するには Ctrl+C を押してください)');
});
