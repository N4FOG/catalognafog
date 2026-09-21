export interface ProductSecurity {
  pets: string;
  chuva: string;
  horario: string;
  epi: string;
}

export interface Product {
  id: number;
  nome: string;
  categoria: string;
  tipo_formulacao: string;
  o_que_faz: string;
  para_que_serve: string;
  como_age: string;
  como_usar: string;
  onde_nao_usar: string;
  seguranca: ProductSecurity;
  alvos: string[];
  descricao: string;
  caracteristicas: string[];
  imagens: string[];
  unidade: string;
  referencia: string;
  rendimento: string;
  destaque?: boolean;
  preco_base: number;
}

export interface Category {
  id: string;
  nome: string;
  icone: string;
}

export interface Formulation {
  id: string;
  nome: string;
  icone: string;
}
