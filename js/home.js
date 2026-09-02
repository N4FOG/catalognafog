// =============================================================
//  RAWELL QUÍMICA — Catálogo 2026 — Lógica da Página Inicial
// =============================================================

let categoriaAtiva = 'todos';
let formulacaoAtiva = 'todos';
let ordenacaoAtiva = 'destaque';
let termoBuscaAtivo = '';

document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  initCategorias();
  initFormulacoes();
  initOrdenacao();
  initSearch();
  renderProdutos();
});

// ── Utilitário: Normalização de texto (remove acentos e pontuação) ──
function normalizarTexto(str) {
  return (str || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// ── Banner Slider ────────────────────────────────────────────
function initBanner() {
  const slides = document.querySelectorAll('.banner-slide');
  const dots = document.querySelectorAll('.banner-dot');
  const prevBtn = document.getElementById('banner-prev');
  const nextBtn = document.getElementById('banner-next');
  let current = 0;
  let autoTimer;

  if (!slides.length) return;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  slides[0].classList.add('active');
  dots[0]?.classList.add('active');
  startAuto();

  // Touch/swipe support
  const banner = document.getElementById('banner-slider');
  let startX = 0;
  banner?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  banner?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      stopAuto();
      goTo(dx < 0 ? current + 1 : current - 1);
      startAuto();
    }
  });
}

// ── Categorias ───────────────────────────────────────────────
function initCategorias() {
  const grid = document.getElementById('categorias-grid');
  if (grid) {
    grid.innerHTML = CATEGORIAS.filter(c => c.id !== 'todos').map(cat => {
      const count = PRODUTOS.filter(p => p.categoria === cat.id).length;
      return `
        <button class="categoria-card" data-cat="${cat.id}" onclick="filtrarPor('${cat.id}')">
          <span class="categoria-icone">${cat.icone}</span>
          <span class="categoria-nome">${cat.nome}</span>
          <span class="categoria-count">${count} ${count === 1 ? 'item' : 'itens'}</span>
        </button>
      `;
    }).join('');
  }

  const filtros = document.getElementById('filtros-bar');
  if (filtros) {
    filtros.innerHTML = CATEGORIAS.map(cat => {
      const count = cat.id === 'todos' ? PRODUTOS.length : PRODUTOS.filter(p => p.categoria === cat.id).length;
      return `
        <button class="filtro-btn ${cat.id === 'todos' ? 'active' : ''}"
          data-cat="${cat.id}"
          onclick="filtrarPor('${cat.id}')">
          ${cat.icone} ${cat.nome} <span class="badge-count">${count}</span>
        </button>
      `;
    }).join('');
  }
}

// ── Formulações ──────────────────────────────────────────────
function initFormulacoes() {
  const container = document.getElementById('formulacoes-bar');
  if (!container || typeof FORMULACOES === 'undefined') return;

  container.innerHTML = FORMULACOES.map(f => `
    <button class="form-btn ${f.id === 'todos' ? 'active' : ''}"
      data-form="${f.id}"
      onclick="filtrarPorFormulacao('${f.id}')">
      ${f.icone} ${f.nome}
    </button>
  `).join('');
}

// ── Ordenação ────────────────────────────────────────────────
function initOrdenacao() {
  const select = document.getElementById('sort-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    ordenacaoAtiva = e.target.value;
    renderProdutos();
  });
}

// ── Funções de Filtro ────────────────────────────────────────
function filtrarPor(catId) {
  categoriaAtiva = catId;

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === catId);
  });

  document.querySelectorAll('.categoria-card').forEach(card => {
    card.classList.toggle('active', card.dataset.cat === catId);
  });

  renderProdutos();
}

function filtrarPorFormulacao(formId) {
  formulacaoAtiva = formId;

  document.querySelectorAll('.form-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.form === formId);
  });

  renderProdutos();
}

function limparFiltros() {
  categoriaAtiva = 'todos';
  formulacaoAtiva = 'todos';
  termoBuscaAtivo = '';
  ordenacaoAtiva = 'destaque';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'destaque';

  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.style.display = 'none';

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === 'todos');
  });
  document.querySelectorAll('.categoria-card').forEach(card => card.classList.remove('active'));
  document.querySelectorAll('.form-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.form === 'todos');
  });

  renderProdutos();
}

// ── Render Produtos ─────────────────────────────────────────
function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  const contador = document.getElementById('produtos-contador');
  const nenhum = document.getElementById('nenhum-produto');
  if (!grid) return;

  let lista = [...PRODUTOS];

  // 1. Filtro por Categoria
  if (categoriaAtiva && categoriaAtiva !== 'todos') {
    lista = lista.filter(p => p.categoria === categoriaAtiva);
  }

  // 2. Filtro por Formulação
  if (formulacaoAtiva && formulacaoAtiva !== 'todos') {
    lista = lista.filter(p => p.tipo_formulacao === formulacaoAtiva);
  }

  // 3. Busca Inteligente (Nome, Ref, Descrição, Alvos/Pragas, Características)
  if (termoBuscaAtivo) {
    const termos = normalizarTexto(termoBuscaAtivo).split(/\s+/).filter(Boolean);

    lista = lista.filter(p => {
      const textoIndex = [
        p.nome,
        p.referencia,
        p.descricao,
        p.descricao_longa,
        (p.caracteristicas || []).join(' '),
        (p.alvos || []).join(' '),
        p.tipo_formulacao,
        p.segmento
      ].map(normalizarTexto).join(' ');

      // Todos os termos digitados devem estar presentes em algum campo do produto
      return termos.every(termo => textoIndex.includes(termo));
    });
  }

  // 4. Ordenação
  if (ordenacaoAtiva === 'nome-asc') {
    lista.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordenacaoAtiva === 'nome-desc') {
    lista.sort((a, b) => b.nome.localeCompare(a.nome));
  } else if (ordenacaoAtiva === 'ref') {
    lista.sort((a, b) => a.referencia.localeCompare(b.referencia));
  } else {
    // Padrão: Destaques primeiro, depois ID
    lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0) || a.id - b.id);
  }

  // 5. Atualiza contador
  if (contador) {
    if (termoBuscaAtivo || categoriaAtiva !== 'todos' || formulacaoAtiva !== 'todos') {
      contador.innerHTML = `Exibindo <strong>${lista.length}</strong> de ${PRODUTOS.length} produtos`;
    } else {
      contador.innerHTML = `Total de <strong>${PRODUTOS.length}</strong> produtos cadastrados`;
    }
  }

  // 6. Estado Vazio
  if (lista.length === 0) {
    grid.innerHTML = '';
    if (nenhum) nenhum.style.display = 'block';
    return;
  }

  if (nenhum) nenhum.style.display = 'none';

  // 7. Render dos Cards
  grid.innerHTML = lista.map(produto => {
    const catObj = CATEGORIAS.find(c => c.id === produto.categoria);
    const formObj = (typeof FORMULACOES !== 'undefined') ? FORMULACOES.find(f => f.id === produto.tipo_formulacao) : null;

    // Badges de alvos principais (até 3 tags)
    const alvosTags = (produto.alvos || []).slice(0, 3).map(alvo => `
      <span class="tag-alvo" title="Praga ou erva controlada">${alvo}</span>
    `).join('');

    return `
      <article class="produto-card" data-id="${produto.id}">
        <a href="produto.html?id=${produto.id}" class="produto-img-link" title="${produto.nome}">
          <img
            src="${produto.imagens[0]}"
            alt="${produto.nome}"
            class="produto-img"
            loading="lazy"
            onerror="this.src='https://picsum.photos/seed/fallback${produto.id}/400/320'">
          ${produto.destaque ? '<span class="badge-destaque">🌟 Destaque</span>' : ''}
          ${formObj && formObj.id !== 'todos' ? `<span class="badge-form">${formObj.icone} ${formObj.nome.split(' ')[0]}</span>` : ''}
        </a>

        <div class="produto-info">
          <div class="produto-meta-bar">
            <span class="produto-ref">Ref: ${produto.referencia}</span>
            <span class="produto-cat-badge">${catObj ? catObj.icone + ' ' + catObj.nome : ''}</span>
          </div>

          <h3 class="produto-nome">
            <a href="produto.html?id=${produto.id}">${produto.nome}</a>
          </h3>

          <p class="produto-desc">${produto.descricao}</p>

          ${alvosTags ? `<div class="produto-alvos-tags">${alvosTags}</div>` : ''}

          <div class="produto-actions">
            <div class="qty-selector">
              <button class="qty-btn" onclick="decrementarCard(${produto.id})" aria-label="Diminuir">−</button>
              <input type="number" id="qty-${produto.id}" value="1" min="1" class="qty-input" aria-label="Quantidade">
              <button class="qty-btn" onclick="incrementarCard(${produto.id})" aria-label="Aumentar">+</button>
              <span class="qty-unit">${produto.unidade}</span>
            </div>
            <button class="btn-add-cart" onclick="adicionarAoOrcamento(${produto.id})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 01-8 0"></path>
              </svg>
              Adicionar
            </button>
          </div>
          <a href="produto.html?id=${produto.id}" class="btn-ver-mais">Ver detalhes técnicos →</a>
        </div>
      </article>
    `;
  }).join('');
}

function incrementarCard(id) {
  const input = document.getElementById(`qty-${id}`);
  if (input) input.value = parseInt(input.value) + 1;
}

function decrementarCard(id) {
  const input = document.getElementById(`qty-${id}`);
  if (input && parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

function adicionarAoOrcamento(produtoId) {
  const input = document.getElementById(`qty-${produtoId}`);
  const qty = parseInt(input?.value) || 1;
  Carrinho.adicionar(produtoId, qty);
}

// ── Busca ────────────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';

    clearTimeout(debounce);
    debounce = setTimeout(() => {
      termoBuscaAtivo = val;
      renderProdutos();
    }, 250);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      termoBuscaAtivo = '';
      clearBtn.style.display = 'none';
      input.focus();
      renderProdutos();
    });
  }
}
