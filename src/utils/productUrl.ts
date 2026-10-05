import type { Product } from '../types/product';

/**
 * Converte o nome de um produto em um slug amigável para URL.
 * Remove acentos, parênteses de volume (ex: 60ml) e caracteres especiais.
 * Exemplo: "Kapina Plus (60ml)" -> "kapina-plus"
 */
export function slugifyProductName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\(.*?\)/g, '')         // remove conteúdo entre parênteses como (60ml)
    .replace(/[^a-z0-9]+/g, '-')     // substitui símbolos/espaços por hífen
    .replace(/^-+|-+$/g, '')         // remove hífens das pontas
    .trim();
}

/**
 * Converte o nome mantendo o volume para compatibilidade total.
 * Exemplo: "Kapina Plus (60ml)" -> "kapina-plus-60ml"
 */
export function slugifyFull(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

/**
 * Busca um produto por slug amigável, código de referência ou ID numérico.
 * Tolerante a variações digitadas pelo usuário no WhatsApp ou URL.
 */
export function findProductBySlug(param: string, products: Product[]): Product | null {
  if (!param || !products || products.length === 0) return null;

  const rawClean = param.trim();
  const clean = slugifyProductName(rawClean);

  if (!clean && !rawClean) return null;

  // 1. Match exato pelo slug limpo (ex: "kapina-plus")
  let found = products.find((p) => slugifyProductName(p.nome) === clean);
  if (found) return found;

  // 2. Match exato pelo slug completo com volume (ex: "kapina-plus-60ml")
  const fullClean = slugifyFull(rawClean);
  found = products.find((p) => slugifyFull(p.nome) === fullClean || slugifyFull(p.nome) === clean);
  if (found) return found;

  // 3. Match pelo código de referência (ex: "KP-PLUS-60")
  found = products.find(
    (p) =>
      p.referencia?.toLowerCase() === rawClean.toLowerCase() ||
      slugifyProductName(p.referencia) === clean
  );
  if (found) return found;

  // 4. Match por ID numérico (ex: ?produto=1 ou ?p=1)
  const numId = parseInt(rawClean, 10);
  if (!isNaN(numId)) {
    found = products.find((p) => p.id === numId);
    if (found) return found;
  }

  // 5. Match por prefixo/início de nome (ex: "kapina" acha "Kapina Plus")
  if (clean.length >= 3) {
    found = products.find((p) => {
      const pSlug = slugifyProductName(p.nome);
      return pSlug.startsWith(clean) || clean.startsWith(pSlug);
    });
    if (found) return found;

    // 6. Match por contenção da palavra-chave
    found = products.find((p) => {
      const pSlug = slugifyProductName(p.nome);
      return pSlug.includes(clean);
    });
    if (found) return found;
  }

  return null;
}

/**
 * Gera a URL canônica direta para um produto no catálogo.
 * Exemplo: "https://catalognafog.onrender.com/p/kapina-plus"
 */
export function getProductUrl(product: Product): string {
  const slug = slugifyProductName(product.nome);
  let origin = 'https://catalognafog.onrender.com';

  if (typeof window !== 'undefined' && window.location.origin) {
    origin = window.location.origin.replace(/\/+$/, '');
  }

  return `${origin}/p/${encodeURIComponent(slug)}`;
}

/**
 * Gera apenas o texto de descrição do produto sem o link (para uso no navigator.share).
 */
export function getProductShareDescription(product: Product): string {
  const resumo = product.o_que_faz || product.descricao || '';
  return `🌿 ${product.nome}\n${resumo}`.trim();
}

/**
 * Gera o texto direto e limpo com o link para cópia completa na área de transferência.
 */
export function getProductShareText(product: Product): string {
  const desc = getProductShareDescription(product);
  const url = getProductUrl(product);
  return `${desc}\n${url}`.trim();
}
