import { create } from 'zustand';
import type { Product } from '../types/product';
import type { AdminSession, ProductBackup } from '../types/admin';
import { PRODUTOS } from '../data/products';
import { CONFIG } from '../data/config';
import { persistentStorage } from '../utils/storage';
import { reindexProducts } from '../utils/searchEngine';

interface AdminState {
  isAdminLoggedIn: boolean;
  adminSession: AdminSession | null;
  products: Product[];
  backups: ProductBackup[];
  isSyncingCloud: boolean;
  lastCloudSync: string | null;

  // Actions
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  loadInitialData: () => Promise<void>;
  syncWithCloud: () => Promise<boolean>;
  updateProduct: (updatedProduct: Product, changeSummary?: string) => Promise<boolean>;
  restoreProductBackup: (backupId: string) => Promise<boolean>;
  getProductBackups: (productId: number) => ProductBackup[];
}

const ADMIN_SESSION_STORAGE_KEY = 'rawell_admin_session_auth_v3';
const ADMIN_PRODUCTS_STORAGE_KEY = 'rawell_products_data_v3';
const ADMIN_BACKUPS_STORAGE_KEY = 'rawell_products_backups_v3';

function loadStoredAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdminLoggedIn: !!loadStoredAdminSession()?.logged,
  adminSession: loadStoredAdminSession(),
  products: PRODUTOS,
  backups: [],
  isSyncingCloud: false,
  lastCloudSync: null,

  loginAdmin: (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === 'jcvadmin' && cleanPass === 'senha1senha2') {
      const session: AdminSession = {
        logged: true,
        username: 'jcvadmin',
        role: 'superadmin',
        loginTime: new Date().toISOString()
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
      }
      set({ isAdminLoggedIn: true, adminSession: session });
      return true;
    }
    return false;
  },

  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
    set({ isAdminLoggedIn: false, adminSession: null });
  },

  loadInitialData: async () => {
    try {
      // 1. Tenta carregar do IndexedDB / localStorage para exibição imediata
      const cachedProducts = await persistentStorage.getItem<Product[]>(ADMIN_PRODUCTS_STORAGE_KEY, []);
      const cachedBackups = await persistentStorage.getItem<ProductBackup[]>(ADMIN_BACKUPS_STORAGE_KEY, []);

      if (cachedProducts && cachedProducts.length > 0) {
        set({ products: cachedProducts, backups: cachedBackups || [] });
        reindexProducts(cachedProducts);
      } else {
        set({ products: PRODUTOS, backups: cachedBackups || [] });
        reindexProducts(PRODUTOS);
      }

      // 2. Busca silenciosamente as novidades do Google Sheets na nuvem
      get().syncWithCloud().catch(() => {});
    } catch (e) {
      console.warn('Erro ao carregar dados iniciais de produtos:', e);
    }
  },

  syncWithCloud: async (): Promise<boolean> => {
    const url = CONFIG.auditWebhookUrl;
    if (!url || !url.startsWith('http')) return false;

    set({ isSyncingCloud: true });

    try {
      // Faz requisição GET ao Google Apps Script
      const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}action=getProducts&_t=${Date.now()}`;
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        set({ isSyncingCloud: false });
        return false;
      }

      const resData = await response.json();
      if (resData && resData.status === 'success' && resData.hasData && Array.isArray(resData.products)) {
        const cloudProducts: Product[] = resData.products;
        const cloudBackups: ProductBackup[] = Array.isArray(resData.backups) ? resData.backups : [];

        // Atualiza cache local
        await persistentStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, cloudProducts);
        if (cloudBackups.length > 0) {
          await persistentStorage.setItem(ADMIN_BACKUPS_STORAGE_KEY, cloudBackups);
        }

        set({
          products: cloudProducts,
          backups: cloudBackups.length > 0 ? cloudBackups : get().backups,
          isSyncingCloud: false,
          lastCloudSync: resData.lastUpdate || new Date().toISOString()
        });

        reindexProducts(cloudProducts);
        return true;
      }
    } catch (err) {
      console.debug('Aviso na sincronização em nuvem de produtos:', err);
    }

    set({ isSyncingCloud: false });
    return false;
  },

  updateProduct: async (updatedProduct: Product, changeSummary?: string): Promise<boolean> => {
    const { products, backups } = get();
    const existingIndex = products.findIndex((p) => p.id === updatedProduct.id);
    const oldProduct = existingIndex !== -1 ? products[existingIndex] : null;

    // Gera o backup do estado anterior se o produto existia
    let newBackup: ProductBackup | null = null;
    if (oldProduct) {
      const now = new Date();
      newBackup = {
        id: `BKP-${oldProduct.id}-${now.getTime()}`,
        productId: oldProduct.id,
        productName: oldProduct.nome,
        timestamp: now.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        author: 'jcvadmin',
        summary: changeSummary || `Alteração em ${updatedProduct.nome}`,
        snapshot: JSON.parse(JSON.stringify(oldProduct))
      };
    }

    // Atualiza a lista local de produtos
    const nextProducts = oldProduct
      ? products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      : [...products, updatedProduct];

    const nextBackups = newBackup ? [newBackup, ...backups].slice(0, 100) : backups;

    // Salva localmente para resposta instantânea
    set({ products: nextProducts, backups: nextBackups });
    reindexProducts(nextProducts);
    await persistentStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, nextProducts);
    await persistentStorage.setItem(ADMIN_BACKUPS_STORAGE_KEY, nextBackups);

    // Envia para o Google Sheets em nuvem para propagar a todos os usuários
    try {
      const url = CONFIG.auditWebhookUrl;
      if (url && url.startsWith('http')) {
        const payload = {
          action: 'saveProducts',
          user: 'jcvadmin',
          products: nextProducts,
          backup: newBackup
        };

        const jsonStr = JSON.stringify(payload);
        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: jsonStr
        }).catch((e) => console.warn('Erro ao propagar produto na nuvem:', e));
      }
    } catch (e) {
      console.warn('Erro ao salvar produto em nuvem:', e);
    }

    return true;
  },

  restoreProductBackup: async (backupId: string): Promise<boolean> => {
    const { backups, updateProduct } = get();
    const backupItem = backups.find((b) => b.id === backupId);
    if (!backupItem || !backupItem.snapshot) return false;

    await updateProduct(
      backupItem.snapshot,
      `🔄 Versão restaurada do backup de ${backupItem.timestamp}`
    );
    return true;
  },

  getProductBackups: (productId: number): ProductBackup[] => {
    return get().backups.filter((b) => b.productId === productId);
  }
}));
