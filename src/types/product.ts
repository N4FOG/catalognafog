export interface ProductSecurity {
  pets: string;
  chuva: string;
  horario: string;
  epi: string;
}

export interface ApplicationStep {
  passo: number;
  titulo: string;
  descricao: string;
  dica_do_aplicador?: string;
  alerta?: string;
}

export interface ApplicationTimelineItem {
  periodo: string;
  titulo: string;
  descricao: string;
  icone?: string;
}

export interface ProductApplicationManual {
  resumo_aplicador: string;
  checklist_previo: string[];
  equipamentos: string[];
  dosagem: {
    pequena_area: {
      titulo: string;
      dose: string;
      cobertura: string;
    };
    area_total: {
      titulo: string;
      dose: string;
      cobertura: string;
    };
    instrucao_diluicao: string;
  };
  passos: ApplicationStep[];
  linha_do_tempo: ApplicationTimelineItem[];
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
  manual_aplicacao?: ProductApplicationManual;
  emEstoque?: boolean; // Controle de disponibilidade do produto
  badge_texto?: string; // Texto customizado do badge (ex: "Top Vendas", "Lançamento 2026")
  badge_tipo?: 'top_vendas' | 'lancamento' | 'mais_vendido' | 'natural' | 'rapido' | 'premium' | 'profissional' | 'oferta' | 'custom';
  icones_representativos?: string[]; // Array de emojis representativos (ex: ['🪳', '🐜', '🕷️', '🦂'])
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
