// ═══════════════════════════════════════════════════════════════
//  JCV DISTRIBUIDORA v3.0 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-distribuidora-v3-cache-v17';

// Assets estáticos que queremos pré-cachear no install
const STATIC_ASSETS = [
  './manifest.json',
  './fonts/inter.woff2',
  './fonts/plus-jakarta-sans.woff2',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-512.png',
  './img/apple-touch-icon.png'
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Cache skip:', url, err))
        )
      )
    )
  );
  // Ativa imediatamente — não espera abas fecharem
  self.skipWaiting();
});

// ── Activate: limpa TODOS os caches antigos ──────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deletando cache antigo:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Avisa todas as abas abertas que o SW foi atualizado
        // A aba decide se recarrega (App.tsx escuta essa mensagem)
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora: dev HMR, extensões, não-GET
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.protocol === 'chrome-extension:' ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // ── 1. HTML / Navegação: Network First ──────────────────────
  // Sempre tenta rede; só usa cache se estiver offline
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || await caches.match('/index.html') || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // ── 2. Bundles Vite (assets/*.js, assets/*.css): Network First ──
  // Hashes no filename garantem unicidade — não há risco de stale.
  // Cache First seria mais rápido, mas com Stale-While-Revalidate o browser
  // servia o bundle antigo enquanto o novo chegava, causando o "pisca e volta".
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) {
            // Já está no cache com o hash correto — serve instantaneamente
            return cached;
          }
          // Não está no cache (novo hash após deploy) — busca na rede e armazena
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // ── 3. Imagens e Fontes: Cache First ─────────────────────────
  // Esses arquivos raramente mudam; servir do cache é o comportamento ideal.
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
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // ── 4. Todo o resto: Network First com fallback offline ──────
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
