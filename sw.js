// =============================================================
//  RAWELL QUÍMICA — Service Worker PWA (Cache Offline Completo)
// =============================================================

const CACHE_NAME = 'rawell-catalogo-2026-v1';

// Lista de ativos estáticos essenciais para funcionamento 100% offline
const STATIC_ASSETS = [
  './',
  './index.html',
  './produto.html',
  './manifest.json',
  './css/style.css',
  './css/template30-app-mobile-first.css',
  './js/produtos.js',
  './js/carrinho.js',
  './js/home.js',
  './js/produto.js',
  './js/pwa.js',
  './img/icon.svg',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable.png',

  // Fotos oficiais de todos os 32 produtos (WebP)
  './img/produtos/p01-kapina-plus-60ml.webp',
  './img/produtos/p02-kapina-tradicional-60ml.webp',
  './img/produtos/p03-korsario-60ml.webp',
  './img/produtos/p04-katana-30ml.webp',
  './img/produtos/p05-kcura-fungicida-100ml.webp',
  './img/produtos/p06-rocada-100ml.webp',
  './img/produtos/p07-arranka-ew-100ml.webp',
  './img/produtos/p08-arranka-pronto-uso-1l.webp',
  './img/produtos/p09-bravick-fungicida-10ml.webp',
  './img/produtos/p10-bravick-pronto-uso-240ml.webp',
  './img/produtos/p11-ka-bio-fitoterapico-60ml.webp',
  './img/produtos/p12-ka-bio-pronto-uso-240ml.webp',
  './img/produtos/p13-impakto-inseticida.webp',
  './img/produtos/p14-fimo-combina-spray.webp',
  './img/produtos/p15-pankada-multi-insetos.webp',
  './img/produtos/p16-unix-repik-30ml.webp',
  './img/produtos/p17-arranka-spm-saude.webp',
  './img/produtos/p18-arranka-pm-lambda.webp',
  './img/produtos/p19-namosca-gb-20g.webp',
  './img/produtos/p20-blekalt-25.webp',
  './img/produtos/p21-koral-moscas-60ml.webp',
  './img/produtos/p22-mata-formiga-gel-10g.webp',
  './img/produtos/p23-mata-barata-gel-10g.webp',
  './img/produtos/p24-mata-formiga-isca-50g.webp',
  './img/produtos/p25-k-rato-soft-bait.webp',
  './img/produtos/p26-k-rato-po-contato.webp',
  './img/produtos/p27-karamujo-garden-30g.webp',
  './img/produtos/p28-karamujo-metaldeido-pellets.webp',
  './img/produtos/p29-koral-carrapatos-pulgas-60ml.webp',
  './img/produtos/p30-koral-pronto-uso-240ml.webp',
  './img/produtos/p31-redutor-de-ph-100ml.webp',
  './img/produtos/p32-oleo-mineral-parafinado-100ml.webp'
];

// ── 1. Instalação: Pré-cacheia todos os arquivos essenciais ──
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Armazenando catálogo completo no cache offline...');
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => {
      console.warn('[Service Worker] Aviso durante o pré-cache:', err);
    })
  );
});

// ── 2. Ativação: Limpa caches antigos e assume controle ─────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── 3. Interceptação de Requisições (Estratégia Stale-While-Revalidate / Cache-First) ──
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar requisições não-GET ou esquemas que não sejam http/https (ex: chrome-extension)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Tratamento especial para URLs com parâmetros (ex: produto.html?id=12)
  const url = new URL(request.url);

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Se encontrou no cache, retorna imediatamente e atualiza em background se online
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {
          // Offline, ignora erro de rede em background
        });

        return cachedResponse;
      }

      // Se a requisição for para produto.html com query params (ex: produto.html?id=5)
      if (url.pathname.endsWith('produto.html')) {
        return caches.match('./produto.html').then((resp) => {
          if (resp) return resp;
          return fetch(request);
        });
      }

      // Se não estava no cache, busca na rede e armazena cópia no cache
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback offline se for navegação
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
