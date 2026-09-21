import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { triggerHaptic } from '../../utils/haptics';
import { sendTelemetry } from '../../utils/telemetry';
import { formatCurrency } from '../../utils/formatters';
import {
  X,
  Trash2,
  FileText,
  FileCheck,
  Send,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    getTotals,
    generateCartShareUrl
  } = useCartStore();

  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const {
    openProposalModal,
    openWhatsAppModal
  } = useCatalogStore();
  const { addToast } = useToastStore();

  const [isSecondaryExpanded, setIsSecondaryExpanded] = useState(false);
  const totals = getTotals();
  const activeSeller = getActiveSeller();

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
    if (window.confirm('Deseja realmente remover todos os produtos do orçamento?')) {
      const totalRemoved = totals.totalQtd;
      clearCart();
      addToast('🗑️ Orçamento esvaziado com sucesso!', 'info');

      sendTelemetry({
        evento: 'Limpou o Orçamento',
        vendedor: activeSeller.nome,
        vendedor_nome: activeSeller.nome,
        total_itens: totalRemoved,
        detalhes_extras: 'Todos os produtos foram removidos do orçamento'
      });
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

  const handleCopyLink = (includePrices: boolean) => {
    triggerHaptic(20);
    const url = generateCartShareUrl(includePrices);
    const totalFormatado = totals.totalFinalLiquido > 0 ? formatCurrency(totals.totalFinalLiquido) : 'Tabela Padrão';

    sendTelemetry({
      evento: includePrices ? `💰 Copiou Link COM PREÇO (${totalFormatado})` : '🔗 Copiou Link do Orçamento',
      link_proposta: url,
      total_itens: totals.totalQtd,
      valor_total: totalFormatado,
      detalhes_extras: includePrices ? `Total Líquido: ${totalFormatado} | Economia: R$ ${totals.economiaTotalReal.toFixed(2)}` : 'Link padrão'
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        addToast(
          includePrices
            ? `💰 Link copiado! (${totalFormatado})`
            : '🔗 Link do orçamento copiado com sucesso!',
          'success'
        );
      }).catch(() => {
        prompt(includePrices ? 'Copie o link com preços:' : 'Copie o link do orçamento:', url);
      });
    } else {
      prompt(includePrices ? 'Copie o link com preços:' : 'Copie o link do orçamento:', url);
    }
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
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
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
                <h4 className="font-bold text-base text-slate-800 dark:text-slate-200 font-display">
                  Seu orçamento está vazio
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Navegue pelo catálogo e clique em <strong>Adicionar</strong> nos produtos desejados para iniciar uma cotação.
                </p>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <span>Ver Catálogo de Produtos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Header bar of items list */}
                <div className="flex items-center justify-between pb-1 text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    📦 {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'} no orçamento
                  </span>
                  <button
                    onClick={handleClear}
                    className="text-rose-600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                  >
                    🗑️ Limpar Tudo
                  </button>
                </div>

                {/* List of Cart Items */}
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Client Information & Financial Breakdown */}
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
                  {/* Primary Action Button */}
                  <button
                    onClick={() => handleOpenProposal('with_prices')}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Gerar Proposta Oficial (Com Preços)</span>
                  </button>

                  {/* Secondary Collapsible Options */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        setIsSecondaryExpanded(!isSecondaryExpanded);
                      }}
                      className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <span>
                        {isSecondaryExpanded ? 'Ocultar opções de envio' : '⚡ Mais Opções de Envio (PDF, Links, Whats)'}
                      </span>
                      {isSecondaryExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isSecondaryExpanded && (
                      <div className="p-2.5 bg-white dark:bg-slate-900 space-y-2.5 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
                        {/* Par 1: WhatsApp Direto */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            📱 WhatsApp Direto p/ Cliente:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleOpenWhatsApp('with_prices')}
                              className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              <span>💬 Whats c/ Preço</span>
                            </button>
                            <button
                              onClick={() => handleOpenWhatsApp('without_prices')}
                              className="py-1.5 px-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <span>💬 Whats s/ Preço</span>
                            </button>
                          </div>
                        </div>

                        {/* Par 2: Proposta em PDF */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            📄 Proposta Comercial em PDF:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleOpenProposal('with_prices')}
                              className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              <span>📄 PDF c/ Preço</span>
                            </button>
                            <button
                              onClick={() => handleOpenProposal('without_prices')}
                              className="py-1.5 px-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <span>📄 PDF s/ Preço</span>
                            </button>
                          </div>
                        </div>

                        {/* Par 3: Links Diretos do Catálogo */}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            🔗 Links Diretos do Catálogo:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => handleCopyLink(true)}
                              className="py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              <span>💰 Link c/ Preço</span>
                            </button>
                            <button
                              onClick={() => handleCopyLink(false)}
                              className="py-1.5 px-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <span>🔗 Link s/ Preço</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenProposal('without_prices')}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Visualizar PDF</span>
                    </button>

                    <button
                      onClick={() => handleCopyLink(false)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

