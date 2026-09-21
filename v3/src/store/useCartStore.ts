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
  paymentTerms: string;
  validityDays: string;
  isCartOpen: boolean;
  isClientAccordionOpen: boolean;
  isSecondaryActionsExpanded: boolean;

  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateUnitPrice: (productId: number, price: number) => void;
  updateItemDiscount: (productId: number, discountPercent: number) => void;
  setGlobalDiscount: (percent: number) => void;
  setClientInfo: (info: Partial<ClientInfo>) => void;
  setPaymentTerms: (val: string) => void;
  setValidityDays: (val: string) => void;
  setIsCartOpen: (open: boolean) => void;
  toggleClientAccordion: (forcedState?: boolean) => void;
  toggleSecondaryActions: (forcedState?: boolean) => void;
  clearCart: () => void;
  loadSavedQuote: (quote: QuoteHistoryItem) => void;
  generateCartShareUrl: (includePrices?: boolean) => string;
  loadCartFromUrl: () => boolean;
  getTotals: () => CartTotals;
}

const CART_STORAGE_KEY = 'rawell_cart_v3';
const CART_GLOBAL_DISCOUNT_KEY = 'rawell_cart_global_discount_v3';
const CLIENT_STORAGE_KEY = 'rawell_client_profile_v3';
const PAYMENT_STORAGE_KEY = 'rawell_payment_terms_v3';
const VALIDITY_STORAGE_KEY = 'rawell_validity_terms_v3';

function getPackTag(product: Product): string {
  if (product.caracteristicas) {
    const found = product.caracteristicas.find((c) => {
      const lower = c.toLowerCase();
      return (
        lower.includes('frasco') ||
        lower.includes('caixa') ||
        lower.includes('sachê') ||
        lower.includes('display') ||
        lower.includes('seringa') ||
        lower.includes('balde') ||
        lower.includes('envelope')
      );
    });
    if (found) return found.split('(')[0].trim();
  }
  return product.unidade ? product.unidade.toUpperCase() : 'UN';
}

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
        desconto_percent: item.desconto_percent || 0,
        packTag: item.packTag || (p ? getPackTag(p) : 'UN')
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
  paymentTerms: (typeof window !== 'undefined' && localStorage.getItem(PAYMENT_STORAGE_KEY)) || 'À Vista / PIX com Desconto Especial',
  validityDays: (typeof window !== 'undefined' && localStorage.getItem(VALIDITY_STORAGE_KEY)) || '10 dias a contar da emissão',
  isCartOpen: false,
  isClientAccordionOpen: false,
  isSecondaryActionsExpanded: false,

  addToCart: (product, quantity = 1) => {
    const current = get().items;
    const existingIndex = current.findIndex((i) => i.id === product.id);
    let updated: CartItem[];

    const packTag = getPackTag(product);

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
          desconto_percent: 0,
          packTag
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

  setPaymentTerms: (val) => {
    if (typeof window !== 'undefined') localStorage.setItem(PAYMENT_STORAGE_KEY, val);
    set({ paymentTerms: val });
  },

  setValidityDays: (val) => {
    if (typeof window !== 'undefined') localStorage.setItem(VALIDITY_STORAGE_KEY, val);
    set({ validityDays: val });
  },

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  toggleClientAccordion: (forcedState) => {
    set((state) => ({
      isClientAccordionOpen: forcedState !== undefined ? forcedState : !state.isClientAccordionOpen
    }));
  },

  toggleSecondaryActions: (forcedState) => {
    set((state) => ({
      isSecondaryActionsExpanded: forcedState !== undefined ? forcedState : !state.isSecondaryActionsExpanded
    }));
  },

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
      desconto_percent: i.desconto_percent || 0,
      packTag: i.packTag || 'UN'
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
      paymentTerms: quote.pagamento || get().paymentTerms,
      validityDays: quote.validade || get().validityDays,
      isCartOpen: true
    });
  },

  generateCartShareUrl: (includePrices = false) => {
    if (typeof window === 'undefined') return '';
    const { items, globalDiscountPercent, clientInfo } = get();
    if (!items.length) return window.location.href;

    // Compact encoding: id:qty:price:disc
    const itemTokens = items.map((i) => {
      const p = includePrices && i.preco_unitario !== undefined ? Number(i.preco_unitario).toFixed(2) : '';
      const d = includePrices && i.desconto_percent ? Number(i.desconto_percent) : '';
      return `${i.id}:${i.quantidade}${p ? `:${p}` : ''}${d ? `:${d}` : ''}`;
    });

    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('c', itemTokens.join(','));

    if (includePrices && globalDiscountPercent > 0) {
      url.searchParams.set('dg', globalDiscountPercent.toString());
    }
    if (clientInfo.nome) {
      url.searchParams.set('cn', clientInfo.nome);
    }
    if (clientInfo.doc) {
      url.searchParams.set('cd', clientInfo.doc);
    }

    return url.toString();
  },

  loadCartFromUrl: () => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      const cartParam = params.get('c') || params.get('cart') || params.get('orc');
      if (!cartParam) return false;

      const tokens = cartParam.split(',');
      const restoredItems: CartItem[] = [];

      tokens.forEach((token) => {
        const parts = token.split(':');
        const id = parseInt(parts[0], 10);
        const qty = parseInt(parts[1], 10) || 1;
        const customPrice = parts[2] ? parseFloat(parts[2]) : undefined;
        const customDisc = parts[3] ? parseFloat(parts[3]) : 0;

        const p = PRODUTOS.find((prod) => prod.id === id);
        if (p) {
          restoredItems.push({
            id: p.id,
            nome: p.nome,
            referencia: p.referencia,
            unidade: p.unidade,
            imagem: p.imagens[0],
            quantidade: qty,
            preco_base: p.preco_base || 0,
            preco_unitario: customPrice !== undefined ? customPrice : (p.preco_base || 0),
            desconto_percent: customDisc,
            packTag: getPackTag(p)
          });
        }
      });

      if (restoredItems.length > 0) {
        const dg = parseFloat(params.get('dg') || '0') || 0;
        const cn = params.get('cn') || '';
        const cd = params.get('cd') || '';

        set({
          items: restoredItems,
          globalDiscountPercent: dg,
          clientInfo: { ...get().clientInfo, nome: cn || get().clientInfo.nome, doc: cd || get().clientInfo.doc },
          isCartOpen: true
        });

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(restoredItems));
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Load cart from URL error:', e);
      return false;
    }
  },

  getTotals: () => {
    const { items, globalDiscountPercent } = get();
    return calculateCartTotals(items, globalDiscountPercent);
  }
}));
