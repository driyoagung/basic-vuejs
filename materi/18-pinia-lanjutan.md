# Bab 18: Pinia — Lanjutan

## 1️⃣ $patch — Update Batch

```js
const store = useTodoStore()

// Update beberapa state sekaligus
store.$patch({
  filter: 'aktif',
})

// Atau dengan function (untuk array manipulation)
store.$patch((state) => {
  state.todos.push({ id: Date.now(), teks: 'Baru', selesai: false })
  state.filter = 'semua'
})
```

---

## 2️⃣ $subscribe — Watch Store Changes

```js
const store = useTodoStore()

store.$subscribe((mutation, state) => {
  // Simpan ke localStorage setiap kali state berubah
  localStorage.setItem('todos', JSON.stringify(state.todos))
})
```

---

## 3️⃣ Persist State ke LocalStorage

```js
// src/stores/settings.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Load dari localStorage
  const saved = JSON.parse(localStorage.getItem('app-settings') || '{}')
  
  const tema = ref(saved.tema || 'light')
  const bahasa = ref(saved.bahasa || 'id')

  // Auto-save
  watch([tema, bahasa], () => {
    localStorage.setItem('app-settings', JSON.stringify({
      tema: tema.value,
      bahasa: bahasa.value,
    }))
  })

  function toggleTema() {
    tema.value = tema.value === 'light' ? 'dark' : 'light'
  }

  return { tema, bahasa, toggleTema }
})
```

---

## 4️⃣ Store dengan API (Fullstack Pattern)

```js
// src/stores/product.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalProducts = computed(() => products.value.length)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get('/api/products')
      products.value = data.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  async function createProduct(form) {
    const { data } = await axios.post('/api/products', form)
    products.value.push(data.data)
  }

  async function deleteProduct(id) {
    await axios.delete(`/api/products/${id}`)
    products.value = products.value.filter(p => p.id !== id)
  }

  return {
    products, loading, error, totalProducts,
    fetchProducts, createProduct, deleteProduct,
  }
})
```

> 💡 Ini adalah pattern yang akan kita gunakan di Fase 4 saat consume API Laravel!

---

## 5️⃣ Menggunakan Store di Luar Component

```js
// Di router guard
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})
```

---

**Sebelumnya:** [← Bab 17 — Pinia](./17-pinia.md)
**Selanjutnya:** [Bab 19 — HTTP Request dengan Axios →](./19-axios.md)
