// ═══════════════════════════════════════════════════════════════
//  PWA INSTALLATION LOGIC & EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Exibe botão de instalar no Header
  const installBtn = document.getElementById('btn-install-app');
  if (installBtn) installBtn.style.display = 'inline-flex';

  // Exibe banner inferior se não foi dispensado anteriormente
  if (!localStorage.getItem('rawell_pwa_dismissed')) {
    setTimeout(() => {
      document.getElementById('pwa-install-banner')?.classList.add('show');
    }, 2000);
  }
});

function triggerPWAInstall() {
  hapticFeedback(25);
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 Aplicativo instalado com sucesso!');
      }
      deferredPrompt = null;
      document.getElementById('btn-install-app')?.style.setProperty('display', 'none');
      document.getElementById('pwa-install-banner')?.classList.remove('show');
    });
  } else {
    showToast('💡 No menu do navegador (⋮ ou Compartilhar), selecione "Adicionar à Tela Inicial"');
  }
}

function dismissPWABanner() {
  hapticFeedback(10);
  document.getElementById('pwa-install-banner')?.classList.remove('show');
  localStorage.setItem('rawell_pwa_dismissed', 'true');
}

window.addEventListener('appinstalled', () => {
  showToast('✅ App JCV Química instalado na sua tela inicial!');
  document.getElementById('btn-install-app')?.style.setProperty('display', 'none');
  document.getElementById('pwa-install-banner')?.classList.remove('show');
});