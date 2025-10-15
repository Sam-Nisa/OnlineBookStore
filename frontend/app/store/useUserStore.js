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
      const response = await request("/api/users", "GET", {}, {}, token);
      const usersData = response.data?.data || []; // extract data from backend
      set({ users: usersData });
      return usersData;
    } catch (err) {
      console.error("Failed to fetch users:", err);
      set({ error: err.response?.data?.error || err.message || "Failed to fetch users" });
      return [];
    } finally {
      set({ loading: false });
    }
  },

fetchUserById: async (id) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    set({ error: "No token available" });
    return null;
  }

  set({ loading: true, error: null });
  try {
    const response = await request(`/api/users/${id}`, "GET", {}, {}, token);
    // API returns { success: true, data: {...} }
    if (response && response.success) {
      return response.data; // return only the user object
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    set({ error: err.response?.data?.error || "Failed to fetch user" });
    return null;
  } finally {
    set({ loading: false });
  }
},

  

updateUser: async (id, payload) => {
  const token = useAuthStore.getState().token;
  if (!token) return null;

  set({ loading: true, error: null });

  try {
    let headers = {};
    let body = payload;

    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(payload);
    } else {
      // For FormData with PUT, some servers need _method=PUT
      payload.append("_method", "PUT");
    }

    const data = await request(`/api/users/${id}`, "POST", body, headers, token);

    set((state) => ({
      users: state.users.map((u) => (u.id === id ? data.data || data : u)),
    }));

    return data.data || data;
  } catch (err) {
    console.error("Failed to update user:", err);
    set({ error: err.response?.data?.error || "Failed to update user" });
    return null;
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
      const response = await request(`/api/users/${id}/approve`, "PUT", {}, {}, token);
      const approvedUser = response.data?.data || response;
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? approvedUser : u)),
      }));
      return approvedUser;
    } catch (err) {
      console.error("Failed to approve user:", err);
      set({ error: err.response?.data?.error || "Failed to approve user" });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
