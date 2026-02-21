// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  updated_at: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  lowStockItems: number;
}
