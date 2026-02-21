import { User, Product, InventoryItem, Order, DashboardMetrics } from '@/types';

// Mock users for different roles
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'John Admin',
    role: 'ADMIN',
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Jane Manager',
    role: 'MANAGER',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '3',
    email: 'staff@example.com',
    name: 'Bob Staff',
    role: 'STAFF',
    createdAt: '2024-02-01',
    status: 'active',
  },
  {
    id: '4',
    email: 'alice@example.com',
    name: 'Alice Wilson',
    role: 'STAFF',
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: '5',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    role: 'MANAGER',
    createdAt: '2024-03-01',
    status: 'inactive',
  },
];

// Mock products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'USB-C Charging Cable',
    sku: 'UCC-002',
    category: 'Accessories',
    price: 12.99,
    description: 'Fast charging USB-C cable, 2m length',
    status: 'active',
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    sku: 'MKB-003',
    category: 'Electronics',
    price: 149.99,
    description: 'RGB mechanical keyboard with cherry switches',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    sku: 'WMS-004',
    category: 'Electronics',
    price: 39.99,
    description: 'Ergonomic wireless mouse with adjustable DPI',
    status: 'active',
    createdAt: '2024-01-18',
  },
  {
    id: '5',
    name: 'Laptop Stand',
    sku: 'LST-005',
    category: 'Accessories',
    price: 34.99,
    description: 'Adjustable aluminum laptop stand',
    status: 'inactive',
    createdAt: '2024-01-20',
  },
  {
    id: '6',
    name: 'Monitor Light Bar',
    sku: 'MLB-006',
    category: 'Lighting',
    price: 49.99,
    description: 'LED monitor light bar with adjustable brightness',
    status: 'active',
    createdAt: '2024-02-01',
  },
];

// Mock inventory
export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    quantity: 45,
    minStock: 20,
    location: 'Warehouse A - Shelf 1',
    lastUpdated: '2024-03-15',
  },
  {
    id: '2',
    productId: '2',
    productName: 'USB-C Charging Cable',
    sku: 'UCC-002',
    quantity: 150,
    minStock: 50,
    location: 'Warehouse A - Shelf 2',
    lastUpdated: '2024-03-14',
  },
  {
    id: '3',
    productId: '3',
    productName: 'Mechanical Keyboard',
    sku: 'MKB-003',
    quantity: 12,
    minStock: 15,
    location: 'Warehouse B - Shelf 1',
    lastUpdated: '2024-03-13',
  },
  {
    id: '4',
    productId: '4',
    productName: 'Wireless Mouse',
    sku: 'WMS-004',
    quantity: 78,
    minStock: 30,
    location: 'Warehouse A - Shelf 3',
    lastUpdated: '2024-03-15',
  },
  {
    id: '5',
    productId: '5',
    productName: 'Laptop Stand',
    sku: 'LST-005',
    quantity: 8,
    minStock: 10,
    location: 'Warehouse B - Shelf 2',
    lastUpdated: '2024-03-12',
  },
  {
    id: '6',
    productId: '6',
    productName: 'Monitor Light Bar',
    sku: 'MLB-006',
    quantity: 25,
    minStock: 20,
    location: 'Warehouse A - Shelf 4',
    lastUpdated: '2024-03-15',
  },
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 5, price: 79.99 },
      { productId: '2', productName: 'USB-C Charging Cable', quantity: 10, price: 12.99 },
    ],
    totalAmount: 529.85,
    status: 'delivered',
    createdBy: '3',
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerId: 'CUST-002',
    customerName: 'TechStart Inc',
    items: [
      { productId: '3', productName: 'Mechanical Keyboard', quantity: 3, price: 149.99 },
    ],
    totalAmount: 449.97,
    status: 'shipped',
    createdBy: '3',
    createdAt: '2024-03-05',
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Digital Solutions LLC',
    items: [
      { productId: '4', productName: 'Wireless Mouse', quantity: 10, price: 39.99 },
      { productId: '6', productName: 'Monitor Light Bar', quantity: 5, price: 49.99 },
    ],
    totalAmount: 649.85,
    status: 'processing',
    createdBy: '4',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerId: 'CUST-001',
    customerName: 'Acme Corporation',
    items: [
      { productId: '5', productName: 'Laptop Stand', quantity: 15, price: 34.99 },
    ],
    totalAmount: 524.85,
    status: 'pending',
    createdBy: '3',
    createdAt: '2024-03-14',
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    customerId: 'CUST-004',
    customerName: 'Creative Studios',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 2, price: 79.99 },
      { productId: '3', productName: 'Mechanical Keyboard', quantity: 2, price: 149.99 },
    ],
    totalAmount: 459.96,
    status: 'pending',
    createdBy: '4',
    createdAt: '2024-03-15',
  },
];

// Mock dashboard metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalOrders: 156,
  totalRevenue: 48750.99,
  totalProducts: 24,
  lowStockItems: 3,
  ordersToday: 8,
  pendingOrders: 12,
};

// Mock login credentials
export const mockCredentials: Record<string, { password: string; user: User }> = {
  'admin@example.com': { password: 'admin123', user: mockUsers[0] },
  'manager@example.com': { password: 'manager123', user: mockUsers[1] },
  'staff@example.com': { password: 'staff123', user: mockUsers[2] },
};
