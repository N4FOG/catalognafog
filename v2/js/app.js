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

  // Registro do Service Worker (Offline PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
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
