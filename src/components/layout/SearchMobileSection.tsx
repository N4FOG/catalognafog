import React, { useRef } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { triggerHaptic } from '../../utils/haptics';
import { scrollToProducts } from '../../utils/scrollHelper';

export const SearchMobileSection: React.FC = () => {
  const { searchQuery, setSearchQuery } = useCatalogStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(12);
    inputRef.current?.blur();
    scrollToProducts();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerHaptic(12);
      inputRef.current?.blur();
      scrollToProducts();
    }
  };

  return (
    <section className="md:hidden max-w-7xl mx-auto px-4 pt-3 pb-2">
      {/* Mobile Search Bar */}
      <form onSubmit={handleSearchSubmit} action="/" role="search" className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          enterKeyHint="search"
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
      </form>
    </section>
  );
};
