<script setup>
// ============================================================
// DashboardView.vue — Halaman Utama Dashboard
// [MATERI FASE 1: REACTIVITY, TEMPLATE SYNTAX, LIST RENDERING]
// [MATERI FASE 3: PINIA]
// ============================================================
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore }   from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import BaseCard   from '@/components/ui/BaseCard.vue'
import BaseBadge  from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { Package, DollarSign, ShieldCheck, ArrowRight, Plus, Zap } from '@lucide/vue'

const authStore    = useAuthStore()
const productStore = useProductStore()
const router       = useRouter()

const formattedTotalValue = computed(() =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
    .format(productStore.totalValue)
)

const stats = computed(() => [
  { label: 'Total Produk', value: productStore.totalProducts, icon: Package, desc: 'produk terdaftar', color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Total Nilai Stok', value: formattedTotalValue.value, icon: DollarSign, desc: 'estimasi nilai aset', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Role Anda', value: authStore.user?.role ?? '-', icon: ShieldCheck, desc: 'akses level', color: 'text-amber-600', bg: 'bg-amber-50' },
])
</script>

<template>
  <div class="space-y-6">
    <!-- Greeting -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">
          Halo, {{ authStore.user?.name ?? 'Pengguna' }}! 👋
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Selamat datang di VueStore Dashboard.
          <span v-if="authStore.isAdmin" class="text-primary-600 font-medium">Anda memiliki akses penuh sebagai Administrator.</span>
          <span v-else>Anda login sebagai User biasa.</span>
        </p>
      </div>
      <BaseBadge :variant="authStore.isAdmin ? 'primary' : 'default'" size="md" dot>
        {{ authStore.user?.role ?? 'guest' }}
      </BaseBadge>
    </div>

    <!-- KPI Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <BaseCard v-for="stat in stats" :key="stat.label" :hoverable="true">
        <div class="flex items-center gap-4">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg]">
            <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
          </div>
          <div class="min-w-0">
            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-800 leading-none mb-1 capitalize truncate">{{ stat.value }}</p>
            <p class="text-xs text-slate-400">{{ stat.desc }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Quick Actions -->
    <BaseCard>
      <template #header>
        <h3 class="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Zap class="w-4 h-4 text-amber-500" />
          Aksi Cepat
        </h3>
      </template>
      <div class="flex gap-3 flex-wrap">
        <BaseButton variant="primary" @click="router.push({ name: 'products' })">
          <Package class="w-4 h-4" /> Lihat Semua Produk
          <ArrowRight class="w-3.5 h-3.5 ml-1" />
        </BaseButton>
        <BaseButton v-if="authStore.isAdmin" variant="secondary" @click="router.push({ name: 'products' })">
          <Plus class="w-4 h-4" /> Tambah Produk Baru
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

