import axios from 'axios';
import { User, Product, InventoryItem, Order } from '@/types';

// ===============================
// API CONFIG
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// AUTH API (REAL BACKEND)
// ===============================
export const authApi = {
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { email, password });

    const { token, user } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    return { user, token };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: async (): Promise<User> => {
    const user = localStorage.getItem('auth_user');
    if (!user) throw new Error('Not authenticated');
    return JSON.parse(user);
  },
};

// ===============================
// USERS API
// ===============================
// ===============================
// USERS API
// ===============================
export const usersApi = {
  getAll: async () => {
    const res = await api.get('/users');

    return res.data.map((u: any) => ({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'STAFF',
      status: 'active',
      createdAt: u.created_at || new Date().toISOString(),
    }));
  },

  create: async (data: {
    name: string;
    email: string;
    role: string;
  }) => {
    const res = await api.post('/users', data);
    return res.data;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
};

// ===============================
// PRODUCTS API
// ===============================
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await api.get('/products');

    // 🔽 THIS IS WHERE IT RETURNS
   return res.data.map((p: any) => ({
  ...p,
  price: Number(p.price), // 🔥 fix here
  createdAt: p.created_at,
}));

  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post('/products', data);

   return {
  ...res.data,
  price: Number(res.data.price),
  createdAt: res.data.created_at,
};

  },
};


// ===============================
// ===============================
// INVENTORY API
// ===============================
export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const res = await api.get('/inventory');

    return res.data.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name || 'Unknown Product',
      sku: item.sku || 'N/A',
      quantity: item.quantity ?? 0,
      minStock: item.min_stock ?? 0,
      location: item.location || 'Warehouse',
      lastUpdated: item.updated_at || new Date().toISOString(),
    }));
  },

 update: async (
  product_id: string,
  data: { quantity: number; minStock?: number; location?: string }
) => {
  const res = await api.post('/inventory', {
    product_id,
    quantity: data.quantity,
    min_stock: data.minStock,
    location: data.location,
  });

  return res.data;
},

};


// ===============================
// ORDERS API
// ===============================
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const res = await api.get('/orders');

    return res.data.map((o: any) => ({
      id: o.id,
      orderNumber: `ORD-${o.id.slice(0, 6)}`,
      customerName: o.customer_name || 'N/A',
      totalAmount: o.total_amount || 0,
      status: o.status.toLowerCase(), // CREATED → created
      createdAt: o.created_at,
    }));
  },

 create: async (items: { product_id: string; quantity: number }[]) => {
  const res = await api.post('/orders', { items });
  return res.data;
},

};


// ===============================
// DASHBOARD API (DERIVED DATA)
// ===============================
export const dashboardApi = {
  getMetrics: async () => {
    const [products, inventory, orders] = await Promise.all([
      api.get('/products'),
      api.get('/inventory'),
      api.get('/orders'),
    ]);

    return {
      totalProducts: products.data.length,
      totalOrders: orders.data.length,
      lowStockItems: inventory.data.filter(
        (item: any) => item.quantity <= 5
      ).length,
    };
  },
};

export default api;
