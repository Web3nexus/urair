import api from './client'

export const curationsApi = {
  getAll: () => api.get('/curations').then(res => res.data),
  getBySlug: (slug: string) => api.get(`/curations/${slug}`).then(res => res.data),
}
