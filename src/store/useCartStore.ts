import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // unique ID for the cart line item
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant: {
        size: string;
        color: string;
        type?: string;
    };
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    activeQuickViewProduct: string | null;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
    openQuickView: (productId: string) => void;
    closeQuickView: () => void;
    getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            activeQuickViewProduct: null,

            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            addItem: (item) => {
                set((state) => {
                    // Check if identical item (same product, same variants) exists
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.productId === item.productId &&
                            i.variant.size === item.variant.size &&
                            i.variant.color === item.variant.color &&
                            i.variant.type === item.variant.type
                    );

                    if (existingItemIndex > -1) {
                        const updatedItems = [...state.items];
                        updatedItems[existingItemIndex].quantity += item.quantity;
                        return { items: updatedItems };
                    }

                    return { items: [...state.items, { ...item, id: Math.random().toString(36).substr(2, 9) }] };
                });
                get().openCart();
            },

            removeItem: (id) => set((state) => ({
                items: state.items.filter((item) => item.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),

            clearCart: () => set({ items: [] }),

            openQuickView: (productId) => set({ activeQuickViewProduct: productId }),
            closeQuickView: () => set({ activeQuickViewProduct: null }),

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'badare-cart',
            partialize: (state) => ({ items: state.items }), // Only persist items
        }
    )
);
