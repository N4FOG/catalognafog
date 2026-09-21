import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-3">
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[rgba(15,69,49,0.08)] to-[rgba(16,185,129,0.05)] dark:from-[rgba(16,185,129,0.1)] dark:to-[rgba(15,69,49,0.15)] border border-[rgba(15,69,49,0.1)] dark:border-[rgba(16,185,129,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#eaf7f0] text-[#0f4531] dark:bg-[#14281f] dark:text-[#10b981] border border-[#10b981]/30">
              ✨ Orçamento Direto &amp; Rápido
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0f1f17] dark:text-[#edf5f0] tracking-tight leading-snug font-display">
              Monte seu pedido online.<br />
              <span className="text-[#0f4531] dark:text-[#10b981]">Receba a melhor proposta no WhatsApp.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#334e40] dark:text-[#9cb8a9] leading-relaxed">
              Selecione os produtos desejados, ajuste as quantidades e envie sua lista com 1 clique para nossa equipe comercial.
            </p>
          </div>

          {/* Desktop Stats Bubbles */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#0f1f17] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] text-center shadow-xs">
              <div className="font-display font-black text-xl text-[#0f4531] dark:text-[#10b981]">32</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-[#638573]">Produtos Oficiais</div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#0f1f17] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] text-center shadow-xs">
              <div className="font-display font-black text-xl text-[#0f4531] dark:text-[#10b981]">10</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-[#638573]">Linhas Especiais</div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#0f1f17] border border-[rgba(15,69,49,0.12)] dark:border-[rgba(16,185,129,0.2)] text-center shadow-xs">
              <div className="font-display font-black text-xl text-[#0f4531] dark:text-[#10b981]">100%</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-[#638573]">Garantia Técnica</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
