# Bab 1: Pengenalan Vue.js & Setup Project

## 📖 Apa itu Vue.js?

Vue.js adalah **progressive JavaScript framework** untuk membangun user interface (UI). Disebut "progressive" karena kamu bisa menggunakannya secara bertahap — mulai dari memperkaya halaman HTML biasa, hingga membangun Single Page Application (SPA) yang kompleks.

### Kenapa Vue.js?

| Fitur | Penjelasan |
|-------|-----------|
| **Mudah dipelajari** | Kurva belajar paling landai dibanding React/Angular |
| **Reactive** | Data berubah → UI otomatis update |
| **Component-based** | UI dipecah menjadi komponen-komponen kecil yang reusable |
| **Ekosistem lengkap** | Router, state management, dev tools — semua official |
| **Performa tinggi** | Virtual DOM + compiler optimization |

---

## 🏗️ Ekosistem Vue.js

```
Vue.js Ecosystem
├── Vue 3 Core          → Framework inti
├── Vite                → Build tool & dev server (super cepat)
├── Vue Router          → Routing / navigasi halaman
├── Pinia               → State management (pengganti Vuex)
├── Vue DevTools        → Browser extension untuk debugging
├── Vitest              → Unit testing framework
└── Nuxt.js             → Full-stack framework (SSR/SSG)
```

---

## 📁 Struktur Project Kita

Project ini sudah di-generate menggunakan `create-vue`. Berikut struktur foldernya:

```
vue-basic/
├── index.html              → Entry point HTML
├── package.json            → Dependencies & scripts
├── vite.config.js          → Konfigurasi Vite
├── jsconfig.json           → Konfigurasi JavaScript/IDE
│
├── public/                 → Static assets (tidak diproses Vite)
│   └── favicon.ico
│
├── src/                    → Source code utama
│   ├── main.js             → Bootstrap aplikasi Vue
│   ├── App.vue             → Root component
│   │
│   ├── assets/             → Assets yang diproses Vite (CSS, images)
│   ├── components/         → Komponen reusable
│   ├── views/              → Halaman-halaman (dipanggil oleh router)
│   ├── router/             → Konfigurasi Vue Router
│   └── stores/             → Pinia stores (state management)
│
└── materi/                 → 📚 Folder materi belajar (kamu di sini!)
```

---

## 🔑 File-File Penting

### 1. `index.html` — Entry Point

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>           <!-- Vue akan me-mount ke sini -->
    <script type="module" src="/src/main.js"></script>  <!-- Load main.js -->
  </body>
</html>
```

### 2. `src/main.js` — Bootstrap Aplikasi

```js
import { createApp } from 'vue'        // Import fungsi createApp
import { createPinia } from 'pinia'    // Import Pinia (state management)
import App from './App.vue'            // Import root component
import router from './router'          // Import router

const app = createApp(App)             // Buat instance aplikasi Vue
app.use(createPinia())                 // Pasang Pinia
app.use(router)                        // Pasang Router
app.mount('#app')                      // Mount ke <div id="app">
```

### 3. `src/App.vue` — Root Component

Ini adalah **Single File Component (SFC)** — format khas Vue yang menggabungkan 3 bagian:

```vue
<script setup>
// JavaScript logic di sini
</script>

<template>
  <!-- HTML template di sini -->
</template>

<style scoped>
/* CSS di sini, scoped = hanya berlaku di komponen ini */
</style>
```

---

## ⚙️ Menjalankan Project

### Install Dependencies

```bash
cd vue-basic
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:5173` (atau port yang ditampilkan di terminal).

### Build untuk Production

```bash
npm run build
```

Hasil build ada di folder `dist/`.

---

## 🧪 Latihan

### Latihan 1: Modifikasi Tampilan

1. Buka file `src/App.vue`
2. Ubah teks di dalam `<template>` menjadi:

```vue
<template>
  <div>
    <h1>Halo, saya sedang belajar Vue.js! 🚀</h1>
    <p>Ini adalah project pertama saya.</p>
  </div>
</template>
```

3. Simpan dan lihat hasilnya di browser (Hot Module Replacement — otomatis refresh!)

### Latihan 2: Pahami SFC

Buat file baru `src/components/SalamDunia.vue`:

```vue
<script setup>
const nama = 'Agung'
</script>

<template>
  <div class="salam">
    <h2>Salam dari {{ nama }}! 👋</h2>
    <p>Selamat datang di dunia Vue.js</p>
  </div>
</template>

<style scoped>
.salam {
  padding: 20px;
  border-radius: 8px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}
</style>
```

Lalu import di `App.vue`:

```vue
<script setup>
import SalamDunia from './components/SalamDunia.vue'
</script>

<template>
  <SalamDunia />
</template>
```

---

## 📝 Rangkuman

| Konsep | Penjelasan |
|--------|-----------|
| Vue.js | Progressive JS framework untuk UI |
| SFC | Single File Component (`.vue`) — gabungan template, script, style |
| Vite | Build tool modern yang super cepat |
| `<script setup>` | Cara modern menulis logic di Vue 3 (Composition API) |
| <code v-pre>{{ }}</code> | Interpolasi — menampilkan data di template |
| `npm run dev` | Menjalankan development server |

---

**Selanjutnya:** [Bab 2 — Template Syntax & Data Binding →](./02-template-syntax.md)
