import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { triggerHaptic } from '../../utils/haptics';
import { exportCatalogToSheet } from '../../utils/catalogSheetExport';
import {
  Package,
  Users,
  BarChart3,
  LogOut,
  RefreshCw,
  Sparkles,
  ArrowRight,
  FileSpreadsheet,
  Loader2,
  Shield,
  ShieldAlert,
  ArrowDownToLine,
  RotateCcw
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminDashboardOpen,
    closeAdminDashboard,
    openAdminProductsList
  } = useCatalogStore();

  const {
    isAdminLoggedIn,
    adminSession,
    logoutAdmin,
    products,
    backups,
    isSyncingCloud,
    syncWithCloud
  } = useAdminStore();

  const { addToast } = useToastStore();
  const [isExporting, setIsExporting] = useState(false);

  if (!isAdminDashboardOpen || !isAdminLoggedIn) return null;

  const handleLogout = () => {
    triggerHaptic(20);
    logoutAdmin();
    closeAdminDashboard();
    addToast('👋 Sessão de Administrador encerrada.', 'info');
  };

  const handleSyncCloud = async () => {
    triggerHaptic(15);
    const ok = await syncWithCloud();
    if (ok) {
      addToast('☁️ Catálogo sincronizado com a nuvem Google Sheets!', 'success');
    } else {
      addToast('⚠️ Não foi possível sincronizar no momento. Mantendo versão local.', 'warning');
    }
  };

  const handleOpenProducts = () => {
    triggerHaptic(20);
    closeAdminDashboard();
    openAdminProductsList();
  };

  const handleExportSheet = async () => {
    if (isExporting) return;
    triggerHaptic(15);
    setIsExporting(true);
    try {
      const result = await exportCatalogToSheet(products, adminSession?.username || 'jcvadmin');
      if (result.ok) {
        addToast(
          `📊 Exportados ${result.rows} produtos × ${result.cols} colunas para a aba Produtos_Catalogo!`,
          'success',
          5000
        );
      } else {
        addToast(`⚠️ ${result.message}`, 'warning', 5000);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const { captureFromSheet, makeBackupNow, restoreEmergencyBackup } = useAdminStore();

  const handleCaptureFromSheet = async () => {
    triggerHaptic(15);
    try {
      const result = await captureFromSheet();
      if (result.ok) {
        addToast(
          `📥 Capturados ${result.count} produtos da planilha! ${result.message}`,
          'success',
          6000
        );
      } else {
        addToast(`⚠️ ${result.message}`, 'warning', 5000);
      }
    } catch (err) {
      addToast(`⚠️ Erro ao capturar: ${err instanceof Error ? err.message : 'erro desconhecido'}`, 'warning', 5000);
    }
  };

  const handleMakeBackupNow = async () => {
    triggerHaptic(15);
    try {
      const result = await makeBackupNow();
      if (result.ok) {
        addToast(
          `💾 Backup de emergência salvo! ${result.message}`,
          'success',
          4000
        );
      } else {
        addToast(`⚠️ ${result.message}`, 'warning', 5000);
      }
    } catch (err) {
      addToast(`⚠️ Erro ao salvar backup: ${err instanceof Error ? err.message : 'erro desconhecido'}`, 'warning', 5000);
    }
  };

  const handleRestoreEmergencyBackup = async (backupId?: string) => {
    triggerHaptic(15);
    try {
      const result = await restoreEmergencyBackup(backupId);
      if (result.ok) {
        addToast(
          `🔄 Backup restaurado com sucesso! ${result.message}`,
          'success',
          5000
        );
      } else {
        addToast(`⚠️ ${result.message}`, 'warning', 5000);
      }
    } catch (err) {
      addToast(`⚠️ Erro ao restaurar: ${err instanceof Error ? err.message : 'erro desconhecido'}`, 'warning', 5000);
    }
  };

  return (
    <Modal
      isOpen={isAdminDashboardOpen}
      onClose={closeAdminDashboard}
      maxWidth="2xl"
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-emerald-600/50 bg-black flex items-center justify-center shadow-sm">
              <img src="img/logo.png" alt="JCV Distribuidora" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                Painel Administrativo Master
              </h2>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Logado como: {adminSession?.username || 'jcvadmin'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSheet}
              disabled={isExporting}
              title="Exportar todos os produtos (linha a linha, coluna por coluna) para a aba Produtos_Catalogo do Google Sheets"
              className="px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-400 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isExporting ? 'Exportando…' : 'Exportar p/ Planilha'}
              </span>
            </button>

            <button
              onClick={handleSyncCloud}
              disabled={isSyncingCloud}
              title="Sincronizar com Google Sheets"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Banner Informativo */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Central de Gerenciamento do Site
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Bem-vindo ao Controle Geral JCV Distribuidora
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed max-w-xl">
              As alterações salvas no catálogo de produtos são propagadas automaticamente para todos os visitantes e representantes através da sincronização em nuvem.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-700/50 flex flex-wrap gap-4 text-xs font-semibold text-emerald-100">
            <div>📦 Total de Produtos: <span className="text-white font-extrabold">{products.length}</span></div>
            <div>🕒 Backups Registrados: <span className="text-white font-extrabold">{backups.length}</span></div>
          </div>
        </div>

        {/* Grid de Cards de Funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* CARD 1: EDITAR PRODUTOS (ATIVO) */}
          <div
            onClick={handleOpenProducts}
            className="group relative p-4 rounded-2xl border-2 border-emerald-500/60 hover:border-emerald-600 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Editar Produtos
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Edite preços, estoque, bula, alvos e imagens com visão real do cliente e histórico de backups.
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>Abrir Catálogo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CARD 2: GESTÃO DE REPRESENTANTES (EM DESENVOLVIMENTO) */}
          <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-80 flex flex-col justify-between">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Em Breve
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm mb-1">
                Gestão de Representantes
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-snug">
                Cadastrar novos vendedores, definir metas de venda, WhatsApp oficial e tabelas de comissão.
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
              ⚙️ Funcionalidade em Desenvolvimento
            </div>
          </div>

          {/* CARD 3: RELATÓRIOS & TELEMETRIA (EM DESENVOLVIMENTO) */}
          <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-80 flex flex-col justify-between">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              Em Breve
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm mb-1">
                Relatórios & Telemetria
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-snug">
                Análise em tempo real de termos mais buscados, orçamentos gerados e conversão por canal.
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
              📊 Funcionalidade em Desenvolvimento
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SEÇÃO DE SINCRONIZAÇÃO COM GOOGLE SHEETS (FASE 2)
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sincronização Bidirecional
            </span>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CAPTURAR DA PLANILHA */}
            <button
              onClick={handleCaptureFromSheet}
              className="group relative p-4 rounded-2xl border-2 border-indigo-500/60 hover:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                  Capturar da Planilha
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Lê os dados da aba Produtos_Catalogo e atualiza o catálogo local com merge inteligente.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
                <span>Baixar alterações</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* FAZER BACKUP AGORA */}
            <button
              onClick={handleMakeBackupNow}
              className="group relative p-4 rounded-2xl border-2 border-amber-500/60 hover:border-amber-600 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                  Fazer Backup Agora
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Salva um snapshot de emergência da planilha antes de qualquer captura ou alteração.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>Proteger dados</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* RESTAURAR BACKUP DE EMERGÊNCIA */}
            <button
              onClick={() => handleRestoreEmergencyBackup()}
              className="group relative p-4 rounded-2xl border-2 border-red-500/60 hover:border-red-600 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-700 dark:text-red-400 mb-3 group-hover:scale-105 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                  Restaurar Backup
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Volta ao último backup de emergência salvo. Use em caso de erro ou perda de dados.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-400">
                <span>Emergência</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Estado da última captura */}
          {(() => {
            const { lastCaptureTimestamp, lastCaptureBackupId } = useAdminStore();
            const lastSync = lastCaptureTimestamp;
            const lastBackupId = lastCaptureBackupId;
            if (!lastSync) return null;
            return (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">Última Captura:</span>
                </div>
                <div className="space-y-0.5">
                  <div>🕐 {new Date(lastSync).toLocaleString('pt-BR')}</div>
                  {lastBackupId && <div>💾 Backup ID: <code>{lastBackupId}</code></div>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </Modal>
  );
};
