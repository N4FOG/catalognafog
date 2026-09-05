import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { StoriesBar } from './components/layout/StoriesBar';
import { ProductGrid } from './components/catalog/ProductGrid';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { SellerLoginModal } from './components/seller/SellerLoginModal';
import { SellerDashboardModal } from './components/seller/SellerDashboardModal';
import { CommissionModal } from './components/seller/CommissionModal';
import { ProposalModal } from './components/proposal/ProposalModal';
import { WhatsAppModal } from './components/proposal/WhatsAppModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { useSellerStore } from './store/useSellerStore';
import { useThemeStore } from './store/useThemeStore';
import { VENDEDORES } from './data/config';
import { normalizeText } from './utils/formatters';
import { sendTelemetry } from './utils/telemetry';

export const App: React.FC = () => {
  const { setAttributedSeller, getActiveSeller } = useSellerStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // 1. Sync theme class
    setTheme(theme);

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

    // 3. Register PWA Service Worker in production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header />
      <StoriesBar />
      <div className="flex-1">
        <ProductGrid />
      </div>
      <Footer />

      <CartDrawer />
      <ProductDetailModal />
      <SellerLoginModal />
      <SellerDashboardModal />
      <CommissionModal />
      <ProposalModal />
      <WhatsAppModal />
      <ToastContainer />
    </div>
  );
};

export default App;
