# Composables (Custom Hooks)

Composables adalah konsep terpenting dalam penggunaan Composition API (`<script setup>`).

## Apa itu Composable?

Composable adalah sebuah fungsi (function) yang memanfaatkan fitur Reactivity Vue (`ref`, `computed`, `watch`, lifecycle hooks) untuk **mengisolasi logic agar bisa dipakai ulang (reusable) di banyak komponen**.

Dalam framework React, ini mirip dengan *Custom Hooks*.

Konvensi standar Vue adalah memberi nama file dan fungsi dengan awalan `use`, misalnya: `useCounter`, `useFetch`, `useAuth`.

## Masalah yang Diselesaikan

Seringkali kita punya logika yang sama di beberapa komponen:
- Melakukan format dan kalkulasi data.
- Event listener mouse atau window resize.
- Memanggil API (fetch).
- LocalStorage logic.

Jika logika ini ditulis di setiap komponen, kode akan menumpuk (WET - Write Everything Twice). Dengan composable, logika tersebut dipisah ke file JS sendiri (DRY - Don't Repeat Yourself).

## 1. Membuat Composable Dasar: `useCounter`

Daripada menulis logika counter (tambah, kurang, reset) di dalam komponen, mari buat composablenya.

```js
// src/composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // 1. Definisikan state yang reactive
  const count = ref(initialValue)
  
  // 2. Definisikan computed properties
  const doubleCount = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)
  
  // 3. Definisikan aksi (methods)
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => { count.value = initialValue }

  // 4. Return apa saja yang dibutuhkan oleh komponen yang memakainya
  return { 
    count, 
    doubleCount, 
    isPositive, 
    increment, 
    decrement, 
    reset 
  }
}
```

### Menggunakan Composable

Di dalam komponen, kita cukup import dan panggil fungsinya.

```vue
<!-- App.vue -->
<script setup>
import { useCounter } from '@/composables/useCounter'

// Destructure (ambil) yang kita butuhkan dari composable
const { count, doubleCount, increment, reset } = useCounter(10)
</script>

<template>
  <div>
    <p>Angka: {{ count }}</p>
    <p>Angka x2: {{ doubleCount }}</p>
    
    <button @click="increment">Tambah</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

Kini, komponen lain yang butuh counter bisa memanggil fungsi `useCounter()` yang sama, dan masing-masing komponen akan mendapat `count` statenya sendiri secara independen.

## 2. Composable dengan Lifecycle: `useMouse`

Composable sangat hebat karena dia boleh memakai Lifecycle Hooks (`onMounted`, `onUnmounted`) di dalam file `.js` murni!

```js
// src/composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const updatePosition = (event) => {
    x.value = event.clientX
    y.value = event.clientY
  }

  // Composable ini yang mengurus pasang/copot event listener!
  onMounted(() => {
    window.addEventListener('mousemove', updatePosition)
  })

  // Jangan lupa cleanup agar tak memory leak
  onUnmounted(() => {
    window.removeEventListener('mousemove', updatePosition)
  })

  return { x, y }
}
```

```vue
<!-- TrackingComponent.vue -->
<script setup>
import { useMouse } from '@/composables/useMouse'

// Komponen ini menjadi sangat bersih!
const { x, y } = useMouse()
</script>

<template>
  <p>Posisi Mouse: {{ x }}, {{ y }}</p>
</template>
```

## 3. Composable Lanjutan: `useFetch` (Caching & Abort)

Hampir setiap aplikasi butuh untuk mengambil data dari backend. Mari kita buat versi lanjutan dari `useFetch` yang dilengkapi dengan **Caching** (agar tidak fetch berulang kali) dan **AbortController** (membatalkan request jika komponen keburu ditutup/unmount).

```js
// src/composables/useFetch.js
import { ref, isRef, unref, watchEffect, onUnmounted } from 'vue'

// Cache sederhana di luar fungsi agar bertahan antar-komponen
const cache = new Map()

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  let abortController = null

  const doFetch = async () => {
    // 1. Bersihkan request sebelumnya jika masih berjalan
    if (abortController) {
      abortController.abort()
    }
    
    // Buat controller baru untuk request ini
    abortController = new AbortController()
    const urlValue = unref(url) 

    // 2. Cek Cache! Jika ada, pakai cache, tidak usah hit API
    if (cache.has(urlValue)) {
      data.value = cache.get(urlValue)
      return // Berhenti di sini
    }

    loading.value = true
    error.value = null
    data.value = null
    
    try {
      // 3. Taruh signal dari controller ke fetch
      const response = await fetch(urlValue, { signal: abortController.signal })
      if (!response.ok) throw new Error('Data gagal diambil!')
      
      const result = await response.json()
      data.value = result
      
      // 4. Simpan hasil ke cache
      cache.set(urlValue, result)
      
    } catch (err) {
      // Abaikan error jika penyebabnya adalah dibatalkan sengaja (aborted)
      if (err.name === 'AbortError') return
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    doFetch()
  })

  // 5. Cleanup: Batalkan request yang masih jalan jika komponen dihancurkan!
  onUnmounted(() => {
    if (abortController) abortController.abort()
  })

  return { data, error, loading, refetch: doFetch }
}
```

```vue
<!-- UserProfile.vue -->
<script setup>
import { ref } from 'vue'
import { useFetch } from '@/composables/useFetch'

const userId = ref(1)

// URL string dibuat reaktif. 
// Jika userId.value berubah, useFetch otomatis nembak API lagi!
const url = computed(() => `https://api.example.com/users/${userId.value}`)

const { data: user, loading, error } = useFetch(url)
</script>

<template>
  <div class="profile-card">
    <button @click="userId++">User Selanjutnya</button>
    
    <div v-if="loading">Loading data...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="user">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>
```

## Kesimpulan
- Composables memisahkan "Kode Tampilan" (UI) dengan "Kode Bisnis Logik" (Logic).
- Sangat mempermudah testing dan penggunakan ulang (reusable).
- Bisa mengakses fitur Vue (Reactivity, Lifecycle) meski diluar file `.vue`.
- Selalu awali nama fungsinya dengan `use...`.
