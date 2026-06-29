// ============================================================
// authStore.js — Authentication State Management
// [MATERI FASE 3: PINIA]
// [MATERI FASE 3: PINIA PLUGIN (localStorage persistence)]
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// [MATERI FASE 3: PINIA]
// defineStore() menerima dua argumen:
// 1. ID unik store (string) — digunakan oleh devtools
// 2. Setup function (seperti <script setup> di komponen)
export const useAuthStore = defineStore('auth', () => {

  // -------------------------------------------------------
  // STATE
  // [MATERI FASE 1: REACTIVITY — ref()]
  // ref() membungkus nilai primitif/objek menjadi reaktif.
  // -------------------------------------------------------
  const user  = ref(null)   // { id, name, email, role: 'admin'|'user' }
  const token = ref(null)

  // -------------------------------------------------------
  // GETTERS
  // [MATERI FASE 1: COMPUTED]
  // computed() menghitung nilai turunan dari state.
  // Hanya akan re-evaluate jika dependensinya berubah.
  // -------------------------------------------------------
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'admin')
  const userInitial     = computed(() => user.value?.name?.charAt(0).toUpperCase() ?? 'U')

  // -------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------

  // login: menyimpan token dan data user ke state
  const login = (userData, accessToken) => {
    user.value  = userData
    token.value = accessToken

    // [MATERI FASE 3: PINIA PLUGIN / localStorage]
    // Menyimpan ke localStorage agar sesi tidak hilang saat refresh.
    // Pola ini bisa juga diimplementasikan via Pinia Plugin (lihat productStore).
    localStorage.setItem('auth_token', accessToken)
    localStorage.setItem('auth_user',  JSON.stringify(userData))
  }

  // logout: membersihkan semua state dan localStorage
  const logout = () => {
    user.value  = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // initFromStorage: dipanggil saat aplikasi pertama kali dibuka
  // untuk memuat kembali sesi user jika sudah login sebelumnya
  const initFromStorage = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser  = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value  = JSON.parse(savedUser)
    }
  }

  return { user, token, isAuthenticated, isAdmin, userInitial, login, logout, initFromStorage }
})
