import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { Modal } from '../ui/Modal';
import { triggerHaptic } from '../../utils/haptics';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  XCircle,
  History
} from 'lucide-react';
import type { Product } from '../../types/product';

export const ProductListAdminModal: React.FC = () => {
  const {
    isAdminProductsListOpen,
    closeAdminProductsList,
    openAdminDashboard,
    setAdminEditingProduct
  } = useCatalogStore();

  const { products, getProductBackups } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  if (!isAdminProductsListOpen) return null;

  const handleBackToDashboard = () => {
    triggerHaptic(15);
    closeAdminProductsList();
    openAdminDashboard();
  };

  const handleSelectToEdit = (product: Product) => {
    triggerHaptic(20);
    closeAdminProductsList();
    setAdminEditingProduct(product);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'todos' || p.categoria === categoryFilter;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesName = p.nome.toLowerCase().includes(term);
    const matchesRef = p.referencia.toLowerCase().includes(term);
    const matchesAlvos = (p.alvos || []).some((a) => a.toLowerCase().includes(term));
    return matchesCategory && (matchesName || matchesRef || matchesAlvos);
  });

  // Lista de categorias distintas
  const categoriesList = Array.from(new Set(products.map((p) => p.categoria)));

  return (
    <Modal
      isOpen={isAdminProductsListOpen}
      onClose={closeAdminProductsList}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToDashboard}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              Gerenciador de Produtos
            </h3>
            <span className="text-[11px] text-slate-500 font-medium block">
              Selecione um produto para visualizar e editar
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, código ou praga..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          >
            <option value="todos">Todas as Categorias ({products.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()} ({products.filter((p) => p.categoria === cat).length})
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Produtos */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Nenhum produto encontrado com os filtros selecionados.
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const backupsCount = getProductBackups(prod.id).length;
              const isInStock = prod.emEstoque !== false;

              return (
                <div
                  key={prod.id}
                  onClick={() => handleSelectToEdit(prod)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-900/60 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-center">
                      <img
                        src={prod.imagens[0]}
                        alt={prod.nome}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                          {prod.nome}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-bold">
                          {prod.referencia}
                        </span>
                        {backupsCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-0.5">
                            <History className="w-2.5 h-2.5" />
                            {backupsCount} backups
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(prod.preco_base)}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{prod.categoria}</span>
                        <span>•</span>
                        {isInStock ? (
                          <span className="text-emerald-600 flex items-center gap-0.5 font-medium text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Em Estoque
                          </span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-0.5 font-bold text-[11px]">
                            <XCircle className="w-3 h-3" /> Esgotado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectToEdit(prod);
                    }}
                    className="ml-2 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
