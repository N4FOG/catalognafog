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
  isSellerDashboardOpen: boolean;
  isProposalModalOpen: boolean;
  isWhatsAppModalOpen: boolean;
  isCommissionModalOpen: boolean;
  
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
  
  openSellerModal: () => void;
  closeSellerModal: () => void;
  openSellerDashboard: () => void;
  closeSellerDashboard: () => void;
  openProposalModal: (mode?: 'with_prices' | 'without_prices') => void;
  closeProposalModal: () => void;
  openWhatsAppModal: (mode?: 'with_prices' | 'without_prices') => void;
  closeWhatsAppModal: () => void;
  openCommissionModal: () => void;
  closeCommissionModal: () => void;
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
  isSellerDashboardOpen: false,
  isProposalModalOpen: false,
  isWhatsAppModalOpen: false,
  isCommissionModalOpen: false,

  proposalMode: 'with_prices',
  whatsAppMode: 'with_prices',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedFormulation: (selectedFormulation) => set({ selectedFormulation }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  setActiveStoryIndex: (activeStoryIndex) => set({ activeStoryIndex }),

  openSellerModal: () => set({ isSellerModalOpen: true }),
  closeSellerModal: () => set({ isSellerModalOpen: false }),
  openSellerDashboard: () => set({ isSellerDashboardOpen: true }),
  closeSellerDashboard: () => set({ isSellerDashboardOpen: false }),
  
  openProposalModal: (mode = 'with_prices') =>
    set({ isProposalModalOpen: true, proposalMode: mode }),
  closeProposalModal: () => set({ isProposalModalOpen: false }),
  
  openWhatsAppModal: (mode = 'with_prices') =>
    set({ isWhatsAppModalOpen: true, whatsAppMode: mode }),
  closeWhatsAppModal: () => set({ isWhatsAppModalOpen: false }),
  
  openCommissionModal: () => set({ isCommissionModalOpen: true }),
  closeCommissionModal: () => set({ isCommissionModalOpen: false }),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'todos',
      selectedFormulation: 'todos'
    })
}));
