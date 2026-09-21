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
  ChevronUp
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
    <div className="space-y-2 w-full">
      {/* 1. Totalizador Modo Vendedor (Clean, Compacto e Responsivo) */}
      {isSellerLoggedIn && (
        <div
          id="cart-seller-total-box"
          className="cart-total-proposal-card p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs"
        >
          {/* Subtotal dos Produtos */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Subtotal dos Produtos:
            </span>
            <strong className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totals.subtotalItensSemDesconto)}
            </strong>
          </div>

          {/* Desconto nos Produtos */}
          {totals.descontoTotalItens > 0.01 && (
            <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <span>🏷️ Desconto nos Produtos:</span>
              <strong className="font-mono text-xs">
                - {formatCurrency(totals.descontoTotalItens)}
              </strong>
            </div>
          )}

          {/* Desconto no Pedido */}
          <div className="pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Desconto no Pedido:
              </span>

              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleGlobalDiscountPill(pct)}
                    className={`px-1.5 py-0.5 text-[11px] font-bold rounded border transition-colors cursor-pointer ${
                      globalDiscountPercent === pct
                        ? 'bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {pct === 0 ? '0%' : `-${pct}%`}
                  </button>
                ))}

                <div className="flex items-center ml-0.5">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={globalDiscountPercent || ''}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="%"
                    className="w-11 py-0.5 px-1 text-center text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-emerald-700 dark:text-emerald-400">
              <span className="text-[10.5px] text-slate-400">
                {totals.baseItensSemDesconto > 0
                  ? `(Incide s/ ${totals.qtdTiposSemDesconto} item${totals.qtdTiposSemDesconto > 1 ? 's' : ''} sem desconto individual)`
                  : '(Todos os itens c/ desconto individual)'}
              </span>
              {totals.valorDescontoGlobal > 0 && (
                <strong className="font-mono font-bold">
                  - {formatCurrency(totals.valorDescontoGlobal)}
                </strong>
              )}
            </div>

            {totals.baseItensSemDesconto <= 0 && totals.totalQtd > 0 && (
              <p className="text-[10px] text-slate-400 italic">
                ℹ️ Todos os produtos já possuem desconto individual negociado.
              </p>
            )}
          </div>

          {/* Economia Total Real */}
          {totals.economiaTotalReal > 0.01 && (
            <div className="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  🎉 Economia Total:
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  ({totals.percentualEconomiaTotal.toFixed(1)}% OFF)
                </span>
              </div>
              <strong className="font-mono font-black text-emerald-800 dark:text-emerald-300">
                {formatCurrency(totals.economiaTotalReal)}
              </strong>
            </div>
          )}

          {/* Total Líquido Principal */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight block">
                Total Líquido da Proposta:
              </span>
              {totals.economiaTotalReal > 0.01 && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  Economia: {formatCurrency(totals.economiaTotalReal)}
                </span>
              )}
            </div>
            <span className="font-mono font-black text-xl text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totals.totalFinalLiquido)}
            </span>
          </div>
        </div>
      )}

      {/* 2. Card Expansível de Dados do Cliente / Proposta */}
      <div
        id="cart-client-accordion-container"
        className="bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-xs"
      >
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setIsAccordionOpen(!isAccordionOpen);
          }}
          className="w-full p-2.5 px-3 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">👤</span>
            <div>
              <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Dados para Contato Comercial
              </strong>
              <span
                className={`text-[10.5px] font-semibold block ${
                  clientInfo.nome
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {clientInfo.nome ? `✓ ${clientInfo.nome}` : 'Nome, CNPJ e Condições (Opcional)'}
              </span>
            </div>
          </div>

          <span className="text-slate-400 p-0.5 text-xs font-mono">
            {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {isAccordionOpen && (
          <div className="p-3 pt-2 border-t border-slate-200/70 dark:border-slate-700/80 space-y-2.5 bg-white dark:bg-slate-900 animate-in fade-in duration-150">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                Nome Completo / Empresa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientInfo.nome}
                onChange={(e) => setClientInfo({ nome: e.target.value })}
                placeholder="Ex: João da Silva ou Fazenda Primavera"
                className="w-full h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                Vendedor Responsável (opcional)
              </label>
              <select
                value={clientInfo.vendedor || activeSeller.id || ''}
                onChange={(e) => setClientInfo({ vendedor: e.target.value })}
                className="w-full h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                CNPJ / Cidade / Estado (opcional)
              </label>
              <input
                type="text"
                value={clientInfo.doc}
                onChange={(e) => setClientInfo({ doc: e.target.value })}
                placeholder="00.000.000/0001-00 ou Cascavel - PR"
                className="w-full h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {isSellerLoggedIn ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                      Condição de Pagamento
                    </label>
                    {paymentTerms && (
                      <button
                        type="button"
                        onClick={handleClearPayment}
                        className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                      >
                        ✕ Limpar
                      </button>
                    )}
                  </div>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  <label className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                    Validade da Proposta
                  </label>
                  <input
                    type="text"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    placeholder="10 dias"
                    className="w-full h-9 px-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </>
            ) : (
              <div className="text-center pt-1.5 pb-0.5 text-[11px] text-slate-500">
                💼 É representante comercial?{' '}
                <button
                  type="button"
                  onClick={() => openSellerModal()}
                  className="text-emerald-700 dark:text-emerald-400 font-bold underline hover:text-emerald-800 cursor-pointer"
                >
                  Acessar Modo Vendedor 🔒
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

