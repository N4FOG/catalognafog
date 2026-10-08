import React from 'react';
import { ShieldCheck, Phone, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-slate-100 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 py-10 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-emerald-700/30 bg-black flex items-center justify-center">
                <img src="img/logo.png" alt="JCV Distribuidora" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                JCV Distribuidora & Agro
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Linha oficial de defensivos, herbicidas seletivos e adjuvantes de alta performance. Catálogo técnico & sistema de orçamentos 2026.
            </p>
          </div>

          {/* Direct Support Col */}
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <h5 className="font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 text-[11px]">
              Atendimento Comercial:
            </h5>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Oficial: </span>
              <a
                href="https://api.whatsapp.com/send?phone=5545999781407"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                (45) 9 9978-1407
              </a>
            </p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantia de Qualidade & Registro Oficial</span>
            </p>
          </div>

          {/* Quick Notice */}
          <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <h5 className="font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 text-[11px]">
              Segurança no Uso:
            </h5>
            <p className="leading-relaxed">
              Siga sempre as recomendações de dosagem, use EPIs adequados durante a pulverização e respeite o período de carência para pets e crianças.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p className="text-center sm:text-left">© 2026 JCV Distribuidora / Rawell Química — Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">v6.1.0</span>
            <span className="hidden sm:inline text-slate-400"> • React 19 + TypeScript + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
