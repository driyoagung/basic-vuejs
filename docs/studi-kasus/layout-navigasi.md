# Layout & Navigasi

Halaman ini membahas `MovieLayout.vue` (`src/layouts/MovieLayout.vue`), yaitu layout utama aplikasi movie yang meniru tampilan Netflix — navbar transparan yang berubah saat scroll, search toggle, dan struktur template dengan `<RouterView />`.

---

## Peran MovieLayout

`MovieLayout` adalah **parent component** di level route `/`. Ia bertanggung jawab atas:

1. **Navbar** — tetap di atas (fixed), transparan jadi solid saat scroll
2. **Search bar** — tombol search yang expand menjadi input field
3. **RouterView** — tempat anak route (`/` dan `/movie/:id`) dirender
4. **Footer** — informasi copyright

---

## Struktur Script Setup

Buka `src/layouts/MovieLayout.vue:1-42`. Mari kita bedah:

### 1. Import dan Inisialisasi

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'       // [1]
import { RouterView, useRouter } from 'vue-router'        // [2]
import { Search, X, Film } from '@lucide/vue'              // [3]
import { useMovieStore } from '@/stores/movieStore'        // [4]

const movieStore = useMovieStore()  // [5]
const router = useRouter()          // [6]
const isScrolled = ref(false)       // [7]
const showSearch = ref(false)       // [8]
const searchInput = ref(null)       // [9]
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | `ref`, `onMounted`, `onUnmounted` | Tiga API inti Vue: reactive state (`ref`) dan lifecycle hooks |
| [2] | `RouterView`, `useRouter` | RouterView = slot render anak route; useRouter = navigasi programatik |
| [3] | Lucide icons | Import icon spesifik (Search, X, Film) — lebih efisien daripada import semua |
| [4] | Pinia store | `useMovieStore()` = akses state dan actions dari store movie |
| [5] | Store instance | Dipanggil di top-level `<script setup>`, bukan di dalam fungsi |
| [6] | Router instance | `useRouter()` hanya bisa dipanggil di dalam `setup()` context |
| [7] | `ref(false)` | Reactive boolean — track apakah user sudah scroll |
| [8] | `ref(false)` | Reactive boolean — kontrol visibilitas search input |
| [9] | `ref(null)` | Template ref — referensi ke elemen DOM (input search) |

### 2. Scroll Detection

```vue
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10       // [1]
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)  // [2]
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll) // [3]
})
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Conditional logic | Jika posisi scroll > 10px, navbar jadi solid (`isScrolled = true`) |
| [2] | `onMounted` | Tambahkan event listener setelah komponen terpasang di DOM |
| [3] | `onUnmounted` | **Penting!** Hapus event listener saat komponen dihancurkan untuk mencegah memory leak |

::: warning Always Clean Up Event Listeners
Setiap kali menambahkan `addEventListener` di `onMounted`, wajib menghapusnya di `onUnmounted`. Tanpa ini, listener akan tetap berjalan walau komponen sudah tidak dipakai.
:::

### 3. Search Logic

```vue
const toggleSearch = () => {
  showSearch.value = !showSearch.value       // [1]
  if (showSearch.value) {
    setTimeout(() => searchInput.value?.focus(), 100)  // [2]
  } else {
    movieStore.clearSearch()                 // [3]
  }
}

const handleSearch = (e) => {
  movieStore.searchMovies(e.target.value)    // [4]
}
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Toggle state | Flip nilai boolean `showSearch` |
| [2] | `setTimeout` + template ref | Delay 100ms untuk menunggu elemen input render, lalu fokuskan kursor |
| [3] | Store action | Panggil `clearSearch()` untuk reset hasil pencarian |
| [4] | Event handler | Setiap user mengetik, panggil `searchMovies()` dari store |

---

## Struktur Template

Buka `src/layouts/MovieLayout.vue:44-93`:

### Navbar dengan Dynamic Class

```html
<nav
  :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-12',
    isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
  ]"
>
```

- **`:class` dengan array**: Vue menggabungkan beberapa class menjadi satu
- **Ternary operator**: Jika `isScrolled = true` → background `#141414` (warna Netflix). Jika `false` → gradient transparan
- **`transition-all duration-300`**: Transisi smooth saat background berubah

### RouterView

```html
<main>
  <RouterView />    <!-- Di sinilah MoviesView atau MovieDetailView dirender -->
</main>
```

`RouterView` adalah komponen bawaan Vue Router yang otomatis menampilkan komponen sesuai URL yang aktif. Di route `/`, yang tampil adalah `MoviesView`. Di `/movie/123`, yang tampil adalah `MovieDetailView`.

### Search Toggle (v-if)

```html
<div v-if="showSearch" class="flex items-center bg-black/80 ...">
  <Search class="w-4 h-4 ..." />
  <input ref="searchInput" type="text" ... @input="handleSearch" />
  <button @click="toggleSearch"><X class="w-4 h-4" /></button>
</div>
<button v-else @click="toggleSearch" class="p-2 ...">
  <Search class="w-5 h-5" />
</button>
```

Pola `v-if` / `v-else` di sini:
- Jika `showSearch = true` → tampilkan input search + tombol X
- Jika `showSearch = false` → tampilkan ikon Search saja (tombol untuk membuka search)

---

## Tailwind Classes Penting di Layout

| Class | Efek | File:Line |
|---|---|---|
| `fixed top-0 z-50` | Navbar menempel di atas, di atas semua elemen | `MovieLayout.vue:47` |
| `bg-[#141414]` | Warna custom Netflix dark | `MovieLayout.vue:45` |
| `bg-gradient-to-b from-black/80 to-transparent` | Gradient hitam ke transparan | `MovieLayout.vue:49` |
| `transition-all duration-300` | Animasi smooth semua perubahan | `MovieLayout.vue:47` |
| `px-4 md:px-12` | Padding 16px mobile, 48px desktop | `MovieLayout.vue:47` |

---

## Rangkuman

| Konsep | File | Kode |
|---|---|---|
| Reactive state | `MovieLayout.vue` | `const isScrolled = ref(false)` |
| Lifecycle hooks | `MovieLayout.vue` | `onMounted()` + `onUnmounted()` |
| Template ref | `MovieLayout.vue` | `const searchInput = ref(null)` → `ref="searchInput"` |
| Dynamic class | `MovieLayout.vue` | `:class="[...]"` dengan ternary |
| Conditional render | `MovieLayout.vue` | `v-if` / `v-else` untuk search toggle |
| Slot router | `MovieLayout.vue` | `<RouterView />` |
| Tailwind responsive | `MovieLayout.vue` | `px-4 md:px-12` (mobile vs desktop) |
