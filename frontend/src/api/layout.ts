import api from './client'

export const layoutApi = {
  get: () => api.get('/layout').then(res => res.data),
  updateNavigation: (data: any) => api.post('/layout/navigation', data).then(res => res.data),
  updateFooter: (data: any) => api.post('/layout/footer', data).then(res => res.data),
}
