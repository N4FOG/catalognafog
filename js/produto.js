// =============================================================
//  RAWELL QUÍMICA — Catálogo 2026 — Página de Produto
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  const produto = PRODUTOS.find(p => p.id === id);

  if (!produto) {
    document.getElementById('produto-container').innerHTML = `
      <div class="not-found" style="text-align:center; padding:4rem 1rem;">
        <h2>Produto não encontrado</h2>
        <p>O produto que você está procurando não existe ou foi alterado.</p>
        <a href="index.html" class="btn-primary" style="margin-top:1rem; display:inline-block;">← Voltar ao catálogo</a>
      </div>
    `;
    return;
  }

  const catObj = CATEGORIAS.find(c => c.id === produto.categoria);
  const formObj = (typeof FORMULACOES !== 'undefined') ? FORMULACOES.find(f => f.id === produto.tipo_formulacao) : null;

  // Atualizar título da página e Meta Tags OpenGraph para compartilhamento
  document.title = `${produto.nome} — ${CONFIG.empresa}`;
  atualizarMetaTags(produto);

  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Início</a>
      <span>›</span>
      <a href="index.html#produtos-section" onclick="window.location='index.html';">${catObj ? catObj.nome : 'Produtos'}</a>
      <span>›</span>
      <span>${produto.nome}</span>
    `;
  }

  // Galeria de imagens
  renderGaleria(produto);

  // Informações do produto
  const info = document.getElementById('produto-info');
  if (info) {
    const alvosHtml = (produto.alvos && produto.alvos.length) ? `
      <div class="produto-alvos-box">
        <h4>🎯 Pragas & Alvos Controlados</h4>
        <div class="alvos-list">
          ${produto.alvos.map(a => `<span class="alvo-pill">${a}</span>`).join('')}
        </div>
      </div>
    ` : '';

    info.innerHTML = `
      <div class="produto-det-header">
        <span class="produto-det-ref">Ref: ${produto.referencia}</span>
        <span class="produto-det-cat">${catObj ? catObj.icone + ' ' + catObj.nome : ''}</span>
        ${formObj ? `<span class="produto-det-form">${formObj.icone} ${formObj.nome}</span>` : ''}
      </div>

      <h1 class="produto-det-nome">${produto.nome}</h1>
      <div class="produto-det-desc">${produto.descricao_longa}</div>

      ${alvosHtml}

      ${produto.caracteristicas && produto.caracteristicas.length ? `
        <div class="produto-caracteristicas">
          <h4>Destaques & Especificações</h4>
          <ul>
            ${produto.caracteristicas.map(c => `<li>✓ ${c}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="produto-det-actions">
        <div class="qty-selector qty-selector--large">
          <button class="qty-btn" onclick="decrementarDet()" aria-label="Diminuir">−</button>
          <input type="number" id="det-qty" value="1" min="1" class="qty-input" aria-label="Quantidade">
          <button class="qty-btn" onclick="incrementarDet()" aria-label="Aumentar">+</button>
          <span class="qty-unit">${produto.unidade}</span>
        </div>

        <button class="btn-add-cart btn-add-cart--large" onclick="adicionarDetalhes(${produto.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          Adicionar ao Orçamento
        </button>
      </div>

      <!-- Ações Rápidas: Compartilhar & WhatsApp Direto -->
      <div class="produto-secondary-actions">
        <button class="btn-quick-wa" onclick="cotarDiretoWhatsApp(${produto.id})">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Cotar apenas este item no WhatsApp
        </button>

        <a href="teste-produto-gerador.html?id=${produto.id}" class="btn-share" style="text-decoration:none; background:rgba(16,185,129,0.12); border-color:#059669; color:#059669; font-weight:700;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          🖼️ Criar Card p/ Status do WhatsApp
        </a>

        <button class="btn-share" onclick="compartilharProduto(${produto.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Compartilhar Produto
        </button>
      </div>

      <div style="margin-top:1.5rem;">
        <a href="index.html" class="btn-voltar">← Voltar ao catálogo completo</a>
      </div>
    `;
  }

  // Produtos relacionados
  renderRelacionados(produto);
});

// ── Atualização dinâmica de OpenGraph (Sem indexação em buscadores) ──
function atualizarMetaTags(produto) {
  let ogTitle = document.querySelector('meta[property="og:title"]');
  let ogDesc = document.querySelector('meta[property="og:description"]');
  let ogImg = document.querySelector('meta[property="og:image"]');

  if (ogTitle) ogTitle.content = `${produto.nome} — ${CONFIG.empresa}`;
  if (ogDesc) ogDesc.content = produto.descricao;
  if (ogImg) ogImg.content = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '') + produto.imagens[0];
}

// ── Galeria ──────────────────────────────────────────────────
function renderGaleria(produto) {
  const mainImg = document.getElementById('gallery-main');
  const thumbsEl = document.getElementById('gallery-thumbs');

  if (!mainImg) return;

  mainImg.src = produto.imagens[0];
  mainImg.alt = produto.nome;

  if (thumbsEl && produto.imagens.length > 1) {
    thumbsEl.innerHTML = produto.imagens.map((img, i) => `
      <img
        src="${img}"
        alt="${produto.nome} - foto ${i + 1}"
        class="thumb ${i === 0 ? 'active' : ''}"
        onclick="mudarFoto('${img}', this)"
        loading="lazy"
        onerror="this.src='https://picsum.photos/seed/fallback${i}/120/100'">
    `).join('');
  } else if (thumbsEl) {
    thumbsEl.style.display = 'none';
  }
}

function mudarFoto(src, el) {
  const mainImg = document.getElementById('gallery-main');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
    }, 200);
  }
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function incrementarDet() {
  const input = document.getElementById('det-qty');
  if (input) input.value = parseInt(input.value) + 1;
}

function decrementarDet() {
  const input = document.getElementById('det-qty');
  if (input && parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

function adicionarDetalhes(produtoId) {
  const input = document.getElementById('det-qty');
  const qty = parseInt(input?.value) || 1;
  Carrinho.adicionar(produtoId, qty);
  Carrinho.abrirDrawer();
}

// ── Cotação Direta WhatsApp (1-Clique) ────────────────────────
function cotarDiretoWhatsApp(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;

  const input = document.getElementById('det-qty');
  const qty = parseInt(input?.value) || 1;

  const msg = `🌿 *${CONFIG.empresa}*\n📋 *Cotação Direta de Produto*\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n*Produto:* ${produto.nome}\n📌 *Ref:* `${produto.referencia}`\n📦 *Quantidade solicitada:* ${qty} ${produto.unidade}\n\n🔗 *Link do Produto:* ${window.location.href}\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n✅ _Gostaria de receber valores e prazos de entrega deste item._`;

  const url = `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ── Compartilhar Produto ──────────────────────────────────────
function compartilharProduto(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;

  const url = window.location.href;
  const titulo = `${produto.nome} — ${CONFIG.empresa}`;
  const texto = `Confira o produto ${produto.nome} (Ref: ${produto.referencia}) no catálogo da Rawell Química:`;

  if (navigator.share) {
    navigator.share({
      title: titulo,
      text: texto,
      url: url
    }).catch(() => {});
  } else {
    // Fallback: Copiar para Área de Transferência
    navigator.clipboard.writeText(url).then(() => {
      const feedback = document.getElementById('cart-feedback');
      if (feedback) {
        feedback.textContent = '📋 Link do produto copiado para a área de transferência!';
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 3500);
      } else {
        alert('Link do produto copiado com sucesso!');
      }
    }).catch(() => {
      prompt('Copie o link do produto abaixo:', url);
    });
  }
}

// ── Produtos Relacionados ────────────────────────────────────
function renderRelacionados(produto) {
  const section = document.getElementById('relacionados-grid');
  if (!section) return;

  const relacionados = PRODUTOS
    .filter(p => p.categoria === produto.categoria && p.id !== produto.id)
    .slice(0, 4);

  if (relacionados.length === 0) {
    document.getElementById('relacionados-section')?.remove();
    return;
  }

  section.innerHTML = relacionados.map(p => `
    <a href="produto.html?id=${p.id}" class="relacionado-card">
      <img src="${p.imagens[0]}" alt="${p.nome}" loading="lazy"
        onerror="this.src='https://picsum.photos/seed/fallbackrel${p.id}/300/240'">
      <div class="relacionado-info">
        <p class="relacionado-ref">Ref: ${p.referencia}</p>
        <h4>${p.nome}</h4>
        <span>Ver detalhes →</span>
      </div>
    </a>
  `).join('');
}
