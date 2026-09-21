import React from 'react';
import { CATEGORIAS } from '../../data/categories';
import { PRODUTOS } from '../../data/products';
import { useCatalogStore } from '../../store/useCatalogStore';
import { triggerHaptic } from '../../utils/haptics';

export const StoriesCategories: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useCatalogStore();

  const handleSelectCategory = (id: string) => {
    triggerHaptic(12);
    setSelectedCategory(id);
  };

  return (
    <section className="max-w-7xl mx-auto px-2.5 sm:px-6 py-1">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <h2 className="text-xs sm:text-sm font-extrabold text-[#0f1f17] dark:text-[#edf5f0] flex items-center gap-1.5 font-display">
          Navegar por Linhas e Categorias <span>🌿</span>
        </h2>
        <button
          onClick={() => handleSelectCategory('todos')}
          className="text-[11px] sm:text-xs font-bold text-[#0f4531] dark:text-[#10b981] hover:underline cursor-pointer"
        >
          Exibir Todos
        </button>
      </div>

      {/* Grade 2 Linhas Ultra-Compacta (Opção B) */}
      <div className="grid grid-cols-6 lg:grid-cols-11 gap-x-1.5 sm:gap-x-2.5 gap-y-2 py-1">
        {CATEGORIAS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'todos' ? PRODUTOS.length : PRODUTOS.filter((p) => p.categoria === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1 focus:outline-none group select-none cursor-pointer"
            >
              {/* Mini Avatar Ring */}
              <div
                className={`relative p-0.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-[#0f4531] dark:ring-[#10b981] ring-offset-1 ring-offset-white dark:ring-offset-[#09130e] scale-105 shadow-xs'
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-[#14281f] border border-[rgba(15,69,49,0.15)] dark:border-[rgba(16,185,129,0.25)] flex items-center justify-center text-lg sm:text-xl shadow-2xs">
                  {cat.icone}
                </div>

                {/* Badge Count */}
                <span className="absolute -top-0.5 -right-0.5 px-1 py-0 rounded-full text-[9px] font-black bg-[#0f4531] text-white dark:bg-[#10b981] dark:text-[#09261b] shadow-2xs border border-white dark:border-[#09130e]">
                  {count}
                </span>
              </div>

              {/* Category Name */}
              <span
                className={`text-[9.5px] sm:text-[10.5px] font-bold text-center leading-none truncate max-w-[54px] sm:max-w-[68px] transition-colors ${
                  isActive
                    ? 'text-[#0f4531] dark:text-[#10b981]'
                    : 'text-[#334e40] dark:text-[#9cb8a9]'
                }`}
                title={cat.nome}
              >
                {cat.nome.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
