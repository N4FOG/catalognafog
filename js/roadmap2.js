// ══════════════════════════════════════════════════════════════════════
//  PAINEL DE ROADMAP v2 — CONTROLADOR DINÂMICO, KANBAN & CHANGELOG
// ══════════════════════════════════════════════════════════════════════

let currentViewMode = 'grid'; // 'grid' | 'kanban'
let activeStatusFilter = 'desenvolvimento';
let activeSearchQuery = '';
let activePeriodFilter = 'todos'; // 'todos', '1d', '7d', '15d', '30d', '90d', '2026', 'custom'
let customDateFrom = null; // 'YYYY-MM-DD'
let customDateTo = null;   // 'YYYY-MM-DD'
let kanbanDoneVisibleLimit = 3; // Limite padrão de cards visíveis na coluna Concluídas

document.addEventListener('DOMContentLoaded', () => {
  initThemeSupport();
  initViewMode();
  reloadRoadmapView();
  setupEventListeners();
});

function getData() {
  if (typeof window.getActiveData === 'function') {
    return window.getActiveData();
  }
  return window.ROADMAP2_DATA || window.ROADMAP_DATA;
}

function reloadRoadmapView() {
  renderProjectHeaderAndStats();
  renderModulesBar();
  renderRoadmapCards();
  renderKanbanBoard();
  renderChangelogTimeline();
  updateViewModeDisplay();
}
window.reloadRoadmapView = reloadRoadmapView;

// ── 1. Suporte a Tema Claro / Escuro ──────────────────────────────────
function initThemeSupport() {
  const saved = localStorage.getItem('rawell_theme') || 'auto';
  if (saved !== 'auto') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  updateThemeButton(saved);
}

function updateThemeButton(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleThemeMode() {
  const current = document.documentElement.getAttribute('data-theme') || 'auto';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('rawell_theme', next);
  updateThemeButton(next);
}
window.toggleThemeMode = toggleThemeMode;

// ── 2. Alternância de Visualização (Grade / Kanban) ───────────────────
function initViewMode() {
  const saved = localStorage.getItem('rawell_roadmap2_active_view');
  if (saved === 'kanban' || saved === 'grid') {
    currentViewMode = saved;
  }
}

function switchViewMode(mode) {
  currentViewMode = mode;
  localStorage.setItem('rawell_roadmap2_active_view', mode);
  updateViewModeDisplay();
}
window.switchViewMode = switchViewMode;

function updateViewModeDisplay() {
  const btnGrid = document.getElementById('btn-view-grid');
  const btnKanban = document.getElementById('btn-view-kanban');
  const gridWrap = document.getElementById('roadmap-cards-grid');
  const kanbanWrap = document.getElementById('kanban-board-grid');
  const filterPills = document.querySelector('.filter-pills-wrap');

  if (btnGrid && btnKanban) {
    btnGrid.classList.toggle('active', currentViewMode === 'grid');
    btnKanban.classList.toggle('active', currentViewMode === 'kanban');
  }

  if (gridWrap && kanbanWrap) {
    if (currentViewMode === 'grid') {
      gridWrap.style.display = 'grid';
      kanbanWrap.style.display = 'none';
      if (filterPills) filterPills.style.display = 'flex';
    } else {
      gridWrap.style.display = 'none';
      kanbanWrap.style.display = 'grid';
      if (filterPills) filterPills.style.display = 'none'; // Kanban agrupa por status
    }
  }
}

// ── 3. Renderização de Cabeçalho & Métricas Rápidas ───────────────────
function renderProjectHeaderAndStats() {
  const data = getData();
  if (!data) return;

  const clientNameEl = document.getElementById('dash-client-name');
  if (clientNameEl && data.projeto) clientNameEl.textContent = data.projeto.cliente;

  const versionEl = document.getElementById('dash-version-tag');
  if (versionEl && data.projeto) versionEl.textContent = data.projeto.versaoAtual;

  const versionNumEl = document.getElementById('dash-version-num');
  if (versionNumEl && data.projeto) versionNumEl.textContent = data.projeto.versaoAtual;

  const lastUpdateEl = document.getElementById('dash-last-update');
  if (lastUpdateEl && data.projeto) lastUpdateEl.textContent = data.projeto.ultimaAtualizacao;

  // Métricas
  const features = data.features || [];
  const totalFeatures = features.length;
  const concluidas = features.filter(f => f.status === 'Concluído' || f.progresso === 100).length;
  const emAndamento = features.filter(f => f.status === 'Em Desenvolvimento').length;
  const emTestes = features.filter(f => f.status === 'Em Testes').length;
  const planejadas = features.filter(f => f.status === 'Planejado').length;

  const somaProgresso = features.reduce((acc, f) => acc + (f.progresso || 0), 0);
  const mediaProgresso = totalFeatures > 0 ? Math.round(somaProgresso / totalFeatures) : 0;

  // Círculo de Progresso
  const circleValEl = document.getElementById('circle-progress-val');
  if (circleValEl) circleValEl.textContent = mediaProgresso + '%';

  const circleFillEl = document.getElementById('circle-fill-bar');
  if (circleFillEl) {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    circleFillEl.style.strokeDasharray = String(circumference);
    const offset = circumference - (mediaProgresso / 100) * circumference;
    setTimeout(() => {
      circleFillEl.style.strokeDashoffset = String(offset);
    }, 150);
  }

  // Cards de Métricas
  const countDoneEl = document.getElementById('stat-done-count');
  if (countDoneEl) countDoneEl.textContent = String(concluidas);

  const countDevEl = document.getElementById('stat-dev-count');
  if (countDevEl) countDevEl.textContent = String(emAndamento);

  const countTestEl = document.getElementById('stat-test-count');
  if (countTestEl) countTestEl.textContent = String(emTestes);

  const countPlanEl = document.getElementById('stat-plan-count');
  if (countPlanEl) countPlanEl.textContent = String(planejadas);

  // Badges nas Tabs
  const tabRoadmapBadge = document.getElementById('tab-roadmap-count');
  if (tabRoadmapBadge) tabRoadmapBadge.textContent = String(totalFeatures);

  const tabChangelogBadge = document.getElementById('tab-changelog-count');
  if (tabChangelogBadge) tabChangelogBadge.textContent = String((data.changelog || []).length);

  // Contadores nas Pílulas
  const pillTodos = document.getElementById('count-pill-todos');
  if (pillTodos) pillTodos.textContent = '(' + totalFeatures + ')';

  const pillDone = document.getElementById('count-pill-concluido');
  if (pillDone) pillDone.textContent = '(' + concluidas + ')';

  const pillDev = document.getElementById('count-pill-desenvolvimento');
  if (pillDev) pillDev.textContent = '(' + emAndamento + ')';

  const pillTest = document.getElementById('count-pill-testes');
  if (pillTest) pillTest.textContent = '(' + emTestes + ')';

  const pillPlan = document.getElementById('count-pill-planejado');
  if (pillPlan) pillPlan.textContent = '(' + planejadas + ')';

  // CTA WhatsApp
  const ctaBtn = document.getElementById('btn-whatsapp-feedback');
  if (ctaBtn && data.projeto && data.projeto.contatoDev) {
    const fone = data.projeto.contatoDev.whatsapp;
    const msg = encodeURIComponent(data.projeto.contatoDev.mensagemPadrao);
    ctaBtn.href = 'https://wa.me/' + fone + '?text=' + msg;
  }
}

// ── 4. Renderização da Barra de Módulos ───────────────────────────────
function renderModulesBar() {
  const data = getData();
  if (!data || !data.modulos) return;

  const container = document.getElementById('modules-chips-grid');
  if (!container) return;

  container.innerHTML = data.modulos.map(mod => `
    <div class="module-chip">
      <div class="module-chip-top">
        <span>${mod.icone} ${mod.nome}</span>
        <span class="module-chip-percent">${mod.maturidade}%</span>
      </div>
      <div class="module-mini-track">
        <div class="module-mini-fill" style="width: ${mod.maturidade}%;"></div>
      </div>
    </div>
  `).join('');
}

// ── 5. Filtros Globais ────────────────────────────────────────────────
function getFeatureTimestamp(feat) {
  if (feat.dataEntrega) {
    const d = new Date(feat.dataEntrega + 'T00:00:00');
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (feat.dataCriacao) {
    const d = new Date(feat.dataCriacao + 'T00:00:00');
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (feat.dataPrevisao) {
    const d = new Date(feat.dataPrevisao + 'T00:00:00');
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (feat.dataAtualizacao) {
    const d = new Date(feat.dataAtualizacao);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return new Date('2026-09-05T00:00:00').getTime();
}

function filterFeatureItem(feat, ignoreStatusFilter = false) {
  // 1. Filtro de Status (apenas no modo Grade)
  if (!ignoreStatusFilter && activeStatusFilter !== 'todos') {
    if (activeStatusFilter === 'concluido' && feat.status !== 'Concluído') return false;
    if (activeStatusFilter === 'testes' && feat.status !== 'Em Testes') return false;
    if (activeStatusFilter === 'desenvolvimento' && feat.status !== 'Em Desenvolvimento') return false;
    if (activeStatusFilter === 'planejado' && feat.status !== 'Planejado') return false;
  }

  // 2. Filtro de Busca de Texto
  if (activeSearchQuery) {
    const q = activeSearchQuery.toLowerCase();
    const matchTitle = (feat.titulo || '').toLowerCase().includes(q);
    const matchDesc = (feat.descricao || '').toLowerCase().includes(q);
    const matchCat = (feat.categoria || '').toLowerCase().includes(q);
    const matchPriority = (feat.prioridade || '').toLowerCase().includes(q);
    const matchTags = (feat.tags || []).some(t => t.toLowerCase().includes(q));
    if (!matchTitle && !matchDesc && !matchCat && !matchTags && !matchPriority) return false;
  }

  // 3. Filtro de Período / Datas
  if (activePeriodFilter !== 'todos') {
    const featTime = getFeatureTimestamp(feat);
    const now = new Date('2026-09-05T23:59:59').getTime();
    const refNow = Math.max(Date.now(), now);

    if (activePeriodFilter === '1d') {
      const cutoff = refNow - (1 * 24 * 60 * 60 * 1000);
      if (featTime < cutoff) return false;
    } else if (activePeriodFilter === '7d') {
      const cutoff = refNow - (7 * 24 * 60 * 60 * 1000);
      if (featTime < cutoff) return false;
    } else if (activePeriodFilter === '15d') {
      const cutoff = refNow - (15 * 24 * 60 * 60 * 1000);
      if (featTime < cutoff) return false;
    } else if (activePeriodFilter === '30d') {
      const cutoff = refNow - (30 * 24 * 60 * 60 * 1000);
      if (featTime < cutoff) return false;
    } else if (activePeriodFilter === '90d') {
      const cutoff = refNow - (90 * 24 * 60 * 60 * 1000);
      if (featTime < cutoff) return false;
    } else if (activePeriodFilter === '2026') {
      const start2026 = new Date('2026-01-01T00:00:00').getTime();
      const end2026 = new Date('2026-12-31T23:59:59').getTime();
      if (featTime < start2026 || featTime > end2026) return false;
    } else if (activePeriodFilter === 'custom') {
      if (customDateFrom) {
        const fromTime = new Date(customDateFrom + 'T00:00:00').getTime();
        if (featTime < fromTime) return false;
      }
      if (customDateTo) {
        const toTime = new Date(customDateTo + 'T23:59:59').getTime();
        if (featTime > toTime) return false;
      }
    }
  }

  return true;
}

// ── 6. Renderização da Visão em Grade (0% a 100%) ─────────────────────
function renderRoadmapCards() {
  const data = getData();
  if (!data || !data.features) return;

  const grid = document.getElementById('roadmap-cards-grid');
  if (!grid) return;

  const isAdmin = typeof window.isAdminAuthenticated === 'function' && window.isAdminAuthenticated();
  const filtered = data.features.filter(f => filterFeatureItem(f, false));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: var(--text);">Nenhuma funcionalidade encontrada</h3>
        <p style="margin: 0; font-size: 0.88rem; color: var(--text-3);">Tente alterar o status, período ou limpar a busca.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(feat => {
    const statusClass = getStatusClass(feat.status);
    const barClass = getProgressBarClass(feat.progresso, feat.status);
    const priorityClass = getPriorityClass(feat.prioridade);
    const priorityIcon = getPriorityIcon(feat.prioridade);

    // Checklist
    const checklistHtml = (feat.checklist && feat.checklist.length > 0) ? `
      <div class="feature-checklist">
        <div class="checklist-title">
          <span>📋 Etapas da Entrega:</span>
          ${isAdmin ? '<span style="font-size:0.68rem; color:var(--brand-light); font-weight:normal;">(clique para alternar)</span>' : ''}
        </div>
        ${feat.checklist.map((chk, idx) => `
          <div class="checklist-item ${chk.feito ? 'done' : ''} ${isAdmin ? 'admin-clickable-chk' : ''}" 
               ${isAdmin ? `onclick="toggleChecklistItemDirect('${feat.id}', ${idx})"` : ''}
               title="${isAdmin ? 'Clique para marcar/desmarcar esta etapa' : ''}">
            <span class="check-icon">${chk.feito ? '✅' : '⏳'}</span>
            <span>${chk.item}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    // Micro-Tags com +N
    const maxVisibleTags = 3;
    const visibleTags = (feat.tags || []).slice(0, maxVisibleTags);
    const hiddenTagsCount = (feat.tags || []).length - maxVisibleTags;
    const hiddenTagsTitle = hiddenTagsCount > 0 ? feat.tags.slice(maxVisibleTags).map(t => '#' + t).join(', ') : '';

    const tagsHtml = (feat.tags && feat.tags.length > 0) ? `
      <div class="feature-tags">
        ${visibleTags.map(t => `<span class="feature-tag-chip" title="#${t}">#${t}</span>`).join('')}
        ${hiddenTagsCount > 0 ? `<span class="feature-tag-chip tag-more" title="Outras tags: ${hiddenTagsTitle}">+${hiddenTagsCount}</span>` : ''}
      </div>
    ` : '';

    // Painel Admin nos Cards
    const adminControlsHtml = isAdmin ? `
      <div class="card-admin-action-bar">
        <div class="card-admin-top-row">
          <span class="card-admin-badge">👑 Gestão Admin</span>
          <div class="card-admin-btn-group">
            <button class="btn-card-admin-act" onclick="openEditFeatureModal('${feat.id}')" title="Editar funcionalidade">✏️ Editar</button>
            <button class="btn-card-admin-act btn-card-admin-del" onclick="deleteFeature('${feat.id}')" title="Excluir funcionalidade">🗑️</button>
          </div>
        </div>
        <div class="card-admin-bottom-row">
          <div class="card-admin-field">
            <label class="card-admin-select-label">Status:</label>
            <select class="admin-quick-status-select" onchange="quickUpdateFeatureStatus('${feat.id}', this.value)" title="Alterar status">
              <option value="Planejado" ${feat.status === 'Planejado' ? 'selected' : ''}>💡 Planejado</option>
              <option value="Em Desenvolvimento" ${feat.status === 'Em Desenvolvimento' ? 'selected' : ''}>⚡ Em Dev</option>
              <option value="Em Testes" ${feat.status === 'Em Testes' ? 'selected' : ''}>🧪 Em Testes</option>
              <option value="Concluído" ${feat.status === 'Concluído' ? 'selected' : ''}>✅ Concluído (100%)</option>
            </select>
          </div>
        </div>
      </div>
    ` : '';

    // Prioridade
    const priorityPillHtml = isAdmin ? `
      <select class="feature-priority-select priority-${priorityClass}" 
              onchange="quickUpdateFeaturePriority('${feat.id}', this.value)" 
              title="Alterar prioridade">
        <option value="Alta" ${feat.prioridade === 'Alta' ? 'selected' : ''}>🔴 Alta</option>
        <option value="Média" ${feat.prioridade === 'Média' ? 'selected' : ''}>🟡 Média</option>
        <option value="Normal" ${(!feat.prioridade || feat.prioridade === 'Normal') ? 'selected' : ''}>🟢 Normal</option>
        <option value="Baixa" ${feat.prioridade === 'Baixa' ? 'selected' : ''}>⚪ Baixa</option>
      </select>
    ` : `
      <span class="feature-priority-pill priority-${priorityClass}" title="Prioridade: ${feat.prioridade || 'Normal'}">
        ${priorityIcon} ${feat.prioridade || 'Normal'}
      </span>
    `;

    return `
      <div class="feature-card card-priority-${priorityClass} ${isAdmin ? 'admin-card-highlight' : ''}" 
           ondblclick="handleKanbanCardDoubleClick('${feat.id}')" 
           title="💡 Dica: Duplo clique para abrir editor da funcionalidade">
        ${adminControlsHtml}
        <div>
          <div class="feature-card-header">
            <div class="feature-header-meta">
              <span class="feature-category">${feat.categoria}</span>
              ${priorityPillHtml}
            </div>
            <span class="feature-status-tag ${statusClass}">
              ${getStatusIcon(feat.status)} ${feat.status}
            </span>
          </div>

          <h3 class="feature-title">${feat.titulo}</h3>
          <p class="feature-desc">${feat.descricao}</p>

          <div class="feature-progress-box">
            <div class="feature-progress-meta">
              <span class="progress-label">Status de Implementação</span>
              <span class="progress-number">${feat.progresso}%</span>
            </div>
            <div class="feature-progress-track">
              <div class="feature-progress-bar ${barClass}" style="width: ${feat.progresso}%;"></div>
            </div>
          </div>

          ${checklistHtml}
        </div>

        <div class="feature-card-footer">
          <div class="feature-eta">
            <span>📅</span>
            <span>${feat.previsao || 'Em breve'}</span>
          </div>
          ${tagsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// ── 7. Renderização do Quadro Kanban Interativo com Paginação ──────────
function renderKanbanBoard() {
  const data = getData();
  if (!data || !data.features) return;

  const boardContainer = document.getElementById('kanban-board-grid');
  if (!boardContainer) return;

  // 4 Colunas fixas
  const columns = [
    { id: 'Planejado', titulo: '💡 Planejadas', cor: '#8b5cf6' },
    { id: 'Em Desenvolvimento', titulo: '⚡ Em Desenvolvimento', cor: '#f59e0b' },
    { id: 'Em Testes', titulo: '🧪 Em Testes', cor: '#3b82f6' },
    { id: 'Concluído', titulo: '✅ Concluídas', cor: '#10b981' }
  ];

  boardContainer.innerHTML = columns.map(col => {
    // Filtra features desta coluna respeitando busca e período
    const allColFeatures = data.features.filter(f => f.status === col.id && filterFeatureItem(f, true));
    const totalInCol = allColFeatures.length;

    let displayFeatures = allColFeatures;
    let paginationControlsHtml = '';

    // Paginação inteligente na coluna Concluídas
    if (col.id === 'Concluído') {
      displayFeatures = allColFeatures.slice(0, kanbanDoneVisibleLimit);
      const remaining = totalInCol - kanbanDoneVisibleLimit;

      if (remaining > 0) {
        const nextBatch = Math.min(5, remaining);
        paginationControlsHtml = `
          <div class="kanban-pagination-wrap">
            <button type="button" class="btn-kanban-expand" onclick="expandKanbanDoneCards()" title="Expandir mais cards concluídos">
              <span class="expand-dots">•••</span> Mostrar mais (+${nextBatch} de ${remaining} restantes)
            </button>
            ${kanbanDoneVisibleLimit > 3 ? `
              <button type="button" class="btn-kanban-collapse" onclick="collapseKanbanDoneCards()" title="Recolher para 3 cards">
                ▲ Recolher para 3
              </button>
            ` : ''}
          </div>
        `;
      } else if (totalInCol > 3 && kanbanDoneVisibleLimit >= totalInCol) {
        paginationControlsHtml = `
          <div class="kanban-pagination-wrap">
            <button type="button" class="btn-kanban-collapse" onclick="collapseKanbanDoneCards()" title="Recolher para 3 cards">
              ▲ Todos os ${totalInCol} cards exibidos (Recolher para 3)
            </button>
          </div>
        `;
      }
    }

    return `
      <div class="kanban-column" data-status="${col.id}">
        <div class="kanban-column-header">
          <div class="kanban-col-title-wrap">
            <span>${col.titulo}</span>
            <span class="kanban-col-badge">${totalInCol}</span>
          </div>
        </div>

        <div class="kanban-cards-list" data-status="${col.id}">
          ${displayFeatures.map((feat, idx) => {
            const chkTotal = (feat.checklist || []).length;
            const chkDone = (feat.checklist || []).filter(c => c.feito).length;
            
            // Efeito visual no 3º card quando colapsado
            const isPeekCard = (col.id === 'Concluído' && kanbanDoneVisibleLimit === 3 && idx === 2 && totalInCol > 3);

            return `
              <div class="kanban-card ${isPeekCard ? 'kanban-card-peek' : ''}" 
                   draggable="true" 
                   data-id="${feat.id}"
                   ondblclick="handleKanbanCardDoubleClick('${feat.id}')"
                   title="💡 Dica: Duplo clique para abrir o editor desta funcionalidade">
                <div class="kanban-card-accent" style="background: ${col.cor};"></div>
                <div class="kanban-card-meta">
                  <span class="kanban-card-category">${feat.categoria}</span>
                  <span style="font-size:0.75rem;">${getPriorityIcon(feat.prioridade)}</span>
                </div>
                <h4 class="kanban-card-title">${feat.titulo}</h4>
                <p class="kanban-card-desc">${feat.descricao}</p>

                <div class="kanban-card-progress">
                  <div class="kanban-progress-track">
                    <div class="kanban-progress-fill" style="width: ${feat.progresso}%; background: ${col.cor};"></div>
                  </div>
                  <span class="kanban-progress-pct">${feat.progresso}%</span>
                </div>

                <div class="kanban-card-footer">
                  <div class="kanban-chk-count">
                    <span>📋</span>
                    <span>${chkDone}/${chkTotal} etapas</span>
                  </div>
                  <div>📅 ${feat.previsao || 'Em breve'}</div>
                </div>
              </div>
            `;
          }).join('')}

          ${paginationControlsHtml}
        </div>
      </div>
    `;
  }).join('');

  setupKanbanDragAndDrop();
}

function handleKanbanCardDoubleClick(id) {
  if (typeof window.isAdminAuthenticated === 'function' && window.isAdminAuthenticated()) {
    if (typeof window.openEditFeatureModal === 'function') {
      window.openEditFeatureModal(id);
    }
  } else {
    window._pendingEditFeatureId = id;
    if (typeof window.openAdminLoginModal === 'function') {
      window.openAdminLoginModal();
    }
    if (typeof window.showAdminToast === 'function') {
      window.showAdminToast('🔒 Digite o PIN de Administrador para editar.', false);
    }
  }
}
window.handleKanbanCardDoubleClick = handleKanbanCardDoubleClick;

function expandKanbanDoneCards() {
  kanbanDoneVisibleLimit += 5;
  renderKanbanBoard();
}
window.expandKanbanDoneCards = expandKanbanDoneCards;

function collapseKanbanDoneCards() {
  kanbanDoneVisibleLimit = 3;
  renderKanbanBoard();
}
window.collapseKanbanDoneCards = collapseKanbanDoneCards;

// Configuração do Drag & Drop no Kanban
function setupKanbanDragAndDrop() {
  const cards = document.querySelectorAll('.kanban-card');
  const columns = document.querySelectorAll('.kanban-column');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
      card.classList.add('is-dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  columns.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const featId = e.dataTransfer.getData('text/plain');
      const targetStatus = col.getAttribute('data-status');

      if (featId && targetStatus) {
        if (typeof window.quickUpdateFeatureStatus === 'function') {
          window.quickUpdateFeatureStatus(featId, targetStatus);
          if (typeof window.showAdminToast === 'function') {
            window.showAdminToast('🔄 Card movido para ' + targetStatus + ' e sincronizado na Nuvem!');
          }
        }
      }
    });
  });
}

// ── 8. Renderização da Linha do Tempo / Changelog (Formatada e Polida) ─
function renderChangelogTimeline() {
  const data = getData();
  if (!data || !data.changelog) return;

  const container = document.getElementById('changelog-timeline-list');
  if (!container) return;

  const isAdmin = typeof window.isAdminAuthenticated === 'function' && window.isAdminAuthenticated();

  container.innerHTML = data.changelog.map((log, index) => {
    const adminTimelineBtns = isAdmin ? `
      <div class="timeline-admin-acts">
        <button class="btn-card-admin-act" onclick="openEditChangelogModal(${index})" title="Editar este lançamento">✏️ Editar</button>
        <button class="btn-card-admin-act btn-card-admin-del" onclick="deleteChangelog(${index})" title="Excluir lançamento">🗑️</button>
      </div>
    ` : '';

    return `
      <div class="timeline-entry">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-header">
            <div class="timeline-version-tag">
              <span>🚀</span>
              <span>${log.versao}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="timeline-date">📅 ${log.data}</div>
              ${adminTimelineBtns}
            </div>
          </div>

          <h4 class="timeline-title">${log.titulo}</h4>
          <p class="timeline-summary">${log.resumo}</p>

          <ul class="changelog-items-list">
            ${(log.itens || []).map(item => `
              <li class="changelog-item">
                <span class="type-pill type-${item.tipo}">${getTypeLabel(item.tipo)}</span>
                <span class="changelog-text">${item.texto}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

function getTypeLabel(tipo) {
  switch (tipo) {
    case 'novo': return '✨ Novo';
    case 'melhoria': return '⚡ Melhoria';
    case 'correcao': return '🐛 Correção';
    case 'performance': return '🚀 Performance';
    case 'seguranca': return '🔒 Segurança';
    default: return '📦 Atualização';
  }
}

// ── 9. Event Listeners & Controles ────────────────────────────────────
function setupEventListeners() {
  // Tabs (Roadmap vs Changelog)
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      const roadmapContent = document.getElementById('tab-content-roadmap');
      const changelogContent = document.getElementById('tab-content-changelog');

      if (targetTab === 'roadmap') {
        if (roadmapContent) roadmapContent.style.display = 'block';
        if (changelogContent) changelogContent.style.display = 'none';
      } else {
        if (roadmapContent) roadmapContent.style.display = 'none';
        if (changelogContent) changelogContent.style.display = 'block';
      }
    });
  });

  // Filtros de Status (Pills)
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeStatusFilter = pill.getAttribute('data-filter');
      renderRoadmapCards();
    });
  });

  // Busca de Texto
  const searchInput = document.getElementById('dash-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim();
      renderRoadmapCards();
      renderKanbanBoard();
    });
  }

  // Presets de Datas
  const datePresets = document.querySelectorAll('.date-preset-btn');
  const customRangeWrap = document.getElementById('custom-date-range-wrap');

  datePresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.getAttribute('data-period');
      if (period === 'custom-toggle') {
        if (customRangeWrap) {
          const isHidden = customRangeWrap.style.display === 'none';
          customRangeWrap.style.display = isHidden ? 'flex' : 'none';
          btn.textContent = isHidden ? 'Personalizado ▲' : 'Personalizado ▾';
        }
        return;
      }

      datePresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePeriodFilter = period;
      renderRoadmapCards();
      renderKanbanBoard();
    });
  });

  // Aplicar Intervalo Personalizado
  const btnApplyDate = document.getElementById('btn-apply-date-range');
  if (btnApplyDate) {
    btnApplyDate.addEventListener('click', () => {
      const fromVal = document.getElementById('date-filter-from')?.value;
      const toVal = document.getElementById('date-filter-to')?.value;
      if (!fromVal && !toVal) {
        alert('Por favor, informe ao menos uma data inicial ou final.');
        return;
      }
      customDateFrom = fromVal || null;
      customDateTo = toVal || null;
      activePeriodFilter = 'custom';
      renderRoadmapCards();
      renderKanbanBoard();
    });
  }

  // Limpar Intervalo
  const btnClearDate = document.getElementById('btn-clear-date-range');
  if (btnClearDate) {
    btnClearDate.addEventListener('click', () => {
      const inputFrom = document.getElementById('date-filter-from');
      const inputTo = document.getElementById('date-filter-to');
      if (inputFrom) inputFrom.value = '';
      if (inputTo) inputTo.value = '';
      customDateFrom = null;
      customDateTo = null;
      activePeriodFilter = 'todos';
      datePresets.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-period') === 'todos');
      });
      renderRoadmapCards();
      renderKanbanBoard();
    });
  }

  // Copiar Link
  const copyBtn = document.getElementById('btn-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '✅ Link Copiado!';
        setTimeout(() => copyBtn.innerHTML = orig, 2500);
      }).catch(() => {
        alert('Link: ' + window.location.href);
      });
    });
  }
}

// ── 10. Helpers de Estilo ─────────────────────────────────────────────
function getPriorityClass(prioridade) {
  switch ((prioridade || '').toLowerCase()) {
    case 'alta': return 'alta';
    case 'média':
    case 'media': return 'media';
    case 'baixa': return 'baixa';
    default: return 'normal';
  }
}

function getPriorityIcon(prioridade) {
  switch ((prioridade || '').toLowerCase()) {
    case 'alta': return '🔴';
    case 'média':
    case 'media': return '🟡';
    case 'baixa': return '⚪';
    default: return '🟢';
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Concluído': return 'tag-concluido';
    case 'Em Testes': return 'tag-em-testes';
    case 'Em Desenvolvimento': return 'tag-em-desenvolvimento';
    default: return 'tag-planejado';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Concluído': return '✓';
    case 'Em Testes': return '🧪';
    case 'Em Desenvolvimento': return '⚡';
    default: return '💡';
  }
}

function getProgressBarClass(progresso, status) {
  if (progresso === 100 || status === 'Concluído') return 'bar-100';
  if (status === 'Em Testes') return 'bar-test';
  if (status === 'Em Desenvolvimento') return 'bar-dev';
  return 'bar-plan';
}
