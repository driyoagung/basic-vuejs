// ============================================================
// router/index.js — Vue Router Configuration
// [MATERI FASE 3: VUE ROUTER DASAR & LANJUTAN]
// [MATERI FASE 3: NAVIGATION GUARDS + RBAC]
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// [MATERI FASE 3: LAZY LOADING ROUTES]
// Dengan import() dinamis, setiap halaman hanya di-load saat
// pertama kali user mengunjunginya (Code Splitting).
// Ini membuat initial load aplikasi jauh lebih cepat.
const routes = [
  // Route publik — tidak memerlukan login
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Masuk', guest: true }, // guest: hanya untuk yang belum login
  },

  // Route yang memerlukan AppLayout (Sidebar + Topbar)
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    // [MATERI FASE 3: ROUTE META]
    // meta.requiresAuth: halaman ini memerlukan login
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard', requiresAuth: true },
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/products/ProductsView.vue'),
        meta: { title: 'Manajemen Produk', requiresAuth: true },
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('@/views/products/ProductDetailView.vue'),
        meta: { title: 'Detail Produk', requiresAuth: true },
      },
    ],
  },

  // Catch-all: 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 - Halaman Tidak Ditemukan' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll ke atas saat berpindah halaman
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// ============================================================
// NAVIGATION GUARD — beforeEach
// [MATERI FASE 3: NAVIGATION GUARDS + RBAC]
// Middleware global yang berjalan SEBELUM setiap perpindahan route.
// Ini adalah tempat yang tepat untuk proteksi halaman (autentikasi & otorisasi).
// ============================================================
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // Update document title berdasarkan route meta
  document.title = to.meta?.title ? `${to.meta.title} | VueStore` : 'VueStore'

  // [MATERI FASE 3: RBAC — Role Based Access Control]
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    return { name: 'dashboard' }
  }

  // Proteksi halaman yang memerlukan autentikasi
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Redirect ke dashboard jika user sudah login tapi mencoba akses /login
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }

  // Lanjutkan navigasi (return undefined/true = izinkan)
})

export default router
