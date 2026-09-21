import React, { useState } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import {
  ShieldAlert,
  Clock,
  CloudRain,
  Dog,
  Plus,
  Check,
  Share2,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useCatalogStore();
  const { items, addToCart } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'guia' | 'seguranca' | 'alvos'>('guia');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;

  const cartItem = items.find((i) => i.id === selectedProduct.id);
  const isInCart = !!cartItem;

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
            {selectedProduct.referencia}
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
            <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
              <img
                src={selectedProduct.imagens[selectedImageIndex] || selectedProduct.imagens[0]}
                alt={selectedProduct.nome}
                className="max-h-full object-contain"
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {selectedProduct.nome}
            </h2>

            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 leading-snug">
              {selectedProduct.o_que_faz}
            </p>

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
              <Stepper value={qty} onChange={setQty} size="md" />
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                  isInCart
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
                    : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white'
                }`}
              >
                {isInCart ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                <span>{isInCart ? `${cartItem.quantidade} no pedido` : 'Adicionar ao Orçamento'}</span>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('guia');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'guia'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Guia & Aplicação</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('seguranca');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'seguranca'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Segurança & EPIs</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(10);
              setActiveTab('alvos');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'alvos'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pragas & Detalhes</span>
          </button>
        </div>

        {/* Tab 1: Guia Prático */}
        {activeTab === 'guia' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedProduct.para_que_serve && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  🎯 Para que serve:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedProduct.para_que_serve}
                </p>
              </div>
            )}

            {selectedProduct.como_age && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  ⚡ Como age:
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedProduct.como_age}
                </p>
              </div>
            )}

            {selectedProduct.como_usar && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                  🧪 Modo de Usar / Diluição:
                </h4>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedProduct.como_usar}
                </p>
              </div>
            )}

            {selectedProduct.onde_nao_usar && (
              <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    Onde NÃO usar (Atenção):
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed mt-0.5">
                    {selectedProduct.onde_nao_usar}
                  </p>
                </div>
              </div>
            )}

            {selectedProduct.rendimento && (
              <div className="text-xs text-slate-500 font-medium">
                💡 <strong>Rendimento:</strong> {selectedProduct.rendimento}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Segurança & EPIs */}
        {activeTab === 'seguranca' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Dog className="w-4 h-4 text-amber-500" />
                <span>Pets & Crianças</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProduct.seguranca?.pets || 'Aguardar a secagem completa antes do retorno.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>Chuva & Carência</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProduct.seguranca?.chuva || 'Necessita de 2h sem chuva para absorção.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Melhor Horário</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProduct.seguranca?.horario || 'Aplicar nas horas mais frescas do dia.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <ShieldAlert className="w-4 h-4 text-indigo-500" />
                <span>EPIs Obrigatórios</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProduct.seguranca?.epi || 'Luvas de borracha, máscara e botas.'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Pragas & Características */}
        {activeTab === 'alvos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedProduct.alvos && selectedProduct.alvos.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  🪳 Pragas / Alvos Controlados:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.alvos.map((alvo, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      {alvo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.caracteristicas && selectedProduct.caracteristicas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  ✨ Características & Embalagem:
                </h4>
                <ul className="space-y-1.5">
                  {selectedProduct.caracteristicas.map((carac, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
