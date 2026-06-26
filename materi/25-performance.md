# Bab 25: Performance Optimization

## 1️⃣ Lazy Loading Routes

```js
// ✅ Component di-load saat route diakses
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
]
```

---

## 2️⃣ `v-once` & `v-memo`

```vue
<template>
  <!-- v-once: render sekali saja, tidak pernah update -->
  <footer v-once>
    <p>{{ staticContent }}</p>
  </footer>

  <!-- v-memo: re-render hanya jika dependency berubah -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
    {{ item.nama }}
  </div>
</template>
```

---

## 3️⃣ `shallowRef` & `shallowReactive`

```vue
<script setup>
import { shallowRef } from 'vue'

// Hanya track .value assignment, bukan deep changes
const bigList = shallowRef([])

// ❌ Tidak trigger update
bigList.value.push(item)

// ✅ Trigger update
bigList.value = [...bigList.value, item]
</script>
```

---

## 4️⃣ Component Lazy Loading

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: () => '<p>Loading chart...</p>',
  delay: 200,
  timeout: 10000,
})
</script>

<template>
  <Suspense>
    <HeavyChart />
    <template #fallback>Loading...</template>
  </Suspense>
</template>
```

---

## 5️⃣ Tips Performa

| Teknik | Kapan Pakai |
|--------|-------------|
| Lazy route | Selalu, untuk semua route kecuali home |
| `v-once` | Konten statis yang tidak berubah |
| `v-memo` | List besar dengan update sebagian |
| `shallowRef` | Data besar yang tidak perlu deep reactivity |
| `key` yang benar | Selalu di `v-for` |
| `computed` | Hindari kalkulasi di template |
| Debounce | Search input, resize event |

---

**Sebelumnya:** [← Bab 24 — Reusable Patterns](./24-reusable-pattern.md)
**Selanjutnya:** [Bab 26 — Testing →](./26-testing.md)
