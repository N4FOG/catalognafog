import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { VENDEDORES } from '../../data/config';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export const CartSummary: React.FC = () => {
  const {
    clientInfo,
    setClientInfo,
    globalDiscountPercent,
    setGlobalDiscount,
    paymentTerms,
    setPaymentTerms,
    validityDays,
    setValidityDays,
    getTotals
  } = useCartStore();

  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { openSellerModal } = useCatalogStore();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const totals = getTotals();
  const activeSeller = getActiveSeller();

  const handleGlobalDiscountPill = (val: number) => {
    triggerHaptic(10);
    setGlobalDiscount(val);
  };

  const handleClearPayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(10);
    setPaymentTerms('');
  };

  return (
    <div className="space-y-4">
      {/* Client Information Accordion Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setIsAccordionOpen(!isAccordionOpen);
          }}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
              👤
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Dados para Contato Comercial
              </strong>
              <span className={`text-[11px] font-medium ${clientInfo.nome ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                {clientInfo.nome ? `✓ ${clientInfo.nome}` : 'Nome, CNPJ e Condições (Opcional)'}
              </span>
            </div>
          </div>

          <span className="text-slate-400 p-1">
            {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {isAccordionOpen && (
          <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-3 mt-1 animate-in fade-in duration-150">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nome Completo / Empresa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientInfo.nome}
                onChange={(e) => setClientInfo({ nome: e.target.value })}
                placeholder="Ex: João da Silva ou Fazenda Primavera"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Vendedor Responsável (opcional)
              </label>
              <select
                value={clientInfo.vendedor || activeSeller.id || ''}
                onChange={(e) => setClientInfo({ vendedor: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">Nenhum vendedor selecionado (Geral)</option>
                {VENDEDORES.filter((v) => v.id).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                CNPJ / Cidade / Estado (opcional)
              </label>
              <input
                type="text"
                value={clientInfo.doc}
                onChange={(e) => setClientInfo({ doc: e.target.value })}
                placeholder="00.000.000/0001-00 ou Cascavel - PR"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {isSellerLoggedIn ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Condição de Pagamento
                    </label>
                    {paymentTerms && (
                      <button
                        type="button"
                        onClick={handleClearPayment}
                        className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline"
                      >
                        ✕ Limpar
                      </button>
                    )}
                  </div>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">Nenhuma / A Combinar (Não definir)</option>
                    <option value="PIX / À Vista (À vista c/ desconto)">⚡ PIX / À Vista (À vista c/ desconto)</option>
                    <option value="Boleto 30 Dias">📄 Boleto 30 Dias</option>
                    <option value="Boleto 30 / 60 Dias">📄 Boleto 30 / 60 Dias</option>
                    <option value="Boleto 30 / 60 / 90 Dias">📄 Boleto 30 / 60 / 90 Dias</option>
                    <option value="Cartão em até 3x">💳 Cartão em até 3x</option>
                    <option value="A Combinar com Vendedor">🤝 A Combinar c/ Representante</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Validade da Proposta
                  </label>
                  <input
                    type="text"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="10 dias"
                    className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </>
            ) : (
              <div className="text-center pt-2 pb-1 text-[11px] text-slate-500">
                💼 É representante comercial?{' '}
                <button
                  type="button"
                  onClick={() => openSellerModal()}
                  className="text-emerald-700 dark:text-emerald-400 font-bold underline hover:text-emerald-800"
                >
                  Acessar Modo Vendedor 🔒
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Financial Summary (Seller Mode) */}
      {isSellerLoggedIn ? (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-sm">
          {/* Subtotal dos Produtos */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Subtotal dos Produtos:
            </span>
            <strong className="font-mono text-sm text-slate-900 dark:text-slate-100">
              {formatCurrency(totals.subtotalItensSemDesconto)}
            </strong>
          </div>

          {/* Desconto nos Produtos */}
          {totals.descontoTotalItens > 0.01 && (
            <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <span>🏷️ Desconto nos Produtos:</span>
              <strong className="font-mono">
                - {formatCurrency(totals.descontoTotalItens)}
              </strong>
            </div>
          )}

          {/* Desconto no Pedido */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Desconto no Pedido:
              </span>

              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleGlobalDiscountPill(pct)}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-lg border transition-colors ${
                      globalDiscountPercent === pct
                        ? 'bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {pct === 0 ? '0%' : `-${pct}%`}
                  </button>
                ))}

                <div className="flex items-center ml-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={globalDiscountPercent || ''}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="%"
                    className="w-12 py-0.5 px-1 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400">
              <span className="text-[11px] text-slate-400">
                {totals.baseItensSemDesconto > 0
                  ? `(Incide sobre ${totals.qtdTiposSemDesconto} item${totals.qtdTiposSemDesconto > 1 ? 's' : ''} sem desconto individual)`
                  : '(Todos os itens possuem desconto individual)'}
              </span>
              {totals.valorDescontoGlobal > 0 && (
                <strong className="font-mono font-bold">
                  - {formatCurrency(totals.valorDescontoGlobal)}
                </strong>
              )}
            </div>
          </div>

          {/* Economia Total Real */}
          {totals.economiaTotalReal > 0.01 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 block">
                    🎉 Economia Total do Cliente:
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    ({totals.percentualEconomiaTotal.toFixed(1)}% OFF)
                  </span>
                </div>
              </div>
              <strong className="font-mono font-black text-sm text-emerald-800 dark:text-emerald-300">
                {formatCurrency(totals.economiaTotalReal)}
              </strong>
            </div>
          )}

          {/* Total Líquido Principal */}
          <div className="pt-2 border-t-2 border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight block">
                Total Líquido da Proposta:
              </span>
              <span className="text-[11px] text-slate-500">
                {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'} no pedido
              </span>
            </div>
            <span className="font-mono font-black text-xl sm:text-2xl text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totals.totalFinalLiquido)}
            </span>
          </div>
        </div>
      ) : (
        /* Client Summary (Without Prices) */
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Total de Produtos Selecionados:
              </h5>
              <p className="text-[11px] text-slate-500">
                Pronto para envio e cotação rápida
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm rounded-xl border border-emerald-300 dark:border-emerald-700">
            {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'}
          </span>
        </div>
      )}
    </div>
  );
};

