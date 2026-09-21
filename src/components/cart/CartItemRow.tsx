import React from 'react';
import type { CartItem } from '../../types/cart';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { Stepper } from '../ui/Stepper';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { Trash2, Tag, RotateCcw } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const {
    removeFromCart,
    updateQuantity,
    updateUnitPrice,
    updateItemDiscount
  } = useCartStore();

  const { isSellerLoggedIn } = useSellerStore();

  const itemTotalBruto = item.quantidade * (item.preco_unitario || item.preco_base || 0);
  const itemTotalLiquido = itemTotalBruto * (1 - (item.desconto_percent || 0) / 100);

  const handleRemove = () => {
    triggerHaptic(20);
    removeFromCart(item.id);
  };

  const handleDiscountTag = (percent: number) => {
    triggerHaptic(10);
    updateItemDiscount(item.id, percent);
  };

  const handleResetPrice = () => {
    triggerHaptic(10);
    updateUnitPrice(item.id, item.preco_base);
  };

  return (
    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
          <img
            src={item.imagem}
            alt={item.nome}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {item.referencia}
            </span>
            <button
              onClick={handleRemove}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Remover item"
              aria-label="Remover"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate mt-0.5">
            {item.nome}
          </h4>

          {isSellerLoggedIn && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                {formatCurrency(item.preco_unitario)}
              </span>
              {item.preco_unitario !== item.preco_base && (
                <button
                  onClick={handleResetPrice}
                  className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5 underline"
                  title="Restaurar preço base"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Tab: {formatCurrency(item.preco_base)}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
        <Stepper
          value={item.quantidade}
          onChange={(q) => updateQuantity(item.id, q)}
          size="sm"
        />

        {isSellerLoggedIn ? (
          <div className="text-right">
            {item.desconto_percent > 0 && (
              <span className="text-[11px] text-slate-400 line-through mr-1.5 font-mono">
                {formatCurrency(itemTotalBruto)}
              </span>
            )}
            <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
              {formatCurrency(itemTotalLiquido)}
            </span>
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {item.quantidade} {item.unidade || 'un'}
          </span>
        )}
      </div>

      {isSellerLoggedIn && (
        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              Desconto no Item:
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="100"
                value={item.desconto_percent || ''}
                onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-12 py-0.5 px-1.5 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-500">%</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[0, 5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleDiscountTag(pct)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-colors ${
                  item.desconto_percent === pct
                    ? 'bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                {pct === 0 ? 'Sem desc.' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
