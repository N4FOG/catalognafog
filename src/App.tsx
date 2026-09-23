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
import { useThemeStore } from './store/useThemeStore';
import { useToastStore } from './store/useToastStore';
import { VENDEDORES } from './data/config';
import { normalizeText } from './utils/formatters';
import { sendTelemetry } from './utils/telemetry';

export const App: React.FC = () => {
  const { setAttributedSeller, getActiveSeller, initIndexedDb } = useSellerStore();
  const { loadInitialData } = useAdminStore();
  const { loadCartFromUrl } = useCartStore();
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

    // 4. Register PWA Service Worker in production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }, []);

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

