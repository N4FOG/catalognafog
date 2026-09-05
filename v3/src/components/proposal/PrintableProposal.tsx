import React from 'react';
import type { CartItem, CartTotals, ClientInfo } from '../../types/cart';
import { formatCurrency } from '../../utils/formatters';

interface PrintableProposalProps {
  proposalNumber: string;
  dateTime: string;
  clientInfo: ClientInfo;
  sellerName: string;
  sellerPhone: string;
  items: CartItem[];
  totals: CartTotals;
  showPrices: boolean;
  paymentTerms?: string;
  validityDays?: string;
}

export const PrintableProposal: React.FC<PrintableProposalProps> = ({
  proposalNumber,
  dateTime,
  clientInfo,
  sellerName,
  sellerPhone,
  items,
  totals,
  showPrices,
  paymentTerms = 'A Combinar / Faturamento Boleto Bancário',
  validityDays = '10 dias a contar da data de emissão'
}) => {
  return (
    <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 font-sans text-xs sm:text-sm">
      <div className="flex items-center justify-between pb-5 border-b-2 border-emerald-900 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-black text-2xl print:bg-emerald-900 print:text-white shrink-0">
            🌿
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl text-emerald-950 tracking-tight leading-tight">
              JCV QUÍMICA & AGRO
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Rawell Química • Indústria e Comércio de Defensivos & Adjuvantes
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-lg font-mono font-black text-sm">
            {proposalNumber}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Emissão: {dateTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Cliente / Destinatário:
          </h4>
          <p className="font-bold text-slate-900 text-sm">
            {clientInfo.nome || 'Cliente / Empresa Não Informado'}
          </p>
          <p className="text-slate-600">Doc / Cidade: {clientInfo.doc || 'Não informado'}</p>
          {clientInfo.telefone && <p className="text-slate-600">Contato: {clientInfo.telefone}</p>}
        </div>

        <div className="space-y-1 sm:text-right">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            Representante Responsável:
          </h4>
          <p className="font-bold text-slate-900 text-sm">{sellerName}</p>
          <p className="text-slate-600">WhatsApp / Central: {sellerPhone}</p>
          <p className="text-slate-500 text-[11px]">Canal Oficial JCV Química 2026</p>
        </div>
      </div>

      <div className="py-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 rounded-l-lg">Item</th>
              <th className="py-2.5 px-3">Ref</th>
              <th className="py-2.5 px-3">Produto / Especificação</th>
              <th className="py-2.5 px-3 text-center">Qtd</th>
              {showPrices && (
                <>
                  <th className="py-2.5 px-3 text-right">Tabela</th>
                  <th className="py-2.5 px-3 text-right">Desc.</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Total Líquido</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item, idx) => {
              const unitPrice = item.preco_unitario || item.preco_base || 0;
              const disc = item.desconto_percent || 0;
              const lineTotal = item.quantidade * unitPrice * (1 - disc / 100);

              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{item.referencia}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900">{item.nome}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {item.quantidade} {item.unidade || 'un'}
                  </td>
                  {showPrices && (
                    <>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {formatCurrency(unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">
                        {disc > 0 ? `${disc}%` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(lineTotal)}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showPrices && (
        <div className="py-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-600 max-w-sm">
            <h5 className="font-bold text-slate-900 uppercase text-[10px]">
              Condições Comerciais:
            </h5>
            <p>• <strong>Pagamento:</strong> {paymentTerms}</p>
            <p>• <strong>Validade:</strong> {validityDays}</p>
            <p>• <strong>Entrega / Despacho:</strong> A combinar com o representante</p>
          </div>

          <div className="w-full sm:w-72 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Tabela:</span>
              <span className="font-mono font-bold">{formatCurrency(totals.subtotalItensSemDesconto)}</span>
            </div>

            {totals.descontoTotalItens > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Descontos em Itens:</span>
                <span className="font-mono font-bold">- {formatCurrency(totals.descontoTotalItens)}</span>
              </div>
            )}

            {totals.valorDescontoGlobal > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Desconto Global ({totals.discGlobalPercent}%):</span>
                <span className="font-mono font-bold">- {formatCurrency(totals.valorDescontoGlobal)}</span>
              </div>
            )}

            {totals.economiaTotalReal > 0 && (
              <div className="flex justify-between text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-bold">
                <span>Economia Total:</span>
                <span className="font-mono">{formatCurrency(totals.economiaTotalReal)} ({totals.percentualEconomiaTotal.toFixed(1)}%)</span>
              </div>
            )}

            <div className="pt-2 border-t-2 border-emerald-900 flex justify-between items-baseline text-sm">
              <span className="font-extrabold text-emerald-950 uppercase">Total Líquido:</span>
              <span className="font-mono font-black text-lg text-emerald-800">
                {formatCurrency(totals.totalFinalLiquido)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-8 mt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-[10px] text-slate-500">
        <div>
          <div className="border-b border-slate-400 w-4/5 mx-auto mb-1"></div>
          <p className="font-bold text-slate-700">{sellerName}</p>
          <p>JCV Química / Rawell Química</p>
        </div>

        <div>
          <div className="border-b border-slate-400 w-4/5 mx-auto mb-1"></div>
          <p className="font-bold text-slate-700">{clientInfo.nome || 'Assinatura do Cliente'}</p>
          <p>De Acordo com a Proposta</p>
        </div>
      </div>
    </div>
  );
};
