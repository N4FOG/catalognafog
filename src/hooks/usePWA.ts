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
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const { openIosInstallModal } = useCatalogStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(globalDeferredPrompt);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      addToast('🎉 Aplicativo JCV Distribuidora instalado com sucesso!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast]);

  const installApp = async () => {
    triggerHaptic(20);

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos) {
      openIosInstallModal();
      return;
    }

    const promptEvent = deferredPrompt || globalDeferredPrompt;

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
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
  };

  return {
    isInstallable: !!(deferredPrompt || globalDeferredPrompt),
    isInstalled,
    installApp,
  };
}
