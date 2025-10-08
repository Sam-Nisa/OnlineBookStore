import { create } from "zustand";
import { request } from "../utils/request";
import { useAuthStore } from "./authStore";

export const useGenreStore = create((set, get) => ({
  genres: [],
  loading: false,
  error: null,

// Fetch all genres (public)
fetchGenres: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/api/genres", "GET"); // no token needed
      set({ genres: data });
    } catch (err) {
      console.error("Failed to fetch genres:", err);
      set({ error: err.response?.data?.error || "Failed to fetch genres" });
    } finally {
      set({ loading: false });
    }
  },
  
  // Fetch single genre by ID
  fetchGenreById: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: "No token available" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/genres/${id}`, "GET", {}, { headers: { Authorization: `Bearer ${token}` } });
      return data;
    } catch (err) {
      console.error("Failed to fetch genre:", err);
      set({ error: err.response?.data?.error || "Failed to fetch genre" });
    } finally {
      set({ loading: false });
    }
  },

  // Create new genre
  createGenre: async (payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      const data = await request("/api/genres", "POST", payload, { headers: { Authorization: `Bearer ${token}` } });
      set((state) => ({
        genres: [...state.genres, data],
      }));
      return data;
    } catch (err) {
      console.error("Failed to create genre:", err);
      set({ error: err.response?.data?.error || "Failed to create genre" });
    } finally {
      set({ loading: false });
    }
  },

  // Update genre by ID
  updateGenre: async (id, payload) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      const data = await request(`/api/genres/${id}`, "PUT", payload, { headers: { Authorization: `Bearer ${token}` } });
      set((state) => ({
        genres: state.genres.map((g) => (g.id === id ? data : g)),
      }));
      return data;
    } catch (err) {
      console.error("Failed to update genre:", err);
      set({ error: err.response?.data?.error || "Failed to update genre" });
    } finally {
      set({ loading: false });
    }
  },

  // Delete genre by ID
  deleteGenre: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      await request(`/api/genres/${id}`, "DELETE", {}, { headers: { Authorization: `Bearer ${token}` } });
      set((state) => ({
        genres: state.genres.filter((g) => g.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete genre:", err);
      set({ error: err.response?.data?.error || "Failed to delete genre" });
    } finally {
      set({ loading: false });
    }
  },
}));
