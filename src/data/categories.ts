import type { Category, Formulation } from '../types/product';

export const CATEGORIAS: Category[] = [
  { id: 'todos', nome: 'Todos os Produtos', icone: '🌿' },
  { id: 'gramados', nome: 'Gramados & Seletivos', icone: '🌱' },
  { id: 'nao-seletivos', nome: 'Não Seletivos (Capina)', icone: '🌾' },
  { id: 'fungicidas', nome: 'Fungicidas & Flores', icone: '🌸' },
  { id: 'inseticidas', nome: 'Inseticidas & Pragas', icone: '🪳' },
  { id: 'mosquicidas', nome: 'Controle de Moscas', icone: '🪰' },
  { id: 'formicidas-baratas', nome: 'Formigas & Baratas', icone: '🐜' },
  { id: 'raticidas', nome: 'Raticidas & Roedores', icone: '🐀' },
  { id: 'lesmicidas', nome: 'Caramujos & Lesmas', icone: '🐌' },
  { id: 'carrapatos-pulgas', nome: 'Carrapatos & Pulgas', icone: '🐕' },
  { id: 'adjuvantes', nome: 'Adjuvantes & pH', icone: '🧪' }
];

export const FORMULACOES: Formulation[] = [
  { id: 'todos', nome: 'Todas as Formas', icone: '⚡' },
  { id: 'concentrado', nome: 'Concentrados', icone: '💧' },
  { id: 'pronto-uso', nome: 'Pronto Uso (Spray)', icone: '🚿' },
  { id: 'gel-isca', nome: 'Géis & Iscas', icone: '🎯' },
  { id: 'po', nome: 'Pós Solúveis', icone: '🧪' },
  { id: 'adjuvante', nome: 'Adjuvantes / Óleo', icone: '🔬' }
];
