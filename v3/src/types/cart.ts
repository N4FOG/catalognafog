export interface CartItem {
  id: number;
  nome: string;
  referencia: string;
  unidade: string;
  imagem: string;
  quantidade: number;
  preco_base: number;
  preco_unitario: number;
  desconto_percent: number;
  packTag?: string;
}

export interface ClientInfo {
  nome: string;
  doc: string; // CPF, CNPJ or City
  telefone: string;
  vendedor?: string;
  pagamento?: string;
  validade?: string;
}


export interface CartTotals {
  subtotalItensSemDesconto: number;
  subtotalItensComDesconto: number;
  descontoTotalItens: number;
  baseItensSemDesconto: number;
  qtdTiposSemDesconto: number;
  discGlobalPercent: number;
  valorDescontoGlobal: number;
  totalFinalLiquido: number;
  economiaTotalReal: number;
  percentualEconomiaTotal: number;
  totalQtd: number;
}
