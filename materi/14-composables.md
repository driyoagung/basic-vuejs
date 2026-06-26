# Bab 14: Composables (Custom Hooks)

## 📖 Apa itu Composable?

Composable adalah **fungsi yang mengenkapsulasi logic reactive** agar bisa di-reuse di banyak component. Ini adalah pattern utama Composition API.

Konvensi: nama file/fungsi diawali `use`, contoh: `useCounter`, `useFetch`.

---

## 1️⃣ Composable Pertama

```js
// src/composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubled = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => { count.value = initialValue }

  return { count, doubled, isPositive, increment, decrement, reset }
}
```

```vue
<!-- Gunakan di component manapun -->
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, doubled, increment, decrement, reset } = useCounter(10)
</script>

<template>
  <p>Count: {{ count }} (x2 = {{ doubled }})</p>
  <button @click="decrement">-</button>
  <button @click="reset">Reset</button>
  <button @click="increment">+</button>
</template>
```

---

## 2️⃣ useFetch — Composable untuk HTTP

```js
// src/composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const res = await fetch(toValue(url))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = await res.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch, dan re-fetch jika url berubah (jika url adalah ref)
  watchEffect(() => {
    fetchData()
  })

  return { data, error, loading, refetch: fetchData }
}
```

```vue
<script setup>
import { useFetch } from '@/composables/useFetch'

const { data: posts, loading, error } = useFetch(
  'https://jsonplaceholder.typicode.com/posts?_limit=5'
)
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error" style="color:red">{{ error }}</p>
  <ul v-else>
    <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
  </ul>
</template>
```

---

## 3️⃣ useLocalStorage — Persist Data

```js
// src/composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored ? JSON.parse(stored) : defaultValue)

  watch(data, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  return data
}
```

```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const tema = useLocalStorage('tema', 'light')
const nama = useLocalStorage('nama-user', '')
</script>

<template>
  <input v-model="nama" placeholder="Nama tersimpan di localStorage" />
  <button @click="tema = tema === 'light' ? 'dark' : 'light'">
    Toggle: {{ tema }}
  </button>
</template>
```

---

## 📁 Struktur Folder Composables

```
src/composables/
├── useCounter.js
├── useFetch.js
├── useLocalStorage.js
├── useToggle.js
└── useMouse.js
```

---

## 🧪 Latihan: useToggle & useMouse

```js
// useToggle.js
import { ref } from 'vue'

export function useToggle(initial = false) {
  const state = ref(initial)
  const toggle = () => { state.value = !state.value }
  const setTrue = () => { state.value = true }
  const setFalse = () => { state.value = false }
  return { state, toggle, setTrue, setFalse }
}
```

```js
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

---

**Sebelumnya:** [← Bab 13 — Lifecycle](./13-lifecycle.md)
**Selanjutnya:** [Bab 15 — Vue Router Dasar →](./15-vue-router-dasar.md)
