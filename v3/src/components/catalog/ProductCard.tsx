import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Plus, Check, Eye, ShieldCheck } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const { items, addToCart } = useCartStore();
  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const { setSelectedProduct } = useCatalogStore();
  const { addToast } = useToastStore();

  const cartItem = items.find((i) => i.id === product.id);
  const isInCart = !!cartItem;

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

  const handleCardClick = () => {
    triggerHaptic(15);
    setSelectedProduct(product);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-square p-4 bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800/40 dark:to-slate-900/40 flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm truncate max-w-[120px]">
            {product.referencia}
          </span>
          {isInCart && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm animate-in zoom-in">
              <Check className="w-3 h-3 stroke-[3]" />
              {cartItem.quantidade} no pedido
            </span>
          )}
        </div>

        <img
          src={product.imagens[0]}
          alt={product.nome}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).style.opacity = '0.5';
          }}
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-xs font-bold shadow-lg backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" />
            Ficha Técnica
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <span>{product.categoria}</span>
            <span>•</span>
            <span className="truncate">{product.tipo_formulacao}</span>
          </div>

          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {product.nome}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {product.o_que_faz || product.descricao}
          </p>
        </div>

        {product.alvos && product.alvos.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.alvos.slice(0, 2).map((alvo, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[110px]"
              >
                {alvo}
              </span>
            ))}
            {product.alvos.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                +{product.alvos.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            {isSellerLoggedIn ? (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tabela Oficial
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {formatCurrency(product.preco_base)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">/{product.unidade}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cotação Direta</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Stepper value={qty} onChange={setQty} size="sm" />
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                isInCart
                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-emerald-900/20'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isInCart ? 'Adicionar +' : 'Adicionar'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
