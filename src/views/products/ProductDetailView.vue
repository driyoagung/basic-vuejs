<script setup>
// ============================================================
// ProductDetailView.vue — Halaman Detail Produk
// [MATERI FASE 3: VUE ROUTER — useRoute (Dynamic Route Params)]
// [MATERI FASE 2: LIFECYCLE — onMounted untuk fetch by ID]
// ============================================================
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import BaseCard   from '@/components/ui/BaseCard.vue'
import BaseBadge  from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ArrowLeft, PackageX, Tag, Hash, Box, Wallet } from '@lucide/vue'

const route  = useRoute()
const router = useRouter()
const productStore = useProductStore()

const product = computed(() =>
  productStore.products.find(p => p.id === Number(route.params.id))
)

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

const stockVariant = (stock) => {
  if (stock === 0) return 'danger'
  if (stock < 10)  return 'warning'
  return 'success'
}
</script>

<template>
  <div class="space-y-6">
    <BaseButton variant="ghost" size="sm" @click="router.push({ name: 'products' })" class="text-slate-500 hover:text-slate-800">
      <ArrowLeft class="w-4 h-4" /> Kembali ke Daftar Produk
    </BaseButton>

    <div v-if="!product" class="text-center py-20">
      <PackageX class="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h3 class="text-lg font-medium text-slate-800">Produk Tidak Ditemukan</h3>
      <p class="text-slate-500 mt-1">Produk dengan ID tersebut tidak tersedia.</p>
    </div>

    <template v-else>
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between w-full">
            <h2 class="text-xl font-bold text-slate-800">{{ product.name }}</h2>
            <BaseBadge variant="default">{{ product.category ?? 'Tanpa Kategori' }}</BaseBadge>
          </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <!-- Item 1 -->
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Tag class="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Harga Satuan</p>
              <p class="text-lg font-bold text-primary-600">{{ formatRupiah(product.price) }}</p>
            </div>
          </div>
          
          <!-- Item 2 -->
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Box class="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sisa Stok</p>
              <BaseBadge :variant="stockVariant(product.stock)" size="md" dot>
                {{ product.stock }} unit
              </BaseBadge>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Hash class="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ID Produk</p>
              <p class="text-lg font-bold text-slate-700">#{{ product.id }}</p>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Wallet class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Nilai Stok</p>
              <p class="text-lg font-bold text-slate-800">{{ formatRupiah(product.price * product.stock) }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>
