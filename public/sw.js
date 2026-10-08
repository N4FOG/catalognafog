// ═══════════════════════════════════════════════════════════════
//  JCV DISTRIBUIDORA v6.0.2 — Service Worker (Cache Offline & PWA)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'jcv-distribuidora-v6.0.2-cache';

const STATIC_ASSETS = [
  './manifest.json',
  './fonts/inter.woff2',
  './fonts/plus-jakarta-sans.woff2',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-512.png',
  './img/apple-touch-icon.png'
];

// ── Helpers de log ─────────────────────────────────────────────
function logFetch(pathname, source, cacheKey) {
  const style = source === 'cache'
    ? 'color:#10b981;font-weight:bold'
    : 'color:#f59e0b;font-weight:bold';
  const icon = source === 'cache' ? '📦 CACHE' : '🌐 REDE';
  console.log(
    `%c[SW:FETCH] ${icon} → ${pathname}` + (cacheKey ? ` (cache: ${cacheKey})` : ''),
    style
  );
}

// ── Salva no cache de forma segura — clona ANTES de usar ───────
// Regra de ouro do SW: clone() deve ser chamado ANTES de qualquer
// leitura do body. Aqui clonamos imediatamente ao receber a response.
function putInCache(request, response) {
  if (!response || !response.ok) return;
  const clone = response.clone(); // clone antes de qualquer uso
  caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
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
        toDelete.forEach(k =>
          console.log(`%c[SW:ACTIVATE] 🗑️ Deletando cache antigo: ${k}`, 'color:#ef4444;font-weight:bold')
        );
      }
      return Promise.all(toDelete.map(k => caches.delete(k)));
    })
    .then(() => self.clients.claim())
    .then(() => {
      console.log('%c[SW:ACTIVATE] ✅ clients.claim() executado — SW controla todas as abas', 'color:#8b5cf6;font-weight:bold');
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

  // Ignora: dev HMR, extensões, não-GET, outras origens
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.protocol === 'chrome-extension:' ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // ── 1. HTML / Navegação: SEMPRE da REDE (nunca cacheia) ───────
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          logFetch(url.pathname, 'network');
          // NÃO cacheia HTML para evitar mismatch de hash dos bundles
          return response;
        })
        .catch(async () => {
          console.warn(`[SW:HTML] ⚠️ Offline — servindo fallback`);
          // Em offline, tenta servir do cache como fallback
          const cached = await caches.match(event.request)
                      || await caches.match('/index.html');
          if (cached) logFetch(url.pathname, 'cache', CACHE_NAME);
          return cached || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // ── 2. Bundles Vite /assets/*: Cache First ───────────────────
  // Hash no filename = imutável. Se está no cache, serve direto.
  // Se não está (novo deploy, hash novo), vai à rede.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) {
          logFetch(url.pathname, 'cache', CACHE_NAME);
          return cached;
        }
        console.log(`%c[SW:ASSET] 🌐 Hash novo — buscando na rede: ${url.pathname}`, 'color:#f59e0b;font-weight:bold');
        const response = await fetch(event.request);
        if (response.ok) {
          console.log(`[SW:ASSET] 💾 Bundle salvo no cache: ${url.pathname}`);
          cache.put(event.request, response.clone()); // clone antes de retornar
        }
        return response;
      }).catch(err => {
        console.error(`[SW:ASSET] ❌ Falha ao carregar bundle: ${url.pathname}`, err);
        throw err;
      })
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
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        console.log(`[SW:IMG] 🌐 Buscando na rede: ${url.pathname}`);
        const response = await fetch(event.request).catch(() => null);
        if (response?.ok) cache.put(event.request, response.clone());
        return response || new Response('', { status: 404 });
      })
    );
    return;
  }

  // ── 4. Todo o resto: Network First com fallback offline ──────
  event.respondWith(
    fetch(event.request)
      .then(response => {
        putInCache(event.request, response);
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
