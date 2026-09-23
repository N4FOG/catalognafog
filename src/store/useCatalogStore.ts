import { create } from 'zustand';
import type { Product } from '../types/product';

interface CatalogState {
  searchQuery: string;
  selectedCategory: string;
  selectedFormulation: string;
  viewMode: 'grid' | 'list';
  selectedProduct: Product | null;
  activeStoryIndex: number | null;
  
  // Modals visibility
  isSellerModalOpen: boolean;
  isSellerAppModalOpen: boolean;
  sellerAppActiveTab: 'quotes' | 'tools';
  sellerQuoteStatusFilter: string;
  isProposalModalOpen: boolean;
  isWhatsAppModalOpen: boolean;
  isCommissionModalOpen: boolean;
  isIosInstallModalOpen: boolean;

  // Admin Modals & State
  isAdminDashboardOpen: boolean;
  isAdminProductsListOpen: boolean;
  adminEditingProduct: Product | null;
  
  // Modal specific options
  proposalMode: 'with_prices' | 'without_prices';
  whatsAppMode: 'with_prices' | 'without_prices';

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedFormulation: (formulation: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSelectedProduct: (product: Product | null) => void;
  setActiveStoryIndex: (index: number | null) => void;
  quickSearch: (term: string) => void;
  
  openSellerModal: () => void;
  closeSellerModal: () => void;
  openSellerAppModal: (defaultTab?: 'quotes' | 'tools') => void;
  closeSellerAppModal: () => void;
  setSellerAppActiveTab: (tab: 'quotes' | 'tools') => void;
  setSellerQuoteStatusFilter: (status: string) => void;

  // Admin Actions
  openAdminDashboard: () => void;
  closeAdminDashboard: () => void;
  openAdminProductsList: () => void;
  closeAdminProductsList: () => void;
  setAdminEditingProduct: (product: Product | null) => void;
  
  openProposalModal: (mode?: 'with_prices' | 'without_prices') => void;
  closeProposalModal: () => void;
  openWhatsAppModal: (mode?: 'with_prices' | 'without_prices') => void;
  closeWhatsAppModal: () => void;
  openCommissionModal: () => void;
  closeCommissionModal: () => void;
  openIosInstallModal: () => void;
  closeIosInstallModal: () => void;
  clearFilters: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  searchQuery: '',
  selectedCategory: 'todos',
  selectedFormulation: 'todos',
  viewMode: 'grid',
  selectedProduct: null,
  activeStoryIndex: null,

  isSellerModalOpen: false,
  isSellerAppModalOpen: false,
  sellerAppActiveTab: 'quotes',
  sellerQuoteStatusFilter: 'todos',
  isProposalModalOpen: false,
  isWhatsAppModalOpen: false,
  isCommissionModalOpen: false,
  isIosInstallModalOpen: false,

  isAdminDashboardOpen: false,
  isAdminProductsListOpen: false,
  adminEditingProduct: null,

  proposalMode: 'with_prices',
  whatsAppMode: 'with_prices',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, searchQuery: '' }),
  setSelectedFormulation: (selectedFormulation) => set({ selectedFormulation }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setActiveStoryIndex: (activeStoryIndex) => set({ activeStoryIndex }),

  quickSearch: (term) =>
    set({
      searchQuery: term,
      selectedCategory: 'todos',
      selectedFormulation: 'todos'
    }),

  openSellerModal: () => set({ isSellerModalOpen: true }),
  closeSellerModal: () => set({ isSellerModalOpen: false }),
  openSellerAppModal: (defaultTab = 'quotes') =>
    set({ isSellerAppModalOpen: true, sellerAppActiveTab: defaultTab }),
  closeSellerAppModal: () => set({ isSellerAppModalOpen: false }),
  setSellerAppActiveTab: (tab) => set({ sellerAppActiveTab: tab }),
  setSellerQuoteStatusFilter: (status) => set({ sellerQuoteStatusFilter: status }),

  openAdminDashboard: () => set({ isAdminDashboardOpen: true }),
  closeAdminDashboard: () => set({ isAdminDashboardOpen: false }),
  openAdminProductsList: () => set({ isAdminProductsListOpen: true }),
  closeAdminProductsList: () => set({ isAdminProductsListOpen: false }),
  setAdminEditingProduct: (product) => set({ adminEditingProduct: product }),
  
  openProposalModal: (mode = 'with_prices') =>
    set({ isProposalModalOpen: true, proposalMode: mode }),
  closeProposalModal: () => set({ isProposalModalOpen: false }),
  
  openWhatsAppModal: (mode = 'with_prices') =>
    set({ isWhatsAppModalOpen: true, whatsAppMode: mode }),
  closeWhatsAppModal: () => set({ isWhatsAppModalOpen: false }),
  
  openCommissionModal: () => set({ isCommissionModalOpen: true }),
  closeCommissionModal: () => set({ isCommissionModalOpen: false }),

  openIosInstallModal: () => set({ isIosInstallModalOpen: true }),
  closeIosInstallModal: () => set({ isIosInstallModalOpen: false }),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'todos',
      selectedFormulation: 'todos'
    })
}));
