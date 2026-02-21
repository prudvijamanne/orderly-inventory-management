// User roles enum
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Product interface
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

// Inventory interface
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  minStock: number;
  location: string;
  lastUpdated: string;
}

// Order interface
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockItems: number;
  ordersToday: number;
  pendingOrders: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Navigation item type
export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}
