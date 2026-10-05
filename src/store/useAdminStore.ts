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
const ADMIN_PRODUCTS_STORAGE_KEY = 'rawell_products_data_v4';
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

export function sanitizeProduct(p: Partial<Product> | any): Product {
  const defaultImagens = ['img/logo.png'];
  const rawImgs = Array.isArray(p?.imagens)
    ? p.imagens.filter((url: any) => typeof url === 'string' && url.trim().length > 0)
    : [];
  const imagens = rawImgs.length > 0 ? rawImgs : defaultImagens;
  const rawNome = typeof p?.nome === 'string' ? p.nome.trim() : 'Produto Sem Nome';

  return {
    id: typeof p?.id === 'number' ? p.id : Math.floor(Date.now() + Math.random() * 1000),
    nome: rawNome,
    categoria: p?.categoria || 'outros',
    tipo_formulacao: p?.tipo_formulacao || 'concentrado',
    o_que_faz: p?.o_que_faz || p?.descricao || '',
    para_que_serve: p?.para_que_serve || p?.o_que_faz || '',
    como_age: p?.como_age || '',
    como_usar: p?.como_usar || '',
    onde_nao_usar: p?.onde_nao_usar || '',
    seguranca: p?.seguranca || {
      pets: 'Afastar pets até a secagem completa',
      chuva: 'Não aplicar com previsão de chuva em 4h',
      horario: 'Horários amenos do dia',
      epi: 'Luvas, máscara e óculos'
    },
    alvos: Array.isArray(p?.alvos) ? p.alvos : [],
    descricao: p?.descricao || p?.o_que_faz || '',
    caracteristicas: Array.isArray(p?.caracteristicas) ? p.caracteristicas : [],
    imagens,
    unidade: p?.unidade || 'UN',
    referencia: p?.referencia || `REF-${p?.id || '00'}`,
    rendimento: p?.rendimento || '',
    destaque: !!p?.destaque,
    preco_base: typeof p?.preco_base === 'number' && !isNaN(p.preco_base) ? p.preco_base : 0,
    emEstoque: p?.emEstoque !== false,
    badge_texto: p?.badge_texto,
    badge_tipo: p?.badge_tipo,
    icones_representativos: Array.isArray(p?.icones_representativos) ? p.icones_representativos : ['🌿'],
    manual_aplicacao: p?.manual_aplicacao,
    variacoes: Array.isArray(p?.variacoes) && p.variacoes.length > 0 ? p.variacoes : undefined,
  };
}

export function mergeProducts(baseProducts: Product[], incoming: any[]): Product[] {
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return baseProducts.map(sanitizeProduct);
  }

  const map = new Map<number, Product>();
  // Base do código-fonte (sempre confiável, inclui variacoes oficiais e fotos)
  baseProducts.forEach((p) => map.set(p.id, sanitizeProduct(p)));
  incoming.forEach((raw) => {
    if (raw && typeof raw === 'object' && typeof raw.id === 'number') {
      const sanitized = sanitizeProduct(raw);
      const base = map.get(sanitized.id);
      if (base) {
        // Preserva SEMPRE as variações oficiais do código se existirem
        if (base.variacoes && base.variacoes.length > 0) {
          sanitized.variacoes = base.variacoes;
        }
      }
      map.set(sanitized.id, sanitized);
    }
  });

  return Array.from(map.values());
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdminLoggedIn: !!loadStoredAdminSession()?.logged,
  adminSession: loadStoredAdminSession(),
  products: PRODUTOS.map(sanitizeProduct),
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
      // 1. Carrega edições locais salvas pelo admin, se houver
      const cachedProducts = await persistentStorage.getItem<Product[]>(ADMIN_PRODUCTS_STORAGE_KEY, []);
      const cachedBackups = await persistentStorage.getItem<ProductBackup[]>(ADMIN_BACKUPS_STORAGE_KEY, []);

      // SEMPRE mescla com PRODUTOS do código e sanitiza!
      const initialProducts = mergeProducts(PRODUTOS, cachedProducts || []);

      set({ products: initialProducts, backups: cachedBackups || [] });
      reindexProducts(initialProducts);

      // Atualiza o cache local com a versão mesclada e sanitizada
      await persistentStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, initialProducts);
    } catch (e) {
      console.warn('Erro ao carregar dados iniciais de produtos:', e);
      const safe = PRODUTOS.map(sanitizeProduct);
      set({ products: safe });
      reindexProducts(safe);
    }
  },

  syncWithCloud: async (): Promise<boolean> => {
    // A busca de produtos via Google Sheets foi desativada para impedir que indisponibilidade ou inconsistência na nuvem oculte produtos do catálogo.
    set({ isSyncingCloud: false, lastCloudSync: new Date().toISOString() });
    return true;
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
