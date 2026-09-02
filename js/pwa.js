// =============================================================
//  RAWELL QUÍMICA — PWA & Modo Offline Controller
// =============================================================

let deferredInstallPrompt = null;

// ── 1. Registro do Service Worker ────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registrado com sucesso! Escopo:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Falha ao registrar Service Worker:', err);
      });
  });
}

// ── 2. Captura do Prompt de Instalação ───────────────────────
window.addEventListener('beforeinstallprompt', (e) => {
  // Previne o banner padrão do navegador
  e.preventDefault();
  deferredInstallPrompt = e;

  // Exibe botões/banners de instalação na interface
  const installButtons = document.querySelectorAll('.btn-pwa-install');
  installButtons.forEach(btn => {
    btn.style.display = 'inline-flex';
  });

  const installBanner = document.getElementById('pwa-install-banner');
  if (installBanner) {
    installBanner.style.display = 'flex';
  }
});

// ── 3. Função para Disparar a Instalação ──────────────────────
function instalarAppPWA() {
  if (!deferredInstallPrompt) {
    // Se já estiver instalado ou iOS (onde a instalação é manual pelo Safari)
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      alert('Para instalar no iPhone/iPad: Toque no ícone de Compartilhar do Safari e selecione "Adicionar à Tela de Início".');
    } else {
      alert('O aplicativo já está instalado ou pronto para uso no seu dispositivo!');
    }
    return;
  }

  deferredInstallPrompt.prompt();

  deferredInstallPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] Usuário aceitou a instalação do aplicativo.');
      esconderBotoesInstalacao();
    } else {
      console.log('[PWA] Usuário recusou a instalação.');
    }
    deferredInstallPrompt = null;
  });
}

function esconderBotoesInstalacao() {
  document.querySelectorAll('.btn-pwa-install').forEach(btn => {
    btn.style.display = 'none';
  });
  const installBanner = document.getElementById('pwa-install-banner');
  if (installBanner) installBanner.style.display = 'none';
}

// ── 4. Evento de App Instalado com Sucesso ───────────────────
window.addEventListener('appinstalled', () => {
  esconderBotoesInstalacao();
  const feedback = document.getElementById('cart-feedback');
  if (feedback) {
    feedback.textContent = '🎉 Aplicativo Rawell Catálogo instalado com sucesso!';
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 4000);
  }
});

// ── 5. Notificações de Status Online / Offline ───────────────
window.addEventListener('offline', () => {
  mostrarAvisoConexao('📡 Modo Offline Ativo: Você pode continuar navegando e montando orçamentos sem internet.', 'offline');
});

window.addEventListener('online', () => {
  mostrarAvisoConexao('🌐 Conexão com a internet restabelecida!', 'online');
});

function mostrarAvisoConexao(mensagem, tipo) {
  let badge = document.getElementById('pwa-network-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'pwa-network-badge';
    document.body.appendChild(badge);
  }

  badge.textContent = mensagem;
  badge.className = 'pwa-network-badge ' + tipo + ' show';

  setTimeout(() => {
    badge.classList.remove('show');
  }, 4500);
}

// Inicializar botões de instalação
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-pwa-install').forEach(btn => {
    btn.addEventListener('click', instalarAppPWA);
  });

  const closeBannerBtn = document.getElementById('pwa-banner-close');
  if (closeBannerBtn) {
    closeBannerBtn.addEventListener('click', () => {
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.style.display = 'none';
    });
  }
});
