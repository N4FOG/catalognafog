import React, { useMemo } from 'react';
import { PRODUTOS } from '../../data/products';
import { useCatalogStore } from '../../store/useCatalogStore';
import { ProductCard } from './ProductCard';
import { ProductListItem } from './ProductListItem';
import { FilterBar } from '../layout/FilterBar';
import { normalizeText } from '../../utils/formatters';
import { SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    selectedFormulation,
    viewMode,
    clearFilters
  } = useCatalogStore();

  const filteredProducts = useMemo(() => {
    const normQuery = normalizeText(searchQuery);

    return PRODUTOS.filter((product) => {
      // Category Filter
      if (selectedCategory !== 'todos' && product.categoria !== selectedCategory) {
        return false;
      }

      // Formulation Filter
      if (selectedFormulation !== 'todos' && product.tipo_formulacao !== selectedFormulation) {
        return false;
      }

      // Search Query Filter
      if (normQuery) {
        const matchName = normalizeText(product.nome).includes(normQuery);
        const matchRef = normalizeText(product.referencia).includes(normQuery);
        const matchDesc = normalizeText(product.descricao).includes(normQuery);
        const matchAction = normalizeText(product.o_que_faz).includes(normQuery);
        const matchAlvos = product.alvos?.some((alvo) => normalizeText(alvo).includes(normQuery));

        if (!matchName && !matchRef && !matchDesc && !matchAction && !matchAlvos) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedFormulation]);

  return (
    <div className="min-h-[60vh] pb-16">
      <FilterBar totalResults={filteredProducts.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Nenhum produto encontrado
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Não encontramos resultados para a sua busca ou filtros selecionados. Tente buscar por outros termos como "baratas", "tiririca" ou "roseta".
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold shadow-md hover:bg-emerald-800 transition-colors"
            >
              Mostrar Todos os Produtos
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
