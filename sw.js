// ═══════════════════════════════════════════════════════════════
//  JCV JARDINAGEM v3.0 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-jardinagem-v3-cache-v15';
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
  console.log('[SW] Instalando nova versão do Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('Cache fetch skipped:', url, err))
        )
      );
    })
  );
  // IMPORTANTE: Ativa imediatamente sem esperar
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  console.log('[SW] Ativando nova versão e limpando caches antigos...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deletando cache antigo:', k);
          return caches.delete(k);
        })
      );
    }).then(() => {
      console.log('[SW] Nova versão ativada! Cache atual:', CACHE_NAME);
      // Força todos os clientes a usarem a nova versão IMEDIATAMENTE
      return self.clients.claim();
    })
  );
});

// Fetch: Network-First for HTML/Navigation, Cache-First for static images/fonts
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar módulos, rotas de desenvolvimento e localhost
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('node_modules') ||
    url.pathname.includes('vite') ||
    url.protocol === 'chrome-extension:' ||
    event.request.method !== 'GET'
  ) {
    return; // Deixa o browser buscar normalmente
  }

  // CRÍTICO: Nunca cachear dados de produtos - sempre buscar versão atualizada
  if (
    url.pathname.includes('products.ts') ||
    url.pathname.includes('products.js') ||
    url.pathname.includes('/data/') ||
    url.pathname.includes('config.ts') ||
    url.pathname.includes('config.js')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          console.log('[SW] Buscando dados atualizados:', url.pathname);
          return response;
        })
        .catch(() => {
          console.warn('[SW] Erro ao buscar dados atualizados');
          return caches.match(event.request);
        })
    );
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
