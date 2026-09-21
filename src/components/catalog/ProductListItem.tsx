import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Plus, Check } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

interface ProductListItemProps {
  product: Product;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
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
    addToast(`✅ ${product.nome} adicionado!`, 'success');

    const seller = getActiveSeller();
    sendTelemetry({
      evento: 'Adicionou ao Orçamento (Lista)',
      vendedor: seller.nome,
      vendedor_nome: seller.nome,
      total_itens: qty,
      resumo_itens: `${qty}x ${product.nome}`
    });
  };

  const handleClick = () => {
    triggerHaptic(15);
    setSelectedProduct(product);
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1 min-w-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-1.5 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
          <img
            src={product.imagens[0]}
            alt={product.nome}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {product.referencia}
            </span>
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
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        {isSellerLoggedIn && (
          <div className="text-right mr-1">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Tabela
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
              {formatCurrency(product.preco_base)}
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
      </div>
    </article>
  );
};
