import React, { useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { triggerHaptic } from '../../utils/haptics';
import {
  X,
  Trash2,
  FileText,
  FileCheck,
  Send,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    getTotals
  } = useCartStore();

  const { isSellerLoggedIn } = useSellerStore();
  const {
    openProposalModal,
    openWhatsAppModal
  } = useCatalogStore();
  const { addToast } = useToastStore();

  const totals = getTotals();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleClose = () => {
    triggerHaptic(15);
    setIsCartOpen(false);
  };

  const handleClear = () => {
    triggerHaptic(25);
    if (window.confirm('Deseja realmente limpar todo o orçamento atual?')) {
      clearCart();
      addToast('🗑️ Orçamento esvaziado com sucesso.', 'info');
    }
  };

  const handleOpenProposal = (mode: 'with_prices' | 'without_prices') => {
    triggerHaptic(20);
    openProposalModal(mode);
  };

  const handleOpenWhatsApp = (mode: 'with_prices' | 'without_prices') => {
    triggerHaptic(20);
    openWhatsAppModal(mode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col justify-between border-l border-slate-200/80 dark:border-slate-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Orçamento Comercial
                </h3>
                <p className="text-xs text-slate-500">
                  {totals.totalQtd} {totals.totalQtd === 1 ? 'produto selecionado' : 'produtos selecionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Limpar orçamento"
                  aria-label="Limpar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              /* Empty Cart */
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-800">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  Seu orçamento está vazio
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Navegue pelo catálogo e clique em <strong>Adicionar</strong> nos produtos desejados para iniciar uma cotação.
                </p>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <span>Explorar Produtos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Financial Summary & Client Info */}
                <CartSummary />
              </>
            )}
          </div>

          {/* Footer Action Buttons */}
          {items.length > 0 && (
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0 shadow-lg">
              {isSellerLoggedIn ? (
                /* Seller Action Options */
                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenProposal('with_prices')}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Gerar Proposta Oficial (Com Preços)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenWhatsApp('with_prices')}
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 dark:border-emerald-700 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleOpenProposal('without_prices')}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF Sem Preço</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Client Action Options */
                <div className="space-y-2">
                  <button
                    onClick={() => handleOpenWhatsApp('without_prices')}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Orçamento via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleOpenProposal('without_prices')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Visualizar Lista Técnica em PDF</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
