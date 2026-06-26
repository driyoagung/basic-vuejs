# Pinia — Lanjutan

## 1. Batch Update dengan `$patch`

Jika kamu ingin mengubah beberapa data di dalam Store **sekaligus**, jauh lebih efisien menggunakan method bawaan `$patch` daripada merubah satu per satu. Kenapa? Karena `$patch` hanya akan memicu re-render DOM **satu kali saja**, meskipun ada banyak state yang dirubah.

### Opsi A: Passing Object
```js
const store = useUserStore()

// Akan merubah 3 data dan cuma memicu 1x re-render DOM
store.$patch({
  nama: 'Agung P.',
  umur: 26,
  isLoggedIn: true
})
```

### Opsi B: Passing Function (Cocok untuk Array)
```js
const store = useKeranjangStore()

store.$patch((state) => {
  // Berguna jika kita perlu pakai method array seperti .push() atau .splice()
  state.items.push({ id: 1, nama: 'Baju' })
  state.totalBarang += 1
})
```

## 2. Mengawasi Perubahan dengan `$subscribe`

Kamu bisa "nongkrong" dan mendengarkan *setiap kali* ada state yang berubah di dalam store. Ini fungsinya mirip `watch`, namun khusus untuk store.

```js
const store = usePengaturanStore()

store.$subscribe((mutation, state) => {
  console.log('Ada perubahan pada store!')
  console.log('Tipe mutasi:', mutation.type)
  console.log('State terbaru:', state)
  
  // Contoh Kasus Nyata: Auto-Save Pengaturan ke LocalStorage
  localStorage.setItem('tema-app', state.temaMode)
})
```

## 3. Mereset State ke Kondisi Awal (`$reset`)

Terkadang kita perlu mengembalikan isi Store ke kondisi awal saat aplikasi baru dibuka (misalnya saat user Logout). 

*Catatan: Fungsi bawaan `$reset()` hanya bekerja sempurna pada Pinia Option Syntax. Karena kita memakai **Setup Syntax**, kita perlu membuat fungsi reset manual.*

```js
// src/stores/keranjang.js
export const useKeranjangStore = defineStore('keranjang', () => {
  const items = ref([])
  const diskon = ref(0)
  const isVoucherAktif = ref(false)
  
  // Custom Reset Action
  function $reset() {
    items.value = []
    diskon.value = 0
    isVoucherAktif.value = false
  }

  return { items, diskon, isVoucherAktif, $reset }
})
```

## 4. Memakai Store di Luar Komponen (Routing Guard)

Data dari Pinia sangat krusial, misalnya data Auth. Seringkali kita butuh cek data Auth Pinia **sebelum** user memasuki halaman tertentu di Vue Router.

Bagaimana cara mengakses Store Pinia di dalam file `router.js`?

```js
// src/router/index.js
import { createRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import store-nya

const router = createRouter({ /* ... config ... */ })

router.beforeEach((to) => {
  // ⚠️ PENTING: Kamu BARU BOLEH panggil useAuthStore() 
  // di DALAM fungsi eksekusi (seperti beforeEach). 
  // Dilarang memanggilnya di luar (di area global) karena 
  // Pinia mungkin belum siap.
  const authStore = useAuthStore()
  
  // Logika pengecekan auth
  if (to.meta.wajibLogin && !authStore.sudahLogin) {
    return { name: 'login' }
  }
})

export default router
```

## 5. Async Actions (API Calls dalam Store)

Karena `Actions` di Pinia Setup Syntax hanyalah Function biasa, kamu bisa dengan bebas merubahnya jadi `async` untuk melakukan pemanggilan API (Backend).

Inilah pola Fullstack yang akan kita pelajari lebih dalam di Fase 4.

```js
// src/stores/produk.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProdukStore = defineStore('produk', () => {
  const daftarProduk = ref([])
  const isLoading = ref(false)
  const pesanError = ref(null)

  // Aksi Async ke Backend API
  async function ambilDariAPI() {
    isLoading.value = true
    pesanError.value = null
    
    try {
      const response = await fetch('https://api.toko.com/produk')
      const hasil = await response.json()
      
      // Update state dengan hasil API
      daftarProduk.value = hasil.data 
    } catch (err) {
      pesanError.value = 'Gagal memuat produk. Coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  return { daftarProduk, isLoading, pesanError, ambilDariAPI }
})
```

Penggunaan di Komponen View:
```vue
<script setup>
import { onMounted } from 'vue'
import { useProdukStore } from '@/stores/produk'

const store = useProdukStore()

// Begitu halaman dimuat, perintahkan Store untuk ambil data ke backend
onMounted(() => {
  store.ambilDariAPI()
})
</script>

<template>
  <div v-if="store.isLoading">Tunggu sebentar ya...</div>
  <div v-else-if="store.pesanError">{{ store.pesanError }}</div>
  
  <ul v-else>
    <li v-for="produk in store.daftarProduk" :key="produk.id">
      {{ produk.nama }}
    </li>
  </ul>
</template>
```

## 6. Pinia Plugins (Tingkat Lanjut)

Bagaimana jika kita ingin menambahkan kemampuan *baru* ke SEMUA store kita sekaligus? Misalnya, kita ingin agar **semua data store otomatis tersimpan ke `localStorage`** setiap kali ada perubahan, sehingga saat browser di-refresh, datanya tidak hilang.

Kita bisa membuat **Pinia Plugin**.

```js
// src/plugins/piniaLocalStorage.js

// Plugin adalah fungsi biasa yang menerima context ({ store })
export function piniaLocalStoragePlugin({ store }) {
  
  // 1. Saat pertama kali store dipanggil, cek apakah ada data lama di localStorage
  const dataLama = localStorage.getItem(`pinia-${store.$id}`)
  if (dataLama) {
    // Timpa isi store dengan data lama
    store.$patch(JSON.parse(dataLama))
  }

  // 2. Pasang 'CCTV' ($subscribe) ke store ini
  // Setiap kali store berubah, otomatis simpan ke localStorage!
  store.$subscribe((mutation, state) => {
    localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(state))
  })
}
```

Cara memasang pluginnya ke Pinia:

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaLocalStoragePlugin } from './plugins/piniaLocalStorage'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// Mendaftarkan plugin!
pinia.use(piniaLocalStoragePlugin) 

app.use(pinia)
app.mount('#app')
```

Dengan mengaktifkan plugin ini, **semua state Pinia** di seluruh aplikasimu kini tahan banting terhadap *page reload*!
*(Catatan: Di dunia nyata, biasanya kita memakai library buatan komunitas seperti `pinia-plugin-persistedstate` karena lebih aman dan optimal, namun konsep dasarnya persis sama).*
