// ══════════════════════════════════════════════════════════════════════
//  PAINEL ADMINISTRATIVO ROADMAP v2 — JCV QUÍMICA 2026
//  Controle Completo: CRUD, Cloud Sync, Drag & Drop, Templates, PDF
// ══════════════════════════════════════════════════════════════════════

const ADMIN_CONFIG = {
  defaultPin: '2026',
  storageKeyData: 'rawell_roadmap_cloud_data',
  storageKeyAuth: 'rawell_roadmap_admin_auth',
  storageKeyPin: 'rawell_roadmap_admin_pin',
  cloudSyncUrl: 'https://script.google.com/macros/s/AKfycbx6ZFn14Z0Ro6M2FIFJkoJd_VcPNlk9kl3jfK51A2SYbh4GxO5FBwu2Xbiie2Fi8ScVSQ/exec'
};

// ── 1. Inicialização do Administrador ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAdminModule();
});

function initAdminModule() {
  injectAdminModalsAndToolbar();
  checkAdminAuth();
  setupCloudAutoSync();
}

function getStoredPin() {
  return localStorage.getItem(ADMIN_CONFIG.storageKeyPin) || localStorage.getItem('rawell_roadmap2_admin_pin') || ADMIN_CONFIG.defaultPin;
}

function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_CONFIG.storageKeyAuth) === 'true' ||
         localStorage.getItem(ADMIN_CONFIG.storageKeyAuth) === 'true' ||
         sessionStorage.getItem('rawell_roadmap2_admin_auth') === 'true' ||
         localStorage.getItem('rawell_roadmap2_admin_auth') === 'true';
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
    sessionStorage.removeItem('rawell_roadmap2_admin_auth');
    localStorage.removeItem('rawell_roadmap2_admin_auth');
  }
}

// ── 2. Obtenção e Persistência dos Dados Ativos com Sincronização Cloud ─
function getActiveData() {
  try {
    const saved = localStorage.getItem(ADMIN_CONFIG.storageKeyData) || localStorage.getItem('rawell_roadmap2_cloud_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      const deletedIds = new Set(parsed.deletedIds || []);
      let hasUpdates = false;

      // Sincroniza novas features que estejam no dataset base mas não no cache
      const baseData = window.ROADMAP2_DATA || window.ROADMAP_DATA;
      if (baseData && baseData.features && parsed.features) {
        const existingIds = new Set(parsed.features.map(f => f.id));
        const newFeatures = baseData.features.filter(f => !existingIds.has(f.id) && !deletedIds.has(f.id));
        if (newFeatures.length > 0) {
          parsed.features.push(...newFeatures);
          hasUpdates = true;
        }
      }

      // Sincroniza novos lançamentos no changelog
      if (baseData && baseData.changelog && parsed.changelog) {
        const existingVersions = new Set(parsed.changelog.map(c => c.versao));
        const newReleases = baseData.changelog.filter(c => !existingVersions.has(c.versao));
        if (newReleases.length > 0) {
          parsed.changelog.unshift(...newReleases);
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        localStorage.setItem(ADMIN_CONFIG.storageKeyData, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler dados locais:', e);
  }
  return window.ROADMAP2_DATA || window.ROADMAP_DATA;
}
window.getActiveData = getActiveData;

function saveActiveData(data, skipCloudSync = false) {
  try {
    localStorage.setItem(ADMIN_CONFIG.storageKeyData, JSON.stringify(data));
    
    // Recarrega visualização
    if (typeof window.reloadRoadmapView === 'function') {
      window.reloadRoadmapView();
    }

    if (!skipCloudSync) {
      syncDataToCloud(data);
    }

    showAdminToast('💾 Salvo com sucesso!');
  } catch (e) {
    console.error('Erro ao salvar dados locais:', e);
    showAdminToast('❌ Erro ao salvar alterações.', true);
  }
}
window.saveActiveData = saveActiveData;

// Sincronização com o Google Apps Script (Nuvem)
async function syncDataToCloud(data) {
  updateCloudBadgeState('syncing', 'Sincronizando...');
  try {
    const url = (data.config && data.config.cloudSyncUrl) ? data.config.cloudSyncUrl : ADMIN_CONFIG.cloudSyncUrl;
    const payload = {
      action: 'saveRoadmap',
      user: 'Admin / ' + (data.projeto ? data.projeto.cliente : 'JCV Química'),
      roadmap: data,
      timestamp: new Date().toISOString()
    };

    // Tenta fetch com POST JSON
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      updateCloudBadgeState('online', 'Nuvem Atualizada');
      showAdminToast('☁️ Sincronizado na Nuvem com Sucesso!');
    } else {
      updateCloudBadgeState('online', 'Nuvem Conectada');
    }
  } catch (err) {
    console.warn('Sync Cloud em background:', err);
    updateCloudBadgeState('online', 'Nuvem Sincronizada');
  }
}
window.syncDataToCloud = syncDataToCloud;

// Busca os dados mais recentes da nuvem e reconcilia
async function fetchCloudRoadmap() {
  updateCloudBadgeState('syncing', 'Buscando Nuvem...');
  try {
    const url = ADMIN_CONFIG.cloudSyncUrl + '?action=getRoadmap&t=' + Date.now();
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json && json.status === 'success' && json.hasData && json.data) {
        const cloudData = json.data;
        // Salva dados obtidos da nuvem
        localStorage.setItem(ADMIN_CONFIG.storageKeyData, JSON.stringify(cloudData));
        if (typeof window.reloadRoadmapView === 'function') {
          window.reloadRoadmapView();
        }
        updateCloudBadgeState('online', 'Nuvem Sincronizada');
        showAdminToast('☁️ Dados atualizados da nuvem!');
        return;
      }
    }
  } catch (e) {
    console.warn('Não foi possível conectar à nuvem agora:', e);
  }
  updateCloudBadgeState('online', 'Nuvem Ativa');
}
window.fetchCloudRoadmap = fetchCloudRoadmap;

function updateCloudBadgeState(state, label) {
  const badge = document.getElementById('dash-cloud-badge');
  if (!badge) return;

  badge.className = 'dash-cloud-status ' + (state === 'syncing' ? 'syncing' : (state === 'offline' ? 'offline' : ''));
  const lbl = badge.querySelector('.cloud-status-lbl');
  if (lbl) lbl.textContent = label;
}

function setupCloudAutoSync() {
  // Faz a primeira checagem assíncrona
  setTimeout(() => {
    fetchCloudRoadmap();
  }, 1000);

  // Polling inteligente que só roda se a aba estiver visível e online (poupa bateria no mobile)
  setInterval(() => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      fetchCloudRoadmap();
    }
  }, 45000);

  // Sincroniza imediatamente quando o usuário retorna à aba no celular
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      fetchCloudRoadmap();
    }
  });

  // Sincroniza ao recuperar conexão com a internet
  window.addEventListener('online', () => {
    fetchCloudRoadmap();
  });
}

function resetActiveDataToDefault() {
  if (confirm('Tem certeza que deseja restaurar todos os dados para o padrão original? Todas as alterações serão reinicializadas.')) {
    localStorage.removeItem(ADMIN_CONFIG.storageKeyData);
    if (typeof window.reloadRoadmapView === 'function') {
      window.reloadRoadmapView();
    }
    showAdminToast('🔄 Dados restaurados para o padrão!');
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
          <span class="admin-autosave-indicator">● Sincronização Cloud Ativa</span>
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
          <button class="btn-admin-act btn-quick-pdf" onclick="generateExecutivePdfReport()">
            📄 PDF Executivo
          </button>
          <button class="btn-admin-act btn-admin-orange" onclick="exportRoadmapDataFile()">
            📥 Baixar .JS
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
              Digite o PIN de segurança para gerenciar funcionalidades, mover cards no Kanban e atualizar a nuvem.
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

    <!-- Modal 2: Criar / Editar Funcionalidade com Templates e Checklist -->
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
                  <option value="Baixa">⚪ Baixa</option>
                </select>
              </div>

              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Previsão / Data (Texto)</label>
                <input type="text" id="feat-eta" class="admin-form-input" placeholder="Ex: Entregue (09/2026)">
              </div>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">📅 Data de Registro / Início</label>
                <input type="date" id="feat-date-created" class="admin-form-input">
              </div>
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">🏁 Data de Entrega / Conclusão</label>
                <input type="date" id="feat-date-delivered" class="admin-form-input">
              </div>
            </div>

            <!-- Progresso Automatizado pelo Checklist -->
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label class="admin-form-label" style="margin-bottom:0;">
                  Progresso de Implementação: <strong id="feat-prog-val" style="color:var(--brand-light);">0%</strong>
                </label>
                <span style="font-size:0.75rem; color:var(--text-3);">
                  ⚡ Calculado automaticamente pelas etapas concluídas
                </span>
              </div>
              <input type="range" id="feat-prog" class="admin-form-range" min="0" max="100" value="0" oninput="updateProgressDisplay(this.value)">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Descrição Detalhada do Requisito *</label>
              <textarea id="feat-desc" class="admin-form-textarea" rows="4" style="min-height:100px; resize:vertical; line-height:1.55;" placeholder="Descreva os objetivos, impacto e escopo da entrega..." required></textarea>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Tags Técnicas (Separadas por vírgula)</label>
              <input type="text" id="feat-tags" class="admin-form-input" placeholder="Ex: Google Sheets, Nuvem, Tempo Real">
            </div>

            <!-- Editor de Checklist de Etapas -->
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label class="admin-form-label" style="margin-bottom:0;">📋 Checklist de Etapas / Tarefas:</label>
                <button type="button" class="btn-admin-act btn-admin-blue" style="padding:4px 10px; font-size:0.75rem;" onclick="addChecklistRow()">
                  ➕ Adicionar Etapa
                </button>
              </div>
              <div id="checklist-rows-container" class="admin-checklist-editor">
                <!-- Linhas do checklist adicionadas dinamicamente -->
              </div>
            </div>

          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeFeatureModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-green">💾 Salvar na Nuvem</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Gerenciador de Lançamentos (Changelog) -->
    <div id="modal-changelog-editor" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-lg">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" id="changelog-modal-title">🚀 Novo Lançamento (Changelog)</h3>
          <button class="admin-modal-close" onclick="closeChangelogModal()">✕</button>
        </div>
        <form id="form-changelog-editor" onsubmit="handleSaveChangelog(event)">
          <input type="hidden" id="edit-changelog-index" value="-1">
          <div class="admin-modal-body admin-scrollable-body">
            <div class="admin-form-row">
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Versão *</label>
                <input type="text" id="log-version" class="admin-form-input" placeholder="Ex: v3.2.0" required>
              </div>
              <div class="admin-form-group flex-1">
                <label class="admin-form-label">Data de Lançamento *</label>
                <input type="text" id="log-date" class="admin-form-input" placeholder="Ex: 05 de Setembro de 2026" required>
              </div>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Título do Release *</label>
              <input type="text" id="log-title" class="admin-form-input" placeholder="Ex: Sincronização em Nuvem e Quadro Kanban" required>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Resumo Geral da Atualização</label>
              <textarea id="log-summary" class="admin-form-textarea" rows="2" placeholder="Visão geral do que foi entregue nesta versão..."></textarea>
            </div>
            <div class="admin-form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label class="admin-form-label" style="margin-bottom:0;">Itens Entregues:</label>
                <button type="button" class="btn-admin-act btn-admin-blue" style="padding:4px 10px; font-size:0.75rem;" onclick="addChangelogItemRow()">
                  ➕ Adicionar Item
                </button>
              </div>
              <div id="changelog-items-container" class="admin-changelog-editor"></div>
            </div>
          </div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeChangelogModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-blue">🚀 Salvar Lançamento</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Gerenciador de Maturidade dos Módulos (%) -->
    <div id="modal-modules-manager" class="admin-modal-backdrop" style="display: none;">
      <div class="admin-modal-box admin-modal-md">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">📊 Maturidade dos Módulos</h3>
          <button class="admin-modal-close" onclick="closeModulesModal()">✕</button>
        </div>
        <form onsubmit="handleSaveModules(event)">
          <div class="admin-modal-body admin-scrollable-body" id="modules-edit-list"></div>
          <div class="admin-modal-footer">
            <button type="button" class="btn-admin-act btn-admin-gray" onclick="closeModulesModal()">Cancelar</button>
            <button type="submit" class="btn-admin-act btn-admin-purple">💾 Salvar Maturidade</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <div id="admin-toast" class="admin-toast" style="display: none;"></div>
  `;

  document.body.appendChild(adminWrapper);
}

// ── 4. Funções de Autenticação e Modal de Login ──────────────────────
function openAdminLoginModal() {
  if (isAdminAuthenticated()) {
    logoutAdmin();
    return;
  }
  const modal = document.getElementById('modal-admin-login');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('admin-pin-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
    }
  }
}
window.openAdminLoginModal = openAdminLoginModal;

function closeAdminLoginModal() {
  const modal = document.getElementById('modal-admin-login');
  if (modal) modal.style.display = 'none';
  const err = document.getElementById('admin-login-error');
  if (err) err.style.display = 'none';
}
window.closeAdminLoginModal = closeAdminLoginModal;

function handleAdminLogin(event) {
  event.preventDefault();
  const input = document.getElementById('admin-pin-input');
  const remember = document.getElementById('admin-remember-chk')?.checked;
  const pin = input ? input.value.trim() : '';

  if (pin === getStoredPin()) {
    setAdminAuthenticated(true, remember);
    closeAdminLoginModal();
    checkAdminAuth();
    if (typeof window.reloadRoadmapView === 'function') {
      window.reloadRoadmapView();
    }
    showAdminToast('🔓 Modo Administrador ativado com sucesso!');

    // Abre automaticamente a funcionalidade se o usuário clicou 2x nela
    if (window._pendingEditFeatureId) {
      const featId = window._pendingEditFeatureId;
      window._pendingEditFeatureId = null;
      setTimeout(() => {
        openEditFeatureModal(featId);
      }, 150);
    }
  } else {
    const err = document.getElementById('admin-login-error');
    if (err) err.style.display = 'block';
    if (input) {
      input.select();
      input.focus();
    }
  }
}
window.handleAdminLogin = handleAdminLogin;

function checkAdminAuth() {
  const isAuth = isAdminAuthenticated();
  const toolbar = document.getElementById('admin-toolbar');
  const btnToggle = document.getElementById('btn-admin-toggle');

  if (toolbar) toolbar.style.display = isAuth ? 'block' : 'none';
  if (btnToggle) {
    btnToggle.innerHTML = isAuth ? '🔓 Painel Ativo (Sair)' : '🔒 Área Admin';
    btnToggle.className = isAuth ? 'btn-dash-action btn-dash-admin-active' : 'btn-dash-action';
  }
}
window.checkAdminAuth = checkAdminAuth;

function logoutAdmin() {
  setAdminAuthenticated(false);
  checkAdminAuth();
  if (typeof window.reloadRoadmapView === 'function') {
    window.reloadRoadmapView();
  }
  showAdminToast('🔒 Sessão de Administrador finalizada.');
}
window.logoutAdmin = logoutAdmin;

// ── 5. CRUD de Funcionalidades & Templates ────────────────────────────
function openCreateFeatureModal() {
  const modal = document.getElementById('modal-feature-editor');
  const form = document.getElementById('form-feature-editor');
  const title = document.getElementById('feature-modal-title');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('edit-feature-id').value = '';
  if (title) title.textContent = '➕ Nova Funcionalidade';

  const today = new Date().toISOString().split('T')[0];
  const createdInput = document.getElementById('feat-date-created');
  if (createdInput) createdInput.value = today;

  document.getElementById('checklist-rows-container').innerHTML = '';
  // Adiciona 2 etapas padrão
  addChecklistRow('', false);
  addChecklistRow('', false);

  updateProgressDisplay(0);
  modal.style.display = 'flex';
}
window.openCreateFeatureModal = openCreateFeatureModal;

function openEditFeatureModal(id) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === id);
  if (!feat) return;

  const modal = document.getElementById('modal-feature-editor');
  const title = document.getElementById('feature-modal-title');
  if (!modal) return;

  document.getElementById('edit-feature-id').value = feat.id;
  if (title) title.textContent = '✏️ Editar: ' + feat.titulo;

  document.getElementById('feat-title').value = feat.titulo || '';
  document.getElementById('feat-cat').value = feat.categoria || '';
  document.getElementById('feat-status').value = feat.status || 'Planejado';
  document.getElementById('feat-priority').value = feat.prioridade || 'Normal';
  document.getElementById('feat-eta').value = feat.previsao || '';
  document.getElementById('feat-desc').value = feat.descricao || '';
  document.getElementById('feat-tags').value = (feat.tags || []).join(', ');
  document.getElementById('feat-prog').value = feat.progresso || 0;
  document.getElementById('feat-date-created').value = feat.dataCriacao || '';
  document.getElementById('feat-date-delivered').value = feat.dataEntrega || '';

  updateProgressDisplay(feat.progresso || 0);

  // Renderiza checklist
  const chkContainer = document.getElementById('checklist-rows-container');
  chkContainer.innerHTML = '';
  if (feat.checklist && feat.checklist.length > 0) {
    feat.checklist.forEach(chk => {
      addChecklistRow(chk.item, chk.feito);
    });
  } else {
    addChecklistRow('', false);
  }

  modal.style.display = 'flex';
}
window.openEditFeatureModal = openEditFeatureModal;

function closeFeatureModal() {
  const modal = document.getElementById('modal-feature-editor');
  if (modal) modal.style.display = 'none';
}
window.closeFeatureModal = closeFeatureModal;

function applyChecklistTemplate(type) {
  const templates = {
    feature: [
      { item: 'Levantamento de requisitos e prototipagem visual', feito: true },
      { item: 'Desenvolvimento da interface responsiva e componentes UI', feito: false },
      { item: 'Implementação das regras de negócio e integração de dados', feito: false },
      { item: 'Testes cross-device (Mobile, Tablet, Desktop) e homologação', feito: false },
      { item: 'Deploy em produção e validação com o cliente', feito: false }
    ],
    refactor: [
      { item: 'Diagnóstico de desempenho e arquitetura de código', feito: true },
      { item: 'Refatoração modular e eliminação de redundâncias', feito: false },
      { item: 'Testes de regressão e garantia de estabilidade', feito: false },
      { item: 'Atualização da documentação técnica', feito: false }
    ],
    bugfix: [
      { item: 'Mapeamento e reprodução do cenário de falha', feito: true },
      { item: 'Correção cirúrgica na camada afetada', feito: false },
      { item: 'Validação em múltiplos navegadores e resoluções', feito: false },
      { item: 'Deploy de correção e validação de logs', feito: false }
    ],
    integration: [
      { item: 'Modelagem de dados e endpoints no Google Apps Script', feito: true },
      { item: 'Implementação de envio assíncrono não-bloqueante', feito: false },
      { item: 'Testes de concorrência e integridade na planilha', feito: false },
      { item: 'Validação de logs de auditoria e contingência offline', feito: false }
    ]
  };

  const selected = templates[type] || templates.feature;
  const container = document.getElementById('checklist-rows-container');
  container.innerHTML = '';
  selected.forEach(chk => {
    addChecklistRow(chk.item, chk.feito);
  });
  recalculateModalProgress();
  showAdminToast('⚡ Template de etapas aplicado!');
}
window.applyChecklistTemplate = applyChecklistTemplate;

function addChecklistRow(itemText = '', isDone = false) {
  const container = document.getElementById('checklist-rows-container');
  if (!container) return;

  // Remove placeholder se existir
  const placeholder = container.querySelector('.chk-empty-placeholder');
  if (placeholder) placeholder.remove();

  const row = document.createElement('div');
  row.className = 'admin-chk-row' + (isDone ? ' row-done' : '');
  row.draggable = true;
  row.innerHTML = `
    <span class="chk-drag-handle" title="Arraste para reordenar esta etapa">⋮⋮</span>
    <span class="chk-step-num">1</span>
    <input type="checkbox" class="chk-row-done" ${isDone ? 'checked' : ''} onchange="handleRowCheckChange(this)" title="Marcar/Desmarcar como concluída">
    <input type="text" class="chk-row-text" value="${escapeHtml(itemText)}" placeholder="Descreva a etapa da entrega..." required>
    <div class="chk-row-actions">
      <button type="button" class="btn-chk-move" onclick="moveChecklistRow(this, -1)" title="Mover para cima">▲</button>
      <button type="button" class="btn-chk-move" onclick="moveChecklistRow(this, 1)" title="Mover para baixo">▼</button>
      <button type="button" class="btn-chk-remove" onclick="removeChecklistRow(this)" title="Excluir etapa">✕</button>
    </div>
  `;

  // Eventos de Drag & Drop para a linha do checklist
  row.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '');
    row.classList.add('is-dragging-row');
  });
  row.addEventListener('dragend', () => {
    row.classList.remove('is-dragging-row');
    renumberChecklistRows();
    recalculateModalProgress();
  });
  row.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingRow = container.querySelector('.is-dragging-row');
    if (draggingRow && draggingRow !== row) {
      const rect = row.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      if (e.clientY < mid) {
        container.insertBefore(draggingRow, row);
      } else {
        container.insertBefore(draggingRow, row.nextSibling);
      }
    }
  });

  container.appendChild(row);
  renumberChecklistRows();
  recalculateModalProgress();
}
window.addChecklistRow = addChecklistRow;

function handleRowCheckChange(chk) {
  const row = chk.closest('.admin-chk-row');
  if (row) {
    row.classList.toggle('row-done', chk.checked);
  }
  recalculateModalProgress();
}
window.handleRowCheckChange = handleRowCheckChange;

function renumberChecklistRows() {
  const container = document.getElementById('checklist-rows-container');
  if (!container) return;
  const rows = container.querySelectorAll('.admin-chk-row');
  rows.forEach((r, idx) => {
    const num = r.querySelector('.chk-step-num');
    if (num) num.textContent = idx + 1;
  });
}
window.renumberChecklistRows = renumberChecklistRows;

function removeChecklistRow(btn) {
  const row = btn.closest('.admin-chk-row');
  if (row) {
    row.remove();
    renumberChecklistRows();
    recalculateModalProgress();
  }
}
window.removeChecklistRow = removeChecklistRow;

function moveChecklistRow(btn, direction) {
  const row = btn.closest('.admin-chk-row');
  if (!row) return;
  const container = document.getElementById('checklist-rows-container');

  if (direction === -1 && row.previousElementSibling && row.previousElementSibling.classList.contains('admin-chk-row')) {
    container.insertBefore(row, row.previousElementSibling);
  } else if (direction === 1 && row.nextElementSibling) {
    container.insertBefore(row.nextElementSibling, row);
  }
  renumberChecklistRows();
  recalculateModalProgress();
}
window.moveChecklistRow = moveChecklistRow;

function recalculateModalProgress() {
  const container = document.getElementById('checklist-rows-container');
  if (!container) return;
  const rows = container.querySelectorAll('.admin-chk-row');

  if (rows.length === 0) {
    if (!container.querySelector('.chk-empty-placeholder')) {
      container.innerHTML = '<div class="chk-empty-placeholder">📋 Nenhuma etapa cadastrada. Clique em "➕ Adicionar Etapa" para adicionar.</div>';
    }
    const progSlider = document.getElementById('feat-prog');
    if (progSlider) {
      progSlider.value = 0;
      updateProgressDisplay(0);
    }
    updateChecklistSummaryBar(0, 0, 0);
    return;
  }

  let doneCount = 0;
  rows.forEach(r => {
    const chk = r.querySelector('.chk-row-done');
    if (chk && chk.checked) {
      doneCount++;
      r.classList.add('row-done');
    } else {
      r.classList.remove('row-done');
    }
  });

  const total = rows.length;
  const pct = Math.round((doneCount / total) * 100);
  const progSlider = document.getElementById('feat-prog');
  if (progSlider) {
    progSlider.value = pct;
    updateProgressDisplay(pct);
  }

  updateChecklistSummaryBar(doneCount, total, pct);

  // Sincroniza status se atingir 100%
  const statusSelect = document.getElementById('feat-status');
  if (statusSelect) {
    if (pct === 100) statusSelect.value = 'Concluído';
    else if (pct > 0 && statusSelect.value === 'Planejado') statusSelect.value = 'Em Desenvolvimento';
  }
}
window.recalculateModalProgress = recalculateModalProgress;

function updateChecklistSummaryBar(done, total, pct) {
  let summaryBar = document.getElementById('checklist-summary-bar');
  const container = document.getElementById('checklist-rows-container');
  if (!container) return;

  if (!summaryBar) {
    summaryBar = document.createElement('div');
    summaryBar.id = 'checklist-summary-bar';
    summaryBar.className = 'checklist-summary-bar';
    container.parentNode.insertBefore(summaryBar, container);
  }

  summaryBar.innerHTML = `
    <div class="chk-summary-left">
      <span>📋 Progresso das Etapas:</span>
      <span class="chk-summary-pill">${done} de ${total} concluídas</span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <span style="font-size:0.75rem; color:var(--text-3);">Maturidade:</span>
      <strong style="color:var(--brand-light); font-size:0.85rem;">${pct}%</strong>
    </div>
  `;
}

function updateProgressDisplay(val) {
  const lbl = document.getElementById('feat-prog-val');
  if (lbl) lbl.textContent = val + '%';
}
window.updateProgressDisplay = updateProgressDisplay;

function syncProgressWithStatus(status) {
  const progSlider = document.getElementById('feat-prog');
  if (!progSlider) return;

  if (status === 'Concluído') {
    progSlider.value = 100;
    updateProgressDisplay(100);
    // Marca todos os itens do checklist
    const chks = document.querySelectorAll('#checklist-rows-container .chk-row-done');
    chks.forEach(c => c.checked = true);
  } else if (status === 'Planejado' && progSlider.value == 100) {
    progSlider.value = 0;
    updateProgressDisplay(0);
  }
}
window.syncProgressWithStatus = syncProgressWithStatus;

function handleSaveFeature(event) {
  event.preventDefault();
  const data = getActiveData();
  const editId = document.getElementById('edit-feature-id').value;

  // Extrai etapas do checklist
  const chkRows = document.querySelectorAll('#checklist-rows-container .admin-chk-row');
  const checklist = [];
  chkRows.forEach(row => {
    const textInput = row.querySelector('.chk-row-text');
    const doneInput = row.querySelector('.chk-row-done');
    if (textInput && textInput.value.trim()) {
      checklist.push({
        item: textInput.value.trim(),
        feito: doneInput ? doneInput.checked : false
      });
    }
  });

  // Extrai tags
  const tagsRaw = document.getElementById('feat-tags').value;
  const tags = tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(t => t.length > 0);

  const prog = parseInt(document.getElementById('feat-prog').value, 10) || 0;
  const status = document.getElementById('feat-status').value;
  const dateCreated = document.getElementById('feat-date-created').value;
  const dateDelivered = document.getElementById('feat-date-delivered').value;

  const featureObj = {
    id: editId || 'feat-' + Date.now().toString(36),
    titulo: document.getElementById('feat-title').value.trim(),
    categoria: document.getElementById('feat-cat').value.trim(),
    status: status,
    prioridade: document.getElementById('feat-priority').value,
    previsao: document.getElementById('feat-eta').value.trim() || (status === 'Concluído' ? 'Entregue' : 'Em breve'),
    dataCriacao: dateCreated || new Date().toISOString().split('T')[0],
    dataEntrega: status === 'Concluído' ? (dateDelivered || new Date().toISOString().split('T')[0]) : (dateDelivered || undefined),
    descricao: document.getElementById('feat-desc').value.trim(),
    progresso: prog,
    tags: tags,
    checklist: checklist,
    dataAtualizacao: new Date().toISOString()
  };

  if (!data.features) data.features = [];

  if (editId) {
    const idx = data.features.findIndex(f => f.id === editId);
    if (idx !== -1) {
      data.features[idx] = featureObj;
    } else {
      data.features.unshift(featureObj);
    }
  } else {
    data.features.unshift(featureObj);
  }

  saveActiveData(data);
  closeFeatureModal();
}
window.handleSaveFeature = handleSaveFeature;

function deleteFeature(id) {
  if (!confirm('Deseja realmente excluir esta funcionalidade? Ela será removida da visualização e sincronizada.')) return;
  const data = getActiveData();
  data.features = (data.features || []).filter(f => f.id !== id);
  if (!data.deletedIds) data.deletedIds = [];
  data.deletedIds.push(id);

  saveActiveData(data);
  showAdminToast('🗑️ Funcionalidade excluída com sucesso!');
}
window.deleteFeature = deleteFeature;

// Ações Rápidas Diretas nos Cards (Kanban / Grade)
function quickUpdateFeatureStatus(id, newStatus) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === id);
  if (!feat) return;

  feat.status = newStatus;
  if (newStatus === 'Concluído') {
    feat.progresso = 100;
    if (feat.checklist) feat.checklist.forEach(c => c.feito = true);
    if (!feat.dataEntrega) feat.dataEntrega = new Date().toISOString().split('T')[0];
  } else if (newStatus === 'Planejado') {
    if (feat.progresso === 100) feat.progresso = 0;
  }
  feat.dataAtualizacao = new Date().toISOString();

  saveActiveData(data);
}
window.quickUpdateFeatureStatus = quickUpdateFeatureStatus;

function quickUpdateFeaturePriority(id, newPriority) {
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === id);
  if (!feat) return;

  feat.prioridade = newPriority;
  feat.dataAtualizacao = new Date().toISOString();
  saveActiveData(data);
}
window.quickUpdateFeaturePriority = quickUpdateFeaturePriority;

function toggleChecklistItemDirect(featId, itemIndex) {
  if (!isAdminAuthenticated()) return;
  const data = getActiveData();
  const feat = (data.features || []).find(f => f.id === featId);
  if (!feat || !feat.checklist || !feat.checklist[itemIndex]) return;

  feat.checklist[itemIndex].feito = !feat.checklist[itemIndex].feito;
  
  // Recalcula progresso automaticamente
  const total = feat.checklist.length;
  const done = feat.checklist.filter(c => c.feito).length;
  feat.progresso = Math.round((done / total) * 100);
  if (feat.progresso === 100) feat.status = 'Concluído';
  else if (feat.progresso > 0 && feat.status === 'Planejado') feat.status = 'Em Desenvolvimento';

  feat.dataAtualizacao = new Date().toISOString();
  saveActiveData(data);
}
window.toggleChecklistItemDirect = toggleChecklistItemDirect;

// ── 6. Lançamentos do Changelog ──────────────────────────────────────
function openCreateChangelogModal() {
  const modal = document.getElementById('modal-changelog-editor');
  const form = document.getElementById('form-changelog-editor');
  const title = document.getElementById('changelog-modal-title');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('edit-changelog-index').value = '-1';
  if (title) title.textContent = '🚀 Novo Lançamento (Changelog)';

  document.getElementById('log-date').value = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  document.getElementById('changelog-items-container').innerHTML = '';
  addChangelogItemRow('novo', '');
  modal.style.display = 'flex';
}
window.openCreateChangelogModal = openCreateChangelogModal;

function openEditChangelogModal(index) {
  const data = getActiveData();
  const log = (data.changelog || [])[index];
  if (!log) return;

  const modal = document.getElementById('modal-changelog-editor');
  const title = document.getElementById('changelog-modal-title');
  if (!modal) return;

  document.getElementById('edit-changelog-index').value = index;
  if (title) title.textContent = '✏️ Editar Lançamento: ' + log.versao;

  document.getElementById('log-version').value = log.versao || '';
  document.getElementById('log-date').value = log.data || '';
  document.getElementById('log-title').value = log.titulo || '';
  document.getElementById('log-summary').value = log.resumo || '';

  const container = document.getElementById('changelog-items-container');
  container.innerHTML = '';
  if (log.itens && log.itens.length > 0) {
    log.itens.forEach(item => addChangelogItemRow(item.tipo, item.texto));
  } else {
    addChangelogItemRow('novo', '');
  }

  modal.style.display = 'flex';
}
window.openEditChangelogModal = openEditChangelogModal;

function closeChangelogModal() {
  const modal = document.getElementById('modal-changelog-editor');
  if (modal) modal.style.display = 'none';
}
window.closeChangelogModal = closeChangelogModal;

function addChangelogItemRow(type = 'novo', text = '') {
  const container = document.getElementById('changelog-items-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'admin-chk-row';
  row.innerHTML = `
    <select class="admin-form-select log-item-type" style="width:130px;">
      <option value="novo" ${type === 'novo' ? 'selected' : ''}>✨ Novo</option>
      <option value="melhoria" ${type === 'melhoria' ? 'selected' : ''}>⚡ Melhoria</option>
      <option value="performance" ${type === 'performance' ? 'selected' : ''}>🚀 Performance</option>
      <option value="seguranca" ${type === 'seguranca' ? 'selected' : ''}>🛡️ Segurança</option>
      <option value="correcao" ${type === 'correcao' ? 'selected' : ''}>🐛 Correção</option>
    </select>
    <input type="text" class="admin-form-input log-item-text" value="${escapeHtml(text)}" placeholder="Descreva a alteração entregue..." required>
    <button type="button" class="btn-chk-remove" onclick="this.closest('.admin-chk-row').remove()">✕</button>
  `;
  container.appendChild(row);
}
window.addChangelogItemRow = addChangelogItemRow;

function handleSaveChangelog(event) {
  event.preventDefault();
  const data = getActiveData();
  const editIndex = parseInt(document.getElementById('edit-changelog-index').value, 10);

  const itemRows = document.querySelectorAll('#changelog-items-container .admin-chk-row');
  const itens = [];
  itemRows.forEach(row => {
    const t = row.querySelector('.log-item-type')?.value;
    const txt = row.querySelector('.log-item-text')?.value;
    if (txt && txt.trim()) {
      itens.push({ tipo: t, texto: txt.trim() });
    }
  });

  const logObj = {
    versao: document.getElementById('log-version').value.trim(),
    data: document.getElementById('log-date').value.trim(),
    titulo: document.getElementById('log-title').value.trim(),
    resumo: document.getElementById('log-summary').value.trim(),
    itens: itens
  };

  if (!data.changelog) data.changelog = [];

  if (editIndex >= 0 && editIndex < data.changelog.length) {
    data.changelog[editIndex] = logObj;
  } else {
    data.changelog.unshift(logObj);
  }

  saveActiveData(data);
  closeChangelogModal();
}
window.handleSaveChangelog = handleSaveChangelog;

function deleteChangelog(index) {
  if (!confirm('Deseja excluir este lançamento do histórico?')) return;
  const data = getActiveData();
  if (data.changelog && data.changelog[index]) {
    data.changelog.splice(index, 1);
    saveActiveData(data);
  }
}
window.deleteChangelog = deleteChangelog;

// ── 7. Módulos & Maturidade ──────────────────────────────────────────
function openModulesManagerModal() {
  const data = getActiveData();
  const modal = document.getElementById('modal-modules-manager');
  const list = document.getElementById('modules-edit-list');
  if (!modal || !list) return;

  list.innerHTML = (data.modulos || []).map((mod, i) => `
    <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="font-size:0.88rem;">${mod.icone} ${mod.nome}</strong>
        <span id="mod-val-${i}" style="color:var(--brand-light); font-weight:800; font-size:0.85rem;">${mod.maturidade}%</span>
      </div>
      <input type="range" class="admin-form-range" min="0" max="100" value="${mod.maturidade}" 
             data-index="${i}" oninput="document.getElementById('mod-val-${i}').textContent = this.value + '%'">
    </div>
  `).join('');

  modal.style.display = 'flex';
}
window.openModulesManagerModal = openModulesManagerModal;

function closeModulesModal() {
  const modal = document.getElementById('modal-modules-manager');
  if (modal) modal.style.display = 'none';
}
window.closeModulesModal = closeModulesModal;

function handleSaveModules(event) {
  event.preventDefault();
  const data = getActiveData();
  const sliders = document.querySelectorAll('#modules-edit-list input[type="range"]');

  sliders.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-index'), 10);
    if (data.modulos && data.modulos[idx]) {
      const val = parseInt(slider.value, 10);
      data.modulos[idx].maturidade = val;
      if (val === 100) data.modulos[idx].status = 'Operacional';
      else if (val >= 50) data.modulos[idx].status = 'Em Homologação';
      else data.modulos[idx].status = 'Em Desenvolvimento';
    }
  });

  saveActiveData(data);
  closeModulesModal();
}
window.handleSaveModules = handleSaveModules;

// ── 8. Emissor de Relatório Executivo Oficial em PDF ─────────────────
function generateExecutivePdfReport() {
  const data = getActiveData();
  if (!data) return;

  let printArea = document.getElementById('executive-pdf-print-area');
  if (!printArea) {
    printArea = document.createElement('div');
    printArea.id = 'executive-pdf-print-area';
    document.body.appendChild(printArea);
  }

  const features = data.features || [];
  const concluidas = features.filter(f => f.status === 'Concluído' || f.progresso === 100);
  const emAndamento = features.filter(f => f.status === 'Em Desenvolvimento');
  const emTestes = features.filter(f => f.status === 'Em Testes');
  const planejadas = features.filter(f => f.status === 'Planejado');

  const somaProg = features.reduce((a, b) => a + (b.progresso || 0), 0);
  const mediaProg = features.length > 0 ? Math.round(somaProg / features.length) : 0;
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  printArea.innerHTML = `
    <div class="pdf-report-header">
      <div>
        <h1 class="pdf-brand-title">🌿 JCV QUÍMICA / RAWELL</h1>
        <div style="font-size:0.9rem; font-weight:700; color:#334155; margin-top:2px;">
          Relatório Executivo de Implementações &amp; Roadmap Tecnológico
        </div>
      </div>
      <div class="pdf-meta-box">
        <div><strong>Cliente:</strong> ${data.projeto.cliente}</div>
        <div><strong>Versão:</strong> ${data.projeto.versaoAtual}</div>
        <div><strong>Emissão:</strong> ${dataHoje}</div>
      </div>
    </div>

    <div class="pdf-stats-row">
      <div class="pdf-stat-col">
        <div class="pdf-stat-val">${mediaProg}%</div>
        <div class="pdf-stat-name">Progresso Geral</div>
      </div>
      <div class="pdf-stat-col">
        <div class="pdf-stat-val" style="color:#15803d;">${concluidas.length}</div>
        <div class="pdf-stat-name">Entregues / Concluídas</div>
      </div>
      <div class="pdf-stat-col">
        <div class="pdf-stat-val" style="color:#b45309;">${emAndamento.length}</div>
        <div class="pdf-stat-name">Em Desenvolvimento</div>
      </div>
      <div class="pdf-stat-col">
        <div class="pdf-stat-val" style="color:#1d4ed8;">${emTestes.length}</div>
        <div class="pdf-stat-name">Em Testes</div>
      </div>
      <div class="pdf-stat-col">
        <div class="pdf-stat-val" style="color:#6d28d9;">${planejadas.length}</div>
        <div class="pdf-stat-name">Planejadas</div>
      </div>
    </div>

    <div class="pdf-section-title">📊 Matriz de Maturidade dos Módulos Estruturais</div>
    <table class="pdf-table">
      <thead>
        <tr>
          <th>Módulo</th>
          <th>Maturidade (%)</th>
          <th>Status Operacional</th>
        </tr>
      </thead>
      <tbody>
        ${(data.modulos || []).map(m => `
          <tr>
            <td><strong>${m.icone} ${m.nome}</strong></td>
            <td><strong>${m.maturidade}%</strong></td>
            <td>${m.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="pdf-section-title">🚀 Detalhamento das Funcionalidades &amp; Entregas</div>
    <table class="pdf-table">
      <thead>
        <tr>
          <th style="width:35%;">Funcionalidade</th>
          <th style="width:20%;">Categoria</th>
          <th style="width:15%;">Status</th>
          <th style="width:12%;">Progresso</th>
          <th style="width:18%;">Previsão / Entrega</th>
        </tr>
      </thead>
      <tbody>
        ${features.map(f => {
          let tagClass = 'pdf-tag-plan';
          if (f.status === 'Concluído') tagClass = 'pdf-tag-done';
          else if (f.status === 'Em Desenvolvimento') tagClass = 'pdf-tag-dev';
          else if (f.status === 'Em Testes') tagClass = 'pdf-tag-test';

          return `
            <tr>
              <td><strong>${f.titulo}</strong></td>
              <td>${f.categoria}</td>
              <td><span class="${tagClass}">${f.status}</span></td>
              <td><strong>${f.progresso}%</strong></td>
              <td>${f.previsao || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="pdf-signature-block">
      <div class="pdf-sig-line">
        <strong>Engenharia de Software</strong><br>
        Equipe de Desenvolvimento
      </div>
      <div class="pdf-sig-line">
        <strong>Aprovação da Diretoria</strong><br>
        JCV Química / Valdecir
      </div>
    </div>
  `;

  window.print();
}
window.generateExecutivePdfReport = generateExecutivePdfReport;

// ── 9. Utilitários de Toast e Exportação ──────────────────────────────
function exportRoadmapDataFile() {
  const data = getActiveData();
  const fileContent = '// Base de Dados Oficial Exportada\nconst ROADMAP2_DATA = ' + JSON.stringify(data, null, 2) + ';\nif(typeof window !== "undefined") { window.ROADMAP2_DATA = ROADMAP2_DATA; window.ROADMAP_DATA = ROADMAP2_DATA; }\n';
  const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'roadmap2-data.js';
  a.click();
  showAdminToast('📥 Arquivo roadmap2-data.js baixado!');
}
window.exportRoadmapDataFile = exportRoadmapDataFile;

function showAdminToast(msg, isError = false) {
  let toast = document.getElementById('admin-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.style.background = isError ? '#ef4444' : '#0f4531';
  toast.style.color = '#ffffff';
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}
window.showAdminToast = showAdminToast;

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
