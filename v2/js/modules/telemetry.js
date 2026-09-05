// ═══════════════════════════════════════════════════════════════
//  SISTEMA DE AUDITORIA & TELEMETRIA GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════
let _telemetryDebounceTimer = null;

function logSellerActivity(tipoEvento, dadosExtras = {}) {
  const isHighFrequency = tipoEvento.includes('Orçamento') || tipoEvento.includes('Visualização');
  
  if (isHighFrequency) {
    clearTimeout(_telemetryDebounceTimer);
    _telemetryDebounceTimer = setTimeout(() => {
      _dispatchTelemetryPayload(tipoEvento, dadosExtras);
    }, 1200);
  } else {
    _dispatchTelemetryPayload(tipoEvento, dadosExtras);
  }
}

function _dispatchTelemetryPayload(tipoEvento, dadosExtras = {}) {
  try {
    const webhookUrl = CONFIG.auditWebhookUrl || '';
    if (!webhookUrl || !webhookUrl.startsWith('http')) return;

    const session = getSellerSession();
    const isSeller = isSellerLoggedIn();
    const sellerObj = getActiveSellerObj();
    const isAttributed = !!(clientAttributedSeller && !isSeller);

    const origemCanal = dadosExtras.origem_canal || (isSeller 
      ? `👔 Vendedor Logado (${session.vendedorNome})`
      : (isAttributed ? `🟢 Vendedor (${sellerObj.nome})` : '🔵 Base / Central (Orgânico)'));

    let resumoItens = dadosExtras.resumo_itens || '-';
    let totalQtd = dadosExtras.total_itens || 0;
    let valorTotal = 0;
    let linkProposta = dadosExtras.link_proposta || generateCartShareUrl(false);
    let linkComPreco = generateCartShareUrl(true);

    if (cartItems && cartItems.length > 0) {
      const itensArr = cartItems.map(item => {
        const prod = PRODUTOS.find(p => p.id === item.id);
        const precoBase = prod ? (prod.preco_base || 0) : 0;
        const precoUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : precoBase;
        const subtotal = item.quantidade * precoUnit;
        totalQtd += item.quantidade;
        valorTotal += subtotal;
        return `${item.quantidade}x ${item.nome} [Cobrado: R$ ${precoUnit.toFixed(2)} | Tabela: R$ ${precoBase.toFixed(2)}]`;
      });
      resumoItens = itensArr.join('; ');
    }

    const payload = {
      timestamp: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      origem_canal: origemCanal,
      vendedor: dadosExtras.vendedor || dadosExtras.vendedor_nome || (isSeller ? session.vendedorNome : (sellerObj ? sellerObj.nome : 'Atendimento Geral')),
      vendedor_nome: dadosExtras.vendedor || dadosExtras.vendedor_nome || (isSeller ? session.vendedorNome : (sellerObj ? sellerObj.nome : 'Atendimento Geral')),
      evento: tipoEvento,
      num_proposta: dadosExtras.num_proposta || dadosExtras.numProposta || '-',
      cliente_nome: dadosExtras.cliente_nome || dadosExtras.clienteNome || document.getElementById('client-name')?.value?.trim() || '-',
      cliente_doc: dadosExtras.cliente_doc || dadosExtras.clienteDoc || document.getElementById('client-doc')?.value?.trim() || '-',
      total_itens: totalQtd,
      valor_total: valorTotal > 0 ? `R$ ${valorTotal.toFixed(2).replace('.', ',')}` : '-',
      resumo_itens: resumoItens,
      link_proposta: linkProposta,
      link_com_preco: linkComPreco,
      url_acessada: window.location.href,
      detalhes_extras: dadosExtras.detalhes_extras || dadosExtras.observacao || '-',
      user_agent: navigator.userAgent || '-'
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(webhookUrl, JSON.stringify(payload));
    } else {
      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (e) {
    console.debug('Auditoria sync:', e);
  }
}

function trackInitialSession() {
  try {
    if (!sessionStorage.getItem('rawell_session_logged_v2')) {
      sessionStorage.setItem('rawell_session_logged_v2', 'true');
      logSellerActivity('Acesso ao Catálogo (Sessão Iniciada)', {
        detalhes_extras: 'Navegação iniciada no catálogo'
      });
    }
  } catch(e) {}
}