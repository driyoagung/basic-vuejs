// ============================================================
// api/index.js — Axios Instance + Interceptors
// [MATERI FASE 4: AXIOS]
// [MATERI FASE 4: REFRESH TOKEN LOGIC]
// ============================================================
import axios from 'axios'

// Base URL dari environment variable
// Ganti dengan URL backend Laravel Anda di file .env
// VITE_API_URL=http://localhost:8000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  // [MATERI FASE 5: KEAMANAN SPA — withCredentials]
  // Wajib true agar browser mengirim cookie (session/XSRF) ke backend Laravel Sanctum.
  withCredentials: true,
})

// -------------------------------------------------------
// REQUEST INTERCEPTOR
// [MATERI FASE 4: AXIOS INTERCEPTORS]
// Interceptor ini otomatis menambahkan Authorization header
// ke setiap request yang dikirim ke API.
// -------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// -------------------------------------------------------
// RESPONSE INTERCEPTOR — Refresh Token Logic
// [MATERI FASE 4: REFRESH TOKEN]
// Jika API merespons dengan 401 (Unauthorized), kita coba
// minta token baru secara otomatis (silent refresh),
// lalu ulangi request yang gagal tadi.
// -------------------------------------------------------
let isRefreshing  = false
let failedQueue   = [] // antrian request yang gagal selama refresh berlangsung

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response, // jika sukses, teruskan respons
  async (error) => {
    const originalRequest = error.config

    // Hanya tangani jika 401 dan belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan ke antrian
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post('/auth/refresh')
        const newToken = data.access_token

        localStorage.setItem('auth_token', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest) // ulangi request asli
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login' // paksa logout
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
