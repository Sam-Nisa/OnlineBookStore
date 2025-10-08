"use client";
import { create } from "zustand";
import { request } from "../utils/request";
import { useAuthStore } from "./authStore";

export const useWishlistStore = create((set, get) => ({
  wishlists: [], // array of book IDs
  loading: false,
  error: null,

  // Fetch wishlist for current user
  fetchWishlists: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return; // no need to fetch if user not logged in

    set({ loading: true, error: null });
    try {
      const data = await request("/api/wishlists", "GET", {}, { headers: { Authorization: `Bearer ${token}` } });
      // store only book IDs for quick lookup
      set({ wishlists: data.map(item => item.book_id) });
    } catch (err) {
      console.error("Failed to fetch wishlists:", err);
      set({ error: err.response?.data?.error || "Failed to fetch wishlists" });
    } finally {
      set({ loading: false });
    }
  },

  // Add a book to wishlist
  addWishlist: async (book_id) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      await request("/api/wishlists", "POST", { book_id }, { headers: { Authorization: `Bearer ${token}` } });
      set(state => ({ wishlists: [...state.wishlists, book_id] }));
    } catch (err) {
      console.error("Failed to add wishlist:", err);
      set({ error: err.response?.data?.error || "Failed to add wishlist" });
    } finally {
      set({ loading: false });
    }
  },

  // Remove a book from wishlist
  removeWishlist: async (book_id) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    try {
      await request(`/api/wishlists/${book_id}`, "DELETE", {}, { headers: { Authorization: `Bearer ${token}` } });
      set(state => ({ wishlists: state.wishlists.filter(id => id !== book_id) }));
    } catch (err) {
      console.error("Failed to remove wishlist:", err);
      set({ error: err.response?.data?.error || "Failed to remove wishlist" });
    } finally {
      set({ loading: false });
    }
  },

  // Check if a book is in wishlist
  isWishlisted: (book_id) => {
    const { wishlists } = get();
    return wishlists.includes(book_id);
  },
}));
