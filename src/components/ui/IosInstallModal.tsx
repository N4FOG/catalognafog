import React from 'react';
import { useCatalogStore } from '../../store/useCatalogStore';
import { Modal } from './Modal';
import { Share, PlusSquare, Smartphone } from 'lucide-react';

export const IosInstallModal: React.FC = () => {
  const { isIosInstallModalOpen, closeIosInstallModal } = useCatalogStore();

  if (!isIosInstallModalOpen) return null;

  return (
    <Modal
      isOpen={isIosInstallModalOpen}
      onClose={closeIosInstallModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-base">Instalar no iPhone / iPad</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Instale o <strong>Catálogo JCV Química</strong> no seu aparelho iOS para abrir direto em tela cheia como um aplicativo:
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200">
              Toque no botão de <strong>Compartilhar</strong> (<Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" />) na barra inferior do Safari.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200">
              Role o menu de opções para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-600 dark:text-slate-300" />).
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200">
              Confirme no canto superior direito tocando em <strong>"Adicionar"</strong>. Pronto!
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={closeIosInstallModal}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          Entendi
        </button>
      </div>
    </Modal>
  );
};
