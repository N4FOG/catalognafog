import React from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useThemeStore } from '../../store/useThemeStore';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  UserCheck,
  Lock,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    openSellerModal,
    openSellerDashboard
  } = useCatalogStore();

  const { setIsCartOpen, getTotals } = useCartStore();
  const { isSellerLoggedIn, session } = useSellerStore();
  const { theme, toggleTheme } = useThemeStore();

  const totals = getTotals();

  const handleCartClick = () => {
    triggerHaptic(20);
    setIsCartOpen(true);
  };

  const handleSellerClick = () => {
    triggerHaptic(20);
    if (isSellerLoggedIn) {
      openSellerDashboard();
    } else {
      openSellerModal();
    }
  };

  const handleThemeClick = () => {
    triggerHaptic(15);
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 dark:from-emerald-700 dark:to-emerald-900 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-900/20 shrink-0 border border-emerald-600/30">
            🌿
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                JCV Química
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Rawell Química • Catálogo Oficial & Cotações
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Seller Badge / Login */}
          <button
            onClick={handleSellerClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
              isSellerLoggedIn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700/80 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
            title={isSellerLoggedIn ? 'Painel do Vendedor' : 'Acesso do Representante'}
          >
            {isSellerLoggedIn ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{session?.vendedorNome?.split(' ')[0] || 'Vendedor'}</span>
                <span className="sm:hidden">Vendedor</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 opacity-70" />
                <span className="hidden sm:inline">Área do Representante</span>
                <span className="sm:hidden">PIN</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeClick}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-700/80 active:scale-95"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-800/30 transition-all active:scale-95 border border-emerald-500/40"
            aria-label="Abrir Orçamento"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Orçamento</span>
            {totals.totalQtd > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-black bg-white text-emerald-900 dark:bg-amber-400 dark:text-slate-950 rounded-full leading-none shadow-sm animate-in zoom-in">
                {totals.totalQtd}
              </span>
            )}
            {isSellerLoggedIn && totals.totalFinalLiquido > 0 && (
              <span className="hidden md:inline font-mono font-medium opacity-90 pl-1 border-l border-emerald-600/50">
                {formatCurrency(totals.totalFinalLiquido)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Search Input Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, praga (baratas, tiririca, cupim), referência ou princípio ativo..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
