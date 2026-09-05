import React, { useEffect, useRef } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useThemeStore } from '../../store/useThemeStore';
import { triggerHaptic } from '../../utils/haptics';
import { logSearchTelemetry } from '../../utils/telemetry';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    openSellerModal,
    openSellerAppModal,
    openIosInstallModal
  } = useCatalogStore();

  const { setIsCartOpen, getTotals } = useCartStore();
  const { isSellerLoggedIn, session, getActiveSeller } = useSellerStore();
  const { theme, toggleTheme } = useThemeStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totals = getTotals();
  const seller = getActiveSeller();

  // Keyboard shortcut '/' to focus desktop search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCartClick = () => {
    triggerHaptic(20);
    setIsCartOpen(true);
  };

  const handleSellerClick = () => {
    triggerHaptic(20);
    if (isSellerLoggedIn) {
      openSellerAppModal('quotes');
    } else {
      openSellerModal();
    }
  };

  const handleThemeClick = () => {
    triggerHaptic(15);
    toggleTheme();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    if (searchQuery.trim().length >= 2) {
      logSearchTelemetry(searchQuery, totals.totalQtd, seller.nome, isSellerLoggedIn ? '👔 Vendedor' : '🔵 Base', true);
    }
  };

  const handleInstallClick = () => {
    triggerHaptic(20);
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos) {
      openIosInstallModal();
    } else {
      // Trigger prompt if available
      window.dispatchEvent(new Event('pwa-install-trigger'));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f1f17]/95 backdrop-blur-md border-b border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.18)] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-[68px] flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            triggerHaptic(10);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f4531] to-[#09261b] dark:from-[#176043] dark:to-[#0f4531] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#0f4531]/20 shrink-0 border border-[#10b981]/30">
            🌿
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-[#0f1f17] dark:text-[#edf5f0] tracking-tight font-display">
                JCV Química
              </span>
            </div>
            <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#eaf7f0] text-[#0f4531] dark:bg-[#14281f] dark:text-[#10b981] border border-[#10b981]/30">
              Catálogo &amp; Revenda 2026
            </span>
          </div>
        </div>

        {/* Desktop Search Bar (Visível apenas em Desktop md+) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
          role="search"
        >
          <button
            type="submit"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#10b981] transition-colors p-0 bg-transparent border-none cursor-pointer"
            aria-label="Pesquisar"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2.5" fill="none">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por produto, praga ou princípio ativo..."
            className="w-full pl-10 pr-16 py-2 bg-slate-100/90 dark:bg-[#14281f] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] rounded-full text-xs sm:text-sm text-[#0f1f17] dark:text-[#edf5f0] placeholder-slate-400 dark:placeholder-[#638573] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:bg-white dark:focus:bg-[#0f1f17] transition-all"
            autoComplete="off"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-[#0f1f17] text-slate-400 dark:text-[#638573] border border-slate-200 dark:border-slate-700 pointer-events-none">
              /
            </span>
          )}
        </form>

        {/* Top Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Seller Badge / Button */}
          <button
            onClick={handleSellerClick}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
              isSellerLoggedIn
                ? 'bg-[#eaf7f0] text-[#0f4531] border-[#10b981]/50 dark:bg-[#14281f] dark:text-[#10b981] dark:border-[#10b981]/40 shadow-sm'
                : 'bg-slate-100 text-[#334e40] border-slate-200 hover:bg-slate-200 dark:bg-[#14281f] dark:text-[#9cb8a9] dark:border-slate-800'
            }`}
            title={isSellerLoggedIn ? 'Painel do Vendedor' : 'Acesso Restrito do Representante'}
          >
            <span>{isSellerLoggedIn ? '👔' : '🔒'}</span>
            <span className="hidden sm:inline">
              {isSellerLoggedIn ? (session?.vendedorNome?.split(' ')[0] || 'Vendedor') : 'Área do Vendedor'}
            </span>
          </button>

          {/* Install App (PWA) Button */}
          <button
            onClick={handleInstallClick}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#14281f] dark:hover:bg-[#1b3529] text-[#334e40] dark:text-[#9cb8a9] border border-slate-200 dark:border-slate-800 transition-colors"
            title="Instalar aplicativo na tela inicial"
          >
            <span>📲</span>
            <span>App</span>
          </button>

          {/* Download PDF Button */}
          <a
            href="Cátalogo 2026.pdf"
            download="Catalogo-JCV-Quimica-2026.pdf"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#eaf7f0] hover:bg-[#d5ede1] dark:bg-[#14281f] dark:hover:bg-[#1b3529] text-[#0f4531] dark:text-[#10b981] border border-[#10b981]/30 transition-colors"
            title="Baixar Catálogo Oficial 2026 em PDF"
          >
            <span>📥</span>
            <span>Baixar PDF</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-[#14281f] dark:hover:bg-[#1b3529] text-base transition-colors border border-slate-200/80 dark:border-slate-800 active:scale-95"
            aria-label="Alternar tema"
            title="Alternar Tema Claro/Escuro"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={handleCartClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f4531] hover:bg-[#176043] dark:bg-[#10b981] dark:hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#0f4531]/20 transition-all active:scale-95 border border-[#10b981]/40"
            aria-label="Abrir Orçamento"
          >
            <span>🛒</span>
            <span className="hidden sm:inline font-display">Orçamento</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black bg-[#10b981] text-white dark:bg-[#09261b] dark:text-[#10b981] rounded-full leading-none shadow-sm">
              {totals.totalQtd}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
