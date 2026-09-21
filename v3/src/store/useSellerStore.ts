import { create } from 'zustand';
import type { QuoteHistoryItem, QuoteStatus, SellerSession } from '../types/seller';
import { VENDEDORES } from '../data/config';

interface SellerState {
  session: SellerSession | null;
  attributedSellerId: string | null;
  quoteHistory: QuoteHistoryItem[];
  isSellerLoggedIn: boolean;
  login: (vendedorNome: string, vendedorId: string) => void;
  logout: () => void;
  setAttributedSeller: (vendedorId: string) => void;
  saveQuoteToHistory: (quote: QuoteHistoryItem) => void;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  deleteQuoteFromHistory: (quoteId: string) => void;
  getActiveSeller: () => { id: string; nome: string; whatsapp: string };
}

const SELLER_STORAGE_KEY = 'rawell_seller_session_auth_v3';
const CLIENT_SELLER_STORAGE_KEY = 'rawell_client_attributed_seller_v3';
const QUOTE_HISTORY_KEY = 'rawell_quote_history_v3';

function loadSession(): SellerSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SELLER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadHistory(): QuoteHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUOTE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadAttributedSeller(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(CLIENT_SELLER_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export const useSellerStore = create<SellerState>((set, get) => ({
  session: loadSession(),
  attributedSellerId: loadAttributedSeller(),
  quoteHistory: loadHistory(),
  isSellerLoggedIn: !!(loadSession()?.logged),

  login: (vendedorNome, vendedorId) => {
    const sessionData: SellerSession = {
      logged: true,
      vendedorNome,
      vendedorId,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify(sessionData));
    set({ session: sessionData, isSellerLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem(SELLER_STORAGE_KEY);
    set({ session: null, isSellerLoggedIn: false });
  },

  setAttributedSeller: (vendedorId) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(CLIENT_SELLER_STORAGE_KEY, vendedorId);
    }
    set({ attributedSellerId: vendedorId });
  },

  saveQuoteToHistory: (quote) => {
    const history = get().quoteHistory.filter((q) => q.id !== quote.id);
    const updated = [quote, ...history].slice(0, 50);
    localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(updated));
    set({ quoteHistory: updated });
  },

  updateQuoteStatus: (quoteId, status) => {
    const updated = get().quoteHistory.map((q) =>
      q.id === quoteId ? { ...q, status } : q
    );
    localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(updated));
    set({ quoteHistory: updated });
  },

  deleteQuoteFromHistory: (quoteId) => {
    const updated = get().quoteHistory.filter((q) => q.id !== quoteId);
    localStorage.setItem(QUOTE_HISTORY_KEY, JSON.stringify(updated));
    set({ quoteHistory: updated });
  },

  getActiveSeller: () => {
    const { session, attributedSellerId } = get();
    if (session && session.logged) {
      const found = VENDEDORES.find((v) => v.id === session.vendedorId);
      return {
        id: session.vendedorId,
        nome: session.vendedorNome,
        whatsapp: found?.whatsapp || '554599781407'
      };
    }
    if (attributedSellerId) {
      const found = VENDEDORES.find((v) => v.id === attributedSellerId);
      if (found) return found;
    }
    return VENDEDORES[0];
  }
}));
