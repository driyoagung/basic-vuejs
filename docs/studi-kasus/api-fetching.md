# API Fetching dengan Axios

Halaman ini membahas `movieService.js` (`src/api/movieService.js`) — layer HTTP yang bertanggung jawab mengambil data dari TMDB API menggunakan Axios. Termasuk konfigurasi instance Axios, Bearer token authentication, dan pattern service layer.

---

## Kenapa Service Layer?

Memisahkan logika HTTP request dari komponen dan store memberikan beberapa keuntungan:

1. **Reusable** — fungsi yang sama bisa dipakai di banyak tempat
2. **Testable** — service bisa di-mock saat unit testing
3. **Maintainable** — kalau API berubah, cukup ubah di satu file

---

## Konfigurasi Axios Instance

Buka `src/api/movieService.js:1-13`:

```js
import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'      // [1]
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'       // [2]

const tmdbApi = axios.create({                             // [3]
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`, // [4]
  },
  params: { language: 'en-US' },                           // [5]
})
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Konstanta URL | Base URL TMDB API versi 3. Disimpan sebagai konstanta agar mudah diubah |
| [2] | Konstanta image CDN | URL untuk mengambil gambar poster/backdrop. Bukan API endpoint, tapi CDN statis |
| [3] | `axios.create()` | Membuat **instance Axios khusus** dengan konfigurasi default. Lebih baik daripada `axios` global |
| [4] | Bearer token | Authentication menggunakan **API Read Access Token** dari TMDB. `import.meta.env.VITE_*` membaca dari `.env` |
| [5] | Default params | Setiap request akan otomatis menyertakan `language=en-US` tanpa perlu ditulis ulang |

::: tip axios.create() vs axios langsung
`axios.create()` menghasilkan instance dengan konfigurasi default. Setiap request menggunakan instance ini otomatis punya baseURL, headers, dan params yang sama. Ini menghindari pengulangan kode.
:::

---

## Helper: imageUrl

Buka `src/api/movieService.js:15-18`:

```js
export const imageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a1a/666?text=No+Image'  // [1]
  return `${TMDB_IMAGE_BASE}/${size}${path}`   // [2]
}
```

| Baris | Penjelasan |
|---|---|
| [1] | **Fallback**: Jika `path` adalah `null`/`undefined`, tampilkan placeholder abu-abu. Mencegah gambar broken |
| [2] | **URL lengkap**: Gabungkan CDN base + ukuran + path. Contoh: `https://image.tmdb.org/t/p/w500/abc123.jpg` |

Ukuran gambar TMDB yang tersedia: `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`.

---

## Service Functions: Fetch Data

Buka `src/api/movieService.js:20-83`. Semua fungsi mengikuti pola yang sama:

### Pola Dasar

```js
export const movieService = {
  getTrending: async (page = 1) => {                  // [1]
    const { data } = await tmdbApi.get('/trending/movie/week', { params: { page } }) // [2]
    return data                                        // [3]
  },
  // ... fungsi lainnya
}
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Async function | Semua fungsi return **Promise** (async/await) |
| [2] | Destructuring + additional params | `{ data }` mengambil properti `data` dari response Axios. `{ params: { page } }` menambahkan query param |
| [3] | Return data mentah | Mengembalikan response JSON langsung, tidak di-transform |

### Daftar Endpoint

```js
export const movieService = {
  getTrending: async (page = 1) => {
    const { data } = await tmdbApi.get('/trending/movie/week', { params: { page } })
    return data
  },

  getPopular: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/popular', { params: { page } })
    return data
  },

  getTopRated: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/top_rated', { params: { page } })
    return data
  },

  getUpcoming: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/upcoming', { params: { page } })
    return data
  },

  getNowPlaying: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/now_playing', { params: { page } })
    return data
  },

  getGenres: async () => {
    const { data } = await tmdbApi.get('/genre/movie/list')
    return data.genres    // [4] — langsung return array genres
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const { data } = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, sort_by: 'popularity.desc', page },
    })
    return data
  },

  getMovieDetail: async (id) => {
    const { data } = await tmdbApi.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,similar,videos' },  // [5]
    })
    return data
  },

  searchMovies: async (query, page = 1) => {
    const { data } = await tmdbApi.get('/search/movie', {
      params: { query, page, include_adult: false },
    })
    return data
  },

  getPersonDetail: async (id) => {
    const { data } = await tmdbApi.get(`/person/${id}`, {
      params: { append_to_response: 'movie_credits' },  // [6]
    })
    return data
  },
}
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [4] | Transform response | Untuk `/genre/movie/list`, kita hanya perlu `data.genres`, bukan seluruh response object |
| [5] | `append_to_response` | **Fitur keren TMDB**: Satu request bisa mengambil data terkait (credits, similar movies, videos) sekaligus. Hemat bandwith! |
| [6] | Dynamic URL param | Template literal (`` ` ` ``) untuk menyisipkan ID ke URL |

---

## Environment Variables (.env)

Buka `.env`:

```ini
# Dapatkan dari https://www.themoviedb.org/settings/api (wajib daftar akun TMDB gratis)
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_READ_ACCESS_TOKEN=your_read_access_token_here
```

Diakses dengan:

```js
// Syntax Vite — hanya berfungsi saat build/dev
import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN

// JANGAN pakai ini di Vite (hanya untuk Node.js)
process.env.VITE_TMDB_READ_ACCESS_TOKEN
```

::: danger Jangan Commit .env!
File `.env` berisi kredensial rahasia. Sudah ditambahkan ke `.gitignore`. Untuk deployment di Vercel/Netlify, tambahkan environment variable lewat dashboard.
:::

---

## Error Handling di Service Layer

Di service layer ini, kita **tidak menangani error** — error akan dilempar (throw) ke atas ke Pinia store yang memanggilnya.

```js
// Di movieStore.js (bukan di service)
try {
  const data = await movieService.getTrending()
  // ...
} catch (err) {
  error.value = err.message   // Tangkap di sini
}
```

Ini adalah pattern yang disengaja: **service hanya bertugas fetch data**, masalah UI seperti loading spinner dan error message ditangani oleh store atau komponen.

---

## Rangkuman

| Konsep | Implementasi | Lokasi |
|---|---|---|
| Axios instance | `axios.create()` dengan baseURL, headers, params | `movieService.js:6` |
| Authentication | Bearer token dari `import.meta.env` | `movieService.js:10` |
| Helper function | `imageUrl()` untuk generate URL gambar + fallback | `movieService.js:15` |
| Async functions | Semua fungsi adalah `async` return Promise | `movieService.js:21-83` |
| Dynamic params | Template literal untuk URL param (`movie/${id}`) | `movieService.js:59` |
| append_to_response | Ambil data terkait dalam 1 request | `movieService.js:60` |
| Environment vars | `VITE_*` prefix, dibaca via `import.meta.env` | `.env` |
| Separation of concerns | Service = HTTP, Store = state, Component = UI | Seluruh arsitektur |
