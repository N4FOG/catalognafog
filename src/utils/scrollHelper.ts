/**
 * Rola a página suavemente até a seção de produtos/resultados,
 * compensando o cabeçalho fixo ou dando espaço visual ideal.
 */
export function scrollToProducts(offset: number = 20): void {
  if (typeof window === 'undefined') return;

  // Timeout para aguardar o fechamento do teclado virtual no mobile
  setTimeout(() => {
    const el = document.getElementById('products-section') || document.querySelector('main');
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = scrollTop + rect.top - offset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }
  }, 100);
}
