// ═══════════════════════════════════════════════════════════════
//  MÓDULO DO VENDEDOR, PIN, HISTÓRICO & APP HUB
// ═══════════════════════════════════════════════════════════════
const SELLER_STORAGE_KEY = 'rawell_seller_session_auth_v2';
const CLIENT_SELLER_STORAGE_KEY = 'rawell_client_attributed_seller_v2';
const QUOTE_HISTORY_KEY = 'rawell_quote_history_v2';

let clientAttributedSeller = null;

function initSellerAssignment() {
  try {
    // 1. Verifica se o CLIENTE acessou com ?vendedor=carlos (Segmentação de Comissões)
    const params = new URLSearchParams(window.location.search);
    const code = params.get('vendedor') || params.get('v') || params.get('rep');

    if (code) {
      const norm = normText(code);
      const found = VENDEDORES.find(v => normText(v.id) === norm || normText(v.nome).includes(norm));
      if (found) {
        clientAttributedSeller = found.id;
        sessionStorage.setItem(CLIENT_SELLER_STORAGE_KEY, found.id);
      }
    } else {
      clientAttributedSeller = sessionStorage.getItem(CLIENT_SELLER_STORAGE_KEY) || null;
    }

    updateSellerUI();
    trackInitialSession();
  } catch(e) {
    console.warn('Erro ao carregar vendedor:', e);
  }
}

function isSellerLoggedIn() {
  const session = getSellerSession();
  return !!(session && session.logged);
}

function getSellerSession() {
  try {
    return JSON.parse(localStorage.getItem(SELLER_STORAGE_KEY));
  } catch (e) {
    return null;
  }
}

function openSellerLoginModal() {
  hapticFeedback(20);
  document.getElementById('seller-modal-backdrop')?.classList.add('show');
}

function closeSellerLoginModal() {
  document.getElementById('seller-modal-backdrop')?.classList.remove('show');
}

function handleSellerLogin(event) {
  if (event) event.preventDefault();
  hapticFeedback(30);

  const select = document.getElementById('seller-login-select');
  const pinInput = document.getElementById('seller-login-pin');
  const rawVendedor = select ? select.value : 'Carlos Silva (carlos)';
  const pin = pinInput ? pinInput.value.trim() : '';

  if (!pin) {
    showToast('⚠️ Por favor, informe o PIN de acesso.');
    pinInput?.focus();
    return;
  }

  const vIdMatch = rawVendedor.match(/\((.*?)\)/);
  const vendedorId = vIdMatch ? vIdMatch[1] : rawVendedor.toLowerCase().replace(/\s+/g, '-');
  const vendedorNome = rawVendedor.split('(')[0].trim();

  const sessionData = {
    logged: true,
    vendedorNome: vendedorNome,
    vendedorId: vendedorId,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(sessionData));
  closeSellerLoginModal();
  updateSellerUI();
  renderProductList();
  if (document.getElementById('cart-bottom-sheet')?.classList.contains('show')) {
    renderCartSheet();
  }

  showToast(`🎉 Bem-vindo(a), ${vendedorNome}! Modo Vendedor ativado com preços e propostas.`);
  
  logSellerActivity('Login no Modo Vendedor', {
    origem_canal: `🟢👔 Vendedor Entrou (${vendedorNome})`,
    vendedor: vendedorNome,
    vendedor_nome: vendedorNome,
    detalhes_extras: 'Representante autenticou-se via PIN'
  });
}

function handleSellerLogout() {
  hapticFeedback(20);
  const session = getSellerSession();
  const vNome = (session && session.vendedorNome) ? session.vendedorNome : 'Representante';
  logSellerActivity('Logout do Modo Vendedor', {
    origem_canal: `🔴👔 Vendedor Saiu (${vNome})`,
    vendedor: vNome,
    vendedor_nome: vNome,
    detalhes_extras: 'Modo vendedor desconectado'
  });
  localStorage.removeItem(SELLER_STORAGE_KEY);
  updateSellerUI();
  renderProductList();
  if (document.getElementById('cart-bottom-sheet')?.classList.contains('show')) {
    renderCartSheet();
  }
  showToast('🔒 Modo vendedor desconectado.');
}

function updateSellerUI() {
  const isLogged = isSellerLoggedIn();
  const session = getSellerSession();
  const quoteCount = getQuoteHistory().length;

  // 1. Header: Se logado como vendedor vs deslogado
  const headerContainer = document.getElementById('seller-status-header');
  const historyHeaderBtn = document.getElementById('btn-header-history');

  if (headerContainer) {
    if (isLogged && session) {
      const shortName = (session.vendedorNome || 'Vendedor').split(' ')[0];
      headerContainer.innerHTML = `
        <div class="seller-status-header">
          <span title="Modo Vendedor Ativo">👔</span>
          <span><span class="seller-label-text">Vendedor: </span><span class="seller-name" title="${session.vendedorNome}">${shortName}</span></span>
          <button type="button" class="btn-seller-history-pill" onclick="openQuoteHistoryModal()" title="Ver Meus Orçamentos Recentes">
            <span>📋 Orçamentos</span>
            <span class="history-pill-count">${quoteCount}</span>
          </button>
          <button type="button" class="btn-logout-seller" onclick="handleSellerLogout()" title="Sair do modo vendedor">
            <span>Sair</span> 🚪
          </button>
        </div>
      `;
      headerContainer.style.display = 'block';
      if (historyHeaderBtn) historyHeaderBtn.style.display = 'none'; // Já embutido dentro da barra do vendedor
    } else {
      headerContainer.innerHTML = `
        <button type="button" class="btn-seller-login-header" onclick="openSellerLoginModal()" title="Acesso Restrito do Vendedor">
          <span>🔒</span> <span>Vendedor</span>
        </button>
      `;
      headerContainer.style.display = 'block';
      if (historyHeaderBtn) historyHeaderBtn.style.display = 'none'; // Oculto para cliente comum
    }
  }

  // 2. Header: Se um CLIENTE veio pelo link com vendedor atribuído
  const clientHeader = document.getElementById('seller-client-header');
  if (clientHeader) {
    if (!isLogged && clientAttributedSeller) {
      const vObj = VENDEDORES.find(v => v.id === clientAttributedSeller);
      if (vObj) {
        clientHeader.innerHTML = `👔 Atendimento: <strong>${vObj.nome}</strong>`;
        clientHeader.style.display = 'inline-flex';
      } else {
        clientHeader.style.display = 'none';
      }
    } else {
      clientHeader.style.display = 'none';
    }
  }

  // 3. Rodapé: Status e Acesso ao Dashboard do Vendedor
  const footerContainer = document.getElementById('footer-seller-container');
  if (footerContainer) {
    if (isLogged && session) {
      footerContainer.innerHTML = `
        <div class="footer-seller-logged-box">
          <span class="footer-seller-tag">👔 <strong>${session.vendedorNome}</strong> (Logado)</span>
          <button type="button" class="footer-secret-seller-btn" style="background:rgba(16,185,129,0.25);" onclick="openQuoteHistoryModal()" title="Abrir Dashboard de Orçamentos">
            📋 Meus Orçamentos (${quoteCount})
          </button>
          <button type="button" class="footer-btn-logout" onclick="handleSellerLogout()" title="Encerrar sessão">
            🚪 Sair
          </button>
        </div>
      `;
    } else {
      footerContainer.innerHTML = `
        <button type="button" class="footer-secret-seller-btn" onclick="openSellerLoginModal()" title="Área Restrita do Vendedor">
          🔒 Acesso Vendedor
        </button>
      `;
    }
  }

  // 4. Bottom Nav Mobile: Mostra aba Vendedor se vendedor logado, senão mostra Categorias
  const tabSeller = document.getElementById('tab-nav-seller');
  const tabCats = document.getElementById('tab-nav-cats');
  if (tabSeller) {
    tabSeller.style.display = isLogged ? 'inline-flex' : 'none';
  }
  if (tabCats) {
    tabCats.style.display = isLogged ? 'none' : 'inline-flex';
  }

  updateHistoryBadges();
}

function getActiveSellerObj() {
  const session = getSellerSession();
  if (isSellerLoggedIn() && session) {
    const found = VENDEDORES.find(v => v.id === session.vendedorId || normText(v.nome).includes(normText(session.vendedorNome)));
    if (found) return found;
    return { id: session.vendedorId, nome: session.vendedorNome, whatsapp: CONFIG.whatsapp };
  }
  if (clientAttributedSeller) {
    return VENDEDORES.find(v => v.id === clientAttributedSeller) || VENDEDORES[0];
  }
  const clientSel = document.getElementById('client-vendedor');
  const selId = clientSel ? clientSel.value : '';
  return VENDEDORES.find(v => v.id === selId) || VENDEDORES[0];
}

function getQuoteHistory() {
  try {
    return JSON.parse(localStorage.getItem(QUOTE_HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveQuoteToHistory(record) {
  try {
    const list = getQuoteHistory();
    const filtered = list.filter(q => q.id !== record.id);
    filtered.unshift(record);
    localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(filtered.slice(0, 50)));
    updateHistoryBadges();
  } catch(e) {
    console.warn('Erro ao salvar histórico:', e);
  }
}

function deleteQuoteFromHistory(quoteId) {
  hapticFeedback(20);
  try {
    let list = getQuoteHistory();
    list = list.filter(q => q.id !== quoteId);
    localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(list));
    renderQuoteHistoryModal();
    updateHistoryBadges();
    showToast('🗑️ Orçamento excluído do histórico');
  } catch(e) {}
}

function clearAllQuoteHistory() {
  hapticFeedback(30);
  const list = getQuoteHistory();
  if (!list.length) return;
  if (confirm('Tem certeza que deseja apagar todo o histórico de orçamentos salvos?')) {
    localStorage.removeItem(QUOTE_HISTORY_KEY);
    renderQuoteHistoryModal();
    updateHistoryBadges();
    showToast('🗑️ Histórico de orçamentos limpo');
  }
}

function updateQuoteStatus(quoteId, newStatus) {
  hapticFeedback(15);
  try {
    const list = getQuoteHistory();
    const found = list.find(q => q.id === quoteId);
    if (found) {
      found.status = newStatus;
      localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(list));
      showToast(`📌 Status atualizado: ${newStatus.toUpperCase()}`);
      renderQuoteHistoryModal();
      
      logSellerActivity('Atualização de Status de Orçamento', {
        num_proposta: quoteId,
        detalhes_extras: `Novo Status: ${newStatus.toUpperCase()}`
      });
    }
  } catch(e) {}
}

function loadQuoteIntoCart(quoteId) {
  hapticFeedback(30);
  const list = getQuoteHistory();
  const q = list.find(item => item.id === quoteId);
  if (!q || !q.itens || !q.itens.length) {
    showToast('⚠️ Erro ao carregar itens deste orçamento.');
    return;
  }

  cartItems = q.itens.map(i => ({
    id: i.id,
    nome: i.nome,
    referencia: i.referencia,
    unidade: i.unidade,
    imagem: i.imagem,
    quantidade: i.quantidade,
    preco_base: i.preco_base || 0,
    preco_unitario: (i.preco_unitario !== undefined) ? i.preco_unitario : (i.preco_base || 0),
    desconto_percent: (i.desconto_percent !== undefined) ? i.desconto_percent : 0
  }));

  cartGlobalDiscountPercent = q.discPercent || q.discGlobalPercent || 0;

  saveCart();
  renderProductList();
  updateBadges();

  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify({
      nome: q.cliente || '',
      doc: q.doc || '',
      vendedor: q.vendedorId || ''
    }));
  } catch(e) {}

  closeQuoteHistoryModal();
  setTimeout(() => {
    openCartSheet();
    showToast(`🛒 Orçamento ${q.id} carregado no carrinho!`);
  }, 250);

  logSellerActivity('Reabertura de Orçamento do Histórico', {
    num_proposta: q.id,
    total_itens: cartItems.reduce((acc, i) => acc + i.quantidade, 0)
  });
}

function updateHistoryBadges() {
  const count = getQuoteHistory().length;
  const headPill = document.getElementById('header-history-pill');
  const btmBadge = document.getElementById('bottom-seller-badge') || document.getElementById('bottom-history-badge');

  if (headPill) headPill.textContent = count;
  if (btmBadge) {
    btmBadge.textContent = count;
    btmBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function openQuoteHistoryModal() {
  hapticFeedback(25);
  if (!isSellerLoggedIn()) {
    openSellerLoginModal();
    showToast('🔒 Faça login no Modo Vendedor para acessar seus orçamentos.');
    return;
  }
  renderQuoteHistoryModal();
  document.getElementById('history-modal-backdrop')?.classList.add('show');
}

function closeQuoteHistoryModal() {
  document.getElementById('history-modal-backdrop')?.classList.remove('show');
}

function renderQuoteHistoryModal() {
  const session = getSellerSession();
  const sellerName = session ? session.vendedorNome : 'Vendedor';
  const list = getQuoteHistory();
  const body = document.getElementById('history-modal-body');
  const subTitle = document.getElementById('history-count-subtitle');

  const titleEl = document.querySelector('.history-modal-title');
  if (titleEl) {
    titleEl.innerHTML = `📋 Meus Orçamentos Recentes <span style="font-size:0.8rem; font-weight:600; color:var(--text-3);">(${sellerName})</span>`;
  }

  if (subTitle) {
    subTitle.textContent = `${list.length} cotaç${list.length === 1 ? 'ão salva' : 'ões salvas'} no seu aparelho`;
  }

  if (!body) return;

  if (!list.length) {
    body.innerHTML = `
      <div style="text-align:center; padding:40px 10px;">
        <div style="font-size:3.5rem; margin-bottom:12px;">📋</div>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin-bottom:6px;">Nenhum orçamento salvo ainda</h3>
        <p style="font-size:0.88rem; color:var(--text-3); max-width:400px; margin:0 auto 20px;">
          Assim que você gerar propostas em PDF ou enviar cotações pelo WhatsApp, elas ficarão salvas aqui para você reabrir ou gerenciar facilmente.
        </p>
        <button class="hero-btn-primary" style="margin:0 auto; padding:0 24px; height:42px;" onclick="closeQuoteHistoryModal(); scrollToProducts();">
          Explorar Produtos
        </button>
      </div>
    `;
    return;
  }

  body.innerHTML = list.map(q => {
    const currentStatus = q.status || 'aguardando';
    const valorStr = q.valorTotal ? `<span style="color:var(--brand-mid); font-weight:800; margin-left:6px;">• ${q.valorTotal}</span>` : '';

    return `
      <div class="history-item-card">
        <div class="history-card-top">
          <div>
            <span class="history-quote-num">${q.id}</span>
            <span class="history-quote-date"> • ${q.data || 'Data recente'} ${valorStr}</span>
          </div>
          <button class="history-del-btn" onclick="deleteQuoteFromHistory('${q.id}')" title="Excluir este orçamento">
            🗑️ Excluir
          </button>
        </div>

        <div class="history-client-row">
          <span>👤 ${q.cliente || 'Cliente não identificado'}</span>
          ${q.doc ? `<span class="history-client-doc">(${q.doc})</span>` : ''}
        </div>

        <div class="history-items-summary">
          <strong>${q.totalQtd || q.itens.reduce((acc, i) => acc + i.quantidade, 0)} itens:</strong>
          ${q.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}
        </div>

        <div class="history-card-footer">
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-3);">Status:</label>
            <select class="history-status-select" data-status="${currentStatus}" onchange="updateQuoteStatus('${q.id}', this.value)">
              <option value="aguardando" ${currentStatus === 'aguardando' ? 'selected' : ''}>🟡 Aguardando</option>
              <option value="negociando" ${currentStatus === 'negociando' ? 'selected' : ''}>⚪ Em Negociação</option>
              <option value="fechado" ${currentStatus === 'fechado' ? 'selected' : ''}>🟢 Fechado</option>
              <option value="recusado" ${currentStatus === 'recusado' ? 'selected' : ''}>🔴 Recusado</option>
            </select>
          </div>

          <div class="history-actions-row">
            <button class="btn-history-pdf" onclick="openPdfProposalFromHistory('${q.id}')" title="Ver proposta formal">
              📄 PDF
            </button>
            <button class="btn-history-load" onclick="loadQuoteIntoCart('${q.id}')" title="Carregar este pedido no carrinho">
              🛒 Carregar Orçamento
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openPdfProposalFromHistory(quoteId) {
  const list = getQuoteHistory();
  const q = list.find(item => item.id === quoteId);
  if (!q) return;

  const subtotalItensSemDesconto = q.subtotalItensSemDesconto || (q.itens ? q.itens.reduce((acc, i) => acc + (i.quantidade * (i.preco_unitario !== undefined ? i.preco_unitario : (i.preco_base || 0))), 0) : 0);
  const subtotalItensComDesconto = q.subtotalItensComDesconto || (q.itens ? q.itens.reduce((acc, i) => {
    const pUnit = (i.preco_unitario !== undefined) ? i.preco_unitario : (i.preco_base || 0);
    const disc = (i.desconto_percent || 0);
    return acc + (i.quantidade * pUnit * (1 - disc / 100));
  }, 0) : subtotalItensSemDesconto);
  const baseItensSemDesconto = q.baseItensSemDesconto !== undefined ? q.baseItensSemDesconto : (q.itens ? q.itens.reduce((acc, i) => {
    return (!i.desconto_percent || i.desconto_percent <= 0) ? acc + (i.quantidade * (i.preco_unitario !== undefined ? i.preco_unitario : (i.preco_base || 0))) : acc;
  }, 0) : 0);
  const descontoTotalItens = q.descontoTotalItens !== undefined ? q.descontoTotalItens : Math.max(0, subtotalItensSemDesconto - subtotalItensComDesconto);
  const discGlobalPercent = q.discGlobalPercent || q.discPercent || 0;
  const valorDescontoGlobal = q.valorDescontoGlobal !== undefined ? q.valorDescontoGlobal : ((baseItensSemDesconto * discGlobalPercent) / 100);
  const totalFinalLiquido = q.totalFinalLiquido || Math.max(0, subtotalItensComDesconto - valorDescontoGlobal);
  const economiaTotalReal = q.economiaTotalReal !== undefined ? q.economiaTotalReal : (descontoTotalItens + valorDescontoGlobal);
  const percentualEconomiaTotal = subtotalItensSemDesconto > 0 ? ((economiaTotalReal / subtotalItensSemDesconto) * 100) : 0;

  renderPdfPaperContent({
    orcNum: q.id,
    dataAtual: q.data ? q.data.split(' ')[0] : 'Recente',
    horaAtual: q.data && q.data.includes('às') ? q.data.split('às')[1].trim() : '',
    clienteNome: q.cliente || 'Cliente / Empresa',
    clienteDoc: q.doc || 'Não informado',
    vendedorNome: q.vendedorNome || 'Atendimento Geral',
    itemsList: q.itens,
    shareUrl: q.shareUrl || generateCartShareUrl(),
    isSeller: isSellerLoggedIn(),
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


// ═══════════════════════════════════════════════════════════════
//  APP DO VENDEDOR (PAINEL MASTER DO REPRESENTANTE)
// ═══════════════════════════════════════════════════════════════
let currentSellerAppTab = 'quotes';
let currentSellerStatusFilter = 'todos';

function openSellerAppModal(defaultTab = 'quotes') {
  hapticFeedback(25);
  if (!isSellerLoggedIn()) {
    openSellerLoginModal();
    showToast('🔒 Faça login no Modo Vendedor para acessar o painel.');
    return;
  }
  
  const session = getSellerSession();
  const nameEl = document.getElementById('seller-app-profile-name');
  if (nameEl && session) {
    nameEl.textContent = session.vendedorNome || 'Representante Comercial';
  }

  currentSellerAppTab = defaultTab;
  renderSellerAppContent();
  document.getElementById('seller-app-modal-backdrop')?.classList.add('show');
}

function closeSellerAppModal() {
  document.getElementById('seller-app-modal-backdrop')?.classList.remove('show');
}

function switchSellerAppTab(tabName) {
  hapticFeedback(15);
  currentSellerAppTab = tabName;
  document.getElementById('tab-btn-seller-quotes')?.classList.toggle('active', tabName === 'quotes');
  document.getElementById('tab-btn-seller-tools')?.classList.toggle('active', tabName === 'tools');
  renderSellerAppContent();
}

function filterSellerQuotes(status) {
  hapticFeedback(12);
  currentSellerStatusFilter = status;
  renderSellerAppContent();
}

function renderSellerAppContent() {
  const body = document.getElementById('seller-app-body');
  const countEl = document.getElementById('seller-app-quote-count');
  const quotes = getQuoteHistory();
  if (countEl) countEl.textContent = quotes.length;

  if (!body) return;

  if (currentSellerAppTab === 'quotes') {
    // ── ABA 1: MEUS ORÇAMENTOS RECENTES ──
    let filteredList = quotes;
    if (currentSellerStatusFilter !== 'todos') {
      filteredList = quotes.filter(q => (q.status || 'aguardando') === currentSellerStatusFilter);
    }

    let filterStripHtml = `
      <div class="seller-filter-strip">
        <button class="seller-filter-pill ${currentSellerStatusFilter === 'todos' ? 'active' : ''}" onclick="filterSellerQuotes('todos')">Todos (${quotes.length})</button>
        <button class="seller-filter-pill ${currentSellerStatusFilter === 'aguardando' ? 'active' : ''}" onclick="filterSellerQuotes('aguardando')">🟡 Aguardando</button>
        <button class="seller-filter-pill ${currentSellerStatusFilter === 'negociando' ? 'active' : ''}" onclick="filterSellerQuotes('negociando')">⚪ Negociando</button>
        <button class="seller-filter-pill ${currentSellerStatusFilter === 'fechado' ? 'active' : ''}" onclick="filterSellerQuotes('fechado')">🟢 Fechados</button>
        <button class="seller-filter-pill ${currentSellerStatusFilter === 'recusado' ? 'active' : ''}" onclick="filterSellerQuotes('recusado')">🔴 Recusados</button>
      </div>
    `;

    if (!quotes.length) {
      body.innerHTML = `
        ${filterStripHtml}
        <div style="text-align:center; padding:36px 12px;">
          <div style="font-size:3.5rem; margin-bottom:10px;">📋</div>
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin-bottom:6px;">Nenhum orçamento salvo ainda</h3>
          <p style="font-size:0.86rem; color:var(--text-3); max-width:380px; margin:0 auto 18px; line-height:1.45;">
            Assim que você enviar cotações ou gerar propostas em PDF, seus pedidos ficarão organizados aqui para consulta rápida e reabertura.
          </p>
          <button class="hero-btn-primary" style="margin:0 auto; padding:0 22px; height:40px;" onclick="closeSellerAppModal(); scrollToProducts();">
            <span>🛒</span> Montar Novo Pedido
          </button>
        </div>
      `;
      return;
    }

    if (!filteredList.length) {
      body.innerHTML = `
        ${filterStripHtml}
        <div style="text-align:center; padding:30px 10px; color:var(--text-3); font-size:0.9rem;">
          Nenhum orçamento encontrado com o status "${currentSellerStatusFilter}".
        </div>
      `;
      return;
    }

    body.innerHTML = `
      ${filterStripHtml}
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0 2px;">
        <span style="font-size:0.75rem; font-weight:700; color:var(--text-3);">Exibindo ${filteredList.length} de ${quotes.length} orçamentos</span>
        <button class="history-del-btn" onclick="clearAllQuoteHistory()" title="Limpar todos os orçamentos">🗑️ Limpar Histórico</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${filteredList.map(q => {
          const currentStatus = q.status || 'aguardando';
          const valorStr = q.valorTotal ? `<span style="color:var(--brand-mid); font-weight:800; margin-left:6px;">• ${q.valorTotal}</span>` : '';

          return `
            <div class="history-item-card">
              <div class="history-card-top">
                <div>
                  <span class="history-quote-num">${q.id}</span>
                  <span class="history-quote-date"> • ${q.data || 'Data recente'} ${valorStr}</span>
                </div>
                <button class="history-del-btn" onclick="deleteQuoteFromHistory('${q.id}')" title="Excluir este orçamento">
                  🗑️
                </button>
              </div>

              <div class="history-client-row">
                <span>👤 ${q.cliente || 'Cliente não identificado'}</span>
                ${q.doc ? `<span class="history-client-doc">(${q.doc})</span>` : ''}
              </div>

              <div class="history-items-summary">
                <strong>${q.totalQtd || (q.itens ? q.itens.reduce((acc, i) => acc + i.quantidade, 0) : 0)} itens:</strong>
                ${q.itens ? q.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ') : '-'}
              </div>

              <div class="history-card-footer">
                <div style="display:flex; align-items:center; gap:6px;">
                  <label style="font-size:0.75rem; font-weight:700; color:var(--text-3);">Status:</label>
                  <select class="history-status-select" data-status="${currentStatus}" onchange="updateQuoteStatus('${q.id}', this.value); renderSellerAppContent();">
                    <option value="aguardando" ${currentStatus === 'aguardando' ? 'selected' : ''}>🟡 Aguardando</option>
                    <option value="negociando" ${currentStatus === 'negociando' ? 'selected' : ''}>⚪ Em Negociação</option>
                    <option value="fechado" ${currentStatus === 'fechado' ? 'selected' : ''}>🟢 Fechado</option>
                    <option value="recusado" ${currentStatus === 'recusado' ? 'selected' : ''}>🔴 Recusado</option>
                  </select>
                </div>

                <div class="history-actions-row">
                  <button class="btn-history-pdf" onclick="openPdfProposalFromHistory('${q.id}')" title="Ver proposta formal em PDF">
                    📄 PDF
                  </button>
                  <button class="btn-history-load" onclick="loadQuoteIntoCart('${q.id}'); closeSellerAppModal();" title="Carregar este pedido no carrinho">
                    🛒 Carregar
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // ── ABA 2: FERRAMENTAS & LINKS ──
    const session = getSellerSession();
    const vId = session ? session.vendedorId : 'carlos';
    const personalUrl = `${window.location.origin}${window.location.pathname}?vendedor=${encodeURIComponent(vId)}`;

    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:12px;">
        
        <!-- Ferramenta 1: Link Personalizado com Comissão -->
        <div class="seller-tool-card" onclick="copySellerPersonalLink('${personalUrl}')">
          <div>
            <div style="font-size:0.92rem; font-weight:800; color:var(--text); margin-bottom:2px;">🔗 Meu Link Personalizado de Catálogo</div>
            <div style="font-size:0.78rem; color:var(--text-3);">Clientes que entrarem por este link terão cotações vinculadas diretamente a você.</div>
          </div>
          <button type="button" class="btn-cart-secondary" style="height:32px; font-size:0.75rem; flex-shrink:0;">
            Copiar Link
          </button>
        </div>

        <!-- Ferramenta 2: Ir Direto ao Carrinho -->
        <div class="seller-tool-card" onclick="closeSellerAppModal(); openCartSheet();">
          <div>
            <div style="font-size:0.92rem; font-weight:800; color:var(--text); margin-bottom:2px;">🛒 Abrir Carrinho & Tabela de Preços</div>
            <div style="font-size:0.78rem; color:var(--text-3);">Acesse os itens selecionados, simule descontos globais ou emita propostas PDF.</div>
          </div>
          <button type="button" class="btn-cart-secondary" style="height:32px; font-size:0.75rem; flex-shrink:0;">
            Abrir Carrinho
          </button>
        </div>

      </div>
    `;
  }
}

function copySellerPersonalLink(url) {
  hapticFeedback(25);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('🔗 Link personalizado do vendedor copiado!');
    });
  } else {
    prompt('Copie o seu link de vendedor:', url);
  }
  logSellerActivity('Copiou Link Pessoal do Vendedor', {
    link_proposta: url,
    detalhes_extras: 'Link de comissão / atribuição copiado no Painel do Vendedor'
  });
}

// Redireciona openQuoteHistoryModal para abrir o App do Vendedor
function openQuoteHistoryModal() {
  openSellerAppModal('quotes');
}