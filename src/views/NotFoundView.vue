<script setup>
// ============================================================
// NotFoundView.vue — Halaman 404
// [MATERI FASE 3: VUE ROUTER — Catch-all Route]
// ============================================================
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ArrowLeft, SearchX } from '@lucide/vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
    <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
      <SearchX class="w-12 h-12 text-slate-400" />
    </div>
    
    <h1 class="text-9xl font-black text-slate-200 leading-none mb-4 select-none">
      404
    </h1>
    
    <h2 class="text-2xl font-bold text-slate-800 mb-2">
      Halaman Tidak Ditemukan
    </h2>
    
    <p class="text-slate-500 max-w-sm mx-auto mb-8">
      Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau tidak pernah ada.
    </p>
    
    <BaseButton variant="primary" size="lg" @click="router.push('/')">
      <ArrowLeft class="w-4 h-4" /> Kembali ke Dashboard
    </BaseButton>
  </div>
</template>
