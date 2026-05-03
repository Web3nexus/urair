import api from './client'

export interface OrderPayload {
  items: { product_id: number; quantity: number }[]
  total_price?: number
  shipping_address: string
  payment_method: string
  payment_reference?: string
}

export const ordersApi = {
  create: (data: OrderPayload) => api.post('/orders', data).then(res => res.data),
  getMyOrders: () => api.get('/my-orders').then(res => res.data),
}
