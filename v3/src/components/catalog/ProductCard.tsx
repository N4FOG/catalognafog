import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { CATEGORIAS, FORMULACOES } from '../../data/categories';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { highlightSearch } from '../../utils/searchHighlight';
import { sendTelemetry } from '../../utils/telemetry';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const { items, addToCart } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { searchQuery, setSelectedProduct } = useCatalogStore();
  const { addToast } = useToastStore();

  const cartItem = items.find((i) => i.id === product.id);
  const inCart = !!cartItem;

  const catObj = CATEGORIAS.find((c) => c.id === product.categoria);
  const formObj = FORMULACOES.find((f) => f.id === product.tipo_formulacao);

  // Pack Tag derivation
  const packFeature = product.caracteristicas
    ? product.caracteristicas.find((c) => {
        const lower = c.toLowerCase();
        return (
          lower.includes('frasco') ||
          lower.includes('caixa') ||
          lower.includes('sachê') ||
          lower.includes('display') ||
          lower.includes('seringa') ||
          lower.includes('balde') ||
          lower.includes('envelope')
        );
      })
    : null;
  const packTag = packFeature ? packFeature.split('(')[0].trim() : (product.unidade ? product.unidade.toUpperCase() : 'UN');

  const targetsGrid = (product.alvos || []).slice(0, 2);
  const moreGridCount = (product.alvos || []).length - targetsGrid.length;

  const handleCardClick = () => {
    triggerHaptic(15);
    setSelectedProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(20);
    addToCart(product, qty);
    addToast(`✅ ${product.nome} adicionado ao orçamento!`, 'success');

    const seller = getActiveSeller();
    sendTelemetry({
      evento: 'Adicionou ao Orçamento',
      vendedor: seller.nome,
      vendedor_nome: seller.nome,
      total_itens: qty,
      resumo_itens: `${qty}x ${product.nome} (Ref: ${product.referencia})`,
      detalhes_extras: `Produto: ${product.nome} | Qtd: ${qty} | Preço: R$ ${product.preco_base}`
    });
  };

  const handleAdjustQty = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    triggerHaptic(10);
    setQty((prev) => Math.max(1, Math.min(999, prev + delta)));
  };

  return (
    <article
      onClick={handleCardClick}
      className="bg-white dark:bg-[#0f1f17] rounded-2xl border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.18)] shadow-xs hover:shadow-md hover:border-[#10b981]/50 dark:hover:border-[#10b981]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      {/* Thumb Box with Badges */}
      <div className="relative aspect-square p-3 bg-[#f8faf9] dark:bg-[#14281f] flex items-center justify-center overflow-hidden">
        {/* Top Vendas Badge */}
        {product.destaque && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
            ⭐ Top Vendas
          </span>
        )}

        {/* Category Emoji Badge */}
        <span
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-[#0f1f17]/90 backdrop-blur-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm shadow-xs"
          title={catObj?.nome}
        >
          {catObj?.icone || '🌿'}
        </span>

        {/* Product Image */}
        <img
          src={product.imagens[0]}
          alt={product.nome}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Formulation Pill Badge */}
        <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-[#0f1f17]/90 backdrop-blur-xs border border-slate-200 dark:border-slate-700 text-[#334e40] dark:text-[#9cb8a9] shadow-xs">
          {formObj ? `${formObj.icone} ${formObj.nome.split(' ')[0]}` : '⚡'}
        </span>
      </div>

      {/* Product Info Box */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Packaging Tag & Reference */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-[#638573] uppercase tracking-wider">
              Ref: {product.referencia}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#14281f] text-[#334e40] dark:text-[#9cb8a9]">
              📦 {packTag}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#0f1f17] dark:text-[#edf5f0] group-hover:text-[#0f4531] dark:group-hover:text-[#10b981] transition-colors line-clamp-2 leading-snug">
            {highlightSearch(product.nome, searchQuery)}
          </h3>

          {/* Description line */}
          <p className="text-[11px] text-[#334e40] dark:text-[#9cb8a9] line-clamp-2 mt-1 leading-tight">
            {highlightSearch(product.descricao, searchQuery)}
          </p>

          {/* Seller Price Box */}
          {isSellerLoggedIn && (
            <div className="inline-flex items-center gap-1.5 bg-[#10b981]/10 border border-[#10b981]/35 rounded-lg px-2 py-0.5 mt-1.5 text-xs">
              <span className="text-[#059669] font-black">💰 Tabela:</span>
              <strong className="text-[#0f1f17] dark:text-[#edf5f0] font-mono font-black">
                {formatCurrency(product.preco_base)}
              </strong>
            </div>
          )}
        </div>

        <div>
          {/* Target Pest Chips */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {targetsGrid.map((alvo, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-[#14281f] text-[#334e40] dark:text-[#9cb8a9] border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[110px]"
              >
                🎯 {alvo}
              </span>
            ))}
            {moreGridCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-[#14281f] text-slate-500">
                +{moreGridCount}
              </span>
            )}
          </div>

          {/* Action Row: Stepper + Add Button */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center bg-slate-100 dark:bg-[#14281f] rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={(e) => handleAdjustQty(e, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#0f1f17] text-[#0f1f17] dark:text-white font-bold text-xs shadow-xs hover:bg-slate-50 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={inCart && cartItem ? cartItem.quantidade : qty}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val >= 1) setQty(val);
                }}
                className="w-8 text-center text-xs font-bold bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={(e) => handleAdjustQty(e, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-[#0f1f17] text-[#0f1f17] dark:text-white font-bold text-xs shadow-xs hover:bg-slate-50 transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-8 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm ${
                inCart
                  ? 'bg-[#059669] text-white shadow-[#059669]/25'
                  : 'bg-[#0f4531] hover:bg-[#176043] dark:bg-[#10b981] dark:hover:bg-[#059669] text-white'
              }`}
            >
              <span>{inCart ? `Cotar (${cartItem.quantidade})` : '+ Cotar'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
