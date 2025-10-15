import { create } from "zustand";
import { request } from "../utils/request";
import { useRouter } from "next/navigation";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null, // sessionStorage
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await request("/api/login", "POST", { email, password });
      set({ user: data.user, token: data.token });
      if (typeof window !== "undefined") sessionStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      set({ error: err.response?.data?.error || "Login failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: async (redirect = true) => {
    const token = get().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      await request("/api/logout", "POST", {}, {}, token);

      // Clear auth state
      set({ user: null, token: null });
      if (typeof window !== "undefined") sessionStorage.removeItem("token");

      // Redirect to login page if requested
      if (redirect && typeof window !== "undefined") {
        window.location.href = "/login"; // Using window.location to ensure full page reset
      }
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
      const response = await request("/api/profile", "GET", {}, {}, token);
      set({ user: response.data }); // store only the 'data' object
    } catch (err) {
      set({ error: err?.message || "Failed to fetch profile" });
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
      if (typeof window !== "undefined") sessionStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      set({ error: err.response?.data?.error || "Registration failed" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
