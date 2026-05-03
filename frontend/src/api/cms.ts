import api from './client'

export const cmsApi = {
  get: () => api.get('/settings').then(res => res.data),
  updateSettings: (data: any) => api.post('/settings', data).then(res => res.data),
  
  // Pages
  getPage: (slug: string) => api.get(`/pages/${slug}`).then(res => res.data),
  getPages: () => api.get('/pages').then(res => res.data),
  updatePage: (id: number, data: any) => api.put(`/pages/${id}`, data).then(res => res.data),
  
  // FAQs
  getFaqs: () => api.get('/faqs').then(res => res.data),
  updateFaqs: (data: any) => api.post('/faqs', data).then(res => res.data),
}
