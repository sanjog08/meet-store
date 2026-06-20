/**
 * Cart Store (Zustand)
 *
 * Client-side shopping cart — placeholder for future backend integration.
 * Cart data is persisted to localStorage so items survive page refreshes.
 *
 * When the backend adds cart/order endpoints, the mutations here
 * should be replaced with API calls.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ product, quantity }]

      /** Add product or increment quantity if already in cart */
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.product._id === product._id);

        if (existing) {
          set({
            items: items.map((i) =>
              i.product._id === product._id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      /** Remove item completely from cart */
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product._id !== productId) }),

      /** Update quantity — removes item if quantity reaches 0 */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i,
          ),
        });
      },

      /** Clear all items */
      clearCart: () => set({ items: [] }),

      /** Derived: total number of items (sum of quantities) */
      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      /** Derived: total price */
      get totalPrice() {
        return get().items.reduce(
          (sum, i) => sum + (i.product.price || 0) * i.quantity,
          0,
        );
      },
    }),
    {
      name: 'shopvault-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Selectors */
export const selectCartItems = (state) => state.items;
export const selectItemCount = (state) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectTotalPrice = (state) =>
  state.items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
export const selectIsInCart = (productId) => (state) =>
  state.items.some((i) => i.product._id === productId);
