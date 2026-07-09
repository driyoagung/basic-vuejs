# State Management dengan Pinia

Halaman ini membahas `movieStore.js` (`src/stores/movieStore.js`) — Pinia store yang mengelola seluruh state aplikasi movie, dari daftar film trending hingga detail person.

---

## Kenapa Pinia?

Pinia adalah state management library resmi Vue 3. Dalam aplikasi ini, beberapa komponen perlu mengakses data yang sama:

- `MovieLayout` → butuh `searchQuery` dan `searchResults`
- `MoviesView` → butuh `trending`, `popular`, `topRated`, dll
- `MovieDetailView` → butuh `selectedMovie`, `selectedPerson`

Tanpa Pinia, kita harus melakukan **prop drilling** (oper data props dari parent ke child ke grandchild). Pinia menyediakan **shared state** yang bisa diakses dari komponen mana pun.

---

## Setup Store Pattern

Buka `src/stores/movieStore.js:1-5`:

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { movieService } from '@/api/movieService'

export const useMovieStore = defineStore('movies', () => {
  // ... semua state, getters, dan actions di sini
})
```

::: info Setup Store vs Options Store
Pinia mendukung dua syntax:
- **Options Store** — mirip Vue Options API (`state`, `getters`, `actions`)
- **Setup Store** — mirip Vue Composition API (`ref`, `computed`, function)

Kita menggunakan **Setup Store** karena lebih konsisten dengan `script setup` di komponen.
:::

---

## State (Reactive Data)

Buka `src/stores/movieStore.js:6-18`:

```js
const trending = ref([])          // [1]  Array film trending minggu ini
const popular = ref([])           // [2]  Array film populer
const topRated = ref([])          // [3]  Array film rating tertinggi
const upcoming = ref([])          // [4]  Array film yang akan datang
const nowPlaying = ref([])        // [5]  Array film sedang tayang
const genres = ref([])            // [6]  Array genre { id, name }
const moviesByGenre = ref({})     // [7]  Object: { genreId: [movies] }
const searchResults = ref([])     // [8]  Hasil pencarian user
const selectedMovie = ref(null)   // [9]  Film yang sedang dilihat detailnya
const selectedPerson = ref(null)  // [10] Aktor yang sedang dilihat detailnya
const isLoading = ref(false)      // [11] Flag loading global
const error = ref(null)           // [12] Pesan error jika ada
const searchQuery = ref('')       // [13] Kata kunci pencarian
```

| Baris | State | Tipe | Kegunaan |
|---|---|---|---|
| [1]-[5] | Kategori film | `ref([])` | Menyimpan hasil fetch per kategori. Default array kosong |
| [6] | Genres | `ref([])` | Daftar genre dari TMDB, dipakai untuk fetch per genre |
| [7] | Movies by genre | `ref({})` | Object kosong, diisi dengan key = genre ID |
| [8] | Search results | `ref([])` | Diisi saat user melakukan pencarian |
| [9]-[10] | Selected item | `ref(null)` | Menyimpan film/aktor yang sedang dipilih untuk detail |
| [11] | Loading flag | `ref(false)` | `true` = sedang fetch, dipakai untuk spinner |
| [12] | Error message | `ref(null)` | `null` = tidak ada error, string = ada error |
| [13] | Search query | `ref('')` | Keyword yang diketik user di search bar |

---

## Getters (Computed Properties)

Buka `src/stores/movieStore.js:20-25`:

```js
const featuredMovie = computed(() => {
  if (trending.value.length > 0) {
    return trending.value[Math.floor(Math.random() * Math.min(5, trending.value.length))]
  }
  return null
})
```

`featuredMovie` adalah **computed property** yang memilih film acak dari 5 film trending teratas untuk ditampilkan di hero banner. Setiap kali halaman direfresh, film yang dipilih bisa berbeda.

::: tip Perbedaan ref vs computed
- `ref()` — menyimpan nilai yang bisa diubah manual (via `.value = x`)
- `computed()` — nilai turunan yang otomatis dihitung ulang saat dependensinya berubah
:::

---

## Actions (Async Methods)

### fetchAllCategories

Buka `src/stores/movieStore.js:27-57`:

```js
const fetchAllCategories = async () => {
  isLoading.value = true             // [1]
  error.value = null                 // [2]
  try {
    const [trendingRes, popularRes, ...] = await Promise.all([  // [3]
      movieService.getTrending(),
      movieService.getPopular(),
      movieService.getTopRated(),
      movieService.getUpcoming(),
      movieService.getNowPlaying(),
      movieService.getGenres(),
    ])
    trending.value = trendingRes.results     // [4]
    popular.value = popularRes.results
    topRated.value = topRatedRes.results
    // ...

    const genrePromises = genresRes.slice(0, 4).map(async (genre) => {  // [5]
      const res = await movieService.getMoviesByGenre(genre.id)
      moviesByGenre.value[genre.id] = res.results
    })
    await Promise.all(genrePromises)         // [6]
  } catch (err) {
    error.value = err.message                // [7]
  } finally {
    isLoading.value = false                  // [8]
  }
}
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Loading state | Set `true` sebelum fetch — komponen bisa menampilkan spinner |
| [2] | Reset error | Bersihkan error sebelumnya |
| [3] | `Promise.all()` | **Parallel fetching**: 6 request dikirim bersamaan, bukan satu per satu. Jauh lebih cepat! |
| [4] | Array destructuring | `[a, b, c, d, e, f]` — setiap elemen array adalah hasil dari satu promise |
| [5] | Sequential genre fetch | Ambil 4 genre pertama, untuk masing-masing fetch filmnya |
| [6] | `Promise.all()` lagi | 4 genre fetch juga paralel |
| [7] | Error handling | Jika ada request gagal, tangkap error-nya dan simpan ke state |
| [8] | Finally cleanup | Loading spinner dimatikan, baik sukses maupun gagal |

### fetchMovieDetail

Buka `src/stores/movieStore.js:59-71`:

```js
const fetchMovieDetail = async (id) => {
  isLoading.value = true
  error.value = null
  try {
    const data = await movieService.getMovieDetail(id)  // [1]
    selectedMovie.value = data                           // [2]
    return data                                          // [3]
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
```

| Baris | Penjelasan |
|---|---|
| [1] | Panggil service dengan parameter ID film |
| [2] | Simpan hasil ke `selectedMovie` — langsung tersedia di semua komponen |
| [3] | Return data agar pemanggil bisa langsung pakai hasilnya |

### searchMovies

Buka `src/stores/movieStore.js:73-88`:

```js
const searchMovies = async (query) => {
  if (!query.trim()) {                   // [1]
    searchResults.value = []
    return
  }
  isLoading.value = true
  error.value = null
  try {
    const data = await movieService.searchMovies(query)
    searchResults.value = data.results   // [2]
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
```

| Baris | Penjelasan |
|---|---|
| [1] | **Early return**: Jika query kosong, langsung reset results tanpa fetch |
| [2] | Hasil search disimpan ke `searchResults` — akan langsung tampil di `MoviesView` |

### fetchPersonDetail dan clearPerson

```js
const fetchPersonDetail = async (id) => {
  // Pola yang sama: loading → fetch → simpan ke state → cleanup
}

const clearPerson = () => {
  selectedPerson.value = null      // Reset state saat modal ditutup
}
```

---

## Return Statement

Buka `src/stores/movieStore.js:113-134`:

```js
return {
  trending, popular, topRated, upcoming, nowPlaying,
  genres, moviesByGenre, searchResults,
  selectedMovie, selectedPerson,
  isLoading, error, searchQuery,
  featuredMovie,
  fetchAllCategories, fetchMovieDetail, fetchPersonDetail,
  clearPerson, searchMovies, clearSearch,
}
```

**Semua** yang ingin diakses dari luar store harus di-return. State, getter, dan action semuanya di-return sebagai properti object.

::: warning Jangan Lupa Return
Di setup store, hanya properti yang di-return yang bisa diakses dari komponen. Jika lupa me-return state atau action, properti itu tidak akan tersedia.
:::

---

## Cara Memakai Store di Komponen

```js
// Di komponen mana pun:
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore()

// Baca state (reaktif otomatis)
console.log(movieStore.trending)       // array film trending
console.log(movieStore.isLoading)      // boolean loading

// Baca getter
console.log(movieStore.featuredMovie)  // computed, auto update

// Panggil action
movieStore.fetchAllCategories()
movieStore.searchMovies('avengers')
movieStore.clearSearch()
```

Tidak perlu `watch`, tidak perlu `ref` lagi di komponen. Store Pinia sudah reaktif.

---

## Rangkuman

| Konsep | Implementasi | Lokasi |
|---|---|---|
| Setup store | `defineStore('name', () => { ... })` | `movieStore.js:5` |
| State | `const x = ref(initialValue)` | `movieStore.js:6-18` |
| Getter | `const x = computed(() => ...)` | `movieStore.js:20` |
| Action | `const fetchX = async () => { ... }` | `movieStore.js:27` |
| Parallel fetch | `Promise.all([...])` + destructuring | `movieStore.js:31` |
| Error handling | `try/catch/finally` dengan loading flag | `movieStore.js:29-56` |
| Early return | `if (!query) return` — skip fetch | `movieStore.js:74` |
| Reactive access | `movieStore.trending` — otomatis reaktif | Di komponen |
