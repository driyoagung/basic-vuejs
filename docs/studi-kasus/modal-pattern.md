# Modal Pattern — PersonModal & TrailerModal

Halaman ini membahas dua komponen modal di aplikasi: `PersonModal` dan `TrailerModal`. Keduanya menggunakan teknik yang sama — **conditional rendering berbasis props** untuk menampilkan overlay fullscreen.

---

## TrailerModal — YouTube Embed dengan Fallback

Buka `src/components/movies/TrailerModal.vue`.

### Script Setup

```vue
<script setup>
import { X, Play, Video, AlertCircle } from '@lucide/vue'

const props = defineProps({
  show: { type: Boolean, default: false },    // [1]
  trailerKey: { type: String, default: '' },   // [2]
  movieTitle: { type: String, default: '' },   // [3]
})

const emit = defineEmits(['close'])            // [4]

const close = () => {
  emit('close')                                // [5]
}
</script>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | Visibility prop | `show` boolean dari parent — kontrol kapan modal tampil |
| [2] | Trailer data | `trailerKey` adalah YouTube video ID (contoh: `dQw4w9WgXcQ`) |
| [3] | Judul film | Dipakai untuk header dan fallback message |
| [4] | Emit deklarasi | Mendaftarkan event `close` yang akan dikirim ke parent |
| [5] | Emit trigger | Saat user klik close/overlay, kirim event `close` ke parent |

::: tip Komunikasi Parent-Child
Arah komunikasi di Vue:
- **Parent → Child**: melalui `props` (data mengalir ke bawah)
- **Child → Parent**: melalui `emit` (event mengalir ke atas)
:::

### Template — Conditional YouTube Embed

```html
<template>
  <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <!-- Overlay untuk menutup modal -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />  <!-- [6] -->

    <!-- Konten modal -->
    <div class="relative bg-[#1a1a1a] rounded-xl w-full max-w-3xl ...">
      <div class="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h3 class="text-white text-lg font-semibold flex items-center gap-2">
          <Video class="w-5 h-5 text-red-500" />
          {{ movieTitle }} — Trailer
        </h3>
        <button @click="close"><X class="w-5 h-5" /></button>     <!-- [7] -->
      </div>

      <!-- YouTube iframe (jika ada trailer) -->
      <div v-if="trailerKey" class="aspect-video">                <!-- [8] -->
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`"  <!-- [9] -->
          :title="`${movieTitle} Trailer`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        />
      </div>

      <!-- Fallback (jika tidak ada trailer) -->
      <div v-else class="p-12 text-center">                        <!-- [10] -->
        <AlertCircle class="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p class="text-white/60 text-lg mb-2">No trailer available</p>
        <p class="text-white/30 text-sm">
          Trailer untuk "{{ movieTitle }}" belum tersedia di TMDB.
        </p>
      </div>
    </div>
  </div>
</template>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [6] | Overlay click-to-close | Klik area gelap di luar modal = tutup modal |
| [7] | Tombol X | Alternatif tutup modal |
| [8] | `v-if` / `v-else` | Dua cabang: ada trailer vs tidak ada trailer |
| [9] | Dynamic iframe src | Template literal menyisipkan `trailerKey` ke URL YouTube embed. `autoplay=1` = langsung main |
| [10] | Fallback UI | Tampilkan ikon + pesan jika tidak ada trailer |

### Bagaimana Parent Memanggil Modal

Di `MovieDetailView.vue`:

```vue
<!-- Di template -->
<TrailerModal
  :show="showTrailer"             <!-- props: boolean -->
  :trailer-key="trailerKey"       <!-- props: YouTube key -->
  :movie-title="movie?.title"     <!-- props: judul -->
  @close="closeTrailer"           <!-- event: saat close -->
/>

<!-- Di script -->
const showTrailer = ref(false)
const trailerKey = ref('')

const handlePlay = () => {
  if (youtubeTrailer.value) {
    trailerKey.value = youtubeTrailer.value.key
    showTrailer.value = true
  } else {
    trailerKey.value = ''
    showTrailer.value = true       // Tetap buka modal, tampilkan fallback
  }
}

const closeTrailer = () => {
  showTrailer.value = false
  trailerKey.value = ''
}
```

---

## PersonModal — Detail Aktor dengan Filmografi

Buka `src/components/movies/PersonModal.vue`.

### Script Setup

```vue
<script setup>
import { computed } from 'vue'                        // [1]
import { X, Star, Calendar } from '@lucide/vue'
import { imageUrl } from '@/api/movieService'
import { useRouter } from 'vue-router'

const props = defineProps({
  person: { type: Object, required: true },
})
const emit = defineEmits(['close', 'select-movie'])    // [2] Multiple events
const router = useRouter()

const castMovies = computed(() => {                    // [3] Filter & sort filmografi
  if (!props.person?.movie_credits?.cast) return []
  return props.person.movie_credits.cast
    .filter((m) => m.poster_path)                      // [4] Hanya film dengan poster
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))  // [5] Sort by popularity
    .slice(0, 20)                                      // [6] Max 20 film
})

const knownFor = computed(() => {                      // [7] 3 film paling dikenal
  if (!props.person?.movie_credits?.cast) return '-'
  const sorted = [...props.person.movie_credits.cast]
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
  return sorted.slice(0, 3).map((m) => m.title).join(', ') || '-'
})

const selectMovie = (movie) => {                       // [8] Navigasi ke film yang diklik
  emit('close')
  router.push({ name: 'movie-detail', params: { id: movie.id } })
}

const close = () => emit('close')                      // [9]
</script>
```

| Baris | Konsep | Penjelasan |
|---|---|---|
| [1] | `computed` import | Dipakai untuk menghitung data turunan dari person props |
| [2] | Multiple emits | `close` (tutup modal) + `select-movie` (pilih film, tidak terpakai saat ini tapi tersedia) |
| [3] | Computed film list | `castMovies` adalah daftar film yang dibintangi, di-sort dan di-filter |
| [4] | Filter | Hanya tampilkan film yang punya poster — hindari gambar broken |
| [5] | Sort | Urutkan berdasarkan popularitas (descending) |
| [6] | Limit | Maksimal 20 film — jaga performa rendering |
| [7] | Computed known-for | String "Film A, Film B, Film C" — 3 film dengan vote terbanyak |
| [8] | Navigate on click | Tutup modal → navigasi ke detail film yang dipilih |
| [9] | Emit close | Kirim event ke parent untuk menutup modal |

### Template — Grid Filmografi

```html
<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
  <div
    v-for="movie in castMovies"
    :key="movie.id"
    @click="selectMovie(movie)"
    class="group cursor-pointer"
  >
    <img
      :src="imageUrl(movie.poster_path, 'w185')"
      :alt="movie.title"
      class="w-full aspect-[2/3] object-cover rounded-md
             group-hover:ring-2 group-hover:ring-red-500 transition-all"
      loading="lazy"
    />
    <p class="text-white/80 text-xs mt-1.5 line-clamp-2 group-hover:text-white">{{ movie.title }}</p>
    <div class="flex items-center gap-1 text-[10px] text-white/40 mt-0.5">
      <Star class="w-2.5 h-2.5" />
      {{ movie.vote_average?.toFixed(1) || '-' }}
      <span class="ml-auto">{{ movie.release_date?.slice(0, 4) || '-' }}</span>
    </div>
  </div>
</div>
```

Grid responsif:
- **Mobile** (`grid-cols-3`): 3 kolom
- **Tablet** (`sm:grid-cols-4`): 4 kolom
- **Desktop** (`md:grid-cols-5`): 5 kolom

---

## Bagaimana Parent Memanggil PersonModal

Di `MovieDetailView.vue`:

```vue
<!-- Di template -->
<PersonModal
  v-if="showPerson && person"     <!-- Modal hanya render jika ada data -->
  :person="person"
  @close="closePerson"
/>

<!-- Di script -->
const showPerson = ref(false)

const openPerson = async (personId) => {
  await movieStore.fetchPersonDetail(personId)  // Fetch data dulu
  showPerson.value = true                      // Lalu tampilkan modal
}

const closePerson = () => {
  showPerson.value = false
  movieStore.clearPerson()                     // Reset state person
}
```

::: tip Fetch-on-Demand Pattern
PersonModal menggunakan pattern **fetch-on-demand**: data aktor tidak di-fetch saat halaman dimuat, tapi hanya saat user klik cast member. Ini menghemat bandwith karena data yang jarang diakses tidak ikut dimuat.
:::

---

## Rangkuman

| Konsep | Contoh | Lokasi |
|---|---|---|
| Props-driven modal | `v-if="show"` di root element | `TrailerModal.vue:18` |
| Emit ke parent | `emit('close')` | `TrailerModal.vue:13` |
| Overlay click-to-close | `@click="close"` di div overlay | `TrailerModal.vue:19` |
| Conditional content | `v-if="trailerKey" / v-else` | `TrailerModal.vue:31,42` |
| Dynamic iframe src | Template literal untuk YouTube URL | `TrailerModal.vue:33` |
| Computed dari props | `computed(() => props.person...)` | `PersonModal.vue:15` |
| Filter + sort + limit | `.filter().sort().slice()` | `PersonModal.vue:17-20` |
| Grid responsif | `grid-cols-3 sm:grid-cols-4 md:grid-cols-5` | `PersonModal.vue:76` |
| Fetch-on-demand | Fetch person hanya saat user klik cast | `MovieDetailView.vue:72` |
| Multiple emits | `defineEmits(['close', 'select-movie'])` | `PersonModal.vue:11` |
