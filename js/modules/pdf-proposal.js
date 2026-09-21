// ═══════════════════════════════════════════════════════════════
//  PROPOSTA COMERCIAL EM PDF TIMBRADO (COM / SEM VALORES)
// ═══════════════════════════════════════════════════════════════

function openPdfProposalModal(includePrices = true) {
  hapticFeedback(30);
  if (!cartItems.length) {
    showToast('⚠️ Adicione itens ao orçamento primeiro.');
    return;
  }

  const nameInput = document.getElementById('client-name');
  const docInput = document.getElementById('client-doc');

  const clienteNome = (nameInput && nameInput.value.trim()) || 'Cliente / Empresa Não Informado';
  const clienteDoc = (docInput && docInput.value.trim()) || 'Não informado';

  const vendedorObj = getActiveSellerObj();
  const vendedorNome = vendedorObj ? vendedorObj.nome : 'Atendimento Geral';

  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const orcNum = 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);
  const isSeller = isSellerLoggedIn() && includePrices;
  const shareUrl = generateCartShareUrl(includePrices);

  const {
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    qtdTiposSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal,
    totalQtd
  } = calculateCartTotals();

  saveQuoteToHistory({
    id: orcNum,
    data: `${dataAtual} às ${horaAtual}`,
    timestamp: Date.now(),
    cliente: clienteNome,
    doc: clienteDoc,
    vendedorId: vendedorObj.id,
    vendedorNome: vendedorNome,
    itens: cartItems.map(i => ({
      id: i.id,
      nome: i.nome,
      referencia: i.referencia,
      unidade: i.unidade,
      imagem: i.imagem,
      quantidade: i.quantidade,
      preco_base: i.preco_base || 0,
      preco_unitario: (i.preco_unitario !== undefined) ? i.preco_unitario : (i.preco_base || 0),
      desconto_percent: i.desconto_percent || 0
    })),
    totalQtd: totalQtd,
    valorTotal: isSeller ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : '',
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal,
    status: 'aguardando',
    shareUrl: shareUrl
  });

  logSellerActivity(includePrices ? 'Geração de Proposta PDF COM PREÇO' : 'Geração de Proposta PDF SEM PREÇO', {
    num_proposta: orcNum,
    cliente_nome: clienteNome,
    cliente_doc: clienteDoc,
    total_itens: totalQtd,
    valor_total: isSeller ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : '-',
    resumo_itens: cartItems.map(i => `${i.quantidade}x ${i.nome}`).join(', '),
    link_proposta: shareUrl,
    detalhes_extras: `Total Líquido: R$ ${totalFinalLiquido.toFixed(2)} | Economia: R$ ${economiaTotalReal.toFixed(2)}`
  });

  const { pagamento, validade } = isSeller ? getCommercialTerms() : {};
  renderPdfPaperContent({
    orcNum,
    showPrices: isSeller,
    dataAtual,
    horaAtual,
    clienteNome,
    clienteDoc,
    vendedorNome,
    itemsList: cartItems,
    shareUrl,
    isSeller,
    pagamento,
    validade,
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal
  });

  document.getElementById('pdf-modal-backdrop')?.classList.add('show');
}

function closePdfProposalModal() {
  document.getElementById('pdf-modal-backdrop')?.classList.remove('show');
}

function printPdfProposal() {
  window.print();
}

function renderPdfPaperContent(data) {
  const paper = document.getElementById('pdf-paper-content');
  if (!paper) return;

  const showPrices = (data.showPrices !== undefined) ? data.showPrices : (data.isSeller && (data.showPrices !== false));
  const subtotalItensSemDesconto = data.subtotalItensSemDesconto || 0;
  const subtotalItensComDesconto = data.subtotalItensComDesconto || 0;
  const descontoTotalItens = data.descontoTotalItens || 0;
  const discGlobalPercent = data.discGlobalPercent || 0;
  const valorDescontoGlobal = data.valorDescontoGlobal || 0;
  const totalFinalLiquido = data.totalFinalLiquido || 0;
  const economiaTotalReal = data.economiaTotalReal || 0;
  const percentualEconomiaTotal = data.percentualEconomiaTotal || 0;

  const safeClienteNome = typeof escapeHtml === 'function' ? escapeHtml(data.clienteNome) : data.clienteNome;
  const safeClienteDoc = typeof escapeHtml === 'function' ? escapeHtml(data.clienteDoc) : data.clienteDoc;
  const safeVendedorNome = typeof escapeHtml === 'function' ? escapeHtml(data.vendedorNome) : data.vendedorNome;
  const safePagamento = typeof escapeHtml === 'function' ? escapeHtml(data.pagamento) : data.pagamento;
  const safeValidade = typeof escapeHtml === 'function' ? escapeHtml(data.validade) : data.validade;
  const safeOrcNum = typeof escapeHtml === 'function' ? escapeHtml(data.orcNum) : data.orcNum;
  const safeShareUrl = typeof escapeHtml === 'function' ? escapeHtml(data.shareUrl) : data.shareUrl;

  paper.innerHTML = `
    <div class="pdf-doc-head">
      <div>
        <div style="font-size:22px; font-weight:800; color:#0f4531; display:flex; align-items:center; gap:8px;">
          <span>🌿</span> JCV Química
        </div>
        <div style="font-size:12px; color:#64748b; margin-top:2px;">Catálogo de Produtos &amp; Defensivos Especializados (Revenda Rawell)</div>
        <div style="font-size:11px; color:#64748b;">WhatsApp Comercial: (45) 9978-1407 • Paraná — Brasil</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:15px; font-weight:800; color:#0f4531;">PROPOSTA COMERCIAL</div>
        <div style="font-size:13px; font-weight:700; color:#2563eb;">Nº ${safeOrcNum}</div>
        <div style="font-size:11px; color:#64748b;">Emissão: ${data.dataAtual} ${data.horaAtual ? 'às ' + data.horaAtual : ''}</div>
      </div>
    </div>

    <!-- Dados do Cliente & Vendedor -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:20px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div>
        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Dados do Cliente / Solicitante</div>
        <div style="font-size:14px; font-weight:800; color:#0f1f17; margin-top:2px;">${safeClienteNome}</div>
        <div style="font-size:12px; color:#475569;">Documento / Cidade: ${safeClienteDoc}</div>
      </div>
      <div>
        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Responsável Comercial</div>
        <div style="font-size:14px; font-weight:800; color:#0f4531; margin-top:2px;">${safeVendedorNome}</div>
        <div style="font-size:12px; color:#475569;">Central de Vendas e Atendimento Técnico</div>
      </div>
    </div>

    <!-- Tabela de Produtos -->
    <table class="pdf-table">
      <thead>
        <tr>
          <th style="width:36px; text-align:center;">#</th>
          <th style="width:80px;">Código</th>
          <th>Produto &amp; Descrição Técnica</th>
          <th style="width:90px;">Embalagem</th>
          <th style="width:60px; text-align:center;">Qtd.</th>
          ${showPrices ? `
            <th style="width:125px; text-align:right;">Valor Unit.</th>
            <th style="width:115px; text-align:right;">Total Líquido</th>
          ` : ''}
        </tr>
      </thead>
      <tbody>
        ${data.itemsList.map((item, idx) => {
          const p = PRODUTOS.find(prod => prod.id === item.id);
          const packTag = (p && p.unidade) ? p.unidade.toUpperCase() : 'UN';
          const oQueFaz = (p && p.o_que_faz) ? p.o_que_faz : '';
          const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || (p ? p.preco_base : 0) || 0);
          const discItemPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
          const pUnitDesc = pUnit * (1 - (discItemPercent / 100));
          const subtotalItem = item.quantidade * pUnitDesc;

          return `
            <tr>
              <td style="text-align:center; font-weight:700; color:#64748b;">${idx + 1}</td>
              <td style="font-family:monospace; font-weight:700; color:#0f4531;">${item.referencia}</td>
              <td>
                <strong style="color:#0f1f17; font-size:13px;">${item.nome}</strong>
                ${oQueFaz ? `<div style="font-size:11px; color:#475569; margin-top:2px;">⚡ ${oQueFaz}</div>` : ''}
              </td>
              <td>${packTag}</td>
              <td style="text-align:center; font-weight:800; font-size:13.5px; color:#0f4531;">${item.quantidade}</td>
              ${showPrices ? `
                <td style="text-align:right; font-size:12.5px; color:#334155;">
                  ${discItemPercent > 0 ? `
                    <div style="font-size:11px; text-decoration:line-through; color:#94a3b8;">R$ ${pUnit.toFixed(2).replace('.', ',')}</div>
                    <div style="color:#059669; font-weight:800;">R$ ${pUnitDesc.toFixed(2).replace('.', ',')} <span style="font-size:10px;">(-${discItemPercent.toFixed(0)}%)</span></div>
                  ` : `
                    <span style="font-weight:700;">R$ ${pUnit.toFixed(2).replace('.', ',')}</span>
                  `}
                </td>
                <td style="text-align:right; font-weight:800; font-size:13.5px; color:#0f4531;">R$ ${subtotalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              ` : ''}
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <!-- Resumo & Observações -->
    <div class="pdf-footer-terms">
      <div style="background:#f8fafc; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: ${showPrices && economiaTotalReal > 0.01 ? '8px' : '0'}; flex-wrap:wrap; gap:8px;">
          <span style="font-weight:700; color:#0f1f17;">Total de Itens: <strong>${data.itemsList.reduce((acc, i) => acc + i.quantidade, 0)} unidades</strong></span>
          ${showPrices && economiaTotalReal <= 0.01 ? `
            <div style="font-size:16px; font-weight:800; color:#0f4531;">
              VALOR TOTAL DA PROPOSTA: R$ ${totalFinalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          ` : ''}
        </div>

        ${showPrices && economiaTotalReal > 0.01 ? `
          <div style="border-top:1px dashed #cbd5e1; padding-top:8px; display:flex; flex-direction:column; gap:4px;">
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#475569;">
              <span>Subtotal dos Produtos:</span>
              <strong>R$ ${subtotalItensSemDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            ${descontoTotalItens > 0.01 ? `
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#059669; font-weight:600;">
                <span>Desconto Aplicado nos Produtos:</span>
                <span>-R$ ${descontoTotalItens.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#475569;">
                <span>Subtotal c/ Desconto dos Itens:</span>
                <strong>R$ ${subtotalItensComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
            ` : ''}
            ${discGlobalPercent > 0 && valorDescontoGlobal > 0 ? `
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#059669; font-weight:700;">
                <span>Desconto Comercial no Fechamento (${discGlobalPercent.toFixed(1)}% sobre itens s/ desc.):</span>
                <span>-R$ ${valorDescontoGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; font-size:12.5px; color:#0f4531; font-weight:800; background:#dcfce7; padding:5px 10px; border-radius:6px; margin:4px 0;">
              <span>🎉 ECONOMIA TOTAL DO CLIENTE:</span>
              <span>R$ ${economiaTotalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentualEconomiaTotal.toFixed(1)}% OFF)</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1.5px solid #0f4531; padding-top:6px; margin-top:3px;">
              <span style="font-size:13px; font-weight:800; color:#0f1f17;">VALOR TOTAL LÍQUIDO DA PROPOSTA:</span>
              <strong style="font-size:18px; color:#0f4531; font-weight:800;">R$ ${totalFinalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>
        ` : ''}
      </div>

      ${showPrices ? `
        <!-- Caixa de Destaque das Condições Comerciais -->
        <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:10px 14px; margin-bottom:12px; display:grid; grid-template-columns: ${data.pagamento ? '1.5fr 1fr' : '1fr'}; gap:10px; font-size:12px;">
          ${data.pagamento ? `
            <div>
              <span style="color:#065f46; font-weight:700; font-size:11px; text-transform:uppercase;">Condição de Pagamento</span>
              <div style="font-weight:800; color:#0f4531; margin-top:1px;">💳 ${data.pagamento}</div>
            </div>
          ` : ''}
          <div>
            <span style="color:#065f46; font-weight:700; font-size:11px; text-transform:uppercase;">Validade da Proposta</span>
            <div style="font-weight:800; color:#0f4531; margin-top:1px;">📅 ${data.validade || '10 dias'}</div>
          </div>
        </div>
      ` : ''}

      <div style="background:#f1f5f9; padding:10px 14px; border-radius:6px; margin-bottom:12px; font-size:11.5px; color:#334155;">
        <strong>📌 Termos &amp; Condições Gerais:</strong><br>
        1. Proposta comercial gerada eletronicamente pelo Catálogo JCV Química (Revenda Autorizada Rawell Química).<br>
        2. Faturamento direto ou via distribuidor autorizado conforme disponibilidade logística regional.<br>
        3. Para pedidos de caixas fechadas ou cargas completas, consulte bonificações por volume.
      </div>
      <div style="font-size:11px; color:#64748b; word-break:break-all;">
        🔗 <strong>Link Direto deste Orçamento:</strong> <a href="${data.shareUrl}" target="_blank" style="color:#2563eb;">${data.shareUrl}</a>
      </div>
    </div>
  `;
}