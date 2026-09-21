import React, { useEffect, useMemo, useState } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { PrintableProposal } from './PrintableProposal';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Printer, Share2, DollarSign, FileText } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';
import type { QuoteHistoryItem } from '../../types/seller';

export const ProposalModal: React.FC = () => {
  const {
    isProposalModalOpen,
    closeProposalModal,
    proposalMode
  } = useCatalogStore();

  const { items, clientInfo, getTotals } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller, saveQuoteToHistory } = useSellerStore();
  const { addToast } = useToastStore();

  const [showPrices, setShowPrices] = useState(proposalMode === 'with_prices');
  const totals = getTotals();
  const seller = getActiveSeller();

  const proposalNumber = useMemo(() => {
    return 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);
  }, [isProposalModalOpen]);

  const { full: currentDateTime } = formatDateTime();

  useEffect(() => {
    setShowPrices(proposalMode === 'with_prices');
  }, [proposalMode]);

  // Save to history and trigger telemetry on open
  useEffect(() => {
    if (isProposalModalOpen && items.length > 0) {
      const quoteItem: QuoteHistoryItem = {
        id: proposalNumber,
        data: currentDateTime,
        timestamp: Date.now(),
        cliente: clientInfo.nome || 'Cliente Não Informado',
        doc: clientInfo.doc || 'Não informado',
        vendedorId: seller.id,
        vendedorNome: seller.nome,
        itens: items,
        totalQtd: totals.totalQtd,
        valorTotal: isSellerLoggedIn && showPrices ? formatCurrency(totals.totalFinalLiquido) : '',
        subtotalItensSemDesconto: totals.subtotalItensSemDesconto,
        subtotalItensComDesconto: totals.subtotalItensComDesconto,
        descontoTotalItens: totals.descontoTotalItens,
        discGlobalPercent: totals.discGlobalPercent,
        valorDescontoGlobal: totals.valorDescontoGlobal,
        totalFinalLiquido: totals.totalFinalLiquido,
        economiaTotalReal: totals.economiaTotalReal,
        percentualEconomiaTotal: totals.percentualEconomiaTotal,
        status: 'aguardando'
      };

      saveQuoteToHistory(quoteItem);

      sendTelemetry({
        evento: showPrices ? 'Geração de Proposta PDF COM PREÇO' : 'Geração de Proposta PDF SEM PREÇO',
        num_proposta: proposalNumber,
        cliente_nome: clientInfo.nome,
        cliente_doc: clientInfo.doc,
        total_itens: totals.totalQtd,
        valor_total: isSellerLoggedIn && showPrices ? formatCurrency(totals.totalFinalLiquido) : '-',
        resumo_itens: items.map((i) => `${i.quantidade}x ${i.nome}`).join(', '),
        detalhes_extras: `Total Líquido: R$ ${totals.totalFinalLiquido.toFixed(2)} | Economia: R$ ${totals.economiaTotalReal.toFixed(2)}`
      });
    }
  }, [isProposalModalOpen]);

  if (!isProposalModalOpen) return null;

  const handlePrint = () => {
    triggerHaptic(20);
    window.print();
  };

  const handleShare = async () => {
    triggerHaptic(15);
    const summaryText = `📄 *Proposta Comercial JCV Química (${proposalNumber})*\nCliente: ${clientInfo.nome || 'Não informado'}\nItens: ${totals.totalQtd} produtos\n${showPrices ? `Valor: ${formatCurrency(totals.totalFinalLiquido)}` : ''}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Proposta JCV Química - ${proposalNumber}`,
          text: summaryText,
          url: window.location.href
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(`${summaryText}\n${window.location.href}`);
    addToast('📋 Link e resumo copiados!', 'info');
  };

  return (
    <Modal
      isOpen={isProposalModalOpen}
      onClose={closeProposalModal}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">
            Proposta Comercial Timbrada ({proposalNumber})
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="no-print flex items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex-wrap">
          {isSellerLoggedIn && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setShowPrices(true);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  showPrices
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Com Preços</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(10);
                  setShowPrices(false);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  !showPrices
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Sem Preços</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleShare}
              className="py-2 px-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

        <div id="printable-proposal-area">
          <PrintableProposal
            proposalNumber={proposalNumber}
            dateTime={currentDateTime}
            clientInfo={clientInfo}
            sellerName={seller.nome}
            sellerPhone={seller.whatsapp}
            items={items}
            totals={totals}
            showPrices={showPrices}
          />
        </div>
      </div>
    </Modal>
  );
};
