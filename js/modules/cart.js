// ═══════════════════════════════════════════════════════════════
//  CARRINHO, ORÇAMENTO, DESCONTOS & TOTALIZADORES
// ═══════════════════════════════════════════════════════════════
let cartItems = [];
let cartGlobalDiscountPercent = 0;
const CART_STORAGE_KEY = 'rawell_cart_v2';
const CART_GLOBAL_DISCOUNT_KEY = 'rawell_cart_global_discount_v2';
const CLIENT_STORAGE_KEY = 'rawell_client_profile_v2';

function loadCart() {
  try {
    cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    cartItems.forEach(item => {
      const p = PRODUTOS.find(prod => prod.id === item.id);
      if (p) {
        if (item.preco_base === undefined) item.preco_base = p.preco_base || 0;
        if (item.preco_unitario === undefined) item.preco_unitario = p.preco_base || 0;
      }
      if (item.desconto_percent === undefined) item.desconto_percent = 0;
    });
    cartGlobalDiscountPercent = parseFloat(localStorage.getItem(CART_GLOBAL_DISCOUNT_KEY)) || 0;
  } catch {
    cartItems = [];
    cartGlobalDiscountPercent = 0;
  }
  updateBadges();
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  localStorage.setItem(CART_GLOBAL_DISCOUNT_KEY, cartGlobalDiscountPercent.toString());
  updateBadges();
}

function addToCart(id, qty = 1) {
  const p = PRODUTOS.find(item => item.id === id);
  if (!p) return;

  const existing = cartItems.find(i => i.id === id);
  if (existing) {
    existing.quantidade += qty;
  } else {
    cartItems.push({
      id: p.id,
      nome: p.nome,
      referencia: p.referencia,
      unidade: p.unidade,
      imagem: p.imagens[0],
      quantidade: qty,
      preco_base: p.preco_base || 0,
      preco_unitario: p.preco_base || 0,
      desconto_percent: 0
    });
  }

  saveCart();
  renderProductList();
  showToast(`✅ ${p.nome} adicionado ao orçamento!`);
  logSellerActivity('Adicionou ao Orçamento', {
    total_itens: qty,
    resumo_itens: `${qty}x ${p.nome} (Ref: ${p.referencia})`,
    detalhes_extras: `Produto: ${p.nome} | Qtd: ${qty}`
  });
}

function adjustCardQty(id, delta, prefix = 'card-qty-') {
  hapticFeedback(12);
  const input = document.getElementById(`${prefix}${id}`);
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(999, val + delta));
  input.value = val;
}

function validateCardInput(input) {
  let val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1) val = 1;
  if (val > 999) val = 999;
  input.value = val;
}

function addFromCard(id, prefix = 'card-qty-') {
  hapticFeedback(30);
  const input = document.getElementById(`${prefix}${id}`);
  const qty = input ? parseInt(input.value, 10) || 1 : 1;
  addToCart(id, qty);
  if (input) input.value = 1;
}

function quickAdd(id) {
  hapticFeedback(25);
  const p = PRODUTOS.find(item => item.id === id);
  if (!p) return;
  addToCart(id, 1);
}

function updateCartQty(id, delta) {
  hapticFeedback(15);
  const item = cartItems.find(i => i.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    cartItems = cartItems.filter(i => i.id !== id);
  }
  saveCart();
  renderCartSheet();
  renderProductList();
}

function removeCartItem(id) {
  hapticFeedback(20);
  cartItems = cartItems.filter(i => i.id !== id);
  saveCart();
  renderCartSheet();
  renderProductList();
  showToast('🗑️ Item removido do orçamento');
  logSellerActivity('Removeu do Orçamento', {
    detalhes_extras: `Item ID removido: ${id}`
  });
}

function updateBadges() {
  const total = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
  const headBadge = document.getElementById('header-cart-badge');
  const btmBadge = document.getElementById('bottom-cart-badge');
  const headPill = document.getElementById('header-cart-pill');

  if (headPill) headPill.textContent = total;
  [headBadge, btmBadge].forEach(b => {
    if (!b) return;
    b.textContent = total;
    b.classList.toggle('show', total > 0);
  });
}

function openCartSheet() {
  hapticFeedback(25);
  renderCartSheet();
  document.getElementById('cart-sheet-backdrop').classList.add('show');
  document.getElementById('cart-bottom-sheet').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCartSheet() {
  document.getElementById('cart-sheet-backdrop').classList.remove('show');
  document.getElementById('cart-bottom-sheet').classList.remove('show');
  document.body.style.overflow = '';
}

function calculateCartTotals() {
  let subtotalTabelaBruto = 0;
  let subtotalItensSemDesconto = 0;
  let subtotalItensComDesconto = 0;
  let baseItensSemDesconto = 0;
  let qtdItensSemDesconto = 0;
  let qtdTiposSemDesconto = 0;
  let totalQtd = 0;

  cartItems.forEach(item => {
    const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || 0);
    const pBase = (item.preco_base !== undefined) ? item.preco_base : pUnit;
    const discPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
    const pUnitDesc = pUnit * (1 - (discPercent / 100));

    subtotalTabelaBruto += (item.quantidade * pBase);
    subtotalItensSemDesconto += (item.quantidade * pUnit);
    subtotalItensComDesconto += (item.quantidade * pUnitDesc);
    totalQtd += item.quantidade;

    // Itens que NÃO possuem desconto individual (base elegível para desconto no pedido)
    if (discPercent <= 0) {
      baseItensSemDesconto += (item.quantidade * pUnit);
      qtdItensSemDesconto += item.quantidade;
      qtdTiposSemDesconto += 1;
    }
  });

  const descontoTotalItens = Math.max(0, subtotalItensSemDesconto - subtotalItensComDesconto);
  const discGlobalPercent = Math.max(0, Math.min(100, cartGlobalDiscountPercent || 0));

  // REGRA OPÇÃO 1: Desconto no pedido incide APENAS sobre a base dos itens sem desconto individual
  const valorDescontoGlobal = (baseItensSemDesconto * discGlobalPercent) / 100;
  const totalFinalLiquido = Math.max(0, subtotalItensComDesconto - valorDescontoGlobal);
  const economiaTotalReal = descontoTotalItens + valorDescontoGlobal;
  const percentualEconomiaTotal = subtotalItensSemDesconto > 0 ? ((economiaTotalReal / subtotalItensSemDesconto) * 100) : 0;

  return {
    subtotalTabelaBruto,
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    qtdItensSemDesconto,
    qtdTiposSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal,
    totalQtd
  };
}

function updateCartTotalsUI() {
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
    percentualEconomiaTotal
  } = calculateCartTotals();

  const subtotalSemDescEl = document.getElementById('cart-seller-subtotal-sem-desc');
  if (subtotalSemDescEl) {
    subtotalSemDescEl.textContent = `R$ ${subtotalItensSemDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const itemsDescRow = document.getElementById('cart-seller-items-desc-row');
  const itemsDescVal = document.getElementById('cart-seller-items-desc-val');
  if (itemsDescRow && itemsDescVal) {
    if (descontoTotalItens > 0.01) {
      itemsDescRow.style.display = 'flex';
      itemsDescVal.textContent = `-R$ ${descontoTotalItens.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      itemsDescRow.style.display = 'none';
    }
  }

  const globalDescValEl = document.getElementById('cart-seller-global-disc-val');
  if (globalDescValEl) {
    if (baseItensSemDesconto > 0) {
      globalDescValEl.textContent = discGlobalPercent > 0 
        ? `-R$ ${valorDescontoGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (s/ ${qtdTiposSemDesconto} item${qtdTiposSemDesconto > 1 ? 's' : ''})` 
        : '-';
    } else {
      globalDescValEl.textContent = '(Itens c/ desc. indiv.)';
    }
  }

  const globalDescNoticeEl = document.getElementById('cart-seller-global-desc-notice');
  if (globalDescNoticeEl) {
    if (baseItensSemDesconto <= 0 && cartItems.length > 0) {
      globalDescNoticeEl.style.display = 'block';
      globalDescNoticeEl.textContent = 'ℹ️ Todos os produtos já possuem desconto individual negociado.';
    } else {
      globalDescNoticeEl.style.display = 'none';
    }
  }

  const savingsBanner = document.getElementById('cart-seller-savings-banner');
  const savingsVal = document.getElementById('cart-seller-savings-val');
  if (savingsBanner && savingsVal) {
    if (economiaTotalReal > 0.01) {
      savingsBanner.style.display = 'flex';
      savingsVal.innerHTML = `R$ ${economiaTotalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style="font-size:0.75rem; font-weight:600;">(${percentualEconomiaTotal.toFixed(1)}% OFF)</span>`;
    } else {
      savingsBanner.style.display = 'none';
    }
  }

  const badgeEl = document.getElementById('cart-seller-discount-badge');
  if (badgeEl) {
    if (economiaTotalReal > 0.01) {
      badgeEl.style.display = 'inline-flex';
      badgeEl.textContent = `Economia Total: R$ ${economiaTotalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      badgeEl.style.display = 'none';
    }
  }

  const totalEl = document.getElementById('cart-seller-total-num');
  if (totalEl) {
    totalEl.textContent = `R$ ${totalFinalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  document.querySelectorAll('.btn-disc-pill').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.percent) === discGlobalPercent);
  });
}

function updateCartItemCardUI(itemId) {
  const item = cartItems.find(i => i.id === itemId);
  if (!item) return;

  const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || 0);
  const discItemPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
  const pUnitDesc = pUnit * (1 - (discItemPercent / 100));
  const subtotalSemDesconto = item.quantidade * pUnit;
  const subtotalComDesconto = item.quantidade * pUnitDesc;
  const valorDescUnit = pUnit * (discItemPercent / 100);

  const subtotalBaseEl = document.getElementById(`cart-subtotal-base-${itemId}`);
  if (subtotalBaseEl) {
    subtotalBaseEl.textContent = `R$ ${subtotalSemDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const descValEl = document.getElementById(`cart-item-desc-val-${itemId}`);
  if (descValEl) {
    descValEl.textContent = discItemPercent > 0 ? `-R$ ${valorDescUnit.toFixed(2).replace('.', ',')}/un` : '';
  }

  const unitDescRow = document.getElementById(`cart-unit-desc-row-${itemId}`);
  const unitDescVal = document.getElementById(`cart-unit-desc-val-${itemId}`);
  if (unitDescRow && unitDescVal) {
    if (discItemPercent > 0) {
      unitDescRow.style.display = 'flex';
      unitDescVal.textContent = `R$ ${pUnitDesc.toFixed(2).replace('.', ',')}`;
    } else {
      unitDescRow.style.display = 'none';
      unitDescVal.textContent = '';
    }
  }

  const subtotalEl = document.getElementById(`cart-subtotal-${itemId}`);
  if (subtotalEl) {
    subtotalEl.textContent = `R$ ${subtotalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function updateCartItemPrice(itemId, rawValue) {
  const item = cartItems.find(i => i.id === itemId);
  if (!item) return;

  const parsed = parseFloat(rawValue);
  if (!isNaN(parsed) && parsed >= 0) {
    item.preco_unitario = parsed;
  }
  saveCart();

  updateCartItemCardUI(itemId);
  updateCartTotalsUI();
}

function updateCartItemDiscountPercent(itemId, rawPercent) {
  const item = cartItems.find(i => i.id === itemId);
  if (!item) return;

  const parsedPercent = parseFloat(rawPercent);
  if (!isNaN(parsedPercent) && parsedPercent >= 0) {
    item.desconto_percent = Math.min(100, parsedPercent);
  } else {
    item.desconto_percent = 0;
  }
  saveCart();

  updateCartItemCardUI(itemId);
  updateCartTotalsUI();
}

function updateGlobalDiscountPercent(rawPercent) {
  const parsed = parseFloat(rawPercent);
  if (!isNaN(parsed) && parsed >= 0) {
    cartGlobalDiscountPercent = Math.min(100, parsed);
  } else {
    cartGlobalDiscountPercent = 0;
  }
  saveCart();
  updateCartTotalsUI();
}

function applyQuickGlobalDiscount(percentage) {
  hapticFeedback(20);
  const p = Math.max(0, Math.min(100, parseFloat(percentage) || 0));
  updateGlobalDiscountPercent(p);
  const input = document.getElementById('cart-input-global-discount');
  if (input) {
    input.value = p > 0 ? p.toFixed(1) : '';
  }
  document.querySelectorAll('.btn-disc-pill').forEach(btn => {
    btn.classList.toggle('active', parseFloat(btn.dataset.percent) === p);
  });
}

function getCommercialTerms() {
  try {
    const saved = JSON.parse(localStorage.getItem('rawell_commercial_terms')) || {};
    const paymentEl = document.getElementById('client-payment-terms');
    const payment = paymentEl ? paymentEl.value : (saved.pagamento !== undefined ? saved.pagamento : '');
    const validityEl = document.getElementById('client-proposal-validity');
    const validity = validityEl ? validityEl.value : (saved.validade || '10 dias');
    return { pagamento: payment, validade: validity };
  } catch (e) {
    return { pagamento: '', validade: '10 dias' };
  }
}

function saveCommercialTerms() {
  const terms = getCommercialTerms();
  localStorage.setItem('rawell_commercial_terms', JSON.stringify(terms));
}

function handlePaymentTermsChange(val) {
  saveCommercialTerms();
  const clearBtn = document.getElementById('btn-clear-payment');
  if (clearBtn) {
    clearBtn.classList.toggle('show', !!val);
  }
}

function clearPaymentSelection() {
  hapticFeedback(10);
  const sel = document.getElementById('client-payment-terms');
  if (sel) {
    sel.value = '';
    handlePaymentTermsChange('');
  }
}

function renderCartSheet() {
  const isSeller = isSellerLoggedIn();
  const area = document.getElementById('cart-content-area');
  const footerBar = document.getElementById('cart-footer-bar');
  const summaryQty = document.getElementById('cart-summary-qty');
  const summaryLine = document.querySelector('.cart-summary-line');
  if (summaryLine) {
    summaryLine.style.display = isSeller ? 'none' : 'flex';
  }

  if (!cartItems.length) {
    area.innerHTML = `
      <div style="text-align:center; padding:50px 10px;">
        <div style="font-size:3.8rem; margin-bottom:12px;">🛒</div>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--text); margin-bottom:6px;">Seu orçamento está vazio</h3>
        <p style="font-size:0.88rem; color:var(--text-3); margin-bottom:20px;">Navegue pelo catálogo e clique em "+ Adicionar" nos produtos.</p>
        <button class="hero-btn-primary" style="margin:0 auto; padding:0 24px; height:42px;" onclick="closeCartSheet(); scrollToProducts();">
          Ver Catálogo de Produtos
        </button>
      </div>
    `;
    footerBar.style.display = 'none';
    return;
  }

  footerBar.style.display = 'flex';
  const totalQty = cartItems.reduce((acc, i) => acc + i.quantidade, 0);
  summaryQty.textContent = `${totalQty} ite${totalQty === 1 ? 'm' : 'ns'} selecionado${totalQty === 1 ? '' : 's'}`;

  const {
    subtotalTabelaBruto,
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    qtdTiposSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal
  } = calculateCartTotals();

  let savedClient = {};
  let savedTerms = {};
  try {
    savedClient = JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY)) || {};
    savedTerms = JSON.parse(localStorage.getItem('rawell_commercial_terms')) || {};
  } catch (e) {}

  area.innerHTML = `
    <div class="cart-items-wrap">
      ${cartItems.map(item => {
        const pUnit = (item.preco_unitario !== undefined) ? item.preco_unitario : (item.preco_base || 0);
        const pBase = (item.preco_base !== undefined) ? item.preco_base : pUnit;
        const discItemPercent = Math.max(0, Math.min(100, item.desconto_percent || 0));
        const pUnitDesc = pUnit * (1 - (discItemPercent / 100));
        const subtotalSemDesconto = item.quantidade * pUnit;
        const subtotalComDesconto = item.quantidade * pUnitDesc;
        const valorDescUnit = pUnit * (discItemPercent / 100);

        return `
          <div class="cart-item-card">
            <div class="cart-item-pic">
              <img src="${item.imagem}" alt="${item.nome}">
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.nome}</h4>
              <div class="cart-item-subtitle">Ref: ${item.referencia}</div>
              
              <div style="display:flex; align-items:center; justify-content:space-between; margin-top:4px;">
                <div class="cart-item-stepper">
                  <button class="cart-step-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
                  <span class="cart-step-num">${item.quantidade}</span>
                  <button class="cart-step-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
              </div>

              ${isSeller ? `
                <div class="cart-item-price-section">
                  <!-- Linha 1: Preço Unitário -->
                  <div class="cart-item-price-edit-row">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:0.75rem; font-weight:700; color:var(--text-2);">Valor Unit.:</span>
                      <div class="cart-price-input-wrap" title="Alterar valor unitário base do item">
                        <span class="cart-price-symbol">R$</span>
                        <input type="number" step="0.01" min="0" class="cart-price-input-field" id="cart-input-price-${item.id}" value="${pUnit.toFixed(2)}" oninput="updateCartItemPrice(${item.id}, this.value)" onclick="this.select()">
                      </div>
                    </div>
                    <span class="cart-base-price-ref" title="Valor base da tabela">Tabela: R$ ${pBase.toFixed(2).replace('.', ',')}</span>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:0.78rem; color:var(--text-3);">Subtotal (${item.quantidade}x):</span>
                      <span style="font-size:0.85rem; font-weight:600; color:var(--text-2);" id="cart-subtotal-base-${item.id}">R$ ${subtotalSemDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <!-- Linha 3 (Abaixo do Subtotal): Desconto % -->
                  <div class="cart-item-discount-row">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span style="font-size:0.78rem; font-weight:700; color:#059669;">Desconto %:</span>
                      <div class="cart-discount-input-wrap" title="Aplicar desconto percentual neste produto">
                        <input type="number" step="0.1" min="0" max="100" class="cart-discount-input-field" id="cart-input-discount-${item.id}" value="${discItemPercent > 0 ? discItemPercent.toFixed(1) : ''}" placeholder="0" oninput="updateCartItemDiscountPercent(${item.id}, this.value)" onclick="this.select()">
                        <span class="cart-discount-symbol">%</span>
                      </div>
                    </div>
                    <span style="font-size:0.75rem; color:#059669; font-weight:700;" id="cart-item-desc-val-${item.id}">${discItemPercent > 0 ? `-R$ ${valorDescUnit.toFixed(2).replace('.', ',')}/un` : ''}</span>
                  </div>

                  <!-- Linha 4: Total Com Desconto -->
                  <div class="cart-item-discounted-total-line" style="flex-direction:column; align-items:stretch; gap:2px;">
                    <div style="display:${discItemPercent > 0 ? 'flex' : 'none'}; justify-content:space-between; font-size:0.78rem; color:#059669;" id="cart-unit-desc-row-${item.id}">
                      <span>Valor Unit. c/ Desconto:</span>
                      <strong id="cart-unit-desc-val-${item.id}">R$ ${pUnitDesc.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
                      <span style="font-size:0.82rem; font-weight:700; color:#0f4531;">Total Com Desconto:</span>
                      <strong class="subtotal-val" id="cart-subtotal-${item.id}" style="color:#059669; font-size:0.95rem;">R$ ${subtotalComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
            <button class="cart-del-btn" onclick="removeCartItem(${item.id})" title="Remover produto">🗑️</button>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Formulário do Cliente -->
    <div class="client-form-card">
      <div class="form-head-title">
        <span>👤</span> Dados para Contato Comercial
      </div>
      <div class="form-field-group">
        <label class="form-field-label">Nome Completo / Empresa <span class="req">*</span></label>
        <input type="text" id="client-name" class="form-field-input" placeholder="Ex: João da Silva ou Fazenda Primavera" value="${savedClient.nome || ''}">
      </div>
      <div class="form-field-group">
        <label class="form-field-label">Vendedor Responsável (opcional)</label>
        <div class="vendedor-select-wrap">
          <select id="client-vendedor" class="form-field-input">
            <option value="">Nenhum vendedor selecionado (Geral)</option>
            <option value="carlos" ${(savedClient.vendedor === 'carlos' || clientAttributedSeller === 'carlos') ? 'selected' : ''}>Carlos Silva</option>
            <option value="vendedor-1" ${savedClient.vendedor === 'vendedor-1' ? 'selected' : ''}>Vendedor 1</option>
            <option value="vendedor-2" ${savedClient.vendedor === 'vendedor-2' ? 'selected' : ''}>Vendedor 2</option>
          </select>
        </div>
      </div>
      <div class="form-field-group">
        <label class="form-field-label">CNPJ / Cidade / Estado (opcional)</label>
        <input type="text" id="client-doc" class="form-field-input" placeholder="00.000.000/0001-00 ou Cascavel - PR" value="${savedClient.doc || ''}">
      </div>

      ${isSeller ? `
        <!-- Condições Comerciais Exclusivas do Vendedor -->
        <div class="form-field-group">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <label class="form-field-label" style="margin-bottom:0;">Condição de Pagamento</label>
            <button type="button" class="btn-clear-payment ${savedTerms.pagamento ? 'show' : ''}" id="btn-clear-payment" onclick="clearPaymentSelection()">
              ✕ Limpar
            </button>
          </div>
          <div class="vendedor-select-wrap">
            <select id="client-payment-terms" class="form-field-input" onchange="handlePaymentTermsChange(this.value)">
              <option value="" ${!savedTerms.pagamento ? 'selected' : ''}>Nenhuma / A Combinar (Não definir)</option>
              <option value="PIX / À Vista (À vista c/ desconto)" ${savedTerms.pagamento === 'PIX / À Vista (À vista c/ desconto)' ? 'selected' : ''}>⚡ PIX / À Vista (À vista c/ desconto)</option>
              <option value="Boleto 30 Dias" ${savedTerms.pagamento === 'Boleto 30 Dias' ? 'selected' : ''}>📄 Boleto 30 Dias</option>
              <option value="Boleto 30 / 60 Dias" ${savedTerms.pagamento === 'Boleto 30 / 60 Dias' ? 'selected' : ''}>📄 Boleto 30 / 60 Dias</option>
              <option value="Boleto 30 / 60 / 90 Dias" ${savedTerms.pagamento === 'Boleto 30 / 60 / 90 Dias' ? 'selected' : ''}>📄 Boleto 30 / 60 / 90 Dias</option>
              <option value="Cartão em até 3x" ${savedTerms.pagamento === 'Cartão em até 3x' ? 'selected' : ''}>💳 Cartão em até 3x</option>
              <option value="A Combinar com Vendedor" ${savedTerms.pagamento === 'A Combinar com Vendedor' ? 'selected' : ''}>🤝 A Combinar c/ Representante</option>
            </select>
            <span class="vendedor-select-arrow">▼</span>
          </div>
        </div>

        <div class="form-field-group">
          <label class="form-field-label">Validade da Proposta</label>
          <input type="text" id="client-proposal-validity" class="form-field-input" value="${savedTerms.validade || '10 dias'}" placeholder="10 dias" oninput="saveCommercialTerms()">
        </div>
      ` : ''}

      ${!isSeller ? `
        <div style="text-align:center; padding:10px 4px 2px; font-size:0.78rem; color:var(--text-3);">
          💼 É representante comercial? <button type="button" onclick="openSellerLoginModal()" style="color:var(--brand-light); font-weight:700; text-decoration:underline; cursor:pointer;">Acessar Modo Vendedor 🔒</button>
        </div>
      ` : ''}
    </div>
  `;

  // Totalizador no rodapé do drawer se logado como vendedor
  let totalBox = document.getElementById('cart-seller-total-box');
  if (isSeller) {
    const totalBoxHtml = `
      <!-- Detalhamento de Subtotais e Descontos Concedidos -->
      <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:6px;">
        <!-- Linha 1: Subtotal dos Produtos -->
        <div class="seller-breakdown-row">
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-2);">Subtotal dos Produtos:</span>
          <strong id="cart-seller-subtotal-sem-desc" style="font-size:0.88rem; color:var(--text);">R$ ${subtotalItensSemDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>

        <!-- Linha 2: Desconto nos Produtos (se houver) -->
        <div class="seller-breakdown-row" id="cart-seller-items-desc-row" style="display:${descontoTotalItens > 0.01 ? 'flex' : 'none'}; color:#059669;">
          <span style="font-size:0.78rem; font-weight:700;">🏷️ Desconto nos Produtos:</span>
          <strong id="cart-seller-items-desc-val" style="font-size:0.82rem;">-R$ ${descontoTotalItens.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>

        <!-- Linha 3: Desconto no Pedido / Fechamento com Atalhos -->
        <div class="seller-breakdown-row" style="margin-top:2px; flex-wrap:wrap; gap:4px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:0.8rem; font-weight:700; color:#059669;">Desconto no Pedido:</span>
            <div class="seller-quick-pills">
              <button type="button" class="btn-disc-pill ${discGlobalPercent === 0 ? 'active' : ''}" data-percent="0" onclick="applyQuickGlobalDiscount(0)">0%</button>
              <button type="button" class="btn-disc-pill ${discGlobalPercent === 5 ? 'active' : ''}" data-percent="5" onclick="applyQuickGlobalDiscount(5)">-5%</button>
              <button type="button" class="btn-disc-pill ${discGlobalPercent === 10 ? 'active' : ''}" data-percent="10" onclick="applyQuickGlobalDiscount(10)">-10%</button>
              <button type="button" class="btn-disc-pill ${discGlobalPercent === 15 ? 'active' : ''}" data-percent="15" onclick="applyQuickGlobalDiscount(15)">-15%</button>
            </div>
            <div class="seller-disc-input-wrap" title="Desconto % sobre itens sem desconto individual">
              <input type="number" step="0.1" min="0" max="100" class="seller-disc-input" id="cart-input-global-discount" value="${discGlobalPercent > 0 ? discGlobalPercent.toFixed(1) : ''}" placeholder="%" oninput="updateGlobalDiscountPercent(this.value)" onclick="this.select()">
            </div>
          </div>
          <span id="cart-seller-global-disc-val" style="color:#059669; font-weight:700; font-size:0.82rem;">
            ${baseItensSemDesconto > 0 
              ? (discGlobalPercent > 0 ? `-R$ ${valorDescontoGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (s/ ${qtdTiposSemDesconto} item${qtdTiposSemDesconto > 1 ? 's' : ''})` : '-')
              : '(Itens c/ desc. indiv.)'
            }
          </span>
        </div>

        <div id="cart-seller-global-desc-notice" style="display:${(baseItensSemDesconto <= 0 && cartItems.length > 0) ? 'block' : 'none'}; font-size:0.72rem; color:var(--text-3); font-style:italic;">
          ℹ️ Todos os produtos já possuem desconto individual negociado.
        </div>

        <!-- Linha 4: Banner de Economia Total Real do Cliente -->
        <div class="seller-savings-banner" id="cart-seller-savings-banner" style="display:${economiaTotalReal > 0.01 ? 'flex' : 'none'};">
          <span>🎉 Economia Total do Cliente:</span>
          <strong id="cart-seller-savings-val">R$ ${economiaTotalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span style="font-size:0.75rem; font-weight:600;">(${percentualEconomiaTotal.toFixed(1)}% OFF)</span></strong>
        </div>
      </div>

      <div style="height:1px; background:var(--border); margin:4px 0 6px;"></div>

      <!-- Linha Principal: Total Líquido da Proposta -->
      <div class="seller-total-main-row">
        <div class="seller-total-title">
          <span>Total Líquido da Proposta:</span>
          <span class="seller-disc-badge" id="cart-seller-discount-badge" style="display:${economiaTotalReal > 0.01 ? 'inline-flex' : 'none'};">
            Economia Total: R$ ${economiaTotalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div class="seller-total-price" id="cart-seller-total-num">
          R$ ${totalFinalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
    `;

    if (!totalBox) {
      totalBox = document.createElement('div');
      totalBox.id = 'cart-seller-total-box';
      totalBox.className = 'cart-total-proposal-card';
      totalBox.innerHTML = totalBoxHtml;
      footerBar.insertBefore(totalBox, footerBar.firstChild);
    } else {
      totalBox.style.display = 'flex';
      totalBox.className = 'cart-total-proposal-card';
      totalBox.innerHTML = totalBoxHtml;
    }
  } else if (totalBox) {
    totalBox.style.display = 'none';
  }

  // Ações secundárias no rodapé organizadas em pares
  const actionsContainer = document.getElementById('cart-actions-dynamic-container');
  if (actionsContainer) {
    if (isSeller) {
      actionsContainer.innerHTML = `
        <div class="cart-actions-grid-pairs">
          <!-- Par 1: WhatsApp Direto p/ Cliente -->
          <div class="cart-actions-pair-block">
            <div class="cart-action-pair-title"><span>📱</span> WhatsApp Direto p/ Cliente:</div>
            <div class="cart-actions-2col">
              <button type="button" class="btn-cart-action btn-wa-price" onclick="openClientWhatsAppModal(true)" title="Enviar para o WhatsApp do cliente com valores e descontos">
                <span>💬</span> Whats c/ Preço
              </button>
              <button type="button" class="btn-cart-action btn-wa-noprice" onclick="openClientWhatsAppModal(false)" title="Enviar para o WhatsApp do cliente apenas a lista de produtos">
                <span>💬</span> Whats s/ Preço
              </button>
            </div>
          </div>

          <!-- Par 2: Proposta em PDF -->
          <div class="cart-actions-pair-block">
            <div class="cart-action-pair-title"><span>📄</span> Proposta Comercial em PDF:</div>
            <div class="cart-actions-2col">
              <button type="button" class="btn-cart-action btn-pdf-price" onclick="openPdfProposalModal(true)" title="Gerar proposta PDF com tabela de preços e condições">
                <span>📄</span> PDF c/ Preço
              </button>
              <button type="button" class="btn-cart-action btn-pdf-noprice" onclick="openPdfProposalModal(false)" title="Gerar espelho do pedido em PDF sem valores">
                <span>📄</span> PDF s/ Preço
              </button>
            </div>
          </div>

          <!-- Par 3: Links Diretos do Catálogo -->
          <div class="cart-actions-pair-block">
            <div class="cart-action-pair-title"><span>🔗</span> Links Diretos do Catálogo:</div>
            <div class="cart-actions-2col">
              <button type="button" class="btn-cart-action btn-link-price" onclick="copyCartShareLink(true)" title="Copiar link com preços e descontos fixados">
                <span>💰</span> Link c/ Preço
              </button>
              <button type="button" class="btn-cart-action btn-link-noprice" onclick="copyCartShareLink(false)" title="Copiar link padrão sem preços">
                <span>🔗</span> Link s/ Preço
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      actionsContainer.innerHTML = `
        <div class="cart-actions-2col" style="margin-top:2px;">
          <button type="button" class="btn-cart-action btn-pdf-noprice" onclick="openPdfProposalModal(false)" title="Visualizar e Imprimir Lista em PDF">
            <span>📄</span> Visualizar PDF
          </button>
          <button type="button" class="btn-cart-action btn-link-noprice" onclick="copyCartShareLink(false)" title="Copiar Link do Orçamento">
            <span>🔗</span> Copiar Link
          </button>
        </div>
      `;
    }
  }
}

function generateCartShareUrl(includePrices = false) {
  if (!cartItems || !cartItems.length) return window.location.href.split('?')[0];

  let itemsParam = '';
  if (includePrices) {
    itemsParam = cartItems.map(i => {
      const price = (i.preco_unitario !== undefined) ? i.preco_unitario : (i.preco_base || 0);
      const disc = (i.desconto_percent !== undefined) ? i.desconto_percent : 0;
      return `${i.id}:${i.quantidade}:${price.toFixed(2)}:${disc.toFixed(1)}`;
    }).join(',');
  } else {
    itemsParam = cartItems.map(i => `${i.id}:${i.quantidade}`).join(',');
  }

  const cleanBase = window.location.href.split('?')[0].split('#')[0];
  const url = new URL(cleanBase);
  url.searchParams.set('orcamento', itemsParam);

  const activeSeller = getActiveSellerObj();
  if (activeSeller && activeSeller.id) {
    url.searchParams.set('vendedor', activeSeller.id);
  }
  if (includePrices) {
    url.searchParams.set('com_precos', '1');
    if (cartGlobalDiscountPercent > 0) {
      url.searchParams.set('desc_global', cartGlobalDiscountPercent.toFixed(1));
    }
  }

  return url.toString();
}

function copyCartShareLink(includePrices = false) {
  hapticFeedback(25);
  if (!cartItems.length) {
    showToast('⚠️ Seu orçamento está vazio.');
    return;
  }
  const shareUrl = generateCartShareUrl(includePrices);
  const {
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal,
    totalQtd
  } = calculateCartTotals();

  const totalFormatado = totalFinalLiquido > 0 ? `R$ ${totalFinalLiquido.toFixed(2).replace('.', ',')}` : 'Tabela Padrão';
  const economiaStr = economiaTotalReal > 0.01 ? ` | Economia: R$ ${economiaTotalReal.toFixed(2).replace('.', ',')} (${percentualEconomiaTotal.toFixed(0)}% OFF)` : '';

  const toastMsg = includePrices 
    ? `💰 Link copiado! (${totalFormatado}${economiaStr})` 
    : '🔗 Link do orçamento copiado com sucesso!';

  logSellerActivity(includePrices ? `💰 Copiou Link COM PREÇO (Total: ${totalFormatado})` : '🔗 Copiou Link do Orçamento', {
    link_proposta: shareUrl,
    link_com_preco: shareUrl,
    total_itens: totalQtd,
    valor_total: totalFormatado,
    detalhes_extras: includePrices ? `Total Líquido: ${totalFormatado} | Economia: R$ ${economiaTotalReal.toFixed(2)} (Itens: -R$ ${descontoTotalItens.toFixed(2)}, Pedido: -R$ ${valorDescontoGlobal.toFixed(2)})` : 'Link padrão'
  });

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast(toastMsg);
    }).catch(() => {
      prompt(includePrices ? 'Copie o link com preços:' : 'Copie o link do orçamento:', shareUrl);
    });
  } else {
    prompt(includePrices ? 'Copie o link com preços:' : 'Copie o link do orçamento:', shareUrl);
  }
}

function loadCartFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const orcamentoParam = params.get('orcamento') || params.get('pedido') || params.get('cart');
    if (!orcamentoParam) return false;

    // Formato: 1:2 ou 1:2:85.00 ou 1:2:85.00:10.0
    const entries = orcamentoParam.split(',');
    const newItems = [];
    let hasCustomPrices = false;

    entries.forEach(entry => {
      const parts = entry.trim().split(':');
      const prodId = parseInt(parts[0], 10);
      const qty = parseInt(parts[1], 10) || 1;
      const customPrice = parts[2] ? parseFloat(parts[2]) : null;
      const customDiscount = parts[3] ? parseFloat(parts[3]) : 0;

      if (!isNaN(prodId)) {
        const p = PRODUTOS.find(item => item.id === prodId);
        if (p) {
          let unitPrice = p.preco_base || 0;
          if (customPrice !== null && !isNaN(customPrice) && customPrice >= 0) {
            unitPrice = customPrice;
            hasCustomPrices = true;
          }
          const itemDisc = (!isNaN(customDiscount) && customDiscount >= 0) ? customDiscount : 0;
          if (itemDisc > 0) hasCustomPrices = true;

          newItems.push({
            id: p.id,
            nome: p.nome,
            referencia: p.referencia,
            unidade: p.unidade,
            imagem: p.imagens[0],
            quantidade: Math.max(1, Math.min(999, qty)),
            preco_base: p.preco_base || 0,
            preco_unitario: unitPrice,
            desconto_percent: itemDisc
          });
        }
      }
    });

    const descGlobalParam = params.get('desc_global') || params.get('desconto_global');
    if (descGlobalParam) {
      const parsedDesc = parseFloat(descGlobalParam);
      if (!isNaN(parsedDesc) && parsedDesc >= 0) {
        cartGlobalDiscountPercent = Math.min(100, parsedDesc);
        hasCustomPrices = true;
      }
    }

    if (newItems.length > 0) {
      cartItems = newItems;
      saveCart();
      renderProductList();
      updateBadges();

      const cleanBase = window.location.origin + window.location.pathname;
      const cleanUrl = clientAttributedSeller ? `${cleanBase}?vendedor=${clientAttributedSeller}` : cleanBase;
      window.history.replaceState({}, document.title, cleanUrl);

      setTimeout(() => {
        if (hasCustomPrices) {
          showToast(`💰 Orçamento com preços (${newItems.length} itens) carregado!`);
        } else {
          showToast(`🎉 Orçamento com ${newItems.length} itens carregado!`);
        }
        openCartSheet();
      }, 400);

      logSellerActivity('Abertura via Link Mágico Recompra', {
        total_itens: newItems.reduce((acc, i) => acc + i.quantidade, 0),
        resumo_itens: newItems.map(i => `${i.quantidade}x ${i.nome}`).join(', ')
      });

      return true;
    }
  } catch (err) {
    console.warn('Erro ao carregar orçamento da URL:', err);
  }
  return false;
}