import { create } from 'zustand';
import type { CartItem, CartTotals, ClientInfo } from '../types/cart';
import type { Product } from '../types/product';
import type { QuoteHistoryItem } from '../types/seller';
import { calculateCartTotals } from '../utils/calculations';
import { PRODUTOS } from '../data/products';

interface CartState {
  items: CartItem[];
  globalDiscountPercent: number;
  clientInfo: ClientInfo;
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateUnitPrice: (productId: number, price: number) => void;
  updateItemDiscount: (productId: number, discountPercent: number) => void;
  setGlobalDiscount: (percent: number) => void;
  setClientInfo: (info: Partial<ClientInfo>) => void;
  setIsCartOpen: (open: boolean) => void;
  clearCart: () => void;
  loadSavedQuote: (quote: QuoteHistoryItem) => void;
  getTotals: () => CartTotals;
}

const CART_STORAGE_KEY = 'rawell_cart_v3';
const CART_GLOBAL_DISCOUNT_KEY = 'rawell_cart_global_discount_v3';
const CLIENT_STORAGE_KEY = 'rawell_client_profile_v3';

function loadCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed: CartItem[] = raw ? JSON.parse(raw) : [];
    return parsed.map((item) => {
      const p = PRODUTOS.find((prod) => prod.id === item.id);
      return {
        ...item,
        preco_base: item.preco_base !== undefined ? item.preco_base : (p?.preco_base || 0),
        preco_unitario: item.preco_unitario !== undefined ? item.preco_unitario : (item.preco_base || p?.preco_base || 0),
        desconto_percent: item.desconto_percent || 0
      };
    });
  } catch {
    return [];
  }
}

function loadGlobalDiscount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(CART_GLOBAL_DISCOUNT_KEY);
    return raw ? parseFloat(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function loadClientInfo(): ClientInfo {
  if (typeof window === 'undefined') return { nome: '', doc: '', telefone: '' };
  try {
    const raw = localStorage.getItem(CLIENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { nome: '', doc: '', telefone: '' };
  } catch {
    return { nome: '', doc: '', telefone: '' };
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartItems(),
  globalDiscountPercent: loadGlobalDiscount(),
  clientInfo: loadClientInfo(),
  isCartOpen: false,

  addToCart: (product, quantity = 1) => {
    const current = get().items;
    const existingIndex = current.findIndex((i) => i.id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = current.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantidade: item.quantidade + quantity }
          : item
      );
    } else {
      updated = [
        ...current,
        {
          id: product.id,
          nome: product.nome,
          referencia: product.referencia,
          unidade: product.unidade,
          imagem: product.imagens[0],
          quantidade: quantity,
          preco_base: product.preco_base || 0,
          preco_unitario: product.preco_base || 0,
          desconto_percent: 0
        }
      ];
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  removeFromCart: (productId) => {
    const updated = get().items.filter((i) => i.id !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  updateQuantity: (productId, quantity) => {
    const validQty = Math.max(1, Math.min(999, Math.floor(quantity)));
    const updated = get().items.map((item) =>
      item.id === productId ? { ...item, quantidade: validQty } : item
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  updateUnitPrice: (productId, price) => {
    const validPrice = Math.max(0, Number(price) || 0);
    const updated = get().items.map((item) =>
      item.id === productId ? { ...item, preco_unitario: validPrice } : item
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  updateItemDiscount: (productId, discountPercent) => {
    const validDisc = Math.max(0, Math.min(100, Number(discountPercent) || 0));
    const updated = get().items.map((item) =>
      item.id === productId ? { ...item, desconto_percent: validDisc } : item
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    set({ items: updated });
  },

  setGlobalDiscount: (percent) => {
    const validDisc = Math.max(0, Math.min(100, Number(percent) || 0));
    localStorage.setItem(CART_GLOBAL_DISCOUNT_KEY, validDisc.toString());
    set({ globalDiscountPercent: validDisc });
  },

  setClientInfo: (info) => {
    const updated = { ...get().clientInfo, ...info };
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(updated));
    set({ clientInfo: updated });
  },

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(CART_GLOBAL_DISCOUNT_KEY);
    set({ items: [], globalDiscountPercent: 0 });
  },

  loadSavedQuote: (quote) => {
    const items = (quote.itens || []).map((i) => ({
      id: i.id,
      nome: i.nome,
      referencia: i.referencia,
      unidade: i.unidade,
      imagem: i.imagem,
      quantidade: i.quantidade || 1,
      preco_base: i.preco_base || 0,
      preco_unitario: i.preco_unitario !== undefined ? i.preco_unitario : (i.preco_base || 0),
      desconto_percent: i.desconto_percent || 0
    }));

    const globalDisc = quote.discGlobalPercent || 0;
    const client: ClientInfo = {
      nome: quote.cliente || '',
      doc: quote.doc || '',
      telefone: get().clientInfo.telefone || ''
    };

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(CART_GLOBAL_DISCOUNT_KEY, globalDisc.toString());
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client));

    set({
      items,
      globalDiscountPercent: globalDisc,
      clientInfo: client,
      isCartOpen: true
    });
  },

  getTotals: () => {
    const { items, globalDiscountPercent } = get();
    return calculateCartTotals(items, globalDiscountPercent);
  }
}));
