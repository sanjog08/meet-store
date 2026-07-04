/**
 * UI Store (Zustand)
 * Manages ephemeral UI state — sidebar visibility, mobile menu, theme, etc.
 * Theme preference IS persisted to localStorage.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      isCartDrawerOpen: false,
      isSearchOpen: false,

      /** Theme: 'dark' | 'light' */
      theme: 'light',

      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () => set((s) => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),

      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      /** Toggle between dark and light theme */
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'meet-mobile-ui',
      storage: createJSONStorage(() => localStorage),
      // Only persist theme, not transient UI state
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
