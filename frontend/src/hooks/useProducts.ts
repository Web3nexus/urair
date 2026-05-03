import { useQuery } from '@tanstack/react-query'
import { productsApi, type Product } from '@/api/products'

export function useProducts(params?: Record<string, string | number>) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
  })
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeatured(),
    staleTime: 1000 * 60 * 5, // 5 min cache — featured list changes rarely
  })
}
