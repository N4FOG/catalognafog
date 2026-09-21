import React from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { triggerHaptic } from '../../utils/haptics';

export const SearchMobileSection: React.FC = () => {
  const { searchQuery, setSearchQuery, quickSearch } = useCatalogStore();

  const tags = [
    { label: '🌱 Tiririca', query: 'Tiririca' },
    { label: '🌾 Roseta', query: 'Roseta' },
    { label: '🪳 Baratas', query: 'Baratas' },
    { label: '🪰 Moscas', query: 'Moscas' },
    { label: '🪵 Cupins', query: 'Cupim' },
    { label: '🌸 Fungos', query: 'Orquídeas' },
    { label: '🐜 Formigas', query: 'Formigas' }
  ];

  const handleTagClick = (query: string) => {
    triggerHaptic(12);
    quickSearch(query);
  };

  return (
    <section className="md:hidden max-w-7xl mx-auto px-4 pt-3 pb-2">
      {/* Mobile Search Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar praga, produto ou princípio..."
          className="w-full h-12 pl-10 pr-10 bg-white dark:bg-[#0f1f17] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] rounded-full text-sm font-medium text-[#0f1f17] dark:text-[#edf5f0] placeholder-slate-400 dark:placeholder-[#638573] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
          autoComplete="off"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              setSearchQuery('');
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Tags Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1 -mx-4 px-4">
        <span className="text-[11px] font-extrabold text-slate-400 dark:text-[#638573] whitespace-nowrap shrink-0">
          🔥 Mais Buscados:
        </span>
        {tags.map((tag) => (
          <button
            key={tag.query}
            onClick={() => handleTagClick(tag.query)}
            className="h-8 px-3 rounded-full text-xs font-bold whitespace-nowrap shrink-0 bg-white dark:bg-[#14281f] text-[#334e40] dark:text-[#9cb8a9] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] shadow-xs hover:bg-[#eaf7f0] dark:hover:bg-[#1b3529] transition-colors active:scale-95"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </section>
  );
};
