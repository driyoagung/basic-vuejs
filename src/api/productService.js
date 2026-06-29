// ============================================================
// productService.js — Product API Service
// [MATERI FASE 4: API SERVICE LAYER (Best Practice)]
// Memisahkan logika HTTP request dari store/komponen agar
// mudah di-maintain dan di-test secara terpisah.
// ============================================================
import api from './index'

export const productService = {
  // GET /products
  getAll: async (params = {}) => {
    const { data } = await api.get('/products', { params })
    return data.data ?? data
  },

  // GET /products/:id
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data.data ?? data
  },

  // POST /products
  create: async (payload) => {
    const { data } = await api.post('/products', payload)
    return data.data ?? data
  },

  // PUT /products/:id
  update: async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload)
    return data.data ?? data
  },

  // DELETE /products/:id
  delete: async (id) => {
    await api.delete(`/products/${id}`)
  },
}
