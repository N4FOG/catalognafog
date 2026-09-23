import type { Product } from './product';

export interface AdminSession {
  logged: boolean;
  username: string;
  role: 'superadmin';
  loginTime: string;
}

export interface ProductBackup {
  id: string; // unique backup id
  productId: number;
  productName: string;
  timestamp: string; // ISO string
  author: string;
  summary: string;
  snapshot: Product;
}

export interface CloudProductsPayload {
  lastUpdate: string;
  updatedBy: string;
  products: Product[];
  backups?: ProductBackup[];
}
