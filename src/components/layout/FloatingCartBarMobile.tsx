import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';

export const FloatingCartBarMobile: React.FC = () => {
  const { setIsCartOpen, getTotals } = useCartStore();
  const { isSellerLoggedIn } = useSellerStore();

  const totals = getTotals();

  if (totals.totalQtd === 0) return null;

  const handleClick = () => {
    triggerHaptic(20);
    setIsCartOpen(true);
  };

  return (
    <div className="md:hidden fixed bottom-[calc(68px+max(6px,env(safe-area-inset-bottom,0px)))] left-4 right-4 z-30 animate-in slide-in-from-bottom-3 duration-200">
      <button
        onClick={handleClick}
        className="w-full h-12 px-4 rounded-2xl bg-[#0f4531] text-white flex items-center justify-between shadow-xl shadow-[#0f4531]/30 border border-[#10b981]/50 active:scale-98 transition-all"
      >
        <div className="flex items-center gap-2">
          <span>🛒</span>
          <span className="text-xs font-black font-display">Ver Meu Orçamento</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-[#10b981] text-white dark:bg-[#09261b] dark:text-[#10b981]">
            {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {isSellerLoggedIn && totals.totalFinalLiquido > 0 ? (
          <span className="font-mono font-black text-sm text-[#10b981]">
            {formatCurrency(totals.totalFinalLiquido)}
          </span>
        ) : (
          <span className="text-xs font-bold text-[#10b981]">Cotar Agora →</span>
        )}
      </button>
    </div>
  );
};
