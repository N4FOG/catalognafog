// ══════════════════════════════════════════════════════════════════════
//  PAINEL DE ROADMAP & STATUS — CONTROLADOR JS DINÂMICO
// ══════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initThemeSupport();
  reloadRoadmapView();
  setupEventListeners();
});

function getData() {
  if (typeof window.getActiveData === 'function') {
    return window.getActiveData();
  }
  return window.ROADMAP_DATA;
}

function reloadRoadmapView() {
  renderProjectHeaderAndStats();
  renderModulesBar();
  renderRoadmapCards();
  renderChangelogTimeline();
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

// ── 2. Renderização de Cabeçalho & Métricas Rápidas ───────────────────
function renderProjectHeaderAndStats() {
  const data = getData();
  if (!data) return;

  // Informações do Projeto
  const clientNameEl = document.getElementById('dash-client-name');
  if (clientNameEl) clientNameEl.textContent = data.projeto.cliente;

  const versionEl = document.getElementById('dash-version-tag');
  if (versionEl) versionEl.textContent = data.projeto.versaoAtual;

  const versionNumEl = document.getElementById('dash-version-num');
  if (versionNumEl) versionNumEl.textContent = data.projeto.versaoAtual;

  const lastUpdateEl = document.getElementById('dash-last-update');
  if (lastUpdateEl) lastUpdateEl.textContent = data.projeto.ultimaAtualizacao;

  // Cálculo de Métricas das Features
  const features = data.features || [];
  const totalFeatures = features.length;
  const concluidas = features.filter(f => f.status === 'Concluído' || f.progresso === 100).length;
  const emAndamento = features.filter(f => f.status === 'Em Desenvolvimento').length;
  const emTestes = features.filter(f => f.status === 'Em Testes').length;
  const planejadas = features.filter(f => f.status === 'Planejado').length;

  // Progresso Geral Ponderado
  const somaProgresso = features.reduce((acc, f) => acc + (f.progresso || 0), 0);
  const mediaProgresso = totalFeatures > 0 ? Math.round(somaProgresso / totalFeatures) : 0;

  // Atualizar Círculo de Progresso
  const circleValEl = document.getElementById('circle-progress-val');
  if (circleValEl) circleValEl.textContent = `${mediaProgresso}%`;

  const circleFillEl = document.getElementById('circle-fill-bar');
  if (circleFillEl) {
    const radius = 34;
    const circumference = 2 * Math.PI * radius; // ~213.6
    circleFillEl.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (mediaProgresso / 100) * circumference;
    setTimeout(() => {
      circleFillEl.style.strokeDashoffset = `${offset}`;
    }, 150);
  }

  // Cards de Métricas Rápidas
  const countDoneEl = document.getElementById('stat-done-count');
  if (countDoneEl) countDoneEl.textContent = concluidas;

  const countDevEl = document.getElementById('stat-dev-count');
  if (countDevEl) countDevEl.textContent = emAndamento;

  const countTestEl = document.getElementById('stat-test-count');
  if (countTestEl) countTestEl.textContent = emTestes;

  const countPlanEl = document.getElementById('stat-plan-count');
  if (countPlanEl) countPlanEl.textContent = planejadas;

  // Badges nas Tabs
  const tabRoadmapBadge = document.getElementById('tab-roadmap-count');
  if (tabRoadmapBadge) tabRoadmapBadge.textContent = totalFeatures;

  const tabChangelogBadge = document.getElementById('tab-changelog-count');
  if (tabChangelogBadge) tabChangelogBadge.textContent = (data.changelog || []).length;

  // Contadores nas Pílulas de Filtro (dash-filter-bar)
  const pillTodos = document.getElementById('count-pill-todos');
  if (pillTodos) pillTodos.textContent = `(${totalFeatures})`;

  const pillDone = document.getElementById('count-pill-concluido');
  if (pillDone) pillDone.textContent = `(${concluidas})`;

  const pillDev = document.getElementById('count-pill-desenvolvimento');
  if (pillDev) pillDev.textContent = `(${emAndamento})`;

  const pillTest = document.getElementById('count-pill-testes');
  if (pillTest) pillTest.textContent = `(${emTestes})`;

  const pillPlan = document.getElementById('count-pill-planejado');
  if (pillPlan) pillPlan.textContent = `(${planejadas})`;

  // CTA WhatsApp
  const ctaBtn = document.getElementById('btn-whatsapp-feedback');
  if (ctaBtn && data.projeto.contatoDev) {
    const fone = data.projeto.contatoDev.whatsapp;
    const msg = encodeURIComponent(data.projeto.contatoDev.mensagemPadrao);
    ctaBtn.href = `https://wa.me/${fone}?text=${msg}`;
  }
}

// ── 3. Renderização da Barra de Módulos ───────────────────────────────
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

// ── 4. Renderização dos Cards do Roadmap (0% a 100%) ──────────────────
let activeStatusFilter = 'todos';
let activeSearchQuery = '';

function renderRoadmapCards() {
  const data = getData();
  if (!data || !data.features) return;

  const grid = document.getElementById('roadmap-cards-grid');
  if (!grid) return;

  const isAdmin = typeof window.isAdminAuthenticated === 'function' && window.isAdminAuthenticated();

  const filtered = data.features.filter(feat => {
    // Filtro por Status
    if (activeStatusFilter !== 'todos') {
      if (activeStatusFilter === 'concluido' && feat.status !== 'Concluído') return false;
      if (activeStatusFilter === 'testes' && feat.status !== 'Em Testes') return false;
      if (activeStatusFilter === 'desenvolvimento' && feat.status !== 'Em Desenvolvimento') return false;
      if (activeStatusFilter === 'planejado' && feat.status !== 'Planejado') return false;
    }

    // Filtro por Busca de Texto
    if (activeSearchQuery) {
      const q = activeSearchQuery.toLowerCase();
      const matchTitle = (feat.titulo || '').toLowerCase().includes(q);
      const matchDesc = (feat.descricao || '').toLowerCase().includes(q);
      const matchCat = (feat.categoria || '').toLowerCase().includes(q);
      const matchPriority = (feat.prioridade || '').toLowerCase().includes(q);
      const matchTags = (feat.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchTags && !matchPriority) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.1rem; color: var(--text);">Nenhuma funcionalidade encontrada</h3>
        <p style="margin: 0; font-size: 0.88rem; color: var(--text-3);">Tente alterar o filtro ou limpar o campo de busca.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(feat => {
    const statusClass = getStatusClass(feat.status);
    const barClass = getProgressBarClass(feat.progresso, feat.status);
    const priorityClass = getPriorityClass(feat.prioridade);
    const priorityIcon = getPriorityIcon(feat.prioridade);
    
    // Checklist HTML
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

    // Tags HTML (Compacto & Elegante com Limite Inteligente)
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

    // Painel Admin nos Cards com UX Redesenhada e Ergonômica
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
            <select class="admin-quick-status-select" onchange="quickUpdateFeatureStatus('${feat.id}', this.value)" title="Alterar status de implementação">
              <option value="Planejado" ${feat.status === 'Planejado' ? 'selected' : ''}>💡 Planejado</option>
              <option value="Em Desenvolvimento" ${feat.status === 'Em Desenvolvimento' ? 'selected' : ''}>⚡ Em Dev</option>
              <option value="Em Testes" ${feat.status === 'Em Testes' ? 'selected' : ''}>🧪 Em Testes</option>
              <option value="Concluído" ${feat.status === 'Concluído' ? 'selected' : ''}>✅ Concluído (100%)</option>
            </select>
          </div>
        </div>
      </div>
    ` : '';

    // Badge de Prioridade Interativa no Header
    const priorityPillHtml = isAdmin ? `
      <select class="feature-priority-select priority-${priorityClass}" 
              onchange="quickUpdateFeaturePriority('${feat.id}', this.value)" 
              title="Clique para alterar a prioridade diretamente">
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
      <div class="feature-card card-priority-${priorityClass} ${isAdmin ? 'admin-card-highlight' : ''}">
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

// ── 5. Renderização da Linha do Tempo / Changelog ─────────────────────
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
              <div class="timeline-date">${log.data}</div>
              ${adminTimelineBtns}
            </div>
          </div>
          <h4 class="timeline-title">${log.titulo}</h4>
          <p class="timeline-summary">${log.resumo}</p>

          <ul class="changelog-items-list">
            ${(log.itens || []).map(item => `
              <li class="changelog-item">
                <span class="type-pill type-${item.tipo}">${getTypeLabel(item.tipo)}</span>
                <span>${item.texto}</span>
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

// ── 6. Event Listeners (Tabs, Filtros, Busca, Copiar Link) ────────────
function setupEventListeners() {
  // Tabs Navigation
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      document.querySelectorAll('.dash-tab-content').forEach(tab => {
        tab.style.display = 'none';
      });

      const activeContent = document.getElementById(`tab-content-${targetTab}`);
      if (activeContent) activeContent.style.display = 'block';
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

  // Busca em Tempo Real
  const searchInput = document.getElementById('dash-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim();
      renderRoadmapCards();
    });
  }

  // Copiar Link do Dashboard
  const copyBtn = document.getElementById('btn-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Link Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        alert('Link: ' + window.location.href);
      });
    });
  }
}

// Exposição global de funções de renderização
window.renderRoadmapCards = renderRoadmapCards;
window.renderChangelogTimeline = renderChangelogTimeline;
