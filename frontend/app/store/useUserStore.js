import { create } from "zustand";
import { request } from "../utils/request";
import { useAuthStore } from "./authStore";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No token available" });
      return [];
    }

    set({ loading: true, error: null });
    try {
      const data = await request("/api/users", "GET", {}, {}, token);
      set({ users: data });
      return data;
    } catch (err) {
      console.error("Failed to fetch users:", err);
      set({ error: err.response?.data?.error || "Failed to fetch users" });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single user by ID
// Fetch single user by ID
fetchUserById: async (id) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    set({ error: "No token available" });
    return null;
  }

  set({ loading: true, error: null });
  try {
    const data = await request(`/api/users/${id}`, "GET", {}, {}, token);
    return data || null;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    set({ error: err.response?.data?.error || "Failed to fetch user" });
    return null;
  } finally {
    set({ loading: false });
  }
},



  // Update user by ID
  updateUser: async (id, payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/users/${id}`, "PUT", payload, {}, token);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? data : u)),
      }));
      return data;
    } catch (err) {
      console.error("Failed to update user:", err);
      set({ error: err.response?.data?.error || "Failed to update user" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Delete user by ID
  deleteUser: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return false;

    set({ loading: true, error: null });
    try {
      await request(`/api/users/${id}`, "DELETE", {}, {}, token);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
      return true;
    } catch (err) {
      console.error("Failed to delete user:", err);
      set({ error: err.response?.data?.error || "Failed to delete user" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Approve user to author
  approveUser: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/users/${id}/approve`, "PUT", {}, {}, token);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? data : u)),
      }));
      return data;
    } catch (err) {
      console.error("Failed to approve user:", err);
      set({ error: err.response?.data?.error || "Failed to approve user" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
