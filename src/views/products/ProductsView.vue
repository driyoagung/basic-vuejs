<script setup>
// ============================================================
// ProductsView.vue — Halaman Manajemen Produk (CRUD)
// [MATERI FASE 4: CRUD FULLSTACK]
// [MATERI FASE 3: PINIA — productStore]
// [MATERI FASE 2: LIFECYCLE — onMounted untuk fetch data]
// [MATERI FASE 1: CONDITIONAL & LIST RENDERING]
// ============================================================
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore }    from '@/stores/authStore'
import BaseCard   from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput  from '@/components/ui/BaseInput.vue'
import BaseBadge  from '@/components/ui/BaseBadge.vue'
import { PackagePlus, Search, Edit2, Trash2, X, Plus } from '@lucide/vue'

const productStore = useProductStore()
const authStore    = useAuthStore()

const showModal   = ref(false)
const isEditing   = ref(false)
const editingId   = ref(null)
const isSubmitting = ref(false)

const formData = ref({ name: '', price: '', stock: '', category: '' })
const formErrors = ref({})

onMounted(async () => {
  if (productStore.products.length === 0) {
    seedDemoData()
  }
})

const seedDemoData = () => {
  const demoProducts = [
    { id: 1, name: 'Laptop ProBook X5',   price: 12500000, stock: 15, category: 'Elektronik' },
    { id: 2, name: 'Mechanical Keyboard', price: 850000,   stock: 30, category: 'Aksesori'   },
    { id: 3, name: 'Monitor 27 inch 4K',  price: 4200000,  stock: 8,  category: 'Elektronik' },
    { id: 4, name: 'Mouse Wireless',      price: 350000,   stock: 50, category: 'Aksesori'   },
    { id: 5, name: 'USB-C Hub 7-in-1',   price: 475000,   stock: 25, category: 'Aksesori'   },
  ]
  productStore.products = demoProducts
}

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value  = { name: '', price: '', stock: '', category: '' }
  formErrors.value = {}
  showModal.value = true
}

const openEditModal = (product) => {
  isEditing.value = true
  editingId.value = product.id
  formData.value  = { name: product.name, price: product.price, stock: product.stock, category: product.category }
  formErrors.value = {}
  showModal.value = true
}

const validateForm = () => {
  const errors = {}
  if (!formData.value.name)         errors.name = 'Nama produk wajib diisi'
  if (!formData.value.price || isNaN(formData.value.price)) errors.price = 'Harga tidak valid'
  if (!formData.value.stock || isNaN(formData.value.stock)) errors.stock = 'Stok tidak valid'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    const payload = {
      name:     formData.value.name,
      price:    Number(formData.value.price),
      stock:    Number(formData.value.stock),
      category: formData.value.category,
    }

    if (isEditing.value) {
      const index = productStore.products.findIndex(p => p.id === editingId.value)
      if (index !== -1) productStore.products[index] = { ...productStore.products[index], ...payload }
    } else {
      const newId = Math.max(...productStore.products.map(p => p.id), 0) + 1
      productStore.products.unshift({ id: newId, ...payload })
    }
    showModal.value = false
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Yakin ingin menghapus produk ini?')) return
  productStore.products = productStore.products.filter(p => p.id !== id)
}

const stockVariant = (stock) => {
  if (stock === 0) return 'danger'
  if (stock < 10)  return 'warning'
  return 'success'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Manajemen Produk</h2>
        <p class="text-sm text-slate-500 mt-1">
          {{ productStore.filteredProducts.length }} produk ditemukan
        </p>
      </div>
      <BaseButton v-if="authStore.isAdmin" variant="primary" @click="openCreateModal">
        <Plus class="w-4 h-4" /> Tambah Produk
      </BaseButton>
    </div>

    <!-- Search Bar -->
    <BaseCard>
      <BaseInput
        id="search"
        v-model="productStore.searchQuery"
        placeholder="Cari nama produk atau kategori..."
        label="Cari Produk"
      >
        <template #prepend><Search class="w-4 h-4" /></template>
      </BaseInput>
    </BaseCard>

    <!-- Products Table -->
    <BaseCard no-padding>
      <template #header>
        <h3 class="text-sm font-semibold text-slate-800">Daftar Produk</h3>
        <span class="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
          {{ productStore.filteredProducts.length }} data
        </span>
      </template>

      <div v-if="productStore.isLoading" class="text-center py-12 text-slate-400 text-sm">
        <div class="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Memuat data...
      </div>

      <div v-else-if="productStore.filteredProducts.length === 0" class="text-center py-12 text-slate-400 text-sm">
        <PackagePlus class="w-12 h-12 mx-auto text-slate-300 mb-3" />
        Tidak ada produk ditemukan.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="text-xs uppercase bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">#</th>
              <th class="px-6 py-4">Nama Produk</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4">Harga</th>
              <th class="px-6 py-4">Stok</th>
              <th class="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="product in productStore.filteredProducts" :key="product.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-400 font-medium">#{{ product.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-800">{{ product.name }}</td>
              <td class="px-6 py-4">
                <BaseBadge variant="default">{{ product.category ?? '-' }}</BaseBadge>
              </td>
              <td class="px-6 py-4 font-semibold text-primary-600">{{ formatRupiah(product.price) }}</td>
              <td class="px-6 py-4">
                <BaseBadge :variant="stockVariant(product.stock)" dot>
                  {{ product.stock }} unit
                </BaseBadge>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="openEditModal(product)" class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button v-if="authStore.isAdmin" @click="handleDelete(product.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Modal Tambah / Edit -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showModal = false" />
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="flex justify-between items-center px-6 py-4 border-b border-slate-100">
            <h3 class="text-lg font-semibold text-slate-800">
              {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
            </h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto">
            <form id="product-form" @submit.prevent="handleSubmit" class="space-y-4">
              <BaseInput id="p-name" v-model="formData.name" label="Nama Produk" placeholder="cth: Laptop Gaming" :error="formErrors.name" required />
              <div class="grid grid-cols-2 gap-4">
                <BaseInput id="p-price" v-model="formData.price" type="number" label="Harga (Rp)" placeholder="cth: 5000000" :error="formErrors.price" required>
                  <template #prepend><span class="text-xs font-semibold">Rp</span></template>
                </BaseInput>
                <BaseInput id="p-stock" v-model="formData.stock" type="number" label="Stok" placeholder="cth: 10" :error="formErrors.stock" required />
              </div>
              <BaseInput id="p-cat" v-model="formData.category" label="Kategori" placeholder="cth: Elektronik" />
            </form>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <BaseButton type="button" variant="ghost" @click="showModal = false">Batal</BaseButton>
            <BaseButton form="product-form" type="submit" variant="primary" :loading="isSubmitting">
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Produk' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
