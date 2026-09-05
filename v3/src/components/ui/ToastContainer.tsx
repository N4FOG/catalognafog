import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900/95 text-white border-slate-700';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950/95 text-emerald-100 border-emerald-700/60 shadow-emerald-950/50';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950/95 text-amber-100 border-amber-700/60 shadow-amber-950/50';
          Icon = AlertCircle;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-950/95 text-rose-100 border-rose-700/60 shadow-rose-950/50';
          Icon = XCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${bg}`}
          >
            <Icon className="w-5 h-5 shrink-0 opacity-90" />
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
