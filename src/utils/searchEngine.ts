import MiniSearch from 'minisearch';
import { PRODUTOS } from '../data/products';
import type { Product } from '../types/product';
import { normalizeText } from './formatters';

interface IndexedProductDoc {
  id: number;
  nome: string;
  referencia: string;
  categoria: string;
  tipo_formulacao: string;
  o_que_faz: string;
  para_que_serve: string;
  como_age: string;
  alvos: string;
  descricao: string;
  product: Product;
}

const documents: IndexedProductDoc[] = PRODUTOS.map((p) => ({
  id: p.id,
  nome: p.nome,
  referencia: p.referencia,
  categoria: p.categoria,
  tipo_formulacao: p.tipo_formulacao,
  o_que_faz: p.o_que_faz || '',
  para_que_serve: p.para_que_serve || '',
  como_age: p.como_age || '',
  alvos: (p.alvos || []).join(' '),
  descricao: p.descricao || '',
  product: p
}));

const miniSearch = new MiniSearch<IndexedProductDoc>({
  fields: ['nome', 'referencia', 'alvos', 'o_que_faz', 'para_que_serve', 'como_age', 'descricao', 'categoria'],
  storeFields: ['id', 'product'],
  searchOptions: {
    boost: {
      nome: 3,
      alvos: 2.5,
      referencia: 2,
      o_que_faz: 1.5,
      para_que_serve: 1.2,
      descricao: 1
    },
    fuzzy: (term) => (term.length > 3 ? 0.25 : false),
    prefix: true
  },
  tokenize: (text) => normalizeText(text).split(/\s+/).filter(Boolean),
  processTerm: (term) => normalizeText(term)
});

// Index all products
miniSearch.addAll(documents);

/**
 * Searches products using fuzzy full-text indexing with typo tolerance
 */
export function searchProducts(query: string, category = 'todos', formulation = 'todos'): Product[] {
  const normQuery = normalizeText(query).trim();

  let matchedProducts: Product[];

  if (!normQuery) {
    matchedProducts = PRODUTOS;
  } else {
    const results = miniSearch.search(normQuery);

    if (results.length > 0) {
      matchedProducts = results.map((r) => r.product);
    } else {
      // Fallback: substring matching
      matchedProducts = PRODUTOS.filter((p) => {
        const matchName = normalizeText(p.nome).includes(normQuery);
        const matchRef = normalizeText(p.referencia).includes(normQuery);
        const matchDesc = normalizeText(p.descricao).includes(normQuery);
        const matchAction = normalizeText(p.o_que_faz).includes(normQuery);
        const matchAlvos = (p.alvos || []).some((alvo) => normalizeText(alvo).includes(normQuery));
        return matchName || matchRef || matchDesc || matchAction || matchAlvos;
      });
    }
  }

  // Apply Category and Formulation filters
  return matchedProducts.filter((p) => {
    if (category !== 'todos' && p.categoria !== category) return false;
    if (formulation !== 'todos' && p.tipo_formulacao !== formulation) return false;
    return true;
  });
}
