// ═══════════════════════════════════════════════════════════════
//  JCV DISTRIBUIDORA v3.0 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-distribuidora-v3-cache-v16';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/inter.woff2',
  './fonts/plus-jakarta-sans.woff2',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-512.png',
  './img/apple-touch-icon.png'
];

// Install: cache static assets de forma tolerante a falhas parciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('Cache fetch skipped:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-First for HTML/Navigation, Cache-First for static images/fonts
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar módulos e rotas de desenvolvimento
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.protocol === 'chrome-extension:' ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // 1. Navegações HTML: NETWORK FIRST com fallback para cache se offline
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match('./index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. Assets Estáticos & Imagens/Fontes: Cache First
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    url.pathname.match(/\.(woff2|woff|ttf|webp|png|jpg|jpeg|gif|svg|ico)$/i)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached || new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // 3. Demais requisições (JS, CSS): Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
