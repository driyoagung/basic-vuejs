# Auth dengan Laravel Sanctum

Laravel Sanctum adalah library resmi dari Laravel untuk menangani Authentication API. Terdapat 2 metode yang didukung Sanctum:
1. **SPA Authentication (Cookie Based)** - Sangat aman, tapi Vue dan Laravel harus berada di domain yang sama (misal: `frontend.web.com` dan `api.web.com`).
2. **API Token Authentication (Bearer Token)** - Mirip JWT, sangat fleksibel, Vue dan Laravel bisa beda domain jauh (Bahkan cocok untuk Aplikasi Mobile).

Di sini kita akan mempelajari **Metode API Token** karena ini yang paling fleksibel dan umum dipakai developer saat belajar.

## 1. Store Auth (Pinia)

Auth Data sangat penting dan dibutuhkan oleh banyak komponen (Header/Navbar, Guard Router, dll). Maka kita harus menyimpannya di **Pinia**.

```js
// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // State: Token dan Data User
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value) // return true/false

  // Action: Login
  async function login(email, password) {
    // 1. Kirim request ke backend
    const response = await api.post('/login', { email, password })
    
    // 2. Ambil token dari respon (tergantung struktur json backend)
    const tokenBaru = response.data.token
    
    // 3. Simpan token ke State dan LocalStorage (agar tidak hilang saat refresh)
    token.value = tokenBaru
    localStorage.setItem('token', tokenBaru)
    
    // 4. Otomatis fetch data profile user
    await fetchProfile()
  }

  // Action: Ambil Profil (Dijalankan setiap habis login, atau pas reload web)
  async function fetchProfile() {
    // Axios Interceptor kita akan otomatis menaruh Token di Header request ini
    try {
      const response = await api.get('/user')
      user.value = response.data
    } catch (error) {
      // Jika token mati/invalid, hapus data sesi
      logout()
    }
  }

  // Action: Logout
  async function logout() {
    try {
      // Beritahu backend untuk hapus token di DB (opsional tapi disarankan)
      await api.post('/logout') 
    } catch(e) {
      // Hiraukan error jika koneksi putus
    } finally {
      // Tetap bersihkan data lokal
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  return { token, user, isLoggedIn, login, logout, fetchProfile }
})
```

## 2. Halaman Login

```vue
<!-- views/LoginView.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Panggil action login dari Pinia
    await authStore.login(email.value, password.value)
    
    // Jika sukses, lempar ke Dashboard
    router.push({ name: 'dashboard' })
    
  } catch (err) {
    if (err.response && err.response.status === 422) {
      errorMessage.value = 'Email atau Password salah!'
    } else {
      errorMessage.value = 'Terjadi kesalahan jaringan.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-box">
    <h2>Login Aplikasi</h2>
    
    <div v-if="errorMessage" class="alert-error">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>
      
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Mengecek...' : 'Masuk' }}
      </button>
    </form>
  </div>
</template>
```

## 3. Melindungi Halaman (Navigation Guard)

Sekarang kita pasang "Satpam" di Router agar user yang belum login tidak bisa masuk `/dashboard`. Kita buka kembali file `router/index.js`.

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import auth store

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView,
    // Tandai rute ini butuh login
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({ /* config */ })

// Pasang Satpam (Guard)
router.beforeEach(async (to, from, next) => {
  // useAuthStore() HANYA boleh dipanggil di dalam fungsi (tidak boleh di global file ini)
  const authStore = useAuthStore()

  // Skenario 1: Rute ini dilindungi DAN user belum punya token
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Tendang ke halaman login
    next({ name: 'login' })
    return // Stop script di sini
  }

  // Skenario 2: User sudah punya token, tapi data user (profil) belum di-fetch (biasanya pas reload web)
  if (authStore.isLoggedIn && !authStore.user) {
    try {
      // Tarik profil dari API
      await authStore.fetchProfile()
      next() // Lanjutkan perjalanan
    } catch (err) {
      // Token tidak valid/expired!
      authStore.logout() // Bersihkan lokal
      next({ name: 'login' }) // Tendang ke login
    }
    return
  }

  // Skenario 3: Rute aman, atau data auth sudah lengkap
  next() 
})

export default router
```

## 4. Kondisional Rendering Navbar

Mengubah tampilan Navbar secara otomatis ketika User sudah Login menggunakan Getter Pinia `isLoggedIn`.

```vue
<!-- components/AppNavbar.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const prosesLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav>
    <!-- Selalu Tampil -->
    <RouterLink to="/">Beranda</RouterLink>

    <!-- Hanya Tampil jika BELUM Login -->
    <template v-if="!authStore.isLoggedIn">
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Daftar</RouterLink>
    </template>

    <!-- Hanya Tampil jika SUDAH Login -->
    <template v-else>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      
      <!-- Tampilkan Nama User -->
      <span class="user-greeting">Hai, {{ authStore.user?.name }}!</span>
      
      <button @click="prosesLogout" class="btn-logout">Keluar</button>
    </template>
  </nav>
</template>
```

*(Catatan: Penggunaan operator tanya `?.` (Optional Chaining) pada `authStore.user?.name` berguna agar aplikasi tidak error seandainya data `user` telat datang atau masih bernilai null).*
