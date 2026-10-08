import React, { useRef, useState } from 'react';
import type { CartItem } from '../../types/cart';
import { useCartStore } from '../../store/useCartStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { Stepper } from '../ui/Stepper';
import { formatCurrency, parseCurrencyInput } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import { sendTelemetry } from '../../utils/telemetry';
import { Trash2, Tag, RotateCcw, PencilLine } from 'lucide-react';

/** Formata número como "12,50" (sem R$) para exibição no input */
const toBrl = (v: number): string => (v || 0).toFixed(2).replace('.', ',');

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { removeFromCart, updateQuantity, updateUnitPrice, updateItemDiscount } = useCartStore();

  const { isSellerLoggedIn, getActiveSeller } = useSellerStore();
  const addToast = useToastStore((s) => s.addToast);

  const itemTotalBruto = item.quantidade * (item.preco_unitario || item.preco_base || 0);
  const itemTotalLiquido = itemTotalBruto * (1 - (item.desconto_percent || 0) / 100);

  const itemKey = item.cartItemId || (item.variationId ? `${item.id}_${item.variationId}` : item.id);

  // ── Preço unitário personalizado (momentâneo, só nesta cotação) ──
  const [priceVal, setPriceVal] = useState('');
  const [editingPrice, setEditingPrice] = useState(false);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const isCustomPrice = item.preco_unitario !== item.preco_base;

  // Valor exibido: enquanto edita usa o estado local, senão deriva do store
  // (evita useEffect de sincronização e re-renders em cascata)
  const displayPrice = editingPrice ? priceVal : toBrl(item.preco_unitario);

  const handlePriceFocus = () => {
    setPriceVal(toBrl(item.preco_unitario));
    setEditingPrice(true);
    const el = priceInputRef.current;
    if (el) {
      setTimeout(() => {
        try {
          el.select();
          el.setSelectionRange?.(0, el.value.length);
        } catch {}
      }, 10);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aceita apenas dígitos, vírgula e ponto (teclado numérico pt-BR gera vírgula)
    setPriceVal(e.target.value.replace(/[^\d.,]/g, ''));
  };

  const commitPrice = () => {
    const parsed = Math.max(0, parseCurrencyInput(priceVal));
    setEditingPrice(false);
    setPriceVal(''); // volta a derivar do store

    if (parsed === item.preco_unitario) return; // só estava formatando

    updateUnitPrice(itemKey, parsed);
    triggerHaptic(15);

    if (parsed === 0) {
      addToast(
        '⚠️ Preço zerado: o item aparecerá sem valor no WhatsApp/PDF da proposta.',
        'warning',
        4500
      );
    }

    const seller = getActiveSeller();
    sendTelemetry({
      evento: 'Preço Personalizado no Orçamento',
      vendedor: seller.nome,
      vendedor_nome: seller.nome,
      detalhes_extras:
        `${item.nome} (Ref: ${item.referencia}): ` +
        `${formatCurrency(item.preco_unitario)} -> ${formatCurrency(parsed)} — ` +
        'alteração momentânea nesta cotação'
    });
  };

  const handleRemove = () => {
    triggerHaptic(20);
    removeFromCart(itemKey);
  };

  const handleDiscountTag = (percent: number) => {
    triggerHaptic(10);
    updateItemDiscount(itemKey, percent);
  };

  const handleResetPrice = () => {
    triggerHaptic(10);
    updateUnitPrice(itemKey, item.preco_base);
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
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* Preço unitário editável — só nesta cotação */}
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/60"
                title="Preço personalizado (somente nesta cotação)"
              >
                <span className="text-[10px] font-bold text-slate-400">R$</span>
                <input
                  ref={priceInputRef}
                  type="text"
                  inputMode="decimal"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  onFocus={handlePriceFocus}
                  onBlur={commitPrice}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      priceInputRef.current?.blur();
                    } else if (e.key === 'Escape') {
                      setEditingPrice(false);
                      setPriceVal('');
                      priceInputRef.current?.blur();
                    }
                  }}
                  aria-label={`Preço unitário personalizado de ${item.nome}`}
                  className="w-16 bg-transparent border-none text-xs font-mono font-bold text-slate-700 dark:text-slate-200 focus:outline-none p-0"
                />
                <PencilLine className="w-3 h-3 text-slate-400 shrink-0" />
              </div>

              {isCustomPrice && (
                <>
                  <span
                    className="text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                    title="Preço alterado apenas nesta cotação"
                  >
                    ✏️ Personalizado
                  </span>
                  <button
                    onClick={handleResetPrice}
                    className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5 underline"
                    title="Restaurar preço de tabela"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Tab: {formatCurrency(item.preco_base)}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
        <Stepper
          value={item.quantidade}
          onChange={(q) => updateQuantity(itemKey, q)}
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
                onChange={(e) => updateItemDiscount(itemKey, parseFloat(e.target.value) || 0)}
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
