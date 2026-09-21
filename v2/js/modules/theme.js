// ═══════════════════════════════════════════════════════════════
//  TEMA DARK / LIGHT
// ═══════════════════════════════════════════════════════════════
function initTheme() {
  const saved = localStorage.getItem('rawell_theme') || 'auto';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('rawell_theme', theme);
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  hapticFeedback(20);
  const current = document.documentElement.getAttribute('data-theme') || 'auto';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(next === 'dark' ? '🌙 Modo Escuro ativado' : '☀️ Modo Claro ativado');
}