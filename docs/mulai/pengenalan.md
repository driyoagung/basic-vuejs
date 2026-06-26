# Pengenalan Vue.js

## Apa itu Vue.js?

Vue.js (dibaca "view") adalah **progressive JavaScript framework** untuk membangun user interface. Vue dirancang agar bisa diadopsi secara bertahap — mulai dari memperkaya halaman HTML biasa hingga membangun Single Page Application (SPA) berskala besar.

::: info Versi yang Digunakan
Seluruh materi di panduan ini menggunakan **Vue 3** dengan **Composition API** (`<script setup>`).
:::

## Kenapa Vue.js?

| Keunggulan | Penjelasan |
|------------|-----------|
| **Mudah dipelajari** | Kurva belajar paling landai dibanding React & Angular |
| **Reactive System** | Data berubah → UI otomatis update, tanpa manipulasi DOM manual |
| **Component-based** | UI dipecah menjadi komponen kecil yang reusable & maintainable |
| **Ekosistem official** | Router, State Management, DevTools — semua resmi dari tim Vue |
| **Performa tinggi** | Virtual DOM + compiler-informed optimizations |
| **TypeScript support** | Dukungan TypeScript first-class out of the box |

## Ekosistem Vue.js

Vue memiliki ekosistem yang lengkap dan terintegrasi:

```
Vue.js Ecosystem
├── Vue 3 Core            → Framework inti (reactivity, component system)
├── Vite                  → Build tool & dev server yang super cepat
├── Vue Router            → Client-side routing / navigasi halaman
├── Pinia                 → State management (pengganti Vuex)
├── Vue DevTools          → Browser extension untuk debugging
├── Vitest                → Unit testing framework
├── Vue Test Utils        → Testing utilities untuk component
└── Nuxt.js               → Full-stack meta-framework (SSR, SSG, dll)
```

## Composition API vs Options API

Vue 3 menyediakan dua cara untuk menulis logic component:

### Options API (cara lama)

```vue
<script>
export default {
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    increment() {
      this.counter++
    },
  },
  computed: {
    doubled() {
      return this.counter * 2
    },
  },
}
</script>
```

### Composition API (cara modern — yang kita pelajari) ✅

```vue
<script setup>
import { ref, computed } from 'vue'

const counter = ref(0)
const doubled = computed(() => counter.value * 2)
const increment = () => counter.value++
</script>
```

::: tip Rekomendasi
**Gunakan Composition API** dengan `<script setup>`. Ini adalah cara modern yang lebih fleksibel, lebih mudah untuk reuse logic, dan mendapat dukungan penuh TypeScript.
:::

## Struktur Project

Project ini sudah di-generate menggunakan `create-vue` dengan Vite. Berikut struktur foldernya:

```
vue-basic/
├── index.html              → Entry point HTML
├── package.json            → Dependencies & scripts
├── vite.config.js          → Konfigurasi Vite (build tool)
├── jsconfig.json           → Konfigurasi IDE/JavaScript
│
├── public/                 → Static assets (tidak diproses Vite)
│   └── favicon.ico
│
├── src/                    → 📁 Source code utama
│   ├── main.js             → Bootstrap/inisialisasi aplikasi Vue
│   ├── App.vue             → Root component (komponen paling atas)
│   │
│   ├── assets/             → Assets yang diproses Vite (CSS, images)
│   ├── components/         → Komponen-komponen reusable
│   ├── views/              → Halaman-halaman (terhubung dengan router)
│   ├── router/             → Konfigurasi Vue Router
│   └── stores/             → Pinia stores (state management global)
│
└── docs/                   → 📚 Dokumentasi (kamu di sini!)
```

## File-File Penting

### 1. `index.html` — Entry Point

File HTML utama tempat aplikasi Vue di-mount:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Basic</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- `<div id="app">` — Vue akan me-render seluruh aplikasi ke dalam elemen ini
- `<script type="module">` — Load `main.js` sebagai ES Module

### 2. `src/main.js` — Bootstrap Aplikasi

```js
import { createApp } from 'vue'       // Import fungsi createApp dari Vue
import { createPinia } from 'pinia'   // Import Pinia (state management)
import App from './App.vue'           // Import root component
import router from './router'         // Import router config

const app = createApp(App)            // Buat instance aplikasi Vue
app.use(createPinia())                // Pasang plugin Pinia
app.use(router)                       // Pasang plugin Router
app.mount('#app')                     // Mount ke elemen <div id="app">
```

### 3. `src/App.vue` — Single File Component (SFC)

Ini adalah format khas Vue yang menggabungkan 3 bagian dalam satu file `.vue`:

```vue
<script setup>
// 🧠 JavaScript logic di sini
// Import, ref, computed, methods, dll
</script>

<template>
  <!-- 🎨 HTML template di sini -->
  <!-- Menampilkan UI dan menghubungkan dengan data -->
</template>

<style scoped>
/* 💅 CSS di sini */
/* scoped = style hanya berlaku di komponen ini */
</style>
```

::: details Apa itu `scoped`?
Ketika kamu menambahkan atribut `scoped` pada `<style>`, CSS tersebut **hanya berlaku untuk komponen itu saja** dan tidak bocor ke komponen lain. Vue melakukan ini dengan menambahkan atribut unik (seperti `data-v-abc123`) ke setiap elemen.
:::

## Menjalankan Project

### Install Dependencies

```bash
cd vue-basic
npm install
```

### Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:5173` — setiap perubahan kode akan otomatis ter-update di browser (Hot Module Replacement / HMR).

### Build Production

```bash
npm run build    # Build ke folder dist/
npm run preview  # Preview hasil build
```

## Latihan Pertama

### 1. Ubah Tampilan Root Component

Buka `src/App.vue` dan ubah kontennya:

```vue
<script setup>
const pesan = 'Halo, saya sedang belajar Vue.js! 🚀'
const tahun = new Date().getFullYear()
</script>

<template>
  <div style="text-align: center; padding: 40px;">
    <h1>{{ pesan }}</h1>
    <p>Tahun {{ tahun }}</p>
  </div>
</template>
```

Simpan dan lihat hasilnya di browser — halaman otomatis update!

### 2. Buat Component Pertama

Buat file baru `src/components/SalamDunia.vue`:

```vue
<script setup>
const nama = 'Agung'
const waktu = new Date().toLocaleTimeString('id-ID')
</script>

<template>
  <div class="salam-card">
    <h2>👋 Salam dari {{ nama }}!</h2>
    <p>Sekarang jam {{ waktu }}</p>
    <p>Selamat datang di dunia Vue.js</p>
  </div>
</template>

<style scoped>
.salam-card {
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd;
  max-width: 400px;
  margin: 20px auto;
}

.salam-card h2 {
  margin: 0 0 8px;
  color: #0369a1;
}

.salam-card p {
  margin: 4px 0;
  color: #475569;
}
</style>
```

Lalu import dan gunakan di `App.vue`:

```vue
<script setup>
import SalamDunia from './components/SalamDunia.vue'
</script>

<template>
  <SalamDunia />
</template>
```

## Rangkuman

| Konsep | Penjelasan |
|--------|-----------|
| **Vue.js** | Progressive JS framework untuk membangun UI |
| **SFC** | Single File Component — gabungan `<script>`, `<template>`, `<style>` dalam file `.vue` |
| **Vite** | Build tool modern yang super cepat untuk development |
| **Composition API** | Cara modern menulis logic Vue dengan `<script setup>` |
| **<code v-pre>{{ }}</code>** | Text interpolation — menampilkan data JavaScript di template |
| **`npm run dev`** | Menjalankan development server dengan HMR |
