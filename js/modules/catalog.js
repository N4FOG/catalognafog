// ═══════════════════════════════════════════════════════════════
//  CATÁLOGO, STORIES, BUSCA, FILTROS & MODAL DE PRODUTO
// ═══════════════════════════════════════════════════════════════
function renderStoriesCategories() {
  const track = document.getElementById('categories-story-track');
  if (!track) return;

  track.innerHTML = CATEGORIAS.map(cat => {
    const isActive = appState.cat === cat.id;
    const count = cat.id === 'todos' ? PRODUTOS.length : PRODUTOS.filter(p => p.categoria === cat.id).length;
    return `
      <div class="story-item ${isActive ? 'active' : ''}" onclick="setCategory('${cat.id}')">
        <div class="story-avatar-wrap">
          <div class="story-avatar-inner">${cat.icone}</div>
          <span class="story-badge-count">${count}</span>
        </div>
        <span class="story-name">${cat.nome}</span>
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  RENDERIZAÇÃO: PRODUTOS & MODOS (GRID / LIST)
// ═══════════════════════════════════════════════════════════════
function getFilteredProducts() {
  let list = [...PRODUTOS];

  if (appState.cat !== 'todos') {
    list = list.filter(p => p.categoria === appState.cat);
  }

  if (appState.form !== 'todos') {
    list = list.filter(p => p.tipo_formulacao === appState.form);
  }

  if (appState.search) {
    const term = normText(appState.search);
    list = list.filter(p =>
      normText(p.nome).includes(term) ||
      normText(p.descricao).includes(term) ||
      normText(p.referencia).includes(term) ||
      p.alvos.some(alvo => normText(alvo).includes(term))
    );
  }

  // Ordenação
  if (appState.sort === 'nome-az') list.sort((a,b) => a.nome.localeCompare(b.nome));
  else if (appState.sort === 'nome-za') list.sort((a,b) => b.nome.localeCompare(a.nome));
  else if (appState.sort === 'ref') list.sort((a,b) => a.referencia.localeCompare(b.referencia));
  else list.sort((a,b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

  return list;
}

function renderProductList() {
  const list = getFilteredProducts();
  const container = document.getElementById('products-layout');
  const emptyBox = document.getElementById('empty-state-box');
  const countLabel = document.getElementById('products-count-label');
  const filterIndicator = document.getElementById('filter-active-indicator');
  const isSeller = isSellerLoggedIn();

  if (!container) return;

  if (!list.length) {
    container.innerHTML = '';
    if (emptyBox) emptyBox.classList.add('show');
    if (countLabel) countLabel.innerHTML = 'Nenhum resultado encontrado';
    if (filterIndicator) filterIndicator.innerHTML = '';
    return;
  }

  if (emptyBox) emptyBox.classList.remove('show');
  if (countLabel) countLabel.innerHTML = `Exibindo <span>${list.length}</span> de ${PRODUTOS.length} produtos`;

  // Indicador de Filtro Ativo
  if (filterIndicator) {
    let pills = [];
    if (appState.cat !== 'todos') {
      const catObj = CATEGORIAS.find(c => c.id === appState.cat);
      pills.push(`
        <span class="filter-active-pill">
          ${catObj ? catObj.icone + ' ' + catObj.nome : appState.cat}
          <button onclick="setCategory('todos')" title="Remover filtro de categoria">✕</button>
        </span>
      `);
    }
    if (appState.search) {
      pills.push(`
        <span class="filter-active-pill">
          🔍 "${appState.search}"
          <button onclick="clearSearch()" title="Limpar busca">✕</button>
        </span>
      `);
    }
    filterIndicator.innerHTML = pills.join(' ');
  }

  const isGrid = appState.viewMode === 'grid';
  container.className = `products-layout ${isGrid ? 'grid-mode' : 'list-mode'}`;

  const term = (appState.search || appState.searchTerm || '').trim();

  container.innerHTML = list.map(p => {
    const cartItem = cartItems.find(i => i.id === p.id);
    const inCart = !!cartItem;
    const catObj = CATEGORIAS.find(c => c.id === p.categoria);
    const formObj = FORMULACOES.find(f => f.id === p.tipo_formulacao);
    
    // Identifica embalagem
    const packFeature = p.caracteristicas ? p.caracteristicas.find(c => c.toLowerCase().includes('frasco') || c.toLowerCase().includes('caixa') || c.toLowerCase().includes('sachê') || c.toLowerCase().includes('display') || c.toLowerCase().includes('seringa') || c.toLowerCase().includes('balde') || c.toLowerCase().includes('envelope')) : null;
    const packTag = packFeature ? packFeature.split('(')[0].trim() : (p.unidade ? p.unidade.toUpperCase() : 'UN');

    // Alvos principais (até 2 no grid, até 3 no list)
    const targetsGrid = (p.alvos || []).slice(0, 2);
    const moreGridCount = (p.alvos || []).length - targetsGrid.length;

    const targetsList = (p.alvos || []).slice(0, 4);
    const moreListCount = (p.alvos || []).length - targetsList.length;

    // Preço do vendedor (se logado)
    const precoBase = p.preco_base || 0;
    const sellerPriceHtml = (isSeller && precoBase > 0) ? `
      <div style="display:inline-flex; align-items:center; gap:5px; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.35); border-radius:var(--radius-xs); padding:2px 8px; margin:4px 0 2px; font-size:0.75rem;">
        <span style="color:#059669; font-weight:800;">💰 Tabela:</span>
        <strong style="color:var(--text); font-weight:800;">R$ ${precoBase.toFixed(2).replace('.', ',')}</strong>
      </div>
    ` : '';

    if (isGrid) {
      return `
        <div class="prod-card" onclick="openProductSheet(${p.id})">
          <div class="prod-thumb-box">
            <img src="${p.imagens[0]}" alt="${p.nome}" loading="lazy">
            ${p.destaque ? '<span class="badge-star">⭐ Top Vendas</span>' : ''}
            <span class="badge-cat-emoji" title="${catObj ? catObj.nome : ''}">${catObj ? catObj.icone : '🌿'}</span>
            <span class="badge-form-pill">${formObj ? formObj.icone + ' ' + formObj.nome.split(' ')[0] : '⚡'}</span>
          </div>
          <div class="prod-info-box">
            <div>
              <div class="prod-meta-top">
                <span class="prod-pack-tag">📦 ${packTag}</span>
              </div>
	            <span class="prod-ref">Ref: ${p.referencia}</span>
              <h3 class="prod-name">${highlightSearch(p.nome, term)}</h3>
              <p class="prod-desc-line">${highlightSearch(p.descricao, term)}</p>
              ${sellerPriceHtml}
            </div>

            <div>
              <div class="prod-targets-row">
                ${targetsGrid.map(a => `<span class="target-tag-chip">🎯 ${a}</span>`).join('')}
                ${moreGridCount > 0 ? `<span class="target-more-chip">+${moreGridCount}</span>` : ''}
              </div>
              
              <div class="prod-action-row" onclick="event.stopPropagation();">
                <div class="card-stepper-box">
                  <button class="card-step-btn" onclick="adjustCardQty(${p.id}, -1)" title="Diminuir">−</button>
                  <input type="number" id="card-qty-${p.id}" class="card-step-input" value="${inCart ? cartItem.quantidade : 1}" min="1" max="999" onclick="this.select()" onchange="validateCardInput(this)">
                  <button class="card-step-btn" onclick="adjustCardQty(${p.id}, 1)" title="Aumentar">+</button>
                </div>
                <button class="btn-card-quote ${inCart ? 'in-cart' : ''}" onclick="addFromCard(${p.id})" title="Adicionar à cotação">
                  ${inCart ? `✓ Cotar (${cartItem.quantidade})` : '+ Cotar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="prod-card" onclick="openProductSheet(${p.id})">
          <div class="prod-thumb-box">
            <img src="${p.imagens[0]}" alt="${p.nome}" loading="lazy">
            ${p.destaque ? '<span class="badge-star">⭐ Top Vendas</span>' : ''}
            <span class="badge-form-pill">${formObj ? formObj.icone + ' ' + formObj.nome : '⚡'}</span>
          </div>
          <div class="prod-info-box">
            <div>
              <div class="prod-meta-top" style="margin-bottom:2px;">
                <span class="prod-ref">CÓDIGO: ${p.referencia}</span>
                <span class="prod-pack-tag">📦 ${packTag}</span>
              </div>
              <h3 class="prod-name">${highlightSearch(p.nome, term)}</h3>
              <p class="prod-desc-line">${highlightSearch(p.descricao, term)}</p>
              ${sellerPriceHtml}
            </div>

            <div class="prod-targets-row">
              ${targetsList.map(a => `<span class="target-tag-chip">🎯 ${a}</span>`).join('')}
              ${moreListCount > 0 ? `<span class="target-more-chip">+${moreListCount} alvos</span>` : ''}
            </div>

            <div class="prod-action-row" onclick="event.stopPropagation();">
              <span class="btn-card-ficha-link" onclick="openProductSheet(${p.id})">
                <span>📄</span> Ver Especificações
              </span>
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="card-stepper-box">
                  <button class="card-step-btn" onclick="adjustCardQty(${p.id}, -1)" title="Diminuir">−</button>
                  <input type="number" id="card-qty-list-${p.id}" class="card-step-input" value="${inCart ? cartItem.quantidade : 1}" min="1" max="999" onclick="this.select()" onchange="validateCardInput(this)">
                  <button class="card-step-btn" onclick="adjustCardQty(${p.id}, 1, 'card-qty-list-')" title="Aumentar">+</button>
                </div>
                <button class="btn-card-quote ${inCart ? 'in-cart' : ''}" onclick="addFromCard(${p.id}, 'card-qty-list-')" style="padding: 0 16px;">
                  ${inCart ? `✓ Cotar (${cartItem.quantidade})` : '+ Cotar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');
}

function setViewMode(mode) {
  hapticFeedback(15);
  appState.viewMode = mode;
  document.getElementById('btn-view-grid')?.classList.toggle('active', mode === 'grid');
  document.getElementById('btn-view-list')?.classList.toggle('active', mode === 'list');
  renderProductList();
}

function setCategory(id) {
  hapticFeedback(15);
  
  // Limpa busca ativa ao selecionar categoria para evitar conflito de filtros
  appState.search = '';
  if (mSearchInput) mSearchInput.value = '';
  if (dSearchInput) dSearchInput.value = '';
  searchClearBtn?.classList.remove('show');

  appState.cat = id;
  renderStoriesCategories();
  renderProductList();
  setTimeout(() => {
    scrollToProducts();
  }, 30);
}

function changeSorting(val) {
  appState.sort = val;
  renderProductList();
}

function resetAllFilters() {
  hapticFeedback(20);
  appState.cat = 'todos';
  appState.form = 'todos';
  appState.search = '';
  if (mSearchInput) mSearchInput.value = '';
  if (dSearchInput) dSearchInput.value = '';
  searchClearBtn?.classList.remove('show');
  renderStoriesCategories();
  renderProductList();
}

// ═══════════════════════════════════════════════════════════════
//  BUSCA SINCRONIZADA (MOBILE E DESKTOP)
// ═══════════════════════════════════════════════════════════════
const mSearchInput = document.getElementById('main-search-input');
const dSearchInput = document.getElementById('desktop-search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
let searchDebounce;

function handleSearchChange(val) {
  appState.search = val;
  if (mSearchInput) mSearchInput.value = val;
  if (dSearchInput) dSearchInput.value = val;
  searchClearBtn?.classList.toggle('show', val.length > 0);

  // Ao buscar termo, reseta a categoria para 'todos' para pesquisar no catálogo geral
  if (val.trim().length > 0 && appState.cat !== 'todos') {
    appState.cat = 'todos';
    renderStoriesCategories();
  }

  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    renderProductList();
  }, 150);
}

mSearchInput?.addEventListener('input', (e) => handleSearchChange(e.target.value));
dSearchInput?.addEventListener('input', (e) => handleSearchChange(e.target.value));

function clearSearch() {
  hapticFeedback(15);
  appState.search = '';
  if (mSearchInput) mSearchInput.value = '';
  if (dSearchInput) dSearchInput.value = '';
  searchClearBtn?.classList.remove('show');
  renderProductList();
}

function focusMainSearch() {
  hapticFeedback(15);
  mSearchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => mSearchInput?.focus(), 300);
}

function quickSearch(term) {
  hapticFeedback(15);
  // Garante pesquisa global nos 32 produtos ao clicar em tag
  appState.cat = 'todos';
  renderStoriesCategories();
  handleSearchChange(term);
  setTimeout(() => {
    scrollToProducts();
  }, 40);
}

// Atalho '/' para buscar no desktop
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== dSearchInput && document.activeElement !== mSearchInput) {
    e.preventDefault();
    dSearchInput?.focus();
    mSearchInput?.focus();
  }
});

// ═══════════════════════════════════════════════════════════════
//  MODAL / BOTTOM SHEET DE DETALHES DO PRODUTO
// ═══════════════════════════════════════════════════════════════
function openProductSheet(id) {
  hapticFeedback(20);
  const p = PRODUTOS.find(item => item.id === id);
  if (!p) return;

  appState.currentSheetProdId = id;
  appState.sheetQty = 1;
  document.getElementById('sheet-qty-val').textContent = '1';

  const catObj = CATEGORIAS.find(c => c.id === p.categoria);
  const formObj = FORMULACOES.find(f => f.id === p.tipo_formulacao);

  const body = document.getElementById('product-sheet-body');
  body.innerHTML = `
    <div class="sheet-prod-img-box">
      <img src="${p.imagens[0]}" alt="${p.nome}">
    </div>

    <div>
      <div class="sheet-prod-meta">
        <div class="sheet-prod-ref">CÓDIGO: ${p.referencia}</div>
        <h2 class="sheet-prod-name">${p.nome}</h2>
        <div class="sheet-badges-row">
          ${p.destaque ? '<span class="sheet-pill star">⭐ Mais Vendido</span>' : ''}
          <span class="sheet-pill cat">${catObj ? catObj.icone + ' ' + catObj.nome : 'Geral'}</span>
          <span class="sheet-pill form">${formObj ? formObj.icone + ' ' + formObj.nome : 'Formulação'}</span>
        </div>
      </div>

      <!-- Tabs Nav -->
      <div class="sheet-tabs-nav">
        <button class="sheet-tab-btn active" onclick="switchSheetTab(this, 'st-desc')">Descrição</button>
        <button class="sheet-tab-btn" onclick="switchSheetTab(this, 'st-chars')">Vantagens</button>
        <button class="sheet-tab-btn" onclick="switchSheetTab(this, 'st-alvos')">Alvos (${p.alvos.length})</button>
      </div>

      <!-- Tabs Content -->
      <div class="sheet-tab-content active" id="st-desc">
        <div class="sheet-desc-text">${p.descricao_longa}</div>
      </div>

      <div class="sheet-tab-content" id="st-chars">
        <div class="sheet-list-items">
          ${p.caracteristicas.map(c => `<div class="sheet-list-item">${c}</div>`).join('')}
        </div>
      </div>

      <div class="sheet-tab-content" id="st-alvos">
        <div class="sheet-alvos-cloud">
          ${p.alvos.map(a => `<span class="alvo-chip">🎯 ${a}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('product-sheet-backdrop').classList.add('show');
  document.getElementById('product-bottom-sheet').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductSheet() {
  document.getElementById('product-sheet-backdrop').classList.remove('show');
  document.getElementById('product-bottom-sheet').classList.remove('show');
  document.body.style.overflow = '';
  appState.currentSheetProdId = null;
}

function switchSheetTab(btn, targetId) {
  hapticFeedback(10);
  const parent = btn.parentElement;
  parent.querySelectorAll('.sheet-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const body = document.getElementById('product-sheet-body');
  body.querySelectorAll('.sheet-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(targetId)?.classList.add('active');
}

function adjustSheetQty(delta) {
  hapticFeedback(15);
  appState.sheetQty = Math.max(1, appState.sheetQty + delta);
  document.getElementById('sheet-qty-val').textContent = appState.sheetQty;
}

function addSheetProductToCart() {
  if (!appState.currentSheetProdId) return;
  hapticFeedback(30);
  addToCart(appState.currentSheetProdId, appState.sheetQty);
  closeProductSheet();
}

function shareCurrentProduct() {
  hapticFeedback(20);
  const p = PRODUTOS.find(item => item.id === appState.currentSheetProdId);
  if (!p) return;

  const text = `🌿 *Rawell Química — ${p.nome}*\n\nRef: ${p.referencia}\n${p.descricao}\n\n📱 Solicite cotação: WhatsApp (45) 99933-2563`;

  if (navigator.share) {
    navigator.share({
      title: p.nome,
      text: text,
      url: window.location.href
    }).catch(() => {});
  } else {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }
}

function changeSheetMainImg(src, thumbEl) {
  hapticFeedback(12);
  const mainImg = document.getElementById('sheet-main-img');
  if (mainImg) {
    mainImg.style.opacity = '0.25';
    mainImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 120);
  }
  if (thumbEl) {
    const parent = thumbEl.parentElement;
    parent.querySelectorAll('.sheet-thumb-item').forEach(el => el.classList.remove('active'));
    thumbEl.classList.add('active');
  }
}

function openProductSheet(id) {
  hapticFeedback(20);
  const p = PRODUTOS.find(item => item.id === id);
  if (!p) return;

  appState.currentSheetProdId = id;
  appState.sheetQty = 1;
  document.getElementById('sheet-qty-val').textContent = '1';

  const catObj = CATEGORIAS.find(c => c.id === p.categoria);
  const formObj = FORMULACOES.find(f => f.id === p.tipo_formulacao);
  const isSeller = isSellerLoggedIn();
  const precoBase = p.preco_base || 0;

  logSellerActivity('Visualização de Produto', {
    detalhes_extras: `Produto: ${p.nome} (Ref: ${p.referencia})`
  });

  const body = document.getElementById('product-sheet-body');
  body.innerHTML = `
    <div class="sheet-gallery-wrap">
      <div class="sheet-main-img-viewport">
        <img id="sheet-main-img" src="${p.imagens[0]}" alt="${p.nome}">
      </div>
      ${p.imagens.length > 1 ? `
        <div class="sheet-thumbs-row">
          ${p.imagens.map((imgSrc, idx) => `
            <div class="sheet-thumb-item ${idx === 0 ? 'active' : ''}" onclick="changeSheetMainImg('${imgSrc}', this)" title="Foto ${idx + 1}">
              <img src="${imgSrc}" alt="${p.nome} - Foto ${idx + 1}">
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div>
      <div class="sheet-prod-meta">
        <div class="sheet-prod-ref">CÓDIGO: ${p.referencia}</div>
        <h2 class="sheet-prod-name">${p.nome}</h2>
        <div class="sheet-badges-row">
          ${p.destaque ? '<span class="sheet-pill star">⭐ Mais Vendido</span>' : ''}
          <span class="sheet-pill cat">${catObj ? catObj.icone + ' ' + catObj.nome : 'Geral'}</span>
          <span class="sheet-pill form">${formObj ? formObj.icone + ' ' + formObj.nome : 'Formulação'}</span>
        </div>
      </div>

      ${(isSeller && precoBase > 0) ? `
        <div style="background:rgba(16, 185, 129, 0.12); border:1.5px solid rgba(16, 185, 129, 0.4); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.85rem; font-weight:700; color:var(--text-2);">💰 Preço Tabela de Fábrica:</span>
          <strong style="font-size:1.1rem; color:var(--brand-mid); font-weight:800;">R$ ${precoBase.toFixed(2).replace('.', ',')}</strong>
        </div>
      ` : ''}

      <!-- Destaque "O que faz" -->
      <div class="prod-action-headline" style="font-size:0.9rem; padding:10px 14px; margin-bottom:14px;">
        <span class="action-bolt">⚡</span>
        <div>
          <strong>Função Principal:</strong><br>
          ${p.o_que_faz || p.descricao}
        </div>
      </div>

      <!-- Tabs Nav -->
      <div class="sheet-tabs-nav">
        <button class="sheet-tab-btn active" onclick="switchSheetTab(this, 'st-guia')">📖 Guia Prático</button>
        <button class="sheet-tab-btn" onclick="switchSheetTab(this, 'st-seguranca')">🛡️ Segurança &amp; Aplicação</button>
        <button class="sheet-tab-btn" onclick="switchSheetTab(this, 'st-alvos')">🎯 Alvos (${p.alvos.length})</button>
      </div>

      <!-- Tab 1: Guia Prático Consultivo -->
      <div class="sheet-tab-content active" id="st-guia">
        <div class="guide-container">
          
          <div class="guide-section-card">
            <div class="guide-sec-title">🎯 Para que serve (em detalhes)</div>
            <div class="guide-sec-text">${p.para_que_serve || p.descricao}</div>
          </div>

          <div class="guide-section-card">
            <div class="guide-sec-title">⚙️ Como age na prática &amp; Prazos</div>
            <div class="guide-sec-text">${p.como_age || p.descricao_longa || 'Ação de alta eficiência contra pragas alvo.'}</div>
          </div>

          <div class="guide-section-card">
            <div class="guide-sec-title">💡 Como usar do jeito certo</div>
            <div class="guide-sec-text">${p.como_usar || 'Seguir as instruções de diluição e pulverização indicadas no rótulo.'}</div>
          </div>

          ${p.onde_nao_usar ? `
            <div class="guide-warning-card">
              <div class="guide-warning-title">⚠️ O que você NÃO deve fazer (Atenção)</div>
              <div class="guide-warning-text">${p.onde_nao_usar}</div>
            </div>
          ` : ''}

          ${p.rendimento ? `
            <div class="guide-section-card" style="background:var(--brand-pale); border-color:var(--brand-light);">
              <div class="guide-sec-title" style="color:var(--brand-dark);">📦 Rendimento Prático</div>
              <div class="guide-sec-text" style="font-weight:700; color:var(--brand-dark);">${p.rendimento}</div>
            </div>
          ` : ''}

        </div>
      </div>

      <!-- Tab 2: Selos de Segurança & Aplicação -->
      <div class="sheet-tab-content" id="st-seguranca">
        <div class="security-grid">
          
          <div class="sec-badge-card">
            <div class="sec-badge-icon">🐶</div>
            <div>
              <div class="sec-badge-title">Reentrada de Pets &amp; Família</div>
              <div class="sec-badge-desc">${p.seguranca ? p.seguranca.pets : 'Aguardar secagem total (2 horas).'}</div>
            </div>
          </div>

          <div class="sec-badge-card">
            <div class="sec-badge-icon">🌧️</div>
            <div>
              <div class="sec-badge-title">Resistência à Chuva / Secagem</div>
              <div class="sec-badge-desc">${p.seguranca ? p.seguranca.chuva : 'Resistente após 2h de aplicação.'}</div>
            </div>
          </div>

          <div class="sec-badge-card">
            <div class="sec-badge-icon">⏰</div>
            <div>
              <div class="sec-badge-title">Melhor Horário de Aplicação</div>
              <div class="sec-badge-desc">${p.seguranca ? p.seguranca.horario : 'Horas frescas (após as 16h ou manhã).'}</div>
            </div>
          </div>

          <div class="sec-badge-card">
            <div class="sec-badge-icon">🛡️</div>
            <div>
              <div class="sec-badge-title">EPI &amp; Equipamento</div>
              <div class="sec-badge-desc">${p.seguranca ? p.seguranca.epi : 'Utilizar luvas e máscara.'}</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tab 3: Alvos -->
      <div class="sheet-tab-content" id="st-alvos">
        <div class="sheet-alvos-cloud" style="padding:10px 0;">
          ${p.alvos.map(a => `<span class="alvo-chip">🎯 ${a}</span>`).join('')}
        </div>
      </div>

    </div>
  `;

  document.getElementById('product-sheet-backdrop').classList.add('show');
  document.getElementById('product-bottom-sheet').classList.add('show');
  document.body.style.overflow = 'hidden';
}