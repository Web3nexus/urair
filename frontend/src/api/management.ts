import api from './client'

export const productsApi = {
  getAll: () => api.get('/products').then(res => res.data),
  getOne: (id: number) => api.get(`/products/${id}`).then(res => res.data),
  create: (data: any) => api.post('/products', data).then(res => res.data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data).then(res => res.data),
  delete: (id: number) => api.delete(`/products/${id}`).then(res => res.data),
}

export const ordersApi = {
  getAll: () => api.get('/orders').then(res => res.data),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}`, { status }).then(res => res.data),
}

export const usersApi = {
  getAll: () => api.get('/users').then(res => res.data),
  delete: (id: number) => api.delete(`/users/${id}`).then(res => res.data),
}
