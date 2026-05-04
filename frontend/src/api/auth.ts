import api from './client'

export interface LoginCredentials {
  email: string
  password: string
  turnstile?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  turnstile?: string
}

export const authApi = {
  login: (data: any) => api.post('/login', data).then(res => res.data),
  adminLogin: (data: any) => api.post('/admin/login', data).then(res => res.data),
  register: (data: any) => api.post('/register', data).then(res => res.data),
  logout: () => api.post('/logout').then(res => res.data),
  me: () => api.get('/me').then(res => res.data),
  verify2FALogin: (data: any) => api.post('/2fa/verify-login', data).then(res => res.data),
}
