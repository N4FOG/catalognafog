import { useState, useEffect } from 'react';
import { useCatalogStore } from '../store/useCatalogStore';
import { useToastStore } from '../store/useToastStore';
import { triggerHaptic } from '../utils/haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    try {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
    } catch {
      // Ignora erros de inicialização de evento
    }
  });
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const { openIosInstallModal } = useCatalogStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const checkStandalone = () => {
      try {
        const isStandalone =
          (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
          (typeof window !== 'undefined' && (window.navigator as any)?.standalone === true) ||
          (typeof document !== 'undefined' && document.referrer && document.referrer.includes('android-app://'));
        setIsInstalled(Boolean(isStandalone));
      } catch {
        setIsInstalled(false);
      }
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        e.preventDefault();
        globalDeferredPrompt = e as BeforeInstallPromptEvent;
        setDeferredPrompt(globalDeferredPrompt);
      } catch (err) {
        console.warn('PWA beforeinstallprompt notice:', err);
      }
    };

    const handleAppInstalled = () => {
      try {
        setIsInstalled(true);
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        addToast('🎉 Aplicativo JCV Distribuidora instalado com sucesso!', 'success');
      } catch (err) {
        console.warn('PWA appinstalled notice:', err);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast]);

  const installApp = async () => {
    try {
      triggerHaptic(20);

      const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any)?.MSStream;
      if (isIos) {
        openIosInstallModal();
        return;
      }

      const promptEvent = deferredPrompt || globalDeferredPrompt;

      if (promptEvent && typeof promptEvent.prompt === 'function') {
        try {
          await promptEvent.prompt();
          const choice = await promptEvent.userChoice;
          if (choice && choice.outcome === 'accepted') {
            addToast('🎉 Instalação iniciada!', 'success');
            setIsInstalled(true);
          }
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
        } catch (err) {
          console.warn('Erro ao disparar prompt PWA:', err);
        }
        return;
      }

      if (isInstalled) {
        addToast('✅ O aplicativo já está instalado no seu dispositivo!', 'info');
      } else {
        addToast('💡 Toque no menu do navegador (três pontinhos ⋮ ou Compartilhar) e selecione "Adicionar à Tela Inicial".', 'info', 4500);
      }
    } catch (err) {
      console.warn('Erro ao processar clique de instalação PWA:', err);
    }
  };

  return {
    isInstallable: !!(deferredPrompt || globalDeferredPrompt),
    isInstalled,
    installApp,
  };
}
