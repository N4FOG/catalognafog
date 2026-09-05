// ═══════════════════════════════════════════════════════════════
//  ENVIO DE ORÇAMENTO / COTAÇÃO VIA WHATSAPP
// ═══════════════════════════════════════════════════════════════
let currentClientWaMode = true; // true = com preço, false = sem preço

function openClientWhatsAppModal(includePrices = true) {
  hapticFeedback(25);
  if (!cartItems.length) {
    showToast('⚠️ Seu orçamento está vazio.');
    return;
  }

  currentClientWaMode = includePrices;
  const badge = document.getElementById('client-wa-mode-badge');
  const inputPhone = document.getElementById('input-client-wa-number');

  if (badge) {
    if (includePrices) {
      badge.style.background = 'rgba(16, 185, 129, 0.15)';
      badge.style.border = '1px solid rgba(16, 185, 129, 0.4)';
      badge.style.color = '#059669';
      badge.innerHTML = '💰 <span>Mensagem <strong>COM PREÇOS</strong> e Descontos Negociados</span>';
    } else {
      badge.style.background = 'var(--bg-card-sub)';
      badge.style.border = '1px solid var(--border)';
      badge.style.color = 'var(--text-2)';
      badge.innerHTML = '📋 <span>Mensagem <strong>SEM PREÇOS</strong> (Apenas Lista de Produtos)</span>';
    }
  }

  // Tenta resgatar telefone previamente usado
  try {
    const savedPhone = localStorage.getItem('rawell_last_client_phone') || '';
    if (inputPhone && savedPhone) {
      inputPhone.value = savedPhone;
    }
  } catch(e) {}

  document.getElementById('client-wa-modal-backdrop')?.classList.add('show');
  setTimeout(() => inputPhone?.focus(), 150);
}

function closeClientWhatsAppModal() {
  document.getElementById('client-wa-modal-backdrop')?.classList.remove('show');
}

function handleDirectClientWhatsAppSubmit(event) {
  if (event) event.preventDefault();
  hapticFeedback(35);

  const inputPhone = document.getElementById('input-client-wa-number');
  const rawPhone = inputPhone ? inputPhone.value.trim() : '';

  if (!rawPhone) {
    showToast('⚠️ Por favor, informe o número de WhatsApp do cliente.');
    inputPhone?.focus();
    return;
  }

  const cleanDigits = rawPhone.replace(/\D/g, '');
  if (cleanDigits.length < 10) {
    showToast('⚠️ Número inválido. Digite o DDD + Número (ex: 45 99999-8888).');
    inputPhone?.focus();
    return;
  }

  try {
    localStorage.setItem('rawell_last_client_phone', rawPhone);
  } catch(e) {}

  closeClientWhatsAppModal();
  sendQuoteToCustomWhatsApp(cleanDigits, currentClientWaMode);
}

function sendQuoteToCustomWhatsApp(phoneDigits, includePrices = true) {
  const isSeller = isSellerLoggedIn();
  const nameInput = document.getElementById('client-name');
  const docInput = document.getElementById('client-doc');
  const nome = (nameInput && nameInput.value.trim()) || 'Cliente';
  const doc = (docInput && docInput.value.trim()) || '';

  const vendedorObj = getActiveSellerObj();
  const destWhatsapp = phoneDigits.startsWith('55') ? phoneDigits : ('55' + phoneDigits);

  const shareUrl = generateCartShareUrl(includePrices);
  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const orcNum = 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);

  const {
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
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
    cliente: nome,
    doc: doc,
    vendedorId: vendedorObj.id,
    vendedorNome: vendedorObj.nome,
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
    valorTotal: includePrices ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : '',
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

  const totalFormatado = includePrices ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : '-';
  logSellerActivity(includePrices ? `📱 Enviou Whats Cliente COM PREÇO (${destWhatsapp})` : `📱 Enviou Whats Cliente SEM PREÇO (${destWhatsapp})`, {
    num_proposta: orcNum,
    cliente_nome: nome,
    cliente_doc: doc,
    total_itens: totalQtd,
    valor_total: totalFormatado,
    resumo_itens: cartItems.map(i => `${i.quantidade}x ${i.nome}`).join(', '),
    link_proposta: shareUrl,
    detalhes_extras: `Destino WhatsApp Cliente: ${destWhatsapp} | Modo: ${includePrices ? 'Com Preço' : 'Sem Preço'}`
  });

  let msg = `🌿 *${CONFIG.empresa}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *PROPOSTA / ORÇAMENTO (Nº ${orcNum})*\n\n`;

  cartItems.forEach((item, index) => {
    const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || 0);
    const discItemPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
    const pUnitDesc = pUnit * (1 - (discItemPercent / 100));
    const subtotalItem = item.quantidade * pUnitDesc;

    msg += `*${index + 1}. ${item.nome}*\n`;
    msg += `   • Ref: \`${item.referencia}\`\n`;
    msg += `   • Quantidade: *${item.quantidade} ${item.unidade || 'unidade'}(s)*\n`;

    if (includePrices && pUnit > 0) {
      if (discItemPercent > 0) {
        msg += `   • Valor Unit.: R$ ${pUnit.toFixed(2).replace('.', ',')}\n`;
        msg += `   • Desconto no Item: *${discItemPercent.toFixed(1)}%* (-R$ ${(pUnit * (discItemPercent / 100)).toFixed(2).replace('.', ',')}/un)\n`;
        msg += `   • Valor Unit. c/ Desconto: *R$ ${pUnitDesc.toFixed(2).replace('.', ',')}* (Subtotal: *R$ ${subtotalItem.toFixed(2).replace('.', ',')}*)\n`;
      } else {
        msg += `   • Valor Unit.: R$ ${pUnit.toFixed(2).replace('.', ',')} (Subtotal: R$ ${subtotalItem.toFixed(2).replace('.', ',')})\n`;
      }
    }
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (includePrices) {
    if (economiaTotalReal > 0.01) {
      msg += `💰 *Subtotal dos Produtos:* R$ ${subtotalItensSemDesconto.toFixed(2).replace('.', ',')}\n`;
      if (descontoTotalItens > 0.01) {
        msg += `🏷️ *Descontos nos Produtos:* -R$ ${descontoTotalItens.toFixed(2).replace('.', ',')}\n`;
        msg += `📦 *Subtotal c/ Desc. dos Itens:* R$ ${subtotalItensComDesconto.toFixed(2).replace('.', ',')}\n`;
      }
      if (discGlobalPercent > 0 && valorDescontoGlobal > 0) {
        msg += `🏷️ *Desconto no Pedido (${discGlobalPercent.toFixed(1)}% s/ itens s/ desc.):* -R$ ${valorDescontoGlobal.toFixed(2).replace('.', ',')}\n`;
      }
      msg += `🎉 *ECONOMIA TOTAL DO CLIENTE:* *R$ ${economiaTotalReal.toFixed(2).replace('.', ',')} (${percentualEconomiaTotal.toFixed(1)}% OFF)*\n`;
      msg += `💳 *TOTAL FINAL DA PROPOSTA:* *R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}*\n`;
    } else {
      msg += `💳 *TOTAL DA PROPOSTA:* *R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}*\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  }

  msg += `👤 *Cliente:* ${nome}\n`;
  if (vendedorObj && vendedorObj.id) {
    msg += `👔 *Vendedor Responsável:* ${vendedorObj.nome}\n`;
  }
  if (doc) msg += `🏢 *Documento/Local:* ${doc}\n`;

  if (includePrices && isSeller) {
    const { pagamento, validade } = getCommercialTerms();
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (pagamento) {
      msg += `💳 *Condição de Pagamento:* ${pagamento}\n`;
    }
    if (validade) {
      msg += `📅 *Validade da Proposta:* ${validade}\n`;
    }
  }

  msg += `\n🔗 *Acessar Cotação Completa no Catálogo:*\n${shareUrl}\n`;

  const waUrl = `https://api.whatsapp.com/send?phone=${destWhatsapp}&text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  showToast(`📲 Abrindo WhatsApp para ${destWhatsapp}...`);
}

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

// ═══════════════════════════════════════════════════════════════
//  ENVIO DO ORÇAMENTO PARA O WHATSAPP (COM / SEM VALORES)
// ═══════════════════════════════════════════════════════════════
function sendQuoteToWhatsApp() {
  hapticFeedback(35);
  const nameInput = document.getElementById('client-name');
  const docInput = document.getElementById('client-doc');

  const nome = nameInput ? nameInput.value.trim() : '';
  const doc = docInput ? docInput.value.trim() : '';

  if (!nome) {
    nameInput?.classList.add('has-error');
    showToast('⚠️ Por favor, informe seu Nome ou Empresa');
    nameInput?.focus();
    return;
  }
  nameInput?.classList.remove('has-error');

  const vendedorObj = getActiveSellerObj();
  const destWhatsapp = (vendedorObj && vendedorObj.whatsapp) ? vendedorObj.whatsapp : CONFIG.whatsapp;

  localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify({ nome, vendedor: vendedorObj.id, doc }));

  const isSeller = isSellerLoggedIn();
  const shareUrl = generateCartShareUrl(isSeller);
  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const orcNum = 'RQ-2026-' + Math.floor(1000 + Math.random() * 9000);

  const {
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
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
    cliente: nome,
    doc: doc,
    vendedorId: vendedorObj.id,
    vendedorNome: vendedorObj.nome,
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

  logSellerActivity('Envio de Orçamento WhatsApp', {
    num_proposta: orcNum,
    cliente_nome: nome,
    cliente_doc: doc,
    total_itens: totalQtd,
    valor_total: isSeller ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : '-',
    resumo_itens: cartItems.map(i => `${i.quantidade}x ${i.nome}`).join(', '),
    link_proposta: shareUrl,
    detalhes_extras: `Destino WhatsApp: ${destWhatsapp} | Total Líquido: R$ ${totalFinalLiquido.toFixed(2)} | Economia Total: R$ ${economiaTotalReal.toFixed(2)}`
  });

  let msg = `🌿 *${CONFIG.empresa}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *SOLICITAÇÃO DE ORÇAMENTO (Nº ${orcNum})*\n\n`;

  cartItems.forEach((item, index) => {
    const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || 0);
    const discItemPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
    const pUnitDesc = pUnit * (1 - (discItemPercent / 100));
    const subtotalItem = item.quantidade * pUnitDesc;

    msg += `*${index + 1}. ${item.nome}*\n`;
    msg += `   • Ref: \`${item.referencia}\`\n`;
    msg += `   • Quantidade: *${item.quantidade} ${item.unidade || 'unidade'}(s)*\n`;

    if (isSeller && pUnit > 0) {
      if (discItemPercent > 0) {
        msg += `   • Valor Unit.: R$ ${pUnit.toFixed(2).replace('.', ',')}\n`;
        msg += `   • Desconto no Item: *${discItemPercent.toFixed(1)}%* (-R$ ${(pUnit * (discItemPercent / 100)).toFixed(2).replace('.', ',')}/un)\n`;
        msg += `   • Valor Unit. c/ Desconto: *R$ ${pUnitDesc.toFixed(2).replace('.', ',')}* (Subtotal: *R$ ${subtotalItem.toFixed(2).replace('.', ',')}*)\n`;
      } else {
        msg += `   • Valor Unit.: R$ ${pUnit.toFixed(2).replace('.', ',')} (Subtotal: R$ ${subtotalItem.toFixed(2).replace('.', ',')})\n`;
      }
    }
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (isSeller) {
    if (economiaTotalReal > 0.01) {
      msg += `💰 *Subtotal dos Produtos:* R$ ${subtotalItensSemDesconto.toFixed(2).replace('.', ',')}\n`;
      if (descontoTotalItens > 0.01) {
        msg += `🏷️ *Descontos nos Produtos:* -R$ ${descontoTotalItens.toFixed(2).replace('.', ',')}\n`;
        msg += `📦 *Subtotal c/ Desc. dos Itens:* R$ ${subtotalItensComDesconto.toFixed(2).replace('.', ',')}\n`;
      }
      if (discGlobalPercent > 0 && valorDescontoGlobal > 0) {
        msg += `🏷️ *Desconto no Pedido (${discGlobalPercent.toFixed(1)}% s/ itens s/ desc.):* -R$ ${valorDescontoGlobal.toFixed(2).replace('.', ',')}\n`;
      }
      msg += `🎉 *ECONOMIA TOTAL DO CLIENTE:* *R$ ${economiaTotalReal.toFixed(2).replace('.', ',')} (${percentualEconomiaTotal.toFixed(1)}% OFF)*\n`;
      msg += `💳 *TOTAL FINAL DA PROPOSTA:* *R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}*\n`;
    } else {
      msg += `💳 *TOTAL DA PROPOSTA:* *R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}*\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  }

  msg += `👤 *Cliente:* ${nome}\n`;
  if (vendedorObj && vendedorObj.id) {
    msg += `👔 *Vendedor:* ${vendedorObj.nome}\n`;
  }
  if (doc) msg += `🏢 *Documento/Local:* ${doc}\n`;

  if (isSeller) {
    const { pagamento, validade } = getCommercialTerms();
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (pagamento) {
      msg += `💳 *Condição de Pagamento:* ${pagamento}\n`;
    }
    if (validade) {
      msg += `📅 *Validade da Proposta:* ${validade}\n`;
    }
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🔗 *Abrir / Recomprar este pedido no Catálogo:*\n${shareUrl}\n\n`;
  msg += `${CONFIG.mensagem_fim}`;

  const waUrl = `https://api.whatsapp.com/send?phone=${destWhatsapp}&text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}