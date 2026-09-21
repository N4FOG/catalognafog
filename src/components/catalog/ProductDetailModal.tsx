import React, { useState } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { CATEGORIAS, FORMULACOES } from '../../data/categories';
import { Modal } from '../ui/Modal';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Plus, Check, Share2, AlertTriangle, Wrench, Clock, ArrowRight } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useCatalogStore();
  const { items, addToCart } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'guia' | 'aplicacao' | 'seguranca' | 'alvos'>('guia');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;

  const cartItem = items.find((i) => i.id === selectedProduct.id);
  const isInCart = !!cartItem;
  const catObj = CATEGORIAS.find((c) => c.id === selectedProduct.categoria);
  const formObj = FORMULACOES.find((f) => f.id === selectedProduct.tipo_formulacao);

  // Controle de estoque - padrão é true se não especificado
  const isInStock = selectedProduct.emEstoque !== false;

  const handleClose = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setActiveTab('guia');
  };

  const handleAddToCart = () => {
    triggerHaptic(20);
    addToCart(selectedProduct, qty);
    addToast(`✅ ${selectedProduct.nome} adicionado ao orçamento!`, 'success');

    const seller = getActiveSeller();
    sendTelemetry({
      evento: 'Adicionou via Ficha Técnica',
      vendedor: seller.nome,
      vendedor_nome: seller.nome,
      total_itens: qty,
      resumo_itens: `${qty}x ${selectedProduct.nome}`
    });
  };

  const handleShare = async () => {
    triggerHaptic(15);
    const text = `🌿 *${selectedProduct.nome}* (${selectedProduct.referencia})\n${selectedProduct.o_que_faz}\n\nConsulte detalhes no catálogo oficial JCV Química!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedProduct.nome,
          text: text,
          url: window.location.href
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    addToast('📋 Link e dados copiados para a área de transferência!', 'info');
  };

  return (
    <Modal
      isOpen={!!selectedProduct}
      onClose={handleClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            CÓDIGO: {selectedProduct.referencia}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {selectedProduct.categoria}
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Product Hero Info (Image + Title + Price + CTA) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Gallery Media */}
          <div className="sm:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner relative">
              {/* Badge Sem Estoque */}
              {!isInStock && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                  🚫 Sem Estoque
                </div>
              )}
              
              <img
                src={selectedProduct.imagens[selectedImageIndex] || selectedProduct.imagens[0]}
                alt={selectedProduct.nome}
                className={`max-h-full object-contain ${!isInStock ? 'grayscale opacity-50' : ''}`}
              />
            </div>

            {/* Thumbnail dots/selectors if multiple */}
            {selectedProduct.imagens.length > 1 && (
              <div className="flex items-center gap-2 mt-2">
                {selectedProduct.imagens.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-10 h-10 rounded-lg p-0.5 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 scale-105'
                        : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info & Actions */}
          <div className="sm:col-span-7 space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight font-display">
                {selectedProduct.nome}
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {!isInStock && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300 border-2 border-red-300 dark:border-red-800">
                    🚫 FORA DE ESTOQUE
                  </span>
                )}
                {selectedProduct.destaque && isInStock && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    ⭐ Mais Vendido
                  </span>
                )}
                {catObj && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/80 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                    {catObj.icone} {catObj.nome}
                  </span>
                )}
                {formObj && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100/80 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60 dark:border-blue-800">
                    {formObj.icone} {formObj.nome}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2 bg-emerald-50/80 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 leading-snug">
              <span className="text-base shrink-0">⚡</span>
              <div>
                <strong className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">Função Principal:</strong>
                <span className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {selectedProduct.o_que_faz || selectedProduct.descricao}
                </span>
              </div>
            </div>

            {/* Price Box */}
            {isSellerLoggedIn && (
              <div className="flex items-baseline gap-2 bg-slate-100 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Preço de Tabela:
                </span>
                <span className="font-mono font-black text-2xl text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(selectedProduct.preco_base)}
                </span>
                <span className="text-xs text-slate-500">/{selectedProduct.unidade}</span>
              </div>
            )}

            {/* Stepper + Add to Cart + Share */}
            <div className="flex items-center gap-2 pt-2">
              <Stepper value={qty} onChange={setQty} size="md" disabled={!isInStock} />
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                  !isInStock
                    ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60'
                    : isInCart
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
                    : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white'
                }`}
              >
                {!isInStock ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Produto Indisponível</span>
                  </>
                ) : isInCart ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{cartItem.quantidade} no pedido</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Adicionar ao Orçamento</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Compartilhar"
                aria-label="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Segmented Control Pill Bar - Fidelidade V2) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 my-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('guia');
            }}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${
              activeTab === 'guia'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            📖 Guia Prático
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('aplicacao');
            }}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${
              activeTab === 'aplicacao'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300'
            }`}
          >
            🚜 Aplicação
            {selectedProduct.manual_aplicacao && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                activeTab === 'aplicacao'
                  ? 'bg-emerald-800 text-emerald-100 dark:bg-emerald-700'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                Manual
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('seguranca');
            }}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${
              activeTab === 'seguranca'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            🛡️ Segurança
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('alvos');
            }}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all ${
              activeTab === 'alvos'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            🎯 Alvos ({selectedProduct.alvos?.length || 0})
          </button>
        </div>

        {/* Tab 1: Guia Prático Consultivo (Fidelidade V2) */}
        {activeTab === 'guia' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Card Unificado: Finalidade & Como Age */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-400 font-display flex items-center gap-1.5 mb-1">
                  🎯 Finalidade & Modo de Ação
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedProduct.para_que_serve || selectedProduct.descricao}
                </p>
              </div>

              {selectedProduct.como_age && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2">
                  <span className="text-xs shrink-0 mt-0.5">⚙️</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <strong className="text-slate-800 dark:text-slate-200">Como age & Prazos:</strong>{' '}
                    {selectedProduct.como_age}
                  </p>
                </div>
              )}
            </div>

            {/* Hub de Navegação Direcionadora em Cards */}
            <div className="space-y-2 pt-1 pb-0.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-0.5 font-display flex items-center justify-between">
                <span>⚡ Navegação Rápida do Guia</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Toque para ver detalhes</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* Card 1: Direciona para Aplicação */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setActiveTab('aplicacao');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-white dark:from-emerald-950/60 dark:via-emerald-900/30 dark:to-slate-900 border border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all active:scale-[0.99] group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        🚜
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-display group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            Como Aplicar & Dosagem
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                            {selectedProduct.manual_aplicacao ? 'Manual Passo a Passo' : 'Instruções'}
                          </span>
                        </div>
                        {/*
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                          {selectedProduct.manual_aplicacao
                            ? `Dose: ${selectedProduct.manual_aplicacao.dosagem.pequena_area.dose} • ${selectedProduct.manual_aplicacao.dosagem.area_total.cobertura}`
                            : selectedProduct.como_usar || 'Preparo da calda, dosagem por litro e pulverização.'}
                        </p>
                        */}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* Card 2: Direciona para Segurança */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setActiveTab('seguranca');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white dark:from-blue-950/50 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200/80 dark:border-blue-800/70 hover:border-blue-400 dark:hover:border-blue-600 transition-all active:scale-[0.99] group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        🛡️
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-display group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            Segurança, Pets & Reentrada
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                            Protocolo
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                          🐶 Pets: {selectedProduct.seguranca?.pets?.slice(0, 30) || '2h pós-secagem'}... • 🌧️ Chuva • 🛡️ EPIs
                        </p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0 group-hover:translate-x-0.5 transition-transform shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* Card 3: Direciona para Alvos */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setActiveTab('alvos');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-white dark:from-amber-950/50 dark:via-orange-950/30 dark:to-slate-900 border border-amber-200/80 dark:border-amber-800/70 hover:border-amber-400 dark:hover:border-amber-600 transition-all active:scale-[0.99] group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center text-base shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        🎯
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-display group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            Pragas & Alvos Combatidos
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                            {selectedProduct.alvos?.length || 0} Alvos
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5 font-medium">
                          {selectedProduct.alvos && selectedProduct.alvos.length > 0
                            ? `${selectedProduct.alvos.slice(0, 3).join(', ')}${selectedProduct.alvos.length > 3 ? ` e mais ${selectedProduct.alvos.length - 3}...` : ''}`
                            : 'Ver lista completa de pragas e ervas invasoras.'}
                        </p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform shadow-2xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Alerta de Cuidado / O que NÃO fazer */}
            {selectedProduct.onde_nao_usar && (
              <div className="bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 border-l-4 border-l-rose-500 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-rose-700 dark:text-rose-400 mb-1.5 font-display">
                  ⚠️ O que você NÃO deve fazer (Atenção)
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {selectedProduct.onde_nao_usar}
                </div>
              </div>
            )}

            {/* Rendimento Prático */}
            {selectedProduct.rendimento && (
              <div className="bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 rounded-xl p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-emerald-900 dark:text-emerald-300 mb-1.5 font-display">
                  📦 Rendimento Esperado
                </div>
                <div className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-bold">
                  {selectedProduct.rendimento}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Aplicação (Manual do Aplicador Especializado) */}
        {activeTab === 'aplicacao' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedProduct.manual_aplicacao ? (
              <>
                {/* Resumo do Aplicador 
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1.5 font-display">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Orientação do Aplicador Técnico
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-950 dark:text-emerald-100 leading-relaxed">
                    {selectedProduct.manual_aplicacao.resumo_aplicador}
                  </p>
                </div>
                */}
                
                {/* 
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2.5 font-display">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    Checklist Obrigatório Antes de Aplicar
                  </div>
                  <ul className="space-y-2">
                    {selectedProduct.manual_aplicacao.checklist_previo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                        <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                


                {/* Passo a Passo Ilustrado */}
                <div className="space-y-2.5">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 font-display">
                    Etapas de Aplicação Passo a Passo
                  </div>
                  {selectedProduct.manual_aplicacao.passos.map((step) => (
                    <div
                      key={step.passo}
                      className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white dark:bg-emerald-600 font-black text-xs flex items-center justify-center shrink-0">
                          {step.passo}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-display">
                          {step.titulo}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                        {step.descricao}
                      </p>
                      {step.dica_do_aplicador && (
                        <div className="ml-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2.5 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-start gap-2">
                          <span className="shrink-0">💡</span>
                          <span><strong>Dica do Aplicador:</strong> {step.dica_do_aplicador}</span>
                        </div>
                      )}
                      {step.alerta && (
                        <div className="ml-8 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-2.5 text-xs text-rose-900 dark:text-rose-200 font-medium flex items-start gap-2">
                          <span className="shrink-0">⚠️</span>
                          <span><strong>Atenção:</strong> {step.alerta}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Equipamentos Recomendados */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-display">
                    <Wrench className="w-4 h-4 text-slate-500" />
                    Equipamentos Recomendados
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.manual_aplicacao.equipamentos.map((eq, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linha do Tempo / O Que Esperar */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-display">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Cronograma de Ação (O Que Esperar)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProduct.manual_aplicacao.linha_do_tempo.map((item, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
                        <span className="text-2xl shrink-0 leading-none">{item.icone || '⏱️'}</span>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                              {item.periodo}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.titulo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                            {item.descricao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Fallback para produtos que ainda não têm o manual completo cadastrado */
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 font-display">
                    🚜 Modo de Aplicação Recomendado
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {selectedProduct.como_usar || 'Consulte as instruções completas no rótulo antes de aplicar.'}
                  </p>
                </div>

                {selectedProduct.onde_nao_usar && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-1.5 font-display">
                      ⚠️ Restrições de Aplicação
                    </div>
                    <p className="text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed font-semibold">
                      {selectedProduct.onde_nao_usar}
                    </p>
                  </div>
                )}

                {selectedProduct.rendimento && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
                    <div className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1 font-display">
                      📦 Rendimento Estimado
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-bold">
                      {selectedProduct.rendimento}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Selos de Segurança & Aplicação (Fidelidade 100% V2) */}
        {activeTab === 'seguranca' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 animate-in fade-in duration-200">
            {/* Card 1: Pets & Família */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="text-2xl leading-none shrink-0">🐶</div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                  Reentrada de Pets & Família
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {selectedProduct.seguranca?.pets || 'Aguardar secagem total (2 horas).'}
                </div>
              </div>
            </div>

            {/* Card 2: Resistência à Chuva */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="text-2xl leading-none shrink-0">🌧️</div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                  Resistência à Chuva / Secagem
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {selectedProduct.seguranca?.chuva || 'Resistente após 2h de aplicação.'}
                </div>
              </div>
            </div>

            {/* Card 3: Horário */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="text-2xl leading-none shrink-0">⏰</div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                  Melhor Horário de Aplicação
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {selectedProduct.seguranca?.horario || 'Horas frescas (após as 16h ou manhã).'}
                </div>
              </div>
            </div>

            {/* Card 4: EPI */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
              <div className="text-2xl leading-none shrink-0">🛡️</div>
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                  EPI & Equipamento
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {selectedProduct.seguranca?.epi || 'Utilizar luvas e máscara.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Alvos & Pragas (Fidelidade V2) */}
        {activeTab === 'alvos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedProduct.alvos && selectedProduct.alvos.length > 0 && (
              <div className="py-1">
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.alvos.map((alvo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                    >
                      <span>🎯</span>
                      <span>{alvo}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.caracteristicas && selectedProduct.caracteristicas.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-display">
                  ✨ Características & Embalagem:
                </h4>
                <ul className="space-y-1.5">
                  {selectedProduct.caracteristicas.map((carac, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{carac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
