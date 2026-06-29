// ============================================================
// useFetch.js — Universal Fetch Composable
// [MATERI FASE 2: COMPOSABLES]
// [MATERI FASE 2: LIFECYCLE — AbortController + onUnmounted]
// [MATERI FASE 2: REACTIVITY ADVANCED — ref, computed]
// ============================================================
import { ref, onUnmounted } from 'vue'

// Cache sederhana menggunakan Map untuk menyimpan hasil fetch
// yang sudah pernah dilakukan (menghindari request duplikat)
// [MATERI FASE 2: ADVANCED — In-Memory Cache]
const cache = new Map()

/**
 * useFetch — Composable untuk data fetching yang production-ready
 *
 * Fitur:
 * - Reactive loading, data, dan error state
 * - Automatic AbortController cleanup (prevent memory leak)
 * - In-memory caching dengan opsi cache busting
 *
 * @param {Function} fetchFn - Fungsi async yang melakukan request (return promise)
 * @param {Object} options
 * @param {boolean} options.immediate - Langsung fetch saat composable dipanggil
 * @param {string}  options.cacheKey  - Key untuk cache. Jika ada, hasil di-cache
 */
export function useFetch(fetchFn, { immediate = true, cacheKey = null } = {}) {

  // [MATERI FASE 1: REACTIVITY]
  // Tiga state reaktif yang akan digunakan oleh komponen
  const data    = ref(null)
  const isLoading = ref(false)
  const error   = ref(null)

  // [MATERI FASE 2: AbortController]
  // AbortController digunakan untuk membatalkan fetch request yang
  // sedang berjalan ketika komponen di-unmount (navigasi berpindah halaman).
  let controller = null

  const execute = async (...args) => {
    // Cek cache terlebih dahulu
    if (cacheKey && cache.has(cacheKey)) {
      data.value = cache.get(cacheKey)
      return
    }

    // Batalkan request sebelumnya jika masih berjalan
    if (controller) controller.abort()

    controller    = new AbortController()
    isLoading.value = true
    error.value   = null

    try {
      const result  = await fetchFn(...args, { signal: controller.signal })
      data.value    = result

      // Simpan ke cache jika cacheKey disediakan
      if (cacheKey) cache.set(cacheKey, result)
    } catch (err) {
      // AbortError terjadi ketika kita sengaja membatalkan — ini bukan error nyata
      if (err.name !== 'AbortError') {
        error.value = err.message || 'Terjadi kesalahan'
      }
    } finally {
      isLoading.value = false
    }
  }

  // [MATERI FASE 2: LIFECYCLE — onUnmounted]
  // Cleanup! Saat komponen yang menggunakan composable ini di-destroy
  // (misalnya user berpindah halaman), kita batalkan fetch yang sedang berjalan.
  onUnmounted(() => {
    if (controller) controller.abort()
  })

  // Jalankan fetch langsung jika immediate = true
  if (immediate) execute()

  return { data, isLoading, error, execute, refresh: () => { cache.delete(cacheKey); execute() } }
}
