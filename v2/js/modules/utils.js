// ═══════════════════════════════════════════════════════════════
//  ESTADO GLOBAL & UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════
let appState = {
  cat: 'todos',
  form: 'todos',
  sort: 'destaque',
  search: '',
  viewMode: (typeof localStorage !== 'undefined' && localStorage.getItem('jcv_view_mode')) || 'grid',
  gridCols: (typeof localStorage !== 'undefined' && parseInt(localStorage.getItem('jcv_grid_cols'))) || (typeof window !== 'undefined' && window.innerWidth >= 1080 ? 4 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 2)),
  currentSheetProdId: null,
  sheetQty: 1
};

function normText(str) {
  return (str || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

function hapticFeedback(ms = 15) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch (e) {}
  }
}

function highlightSearch(text, term) {
  if (!term) return text;
  const escaped = normText(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function smoothScrollTo(element, offset = 80, duration = 650) {
  if (!element) return;
  const start = window.pageYOffset || document.documentElement.scrollTop;
  const target = Math.max(0, element.getBoundingClientRect().top + start - offset);
  const distance = target - start;
  
  if (Math.abs(distance) < 15) return;

  let startTime = null;
  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Curva de aceleração e desaceleração orgânica (easeInOutCubic)
    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, start + (distance * ease));
    
    if (timeElapsed < duration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

function scrollToTop() {
  const start = window.pageYOffset || document.documentElement.scrollTop;
  if (start <= 0) return;
  hapticFeedback(10);
  smoothScrollTo(document.body, 0, 500);
}

function scrollToProducts() {
  const section = document.getElementById('products-section');
  if (section) {
    const headerHeight = window.innerWidth >= 768 ? 76 : 64;
    smoothScrollTo(section, headerHeight + 14, 650);
  }
}

function scrollToCategories() {
  const sec = document.querySelector('.categories-slider-section');
  if (sec) {
    const headerHeight = window.innerWidth >= 768 ? 76 : 64;
    smoothScrollTo(sec, headerHeight + 10, 600);
  }
}

// ═══════════════════════════════════════════════════════════════
function showToast(msg) {
  const box = document.getElementById('app-toast-box');
  if (!box) return;

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.innerHTML = msg;
  box.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}
