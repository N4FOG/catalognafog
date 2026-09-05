// ═══════════════════════════════════════════════════════════════
//  JCV / RAWELL QUÍMICA v3.0 — GESTOS TOUCH & MOBILE APP PHYSICS
// ═══════════════════════════════════════════════════════════════

/**
 * Inicializa a detecção de gestos Swipe-Down nas Bottom Sheets
 */
function initSheetSwipeGestures(sheetElement, closeCallback) {
  if (!sheetElement) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  let isAtTop = true;

  const handleBar = sheetElement.querySelector('.sheet-handle-bar') || sheetElement;
  const sheetBody = sheetElement.querySelector('.sheet-body, .cart-sheet-body');

  function getTouchY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  handleBar.addEventListener('touchstart', (e) => {
    startY = getTouchY(e);
    isDragging = true;
    sheetElement.classList.add('dragging');
  }, { passive: true });

  sheetElement.addEventListener('touchstart', (e) => {
    // Se o usuário está no topo da rolagem da sheet, permite o arrasto para fechar
    if (sheetBody) {
      isAtTop = sheetBody.scrollTop <= 0;
    }
    startY = getTouchY(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging && !isAtTop) return;

    currentY = getTouchY(e);
    const deltaY = currentY - startY;

    // Apenas responde ao arrasto para baixo
    if (deltaY > 5) {
      isDragging = true;
      sheetElement.classList.add('dragging');
      // Adiciona leve resistência mecânica
      const resistedDelta = Math.pow(deltaY, 0.95);
      sheetElement.style.transform = `translateY(${resistedDelta}px)`;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    sheetElement.classList.remove('dragging');

    const deltaY = currentY - startY;

    // Se arrastou mais de 100px para baixo, fecha a gaveta
    if (deltaY > 100) {
      if (typeof hapticFeedback === 'function') hapticFeedback(25);
      sheetElement.style.transform = '';
      if (typeof closeCallback === 'function') {
        closeCallback();
      }
    } else {
      // Retorna suavemente à posição original
      sheetElement.style.transform = '';
    }
    startY = 0;
    currentY = 0;
  });
}

/**
 * Atualiza o Botão Flutuante Rápido de Orçamento no Mobile
 */
function updateMobileFloatingCart() {
  const floatBar = document.getElementById('mobile-floating-cart-bar');
  if (!floatBar) return;

  const totalQty = typeof cartItems !== 'undefined' ? cartItems.reduce((acc, i) => acc + i.quantidade, 0) : 0;
  const countPill = document.getElementById('m-float-cart-count');

  if (totalQty > 0) {
    if (countPill) countPill.textContent = `${totalQty} ${totalQty === 1 ? 'item' : 'itens'}`;
    floatBar.classList.add('show');
  } else {
    floatBar.classList.remove('show');
  }
}

/**
 * Monitoramento de Conexão Online/Offline
 */
function initConnectivityMonitor() {
  const pill = document.getElementById('offline-status-pill');
  if (!pill) return;

  function updateStatus() {
    if (!navigator.onLine) {
      pill.classList.add('show');
    } else {
      pill.classList.remove('show');
    }
  }

  window.addEventListener('online', () => {
    if (typeof showToast === 'function') showToast('🌐 Conexão restabelecida!');
    updateStatus();
  });

  window.addEventListener('offline', () => {
    if (typeof showToast === 'function') showToast('⚡ Modo Offline: Catálogo completo disponível');
    updateStatus();
  });

  updateStatus();
}

/**
 * Guia de Instalação para iOS Safari
 */
function isIosDevice() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function isInStandaloneMode() {
  return ('standalone' in window.navigator) && (window.navigator.standalone);
}

function openIosInstallModal() {
  if (typeof hapticFeedback === 'function') hapticFeedback(15);
  document.getElementById('ios-install-modal-backdrop')?.classList.add('show');
}

function closeIosInstallModal() {
  document.getElementById('ios-install-modal-backdrop')?.classList.remove('show');
}

/**
 * Disparo inteligente de instalação (Android x iOS)
 */
function smartInstallApp() {
  if (typeof hapticFeedback === 'function') hapticFeedback(20);

  if (isIosDevice() && !isInStandaloneMode()) {
    openIosInstallModal();
  } else if (typeof triggerPWAInstall === 'function') {
    triggerPWAInstall();
  } else {
    if (typeof showToast === 'function') {
      showToast('💡 Adicione à Tela de Início pelo menu do navegador');
    }
  }
}

/**
 * Bootstrap dos gestos e comportamentos mobile
 */
document.addEventListener('DOMContentLoaded', () => {
  // Gestos nas gavetas inferiores
  const prodSheet = document.getElementById('product-bottom-sheet');
  if (prodSheet && typeof closeProductSheet === 'function') {
    initSheetSwipeGestures(prodSheet, closeProductSheet);
  }

  const cartSheet = document.getElementById('cart-bottom-sheet');
  if (cartSheet && typeof closeCartSheet === 'function') {
    initSheetSwipeGestures(cartSheet, closeCartSheet);
  }

  // Monitor de conectividade
  initConnectivityMonitor();

  // Intercepta atualizações no carrinho para refletir no botão flutuante
  const originalUpdateBadges = window.updateCartBadges;
  if (typeof originalUpdateBadges === 'function') {
    window.updateCartBadges = function() {
      originalUpdateBadges.apply(this, arguments);
      updateMobileFloatingCart();
    };
  }
  updateMobileFloatingCart();
});
