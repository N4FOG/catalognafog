import React, { useState, useEffect } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useToastStore } from '../../store/useToastStore';
import { CATEGORIAS, FORMULACOES } from '../../data/categories';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';
import { triggerHaptic } from '../../utils/haptics';
import {
  Save,
  RotateCcw,
  History,
  ArrowLeft,
  Plus,
  Trash2
} from 'lucide-react';
import type { Product } from '../../types/product';
import type { ProductBackup } from '../../types/admin';

export const ProductEditModal: React.FC = () => {
  const {
    adminEditingProduct,
    setAdminEditingProduct,
    openAdminProductsList
  } = useCatalogStore();

  const {
    updateProduct,
    getProductBackups,
    restoreProductBackup
  } = useAdminStore();

  const { addToast } = useToastStore();

  // Estado local do produto em edição
  const [formData, setFormData] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'guia' | 'aplicacao' | 'seguranca' | 'alvos'>('guia');
  const [isSaving, setIsSaving] = useState(false);
  const [showBackupDrawer, setShowBackupDrawer] = useState(false);
  const [newTargetInput, setNewTargetInput] = useState('');

  // Sincroniza dados quando o produto selecionado mudar
  useEffect(() => {
    if (adminEditingProduct) {
      setFormData(JSON.parse(JSON.stringify(adminEditingProduct)));
      setActiveTab('guia');
      setShowBackupDrawer(false);
    } else {
      setFormData(null);
    }
  }, [adminEditingProduct]);

  if (!formData) return null;

  const backups = getProductBackups(formData.id);
  const isInStock = formData.emEstoque !== false;

  const handleClose = () => {
    setAdminEditingProduct(null);
  };

  const handleBackToList = () => {
    triggerHaptic(15);
    setAdminEditingProduct(null);
    openAdminProductsList();
  };

  const handleSave = async () => {
    if (!formData) return;
    triggerHaptic(20);
    setIsSaving(true);

    try {
      const ok = await updateProduct(
        formData,
        `Edição direta pelo painel admin (${new Date().toLocaleTimeString('pt-BR')})`
      );

      if (ok) {
        addToast(`✅ Alterações em "${formData.nome}" salvas e enviadas para a nuvem!`, 'success');
        setAdminEditingProduct(null);
      } else {
        addToast('⚠️ Não foi possível salvar as alterações.', 'error');
      }
    } catch (e) {
      addToast('❌ Erro inesperado ao salvar alterações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreBackup = async (backup: ProductBackup) => {
    triggerHaptic(20);
    const confirm = window.confirm(
      `Deseja realmente restaurar a versão de ${backup.timestamp} gravada por ${backup.author}?`
    );
    if (!confirm) return;

    setIsSaving(true);
    try {
      const ok = await restoreProductBackup(backup.id);
      if (ok) {
        setFormData(JSON.parse(JSON.stringify(backup.snapshot)));
        addToast(`🔄 Versão de ${backup.timestamp} restaurada com sucesso!`, 'success');
        setShowBackupDrawer(false);
      } else {
        addToast('⚠️ Falha ao restaurar versão selecionada.', 'error');
      }
    } catch {
      addToast('❌ Erro ao restaurar backup.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTargetInput.trim().toLowerCase();
    if (!clean) return;
    if (formData.alvos?.includes(clean)) {
      addToast('⚠️ Este alvo/praga já está na lista.', 'warning');
      return;
    }
    setFormData({
      ...formData,
      alvos: [...(formData.alvos || []), clean]
    });
    setNewTargetInput('');
  };

  const handleRemoveTarget = (index: number) => {
    const updated = [...(formData.alvos || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, alvos: updated });
  };

  return (
    <Modal
      isOpen={!!formData}
      onClose={handleClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center justify-between w-full pr-4 flex-wrap gap-2">
          {/* Botão Voltar + Código */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Voltar à lista de produtos"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              MODO EDIÇÃO: {formData.referencia}
            </span>
          </div>

          {/* Badge de Histórico de Backups ao lado do fechar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setShowBackupDrawer(!showBackupDrawer);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                backups.length > 0
                  ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
              }`}
              title="Ver histórico de edições e restaurar versões"
            >
              <History className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Histórico ({backups.length})</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 relative">
        {/* DRAWER / PAINEL FLUTUANTE DE BACKUPS */}
        {showBackupDrawer && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/90 border-2 border-amber-300 dark:border-amber-700 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                  Histórico de Versões Salvas (Backups)
                </h4>
              </div>
              <button
                onClick={() => setShowBackupDrawer(false)}
                className="p-1 text-amber-700 hover:text-amber-900 dark:text-amber-300 text-xs font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="text-xs text-amber-800 dark:text-amber-300">
              Caso tenha feito alguma alteração incorreta, você pode restaurar qualquer snapshot anterior gravado com data e hora:
            </p>

            {backups.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 text-center text-xs text-slate-500 font-medium">
                Nenhum backup registrado para este produto ainda. O primeiro backup será gerado automaticamente quando você salvar uma alteração!
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {backups.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {b.timestamp}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-semibold">
                          Por: {b.author}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {b.summary} • Preço: {formatCurrency(b.snapshot.preco_base)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRestoreBackup(b)}
                      disabled={isSaving}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HERO INFO EDITÁVEL COM A MESMA IDENTIDADE DO CLIENTE */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* Imagem + Input de URL */}
          <div className="sm:col-span-5 flex flex-col items-center space-y-2">
            <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner relative">
              {/* Badge Sem Estoque com Alternância */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  setFormData({ ...formData, emEstoque: !isInStock });
                }}
                className={`absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  !isInStock
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700'
                }`}
                title="Clique para alternar o status de estoque"
              >
                {!isInStock ? '🚫 Sem Estoque (Clique p/ Ativar)' : '✅ Em Estoque (Clique p/ Pausar)'}
              </button>

              <img
                src={formData.imagens[0]}
                alt={formData.nome}
                className={`max-h-full object-contain ${!isInStock ? 'grayscale opacity-50' : ''}`}
              />
            </div>

            {/* Input URL da Imagem */}
            <div className="w-full">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Link da Imagem Principal:
              </label>
              <input
                type="text"
                value={formData.imagens[0] || ''}
                onChange={(e) => {
                  const copy = [...formData.imagens];
                  copy[0] = e.target.value;
                  setFormData({ ...formData, imagens: copy });
                }}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono"
              />
            </div>
          </div>

          {/* Dados Principais do Produto */}
          <div className="sm:col-span-7 space-y-3">
            {/* Nome do Produto */}
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">
                Nome Comercial do Produto:
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full py-2 px-3 text-lg font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Categoria, Formulação e Destaque */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Categoria:</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full py-1.5 px-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {CATEGORIAS.filter((c) => c.id !== 'todos').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icone} {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Formulação:</label>
                <select
                  value={formData.tipo_formulacao}
                  onChange={(e) => setFormData({ ...formData, tipo_formulacao: e.target.value })}
                  className="w-full py-1.5 px-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {FORMULACOES.filter((f) => f.id !== 'todos').map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.icone} {f.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Função Principal (O Que Faz) */}
            <div>
              <label className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                ⚡ Função Principal / Chamada:
              </label>
              <textarea
                rows={2}
                value={formData.o_que_faz || ''}
                onChange={(e) => setFormData({ ...formData, o_que_faz: e.target.value })}
                className="w-full py-2 px-3 text-xs sm:text-sm font-medium bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl focus:ring-2 focus:ring-emerald-500 text-emerald-900 dark:text-emerald-200"
              />
            </div>

            {/* Preço de Tabela & Unidade */}
            <div className="grid grid-cols-2 gap-3 bg-slate-100 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Preço de Tabela (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco_base}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preco_base: parseFloat(e.target.value) || 0
                    })
                  }
                  className="w-full py-2 px-3 text-lg font-mono font-black text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Unidade / Embalagem:
                </label>
                <input
                  type="text"
                  value={formData.unidade}
                  onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                  placeholder="Ex: frasco, galão, dose"
                  className="w-full py-2 px-3 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* SEÇÃO: BADGE COMERCIAL DO CARD */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  🏷️ Badge Comercial do Card:
                </label>
                {(formData.badge_texto || formData.destaque) && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-xs ${
                      formData.badge_tipo === 'lancamento'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                        : formData.badge_tipo === 'mais_vendido'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                        : formData.badge_tipo === 'natural'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                        : formData.badge_tipo === 'rapido'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900'
                        : formData.badge_tipo === 'premium'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-700'
                        : formData.badge_tipo === 'profissional'
                        ? 'bg-gradient-to-r from-slate-700 to-slate-900'
                        : formData.badge_tipo === 'oferta'
                        ? 'bg-gradient-to-r from-rose-600 to-red-600'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600'
                    }`}
                  >
                    Prévia: {formData.badge_texto || '⭐ Top Vendas'}
                  </span>
                )}
              </div>

              {/* Botões Rápidos de Badges Predefinidas */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'none', label: 'Sem Badge', tipo: undefined, texto: '' },
                  { id: 'top_vendas', label: '⭐ Top Vendas', tipo: 'top_vendas', texto: '⭐ Top Vendas' },
                  { id: 'mais_vendido', label: '🔥 Mais Vendido', tipo: 'mais_vendido', texto: '🔥 Mais Vendido' },
                  { id: 'lancamento', label: '🚀 Lançamento 2026', tipo: 'lancamento', texto: '🚀 Lançamento 2026' },
                  { id: 'natural', label: '🌿 Fórmula Natural', tipo: 'natural', texto: '🌿 Fórmula Natural' },
                  { id: 'rapido', label: '⚡ Ação Rápida', tipo: 'rapido', texto: '⚡ Ação Rápida' },
                  { id: 'premium', label: '💎 Linha Premium', tipo: 'premium', texto: '💎 Linha Premium' },
                  { id: 'profissional', label: '🛡️ Uso Profissional', tipo: 'profissional', texto: '🛡️ Uso Profissional' },
                  { id: 'oferta', label: '🏷️ Oferta Especial', tipo: 'oferta', texto: '🏷️ Oferta Especial' }
                ].map((b) => {
                  const isCurrent =
                    (!formData.badge_texto && !formData.destaque && b.id === 'none') ||
                    (formData.badge_texto === b.texto && formData.badge_tipo === b.tipo);

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(10);
                        if (b.id === 'none') {
                          setFormData({ ...formData, badge_texto: '', badge_tipo: undefined, destaque: false });
                        } else {
                          setFormData({
                            ...formData,
                            badge_texto: b.texto,
                            badge_tipo: b.tipo as any,
                            destaque: true
                          });
                        }
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>

              {/* Input para Badge 100% Personalizada */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">Ou digite texto livre:</span>
                <input
                  type="text"
                  value={formData.badge_texto || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      badge_texto: e.target.value,
                      destaque: !!e.target.value,
                      badge_tipo: formData.badge_tipo || 'custom'
                    })
                  }
                  placeholder="Ex: 🏆 Campeão de Vendas, ⭐ Dose Única..."
                  className="flex-1 py-1 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-semibold"
                />
              </div>
            </div>

            {/* SEÇÃO: EMOJIS / ÍCONES REPRESENTATIVOS DO CARD (MÚLTIPLOS LADO A LADO) */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    🐾 Ícones Representativos (Canto Superior Direito):
                  </label>
                  <span className="text-[10px] text-slate-500 block">
                    Selecione 1 ou mais emojis para aparecerem lado a lado no card do produto
                  </span>
                </div>

                {/* Prévia da Cápsula */}
                <div className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-2xs">
                  {(formData.icones_representativos && formData.icones_representativos.length > 0) ? (
                    formData.icones_representativos.map((emo, i) => (
                      <span key={i} className="text-sm">{emo}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Padrão da categoria</span>
                  )}
                </div>
              </div>

              {/* Emojis Atualmente Selecionados (com botão de remover) */}
              {(formData.icones_representativos && formData.icones_representativos.length > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">Ativos:</span>
                  {formData.icones_representativos.map((emo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    >
                      <span className="text-sm">{emo}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const copy = [...(formData.icones_representativos || [])];
                          copy.splice(idx, 1);
                          setFormData({ ...formData, icones_representativos: copy });
                        }}
                        className="text-red-500 hover:text-red-700 font-black ml-0.5"
                        title="Remover este emoji"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icones_representativos: [] })}
                    className="text-[10px] text-slate-400 hover:text-red-500 font-semibold underline ml-auto"
                  >
                    Limpar todos
                  </button>
                </div>
              )}

              {/* Paleta Rápida de Emojis Temáticos Relevantes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                  Clique para adicionar ou remover:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  {/* Grupo 1: Insetos & Pragas */}
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">🪳 Insetos & Pragas</span>
                    <div className="flex flex-wrap gap-1">
                      {['🪳', '🐜', '🕷️', '🦂', '🪲', '🐛', '🦗', '🦟', '🪰', '🐝'].map((e) => {
                        const isSelected = (formData.icones_representativos || []).includes(e);
                        return (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              triggerHaptic(10);
                              const current = formData.icones_representativos || [];
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  icones_representativos: current.filter((item) => item !== e)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  icones_representativos: [...current, e]
                                });
                              }
                            }}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grupo 2: Gramados & Ervas */}
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">🌱 Grama & Plantas</span>
                    <div className="flex flex-wrap gap-1">
                      {['🌱', '🌿', '🌾', '🥀', '☘️', '🌻', '🌸', '🌳', '🍂', '🍄'].map((e) => {
                        const isSelected = (formData.icones_representativos || []).includes(e);
                        return (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              triggerHaptic(10);
                              const current = formData.icones_representativos || [];
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  icones_representativos: current.filter((item) => item !== e)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  icones_representativos: [...current, e]
                                });
                              }
                            }}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grupo 3: Pets & Animais */}
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">🐾 Animais & Roedores</span>
                    <div className="flex flex-wrap gap-1">
                      {['🐕', '🐈', '🐀', '🐁', '🐌', '🐂', '🐎', '🦎', '🐍', '🦇'].map((e) => {
                        const isSelected = (formData.icones_representativos || []).includes(e);
                        return (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              triggerHaptic(10);
                              const current = formData.icones_representativos || [];
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  icones_representativos: current.filter((item) => item !== e)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  icones_representativos: [...current, e]
                                });
                              }
                            }}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grupo 4: Ação, Fórmula & Foco */}
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">⚡ Fórmula & Ação</span>
                    <div className="flex flex-wrap gap-1">
                      {['⚡', '💧', '🧪', '🛡️', '🎯', '🔥', '🚿', '🚜', '🔬', '⭐'].map((e) => {
                        const isSelected = (formData.icones_representativos || []).includes(e);
                        return (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              triggerHaptic(10);
                              const current = formData.icones_representativos || [];
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  icones_representativos: current.filter((item) => item !== e)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  icones_representativos: [...current, e]
                                });
                              }
                            }}
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:scale-105'
                            }`}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS DA FICHA TÉCNICA */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 my-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'guia'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📖 Guia Prático
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aplicacao')}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'aplicacao'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎯 Aplicação & Diluição
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seguranca')}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'seguranca'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛡️ Segurança
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alvos')}
            className={`flex-1 min-w-fit whitespace-nowrap py-2 px-3 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'alvos'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🐛 Alvos & Pragas ({formData.alvos?.length || 0})
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS EDITÁVEIS */}
        <div className="space-y-4 pt-1">
          {activeTab === 'guia' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Para que serve (Indicação completa):
                </label>
                <textarea
                  rows={3}
                  value={formData.para_que_serve || ''}
                  onChange={(e) => setFormData({ ...formData, para_que_serve: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Como age (Mecanismo de ação):
                </label>
                <textarea
                  rows={3}
                  value={formData.como_age || ''}
                  onChange={(e) => setFormData({ ...formData, como_age: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-red-600 dark:text-red-400 block mb-1">
                  Onde NÃO usar (Contraindicações):
                </label>
                <textarea
                  rows={2}
                  value={formData.onde_nao_usar || ''}
                  onChange={(e) => setFormData({ ...formData, onde_nao_usar: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm bg-red-50/60 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-950 dark:text-red-200 rounded-xl focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'aplicacao' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Como Usar / Instrução Geral de Preparo:
                </label>
                <textarea
                  rows={3}
                  value={formData.como_usar || ''}
                  onChange={(e) => setFormData({ ...formData, como_usar: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Rendimento Médio Estimado:
                </label>
                <input
                  type="text"
                  value={formData.rendimento || ''}
                  onChange={(e) => setFormData({ ...formData, rendimento: e.target.value })}
                  placeholder="Ex: Rende até 600 m² de calda..."
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* ETAPAS DE APLICAÇÃO PASSO A PASSO (CARDS EDITÁVEIS) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Etapas de Aplicação Passo a Passo ({formData.manual_aplicacao?.passos?.length || 0} passos)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Edite os passos individuais exibidos na ficha técnica do cliente
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const currentPassos = formData.manual_aplicacao?.passos || [];
                      const nextStepNum = currentPassos.length + 1;
                      const newStep = {
                        passo: nextStepNum,
                        titulo: `Passo ${nextStepNum}`,
                        descricao: '',
                        dica_do_aplicador: ''
                      };
                      const updatedManual = {
                        ...(formData.manual_aplicacao || {
                          resumo_aplicador: '',
                          checklist_previo: [],
                          equipamentos: [],
                          dosagem: {
                            pequena_area: { titulo: '', dose: '', cobertura: '' },
                            area_total: { titulo: '', dose: '', cobertura: '' },
                            instrucao_diluicao: ''
                          },
                          passos: [],
                          linha_do_tempo: []
                        }),
                        passos: [...currentPassos, newStep]
                      };
                      setFormData({ ...formData, manual_aplicacao: updatedManual });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Passo</span>
                  </button>
                </div>

                {(!formData.manual_aplicacao?.passos || formData.manual_aplicacao.passos.length === 0) ? (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-center text-xs text-slate-500">
                    Este produto ainda não possui passos cadastrados no manual. Clique em "Adicionar Passo" acima para criar o passo a passo.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.manual_aplicacao.passos.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                              {step.passo || idx + 1}
                            </span>
                            <input
                              type="text"
                              value={step.titulo || ''}
                              onChange={(e) => {
                                const copy = JSON.parse(JSON.stringify(formData.manual_aplicacao!.passos));
                                copy[idx].titulo = e.target.value;
                                setFormData({
                                  ...formData,
                                  manual_aplicacao: {
                                    ...formData.manual_aplicacao!,
                                    passos: copy
                                  }
                                });
                              }}
                              placeholder="Título da etapa (Ex: Preparo da Calda)..."
                              className="flex-1 py-1.5 px-2.5 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const copy = formData.manual_aplicacao!.passos.filter((_, i) => i !== idx);
                              // renumera os passos
                              const renumbered = copy.map((p, i) => ({ ...p, passo: i + 1 }));
                              setFormData({
                                ...formData,
                                manual_aplicacao: {
                                  ...formData.manual_aplicacao!,
                                  passos: renumbered
                                }
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Remover esta etapa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Descrição detalhada do passo */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">
                            Descrição das instruções:
                          </label>
                          <textarea
                            rows={2}
                            value={step.descricao || ''}
                            onChange={(e) => {
                              const copy = JSON.parse(JSON.stringify(formData.manual_aplicacao!.passos));
                              copy[idx].descricao = e.target.value;
                              setFormData({
                                ...formData,
                                manual_aplicacao: {
                                  ...formData.manual_aplicacao!,
                                  passos: copy
                                }
                              });
                            }}
                            placeholder="Descreva o que o cliente deve fazer nesta etapa..."
                            className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Dica do Aplicador & Alerta */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                              💡 Dica do Aplicador (opcional):
                            </label>
                            <input
                              type="text"
                              value={step.dica_do_aplicador || ''}
                              onChange={(e) => {
                                const copy = JSON.parse(JSON.stringify(formData.manual_aplicacao!.passos));
                                copy[idx].dica_do_aplicador = e.target.value;
                                setFormData({
                                  ...formData,
                                  manual_aplicacao: {
                                    ...formData.manual_aplicacao!,
                                    passos: copy
                                  }
                                });
                              }}
                              placeholder="Ex: Não agite com força excessiva..."
                              className="w-full py-1.5 px-2 text-xs bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                              ⚠️ Atenção / Alerta (opcional):
                            </label>
                            <input
                              type="text"
                              value={step.alerta || ''}
                              onChange={(e) => {
                                const copy = JSON.parse(JSON.stringify(formData.manual_aplicacao!.passos));
                                copy[idx].alerta = e.target.value;
                                setFormData({
                                  ...formData,
                                  manual_aplicacao: {
                                    ...formData.manual_aplicacao!,
                                    passos: copy
                                  }
                                });
                              }}
                              placeholder="Ex: Não aplicar sob sol forte..."
                              className="w-full py-1.5 px-2 text-xs bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg text-rose-900 dark:text-rose-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  🐾 Pets & Crianças:
                </label>
                <textarea
                  rows={2}
                  value={formData.seguranca?.pets || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguranca: { ...formData.seguranca, pets: e.target.value }
                    })
                  }
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  🌧️ Chuva & Umidade:
                </label>
                <textarea
                  rows={2}
                  value={formData.seguranca?.chuva || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguranca: { ...formData.seguranca, chuva: e.target.value }
                    })
                  }
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  🕒 Horário Recomendado:
                </label>
                <input
                  type="text"
                  value={formData.seguranca?.horario || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguranca: { ...formData.seguranca, horario: e.target.value }
                    })
                  }
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  🧤 EPIs Necessários:
                </label>
                <input
                  type="text"
                  value={formData.seguranca?.epi || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguranca: { ...formData.seguranca, epi: e.target.value }
                    })
                  }
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>
          )}

          {activeTab === 'alvos' && (
            <div className="space-y-3">
              <form onSubmit={handleAddTarget} className="flex gap-2">
                <input
                  type="text"
                  value={newTargetInput}
                  onChange={(e) => setNewTargetInput(e.target.value)}
                  placeholder="Digitar novo alvo / praga (Ex: tiririca, lagarta)..."
                  className="flex-1 py-2 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Alvo</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                {(formData.alvos || []).map((alvo, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                  >
                    <span>{alvo}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTarget(idx)}
                      className="text-red-500 hover:text-red-700 ml-1 font-bold"
                      title="Remover alvo"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ FIXO COM SALVAR ALTERAÇÕES & CANCELAR */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Salvando na Nuvem...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
