# Pinia — State Management

## Apa itu State Management (Pinia)?

Saat aplikasi semakin besar, banyak komponen berbeda membutuhkan akses ke data (state) yang sama. 

Contoh: 
- `Navbar` perlu tau apakah User sudah login.
- `Sidebar` perlu tau Role User.
- `Halaman Profil` perlu tau Detail User.

Daripada melempar data naik-turun menggunakan *Props* dan *Emit* berlapis-lapis (Prop Drilling), kita gunakan **Pinia**. 

Pinia adalah penyimpan data (Store) terpusat, resmi dari Vue (pengganti Vuex). Bayangkan Pinia sebagai *database lokal* di dalam browsermu. Segala komponen bisa membaca dan menulis data ke sana secara langsung.

## 1. Setup Pinia (Otomatis via Vite)

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia()) // Pasang Pinia
app.mount('#app')
```

## 2. Mendefinisikan Store

Store adalah tempat kita menampung data (state), membuat kalkulasi (getters), dan membuat fungsi pengubah data (actions).

Kita akan membuat store dengan **Setup Syntax** (sangat mirip dengan syntax Komponen Composition API!).

```js
// src/stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Argumen 1: Nama Store yang unik (id)
// Argumen 2: Setup function
export const useCounterStore = defineStore('counter', () => {
  
  // 1. STATE (Data) = ref() atau reactive()
  const count = ref(0)
  const namaPemain = ref('Agung')

  // 2. GETTERS (Nilai Turunan) = computed()
  const doubleCount = computed(() => count.value * 2)
  const isSelesai = computed(() => count.value >= 10)

  // 3. ACTIONS (Fungsi Pengubah) = functions
  function increment() {
    count.value++
  }

  function decrement() {
    if (count.value > 0) count.value--
  }

  function reset() {
    count.value = 0
  }

  // Wajib RETURN apa saja yang mau dibagikan ke komponen luar
  return { 
    count, 
    namaPemain, 
    doubleCount, 
    isSelesai, 
    increment, 
    decrement, 
    reset 
  }
})
```

## 3. Menggunakan Store di Komponen

```vue
<!-- TampilanHitung.vue -->
<script setup>
// 1. Import definisi Store
import { useCounterStore } from '@/stores/counter'

// 2. Buat instance Store
const store = useCounterStore()

// State dan Getters BISA dibaca langsung: store.count
// Actions BISA dipanggil langsung: store.increment()
</script>

<template>
  <div class="card">
    <h2>Pemain: {{ store.namaPemain }}</h2>
    <p>Skor: {{ store.count }}</p>
    <p>Skor x2: {{ store.doubleCount }}</p>
    <p v-if="store.isSelesai" style="color: red">MENANG!</p>

    <!-- Tombol Action -->
    <button @click="store.increment()">+1</button>
    <button @click="store.decrement()">-1</button>
    <button @click="store.reset()">Reset</button>
  </div>
</template>
```

## 4. Destructuring (Membongkar) Store

Mengetik `store.count`, `store.nama` terus menerus kadang melelahkan. Bisakah kita "bongkar" objectnya?

::: danger JANGAN Destructure Langsung!
```js
// ❌ SALAH: Destructuring ini akan menghilangkan sifat REACTIVE!
const { count, doubleCount } = useCounterStore() 
```
:::

### Solusi 1: `storeToRefs` untuk State/Getters

Untuk mengekstrak **State** dan **Getters** dengan aman, gunakan fungsi bantuan dari pinia yaitu `storeToRefs`.

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ✅ BENAR: State & Getters ditarik via storeToRefs
const { count, namaPemain, doubleCount } = storeToRefs(store)

// ✅ BENAR: Actions adalah function biasa, jadi boleh di-destructure normal
const { increment, reset } = store
</script>

<template>
  <div>
    <!-- Lebih bersih di template! -->
    <p>{{ namaPemain }}: {{ count }} (x2 = {{ doubleCount }})</p>
    
    <button @click="increment">+</button>
    <button @click="reset">0</button>
  </div>
</template>
```

## 5. Merubah State Tanpa Action

Berbeda dengan Vuex (jika kamu pernah belajar Vuex), Pinia mengizinkan komponen untuk **mengubah state secara langsung** tanpa harus memanggil `action` terlebih dahulu!

Namun, memanggil `action` tetap direkomendasikan untuk logika yang rumit agar lebih mudah dilacak.

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()

const cheatMode = () => {
  // SAH: Merubah state secara langsung!
  store.count = 99
  store.namaPemain = 'Hacker'
}
</script>

<template>
  <!-- SAH: Bind form input langsung ke state! (Two-Way Binding Store) -->
  <input v-model="store.namaPemain" placeholder="Ganti Nama" />
  
  <button @click="cheatMode">Cheat</button>
</template>
```

## Kesimpulan Pinia Dasar
- Pinia Setup Syntax sama persis dengan Setup Component.
- State = `ref()` / `reactive()`
- Getters = `computed()`
- Actions = Function biasa (bisa async).
- Ekstrak state harus pakai `storeToRefs`.
- State boleh diubah secara langsung dari manapun.
