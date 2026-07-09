# Component Design — MovieCard, MovieRow, MovieHero

Halaman ini membahas tiga komponen utama yang membentuk tampilan daftar film ala Netflix: `MovieCard`, `MovieRow`, dan `MovieHero`. Dari sini kita akan memahami **props, event handling, dynamic class, v-for, dan komposisi komponen**.

---

## MovieCard — Kartu Poster Film

Buka `src/components/movies/MovieCard.vue`.

### Script Setup

```vue
<script setup>
import { useRouter } from 'vue-router'
import { imageUrl } from '@/api/movieService'

const props = defineProps({
  movie: { type: Object, required: true },   // [1]
  size: { type: String, default: 'normal' },  // [2]
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })  // [3]
}

const year = props.movie.release_date?.slice(0, 4) || '-'     // [4]
const rating = props.movie.vote_average?.toFixed(1) || '-'    // [5]
</script>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Props definition | `required: true` — komponen tidak akan berfungsi tanpa prop `movie` |
| [2] | Props with default | `default: 'normal'` — jika tidak diberikan, pakai nilai default |
| [3] | Programmatic navigation | `router.push()` dengan **named route** (`movie-detail`) dan params |
| [4] | Optional chaining | `?.slice()` — jika `release_date` null/undefined, tidak error |
| [5] | Number formatting | `.toFixed(1)` — tampilkan 1 digit desimal |

### Template — Hover Overlay

```html
<div
  @click="goToDetail"
  :class="[
    'group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl',
    size === 'large' ? 'w-[200px] md:w-[250px]' : 'w-[150px] md:w-[200px]'  // [6]
  ]"
>
  <img :src="imageUrl(movie.poster_path, 'w342')" :alt="movie.title"
    class="w-full aspect-[2/3] object-cover" loading="lazy" />  <!-- [7] -->

  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent
    opacity-0 group-hover:opacity-100 transition-opacity duration-300">  <!-- [8] -->
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="text-white text-sm font-semibold line-clamp-2 mb-1">{{ movie.title }}</h3>
      <div class="flex items-center gap-2 text-xs text-white/70">
        <span class="text-green-400 font-semibold">{{ rating }}★</span>
        <span>{{ year }}</span>
      </div>
    </div>
  </div>
</div>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [6] | Dynamic class + conditional | `size === 'large'` menentukan lebar card. `md:` = breakpoint tablet ke atas |
| [7] | `loading="lazy"` | Native lazy loading — gambar hanya dimuat saat hampir terlihat di viewport |
| [8] | **Hover overlay** | `opacity-0 group-hover:opacity-100` — info film hanya muncul saat di-hover. `group` di parent + `group-hover` di child |

::: tip Tailwind `group` Pattern
`group` adalah fitur Tailwind untuk styling child element berdasarkan state parent:
```html
<div class="group">           <!-- parent: tambahkan class "group" -->
  <div class="group-hover:opacity-100">  <!-- child: "group-hover:*" akan aktif saat parent di-hover -->
    Konten
  </div>
</div>
```
Ini sangat berguna untuk card hover effect.
:::

---

## MovieRow — Baris Film Horizontal Scroll

Buka `src/components/movies/MovieRow.vue`.

### Script Setup

```vue
<script setup>
import { ref } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: { type: String, required: true },     // [1]
  movies: { type: Array, default: () => [] },  // [2]
})

const scrollContainer = ref(null)              // [3] Template ref

const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.75   // [4]
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',                        // [5]
  })
}
</script>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Props String | `required: true` — setiap row harus punya judul |
| [2] | Props Array default | **Penting**: default array harus pakai factory function `() => []`, bukan `[]` langsung |
| [3] | Template ref | `ref(null)` akan di-bind ke elemen DOM lewat `ref="scrollContainer"` |
| [4] | Dynamic scroll amount | Scroll sejauh 75% lebar container — terasa natural |
| [5] | Smooth behavior | `behavior: 'smooth'` — CSS scroll animation |

::: danger Default Props untuk Array/Object
Saat mendefinisikan default props bertipe Array atau Object, wajib menggunakan **factory function**:
```js
// BENAR
default: () => []

// SALAH — akan dipakai bersama oleh semua instance komponen!
default: []
```
:::

### Template — Horizontal Scroll + Chevron Button

```html
<template>
  <div class="mb-8 md:mb-12">
    <h2 class="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12">{{ title }}</h2>
    <div class="group/row relative">                            <!-- [6] Named group -->
      <button @click="scroll('left')"
        class="absolute left-0 ... opacity-0 group-hover/row:opacity-100 ...">  <!-- [7] -->
        <ChevronLeft class="w-8 h-8 text-white" />
      </button>

      <div ref="scrollContainer"                                <!-- [8] Template ref -->
        class="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
        style="scrollbar-width: none;">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />  <!-- [9] -->
      </div>

      <button @click="scroll('right')"
        class="absolute right-0 ... opacity-0 group-hover/row:opacity-100 ...">
        <ChevronRight class="w-8 h-8 text-white" />
      </button>
    </div>
  </div>
</template>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [6] | Named group | `group/row` — Tailwind named group, agar `group-hover/row` spesifik ke group ini |
| [7] | Hover-only buttons | Chevron kiri/kanan hanya muncul saat mouse di area row |
| [8] | Template ref bind | `ref="scrollContainer"` menghubungkan dengan `const scrollContainer = ref(null)` |
| [9] | `v-for` + komposisi | Merender komponen `MovieCard` untuk setiap film. `:key` wajib untuk performa |

---

## MovieHero — Banner Film Unggulan

Buka `src/components/movies/MovieHero.vue`.

### Struktur

`MovieHero` adalah komponen paling visual — menampilkan backdrop image fullscreen dengan overlay gradient dan informasi film.

```vue
<template>
  <div class="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">  <!-- [1] -->
    <div class="absolute inset-0">
      <img :src="imageUrl(movie.backdrop_path, 'original')" ... />     <!-- [2] -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 ..." />  <!-- [3] -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#141414] ..." />  <!-- [4] -->
    </div>

    <div class="relative h-full flex items-center px-4 md:px-12">
      <div class="max-w-xl space-y-4">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold ...">{{ movie.title }}</h1>
        <div class="flex items-center gap-3 text-sm text-white/80">
          <span class="text-green-400 font-bold">{{ rating }}★</span>
          <span>{{ year }}</span>
        </div>
        <p class="text-white/70 ...">{{ movie.overview }}</p>
        <div class="flex items-center gap-3">
          <button @click="goToDetail" class="bg-white text-black ...">
            <Play class="w-5 h-5 fill-black" /> Play
          </button>
          <button @click="goToDetail" class="bg-white/20 text-white ...">
            <Info class="w-5 h-5" /> More Info
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

| Baris | Penjelasan |
|---|---|
| [1] | `h-[70vh] md:h-[85vh]` — tinggi 70% viewport di mobile, 85% di desktop |
| [2] | Backdrop image ukuran `original` (resolusi maksimal) |
| [3] | Gradient kanan: dari hitam pekat (kiri) ke transparan (kanan). Membentuk area gelap untuk teks |
| [4] | Gradient bawah: dari `#141414` (warna background) ke transparan. Menyambungkan mulus ke section di bawahnya |

### Gradient Stacking

Dua lapisan gradient ditumpuk:
```
┌─────────────────────────────────┐
│                                 │
│  bg-gradient-to-r   (→)         │ ← Gradient horizontal: gelapkan sisi kiri untuk teks
│                                 │
│  bg-gradient-to-t   (↑)         │ ← Gradient vertikal: sambungkan ke background #141414
│                                 │
└─────────────────────────────────┘
```

Keduanya menggunakan `absolute inset-0` — menutupi seluruh area backdrop dengan lapisan semi-transparan.

---

## Komposisi Komponen

Bagaimana komponen-komponen ini terhubung:

```
MoviesView                     ← "Halaman utama"
├── MovieHero                  ← Banner film unggulan (1x)
├── MovieRow (Trending)        ← Baris horizontal scrollable
│   └── MovieCard × N          ← Kartu per film
├── MovieRow (Popular)
│   └── MovieCard × N
├── MovieRow (Top Rated)
│   └── MovieCard × N
├── ... dan seterusnya
```

Setiap `MovieRow` menerima props `title` dan `movies`, lalu merender `MovieCard` untuk setiap film. Ini adalah contoh **component composition** — komponen dibangun dari komponen lain yang lebih kecil.

---

## Rangkuman

| Konsep | Contoh | Lokasi |
|---|---|---|
| defineProps | `defineProps({ movie: { ... } })` | `MovieCard.vue:5` |
| Props default (array) | `default: () => []` | `MovieRow.vue:8` |
| Template ref | `ref="scrollContainer"` + `const scrollContainer = ref(null)` | `MovieRow.vue:11,35` |
| v-for + key | `v-for="movie in movies" :key="movie.id"` | `MovieRow.vue:39` |
| Hover overlay | `opacity-0 group-hover:opacity-100` | `MovieCard.vue:34` |
| Programmatic navigation | `router.push({ name: 'movie-detail', params: ... })` | `MovieCard.vue:13` |
| Dynamic class | `:class="[...]"` + ternary | `MovieCard.vue:23` |
| Responsive sizing | `h-[70vh] md:h-[85vh]` | `MovieHero.vue:21` |
| Gradient overlay | `bg-gradient-to-r` + `bg-gradient-to-t` | `MovieHero.vue:28-29` |
| Named group | `group/row` + `group-hover/row:` | `MovieRow.vue:26,29` |
