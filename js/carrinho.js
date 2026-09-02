// =============================================================
//  NFOG CATÁLOGO — Carrinho / Orçamento
// =============================================================

const Carrinho = (() => {
  const STORAGE_KEY = 'nfog_orcamento';

  // ── Estado ──────────────────────────────────────────────
  let itens = carregarDoStorage();

  function carregarDoStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function salvarNoStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }

  // ── API Pública ─────────────────────────────────────────

  function adicionar(produtoId, quantidade) {
    quantidade = parseInt(quantidade) || 1;
    const produto = PRODUTOS.find(p => p.id === produtoId);
    if (!produto) return;

    const existente = itens.find(i => i.id === produtoId);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        referencia: produto.referencia,
        unidade: produto.unidade,
        imagem: produto.imagens[0],
        quantidade
      });
    }

    salvarNoStorage();
    atualizarBadge();
    atualizarDrawer();
    mostrarFeedback(produto.nome);
  }

  function remover(produtoId) {
    itens = itens.filter(i => i.id !== produtoId);
    salvarNoStorage();
    atualizarBadge();
    atualizarDrawer();
  }

  function atualizarQuantidade(produtoId, novaQtd) {
    novaQtd = parseInt(novaQtd);
    if (novaQtd < 1 || isNaN(novaQtd)) return;
    const item = itens.find(i => i.id === produtoId);
    if (item) {
      item.quantidade = novaQtd;
      salvarNoStorage();
      atualizarBadge();
    }
  }

  function limpar() {
    itens = [];
    salvarNoStorage();
    atualizarBadge();
    atualizarDrawer();
  }

  function total() {
    return itens.reduce((acc, i) => acc + i.quantidade, 0);
  }

  function getItens() {
    return [...itens];
  }

  // ── UI ──────────────────────────────────────────────────

  function atualizarBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const t = total();
    badges.forEach(b => {
      b.textContent = t;
      b.style.display = t > 0 ? 'flex' : 'none';
    });
  }

  function atualizarDrawer() {
    const lista = document.getElementById('cart-items-list');
    const vazio = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total-count');

    if (!lista) return;

    if (itens.length === 0) {
      lista.innerHTML = '';
      if (vazio) vazio.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (vazio) vazio.style.display = 'none';
    if (footer) footer.style.display = 'block';
    if (totalEl) totalEl.textContent = total();

    lista.innerHTML = itens.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='https://picsum.photos/seed/fallback/80/80'">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.nome}</p>
          <p class="cart-item-ref">Ref: ${item.referencia}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Carrinho.decrementarDrawer(${item.id})">−</button>
            <input type="number" min="1" value="${item.quantidade}"
              onchange="Carrinho.atualizarQuantidade(${item.id}, this.value); Carrinho.atualizarDrawer();"
              class="cart-qty-input">
            <button class="qty-btn" onclick="Carrinho.incrementarDrawer(${item.id})">+</button>
            <span class="cart-item-unit">${item.unidade}</span>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Carrinho.remover(${item.id})" title="Remover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"></path>
            <path d="M10 11v6M14 11v6"></path>
          </svg>
        </button>
      </div>
    `).join('');
  }

  function incrementarDrawer(produtoId) {
    const item = itens.find(i => i.id === produtoId);
    if (item) {
      item.quantidade++;
      salvarNoStorage();
      atualizarBadge();
      atualizarDrawer();
    }
  }

  function decrementarDrawer(produtoId) {
    const item = itens.find(i => i.id === produtoId);
    if (item && item.quantidade > 1) {
      item.quantidade--;
      salvarNoStorage();
      atualizarBadge();
      atualizarDrawer();
    }
  }

  function abrirDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function fecharDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function mostrarFeedback(nomeProduto) {
    const feedback = document.getElementById('cart-feedback');
    if (!feedback) return;
    feedback.textContent = `✔ "${nomeProduto}" adicionado ao orçamento!`;
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 3000);
  }

  // ── Máscaras de Input ────────────────────────────────────

  function aplicarMascara(inputId, fn) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.addEventListener('input', () => { el.value = fn(el.value); });
  }

  function mascaraTelefone(v) {
    v = v.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10)
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }

  function mascaraCNPJ(v) {
    v = v.replace(/\D/g, '').slice(0, 14);
    return v
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  // ── WhatsApp ────────────────────────────────────────────

  function enviarWhatsApp() {
    if (itens.length === 0) {
      alert('Seu orçamento está vazio. Adicione produtos antes de solicitar.');
      return;
    }

    const nomeEl     = document.getElementById('f-nome');
    const telEl      = document.getElementById('f-tel');
    const cnpjEl     = document.getElementById('f-cnpj');
    const vendedorEl = document.getElementById('f-vendedor');

    const nome     = nomeEl?.value.trim() || '';
    const tel      = telEl?.value.trim() || '';
    const cnpj     = cnpjEl?.value.trim() || '';
    const vendedor = vendedorEl?.value.trim() || '';

    // Validação
    let valido = true;

    if (!nome) {
      nomeEl?.closest('.form-group')?.classList.add('has-error');
      valido = false;
    } else {
      nomeEl?.closest('.form-group')?.classList.remove('has-error');
    }

    if (!tel) {
      telEl?.closest('.form-group')?.classList.add('has-error');
      valido = false;
    } else {
      telEl?.closest('.form-group')?.classList.remove('has-error');
    }

    if (!valido) {
      // Scroll para o início do formulário
      document.getElementById('cart-footer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // ── Emojis Universais e Seguros ──
    const ico = {
      marca:    '🌿',
      pedido:   '📋',
      cliente:  '👤',
      tel:      '📱',
      cnpj:     '🏢',
      vendedor: '🤝',
      carrinho: '🛒',
      pin:      '📌',
      caixa:    '📦',
      ok:       '✅'
    };

    const div = '━━━━━━━━━━━━━━━━━━━━━━━━';

    // ── Monta mensagem WhatsApp ──────────────────────────
    let msg = '';
    msg += `${ico.marca} *${CONFIG.empresa}*\n`;
    msg += `${ico.pedido} *Nova Solicitação de Orçamento*\n`;
    msg += `${div}\n\n`;

    msg += `${ico.cliente} *Dados do Cliente*\n`;
    msg += `• *Nome:* ${nome}\n`;
    msg += `• *Telefone:* ${tel}\n`;
    if (cnpj)     msg += `• *CNPJ:* ${cnpj}\n`;
    if (vendedor) msg += `• *Vendedor:* ${vendedor}\n`;

    msg += `\n${div}\n\n`;
    msg += `${ico.carrinho} *Itens do Orçamento*\n\n`;

    itens.forEach((item, i) => {
      msg += `*${i + 1}. ${item.nome}*\n`;
      msg += `   ${ico.pin} Ref: \`${item.referencia}\`\n`;
      msg += `   ${ico.caixa} Qtd: *${item.quantidade} ${item.unidade}*\n\n`;
    });

    msg += `${div}\n`;
    msg += `${ico.ok} _${CONFIG.mensagem_fim}_`;

    // Usar api.whatsapp.com direto para evitar o bug de redirecionamento 302 do wa.me que corrompe emojis em UTF-8
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // ── Init ────────────────────────────────────────────────

  function init() {
    atualizarBadge();
    atualizarDrawer();

    // Botão carrinho no header
    document.querySelectorAll('.cart-toggle').forEach(btn => {
      btn.addEventListener('click', abrirDrawer);
    });

    // Fechar drawer
    const btnFechar = document.getElementById('cart-close');
    if (btnFechar) btnFechar.addEventListener('click', fecharDrawer);

    // Overlay fecha drawer
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', fecharDrawer);

    // Botão enviar WhatsApp
    const btnWA = document.getElementById('btn-whatsapp-send');
    if (btnWA) btnWA.addEventListener('click', enviarWhatsApp);

    // Limpar orçamento
    const btnLimpar = document.getElementById('btn-limpar');
    if (btnLimpar) btnLimpar.addEventListener('click', () => {
      if (confirm('Deseja limpar todo o orçamento?')) limpar();
    });

    // Limpar erro ao começar a digitar
    ['f-nome', 'f-tel'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function() {
        this.closest('.form-group')?.classList.remove('has-error');
      });
    });

    // Máscaras
    aplicarMascara('f-tel',  mascaraTelefone);
    aplicarMascara('f-cnpj', mascaraCNPJ);
  }

  return {
    init,
    adicionar,
    remover,
    atualizarQuantidade,
    atualizarDrawer,
    incrementarDrawer,
    decrementarDrawer,
    limpar,
    total,
    getItens,
    abrirDrawer,
    fecharDrawer,
    enviarWhatsApp
  };
})();

document.addEventListener('DOMContentLoaded', () => Carrinho.init());
