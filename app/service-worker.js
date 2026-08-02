/**
 * app/service-worker.js
 * オフライン動作のためのシンプルなキャッシュ戦略(App Shell + データ全ファイル)。
 * カルテのデータそのもの(IndexedDB/localStorage)はここでは扱わない
 * (ブラウザの永続ストレージ側に保存される)。
 */

const CACHE_VERSION = 'ninso-cache-v1';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './hidden-face-engine.js',
  './hidden-face-detector.js',
  './app.js',
  './manifest.json',
  './assets/palm-zones.svg',
  './assets/face-zones.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

const DATA_FILES = [
  '../data/core.js',
  '../data/constitution.js',
  '../data/five_elements.js',
  '../data/face_shape.js',
  '../data/body.js',
  '../data/phrenology.js',
  '../data/palmistry.js',
  '../data/palmistry_nails.js',
  '../data/palmistry_mounts.js',
  '../data/palmistry_lines.js',
  '../data/forehead_extra.js',
  '../data/hair.js',
  '../data/eyebrows.js',
  '../data/nose.js',
  '../data/nasolabial.js',
  '../data/philtrum.js',
  '../data/mouth.js',
  '../data/teeth.js',
  '../data/ear.js',
  '../data/cheekbone.js',
  '../data/eyes.js',
  '../data/gait.js',
  '../data/eating.js',
  '../data/voice.js',
  '../data/index.js',
];

const CACHE_URLS = APP_SHELL.concat(DATA_FILES);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // 個々のファイルが失敗してもインストール全体を落とさないよう、
      // addAll ではなく1件ずつ試行する。
      return Promise.all(
        CACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[service-worker] cache failed:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      // キャッシュがあれば即返しつつ、裏で更新(stale-while-revalidate)
      return cached || fetchPromise;
    })
  );
});
