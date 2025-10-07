// store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "../util/request";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // This calls the updated request utility
          const res = await request("/login", "POST", { email, password }); 
          const { user, token } = res || {};
          if (!user || !token) {
            // Check for malformed success response
            throw new Error("Invalid login response. Please try again.");
          }
          set({ user, token });
          return { user, token };
        } catch (err) {
          let errorMsg = "Login failed";

          // --- Improved Error Handling for 500 Status ---
          if (err.response?.status === 500) {
            errorMsg = "Server error. Please try again or contact support.";
          } else {
            // Fallback for 4xx errors, network errors, etc.
            errorMsg = err?.response?.data?.error || err.message || errorMsg;
          }
          // ---------------------------------------------
          
          set({ error: errorMsg });
          throw new Error(errorMsg);
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          // Note: The /logout endpoint doesn't strictly need the token, 
          // but the interceptor will add it anyway.
          await request("/logout", "POST"); 
        } catch (err) {
          console.warn("Logout request failed:", err);
        } finally {
          set({ user: null, token: null });
        }
      },

      getToken: () => get().token,

      fetchUser: async () => {
        try {
          const res = await request("/me", "GET");
          set({ user: res.user });
        } catch (err) {
          console.error("Failed to fetch user:", err);
          get().logout();
        }
      },

      refreshToken: async () => {
        try {
          const res = await request("/refresh", "POST");
          set({ token: res.token });
          return res.token;
        } catch (err) {
          console.error("Token refresh failed:", err);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);