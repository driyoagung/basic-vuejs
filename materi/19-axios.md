# Bab 19: HTTP Request dengan Axios

## 📖 Kenapa Axios?

Axios adalah HTTP client yang lebih powerful dari `fetch()` — dengan interceptor, auto JSON parsing, error handling yang lebih baik.

---

## 1️⃣ Instalasi & Setup

```bash
npm install axios
```

### API Client Terpusat

```js
// src/lib/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor — tambah token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 2️⃣ CRUD Operations

```js
import api from '@/lib/axios'

// GET — ambil data
const getProducts = async () => {
  const { data } = await api.get('/products')
  return data // { data: [...], meta: {...} }
}

// GET dengan params
const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// POST — buat data baru
const createProduct = async (form) => {
  const { data } = await api.post('/products', {
    nama: form.nama,
    harga: form.harga,
    deskripsi: form.deskripsi,
  })
  return data
}

// PUT — update data
const updateProduct = async (id, form) => {
  const { data } = await api.put(`/products/${id}`, form)
  return data
}

// DELETE — hapus data
const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`)
}
```

---

## 3️⃣ Penggunaan di Component

```vue
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/axios'

const products = ref([])
const loading = ref(false)
const error = ref(null)

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/products')
    products.value = data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div v-if="loading">⏳ Loading...</div>
  <div v-else-if="error" class="error">❌ {{ error }}</div>
  <div v-else>
    <div v-for="p in products" :key="p.id">
      <h3>{{ p.nama }}</h3>
      <p>Rp {{ p.harga.toLocaleString() }}</p>
    </div>
  </div>
</template>
```

---

## 4️⃣ Composable: useApi

```js
// src/composables/useApi.js
import { ref } from 'vue'
import api from '@/lib/axios'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, data = null) => {
    loading.value = true
    error.value = null
    try {
      const res = await api({ method, url, data })
      return res.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const get = (url) => request('get', url)
  const post = (url, data) => request('post', url, data)
  const put = (url, data) => request('put', url, data)
  const del = (url) => request('delete', url)

  return { loading, error, get, post, put, del }
}
```

---

**Sebelumnya:** [← Bab 18 — Pinia Lanjutan](./18-pinia-lanjutan.md)
**Selanjutnya:** [Bab 20 — CRUD Fullstack →](./20-crud-fullstack.md)
