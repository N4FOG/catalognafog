import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { triggerHaptic } from '../../utils/haptics';
import { sendTelemetry } from '../../utils/telemetry';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { CONFIG, VENDEDORES } from '../../data/config';
import {
  X,
  Trash2,
  FileCheck,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export const CartDrawer: React.FC = () => {
  const {
    items,
    clientInfo,
    paymentTerms,
    validityDays,
    isCartOpen,
    setIsCartOpen,
    clearCart,
    getTotals,
    generateCartShareUrl
  } = useCartStore();

  const { isSellerLoggedIn, getActiveSeller, saveQuoteToHistory } = useSellerStore();
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

  const handleSendDirectWhatsApp = (includePrices: boolean) => {
    triggerHaptic(25);

    const basePhone = '554599781407';
    let targetPhone = basePhone;
    if (clientInfo.vendedor) {
      const v = VENDEDORES.find((vend) => vend.id === clientInfo.vendedor);
      if (v?.whatsapp) targetPhone = v.whatsapp;
    } else if (activeSeller?.whatsapp) {
      targetPhone = activeSeller.whatsapp;
    } else if (CONFIG.whatsapp) {
      targetPhone = CONFIG.whatsapp;
    }

    const { data: dateStr, hora: timeStr } = formatDateTime();
    const orcNum = 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);
    const shareUrl = generateCartShareUrl(includePrices);

    let msg = `🌿 *${CONFIG.empresa || 'JCV Jardinagem — Catálogo de Produtos 2026'}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += includePrices
      ? `📋 *PROPOSTA COMERCIAL (Nº ${orcNum})*\n`
      : `📋 *SOLICITAÇÃO DE COTAÇÃO (Nº ${orcNum})*\n`;
    msg += `📅 *Data:* ${dateStr} às ${timeStr}\n\n`;

    if (clientInfo.nome) {
      msg += `👤 *Cliente:* ${clientInfo.nome}\n`;
    }
    if (isSellerLoggedIn || activeSeller?.id) {
      msg += `👔 *Representante:* ${activeSeller?.nome || 'JCV Jardinagem'}\n`;
    } else if (clientInfo.vendedor) {
      const vendObj = VENDEDORES.find((v) => v.id === clientInfo.vendedor);
      if (vendObj) {
        msg += `👔 *Vendedor Selecionado:* ${vendObj.nome}\n`;
      }
    }
    if (clientInfo.doc) {
      msg += `📍 *CNPJ / Cidade:* ${clientInfo.doc}\n`;
    }

    msg += `\n📦 *ITENS (${totals.totalQtd} ${totals.totalQtd === 1 ? 'item' : 'itens'}):*\n`;
    items.forEach((item, idx) => {
      const pUnit = item.preco_unitario || item.preco_base || 0;
      const discItemPercent = item.desconto_percent || 0;
      const pUnitDesc = pUnit * (1 - discItemPercent / 100);
      const subtotalItem = item.quantidade * pUnitDesc;

      msg += `*${idx + 1}. ${item.nome}*\n`;
      msg += `   • Ref: \`${item.referencia}\`\n`;
      msg += `   • Quantidade: *${item.quantidade} ${item.unidade || 'unidade'}(s)*\n`;

      if (includePrices && pUnit > 0) {
        if (discItemPercent > 0) {
          msg += `   • Valor Unit.: ${formatCurrency(pUnit)}\n`;
          msg += `   • Desconto no Item: *${discItemPercent.toFixed(1)}%* (-${formatCurrency(pUnit * (discItemPercent / 100))}/un)\n`;
          msg += `   • Unit. c/ Desc.: *${formatCurrency(pUnitDesc)}* (Subtotal: *${formatCurrency(subtotalItem)}*)\n`;
        } else {
          msg += `   • Valor Unit.: ${formatCurrency(pUnit)} (Subtotal: ${formatCurrency(subtotalItem)})\n`;
        }
      }
      msg += `\n`;
    });

    if (includePrices) {
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `💰 *Subtotal dos Produtos:* ${formatCurrency(totals.subtotalItensSemDesconto)}\n`;
      if (totals.descontoTotalItens > 0.01) {
        msg += `🏷️ *Descontos nos Produtos:* -${formatCurrency(totals.descontoTotalItens)}\n`;
        msg += `📦 *Subtotal c/ Desc. dos Itens:* ${formatCurrency(totals.subtotalItensComDesconto)}\n`;
      }
      if (totals.discGlobalPercent > 0 && totals.valorDescontoGlobal > 0) {
        msg += `🏷️ *Desconto no Pedido (${totals.discGlobalPercent}%):* -${formatCurrency(totals.valorDescontoGlobal)}\n`;
      }
      if (totals.economiaTotalReal > 0.01) {
        msg += `🎉 *ECONOMIA TOTAL DO CLIENTE:* *${formatCurrency(totals.economiaTotalReal)} (${totals.percentualEconomiaTotal.toFixed(1)}% OFF)*\n`;
      }
      msg += `💳 *TOTAL LÍQUIDO DA PROPOSTA:* *${formatCurrency(totals.totalFinalLiquido)}*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

      if (paymentTerms) {
        msg += `💳 *Condição de Pagamento:* ${paymentTerms}\n`;
      }
      if (validityDays) {
        msg += `📅 *Validade da Proposta:* ${validityDays}\n`;
      }
      msg += `\n`;

      if (isSellerLoggedIn) {
        saveQuoteToHistory({
          id: orcNum,
          data: `${dateStr} às ${timeStr}`,
          timestamp: Date.now(),
          cliente: clientInfo.nome || 'Cliente',
          doc: clientInfo.doc || '',
          vendedorId: activeSeller.id,
          vendedorNome: activeSeller.nome,
          itens: items.map((i) => ({
            id: i.id,
            nome: i.nome,
            referencia: i.referencia,
            unidade: i.unidade,
            imagem: i.imagem,
            quantidade: i.quantidade,
            preco_base: i.preco_base || 0,
            preco_unitario: i.preco_unitario || i.preco_base || 0,
            desconto_percent: i.desconto_percent || 0
          })),
          totalQtd: totals.totalQtd,
          valorTotal: formatCurrency(totals.totalFinalLiquido),
          subtotalItensSemDesconto: totals.subtotalItensSemDesconto,
          subtotalItensComDesconto: totals.subtotalItensComDesconto,
          descontoTotalItens: totals.descontoTotalItens,
          baseItensSemDesconto: totals.baseItensSemDesconto,
          discGlobalPercent: totals.discGlobalPercent,
          valorDescontoGlobal: totals.valorDescontoGlobal,
          totalFinalLiquido: totals.totalFinalLiquido,
          economiaTotalReal: totals.economiaTotalReal,
          percentualEconomiaTotal: totals.percentualEconomiaTotal,
          status: 'aguardando',
          shareUrl: shareUrl
        });
      }
    }

    msg += `🔗 *Abrir / Recomprar este pedido no Catálogo:*\n${shareUrl}\n\n`;
    msg += `${CONFIG.mensagem_fim || '✅ Aguardo retorno sobre disponibilidade e condições de fornecimento. Obrigado!'}`;

    sendTelemetry({
      evento: includePrices ? 'Envio Direto WhatsApp Vendedor' : 'Envio Direto WhatsApp Cliente',
      num_proposta: orcNum,
      cliente_nome: clientInfo.nome || 'Cliente',
      cliente_doc: clientInfo.doc,
      total_itens: totals.totalQtd,
      valor_total: includePrices ? formatCurrency(totals.totalFinalLiquido) : '-',
      resumo_itens: items.map((i) => `${i.quantidade}x ${i.nome}`).join(', '),
      detalhes_extras: `Direcionado automaticamente para o WhatsApp base: ${targetPhone}`
    });

    const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    addToast(includePrices ? `📲 Abrindo WhatsApp para envio da proposta...` : `📲 Abrindo WhatsApp para cotação...`, 'success');
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

          {/* Body Content (Apenas Lista de Produtos - Fidelidade 100% V2) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 overscroll-contain">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  <span>Ver Catálogo de Produtos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Header bar of items list */}
                <div className="flex items-center justify-between pb-1.5 text-xs border-b border-slate-200/60 dark:border-slate-800/80">
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    📦 {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'} no orçamento
                  </span>
                  <button
                    onClick={handleClear}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <span>🗑️</span> Limpar Orçamento
                  </button>
                </div>

                {/* List of Cart Items */}
                <div className="cart-items-wrap space-y-2.5">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Action Bar (Totalizador Vendedor + Dados Cliente + Ações de Envio - Fidelidade 100% V2) */}
          {items.length > 0 && (
            <div className="cart-footer-bar p-3 sm:p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0 shadow-xl max-h-[75vh] overflow-y-auto overscroll-contain">
              {/* Totalizador Vendedor & Card de Dados do Cliente */}
              <CartSummary />

              {/* Summary line (para cliente normal sem login) */}
              {!isSellerLoggedIn && (
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 px-1 pt-0.5">
                  <span>Total Selecionado:</span>
                  <strong className="text-sm font-black text-emerald-800 dark:text-emerald-400">
                    {totals.totalQtd} {totals.totalQtd === 1 ? 'item' : 'itens'}
                  </strong>
                </div>
              )}

              <div className="cart-share-actions-wrap space-y-2" id="cart-share-actions-wrap">
                {isSellerLoggedIn ? (
                  /* Seller Action Options */
                  <>
                    {/* Primary Button 1: Gerar Proposta Oficial */}
                    <button
                      type="button"
                      onClick={() => handleOpenProposal('with_prices')}
                      className="w-full h-11.5 sm:h-12 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <FileCheck className="w-4.5 h-4.5" />
                      <span>Gerar Proposta Oficial (Com Preços)</span>
                    </button>

                    {/* Primary Button 2: WhatsApp Vendedor (Envio Direto) */}
                    <button
                      type="button"
                      onClick={() => handleSendDirectWhatsApp(true)}
                      className="btn-send-whatsapp w-full h-11.5 sm:h-12 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/40 active:scale-98 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                      <span>Enviar Cotação pelo WhatsApp</span>
                    </button>

                    {/* Sanfona de Opções Secundárias */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          setIsSecondaryExpanded(!isSecondaryExpanded);
                        }}
                        className="btn-toggle-cart-actions w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-[#14281f] flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        <span>
                          {isSecondaryExpanded ? 'Ocultar opções de envio' : '⚡ Mais Opções de Envio (PDF, Links, Whats)'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isSecondaryExpanded ? '▲' : '▼'}
                        </span>
                      </button>

                      {isSecondaryExpanded && (
                        <div className="p-2.5 bg-white dark:bg-slate-900 space-y-2.5 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
                          {/* Par 1: WhatsApp Direto */}
                          <div className="space-y-1">
                            <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500 block">
                              📱 WhatsApp Direto p/ Cliente:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenWhatsApp('with_prices')}
                                className="h-9.5 px-2 rounded-lg bg-[#25D366]/10 text-[#0b733a] dark:text-[#25d366] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#25D366]/40 hover:bg-[#25D366]/20 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>💬</span>
                                <span>Whats c/ Preço</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenWhatsApp('without_prices')}
                                className="h-9.5 px-2 rounded-lg bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-[#25D366] hover:bg-slate-100 dark:hover:bg-slate-750 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>💬</span>
                                <span>Whats s/ Preço</span>
                              </button>
                            </div>
                          </div>

                          {/* Par 2: Proposta em PDF */}
                          <div className="space-y-1">
                            <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500 block">
                              📄 Proposta Comercial em PDF:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenProposal('with_prices')}
                                className="h-9.5 px-2 rounded-lg bg-[#0f4531]/10 text-[#0f4531] dark:text-[#34d399] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#0f4531]/30 dark:border-[#34d399]/35 hover:bg-[#0f4531]/15 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>📄</span>
                                <span>PDF c/ Preço</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenProposal('without_prices')}
                                className="h-9.5 px-2 rounded-lg bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-[#10b981] hover:bg-slate-100 dark:hover:bg-slate-750 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>📄</span>
                                <span>PDF s/ Preço</span>
                              </button>
                            </div>
                          </div>

                          {/* Par 3: Links Diretos do Catálogo */}
                          <div className="space-y-1">
                            <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500 block">
                              🔗 Links Diretos do Catálogo:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(true)}
                                className="h-9.5 px-2 rounded-lg bg-[#10b981]/10 text-[#059669] dark:text-[#34d399] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#10b981]/35 hover:bg-[#10b981]/20 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>💰</span>
                                <span>Link c/ Preço</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(false)}
                                className="h-9.5 px-2 rounded-lg bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-[#10b981] hover:bg-slate-100 dark:hover:bg-slate-750 transition-all active:scale-98 cursor-pointer"
                              >
                                <span>🔗</span>
                                <span>Link s/ Preço</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Client Action Options (Fidelidade 100% V2 - Direcionamento Direto WhatsApp Base) */
                  <>
                    {/* Botão Principal WhatsApp */}
                    <button
                      type="button"
                      onClick={() => handleSendDirectWhatsApp(false)}
                      className="btn-send-whatsapp w-full h-11.5 sm:h-12 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/40 active:scale-98 transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                      <span>Enviar Cotação pelo WhatsApp</span>
                    </button>

                    {/* Sanfona de Opções Secundárias (Cliente) */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(10);
                          setIsSecondaryExpanded(!isSecondaryExpanded);
                        }}
                        className="btn-toggle-cart-actions w-full h-9 px-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <span>
                          {isSecondaryExpanded ? 'Ocultar opções' : '⚡ Mais Opções (PDF / Link)'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isSecondaryExpanded ? '▲' : '▼'}
                        </span>
                      </button>

                      {isSecondaryExpanded && (
                        <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenProposal('without_prices')}
                              className="h-9.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all cursor-pointer"
                            >
                              <span>📄</span>
                              <span>Visualizar PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyLink(false)}
                              className="h-9.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 hover:border-emerald-600 transition-all cursor-pointer"
                            >
                              <span>🔗</span>
                              <span>Copiar Link</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

