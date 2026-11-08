// Service worker : le jeu fonctionne hors ligne une fois ouvert une première fois.
const CACHE = 'lu2312-v1';
const FILES = ['./', 'index.html', 'style.css', 'manifest.webmanifest',
  'js/audio.js', 'js/engine.js', 'js/main.js',
  'story/ch01-03.js', 'story/ch04-06.js', 'story/ch07-08.js', 'story/ch09-10.js', 'story/endings.js',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
