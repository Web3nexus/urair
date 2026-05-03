import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: number
  productId: number
  name: string
  slug: string
  price: number
  image: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (productId: number) => void
  toggle: (item: WishlistItem) => void
  isWishlisted: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.productId === item.productId)) return state
          return { items: [...state.items, item] }
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      toggle: (item) => {
        const exists = get().items.find((i) => i.productId === item.productId)
        exists ? get().removeItem(item.productId) : get().addItem(item)
      },

      isWishlisted: (productId) =>
        !!get().items.find((i) => i.productId === productId),
    }),
    { name: 'urair-wishlist' }
  )
)
