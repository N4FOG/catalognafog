import React, { useState } from 'react';
import { useSellerStore } from '../../store/useSellerStore';
import { useCartStore } from '../../store/useCartStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import type { QuoteHistoryItem, QuoteStatus } from '../../types/seller';
import { triggerHaptic } from '../../utils/haptics';
import {
  User,
  LogOut,
  Link2,
  RotateCcw,
  Trash2,
  Clock,
  TrendingUp,
  FileText,
  ShoppingBag
} from 'lucide-react';

export const SellerDashboardModal: React.FC = () => {
  const {
    isSellerDashboardOpen,
    closeSellerDashboard,
    openCommissionModal
  } = useCatalogStore();

  const {
    session,
    logout,
    quoteHistory,
    updateQuoteStatus,
    deleteQuoteFromHistory
  } = useSellerStore();

  const { loadSavedQuote, setIsCartOpen } = useCartStore();
  const { addToast } = useToastStore();

  const [statusFilter, setStatusFilter] = useState<string>('todos');

  if (!isSellerDashboardOpen) return null;

  const handleLogout = () => {
    triggerHaptic(20);
    logout();
    closeSellerDashboard();
    addToast('👋 Sessão do vendedor encerrada.', 'info');
  };

  const handleLoadQuote = (quote: QuoteHistoryItem) => {
    triggerHaptic(20);
    loadSavedQuote(quote);
    closeSellerDashboard();
    setIsCartOpen(true);
    addToast(`📂 Proposta ${quote.id} carregada no carrinho!`, 'success');
  };

  const handleDeleteQuote = (id: string) => {
    triggerHaptic(20);
    if (window.confirm(`Deseja realmente remover o orçamento ${id} do histórico?`)) {
      deleteQuoteFromHistory(id);
      addToast(`🗑️ Orçamento ${id} removido.`, 'info');
    }
  };

  const filteredHistory = quoteHistory.filter((q) => {
    if (statusFilter === 'todos') return true;
    return q.status === statusFilter;
  });

  const statusColors: Record<QuoteStatus, string> = {
    aguardando: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    negociando: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    fechado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    perdido: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
  };

  return (
    <Modal
      isOpen={isSellerDashboardOpen}
      onClose={closeSellerDashboard}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">Painel do Representante</span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Seller Info Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xl border border-white/20">
              <User className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-black text-base">{session?.vendedorNome || 'Representante'}</h4>
              <p className="text-xs text-emerald-200">
                Código: <span className="font-mono">{session?.vendedorId}</span> • Modo Comercial Ativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic(10);
                openCommissionModal();
              }}
              className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link de Comissão</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Quote History Header & Filter */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Histórico de Orçamentos ({quoteHistory.length})
            </h4>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['todos', 'aguardando', 'negociando', 'fechado', 'perdido'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs">Nenhum orçamento encontrado neste filtro.</p>
            </div>
          ) : (
            filteredHistory.map((quote) => (
              <div
                key={quote.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">
                        {quote.id}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quote.data}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                      {quote.cliente || 'Cliente não informado'}
                    </h5>
                    {quote.doc && (
                      <p className="text-xs text-slate-500">{quote.doc}</p>
                    )}
                  </div>

                  <select
                    value={quote.status}
                    onChange={(e) => updateQuoteStatus(quote.id, e.target.value as QuoteStatus)}
                    className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                      statusColors[quote.status]
                    }`}
                  >
                    <option value="aguardando">⏳ Aguardando</option>
                    <option value="negociando">💬 Negociando</option>
                    <option value="fechado">✅ Fechado</option>
                    <option value="perdido">❌ Perdido</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">
                    {quote.totalQtd} itens • {quote.itens?.length || 0} produtos
                  </span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    {quote.valorTotal || 'R$ 0,00'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleDeleteQuote(quote.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Excluir do histórico"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleLoadQuote(quote)}
                    className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recarregar no Carrinho</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
