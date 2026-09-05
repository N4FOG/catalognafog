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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-extrabold text-[#0f1f17] dark:text-[#edf5f0] flex items-center gap-1.5 font-display">
          Navegar por Linhas e Categorias <span>🌿</span>
        </h2>
        <button
          onClick={() => handleSelectCategory('todos')}
          className="text-xs font-bold text-[#0f4531] dark:text-[#10b981] hover:underline cursor-pointer"
        >
          Exibir Todos os Produtos
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIAS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'todos' ? PRODUTOS.length : PRODUTOS.filter((p) => p.categoria === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group select-none cursor-pointer"
            >
              {/* Avatar Ring */}
              <div
                className={`relative p-0.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'ring-2 ring-[#0f4531] dark:ring-[#10b981] ring-offset-2 ring-offset-white dark:ring-offset-[#09130e] scale-105 shadow-md shadow-[#0f4531]/20'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-[#14281f] border border-[rgba(15,69,49,0.15)] dark:border-[rgba(16,185,129,0.25)] flex items-center justify-center text-2xl shadow-xs">
                  {cat.icone}
                </div>

                {/* Badge Count */}
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#0f4531] text-white dark:bg-[#10b981] dark:text-[#09261b] shadow-xs border border-white dark:border-[#09130e]">
                  {count}
                </span>
              </div>

              {/* Category Name */}
              <span
                className={`text-[11px] font-bold max-w-[76px] truncate text-center transition-colors ${
                  isActive
                    ? 'text-[#0f4531] dark:text-[#10b981]'
                    : 'text-[#334e40] dark:text-[#9cb8a9]'
                }`}
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
