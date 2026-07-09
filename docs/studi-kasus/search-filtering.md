# Search & Filtering

Halaman ini menjelaskan bagaimana fitur pencarian film diimplementasikan — dari input di `MovieLayout`, action di `movieStore`, hingga tampilan hasil di `MoviesView`.

---

## Alur Pencarian

```
User mengetik di search bar (MovieLayout)
    ↓ @input="handleSearch"
Kirim query ke movieStore.searchMovies(query)
    ↓
movieStore memanggil movieService.searchMovies(query)
    ↓
TMDB API mengembalikan hasil pencarian
    ↓
movieStore.searchResults terisi
    ↓
MoviesView mendeteksi perubahan, tampilkan hasil
```

---

## Input Search di MovieLayout

Buka `src/layouts/MovieLayout.vue:64-76`:

```html
<div v-if="showSearch" class="flex items-center bg-black/80 border border-white/30 rounded">
  <Search class="w-4 h-4 text-white/70 ml-3" />
  <input
    ref="searchInput"
    type="text"
    placeholder="Titles, people, genres"
    class="bg-transparent text-white text-sm px-3 py-2 w-48 md:w-64
           outline-none placeholder:text-white/50"
    @input="handleSearch"                            <!-- [1] -->
  />
  <button @click="toggleSearch" class="p-2 text-white/70 hover:text-white cursor-pointer">
    <X class="w-4 h-4" />
  </button>
</div>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | `@input` event | Setiap kali user mengetik (bukan hanya submit), panggil `handleSearch` |

### Handler di Script

```js
const handleSearch = (e) => {
  movieStore.searchMovies(e.target.value)      // Kirim nilai input ke store
}
```

---

## Action searchMovies di Store

Buka `src/stores/movieStore.js:73-88`:

```js
const searchMovies = async (query) => {
  if (!query.trim()) {                  // [1] Empty check
    searchResults.value = []
    return
  }
  isLoading.value = true
  error.value = null
  try {
    const data = await movieService.searchMovies(query)
    searchResults.value = data.results   // [2] Update state
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
```

| Baris | Penjelasan |
|---|---|
| [1] | **Early return** — jika query kosong/hanya spasi, reset hasil tanpa fetch API. Mencegah request tidak berguna |
| [2] | Hasil search disimpan ke `searchResults` — reactive state yang langsung terpantau oleh komponen |

---

## Tampilan Hasil di MoviesView

Buka `src/views/movies/MoviesView.vue:27-52`:

```html
<div v-if="movieStore.searchResults.length > 0">         <!-- [1] -->
  <h2 class="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12 pt-4">
    Search Results for "{{ movieStore.searchQuery }}"
  </h2>
  <div class="flex flex-wrap gap-2 px-4 md:px-12">      <!-- [2] -->
    <MovieCard v-for="movie in movieStore.searchResults" :key="movie.id" :movie="movie" />
  </div>
</div>

<template v-else>                                         <!-- [3] -->
  <MovieRow title="Trending Now" :movies="movieStore.trending" />
  <MovieRow title="Popular on VueFlix" :movies="movieStore.popular" />
  <MovieRow title="Top Rated" :movies="movieStore.topRated" />
  <!-- ... rows lainnya ... -->
</template>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Conditional render | `searchResults.length > 0` → tampilkan hasil pencarian |
| [2] | `flex flex-wrap` | Berbeda dengan MovieRow yang horizontal scroll — hasil pencarian pakai **wrap layout** |
| [3] | `v-else` | Jika tidak ada pencarian aktif, tampilkan halaman utama normal |

Status search juga mempengaruhi layout hasil:
- **Search aktif** → `flex flex-wrap gap-2` (grid-like, item turun ke bawah)
- **Tidak search** → `MovieRow` (horizontal scroll per kategori)

---

## Membersihkan Pencarian

```js
// Di movieStore.js
const clearSearch = () => {
  searchResults.value = []
  searchQuery.value = ''
}
```

Dipanggil saat:
1. User klik tombol X di search bar (di `MovieLayout`)
2. User klik logo/home (di `MovieLayout`)

---

## Optimasi yang Tidak Dilakukan (dan Kenapa)

### Tidak Ada Debounce

Saat ini, setiap ketikan user langsung memicu API call. Untuk aplikasi production, sebaiknya menggunakan **debounce** — menunda API call sampai user berhenti mengetik:

```js
// Contoh debounce (tidak diimplementasikan di aplikasi ini)
import { ref, watch } from 'vue'

const searchQuery = ref('')
let debounceTimer = null

watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    movieStore.searchMovies(newQuery)
  }, 500)  // Tunggu 500ms setelah user berhenti mengetik
})
```

Alasan tidak diimplementasikan: TMDB API cukup cepat dan tidak membatasi request untuk penggunaan normal. Untuk belajar, pattern tanpa debounce lebih sederhana dipahami.

### Tidak Ada AbortController

Request sebelumnya tidak dibatalkan saat user mengetik lagi. Di project yang sama, file `useFetch.js` (`src/composables/useFetch.js`) sudah memiliki implementasi AbortController. Pattern tersebut bisa diadaptasi ke search.

---

## Clear Search vs Route Change

Saat user navigasi ke halaman detail atau kembali ke home:
- `clearSearch()` dipanggil di `goHome()` (`MovieLayout.vue:38`)
- Hasil pencarian di-reset, tampilan kembali ke kategori

---

## Rangkuman

| Konsep | Implementasi | Lokasi |
|---|---|---|
| Input event | `@input="handleSearch"` | `MovieLayout.vue:71` |
| Store action | `searchMovies(query)` | `movieStore.js:73` |
| Early return | `if (!query.trim()) return` | `movieStore.js:74` |
| Conditional render | `v-if="searchResults.length > 0" / v-else` | `MoviesView.vue:27,36` |
| Wrap vs scroll layout | `flex flex-wrap` (search) vs `overflow-x-auto` (rows) | `MoviesView.vue:31` vs `MovieRow.vue:36` |
| Clear search | `clearSearch()` action | `movieStore.js:90` |
| Reactive state | `searchResults` di store langsung update UI | Otomatis oleh Pinia |
