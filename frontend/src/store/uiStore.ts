import { create } from 'zustand'

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  // Search overlay
  isSearchOpen: boolean
  openSearch: () => void
  closeSearch: () => void
  // Wishlist drawer
  isWishlistOpen: boolean
  openWishlist: () => void
  closeWishlist: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  isWishlistOpen: false,
  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
}))
