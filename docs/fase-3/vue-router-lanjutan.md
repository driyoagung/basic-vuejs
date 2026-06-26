# Vue Router — Lanjutan

## 1. Dynamic Routes (Route Params)

Bagaimana jika kita punya halaman profil untuk 1000 pengguna berbeda? Tentu kita tidak akan mendaftarkan 1000 jalur di router. Kita gunakan jalur dinamis dengan parameter `:id`.

```js
// router/index.js
const routes = [
  {
    // :id adalah parameter dinamis (bisa diganti :username, :slug)
    path: '/pengguna/:id', 
    name: 'profil-pengguna',
    component: () => import('@/views/UserProfilView.vue')
  }
]
```

### Mengakses Param di Komponen

Jika URL saat ini adalah `/pengguna/agung99`, maka nilai `id` adalah `agung99`.

```vue
<!-- UserProfilView.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'

const route = useRoute()

// Mengakses parameter string
console.log('User ID adalah:', route.params.id) 

// Menggunakan param untuk memanggil API
onMounted(() => {
  ambilDataUser(route.params.id)
})

// ⚠️ PENTING: Jika pindah dari /pengguna/1 ke /pengguna/2, komponen TIDAK di-recreate!
// Kamu harus mengawasi (watch) parameter jika mau datanya update otomatis.
watch(
  () => route.params.id,
  (idBaru) => {
    if (idBaru) ambilDataUser(idBaru)
  }
)
</script>

<template>
  <div>
    <h1>Profil: {{ route.params.id }}</h1>
  </div>
</template>
```

### Navigasi ke Dynamic Route

```vue
<!-- Link -->
<RouterLink :to="{ name: 'profil-pengguna', params: { id: 'agung99' } }">
  Lihat Agung
</RouterLink>

<!-- JS -->
<script setup>
const keProfilBudi = () => {
  router.push({ name: 'profil-pengguna', params: { id: 'budi21' } })
}
</script>
```

## 2. Nested Routes (Rute Bersarang)

Aplikasi besar seringkali punya "halaman di dalam halaman". Contoh: Halaman Dashboard Admin yang punya sidebar tetap, tapi konten kanannya berubah-ubah.

Untuk mencapainya, kita butuh `<RouterView>` kedua di dalam komponen Dashboard!

```js
// router/index.js
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardLayout.vue'), // Parent Layout
    children: [
      { 
        // path kosong artinya /dashboard
        path: '', 
        name: 'dashboard-home', 
        component: DashboardHome 
      },
      { 
        // path: 'profil' (tanpa / awal) -> akan menjadi /dashboard/profil
        path: 'profil', 
        name: 'dashboard-profil', 
        component: DashboardProfil 
      },
      { 
        path: 'pengaturan', 
        name: 'dashboard-settings', 
        component: DashboardSettings 
      },
    ],
  },
]
```

```vue
<!-- DashboardLayout.vue (Parent Component) -->
<template>
  <div class="dashboard-wrapper">
    <!-- Sidebar akan terus merender diri -->
    <aside class="sidebar">
      <h2>Menu Admin</h2>
      <RouterLink :to="{ name: 'dashboard-home' }">Ringkasan</RouterLink>
      <RouterLink :to="{ name: 'dashboard-profil' }">Profil Saya</RouterLink>
      <RouterLink :to="{ name: 'dashboard-settings' }">Pengaturan</RouterLink>
    </aside>

    <!-- Konten kanan akan berubah sesuai Children Route -->
    <main class="content">
      <RouterView /> <!-- <== INI KUNCI NESTED ROUTE -->
    </main>
  </div>
</template>
```

## 3. Navigation Guards (Satpam Router)

Kita ingin mengunci halaman tertentu (misal: /dashboard) agar hanya bisa diakses user yang sudah login.

### Global Guard (Berlaku untuk SEMUA perpindahan)

```js
// router/index.js
const router = createRouter({ /* config */ })

// beforeEach dijalankan SETIAP KALI user pindah halaman
router.beforeEach((to, from, next) => {
  
  // Asumsi: Kita mendapat data user beserta rolenya dari Pinia/LocalStorage
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role') // misal: 'admin' atau 'user'
  
  // 1. Cek apakah rute butuh login, tapi user belum punya token
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' }) 
  }

  // 2. Role-Based Access Control (RBAC)
  // Jika rute ini mewajibkan role tertentu, dan role user tidak cocok
  if (to.meta.role && to.meta.role !== userRole) {
    alert('Anda tidak memiliki akses ke halaman ini!')
    return next({ name: '403-forbidden' }) // Atau lempar ke home
  }

  // 3. Lanjutkan perjalanan jika semua aman
  next() 
})
```

Tunggu, dari mana asal `to.meta.requiresAuth` dan `to.meta.role`? Kita mendefinisikannya di opsi `meta` pada `routes`:

```js
const routes = [
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView 
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // Hanya butuh login (role bebas)
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: AdminSettingsView,
    // META KHUSUS: Butuh login DAN harus admin!
    meta: { requiresAuth: true, role: 'admin' } 
  }
]
```

### Component-Level Guard (Sebelum Pindah Halaman Ini)

Sering digunakan jika user mau meninggalkan form padahal belum disave.

```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'
import { ref } from 'vue'

const isFormDirty = ref(true)

onBeforeRouteLeave((to, from) => {
  if (isFormDirty.value) {
    const konfirmasi = window.confirm('Anda belum menyimpan data! Yakin mau pergi?')
    // Return false membatalkan navigasi!
    if (!konfirmasi) return false 
  }
})
</script>
```

## 4. Halaman Not Found (404)

Bagaimana jika user mengetik URL ngawur?

Tambahkan rute khusus di **paling bawah** array rute. Rute ini menggunakan Regular Expression untuk menangkap SEMUA URL sisa.

```js
const routes = [
  // ... semua rute valid ...

  {
    // Tangkap semuanya dengan regex
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
```
