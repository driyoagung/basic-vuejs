<script setup>
// ============================================================
// LoginView.vue — Halaman Login
// [MATERI FASE 1: FORM INPUT BINDING, EVENT HANDLING]
// [MATERI FASE 3: PINIA, VUE ROUTER]
// ============================================================
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import BaseInput  from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Zap, Mail, Lock, AlertCircle } from '@lucide/vue'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const isLoading = ref(false)
const errors = reactive({ email: '', password: '', general: '' })

const validate = () => {
  errors.email = ''; errors.password = ''; errors.general = ''
  let valid = true
  if (!form.email) { errors.email = 'Email wajib diisi'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Format email tidak valid'; valid = false }
  if (!form.password || form.password.length < 6) { errors.password = 'Password minimal 6 karakter'; valid = false }
  return valid
}

const handleSubmit = async () => {
  if (!validate()) return
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const fakeUser  = { id: 1, name: 'Agung Admin', email: form.email, role: 'admin' }
    const fakeToken = 'fake-token-' + Date.now()
    authStore.login(fakeUser, fakeToken)
    const redirectTo = route.query.redirect ?? '/'
    router.push(redirectTo)
  } catch (err) {
    errors.general = err.response?.data?.message ?? 'Login gagal. Periksa kembali data Anda.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-600 p-6">
    <!-- Decorative blurs -->
    <div class="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

    <div class="relative bg-white rounded-2xl p-10 w-full max-w-[420px] shadow-2xl shadow-black/20">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/30">
          <Zap class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-slate-800 mb-1">Selamat Datang</h1>
        <p class="text-sm text-slate-400">Masuk ke VueStore Dashboard</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit" novalidate>
        <!-- Error global -->
        <div v-if="errors.general" class="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200" role="alert">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ errors.general }}
        </div>

        <BaseInput id="email" v-model="form.email" type="email" label="Email" placeholder="nama@email.com" :error="errors.email" required>
          <template #prepend><Mail class="w-4 h-4" /></template>
        </BaseInput>

        <BaseInput id="password" v-model="form.password" type="password" label="Password" placeholder="••••••••" :error="errors.password" required>
          <template #prepend><Lock class="w-4 h-4" /></template>
        </BaseInput>

        <BaseButton type="submit" variant="primary" :loading="isLoading" full-width class="mt-1">
          {{ isLoading ? 'Masuk...' : 'Masuk' }}
        </BaseButton>
      </form>

      <p class="mt-6 text-[11px] text-slate-400 text-center p-3 bg-slate-50 rounded-lg">
        💡 Demo: Gunakan email & password apapun (min 6 karakter)
      </p>
    </div>
  </div>
</template>
