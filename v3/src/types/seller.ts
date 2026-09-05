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
  id: string;
  data: string;
  timestamp: number;
  cliente: string;
  doc: string;
  vendedorId: string;
  vendedorNome: string;
  itens: CartItem[];
  totalQtd: number;
  valorTotal: string;
  status: QuoteStatus;
  shareUrl?: string;
}
