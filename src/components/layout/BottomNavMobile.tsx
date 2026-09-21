import React from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { triggerHaptic } from '../../utils/haptics';

export const BottomNavMobile: React.FC = () => {
  const { openSellerAppModal } = useCatalogStore();
  const { setIsCartOpen, getTotals } = useCartStore();
  const { isSellerLoggedIn } = useSellerStore();

  const totals = getTotals();

  const scrollToSection = (id: string) => {
    triggerHaptic(10);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0f1f17]/95 backdrop-blur-md border-t border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] flex items-center justify-around px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom,0px))] shadow-lg">
      <button
        onClick={() => scrollToSection('root')}
        className="flex flex-col items-center gap-0.5 text-[#334e40] dark:text-[#9cb8a9] focus:outline-none py-1"
      >
        <span className="text-lg">🌿</span>
        <span className="text-[10px] font-bold">Catálogo</span>
      </button>

      <button
        onClick={() => {
          triggerHaptic(10);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-0.5 text-[#334e40] dark:text-[#9cb8a9] focus:outline-none py-1"
      >
        <span className="text-lg">🔍</span>
        <span className="text-[10px] font-bold">Buscar</span>
      </button>

      <button
        onClick={() => scrollToSection('categories-section')}
        className="flex flex-col items-center gap-0.5 text-[#334e40] dark:text-[#9cb8a9] focus:outline-none py-1"
      >
        <span className="text-lg">📑</span>
        <span className="text-[10px] font-bold">Categorias</span>
      </button>

      {isSellerLoggedIn && (
        <button
          onClick={() => {
            triggerHaptic(15);
            openSellerAppModal('quotes');
          }}
          className="flex flex-col items-center gap-0.5 text-[#0f4531] dark:text-[#10b981] focus:outline-none py-1"
        >
          <span className="text-lg">👔</span>
          <span className="text-[10px] font-black">Vendedor</span>
        </button>
      )}

      <button
        onClick={() => {
          triggerHaptic(15);
          setIsCartOpen(true);
        }}
        className="relative flex flex-col items-center gap-0.5 text-[#0f4531] dark:text-[#10b981] focus:outline-none py-1"
      >
        <span className="text-lg">🛒</span>
        <span className="text-[10px] font-extrabold">Orçamento</span>
        {totals.totalQtd > 0 && (
          <span className="absolute top-0 right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#0f4531] text-white dark:bg-[#10b981] dark:text-[#09261b]">
            {totals.totalQtd}
          </span>
        )}
      </button>
    </nav>
  );
};
