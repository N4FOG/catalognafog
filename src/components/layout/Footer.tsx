import React from 'react';
import { ShieldCheck, Phone, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const Footer: React.FC = () => {
  const { isInstalled, installApp } = usePWA();

  return (
    <footer className="no-print bg-slate-100 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 py-10 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner Baixar Aplicativo (PWA) — Visível tanto em Mobile quanto PC */}
        <div className="bg-gradient-to-r from-[#0f4531] via-[#13533b] to-[#0f4531] dark:from-[#09261b] dark:via-[#103827] dark:to-[#09261b] rounded-2xl p-5 sm:p-6 text-white border border-[#10b981]/30 shadow-lg shadow-[#0f4531]/10 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 dark:bg-[#10b981]/20 border border-white/20 dark:border-[#10b981]/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              📲
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm sm:text-base tracking-tight font-display text-white">
                  Instale o Aplicativo JCV Distribuidora
                </h4>
                {isInstalled && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981] text-[#09261b]">
                    <CheckCircle2 className="w-3 h-3" /> Instalado
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/85 leading-relaxed max-w-xl mt-1">
                Acesse o catálogo direto da tela inicial do seu celular ou computador. Rápido, leve e com consulta técnica garantida mesmo sem sinal de internet.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0 flex items-center justify-center">
            <button
              type="button"
              onClick={installApp}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0da572] active:scale-95 text-[#09261b] font-black text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#09261b]" />
                  <span>Aplicativo Instalado</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#09261b]" />
                  <span>Baixar Aplicativo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informações Institucionais e Suporte */}
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
                href="https://api.whatsapp.com/send?phone=554599781407"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                (45) 9 9781-407
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

        {/* Rodapé inferior / Versão */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p className="text-center sm:text-left">© 2026 JCV Distribuidora / Rawell Química — Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">v7.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
