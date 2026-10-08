import { create } from 'zustand';
import type { Product } from '../types/product';
import type { AdminSession, ProductBackup } from '../types/admin';
import { PRODUTOS } from '../data/products';
import { reindexProducts } from '../utils/searchEngine';
import {
  captureCatalogFromSheet,
  saveEmergencyBackup,
  restoreFromEmergencyBackup
} from '../utils/catalogSheetExport';

interface AdminState {
  isAdminLoggedIn: boolean;
  adminSession: AdminSession | null;
  products: Product[];
  backups: ProductBackup[];
  isSyncingCloud: boolean;
  lastCloudSync: string | null;
  lastCaptureBackupId: string | null;
  lastCaptureTimestamp: string | null;

  // Actions
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  loadInitialData: () => Promise<void>;
  syncWithCloud: () => Promise<boolean>;
  updateProduct: (updatedProduct: Product, changeSummary?: string) => Promise<boolean>;
  restoreProductBackup: (backupId: string) => Promise<boolean>;
  getProductBackups: (productId: number) => ProductBackup[];
  // Fase 2: Captura e backup do Google Sheets
  captureFromSheet: () => Promise<{ ok: boolean; message: string; count?: number }>;
  makeBackupNow: () => Promise<{ ok: boolean; message: string; backupId?: string }>;
  restoreEmergencyBackup: (backupId?: string) => Promise<{ ok: boolean; message: string }>;
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
  lastCaptureBackupId: null,
  lastCaptureTimestamp: null,

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
    // Produtos vêm EXCLUSIVAMENTE do bundle estático (PRODUTOS de products.ts)
    // Removido sistema de cache local para eliminar pisca-pisca de renderização
    const initialProducts = PRODUTOS.map(sanitizeProduct);
    set({ products: initialProducts, backups: [] });
    reindexProducts(initialProducts);

    // Limpa qualquer cache antigo que possa existir no localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(ADMIN_PRODUCTS_STORAGE_KEY);
        localStorage.removeItem(ADMIN_BACKUPS_STORAGE_KEY);
      } catch (e) {
        console.warn('Nota: não foi possível limpar cache antigo de produtos', e);
      }
    }
  },

  syncWithCloud: async (): Promise<boolean> => {
    // Sincronização via Google Sheets (upload do catálogo local)
    set({ isSyncingCloud: true });
    try {
      const { products } = get();
      const { exportCatalogToSheet } = await import('../utils/catalogSheetExport');
      const result = await exportCatalogToSheet(products);
      set({ isSyncingCloud: false, lastCloudSync: new Date().toISOString() });
      return result.ok;
    } catch {
      set({ isSyncingCloud: false, lastCloudSync: new Date().toISOString() });
      return false;
    }
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

    // Atualiza a lista de produtos APENAS NA SESSÃO ATUAL (memória)
    // NÃO persiste no localStorage — edições são temporárias até o próximo deploy
    const nextProducts = oldProduct
      ? products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      : [...products, updatedProduct];

    const nextBackups = newBackup ? [newBackup, ...backups].slice(0, 100) : backups;

    set({ products: nextProducts, backups: nextBackups });
    reindexProducts(nextProducts);

    // REMOVIDO: persistência em localStorage
    // REMOVIDO: envio para Google Sheets
    // Admin deve editar src/data/products.ts e fazer commit/deploy

    console.log('✅ Produto atualizado na sessão atual. Para persistir, edite src/data/products.ts e faça deploy.');
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
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  FASE 2: CAPTURA DO CATÁLOGO DO GOOGLE SHEETS
  // ═══════════════════════════════════════════════════════════════════════
  captureFromSheet: async (): Promise<{ ok: boolean; message: string; count?: number }> => {
    const { products } = get();
    
    // 1. Faz backup do estado atual (local) antes de capturar
    const localBackup: ProductBackup = {
      id: `LOCAL-BKP-${Date.now()}`,
      productId: 0,
      productName: 'Backup completo antes da captura',
      timestamp: new Date().toLocaleString('pt-BR'),
      author: 'jcvadmin',
      summary: 'Backup automático antes de capturar da planilha',
      snapshot: JSON.parse(JSON.stringify(products))
    };
    
    // 2. Captura da planilha (isso gera backup na nuvem também)
    const result = await captureCatalogFromSheet('jcvadmin');
    
    if (!result.ok || !result.products) {
      return { ok: false, message: result.message };
    }
    
    // 3. Merge inteligente: produtos existentes mantêm variações oficiais,
    //    novos produtos são adicionados, edições na planilha sobrescrevem
    const currentMap = new Map(products.map(p => [p.id, p]));
    
    // Usa os produtos da planilha como base, mas preserva variações locais
    const merged: Product[] = [];
    for (const incoming of result.products) {
      const local = currentMap.get(incoming.id);
      if (local && local.variacoes && local.variacoes.length > 0) {
        // Mantém as variações oficiais do código-fonte
        merged.push({
          ...incoming,
          variacoes: local.variacoes
        });
      } else {
        merged.push(incoming);
      }
    }
    
    // 4. Adiciona produtos novos que só existem na planilha
    for (const incoming of result.products) {
      if (!currentMap.has(incoming.id)) {
        merged.push(incoming);
      }
    }
    
    // 5. Salva no estado
    set({
      products: merged,
      backups: [localBackup, ...get().backups].slice(0, 100),
      lastCaptureBackupId: result.backupId || null,
      lastCaptureTimestamp: new Date().toISOString()
    });
    reindexProducts(merged);
    
    return {
      ok: true,
      message: result.message,
      count: merged.length
    };
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  FASE 2: BACKUP MANUAL DE EMERGÊNCIA
  // ═══════════════════════════════════════════════════════════════════════
  makeBackupNow: async (): Promise<{ ok: boolean; message: string; backupId?: string }> => {
    const result = await saveEmergencyBackup('jcvadmin');
    if (result.ok) {
      return {
        ok: true,
        message: result.message,
        backupId: result.backupId
      };
    }
    return { ok: false, message: result.message };
  },

  // ═══════════════════════════════════════════════════════════════════════
  //  FASE 2: RESTAURAR BACKUP DE EMERGÊNCIA
  // ═══════════════════════════════════════════════════════════════════════
  restoreEmergencyBackup: async (
    backupId?: string
  ): Promise<{ ok: boolean; message: string }> => {
    const result = await restoreFromEmergencyBackup(backupId, 'jcvadmin');
    if (result.ok) {
      // Recarrega os produtos após restauração
      const captureResult = await captureCatalogFromSheet('jcvadmin');
      if (captureResult.ok && captureResult.products) {
        set({
          products: captureResult.products,
          lastCaptureBackupId: backupId || null,
          lastCaptureTimestamp: new Date().toISOString()
        });
        reindexProducts(captureResult.products);
      }
    }
    return result;
  }
}));
