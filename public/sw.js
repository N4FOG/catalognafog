// ═══════════════════════════════════════════════════════════════
//  JCV DISTRIBUIDORA v3.0 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-distribuidora-v3-cache-v17';

const STATIC_ASSETS = [
  './manifest.json',
  './fonts/inter.woff2',
  './fonts/plus-jakarta-sans.woff2',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-512.png',
  './img/apple-touch-icon.png'
];

// ── Helpers de log ────────────────────────────────────────────
const tag  = (color, label) => `%c[SW:${label}]`;
const from = (src) => src === 'cache' ? '📦 CACHE' : '🌐 REDE';

function logFetch(pathname, source, cacheKey) {
  const style = source === 'cache'
    ? 'color:#10b981;font-weight:bold'
    : 'color:#f59e0b;font-weight:bold';
  console.log(
    `%c[SW:FETCH] ${from(source)} → ${pathname}` + (cacheKey ? ` (cache: ${cacheKey})` : ''),
    style
  );
}

// ── Install ───────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`%c[SW:INSTALL] 🔧 Instalando SW — cache: ${CACHE_NAME}`, 'color:#6366f1;font-weight:bold');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW:INSTALL] ⚠️ Skip:', url, err))
        )
      ).then(() => console.log('[SW:INSTALL] ✅ Assets estáticos cacheados'))
    )
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log(`%c[SW:ACTIVATE] 🚀 Ativando SW — cache: ${CACHE_NAME}`, 'color:#8b5cf6;font-weight:bold');
  event.waitUntil(
    caches.keys().then(keys => {
      console.log('[SW:ACTIVATE] 🗂️ Todos os caches encontrados:', keys);
      const toDelete = keys.filter(k => k !== CACHE_NAME);
      if (toDelete.length === 0) {
        console.log('[SW:ACTIVATE] ✅ Nenhum cache antigo para deletar');
      } else {
        toDelete.forEach(k => console.log(`%c[SW:ACTIVATE] 🗑️ Deletando cache antigo: ${k}`, 'color:#ef4444;font-weight:bold'));
      }
      return Promise.all(toDelete.map(k => caches.delete(k)));
    })
    .then(() => self.clients.claim())
    .then(() => {
      console.log('%c[SW:ACTIVATE] ✅ clients.claim() executado — este SW agora controla todas as abas', 'color:#8b5cf6;font-weight:bold');
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        console.log(`[SW:ACTIVATE] 📢 Enviando SW_UPDATED para ${clients.length} aba(s) abertas`);
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

  // ── 1. HTML / Navegação: Network First ───────────────────────
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            logFetch(url.pathname, 'network');
            console.log(`[SW:HTML] 💾 Salvando no cache: ${url.pathname}`);
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          console.warn(`[SW:HTML] ⚠️ Rede falhou para ${url.pathname} — tentando cache offline`);
          const cached = await caches.match(event.request);
          logFetch(url.pathname, 'cache', CACHE_NAME);
          return cached || await caches.match('/index.html') || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // ── 2. Bundles Vite /assets/*: Cache First ───────────────────
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) {
            logFetch(url.pathname, 'cache', CACHE_NAME);
            return cached;
          }
          console.log(`%c[SW:ASSET] 🌐 Novo bundle (hash não está no cache): ${url.pathname}`, 'color:#f59e0b;font-weight:bold');
          return fetch(event.request).then(response => {
            if (response.ok) {
              console.log(`[SW:ASSET] 💾 Bundle salvo no cache: ${url.pathname}`);
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(err => {
            console.error(`[SW:ASSET] ❌ Falha ao buscar bundle: ${url.pathname}`, err);
            throw err;
          });
        })
      )
    );
    return;
  }

  // ── 3. Imagens e Fontes: Cache First ─────────────────────────
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    url.pathname.match(/\.(woff2|woff|ttf|webp|png|jpg|jpeg|gif|svg|ico)$/i)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) {
            // imagens/fontes são muito frequentes — só loga se quiser debug extremo
            // logFetch(url.pathname, 'cache', CACHE_NAME);
            return cached;
          }
          console.log(`[SW:IMG] 🌐 Buscando na rede (não estava no cache): ${url.pathname}`);
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // ── 4. Todo o resto: Network First ───────────────────────────
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
