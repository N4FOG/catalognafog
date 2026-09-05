import React from 'react';
import { PRODUTOS } from '../../data/products';
import { useCatalogStore } from '../../store/useCatalogStore';
import { triggerHaptic } from '../../utils/haptics';
import { Sparkles } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { setSelectedProduct } = useCatalogStore();
  const highlightedProducts = PRODUTOS.filter((p) => p.destaque).slice(0, 10);

  const handleStoryClick = (product: typeof PRODUTOS[0]) => {
    triggerHaptic(15);
    setSelectedProduct(product);
  };

  return (
    <section className="border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Destaques & Linhas Mais Vendidas
          </span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {highlightedProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => handleStoryClick(prod)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              {/* Ring Container */}
              <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-400 to-amber-400 shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] bg-white dark:bg-slate-900 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.imagens[0]}
                    alt={prod.nome}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-[68px] truncate text-center group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                {prod.nome.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
