import { create } from "zustand";
import { request } from "../utils/request";
import { useAuthStore } from "./authStore";

export const useOrderStore = create((set, get) => ({
  orders: [],
  orderItems: [],
  loading: false,
  error: null,

  // Fetch all orders for the logged-in user
  fetchOrders: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const data = await request("/api/orders", "GET", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ orders: data });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      set({ error: err.response?.data?.error || "Failed to fetch orders" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single order by ID
  fetchOrderById: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/orders/${id}`, "GET", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.error("Failed to fetch order:", err);
      set({ error: err.response?.data?.error || "Failed to fetch order" });
    } finally {
      set({ loading: false });
    }
  },

  // Create a new order
  createOrder: async (payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const data = await request("/api/orders", "POST", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ orders: [...state.orders, data] }));
      return data;
    } catch (err) {
      console.error("Failed to create order:", err);
      set({ error: err.response?.data?.error || "Failed to create order" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch order items for a specific order
  fetchOrderItems: async (order_id) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/order-items/${order_id}`, "GET", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ orderItems: data });
      return data;
    } catch (err) {
      console.error("Failed to fetch order items:", err);
      set({ error: err.response?.data?.error || "Failed to fetch order items" });
    } finally {
      set({ loading: false });
    }
  },

  // Create order items
  createOrderItem: async (payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const data = await request("/api/order-items", "POST", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ orderItems: [...state.orderItems, data] }));
      return data;
    } catch (err) {
      console.error("Failed to create order item:", err);
      set({ error: err.response?.data?.error || "Failed to create order item" });
    } finally {
      set({ loading: false });
    }
  },
}));
