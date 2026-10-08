import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { PRODUTOS } from '../../data/products';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Plus, Check, Share2 } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';
import { getProductShareDescription, getProductShareText, getProductUrl } from '../../utils/productUrl';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);

  const { items, addToCart } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { setSelectedProduct } = useCatalogStore();
  const { addToast } = useToastStore();

  // Garante que as variações da base oficial sempre estejam acessíveis
  const baseProd = PRODUTOS.find((p) => p.id === product.id);
  const variacoes = (product.variacoes && product.variacoes.length > 0)
    ? product.variacoes
    : (baseProd?.variacoes && baseProd.variacoes.length > 0 ? baseProd.variacoes : undefined);

  const hasVariations = Boolean(variacoes && variacoes.length > 0);
  const currentVar = hasVariations ? variacoes![selectedVarIndex] : undefined;
  const currentPrice = currentVar ? currentVar.preco_base : (product.preco_base || baseProd?.preco_base || 0);
  const currentRef = currentVar ? currentVar.referencia : (product.referencia || baseProd?.referencia || '');
  const currentImage = currentVar?.imagem || product.imagens?.[0] || baseProd?.imagens?.[0] || 'img/logo.png';

  const cartItem = items.find((i) =>
    currentVar ? (i.id === product.id && i.variationId === currentVar.id) : (i.id === product.id && !i.variationId)
  );
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(20);
    addToCart(product, qty, currentVar);
    const itemName = currentVar ? `${product.nome} (${currentVar.nome})` : product.nome;
    addToast(`✅ ${itemName} adicionado!`, 'success');

    const seller = getActiveSeller();
    sendTelemetry({
      evento: 'Adicionou ao Orçamento (Lista)',
      vendedor: seller.nome,
      vendedor_nome: seller.nome,
      total_itens: qty,
      resumo_itens: `${qty}x ${itemName}`
    });
  };

  const handleClick = () => {
    triggerHaptic(15);
    setSelectedProduct(product);
  };

  const handleQuickShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(15);
    const productUrl = getProductUrl(product);
    const descText = getProductShareDescription(product);
    const fullText = getProductShareText(product);

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.nome,
          text: descText,
          url: productUrl
        });
        return;
      } catch {}
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
        addToast('📋 Link do produto copiado com sucesso!', 'success');
      }
    } catch {
      addToast('Não foi possível copiar o link', 'error');
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-1.5 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
          <img
            src={currentImage}
            alt={product.nome}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'img/logo.png';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentRef}
            </span>

            {/* Custom Badge na lista */}
            {(product.badge_texto || product.destaque) && (
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-sm ${
                  product.badge_tipo === 'lancamento'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                    : product.badge_tipo === 'mais_vendido'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                    : product.badge_tipo === 'natural'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                    : product.badge_tipo === 'rapido'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 !text-slate-900'
                    : product.badge_tipo === 'premium'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700'
                    : product.badge_tipo === 'profissional'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-900'
                    : product.badge_tipo === 'oferta'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600'
                }`}
              >
                {product.badge_texto || '⭐ Top Vendas'}
              </span>
            )}

            {/* Emojis representativos na lista */}
            {product.icones_representativos && product.icones_representativos.length > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                {product.icones_representativos.map((emo, i) => (
                  <span key={i}>{emo}</span>
                ))}
              </span>
            )}

            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate">
              {product.categoria} • {product.tipo_formulacao}
            </span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
            {product.nome}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {product.o_que_faz || product.descricao}
          </p>

          {/* Variations Pills na lista */}
          {hasVariations && variacoes && (
            <div className="flex flex-wrap gap-1 mt-1.5" onClick={(e) => e.stopPropagation()}>
              {variacoes.map((v, idx) => {
                const isSelected = selectedVarIndex === idx;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(10);
                      setSelectedVarIndex(idx);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-600 dark:border-emerald-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                    }`}
                  >
                    {v.nome}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {isSellerLoggedIn && (
          <div className="text-right mr-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Tabela
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
              {formatCurrency(currentPrice)}
            </span>
          </div>
        )}

        <Stepper value={qty} onChange={setQty} size="sm" />

        <button
          onClick={handleAddToCart}
          className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
            isInCart
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white'
          }`}
        >
          {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isInCart ? `${cartItem.quantidade} no pedido` : 'Adicionar'}</span>
        </button>

        <button
          type="button"
          onClick={handleQuickShare}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          title="Copiar link direto para WhatsApp"
          aria-label="Copiar link direto para WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
