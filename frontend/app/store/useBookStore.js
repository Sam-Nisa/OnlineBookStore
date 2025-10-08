import { create } from "zustand";
import { request } from "../utils/request";
import { useAuthStore } from "./authStore";

export const useBookStore = create((set, get) => ({
  books: [],
  loading: false,
  error: null,

  // Fetch all books (public, no token needed)
  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/api/books", "GET"); // public endpoint

      const booksWithFullImage = data.map((b) => ({
        ...b,
        cover_image: b.cover_image
          ? `${process.env.NEXT_PUBLIC_API_URL}${b.cover_image}`
          : null,
      }));

      set({ books: booksWithFullImage });
    } catch (err) {
      console.error("Failed to fetch books:", err);
      set({ error: err.response?.data?.error || "Failed to fetch books" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch a single book by ID
  fetchBook: async (id) => {
    try {
      const data = await request(`/api/books/${id}`, "GET"); // No token needed if public
      if (!data) return null;
      return {
        ...data,
        cover_image: data.cover_image
          ? `${process.env.NEXT_PUBLIC_API_URL}${data.cover_image}`
          : null,
      };
    } catch (err) {
      console.error("Failed to fetch book:", err);
      return null;
    }
  },
  
  // Create book
  createBook: async (bookData) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach((key) => {
        if (bookData[key] !== undefined && bookData[key] !== null) {
          formData.append(key, bookData[key]);
        }
      });

      const data = await request("/api/books", "POST", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      const newBook = {
        ...data.book,
        cover_image: data.book.cover_image
          ? `${process.env.NEXT_PUBLIC_API_URL}${data.book.cover_image}`
          : null,
      };

      set((state) => ({ books: [...state.books, newBook] }));
      return newBook;
    } catch (err) {
      console.error("Failed to create book:", err);
      set({ error: err.response?.data?.error || "Failed to create book" });
    } finally {
      set({ loading: false });
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });

    try {
      const formData = new FormData();

      Object.keys(bookData).forEach((key) => {
        const value = bookData[key];
        if (key === "cover_image" && value instanceof File) {
          formData.append(key, value);
        } else if (key !== "cover_image" && value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Laravel method spoofing
      formData.append("_method", "PUT");

      const data = await request(`/api/books/${id}`, "POST", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedBook = {
        ...data.book,
        cover_image: data.book.cover_image
          ? `${process.env.NEXT_PUBLIC_API_URL}${data.book.cover_image}`
          : null,
      };

      set((state) => ({
        books: state.books.map((b) => (b.id === id ? updatedBook : b)),
      }));

      return updatedBook;
    } catch (err) {
      console.error("Failed to update book:", err);
      set({ error: err.response?.data?.error || "Failed to update book" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Delete book
  deleteBook: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return set({ error: "No token available" });

    set({ loading: true, error: null });
    try {
      await request(`/api/books/${id}`, "DELETE", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        books: state.books.filter((b) => b.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete book:", err);
      set({ error: err.response?.data?.error || "Failed to delete book" });
    } finally {
      set({ loading: false });
    }
  },
}));
