# Vue Router — Dasar

Vue Router adalah library routing (perpindahan halaman) resmi dari Vue. Ia mengubah aplikasi kita menjadi **Single Page Application (SPA)**. Artinya, ketika user berpindah halaman (misalnya dari Home ke About), browser tidak akan me-reload/refresh secara penuh.

## 1. Instalasi dan Setup (Otomatis via Vite)

Jika kamu menggunakan `create-vue` (seperti project ini), Vue Router biasanya sudah diinstall. Jika belum:

```bash
npm install vue-router@4
```

### Konfigurasi Router (`src/router/index.js`)

Di sini kita mendefinisikan rute/jalur aplikasi (path) dan menghubungkannya dengan Komponen View.

```js
import { createRouter, createWebHistory } from 'vue-router'

// Import Komponen Halaman (Views)
import HomeView from '@/views/HomeView.vue'
import TentangView from '@/views/TentangView.vue'

const router = createRouter({
  // Gunakan HTML5 Web History API (URL cantik tanpa tanda #)
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // Daftar jalur dan halamannya
  routes: [
    {
      path: '/',
      name: 'home', // Beri nama untuk kemudahan
      component: HomeView
    },
    {
      path: '/tentang',
      name: 'tentang',
      component: TentangView
    },
    {
      path: '/kontak',
      name: 'kontak',
      // Lazy Loading: Komponen baru didownload saat user masuk halaman ini (Optimasi)
      component: () => import('@/views/KontakView.vue')
    }
  ]
})

export default router
```

### Menyambungkan ke Vue (`src/main.js`)

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router) // Memasang Plugin Router
app.mount('#app')
```

## 2. RouterView & RouterLink

`RouterView` dan `RouterLink` adalah dua komponen ajaib dari Vue Router yang otomatis bisa dipakai dimana saja.

- `<RouterView />`: "Layar TV"-nya. Di sinilah komponen halaman (contoh: `HomeView`) akan dirender.
- `<RouterLink>`: "Tombol Remote"-nya. Pengganti tag `<a>` agar tidak terjadi reload browser saat diklik.

```vue
<!-- App.vue (Atau Layout Component) -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    
    <!-- Navbar (Akan selalu tampil) -->
    <nav class="navbar">
      <!-- to="/" berdasarkan 'path' di file router -->
      <RouterLink to="/">Home</RouterLink>
      
      <!-- :to="{ name: 'tentang' }" berdasarkan 'name'. (Lebih direkomendasikan) -->
      <RouterLink :to="{ name: 'tentang' }">Tentang Kami</RouterLink>
      
      <RouterLink :to="{ name: 'kontak' }">Hubungi Kami</RouterLink>
    </nav>

    <!-- Konten Halaman (Berubah-ubah sesuai URL) -->
    <main class="page-content">
      <RouterView /> 
    </main>
    
  </div>
</template>

<style>
/* Vue Router otomatis menambahkan class aktif pada RouterLink */
a { text-decoration: none; color: gray; padding: 10px; }

/* Saat rute aktif sebagian (misal: /tentang/sejarah) */
.router-link-active { color: blue; }

/* Saat rute aktif sama persis (exact: /tentang) */
.router-link-exact-active { font-weight: bold; border-bottom: 2px solid blue; }
</style>
```

## 3. Programmatic Navigation (Ganti Halaman via JS)

Seringkali kita ingin pindah halaman BUKAN karena user klik link, melainkan karena suatu aksi program (misal: Selesai login, otomatis redirect ke Dashboard).

Gunakan composable `useRouter()` untuk ini.

```vue
<script setup>
import { useRouter } from 'vue-router'

// Inisialisasi object router
const router = useRouter()

const prosesLogin = async () => {
  // ... proses validasi ke server ...
  
  alert('Login Berhasil!')
  
  // 1. Pindah berdasarkan path string
  // router.push('/dashboard')
  
  // 2. Pindah berdasarkan rute 'name' (Best Practice)
  router.push({ name: 'dashboard' })
}

const tombolKembali = () => {
  // Mundur 1 langkah dalam history browser
  router.back() 
  // Bisa juga router.go(-1)
}

const gantiTanpaHistory = () => {
  // Replace: tidak menambah jejak history (Back button ga bisa balik kesini)
  router.replace({ name: 'home' })
}
</script>

<template>
  <div>
    <button @click="prosesLogin">Simulasi Login</button>
    <button @click="tombolKembali">Go Back</button>
  </div>
</template>
```

## 4. Query Parameters (?page=2&sort=asc)

Query parameter berguna untuk passing data sementara melalui URL yang aman dibagikan.

Gunakan composable `useRoute()` untuk MEMBACA info dari URL saat ini.

```vue
<!-- Sedang berada di: /produk?kategori=laptop&halaman=2 -->
<script setup>
import { useRoute, useRouter } from 'vue-router'

// rute SAAT INI (read-only state)
const route = useRoute() 

// mesin router untuk pindah (action)
const router = useRouter() 

console.log(route.query.kategori) // "laptop"
console.log(route.query.halaman) // "2"

const filterSepatu = () => {
  // Mengubah URL saat ini ditambah query parameter
  router.push({
    name: 'produk',     // Tetap di halaman ini
    query: { kategori: 'sepatu' } // Tambahkan/ubah ?kategori=sepatu
  })
}
</script>
```
