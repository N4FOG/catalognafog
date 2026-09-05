import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Sparkles, User, FileText, Phone, Percent, ShieldCheck } from 'lucide-react';

export const CartSummary: React.FC = () => {
  const {
    clientInfo,
    setClientInfo,
    globalDiscountPercent,
    setGlobalDiscount,
    getTotals
  } = useCartStore();

  const { isSellerLoggedIn } = useSellerStore();
  const totals = getTotals();

  const handleGlobalDiscountChange = (val: number) => {
    triggerHaptic(10);
    setGlobalDiscount(val);
  };

  return (
    <div className="space-y-4">
      {/* Client Information Form */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dados do Cliente / Solicitante</span>
        </h4>

        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Nome do Cliente / Empresa:
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={clientInfo.nome}
                onChange={(e) => setClientInfo({ nome: e.target.value })}
                placeholder="Ex: Fazenda Boa Esperança / João Silva"
                className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                CPF / CNPJ ou Cidade:
              </label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={clientInfo.doc}
                  onChange={(e) => setClientInfo({ doc: e.target.value })}
                  placeholder="Doc ou Cidade/UF"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                WhatsApp do Cliente:
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={clientInfo.telefone}
                  onChange={(e) => setClientInfo({ telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Breakdown (Seller Mode) */}
      {isSellerLoggedIn ? (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resumo Financeiro da Proposta</span>
          </h4>

          {/* Subtotals */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal Tabela (Bruto):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(totals.subtotalItensSemDesconto)}
              </span>
            </div>

            {totals.descontoTotalItens > 0 && (
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>Desconto nos Itens:</span>
                <span className="font-mono font-bold">
                  - {formatCurrency(totals.descontoTotalItens)}
                </span>
              </div>
            )}

            {/* Global Discount Control */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Desconto Global no Pedido:
                  </span>
                  <p className="text-[10px] text-slate-400">
                    (Aplica apenas sobre {totals.qtdTiposSemDesconto} itens sem desconto)
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={globalDiscountPercent || ''}
                    onChange={(e) => handleGlobalDiscountChange(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-14 py-1 px-2 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-500">%</span>
                </div>
              </div>

              {totals.valorDescontoGlobal > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>Valor do Desconto Global:</span>
                  <span className="font-mono font-bold">
                    - {formatCurrency(totals.valorDescontoGlobal)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Total Savings Highlight Banner */}
          {totals.economiaTotalReal > 0 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 block">
                    Economia Total do Cliente:
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {totals.percentualEconomiaTotal.toFixed(1)}% de desconto total
                  </span>
                </div>
              </div>
              <span className="font-mono font-black text-sm text-emerald-800 dark:text-emerald-300">
                {formatCurrency(totals.economiaTotalReal)}
              </span>
            </div>
          )}

          {/* Total Net Price */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Líquido do Pedido:
              </span>
              <span className="text-[11px] text-slate-500">
                {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'} adicionados
              </span>
            </div>
            <span className="font-mono font-black text-xl sm:text-2xl text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totals.totalFinalLiquido)}
            </span>
          </div>
        </div>
      ) : (
        /* Client summary (Without Prices by default) */
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Total de Produtos:
              </h5>
              <p className="text-[11px] text-slate-500">
                Pronto para envio e cotação oficial
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
