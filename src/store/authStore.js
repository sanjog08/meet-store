/**
 * Auth Store (Zustand)
 *
 * Persists user, accessToken, and refreshToken to localStorage so the
 * user stays logged in across page refreshes.
 *
 * The Axios interceptor in api.js reads from this store directly
 * (useAuthStore.getState()) — no React context needed.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      /** Called after a successful login or signup */
      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      /** Update tokens (e.g., after a silent refresh) */
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      /** Update user data (e.g., after profile edit) */
      setUser: (user) => set({ user }),

      /** Clear all auth state — called on logout */
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'shopvault-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist what is needed — not ephemeral UI state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/** Convenience selectors */
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectIsAdmin = (state) => state.user?.role === 'admin';
export const selectAccessToken = (state) => state.accessToken;
