import React, { useState } from 'react';
import { VENDEDORES } from '../../data/config';
import { useSellerStore } from '../../store/useSellerStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { triggerHaptic } from '../../utils/haptics';
import { KeyRound, ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

export const SellerLoginModal: React.FC = () => {
  const {
    isSellerModalOpen,
    closeSellerModal,
    openAdminDashboard,
    openSellerAppModal
  } = useCatalogStore();

  const { login } = useSellerStore();
  const { loginAdmin } = useAdminStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isSellerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(25);

    const userTrim = username.trim();
    const passTrim = password.trim();

    if (!userTrim) {
      addToast('⚠️ Por favor, informe seu usuário ou e-mail.', 'warning');
      return;
    }

    if (!passTrim) {
      addToast('⚠️ Por favor, digite sua senha de acesso.', 'warning');
      return;
    }

    // 1. Verificação se é o Administrador Master (Dono)
    if (userTrim.toLowerCase() === 'jcvadmin') {
      const ok = loginAdmin(userTrim, passTrim);
      if (ok) {
        closeSellerModal();
        setUsername('');
        setPassword('');
        addToast('👑 Acesso concedido! Bem-vindo ao Painel Administrativo Master.', 'success');
        openAdminDashboard();

        sendTelemetry({
          evento: 'Login no Painel Administrativo',
          origem_canal: '👑 Administrador Master',
          vendedor: 'jcvadmin',
          vendedor_nome: 'Administrador JCV',
          detalhes_extras: 'Admin autenticado com credenciais mestre'
        });
        return;
      } else {
        addToast('❌ Senha de Administrador incorreta!', 'error');
        return;
      }
    }

    // 2. Verificação se é Representante / Vendedor
    const foundSeller = VENDEDORES.find(
      (v) =>
        v.id.toLowerCase() === userTrim.toLowerCase() ||
        v.nome.toLowerCase().includes(userTrim.toLowerCase())
    );

    if (foundSeller && foundSeller.id) {
      login(foundSeller.nome, foundSeller.id);
      closeSellerModal();
      setUsername('');
      setPassword('');

      addToast(
        `🎉 Bem-vindo(a), ${foundSeller.nome}! Modo Representante ativado.`,
        'success'
      );
      openSellerAppModal('quotes');

      sendTelemetry({
        evento: 'Login no Modo Vendedor',
        origem_canal: `🟢👔 Vendedor Entrou (${foundSeller.nome})`,
        vendedor: foundSeller.nome,
        vendedor_nome: foundSeller.nome,
        detalhes_extras: `Representante autenticado (${foundSeller.id})`
      });
      return;
    }

    // Caso o usuário tenha digitado outro nome/código
    addToast('⚠️ Usuário ou credencial não reconhecida. Verifique os dados.', 'warning');
  };

  const handleSelectQuickSeller = (sellerId: string) => {
    setUsername(sellerId);
  };

  return (
    <Modal
      isOpen={isSellerModalOpen}
      onClose={closeSellerModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-emerald-700/30 bg-black flex items-center justify-center">
            <img src="img/logo.png" alt="JCV Jardinagem" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-extrabold text-base leading-tight">Acesso Restrito</h3>
            <span className="text-[11px] text-slate-500 font-medium block">
              Painel Administrativo & Representantes
            </span>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
            Informe suas credenciais. O sistema reconhece automaticamente o nível de acesso (
            <strong className="text-emerald-700 dark:text-emerald-400">Administrador Master</strong> ou{' '}
            <strong className="text-slate-700 dark:text-slate-200">Representante Comercial</strong>).
          </p>
        </div>

        {/* Input Usuário */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Usuário / Identificação:
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: jcvadmin ou carlos"
              className="w-full pl-9 pr-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>

        {/* Input Senha */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Senha de Acesso:
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha..."
              className="w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Atalhos Rápidos para Representantes */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Atalho rápido para representantes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VENDEDORES.filter((v) => v.id).map((v) => (
              <button
                type="button"
                key={v.id}
                onClick={() => handleSelectQuickSeller(v.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  username === v.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {v.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Botão de Entrar */}
        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Autenticar e Entrar</span>
        </button>
      </form>
    </Modal>
  );
};
