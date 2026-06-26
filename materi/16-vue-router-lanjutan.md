# Bab 16: Vue Router — Lanjutan

## 1️⃣ Dynamic Routes (Route Params)

```js
// router/index.js
const routes = [
  { path: '/user/:id', name: 'user-detail', component: UserDetail },
  { path: '/post/:slug', name: 'post', component: PostView },
]
```

```vue
<!-- UserDetail.vue -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id) // '123'
</script>

<template>
  <h1>User #{{ $route.params.id }}</h1>
</template>
```

---

## 2️⃣ Nested Routes

```js
const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', name: 'dashboard-home', component: DashboardHome },
      { path: 'profil', name: 'dashboard-profil', component: DashboardProfil },
      { path: 'settings', name: 'dashboard-settings', component: DashboardSettings },
    ],
  },
]
```

```vue
<!-- DashboardLayout.vue -->
<template>
  <div class="dashboard">
    <aside>
      <RouterLink to="/dashboard">Home</RouterLink>
      <RouterLink to="/dashboard/profil">Profil</RouterLink>
      <RouterLink to="/dashboard/settings">Settings</RouterLink>
    </aside>
    <main>
      <RouterView />  <!-- Child route di-render di sini -->
    </main>
  </div>
</template>
```

---

## 3️⃣ Navigation Guards

### Global Guard (di router config)
```js
router.beforeEach((to, from) => {
  const isAuth = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuth) {
    return { name: 'login' }  // Redirect ke login
  }
})
```

### Route-Level Guard
```js
const routes = [
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true },
    beforeEnter: (to, from) => {
      // Guard khusus route ini
    },
  },
]
```

### Component-Level Guard
```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  const jawab = window.confirm('Yakin ingin meninggalkan halaman?')
  if (!jawab) return false  // Batalkan navigasi
})
</script>
```

---

## 4️⃣ Route Meta & 404

```js
const routes = [
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, role: 'admin' },
  },
  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]
```

---

## 5️⃣ Lazy Loading Routes

```js
const routes = [
  {
    path: '/about',
    // Dynamic import → file terpisah, di-load on demand
    component: () => import('@/views/AboutView.vue'),
  },
]
```

---

**Sebelumnya:** [← Bab 15 — Router Dasar](./15-vue-router-dasar.md)
**Selanjutnya:** [Bab 17 — Pinia State Management →](./17-pinia.md)
