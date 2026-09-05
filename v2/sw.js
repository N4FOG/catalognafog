// ═══════════════════════════════════════════════════════════════
//  JCV QUÍMICA v3.0 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-quimica-cache-v11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/inter.woff2',
  './fonts/plus-jakarta-sans.woff2',
  './css/base.css',
  './css/layout.css',
  './css/catalog.css',
  './css/sheet-modal.css',
  './css/cart.css',
  './css/seller.css',
  './js/data/config.js',
  './js/data/categories.js',
  './js/data/products.js',
  './js/modules/utils.js',
  './js/modules/theme.js',
  './js/modules/catalog.js',
  './js/modules/cart.js',
  './js/modules/seller.js',
  './js/modules/pdf-proposal.js',
  './js/modules/whatsapp.js',
  './js/modules/telemetry.js',
  './js/modules/pwa.js',
  './js/app.js',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-512.png',
  './img/apple-touch-icon.png',
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

// Fetch: cache-first para imagens/fontes, navegação tolerante a parâmetros, stale-while-revalidate para app shell
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Assets Estáticos & Imagens/Fontes: Cache First
  if (event.request.destination === 'image' || event.request.destination === 'font' || url.pathname.match(/\.(woff2|woff|ttf|webp|png|jpg|jpeg|gif|svg|ico)$/i)) {
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

  // 2. Navegação (HTML): Suporte a Links Parametrizados (?v=carlos, ?cart=...) em Modo Offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(cached => {
        const fetchPromise = fetch(event.request)
          .then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached || caches.match('./index.html') || caches.match('./'));

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. App Shell, CSS, JS: Stale While Revalidate
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
