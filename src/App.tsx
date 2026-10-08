import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SearchMobileSection } from './components/layout/SearchMobileSection';
import { StoriesCategories } from './components/layout/StoriesCategories';
import { ProductGrid } from './components/catalog/ProductGrid';
import { Footer } from './components/layout/Footer';
import { BottomNavMobile } from './components/layout/BottomNavMobile';
import { FloatingCartBarMobile } from './components/layout/FloatingCartBarMobile';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { SellerLoginModal } from './components/seller/SellerLoginModal';
import { SellerDashboardModal } from './components/seller/SellerDashboardModal';
import { CommissionModal } from './components/seller/CommissionModal';
import { ProposalModal } from './components/proposal/ProposalModal';
import { WhatsAppModal } from './components/proposal/WhatsAppModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { ProductListAdminModal } from './components/admin/ProductListAdminModal';
import { ProductEditModal } from './components/admin/ProductEditModal';
import { IosInstallModal } from './components/ui/IosInstallModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { useSellerStore } from './store/useSellerStore';
import { useAdminStore } from './store/useAdminStore';
import { useCartStore } from './store/useCartStore';
import { useCatalogStore } from './store/useCatalogStore';
import { useThemeStore } from './store/useThemeStore';
import { useToastStore } from './store/useToastStore';
import { VENDEDORES } from './data/config';
import { PRODUTOS } from './data/products';
import { normalizeText } from './utils/formatters';
import { sendTelemetry } from './utils/telemetry';
import { findProductBySlug, slugifyProductName } from './utils/productUrl';

export const App: React.FC = () => {
  const { setAttributedSeller, getActiveSeller, initIndexedDb } = useSellerStore();
  const { loadInitialData, products } = useAdminStore();
  const { loadCartFromUrl } = useCartStore();
  const { selectedProduct, setSelectedProduct } = useCatalogStore();
  const { theme, setTheme } = useThemeStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    // 1. Sync theme and load IndexedDB history & cloud products
    setTheme(theme);
    initIndexedDb();
    loadInitialData();

    // 2. Read query params for ?vendedor=carlos
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('vendedor') || params.get('v') || params.get('rep');

      if (code) {
        const norm = normalizeText(code);
        const found = VENDEDORES.find(
          (v) => normalizeText(v.id) === norm || normalizeText(v.nome).includes(norm)
        );

        if (found) {
          setAttributedSeller(found.id);
          sendTelemetry({
            evento: 'Acesso por Link Comissionado',
            origem_canal: `🟢 Vendedor (${found.nome})`,
            vendedor: found.nome,
            vendedor_nome: found.nome,
            detalhes_extras: `Cliente acessou via link com código: ${code}`
          });
        }
      } else {
        const activeSeller = getActiveSeller();
        sendTelemetry({
          evento: 'Acesso ao Catálogo',
          origem_canal: activeSeller.id ? `🟢 Vendedor (${activeSeller.nome})` : '🔵 Base / Orgânico',
          vendedor: activeSeller.nome,
          vendedor_nome: activeSeller.nome
        });
      }
    } catch (e) {
      console.warn('URL attribution check notice:', e);
    }

    // 3. Load cart from URL if magic link provided
    const loaded = loadCartFromUrl();
    if (loaded) {
      addToast('📂 Orçamento carregado com sucesso!', 'success');
    }

    // 4. Deep Link de Produto (/p/slug ou ?produto=slug)
    try {
      const params = new URLSearchParams(window.location.search);
      const pathMatch = window.location.pathname.match(/\/(?:p|produto)\/([^/]+)/);
      const pathCode = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
      const prodCode = params.get('produto') || params.get('p') || params.get('id') || pathCode;
      if (prodCode) {
        const catalogList = products && products.length > 0 ? products : PRODUTOS;
        const found = findProductBySlug(prodCode, catalogList);
        if (found) {
          setSelectedProduct(found);
        }
      }
    } catch (e) {
      console.warn('URL product deep link check notice:', e);
    }

    // 5. Register PWA Service Worker in production / Unregister in dev
    if ('serviceWorker' in navigator) {
      if (import.meta.env.PROD) {
        window.addEventListener('load', () => {

          // ── Log de diagnóstico: estado inicial do SW ──────────
          const ctrl = navigator.serviceWorker.controller;
          if (ctrl) {
            console.log('%c[APP:SW] 🎮 SW já controla esta aba ao carregar:', 'color:#10b981;font-weight:bold', ctrl.scriptURL, '| state:', ctrl.state);
          } else {
            console.log('%c[APP:SW] ⚠️ Nenhum SW controlando esta aba agora (primeira visita ou SW foi limpo)', 'color:#f59e0b;font-weight:bold');
          }

          // Lista todos os caches existentes no storage
          caches.keys().then(keys => {
            console.log('%c[APP:SW] 🗂️ Caches no storage desta origem:', 'color:#6366f1;font-weight:bold', keys);
          });

          navigator.serviceWorker.register('/sw.js?v=6.1.1').then((reg) => {
            console.log('%c[APP:SW] ✅ SW registrado — escopo:', 'color:#10b981;font-weight:bold', reg.scope);
            console.log('[APP:SW] Estado do SW registrado → installing:', reg.installing?.state, '| waiting:', reg.waiting?.state, '| active:', reg.active?.state);

            if (reg.waiting) {
              console.warn('%c[APP:SW] ⏳ Há um SW em estado WAITING (versão nova pronta mas não ativada). Isso pode causar o pisca-pisca!', 'color:#ef4444;font-weight:bold');
            }

            // Escuta SW_UPDATED: disparado quando o SW novo assume via clients.claim()
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data?.type === 'SW_UPDATED') {
                console.log('%c[APP:SW] 📢 Mensagem SW_UPDATED recebida — recarregando página agora', 'color:#8b5cf6;font-weight:bold');
                window.location.reload();
              }
            });

            // Detecta nova versão disponível (deploy novo no servidor)
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              console.log('%c[APP:SW] 🔄 updatefound: novo SW encontrado!', 'color:#f59e0b;font-weight:bold', '| URL:', newWorker?.scriptURL);

              newWorker?.addEventListener('statechange', () => {
                console.log('[APP:SW] statechange do novo SW → state:', newWorker.state, '| controller atual:', navigator.serviceWorker.controller?.state);

                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('%c[APP:SW] ✅ Novo SW instalado com controller ativo — mostrando banner e recarregando em 3s', 'color:#10b981;font-weight:bold');
                  } else {
                    console.log('%c[APP:SW] ℹ️ Novo SW instalado SEM controller (primeira instalação) — sem reload necessário', 'color:#6366f1;font-weight:bold');
                  }
                }

                if (newWorker.state === 'activated') {
                  console.log('%c[APP:SW] ✅ Novo SW ativado', 'color:#10b981;font-weight:bold');
                }

                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  const banner = document.createElement('div');
                  banner.innerHTML = `
                    <div style="position:fixed;top:0;left:0;right:0;background:linear-gradient(135deg,#10b981,#059669);color:white;padding:14px 20px;text-align:center;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-family:system-ui,sans-serif;animation:slideDown 0.3s ease;">
                      <strong style="font-size:15px;">🎉 Nova versão do catálogo disponível!</strong>
                      <span style="margin:0 8px;opacity:0.9;">|</span>
                      <span style="font-size:14px;">Atualizando em 3 segundos...</span>
                    </div>
                    <style>
                      @keyframes slideDown {
                        from { transform: translateY(-100%); }
                        to { transform: translateY(0); }
                      }
                    </style>
                  `;
                  document.body.appendChild(banner);

                  setTimeout(() => {
                    window.location.reload();
                  }, 3000);
                }
              });
            });

            // Verifica atualizações a cada 60 segundos
            setInterval(() => {
              console.log('[APP:SW] 🔍 Verificando atualizações do SW...');
              reg.update();
            }, 60000);

          }).catch((err) => {
            console.log('SW registration note:', err);
          });
        });
      } else {
        // Em dev, limpa qualquer Service Worker para garantir código fresco
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      }
    }
  }, []);

  // Sincronizar URL quando o modal de produto for aberto ou fechado
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const currentUrl = new URL(window.location.href);
      if (selectedProduct) {
        const slug = slugifyProductName(selectedProduct.nome);
        const targetPath = `/p/${slug}`;
        if (!currentUrl.pathname.includes(targetPath) && currentUrl.searchParams.get('produto') !== slug) {
          window.history.pushState({ productId: selectedProduct.id, slug }, '', targetPath);
        }
      } else {
        if (
          currentUrl.pathname.startsWith('/p/') ||
          currentUrl.pathname.startsWith('/produto/') ||
          currentUrl.searchParams.has('produto') ||
          currentUrl.searchParams.has('p')
        ) {
          currentUrl.searchParams.delete('produto');
          currentUrl.searchParams.delete('p');
          const cleanSearch = currentUrl.searchParams.toString() ? `?${currentUrl.searchParams.toString()}` : '';
          window.history.replaceState({}, '', `/${cleanSearch}`);
        }
      }
    } catch (e) {
      console.warn('URL sync notice:', e);
    }
  }, [selectedProduct]);

  // Sincroniza o produto aberto no modal caso a lista seja atualizada com variações
  useEffect(() => {
    if (selectedProduct && products && products.length > 0) {
      const latest = products.find((p) => p.id === selectedProduct.id);
      if (latest && latest !== selectedProduct) {
        if (!selectedProduct.variacoes && latest.variacoes) {
          setSelectedProduct(latest);
        }
      }
    }
  }, [products, selectedProduct, setSelectedProduct]);

  // Suporte ao botão 'Voltar' do navegador ou celular (Android / iOS)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const pathMatch = window.location.pathname.match(/\/(?:p|produto)\/([^/]+)/);
        const pathCode = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
        const prodCode = params.get('produto') || params.get('p') || params.get('id') || pathCode;
        if (prodCode) {
          const catalogList = products && products.length > 0 ? products : PRODUTOS;
          const found = findProductBySlug(prodCode, catalogList);
          if (found) {
            setSelectedProduct(found);
            return;
          }
        }
        setSelectedProduct(null);
      } catch (e) {
        console.warn('Popstate handling notice:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, setSelectedProduct]);

  return (
    <div id="root-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 pb-16 md:pb-0">
      <Header />
      <SearchMobileSection />
      <div id="categories-section">
        <StoriesCategories />
      </div>
      <div className="flex-1">
        <ProductGrid />
      </div>
      <Footer />

      {/* Mobile Fixed Navigation & Floating Cart Bar */}
      <BottomNavMobile />
      <FloatingCartBarMobile />

      {/* Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <SellerLoginModal />
      <SellerDashboardModal />
      <CommissionModal />
      <ProposalModal />
      <WhatsAppModal />
      <AdminDashboardModal />
      <ProductListAdminModal />
      <ProductEditModal />
      <IosInstallModal />
      <ToastContainer />
    </div>
  );
};

export default App;

