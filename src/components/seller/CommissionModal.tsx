import React, { useState } from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { useSellerStore } from '../../store/useSellerStore';
import { useToastStore } from '../../store/useToastStore';
import { Modal } from '../ui/Modal';
import { triggerHaptic } from '../../utils/haptics';
import { Link2, Copy, Check } from 'lucide-react';

export const CommissionModal: React.FC = () => {
  const { isCommissionModalOpen, closeCommissionModal } = useCatalogStore();
  const { session, getActiveSeller } = useSellerStore();
  const { addToast } = useToastStore();

  const [copied, setCopied] = useState(false);

  if (!isCommissionModalOpen) return null;

  const seller = getActiveSeller();
  const sellerCode = session?.vendedorId || seller.id || 'carlos';
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const commissionUrl = `${baseUrl}?vendedor=${sellerCode}`;

  const handleCopy = () => {
    triggerHaptic(15);
    navigator.clipboard.writeText(commissionUrl);
    setCopied(true);
    addToast('🔗 Link comissionado copiado com sucesso!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isCommissionModalOpen}
      onClose={closeCommissionModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Link2 className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">Link de Indicação & Comissão</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Compartilhe este link com seus clientes. Qualquer orçamento solicitado através dele será automaticamente vinculado ao seu nome (<strong>{seller.nome}</strong>) na auditoria do Google Sheets e no WhatsApp.
        </p>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate select-all">
            {commissionUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 shadow-sm transition-colors"
            title="Copiar link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copiado!' : 'Copiar Link para Enviar'}</span>
        </button>
      </div>
    </Modal>
  );
};
