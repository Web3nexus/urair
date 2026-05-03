import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  role?: 'admin' | 'user'
  phone?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  
  setAuth: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      setAuth: (user, token) => {
        localStorage.setItem('urair_token', token)
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isAdmin: user.email === 'admin@urair.com' || user.role === 'admin' 
        })
      },

      logout: () => {
        localStorage.removeItem('urair_token')
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false })
      },

      checkAuth: () => {
        const token = localStorage.getItem('urair_token')
        if (!token) {
          get().logout()
        }
      }
    }),
    {
      name: 'urair-auth-storage',
    }
  )
)
