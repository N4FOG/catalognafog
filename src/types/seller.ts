import type { CartItem, CartTotals } from './cart';

export type QuoteStatus = 'aguardando' | 'negociando' | 'fechado' | 'perdido';

export interface Seller {
  id: string;
  nome: string;
  whatsapp: string;
  pin?: string;
}

export interface SellerSession {
  logged: boolean;
  vendedorNome: string;
  vendedorId: string;
  loginTime: string;
}

export interface QuoteHistoryItem extends Partial<CartTotals> {
  id: string; // e.g. "RQ-2026-4892"
  data: string; // "05/09/2026 às 14:30"
  timestamp: number;
  cliente: string;
  doc: string;
  vendedorId: string;
  vendedorNome: string;
  itens: CartItem[];
  totalQtd: number;
  valorTotal: string; // "R$ 1.250,00"
  status: QuoteStatus;
  pagamento?: string;
  validade?: string;
  shareUrl?: string;
}
