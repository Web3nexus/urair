import api from './client'

export interface Category {
  id: number
  name: string
  slug: string
  parent_id?: number
  children?: Category[]
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  old_price: number | null
  description: string
  images: string[]
  category?: Category
  brand?: Brand
  stock: number
  rating: number
  promotion_badge?: string
}

export const productsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<Product[]>('/products', { params }).then(res => res.data),

  getBySlug: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then(res => res.data),

  getCategories: () =>
    api.get<Category[]>('/categories').then(res => res.data),

  getBrands: () =>
    api.get<Brand[]>('/brands').then(res => res.data),

  getFeatured: () =>
    api.get<Product[]>('/products', { params: { is_featured: 1 } }).then(res => res.data),
}
