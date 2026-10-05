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
      // Em produção, registra o Service Worker
      navigator.serviceWorker.register('sw.js').then(reg => {
        console.log('✅ Service Worker registrado com sucesso');
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nova versão do catálogo disponível.');
            }
          };
        };
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
