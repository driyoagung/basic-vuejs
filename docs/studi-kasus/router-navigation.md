# Router & Navigation

Halaman ini membahas konfigurasi Vue Router di `src/router/index.js` dan bagaimana `MovieDetailView` menangani perubahan rute secara reaktif menggunakan `watch()`.

---

## Konfigurasi Route Movie

Buka `src/router/index.js:22-40`:

```js
// Route untuk Movie (Netflix-like)
{
  path: '/',
  component: () => import('@/layouts/MovieLayout.vue'),  // [1]
  children: [
    {
      path: '',
      name: 'movies',
      component: () => import('@/views/movies/MoviesView.vue'),  // [2]
      meta: { title: 'VueFlix - Movies' },
    },
    {
      path: 'movie/:id',                                      // [3]
      name: 'movie-detail',
      component: () => import('@/views/movies/MovieDetailView.vue'),
      meta: { title: 'Movie Detail' },
    },
  ],
},
```

---

## Konsep Nested Routes

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | **Parent route** | `/` menggunakan `MovieLayout` sebagai layout. Layout ini punya `<RouterView />` sendiri |
| [2] | **Child route** | `path: ''` artinya path kosong = halaman utama. Dirender di `<RouterView />` dalam layout |
| [3] | **Route params** | `:id` adalah dynamic segment. `/movie/123` → `id = "123"` |

::: info Struktur Nested Route
```
/                           ← MovieLayout (navbar + footer)
  path: ''                  ← MoviesView   (halaman utama)
  path: 'movie/:id'         ← MovieDetailView (detail)
/admin                       ← AppLayout (sidebar + topbar)
  path: ''                  ← DashboardView
  path: 'products'          ← ProductsView
```
Dua root layout berbeda: `MovieLayout` dan `AppLayout`.
:::

---

## Lazy Loading Routes

Di contoh di atas, setiap komponen di-load dengan dynamic import:

```js
component: () => import('@/views/movies/MoviesView.vue')
```

Ini disebut **lazy loading** atau **code splitting**. Komponen hanya diunduh browser saat pertama kali user mengakses route tersebut — tidak ikut dalam bundle awal. Hasilnya: **initial load lebih cepat**.

Berikut perbandingannya:

```js
// EAGER LOADING — langsung di-bundle, cocok untuk halaman yang sering diakses
import MoviesView from '@/views/movies/MoviesView.vue'
{ path: '', component: MoviesView }

// LAZY LOADING — di-bundle terpisah, cocok untuk halaman yang jarang diakses
{ path: '', component: () => import('@/views/movies/MoviesView.vue') }
```

::: tip Kapan pakai lazy loading?
Selalu gunakan lazy loading kecuali untuk komponen yang **pasti** diakses setiap saat (misal: layout utama atau homepage yang adalah entry point).
:::

---

## Named Routes vs Path

Kita menggunakan **named routes** untuk navigasi:

```js
// Definisi route dengan nama
{ path: 'movie/:id', name: 'movie-detail', component: MovieDetailView }

// Navigasi dengan nama — tidak perlu tahu path persisnya
router.push({ name: 'movie-detail', params: { id: movie.id } })
```

Keuntungan named routes: jika suatu saat path berubah (misal `/movie/:id` → `/film/:id`), semua `router.push({ name: ... })` tetap berfungsi tanpa perlu diubah.

---

## Route Meta

```js
meta: { title: 'Movie Detail' }
```

`meta` menyimpan metadata tambahan. Di aplikasi ini, `title` dibaca oleh navigation guard untuk mengubah judul halaman (`document.title`).

---

## Reactive Route Params dengan watch()

Ini adalah **bugfix paling penting** di aplikasi. Buka `src/views/movies/MovieDetailView.vue:37-49`:

```js
const loadMovie = async (id) => {         // [1] Fungsi reusable
  window.scrollTo(0, 0)                   // [2]
  showTrailer.value = false               // [3]
  showPerson.value = false
  movieStore.clearPerson()
  await movieStore.fetchMovieDetail(id)    // [4]
}

onMounted(() => loadMovie(route.params.id))  // [5]

watch(() => route.params.id, (newId, oldId) => {  // [6]
  if (newId && newId !== oldId) loadMovie(newId)
})
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Reusable function | `loadMovie(id)` — dipanggil dari dua tempat: `onMounted` dan `watch` |
| [2] | Scroll to top | Saat pindah film, scroll kembali ke atas halaman |
| [3] | Reset UI state | Tutup semua modal yang mungkin terbuka dari film sebelumnya |
| [4] | Fetch data baru | Panggil store action untuk mengambil detail film dengan ID baru |
| [5] | Initial load | `onMounted` hanya dijalankan sekali — saat komponen pertama kali dibuat |
| [6] | **Watch route param** | Saat user klik "More Like This" → URL berubah tapi komponen **tidak di-recreate** → `onMounted` tidak dipanggil → data tidak update. `watch()` memperbaiki ini |

::: danger Masalah Tanpa watch()
Tanpa `watch()`, skenario ini akan gagal:
1. User buka `/movie/550` (Fight Club)
2. User scroll ke bawah, klik film di "More Like This"
3. URL berubah ke `/movie/680` (Pulp Fiction)
4. Tapi judul dan data **tetap Fight Club** — karena komponen tidak di-recreate, `onMounted` tidak jalan
5. User harus refresh manual untuk melihat data yang benar

Dengan `watch()`, setiap perubahan `route.params.id` otomatis memicu `loadMovie()`.
:::

---

## scrollBehavior

Buka `src/router/index.js:78-82`:

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})
```

Ini memastikan **setiap navigasi ke halaman baru selalu scroll ke atas**. Namun, ini tidak berlaku untuk navigasi dalam komponen yang sama (seperti klik "More Like This") — itulah kenapa kita tambahkan `window.scrollTo(0, 0)` manual di `loadMovie()`.

---

## Navigation Guards

Buka `src/router/index.js:91-113`:

```js
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  document.title = to.meta?.title ? `${to.meta.title} | VueStore` : 'VueStore'  // [1]

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {   // [2]
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guest && authStore.isAuthenticated) {            // [3]
    return { name: 'dashboard' }
  }
})
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Dynamic title | Set judul halaman browser berdasarkan `meta.title` |
| [2] | Auth guard | Jika halaman butuh login (`requiresAuth: true`) tapi user belum login → redirect ke `/login` |
| [3] | Guest guard | Jika halaman khusus tamu (`guest: true`) tapi user sudah login → redirect ke dashboard |

Route movie (`/` dan `/movie/:id`) **tidak memiliki** `requiresAuth` — artinya bisa diakses tanpa login (publik).

---

## Rangkuman

| Konsep | Implementasi | Lokasi |
|---|---|---|
| Nested routes | Parent route = layout, children = halaman | `router/index.js:23-40` |
| Route params | `:id` dynamic segment | `router/index.js:34` |
| Named routes | `name: 'movie-detail'` | `router/index.js:35` |
| Lazy loading | `() => import('...')` | `router/index.js:30` |
| Route meta | `meta: { title: '...' }` | `router/index.js:31` |
| Reactive params | `watch(() => route.params.id, ...)` | `MovieDetailView.vue:47` |
| Programmatic nav | `router.push({ name, params })` | `MovieCard.vue:13` |
| scrollBehavior | Kembali ke atas setiap navigasi | `router/index.js:82` |
| Navigation guard | `router.beforeEach()` | `router/index.js:91` |
