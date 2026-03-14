import { create } from 'zustand';
import { CartItem, Order, Notification, Product, DeliveryStatus } from './types';
import { products as initialProducts } from './products';

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  notifications: Notification[];
  flashSaleBuyerCount: number;
  notifyMeProducts: string[];

  // Cart
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;

  // Orders
  placeOrder: (paymentMethod: string) => Order | null;
  requestRefund: (orderId: string) => void;
  approveRefund: (orderId: string) => void;
  rejectRefund: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => void;

  // Stock
  updateStock: (productId: string, newStock: number) => void;
  notifyMe: (productId: string) => void;

  // Notifications
  addNotification: (msg: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  
  // Search
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string, sub?: string) => Product[];
}

export const useStore = create<StoreState>((set, get) => ({
  products: initialProducts,
  cart: [],
  orders: [],
  notifications: [],
  flashSaleBuyerCount: 0,
  notifyMeProducts: [],

  addToCart: (product) => {
    const state = get();
    const p = state.products.find(pr => pr.id === product.id);
    if (!p || p.stock <= 0) return false;

    const existing = state.cart.find(c => c.product.id === product.id);
    if (existing) {
      if (existing.quantity >= p.stock) return false;
      set({ cart: state.cart.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c) });
    } else {
      const isFlashDiscount = p.isFlashSale && state.flashSaleBuyerCount < (p.flashDiscountLimit || 0);
      set({ cart: [...state.cart, { product: p, quantity: 1, flashDiscount: isFlashDiscount }] });
    }
    return true;
  },

  removeFromCart: (productId) => set(s => ({ cart: s.cart.filter(c => c.product.id !== productId) })),
  
  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set(s => ({ cart: s.cart.map(c => c.product.id === productId ? { ...c, quantity: qty } : c) }));
  },

  clearCart: () => set({ cart: [] }),

  placeOrder: (paymentMethod) => {
    const state = get();
    if (state.cart.length === 0) return null;

    // FCFS: check stock for each item
    const updatedProducts = [...state.products];
    for (const item of state.cart) {
      const pIdx = updatedProducts.findIndex(p => p.id === item.product.id);
      if (pIdx === -1 || updatedProducts[pIdx].stock < item.quantity) return null;
    }

    // Deduct stock
    let newBuyerCount = state.flashSaleBuyerCount;
    for (const item of state.cart) {
      const pIdx = updatedProducts.findIndex(p => p.id === item.product.id);
      updatedProducts[pIdx] = { ...updatedProducts[pIdx], stock: updatedProducts[pIdx].stock - item.quantity };
      if (updatedProducts[pIdx].isFlashSale) {
        newBuyerCount += item.quantity;
      }
    }

    const total = state.cart.reduce((sum, item) => {
      const price = item.flashDiscount ? item.product.price * (1 - (item.product.flashDiscountExtra || 0) / 100) : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const order: Order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      items: [...state.cart],
      total,
      status: 'confirmed',
      paymentMethod,
      paymentStatus: 'completed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const notification: Notification = {
      id: crypto.randomUUID(),
      message: `Payment of ₹${Math.round(total)} successful for order ${order.id}`,
      type: 'payment',
      read: false,
      createdAt: new Date().toISOString(),
    };

    set({
      products: updatedProducts,
      orders: [...state.orders, order],
      cart: [],
      flashSaleBuyerCount: newBuyerCount,
      notifications: [...state.notifications, notification],
    });

    return order;
  },

  requestRefund: (orderId) => set(s => ({
    orders: s.orders.map(o => o.id === orderId ? { ...o, refundRequested: true, refundStatus: 'pending' } : o),
  })),

  approveRefund: (orderId) => {
    const state = get();
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;
    const notification: Notification = {
      id: crypto.randomUUID(),
      message: `Refund of ₹${Math.round(order.total)} approved for order ${order.id}`,
      type: 'refund',
      read: false,
      createdAt: new Date().toISOString(),
    };
    set({
      orders: state.orders.map(o => o.id === orderId ? { ...o, refundStatus: 'approved', paymentStatus: 'refunded' } : o),
      notifications: [...state.notifications, notification],
    });
  },

  rejectRefund: (orderId) => set(s => ({
    orders: s.orders.map(o => o.id === orderId ? { ...o, refundStatus: 'rejected' } : o),
  })),

  updateOrderStatus: (orderId, status) => {
    const state = get();
    const notification: Notification = {
      id: crypto.randomUUID(),
      message: `Order ${orderId} is now ${status.replace(/_/g, ' ')}`,
      type: 'shipping',
      read: false,
      createdAt: new Date().toISOString(),
    };
    set({
      orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
      notifications: [...state.notifications, notification],
    });
  },

  updateStock: (productId, newStock) => {
    const state = get();
    const wasZero = state.products.find(p => p.id === productId)?.stock === 0;
    set({ products: state.products.map(p => p.id === productId ? { ...p, stock: newStock } : p) });
    if (wasZero && newStock > 0 && state.notifyMeProducts.includes(productId)) {
      const product = state.products.find(p => p.id === productId);
      const notification: Notification = {
        id: crypto.randomUUID(),
        message: `${product?.name} is back in stock!`,
        type: 'restock',
        read: false,
        createdAt: new Date().toISOString(),
      };
      set(s => ({
        notifications: [...s.notifications, notification],
        notifyMeProducts: s.notifyMeProducts.filter(id => id !== productId),
      }));
    }
  },

  notifyMe: (productId) => set(s => ({
    notifyMeProducts: [...s.notifyMeProducts, productId],
  })),

  addNotification: (msg, type) => set(s => ({
    notifications: [...s.notifications, {
      id: crypto.randomUUID(),
      message: msg,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    }],
  })),

  markNotificationRead: (id) => set(s => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),

  searchProducts: (query) => {
    const q = query.toLowerCase();
    return get().products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  },

  getProductsByCategory: (category, sub) => {
    return get().products.filter(p =>
      p.category === category && (!sub || p.subCategory === sub)
    );
  },
}));
