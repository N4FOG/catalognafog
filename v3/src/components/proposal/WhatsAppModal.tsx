import React, { useState, useEffect } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Send, Phone, DollarSign, FileText } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

export const WhatsAppModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    closeWhatsAppModal,
    whatsAppMode
  } = useCatalogStore();

  const { items, clientInfo, getTotals } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { addToast } = useToastStore();

  const [showPrices, setShowPrices] = useState(whatsAppMode === 'with_prices');
  const [recipientPhone, setRecipientPhone] = useState(clientInfo.telefone || '');

  const totals = getTotals();
  const seller = getActiveSeller();

  useEffect(() => {
    setShowPrices(whatsAppMode === 'with_prices');
  }, [whatsAppMode]);

  useEffect(() => {
    if (clientInfo.telefone) {
      setRecipientPhone(clientInfo.telefone);
    }
  }, [clientInfo.telefone]);

  if (!isWhatsAppModalOpen) return null;

  const { data: dateStr, hora: timeStr } = formatDateTime();
  const orcNum = 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);

  // Generate formatted WhatsApp message text
  const generateMessage = () => {
    let msg = `🌿 *JCV QUÍMICA & AGRO — COTAÇÃO OFICIAL 2026*\n`;
    msg += `📄 *Proposta:* \`${orcNum}\` | 📅 *Data:* ${dateStr} às ${timeStr}\n`;
    msg += `👔 *Representante:* ${seller.nome}\n`;

    if (clientInfo.nome) {
      msg += `👤 *Cliente:* ${clientInfo.nome}\n`;
    }
    if (clientInfo.doc) {
      msg += `📍 *Doc/Cidade:* ${clientInfo.doc}\n`;
    }

    msg += `\n📦 *ITENS DA COTAÇÃO:*\n`;
    items.forEach((item, idx) => {
      const unitPrice = item.preco_unitario || item.preco_base || 0;
      const disc = item.desconto_percent || 0;
      const totalItem = item.quantidade * unitPrice * (1 - disc / 100);

      msg += `${idx + 1}. *${item.nome}* (${item.referencia})\n`;
      msg += `   ▫️ *Qtd:* ${item.quantidade} ${item.unidade || 'un'}`;

      if (isSellerLoggedIn && showPrices) {
        msg += ` | *Tabela:* ${formatCurrency(unitPrice)}`;
        if (disc > 0) {
          msg += ` | *Desc:* ${disc}%`;
        }
        msg += `\n   ▫️ *Subtotal:* ${formatCurrency(totalItem)}\n`;
      } else {
        msg += `\n`;
      }
    });

    if (isSellerLoggedIn && showPrices) {
      msg += `\n📊 *RESUMO FINANCEIRO:*\n`;
      msg += `▫️ *Subtotal Tabela:* ${formatCurrency(totals.subtotalItensSemDesconto)}\n`;

      if (totals.descontoTotalItens > 0) {
        msg += `▫️ *Desconto em Itens:* -${formatCurrency(totals.descontoTotalItens)}\n`;
      }
      if (totals.valorDescontoGlobal > 0) {
        msg += `▫️ *Desconto Global (${totals.discGlobalPercent}%):* -${formatCurrency(totals.valorDescontoGlobal)}\n`;
      }
      if (totals.economiaTotalReal > 0) {
        msg += `🎉 *ECONOMIA TOTAL:* ${formatCurrency(totals.economiaTotalReal)} (${totals.percentualEconomiaTotal.toFixed(1)}% OFF)\n`;
      }
      msg += `💰 *TOTAL LÍQUIDO:* *${formatCurrency(totals.totalFinalLiquido)}*\n`;
    } else {
      msg += `\n📊 *TOTAL:* ${totals.totalQtd} itens selecionados.\n`;
    }

    msg += `\n✅ Aguardo confirmação para envio e faturamento. Obrigado!`;
    return msg;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(25);

    const rawDigits = recipientPhone.replace(/\D/g, '');
    let targetNumber = rawDigits;

    if (!targetNumber) {
      targetNumber = seller.whatsapp || '554599781407';
    } else if (targetNumber.length <= 11) {
      targetNumber = '55' + targetNumber;
    }

    const message = generateMessage();
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodedText}`;

    sendTelemetry({
      evento: 'Envio de Cotação WhatsApp',
      num_proposta: orcNum,
      cliente_nome: clientInfo.nome || 'Cliente WhatsApp',
      cliente_doc: clientInfo.doc,
      total_itens: totals.totalQtd,
      valor_total: isSellerLoggedIn && showPrices ? formatCurrency(totals.totalFinalLiquido) : '-',
      resumo_itens: items.map((i) => `${i.quantidade}x ${i.nome}`).join(', '),
      detalhes_extras: `Enviado para ${targetNumber} | Modo: ${showPrices ? 'Com Preço' : 'Sem Preço'}`
    });

    window.open(waUrl, '_blank');
    addToast('🚀 WhatsApp aberto para envio!', 'success');
    closeWhatsAppModal();
  };

  return (
    <Modal
      isOpen={isWhatsAppModalOpen}
      onClose={closeWhatsAppModal}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Send className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">Enviar Orçamento via WhatsApp</span>
        </div>
      }
    >
      <form onSubmit={handleSend} className="space-y-4">
        {isSellerLoggedIn && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setShowPrices(true);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                showPrices
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Com Valores e Descontos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                setShowPrices(false);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                !showPrices
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Apenas Lista de Produtos</span>
            </button>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Número de WhatsApp do Destinatário:
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="Ex: (45) 99781-407 ou deixar vazio para Central"
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Se deixar vazio, será enviado diretamente para a Central / Vendedor (<strong>{seller.nome}</strong>).
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Prévia da Mensagem Formatada:
          </label>
          <div className="p-3 bg-slate-100 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700/80 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto text-slate-800 dark:text-slate-200 select-all">
            {generateMessage()}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Abrir no WhatsApp & Enviar</span>
        </button>
      </form>
    </Modal>
  );
};
