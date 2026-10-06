// ═══════════════════════════════════════════════════════════════
//  RAWELL QUÍMICA v3.0 — ORQUESTRADOR PRINCIPAL (BOOTSTRAP)
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSellerAssignment();
  loadCart();
  loadCartFromUrl();
  updateHistoryBadges();
  renderStoriesCategories();
  renderProductList();

  // Registro do Service Worker (Offline PWA) - APENAS EM PRODUÇÃO
  if ('serviceWorker' in navigator) {
    // Detecta se está em desenvolvimento (localhost ou arquivo local)
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.protocol === 'file:';
    
    if (isDev) {
      // Em desenvolvimento, desregistra qualquer Service Worker ativo
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const reg of registrations) {
          reg.unregister();
          console.log('🔧 [DEV] Service Worker desregistrado para evitar cache');
        }
      });
    } else {
      // Em produção, registra o Service Worker com detecção de atualização
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('✅ Service Worker registrado com sucesso');

        // Escuta SW_UPDATED: novo SW assumiu controle via clients.claim()
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'SW_UPDATED') {
            console.log('[SW] Novo SW assumiu — recarregando.');
            window.location.reload();
          }
        });
        
        // Detecta nova versão
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          console.log('🔄 Nova versão detectada!');
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('⚠️ Nova versão instalada. Recarregando...');
              
              // Banner de atualização
              const banner = document.createElement('div');
              banner.innerHTML = `
                <div style="position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#10b981,#059669);color:white;padding:14px 20px;text-align:center;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:system-ui,sans-serif;">
                  <strong style="font-size:15px;">🎉 Catálogo atualizado!</strong>
                  <span style="margin:0 8px;">|</span>
                  <span style="font-size:14px;">Aplicando em 3s...</span>
                </div>
              `;
              document.body.appendChild(banner);
              
              setTimeout(() => location.reload(), 3000);
            }
          };
        };
        
        // Verifica atualizações a cada minuto
        setInterval(() => reg.update(), 60000);
        
      }).catch(() => {});
    }
  }
});

// Atalhos Globais de Teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductSheet();
    closeCartSheet();
    closeSellerLoginModal();
    closeQuoteHistoryModal();
    closePdfProposalModal();
    closeClientWhatsAppModal();
    closeSellerAppModal();
  }
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    focusMainSearch();
  }
});
