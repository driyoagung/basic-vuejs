# Bab 23: Error Handling & Loading State

## 1️⃣ Pattern Loading & Error

```vue
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/axios'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/products')
    data.value = res.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <!-- Loading Skeleton -->
  <div v-if="loading" class="skeleton">
    <div class="skeleton-line" v-for="n in 3" :key="n"></div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="error-card">
    <p>❌ {{ error }}</p>
    <button @click="fetchData">Coba Lagi</button>
  </div>

  <!-- Empty State -->
  <div v-else-if="data && data.length === 0" class="empty">
    <p>📭 Belum ada data</p>
  </div>

  <!-- Success -->
  <div v-else>
    <div v-for="item in data" :key="item.id">{{ item.nama }}</div>
  </div>
</template>

<style scoped>
.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

---

## 2️⃣ Toast Notifications

```js
// src/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  function show(message, type = 'info', duration = 3000) {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  const success = (msg) => show(msg, 'success')
  const errorToast = (msg) => show(msg, 'error')
  const warning = (msg) => show(msg, 'warning')

  return { toasts, show, success, error: errorToast, warning }
}
```

```vue
<!-- ToastContainer.vue -->
<script setup>
import { useToast } from '@/composables/useToast'
const { toasts } = useToast()
</script>

<template>
  <div class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      :class="['toast', `toast-${toast.type}`]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>
```

---

## 3️⃣ Form Validation Errors (dari Laravel)

```vue
<script setup>
import { ref } from 'vue'
import api from '@/lib/axios'

const form = ref({ nama: '', email: '' })
const errors = ref({})

const submit = async () => {
  errors.value = {}
  try {
    await api.post('/users', form.value)
  } catch (err) {
    if (err.response?.status === 422) {
      // Laravel validation errors
      errors.value = err.response.data.errors
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <input v-model="form.nama" placeholder="Nama" />
      <span v-if="errors.nama" class="field-error">{{ errors.nama[0] }}</span>
    </div>
    <div>
      <input v-model="form.email" placeholder="Email" />
      <span v-if="errors.email" class="field-error">{{ errors.email[0] }}</span>
    </div>
    <button type="submit">Simpan</button>
  </form>
</template>
```

---

**Sebelumnya:** [← Bab 22 — Upload File](./22-upload-file.md)
**Selanjutnya:** [Bab 24 — Reusable Patterns →](./24-reusable-pattern.md)
