import api from './client'

export const homepageApi = {
  get: () => api.get('/homepage').then(res => res.data),
  update: (data: any) => api.post('/homepage', data).then(res => res.data),
}
