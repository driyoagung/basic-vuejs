// ============================================================
// productStore.js — Product State Management
// [MATERI FASE 3: PINIA LANJUTAN — Optimistic UI Updates]
// [MATERI FASE 4: CRUD FULLSTACK]
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '@/api/productService'

export const useProductStore = defineStore('products', () => {

  // --- STATE ---
  const products   = ref([])
  const isLoading  = ref(false)
  const error      = ref(null)
  const searchQuery = ref('')

  // --- GETTERS ---
  // [MATERI FASE 1: COMPUTED]
  // Filter produk berdasarkan search query secara reaktif
  const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) return products.value
    const q = searchQuery.value.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  })

  const totalProducts = computed(() => products.value.length)

  const totalValue = computed(() =>
    products.value.reduce((sum, p) => sum + (p.price * p.stock), 0)
  )

  // --- ACTIONS ---

  // Fetch semua produk dari API
  const fetchProducts = async () => {
    isLoading.value = true
    error.value     = null
    try {
      const data    = await productService.getAll()
      products.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Create produk baru
  const createProduct = async (payload) => {
    const newProduct = await productService.create(payload)
    // Tambahkan langsung ke local state tanpa fetch ulang
    products.value.unshift(newProduct)
    return newProduct
  }

  // Update produk
  const updateProduct = async (id, payload) => {
    const updated = await productService.update(id, payload)
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updated }
    }
    return updated
  }

  // [MATERI FASE 4: OPTIMISTIC UI UPDATES]
  // Hapus produk: kita hapus dari UI DULU (langsung terasa cepat),
  // baru kemudian panggil API. Jika API gagal, kita rollback.
  const deleteProduct = async (id) => {
    const backup  = [...products.value]
    products.value = products.value.filter(p => p.id !== id) // hapus optimis

    try {
      await productService.delete(id)
    } catch (err) {
      products.value = backup // rollback jika API error
      throw err
    }
  }

  return {
    products, isLoading, error, searchQuery,
    filteredProducts, totalProducts, totalValue,
    fetchProducts, createProduct, updateProduct, deleteProduct,
  }
})
