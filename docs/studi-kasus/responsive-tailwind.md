# Responsive Design & Tailwind CSS

Halaman ini menjelaskan strategi responsive design di aplikasi VueFlix menggunakan Tailwind CSS v4 — dari konfigurasi tema hingga pattern utility class yang dipakai di seluruh komponen.

---

## Konfigurasi Tema

Buka `src/assets/main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --color-primary-50:  #eef2ff;
  /* ... warna brand lain ... */
  --color-sidebar:      #0f172a;
  --color-sidebar-hover: #1e293b;
}
```

::: info Tailwind CSS v4
Proyek ini menggunakan Tailwind v4 dengan CSS-first configuration (`@theme` block) bukan `tailwind.config.js`. Di v4, kustomisasi tema dilakukan langsung di CSS dengan custom properties.
:::

---

## Strategi Responsive

Aplikasi menggunakan **Mobile First** approach — desain dasar untuk mobile, lalu `md:` dan `lg:` untuk layar lebih besar.

| Breakpoint | Prefix | Ukuran Minimal |
|---|---|---|
| Default | (tanpa prefix) | 0px (mobile) |
| `sm` | `sm:` | 640px (tablet kecil) |
| `md` | `md:` | 768px (tablet) |
| `lg` | `lg:` | 1024px (desktop kecil) |

---

## Pattern 1: Padding Responsif

Digunakan di semua komponen untuk mengatur margin kiri-kanan:

```html
<div class="px-4 md:px-12">
  <!-- padding 16px di mobile, 48px di tablet ke atas -->
</div>
```

Dipakai di: `MovieLayout.vue`, `MovieRow.vue`, `MovieHero.vue`, `MovieDetailView.vue`, `MoviesView.vue`.

---

## Pattern 2: Hero Height Responsif

```html
<!-- MovieHero.vue -->
<div class="h-[70vh] md:h-[85vh]">
  <!-- 70% viewport di mobile, 85% di desktop -->
</div>

<!-- MovieDetailView.vue -->
<div class="h-[60vh] md:h-[75vh]">
  <!-- Sedikit lebih kecil untuk detail -->
</div>
```

---

## Pattern 3: Card Width Responsif

```html
<!-- MovieCard.vue -->
<div :class="[
  size === 'large' ? 'w-[200px] md:w-[250px]' : 'w-[150px] md:w-[200px]'
]">
  <!-- Lebar card bervariasi: ukuran normal vs large, mobile vs desktop -->
</div>
```

---

## Pattern 4: Grid Responsif

```html
<!-- PersonModal.vue — grid filmografi aktor -->
<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
  <!-- 3 kolom mobile → 4 tablet → 5 desktop -->
</div>
```

---

## Pattern 5: Flex Wrapping

```html
<!-- MovieDetailView.vue — info bar -->
<div class="flex flex-wrap items-center gap-3">
  <!-- Item turun ke bawah jika tidak muat, tidak horizontal scroll -->
</div>
```

```html
<!-- MovieDetailView.vue — poster + teks -->
<div class="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
  <!-- Stack vertikal di mobile, horizontal di desktop -->
</div>
```

---

## Pattern 6: Hide/Show Berdasarkan Ukuran

```html
<!-- MovieLayout.vue — logo teks -->
<span class="hidden sm:inline">VueFlix</span>
<!-- Teks "VueFlix" hilang di mobile, muncul di tablet -->

<!-- MovieLayout.vue — nav link -->
<div class="hidden md:flex items-center gap-6">
  <!-- Menu navigasi hilang di mobile -->
</div>

<!-- MovieHero.vue — overview text -->
<p class="hidden md:block">...</p>
<!-- Deskripsi disembunyikan di mobile, muncul di tablet+ -->
```

---

## Pattern 7: Dynamic Class dengan Ternary

```html
<!-- MovieLayout.vue — navbar -->
<nav :class="[
  'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
  isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
]">
  <!-- Class statis (selalu ada) + class dinamis (kondisi) -->
</nav>
```

---

## Pattern 8: Gradient Overlay

Dipakai di `MovieHero` dan `MovieDetailView`:

```html
<!-- Gradient horizontal: teks terbaca di atas backdrop -->
<div class="bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

<!-- Gradient vertikal: menyambung ke background halaman -->
<div class="bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
```

---

## Pattern 9: Hover Effect dengan `group`

```html
<!-- MovieCard.vue — overlay info -->
<div class="group relative ...">
  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <!-- Overlay hanya muncul saat card di-hover -->
  </div>
</div>

<!-- MovieRow.vue — tombol scroll -->
<div class="group/row relative">
  <button class="opacity-0 group-hover/row:opacity-100 ...">
    <!-- Tombol chevron hanya muncul saat mouse di area row -->
  </button>
</div>
```

---

## Pattern 10: Transition & Animation

```html
<!-- MovieCard.vue -->
<div class="transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
  <!-- Card membesar + naik ke atas saat hover -->

<!-- MovieLayout.vue -->
<nav class="transition-all duration-300">
  <!-- Background navbar berubah smooth -->
```

---

## Pattern 11: Scrollbar Hide

```css
/* main.css */
.scrollbar-hide::-webkit-scrollbar {
  display: none;                     /* Sembunyikan di Chrome/Safari */
}
.scrollbar-hide {
  -ms-overflow-style: none;          /* Sembunyikan di IE/Edge */
  scrollbar-width: none;             /* Sembunyikan di Firefox */
}
```

```html
<!-- MovieRow.vue -->
<div class="flex gap-2 overflow-x-auto scrollbar-hide" style="scrollbar-width: none;">
  <!-- Bisa scroll horizontal, tapi scrollbar tidak terlihat -->
</div>
```

---

## Pattern 12: Loading Spinner

```html
<!-- MoviesView.vue & MovieDetailView.vue -->
<div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
```

CSS-only spinner: border lingkaran dengan satu sisi transparan + animasi rotasi.

---

## Warna Custom

Aplikasi menggunakan warna di luar palet Tailwind standar dengan **arbitrary values**:

| Class | Nilai | Deskripsi |
|---|---|---|
| `bg-[#141414]` | `#141414` | Background gelap Netflix |
| `bg-[#1a1a1a]` | `#1a1a1a` | Background modal |
| `text-red-600` | Warna Tailwind | Aksen merah untuk logo, loading |
| `text-green-400` | Warna Tailwind | Rating bintang |
| `bg-black/80` | Hitam 80% opacity | Overlay semi-transparan |

---

## Rangkuman

| Pattern | Contoh | Tujuan |
|---|---|---|
| Padding responsif | `px-4 md:px-12` | Konten tidak menempel tepi |
| Height responsif | `h-[70vh] md:h-[85vh]` | Hero fullscreen proporsional |
| Flex direction | `flex-col md:flex-row` | Stack → side-by-side |
| Grid kolom | `grid-cols-3 md:grid-cols-5` | Adaptasi jumlah kolom |
| Hide/show | `hidden md:block` | Konten selektif per device |
| Conditional class | `:class="[..., condition ? a : b]"` | Navbar dinamis |
| Hover group | `group` + `group-hover:*` | Interaksi hover card |
| Transition | `transition-all duration-300` | Animasi halus |
| Scrollbar hide | `.scrollbar-hide` | Clean horizontal scroll |
| Gradient overlay | `bg-gradient-to-r / to-t` | Teks terbaca di atas gambar |
| Custom color | `bg-[#141414]` | Warna brand Netflix |
