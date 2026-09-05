export interface TelemetryPayload {
  evento?: string;
  origem_canal?: string;
  vendedor?: string;
  vendedor_nome?: string;
  num_proposta?: string;
  cliente_nome?: string;
  cliente_doc?: string;
  total_itens?: number;
  valor_total?: string;
  resumo_itens?: string;
  link_proposta?: string;
  url_acessada?: string;
  detalhes_extras?: string;
  user_agent?: string;
  timestamp?: string;
}
