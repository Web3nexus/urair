import api from './client'

export interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  quantity: number
  image: string
}

export const cartApi = {
  get: () =>
    api.get<CartItem[]>('/cart'),

  add: (productId: number, quantity = 1) =>
    api.post('/cart', { product_id: productId, quantity }),

  update: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),

  remove: (itemId: number) =>
    api.delete(`/cart/${itemId}`),

  clear: () =>
    api.delete('/cart'),
}
