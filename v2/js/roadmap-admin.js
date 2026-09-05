// ══════════════════════════════════════════════════════════════════════
//  PAINEL ADMINISTRATIVO DO ROADMAP — JCV QUÍMICA 2026
//  Controle Completo: Criar, Editar, Excluir, Checklists e Exportação
// ══════════════════════════════════════════════════════════════════════

const ADMIN_CONFIG = {
  defaultPin: '2026',
  storageKeyData: 'rawell_roadmap_custom_data',
  storageKeyAuth: 'rawell_roadmap_admin_auth',
  storageKeyPin: 'rawell_roadmap_admin_pin'
};

// ── 1. Inicialização do Administrador ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAdminModule();
});

function initAdminModule() {
  injectAdminModalsAndToolbar();
  checkAdminAuth();
}

function getStoredPin() {
  return localStorage.getItem(ADMIN_CONFIG.storageKeyPin) || ADMIN_CONFIG.defaultPin;
}

function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_CONFIG.storageKeyAuth) === 'true' ||
         localStorage.getItem(ADMIN_CONFIG.storageKeyAuth) === 'true';
}

function setAdminAuthenticated(auth, remember) {
  if (auth) {
    sessionStorage.setItem(ADMIN_CONFIG.storageKeyAuth, 'true');
    if (remember) {
      localStorage.setItem(ADMIN_CONFIG.storageKeyAuth, 'true');
    }
  } else {
    sessionStorage.removeItem(ADMIN_CONFIG.storageKeyAuth);
    localStorage.removeItem(ADMIN_CONFIG.storageKeyAuth);
  }
}

// ── 2. Obtenção e Persistência dos Dados Ativos ───────────────────────
function getActiveData() {
  try {
    const saved = localStorage.getItem(ADMIN_CONFIG.storageKeyData);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (window.ROADMAP_DATA && window.ROADMAP_DATA.features && parsed.features) {
        const existingIds = new Set(parsed.features.map(f => f.id));
        const newFeatures = window.ROADMAP_DATA.features.filter(f => !existingIds.has(f.id));
        if (newFeatures.length > 0) {
          parsed.features.push(...newFeatures);
          localStorage.setItem(ADMIN_CONFIG.storageKeyData, JSON.stringify(parsed));
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler dados locais:', e);
  }
  return window.ROADMAP_DATA;
}

function saveActiveData(data) {
  try {
    localStorage.setItem(ADMIN_CONFIG.storageKeyData, JSON.stringify(data));
    // Notifica e recarrega a visualização principal
    if (typeof window.reloadRoadmapView === 'function') {
      window.reloadRoadmapView();
    }
    showAdminToast('💾 Alterações salvas com sucesso!');
  } catch (e) {
    console.error('Erro ao salvar dados locais:', e);
    showAdminToast('❌ Erro ao salvar alterações localmente.', true);
  }
}

function resetActiveDataToDefault() {
  if (confirm('Tem certeza que deseja restaurar todos os dados para o padrão original do código? Quaisquer alterações não exportadas serão perdidas.')) {
    localStorage.removeItem(ADMIN_CONFIG.storageKeyData);
    if (typeof window.reloadRoadmapView === 'function') {
      window.reloadRoadmapView();
    }
    showAdminToast('🔄 Dados restaurados para o padrão com sucesso!');
  }
}

// ── 3. Injeção de Elementos DOM (Toolbar e Modais) ────────────────────
function injectAdminModalsAndToolbar() {
  if (document.getElementById('admin-toolbar-root')) return;

  const adminWrapper = document.createElement('div');
  adminWrapper.id = 'admin-toolbar-root';
  adminWrapper.innerHTML = `
    <!-- Barra Flutuante de Ferramentas do Admin -->
    <div id="admin-toolbar" class="admin-toolbar" style="display: none;">
      <div class="roadmap-container admin-toolbar-inner">
        <div class="admin-toolbar-status">
          <span class="admin-badge">👑 Modo Administrador Ativo</span>
          <span class="admin-autosave-indicator">● Auto-salvamento local ativo</span>
        </div>
        <div class="admin-toolbar-actions">
          <button class="btn-admin-act btn-admin-green" onclick="openCreateFeatureModal()">
            ➕ Nova Feature
          </button>
          <button class="btn-admin-act btn-admin-blue" onclick="openCreateChangelogModal()">
            🚀 Novo Lançamento
          </button>
          <button class="btn-admin-act btn-admin-purple" onclick="openModulesManagerModal()">
            📊 Módulos (%)
          </button>
          <button class="btn-admin-act btn-admin-orange" onclick="exportRoadmapDataFile()">
            📥 Baixar roadmap-data.js
          </button>
          <button class="btn-admin-act" onclick="copyRoadmapDataToClipboard()">
            📋 Copiar Código
          </button>
          <button class="btn-admin-act btn-admin-gray" onclick="resetActiveDataToDefault()" title="Restaurar padrão original">
            🔄 Restaurar
          </button>
          <button class="btn-admin-act btn-admin-danger" onclick="logoutAdmin()">
            🚪 Sair
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 1: Login por PIN -->
    <div id="modal-admin-login" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-sm">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">🔒 Acesso ao Painel Admin</h3>
          <button class="admin-modal-close" onclick="closeAdminLoginModal()">✕</button>
        </div>
        <form onsubmit="handleAdminLogin(event)">
          <div class="admin-modal-body">
            <p style="font-size:0.88rem; color:var(--text-2); margin-top:0; margin-bottom:16px;">
              Digite o PIN de segurança para gerenciar funcionalidades, alterar status e editar o roadmap.
            </p>
            <div class="admin-form-group">
              <label class="admin-form-label">PIN de Administrador:</label>
              <input type="password" id="admin-pin-input" class="admin-form-input" placeholder="Digite o PIN (Padrão: 2026)" required autofocus maxlength="12">
            </div>
            <label style="display:flex; align-items:center; gap:8px; font-size:0.82rem; color:var(--text-3); cursor:pointer; margin-top:8px;">
              <input type="checkbox" id="admin-remember-chk">
              Lembrar acesso neste navegador
            </label>
            <div id="admin-login-error" style="color:var(--danger); font-size:0.82rem; font-weight:700; margin-top:10px; display:none;">
              ⚠️ PIN incorreto. Tente novamente.
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeAdminLoginModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-green">🔓 Entrar no Painel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Criar / Editar Funcionalidade -->
    <div id="modal-feature-editor" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-lg">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="feature-modal-title">➕ Nova Funcionalidade</h3>
          <button class="admin-modal-close" onclick="closeFeatureModal()">✕</button>
        </div>
        <form id="form-feature-editor" onsubmit="handleSaveFeature(event)">
          <input type="hidden" id="edit-feature-id">
          <div class="admin-modal-body admin-scrollable-body">
            
            <div class="admin-form-row">
              <div class="admin-form-group flex-2">
                <label class="admin-form-label">Título da Funcionalidade *</label>
                <input type="text" id="feat-title" class="admin-form-input" placeholder="Ex: Sincronização Dinâmica com Google Sheets" required>
              </div>
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Categoria *</label>
                <input type="text" id="feat-cat" class="admin-form-input" list="cat-suggestions" placeholder="Ex: Integração & Dados" required>
                <datalist id="cat-suggestions">
                  <option value="Catálogo & Dados">
                  <option value="Vendas & Orçamentos">
                  <option value="Performance & PWA">
                  <option value="UI & Experiência">
                  <option value="Integração & Segurança">
                  <option value="Gestão & Transparência">
                  <option value="Marketing & Vendas">
                </datalist>
              </div>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Status Atual *</label>
                <select id="feat-status" class="admin-form-select" onchange="syncProgressWithStatus(this.value)" required>
                  <option value="Planejado">💡 Planejado</option>
                  <option value="Em Desenvolvimento">⚡ Em Desenvolvimento</option>
                  <option value="Em Testes">🧪 Em Testes</option>
                  <option value="Concluído">✅ Concluído (100%)</option>
                </select>
              </div>

              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Prioridade</label>
                <select id="feat-priority" class="admin-form-select">
                  <option value="Alta">🔴 Alta</option>
                  <option value="Média" selected>🟡 Média</option>
                  <option value="Normal">🟢 Normal</option>
                </select>
              </div>

              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Previsão / Data</label>
                <input type="text" id="feat-eta" class="admin-form-input" placeholder="Ex: Outubro / 2026">
              </div>
            </div>

            <!-- Slider de Progresso (0% a 100%) -->
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="admin-form-label" style="margin:0;">Progresso de Implementação:</label>
                <span id="feat-progress-badge" class="admin-progress-live-badge">0%</span>
              </div>
              <div style="display:flex; align-items:center; gap:14px;">
                <input type="range" id="feat-progress" class="admin-range-slider" min="0" max="100" value="0" step="5" oninput="updateProgressLiveValue(this.value)">
                <input type="number" id="feat-progress-num" class="admin-form-input" style="width:70px; text-align:center;" min="0" max="100" value="0" oninput="updateProgressLiveValue(this.value)">
              </div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Descrição Detalhada Técnica & Comercial</label>
              <textarea id="feat-desc" class="admin-form-textarea" rows="3" placeholder="Descreva o que a funcionalidade faz e os benefícios para o cliente..."></textarea>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Tags (separadas por vírgula)</label>
              <input type="text" id="feat-tags" class="admin-form-input" placeholder="Ex: PWA, WhatsApp, Google Sheets, Offline">
            </div>

            <!-- Gerenciador de Sub-etapas / Checklist -->
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label class="admin-form-label" style="margin:0;">📋 Checklist de Etapas da Entrega:</label>
                <button type="button" class="btn-admin-act btn-admin-green btn-admin-xs" onclick="addChecklistItemInput()">
                  ➕ Adicionar Etapa
                </button>
              </div>
              <div id="feat-checklist-container" class="admin-checklist-inputs-wrap">
                <!-- Inserido dinamicamente -->
              </div>
            </div>

          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeFeatureModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-green">💾 Salvar Funcionalidade</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Gerenciador de Módulos (%) -->
    <div id="modal-modules-manager" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-md">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">📊 Maturidade dos Módulos do Sistema</h3>
          <button class="admin-modal-close" onclick="closeModulesManagerModal()">✕</button>
        </div>
        <form onsubmit="handleSaveModules(event)">
          <div class="admin-modal-body admin-scrollable-body" id="modules-manager-list">
            <!-- Inserido dinamicamente -->
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeModulesManagerModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-green">💾 Salvar Módulos</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Criar / Editar Versão no Changelog -->
    <div id="modal-changelog-editor" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-lg">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="changelog-modal-title">🚀 Novo Lançamento (Changelog)</h3>
          <button class="admin-modal-close" onclick="closeChangelogModal()">✕</button>
        </div>
        <form id="form-changelog-editor" onsubmit="handleSaveChangelog(event)">
          <input type="hidden" id="edit-changelog-index">
          <div class="admin-modal-body admin-scrollable-body">
            <div class="admin-form-row">
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Versão *</label>
                <input type="text" id="cl-version" class="admin-form-input" placeholder="Ex: v3.1.0" required>
              </div>
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Data de Lançamento *</label>
                <input type="text" id="cl-date" class="admin-form-input" placeholder="Ex: 05 de Outubro de 2026" required>
              </div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Título do Release *</label>
              <input type="text" id="cl-title" class="admin-form-input" placeholder="Ex: Lançamento do Buscador Semântico e Sincronização Google Sheets" required>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Resumo Executivo</label>
              <textarea id="cl-summary" class="admin-form-textarea" rows="2" placeholder="Resumo executivo das entregas contidas nesta versão..."></textarea>
            </div>

            <!-- Lista de Itens do Release -->
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label class="admin-form-label" style="margin:0;">📝 Itens Entregues nesta Versão:</label>
                <button type="button" class="btn-admin-act btn-admin-blue btn-admin-xs" onclick="addChangelogItemInput()">
                  ➕ Adicionar Item
                </button>
              </div>
              <div id="cl-items-container" class="admin-checklist-inputs-wrap">
                <!-- Inserido dinamicamente -->
              </div>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeChangelogModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-blue">💾 Salvar Versão no Histórico</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast de Notificação -->
    <div id="admin-toast" class="admin-toast"></div>
  `;

  document.body.appendChild(adminWrapper);
}

// ── 4. Gerenciamento de Login & Sessão ────────────────────────────────
function openAdminLoginModal() {
  const modal = document.getElementById('modal-admin-login');
  const input = document.getElementById('admin-pin-input');
  const error = document.getElementById('admin-login-error');
  if (error) error.style.display = 'none';
  if (input) input.value = '';
  if (modal) modal.style.display = 'flex';
  setTimeout(() => input && input.focus(), 100);
}

function closeAdminLoginModal() {
  const modal = document.getElementById('modal-admin-login');
  if (modal) modal.style.display = 'none';
}

function handleAdminLogin(e) {
  e.preventDefault();
  const input = document.getElementById('admin-pin-input');
  const remember = document.getElementById('admin-remember-chk')?.checked || false;
  const error = document.getElementById('admin-login-error');
  
  const enteredPin = input ? input.value.trim() : '';
  const correctPin = getStoredPin();

  if (enteredPin === correctPin) {
    setAdminAuthenticated(true, remember);
    closeAdminLoginModal();
    checkAdminAuth();
    showAdminToast('👑 Modo Administrador ativado com sucesso!');
  } else {
    if (error) error.style.display = 'block';
    if (input) {
      input.classList.add('admin-input-shake');
      setTimeout(() => input.classList.remove('admin-input-shake'), 500);
      input.select();
    }
  }
}

function logoutAdmin() {
  setAdminAuthenticated(false, false);
  checkAdminAuth();
  showAdminToast('🚪 Você saiu do Modo Administrador.');
}

function checkAdminAuth() {
  const isAuth = isAdminAuthenticated();
  const toolbar = document.getElementById('admin-toolbar');
  const authBtn = document.getElementById('btn-admin-toggle');
  
  if (toolbar) {
    toolbar.style.display = isAuth ? 'block' : 'none';
  }

  if (authBtn) {
    authBtn.innerHTML = isAuth ? '👑 Admin (Ativo)' : '🔒 Área Admin';
    authBtn.className = isAuth ? 'btn-dash-action btn-dash-primary' : 'btn-dash-action';
  }

  // Atualiza classes do body para controlar visibilidade de botões nos cards
  if (isAuth) {
    document.body.classList.add('is-admin-active');
  } else {
    document.body.classList.remove('is-admin-active');
  }

  // Recarrega os cards para exibir/ocultar botões de edição rápida
  if (typeof window.renderRoadmapCards === 'function') {
    window.renderRoadmapCards();
  }
  if (typeof window.renderChangelogTimeline === 'function') {
    window.renderChangelogTimeline();
  }
}

// ── 5. CRUD de Features ──────────────────────────────────────────────
function openCreateFeatureModal() {
  document.getElementById('feature-modal-title').textContent = '➕ Nova Funcionalidade';
  document.getElementById('edit-feature-id').value = '';
  document.getElementById('form-feature-editor').reset();
  
  updateProgressLiveValue(0);
  renderChecklistInputs([]);
  
  const modal = document.getElementById('modal-feature-editor');
  if (modal) modal.style.display = 'flex';
}

function openEditFeatureModal(featureId) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === featureId);
  if (!feat) return;

  document.getElementById('feature-modal-title').textContent = '✏️ Editar Funcionalidade';
  document.getElementById('edit-feature-id').value = feat.id;
  document.getElementById('feat-title').value = feat.titulo || '';
  document.getElementById('feat-cat').value = feat.categoria || '';
  document.getElementById('feat-status').value = feat.status || 'Planejado';
  document.getElementById('feat-priority').value = feat.prioridade || 'Média';
  document.getElementById('feat-eta').value = feat.previsao || '';
  document.getElementById('feat-desc').value = feat.descricao || '';
  document.getElementById('feat-tags').value = (feat.tags || []).join(', ');

  updateProgressLiveValue(feat.progresso || 0);
  renderChecklistInputs(feat.checklist || []);

  const modal = document.getElementById('modal-feature-editor');
  if (modal) modal.style.display = 'flex';
}

function closeFeatureModal() {
  const modal = document.getElementById('modal-feature-editor');
  if (modal) modal.style.display = 'none';
}

function updateProgressLiveValue(val) {
  val = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
  const slider = document.getElementById('feat-progress');
  const num = document.getElementById('feat-progress-num');
  const badge = document.getElementById('feat-progress-badge');

  if (slider) slider.value = val;
  if (num) num.value = val;
  if (badge) badge.textContent = `${val}%`;
}

function syncProgressWithStatus(status) {
  if (status === 'Concluído') {
    updateProgressLiveValue(100);
    const etaInput = document.getElementById('feat-eta');
    if (etaInput && (!etaInput.value.trim() || etaInput.value.includes('Fev/') || etaInput.value.includes('Mar/') || etaInput.value.includes('Abr/'))) {
      etaInput.value = 'Entregue (09/2026)';
    }
  } else if (status === 'Planejado') {
    const cur = parseInt(document.getElementById('feat-progress')?.value, 10) || 0;
    if (cur > 30) updateProgressLiveValue(0);
  }
}

function renderChecklistInputs(checklist) {
  const container = document.getElementById('feat-checklist-container');
  if (!container) return;
  container.innerHTML = '';

  initDraggableList('feat-checklist-container');

  checklist.forEach((item, idx) => {
    addChecklistItemInput(item.item, item.feito);
  });
}

function addChecklistItemInput(text = '', feito = false) {
  const container = document.getElementById('feat-checklist-container');
  if (!container) return;

  initDraggableList('feat-checklist-container');

  const row = document.createElement('div');
  row.className = 'admin-checklist-input-row admin-draggable-row';
  row.draggable = true;
  row.innerHTML = `
    <span class="admin-drag-handle" title="Clique e arraste para reordenar esta etapa">⋮⋮</span>
    <input type="checkbox" class="admin-chk-toggle" ${feito ? 'checked' : ''} title="Marcar como concluída">
    <input type="text" class="admin-form-input admin-chk-text" placeholder="Descrição da etapa..." value="${escapeHtml(text)}" required>
    <div class="admin-row-quick-sort">
      <button type="button" class="btn-sort-arrow" onclick="moveRowUp(this)" title="Mover para cima">▲</button>
      <button type="button" class="btn-sort-arrow" onclick="moveRowDown(this)" title="Mover para baixo">▼</button>
    </div>
    <button type="button" class="btn-admin-act btn-admin-danger btn-admin-icon-only" onclick="this.closest('.admin-checklist-input-row').remove()" title="Excluir etapa">✕</button>
  `;

  attachDragEventsToRow(row);
  container.appendChild(row);
}

function handleSaveFeature(e) {
  e.preventDefault();
  const id = document.getElementById('edit-feature-id').value;
  const title = document.getElementById('feat-title').value.trim();
  const category = document.getElementById('feat-cat').value.trim();
  const status = document.getElementById('feat-status').value;
  const priority = document.getElementById('feat-priority').value;
  const eta = document.getElementById('feat-eta').value.trim();
  const desc = document.getElementById('feat-desc').value.trim();
  const progresso = parseInt(document.getElementById('feat-progress').value, 10) || 0;
  
  const rawTags = document.getElementById('feat-tags').value;
  const tags = rawTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Coleta do Checklist
  const checklistRows = document.querySelectorAll('#feat-checklist-container .admin-checklist-input-row');
  const checklist = [];
  checklistRows.forEach(row => {
    const done = row.querySelector('.admin-chk-toggle')?.checked || false;
    const itemText = row.querySelector('.admin-chk-text')?.value.trim() || '';
    if (itemText) {
      checklist.push({ item: itemText, feito: done });
    }
  });

  const data = getActiveData();
  data.features = data.features || [];

  if (id) {
    // Edição
    const idx = data.features.findIndex(f => f.id === id);
    if (idx !== -1) {
      data.features[idx] = {
        ...data.features[idx],
        titulo: title,
        categoria: category,
        status: status,
        prioridade: priority,
        previsao: eta,
        descricao: desc,
        progresso: progresso,
        tags: tags,
        checklist: checklist
      };
    }
  } else {
    // Criação
    const newId = `feat-${String(data.features.length + 1).padStart(3, '0')}-${Date.now().toString(36)}`;
    data.features.push({
      id: newId,
      titulo: title,
      categoria: category,
      status: status,
      prioridade: priority,
      previsao: eta,
      descricao: desc,
      progresso: progresso,
      tags: tags,
      checklist: checklist
    });
  }

  // Atualiza data de modificação
  data.projeto = data.projeto || {};
  data.projeto.ultimaAtualizacao = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());

  saveActiveData(data);
  closeFeatureModal();
}

function deleteFeature(featureId) {
  if (!confirm('Deseja realmente excluir esta funcionalidade do roadmap?')) return;

  const data = getActiveData();
  data.features = (data.features || []).filter(f => f.id !== featureId);
  saveActiveData(data);
  showAdminToast('🗑️ Funcionalidade excluída com sucesso!');
}

function quickUpdateFeatureStatus(featureId, newStatus) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === featureId);
  if (!feat) return;

  feat.status = newStatus;
  if (newStatus === 'Concluído') {
    feat.progresso = 100;
    feat.previsao = 'Entregue (09/2026)';
    if (feat.checklist) {
      feat.checklist.forEach(c => c.feito = true);
    }
  } else if (newStatus === 'Planejado' && feat.progresso === 100) {
    feat.progresso = 0;
  }

  saveActiveData(data);
}

function quickUpdateFeaturePriority(featureId, newPriority) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === featureId);
  if (!feat) return;

  feat.prioridade = newPriority;
  saveActiveData(data);
  showAdminToast(`⚡ Prioridade de "${feat.titulo.substring(0, 25)}..." alterada para ${newPriority}!`);
}

function toggleChecklistItemDirect(featureId, itemIndex) {
  if (!isAdminAuthenticated()) return;
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === featureId);
  if (!feat || !feat.checklist || !feat.checklist[itemIndex]) return;

  feat.checklist[itemIndex].feito = !feat.checklist[itemIndex].feito;
  
  // Recalcula progresso automaticamente baseado nas etapas
  const total = feat.checklist.length;
  const done = feat.checklist.filter(c => c.feito).length;
  feat.progresso = Math.round((done / total) * 100);

  if (feat.progresso === 100) {
    feat.status = 'Concluído';
  } else if (feat.progresso > 0 && feat.status === 'Planejado') {
    feat.status = 'Em Desenvolvimento';
  }

  saveActiveData(data);
}

// ── 6. Gerenciamento de Módulos ──────────────────────────────────────
function openModulesManagerModal() {
  const data = getActiveData();
  const container = document.getElementById('modules-manager-list');
  if (!container) return;

  container.innerHTML = (data.modulos || []).map((mod, idx) => `
    <div class="admin-module-edit-row">
      <div class="admin-module-edit-info">
        <span style="font-size:1.2rem;">${mod.icone}</span>
        <div>
          <strong style="color:var(--text); font-size:0.9rem;">${mod.nome}</strong>
          <div style="font-size:0.75rem; color:var(--text-3);">${mod.status || 'Ativo'}</div>
        </div>
      </div>
      <div class="admin-module-edit-control">
        <input type="range" class="admin-range-slider" min="0" max="100" step="5" value="${mod.maturidade}" 
               oninput="document.getElementById('mod-val-${idx}').textContent = this.value + '%'">
        <span id="mod-val-${idx}" class="admin-progress-live-badge" style="min-width:45px; text-align:center;">${mod.maturidade}%</span>
      </div>
    </div>
  `).join('');

  const modal = document.getElementById('modal-modules-manager');
  if (modal) modal.style.display = 'flex';
}

function closeModulesManagerModal() {
  const modal = document.getElementById('modal-modules-manager');
  if (modal) modal.style.display = 'none';
}

function handleSaveModules(e) {
  e.preventDefault();
  const data = getActiveData();
  const rows = document.querySelectorAll('#modules-manager-list .admin-module-edit-row');

  rows.forEach((row, idx) => {
    const slider = row.querySelector('input[type="range"]');
    if (slider && data.modulos && data.modulos[idx]) {
      const val = parseInt(slider.value, 10) || 0;
      data.modulos[idx].maturidade = val;
      if (val === 100) data.modulos[idx].status = 'Operacional';
      else if (val >= 80) data.modulos[idx].status = 'Em Homologação';
      else if (val >= 30) data.modulos[idx].status = 'Em Desenvolvimento';
      else data.modulos[idx].status = 'Planejado';
    }
  });

  saveActiveData(data);
  closeModulesManagerModal();
}

// ── 7. Gerenciamento de Changelog ────────────────────────────────────
function openCreateChangelogModal() {
  document.getElementById('changelog-modal-title').textContent = '🚀 Novo Lançamento (Changelog)';
  document.getElementById('edit-changelog-index').value = '';
  document.getElementById('form-changelog-editor').reset();

  const container = document.getElementById('cl-items-container');
  if (container) container.innerHTML = '';
  addChangelogItemInput('novo', '');

  const modal = document.getElementById('modal-changelog-editor');
  if (modal) modal.style.display = 'flex';
}

function openEditChangelogModal(index) {
  const data = getActiveData();
  const log = (data.changelog || [])[index];
  if (!log) return;

  document.getElementById('changelog-modal-title').textContent = '✏️ Editar Versão do Changelog';
  document.getElementById('edit-changelog-index').value = index;
  document.getElementById('cl-version').value = log.versao || '';
  document.getElementById('cl-date').value = log.data || '';
  document.getElementById('cl-title').value = log.titulo || '';
  document.getElementById('cl-summary').value = log.resumo || '';

  const container = document.getElementById('cl-items-container');
  if (container) {
    container.innerHTML = '';
    (log.itens || []).forEach(item => {
      addChangelogItemInput(item.tipo, item.texto);
    });
  }

  const modal = document.getElementById('modal-changelog-editor');
  if (modal) modal.style.display = 'flex';
}

function closeChangelogModal() {
  const modal = document.getElementById('modal-changelog-editor');
  if (modal) modal.style.display = 'none';
}

function addChangelogItemInput(tipo = 'novo', texto = '') {
  const container = document.getElementById('cl-items-container');
  if (!container) return;

  initDraggableList('cl-items-container');

  const row = document.createElement('div');
  row.className = 'admin-changelog-input-row admin-draggable-row';
  row.draggable = true;
  row.innerHTML = `
    <span class="admin-drag-handle" title="Clique e arraste para reordenar este item">⋮⋮</span>
    <select class="admin-form-select admin-cl-type" style="width:130px; flex-shrink:0;">
      <option value="novo" ${tipo === 'novo' ? 'selected' : ''}>✨ Novo</option>
      <option value="melhoria" ${tipo === 'melhoria' ? 'selected' : ''}>⚡ Melhoria</option>
      <option value="correcao" ${tipo === 'correcao' ? 'selected' : ''}>🐛 Correção</option>
      <option value="performance" ${tipo === 'performance' ? 'selected' : ''}>🚀 Performance</option>
      <option value="seguranca" ${tipo === 'seguranca' ? 'selected' : ''}>🔒 Segurança</option>
    </select>
    <input type="text" class="admin-form-input admin-cl-text" placeholder="Descrição do que foi feito..." value="${escapeHtml(texto)}" required>
    <div class="admin-row-quick-sort">
      <button type="button" class="btn-sort-arrow" onclick="moveRowUp(this)" title="Mover para cima">▲</button>
      <button type="button" class="btn-sort-arrow" onclick="moveRowDown(this)" title="Mover para baixo">▼</button>
    </div>
    <button type="button" class="btn-admin-act btn-admin-danger btn-admin-icon-only" onclick="this.closest('.admin-changelog-input-row').remove()" title="Excluir item">✕</button>
  `;

  attachDragEventsToRow(row);
  container.appendChild(row);
}

function handleSaveChangelog(e) {
  e.preventDefault();
  const indexStr = document.getElementById('edit-changelog-index').value;
  const version = document.getElementById('cl-version').value.trim();
  const date = document.getElementById('cl-date').value.trim();
  const title = document.getElementById('cl-title').value.trim();
  const summary = document.getElementById('cl-summary').value.trim();

  const rows = document.querySelectorAll('#cl-items-container .admin-changelog-input-row');
  const items = [];
  rows.forEach(row => {
    const tipo = row.querySelector('.admin-cl-type')?.value || 'novo';
    const text = row.querySelector('.admin-cl-text')?.value.trim() || '';
    if (text) {
      items.push({ tipo: tipo, texto: text });
    }
  });

  const data = getActiveData();
  data.changelog = data.changelog || [];

  const newEntry = {
    versao: version,
    data: date,
    titulo: title,
    resumo: summary,
    itens: items
  };

  if (indexStr !== '') {
    const idx = parseInt(indexStr, 10);
    data.changelog[idx] = newEntry;
  } else {
    // Insere no topo como lançamento mais recente
    data.changelog.unshift(newEntry);
  }

  saveActiveData(data);
  closeChangelogModal();
}

function deleteChangelog(index) {
  if (!confirm('Deseja realmente remover esta versão do histórico?')) return;
  const data = getActiveData();
  data.changelog.splice(index, 1);
  saveActiveData(data);
  showAdminToast('🗑️ Versão removida do histórico!');
}

// ── 8. Exportador de Código & Download de Arquivo ─────────────────────
function generateFormattedDataCode() {
  const data = getActiveData();
  const header = `// ══════════════════════════════════════════════════════════════════════
//  PAINEL DE CONTROLE DE IMPLEMENTAÇÕES & ROADMAP — JCV QUÍMICA 2026
//  Base de Dados Oficial e Completa do Projeto (Rawell Química)
//  Gerado via Painel Administrativo em: ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())}
// ══════════════════════════════════════════════════════════════════════

const ROADMAP_DATA = `;

  const jsonStr = JSON.stringify(data, null, 2);
  const footer = `;

if (typeof window !== 'undefined') window.ROADMAP_DATA = ROADMAP_DATA;
if (typeof module !== 'undefined' && module.exports) module.exports = ROADMAP_DATA;
`;

  return header + jsonStr + footer;
}

function exportRoadmapDataFile() {
  const code = generateFormattedDataCode();
  const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'roadmap-data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAdminToast('📥 Arquivo roadmap-data.js baixado com sucesso!');
}

function copyRoadmapDataToClipboard() {
  const code = generateFormattedDataCode();
  navigator.clipboard.writeText(code).then(() => {
    showAdminToast('📋 Código do roadmap-data.js copiado para a Área de Transferência!');
  }).catch(() => {
    showAdminToast('❌ Erro ao copiar código.', true);
  });
}

// ── 9. Toast de Notificações Administrativas ──────────────────────────
function showAdminToast(msg, isError = false) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.classList.add('visible');

  clearTimeout(window._adminToastTimeout);
  window._adminToastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── 10. Motor de Drag & Drop (Arrastar e Soltar) ──────────────────────
function initDraggableList(containerId) {
  const container = document.getElementById(containerId);
  if (!container || container._dragInitialized) return;
  container._dragInitialized = true;

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingEl = container.querySelector('.dragging');
    if (!draggingEl) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggingEl);
    } else {
      container.insertBefore(draggingEl, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.admin-draggable-row:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function attachDragEventsToRow(row) {
  row.addEventListener('dragstart', (e) => {
    row.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', '');
      } catch (err) {}
    }
  });

  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    row.classList.add('admin-row-highlight-anim');
    setTimeout(() => row.classList.remove('admin-row-highlight-anim'), 400);
  });

  // Touch Drag Support para dispositivos móveis
  const handle = row.querySelector('.admin-drag-handle');
  if (handle) {
    let originalParent = null;

    handle.addEventListener('touchstart', (e) => {
      originalParent = row.parentNode;
      row.classList.add('dragging');
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!targetEl || !originalParent) return;

      const targetRow = targetEl.closest('.admin-draggable-row');
      if (targetRow && targetRow !== row && targetRow.parentNode === originalParent) {
        const box = targetRow.getBoundingClientRect();
        const next = (touch.clientY - box.top) / (box.bottom - box.top) > 0.5;
        originalParent.insertBefore(row, next ? targetRow.nextSibling : targetRow);
      }
    }, { passive: true });

    handle.addEventListener('touchend', () => {
      row.classList.remove('dragging');
      row.classList.add('admin-row-highlight-anim');
      setTimeout(() => row.classList.remove('admin-row-highlight-anim'), 400);
    }, { passive: true });
  }
}

function moveRowUp(btn) {
  const row = btn.closest('.admin-draggable-row');
  if (row && row.previousElementSibling) {
    row.parentNode.insertBefore(row, row.previousElementSibling);
    row.classList.add('admin-row-highlight-anim');
    setTimeout(() => row.classList.remove('admin-row-highlight-anim'), 400);
  }
}

function moveRowDown(btn) {
  const row = btn.closest('.admin-draggable-row');
  if (row && row.nextElementSibling) {
    row.parentNode.insertBefore(row.nextElementSibling, row);
    row.classList.add('admin-row-highlight-anim');
    setTimeout(() => row.classList.remove('admin-row-highlight-anim'), 400);
  }
}

// Exposição Global
window.openAdminLoginModal = openAdminLoginModal;
window.openCreateFeatureModal = openCreateFeatureModal;
window.openEditFeatureModal = openEditFeatureModal;
window.deleteFeature = deleteFeature;
window.quickUpdateFeatureStatus = quickUpdateFeatureStatus;
window.quickUpdateFeaturePriority = quickUpdateFeaturePriority;
window.toggleChecklistItemDirect = toggleChecklistItemDirect;
window.openModulesManagerModal = openModulesManagerModal;
window.openCreateChangelogModal = openCreateChangelogModal;
window.openEditChangelogModal = openEditChangelogModal;
window.deleteChangelog = deleteChangelog;
window.exportRoadmapDataFile = exportRoadmapDataFile;
window.copyRoadmapDataToClipboard = copyRoadmapDataToClipboard;
window.resetActiveDataToDefault = resetActiveDataToDefault;
window.logoutAdmin = logoutAdmin;
window.getActiveData = getActiveData;
window.moveRowUp = moveRowUp;
window.moveRowDown = moveRowDown;

