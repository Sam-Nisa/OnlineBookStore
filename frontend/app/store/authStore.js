import { create } from "zustand";
import { request } from "../utils/request";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null, // use sessionStorage
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await request("/api/login", "POST", { email, password });
      set({ user: data.user, token: data.token });
      if (typeof window !== "undefined") sessionStorage.setItem("token", data.token); // sessionStorage
      return data;
    } catch (err) {
      set({ error: err.response?.data?.error || "Login failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const token = get().token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      await request("/api/logout", "POST", {}, {}, token);
      set({ user: null, token: null });
      if (typeof window !== "undefined") sessionStorage.removeItem("token"); // sessionStorage
    } catch (err) {
      set({ error: "Logout failed" });
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    const token = get().token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const data = await request("/api/profile", "GET", {}, {}, token);
      set({ user: data });
    } catch (err) {
      set({ error: "Failed to fetch profile" });
    } finally {
      set({ loading: false });
    }
  },

  register: async (name, email, password, password_confirmation) => {
    set({ loading: true, error: null });
    try {
      const data = await request("/api/register", "POST", {
        name,
        email,
        password,
        password_confirmation,
      });
      set({ user: data.user, token: data.token });
      if (typeof window !== "undefined") sessionStorage.setItem("token", data.token); // sessionStorage
    } catch (err) {
      set({ error: err.response?.data?.error || "Registration failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
