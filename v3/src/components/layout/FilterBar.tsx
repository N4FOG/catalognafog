import React from 'react';
import { CATEGORIAS, FORMULACOES } from '../../data/categories';
import { useCatalogStore } from '../../store/useCatalogStore';
import { triggerHaptic } from '../../utils/haptics';
import { LayoutGrid, List, FilterX, Layers } from 'lucide-react';

interface FilterBarProps {
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalResults }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedFormulation,
    setSelectedFormulation,
    viewMode,
    setViewMode,
    searchQuery,
    clearFilters
  } = useCatalogStore();

  const hasActiveFilters =
    selectedCategory !== 'todos' ||
    selectedFormulation !== 'todos' ||
    searchQuery.trim() !== '';

  const handleCategorySelect = (id: string) => {
    triggerHaptic(10);
    setSelectedCategory(id);
  };

  const handleFormulationSelect = (id: string) => {
    triggerHaptic(10);
    setSelectedFormulation(id);
  };

  return (
    <section className="bg-white dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800/80 py-3 sticky top-[108px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2.5">
        {/* Top Controls: Formulation + View Mode + Result count */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{totalResults} {totalResults === 1 ? 'produto' : 'produtos'}</span>
            </span>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  triggerHaptic(15);
                  clearFilters();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

          {/* Formulations & Grid/List view */}
          <div className="flex items-center gap-2">
            {/* Formulation selector */}
            <select
              value={selectedFormulation}
              onChange={(e) => handleFormulationSelect(e.target.value)}
              className="text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {FORMULACOES.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.icone} {f.nome}
                </option>
              ))}
            </select>

            {/* View Mode Switcher */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setViewMode('grid');
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Visualização em Grade"
                aria-label="Grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setViewMode('list');
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Visualização em Lista"
                aria-label="Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-0.5">
          {CATEGORIAS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 dark:bg-emerald-600 dark:border-emerald-500 shadow-md shadow-emerald-900/20'
                    : 'bg-slate-100/90 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.icone}</span>
                <span>{cat.nome}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
