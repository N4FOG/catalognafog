import React, { useState } from 'react';
import { VENDEDORES } from '../../data/config';
import { useSellerStore } from '../../store/useSellerStore';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { triggerHaptic } from '../../utils/haptics';
import { Lock, UserCheck, KeyRound, ShieldAlert } from 'lucide-react';
import { sendTelemetry } from '../../utils/telemetry';

export const SellerLoginModal: React.FC = () => {
  const { isSellerModalOpen, closeSellerModal } = useCatalogStore();
  const { login } = useSellerStore();
  const { addToast } = useToastStore();

  const [selectedSellerId, setSelectedSellerId] = useState(VENDEDORES[1]?.id || 'carlos');
  const [pin, setPin] = useState('');

  if (!isSellerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(25);

    if (!pin.trim()) {
      addToast('⚠️ Por favor, informe seu PIN de acesso.', 'warning');
      return;
    }

    const sellerObj = VENDEDORES.find((v) => v.id === selectedSellerId) || VENDEDORES[1];
    login(sellerObj.nome, sellerObj.id);
    closeSellerModal();
    setPin('');

    addToast(`🎉 Bem-vindo(a), ${sellerObj.nome}! Modo Vendedor ativado com preços e descontos.`, 'success');

    sendTelemetry({
      evento: 'Login no Modo Vendedor',
      origem_canal: `🟢👔 Vendedor Entrou (${sellerObj.nome})`,
      vendedor: sellerObj.nome,
      vendedor_nome: sellerObj.nome,
      detalhes_extras: 'Representante autenticou-se via PIN'
    });
  };

  return (
    <Modal
      isOpen={isSellerModalOpen}
      onClose={closeSellerModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Lock className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">Área do Representante</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-snug">
            Acesso restrito para representantes e equipe comercial. Permite visualizar preços de tabela, aplicar descontos e emitir propostas oficiais.
          </p>
        </div>

        {/* Representative Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Selecione o Representante:
          </label>
          <select
            value={selectedSellerId}
            onChange={(e) => setSelectedSellerId(e.target.value)}
            className="w-full py-2.5 px-3 text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {VENDEDORES.filter((v) => v.id).map((v) => (
              <option key={v.id} value={v.id}>
                {v.nome} ({v.id})
              </option>
            ))}
          </select>
        </div>

        {/* PIN Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            PIN de Acesso:
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Digite o PIN comercial..."
              className="w-full pl-9 pr-3 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>Acessar Painel Comercial</span>
        </button>
      </form>
    </Modal>
  );
};
