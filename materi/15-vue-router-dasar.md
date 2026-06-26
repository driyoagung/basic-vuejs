# Bab 15: Vue Router — Dasar

## 📖 Apa itu Vue Router?

Vue Router memungkinkan kamu membuat **Single Page Application (SPA)** — navigasi halaman tanpa reload browser.

---

## 1️⃣ Setup Router

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // Lazy loading — component di-load saat diakses
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/kontak',
      name: 'kontak',
      component: () => import('@/views/KontakView.vue'),
    },
  ],
})

export default router
```

---

## 2️⃣ RouterView & RouterLink

```vue
<!-- App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <!-- RouterLink = <a> tag tapi tanpa reload -->
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink :to="{ name: 'kontak' }">Kontak</RouterLink>
  </nav>

  <!-- Halaman ditampilkan di sini -->
  <RouterView />
</template>

<style>
/* RouterLink otomatis tambah class saat aktif */
a.router-link-active {
  color: #3b82f6;
  font-weight: bold;
}
a.router-link-exact-active {
  color: #2563eb;
}
</style>
```

---

## 3️⃣ Programmatic Navigation

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Info route saat ini
console.log(route.path)    // '/about'
console.log(route.name)    // 'about'
console.log(route.params)  // {}
console.log(route.query)   // { page: '1' }

// Navigasi programmatic
const goHome = () => router.push('/')
const goAbout = () => router.push({ name: 'about' })
const goBack = () => router.back()
const goForward = () => router.forward()

// Replace (tanpa history entry)
const replaceHome = () => router.replace('/')
</script>

<template>
  <p>Halaman saat ini: {{ route.path }}</p>
  <button @click="goHome">Ke Home</button>
  <button @click="goBack">← Kembali</button>
</template>
```

---

## 4️⃣ Query Parameters

```vue
<!-- URL: /products?category=elektronik&page=2 -->
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Baca query
console.log(route.query.category) // 'elektronik'
console.log(route.query.page)     // '2'

// Set query
const changeCategory = (cat) => {
  router.push({ query: { ...route.query, category: cat } })
}
</script>
```

---

## 🧪 Latihan: Buat Halaman Baru

1. Buat file `src/views/KontakView.vue`
2. Tambahkan route di `router/index.js`
3. Tambahkan `<RouterLink>` di navigasi

```vue
<!-- src/views/KontakView.vue -->
<template>
  <div>
    <h1>📞 Kontak Kami</h1>
    <p>Email: hello@example.com</p>
  </div>
</template>
```

---

**Sebelumnya:** [← Bab 14 — Composables](./14-composables.md)
**Selanjutnya:** [Bab 16 — Vue Router Lanjutan →](./16-vue-router-lanjutan.md)
