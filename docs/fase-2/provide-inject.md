# Provide & Inject

## Mengatasi Masalah "Prop Drilling"

Saat kamu harus meneruskan state/data dari sebuah komponen ke komponen lain yang posisinya sangat dalam di struktur tree, kamu harus mem-passing `props` ke semua komponen perantara. Ini disebut **Prop Drilling**.

```
Root
 └─ Parent (punya data 'theme')
     └─ Child (terima 'theme' cuma buat dipassing)
         └─ GrandChild (terima 'theme' cuma buat dipassing)
             └─ DeepChild (yang sebenarnya butuh 'theme') 😫
```

`Provide` dan `Inject` menyelesaikan masalah ini. Komponen Ancestor dapat mem-`provide` data, dan komponen keturunan manapun (sedalam apapun) dapat mem-`inject` data tersebut tanpa melewati komponen perantara.

```
Root
 └─ Parent (Provide 'theme' 📡)
     └─ Child 
         └─ GrandChild
             └─ DeepChild (Inject 'theme' 🔌)
```

## 1. Provide (Menyediakan Data)

Di komponen tingkat atas (Ancestor), gunakan fungsi `provide()` dari `vue`.

```vue
<!-- GrandParent.vue -->
<script setup>
import { provide, ref } from 'vue'

// Data Statis
provide('appName', 'Vue Basic App')

// Data Reactive
const theme = ref('dark')
provide('theme', theme)

// Object Reactive
const currentUser = ref({ nama: 'Agung', role: 'admin' })
provide('user', currentUser)
</script>

<template>
  <div class="grand-parent">
    <h2>Ini Grand Parent</h2>
    <DeepChild /> <!-- DeepChild bisa jadi ada di dalam komponen lain -->
  </div>
</template>
```

## 2. Inject (Menerima Data)

Di komponen keturunan manapun, gunakan fungsi `inject()` dan panggil kunci (key) yang sama.

```vue
<!-- DeepChild.vue -->
<script setup>
import { inject } from 'vue'

// Mengambil data berdasarkan string key yang di-provide
const appName = inject('appName')
const theme = inject('theme')
const user = inject('user')

// Inject dengan Default Value (jika Ancestor tidak mem-provide)
const bahasa = inject('bahasa', 'id-ID')
</script>

<template>
  <div :class="`theme-${theme}`">
    <h3>Deep Child Component</h3>
    <p>Aplikasi: {{ appName }}</p>
    <p>User Aktif: {{ user.nama }} ({{ user.role }})</p>
    <p>Bahasa: {{ bahasa }}</p>
  </div>
</template>
```

## 3. Global Provide (App-level)

Kamu bisa mem-provide data ke **seluruh** aplikasi langsung dari `main.js`. Ini berguna untuk data seperti konfigurasi global, informasi sesi (jika tanpa Pinia), atau plugin.

```js
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Provide ke seluruh komponen di aplikasi ini
app.provide('configGlobal', {
  apiEndpoint: 'https://api.example.com/v1',
  maxUploadSize: 5000000 // 5MB
})

app.mount('#app')
```

## 4. Provide/Inject Data yang Bisa Diubah (Reactivity)

Jika data yang di-provide bersifat reactive (seperti `ref` atau `reactive`), Child yang mem-inject data tersebut akan ikut re-render jika data berubah.

### Aturan Emas Mutasi Provide/Inject
**Siapa yang mem-provide, dialah yang bertugas merubah data tersebut.**

Jangan pernah membiarkan Child merubah nilai state yang di-inject secara langsung. Ini akan membuat pelacakan bug sangat sulit.
Sebaliknya, **Provide sebuah function pembantu (mutator)** bersama dengan datanya.

```vue
<!-- ThemeProvider.vue (Ancestor) -->
<script setup>
import { provide, ref, readonly } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 1. Provide State (Bungkus dengan readonly agar Child tidak bisa edit langsung)
provide('theme', readonly(theme))

// 2. Provide Fungsi Mutator
provide('toggleTheme', toggleTheme)
</script>
```

```vue
<!-- ThemeSwitcher.vue (Descendant) -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')

// theme.value = 'dark' // ❌ Error! Karena state dilindungi readonly()
</script>

<template>
  <div>
    <p>Tema saat ini: {{ theme }}</p>
    <!-- Panggil fungsi yang di-inject untuk mengubah state -->
    <button @click="toggleTheme">Ganti Tema</button>
  </div>
</template>
```

## Kapan Pakai Provide/Inject vs Pinia vs Props?

- **Props**: Gunakan untuk komunikasi langsung dari Parent ke Child (1 level). Paling mudah dipahami.
- **Provide/Inject**: Gunakan untuk menghindari prop-drilling jika state/fungsi hanya relevan untuk suatu cabang/ranting spesifik (misal: Komponen Form mem-provide context error ke semua komponen Input di dalamnya).
- **Pinia**: Gunakan untuk state yang benar-benar **Global** dan dibagikan ke banyak bagian/halaman aplikasi (seperti data User Login, Cart Belanja).
