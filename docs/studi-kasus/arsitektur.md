# Arsitektur Proyek Movie App

Halaman ini menjelaskan struktur folder, alur data, dan dependensi yang digunakan dalam aplikasi **VueFlix** — clone Netflix berbasis Vue.js 3 yang mengambil data dari TMDB API.

---

## Struktur Folder Movie

Semua file terkait fitur movie berada di dalam `src/`:

```
src/
├── api/
│   └── movieService.js       ← HTTP request ke TMDB API (Axios)
├── components/
│   └── movies/
│       ├── MovieCard.vue      ← Kartu poster film
│       ├── MovieHero.vue      ← Banner film utama (hero)
│       ├── MovieRow.vue       ← Baris film horizontal scrollable
│       ├── PersonModal.vue    ← Modal detail aktor + filmografi
│       └── TrailerModal.vue   ← Modal pemutar trailer YouTube
├── layouts/
│   └── MovieLayout.vue        ← Layout Netflix (navbar + footer)
├── stores/
│   └── movieStore.js          ← State management (Pinia)
├── views/
│   └── movies/
│       ├── MoviesView.vue     ← Halaman utama daftar film
│       └── MovieDetailView.vue ← Halaman detail film
└── router/
    └── index.js               ← Konfigurasi route (termasuk / dan /movie/:id)
```

---

## Alur Data (Data Flow)

Diagram sederhana bagaimana data mengalir dari API hingga ke tampilan:

```
[TMDB API] 
    ↑ Axios request
[movieService.js]     ← fungsi fetch (HTTP layer)
    ↑ dipanggil oleh
[movieStore.js]       ← Pinia store (state + actions)
    ↑ konsumsi dari
[View / Component]    ← MoviesView, MovieDetailView, MovieHero, MovieRow, MovieCard
    ↓ tampilkan ke
[User Interface]      ← Template dengan Tailwind CSS
```

::: info Prinsip Separation of Concerns
Setiap layer punya tanggung jawab spesifik:
- **Service** → hanya urusan HTTP (request/response)
- **Store** → hanya urusan state (simpan data, kelola loading/error)
- **View/Component** → hanya urusan tampilan (render data dari store)
:::

---

## Dependensi yang Digunakan

| Library | Versi | Kegunaan |
|---|---|---|
| Vue 3 | ^3.5 | Framework utama (Composition API) |
| Vue Router | ^5.1 | Navigasi antar halaman |
| Pinia | ^3.0 | State management |
| Axios | ^1.18 | HTTP client untuk request ke API |
| Tailwind CSS | ^4.3 | Utility-first CSS framework |
| Lucide Vue | ^1.22 | Library icon |

---

## Rute Aplikasi

Aplikasi memiliki dua bagian utama:

| Path | Komponen Layout | Halaman | Deskripsi |
|---|---|---|---|
| `/` | MovieLayout | MoviesView | Dashboard film (Netflix homepage) |
| `/movie/:id` | MovieLayout | MovieDetailView | Detail film |
| `/admin` | AppLayout | DashboardView | Dashboard admin (lama) |

::: tip Dua Layout Berbeda
Aplikasi ini menggunakan **dua layout berbeda**:
- `MovieLayout` — tema gelap ala Netflix untuk halaman movie
- `AppLayout` — tema sidebar terang untuk dashboard admin

Ini dipisahkan di level route menggunakan **nested routes** (parent route dengan component layout + children routes untuk halaman).
:::

---

## Environment Variables

API key dan token TMDB disimpan di file `.env` (tidak di-commit ke Git):

```ini
# .env — dapatkan API Key & Read Access Token dari https://www.themoviedb.org/settings/api
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_READ_ACCESS_TOKEN=your_read_access_token_here
```

Diakses di kode dengan `import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN`.

::: warning Prefix VITE_
Hanya environment variable dengan prefix `VITE_` yang bisa diakses dari kode frontend. Ini adalah fitur keamanan Vite untuk mencegah kebocoran variable yang tidak seharusnya ekspos ke client.
:::

---

## Rangkuman

| Konsep | Implementasi |
|---|---|
| Struktur folder | Dipisah berdasarkan fungsi: `api/`, `stores/`, `components/`, `views/` |
| Data flow | API → Service → Store → Component → UI |
| State management | Pinia dengan setup store (Composition API style) |
| HTTP client | Axios dengan instance terkonfigurasi (baseURL, headers) |
| CSS | Tailwind CSS v4 utility classes |
| Ikon | Lucide Vue |
| Environment | `.env` dengan prefix `VITE_` |
