# Bab 12: Provide & Inject

## 📖 Dependency Injection Lintas Komponen

`provide/inject` memungkinkan ancestor component membagikan data ke **semua descendant** tanpa harus melewatkan props di setiap level (menghindari "prop drilling").

---

## 1️⃣ Dasar Provide/Inject

```vue
<!-- GrandParent.vue (provide) -->
<script setup>
import { provide, ref } from 'vue'

const tema = ref('dark')
const user = ref({ nama: 'Agung', role: 'admin' })

provide('tema', tema)        // key, value
provide('currentUser', user)
</script>
```

```vue
<!-- DeepChild.vue (inject) — bisa di level manapun -->
<script setup>
import { inject } from 'vue'

const tema = inject('tema')              // terima data
const user = inject('currentUser')
const lang = inject('language', 'id')    // dengan default value
</script>

<template>
  <p>Tema: {{ tema }}</p>
  <p>User: {{ user.nama }}</p>
  <p>Bahasa: {{ lang }}</p>
</template>
```

---

## 2️⃣ Provide di App Level

```js
// main.js — provide untuk seluruh aplikasi
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.provide('appName', 'Vue Basic')
app.provide('apiUrl', 'http://localhost:8000/api')

app.mount('#app')
```

---

## 3️⃣ Provide dengan Reactivity

```vue
<script setup>
import { provide, ref, readonly } from 'vue'

const counter = ref(0)
const increment = () => { counter.value++ }

// Provide reactive data + methods
provide('counter', readonly(counter))  // readonly agar child tidak bisa mutasi
provide('increment', increment)
</script>
```

```vue
<!-- Child -->
<script setup>
import { inject } from 'vue'

const counter = inject('counter')
const increment = inject('increment')
</script>

<template>
  <p>{{ counter }}</p>
  <button @click="increment">+1</button>
</template>
```

---

## ⚠️ Kapan Pakai Provide/Inject vs Props vs Pinia?

| Metode | Use Case |
|--------|----------|
| **Props** | Parent → child langsung (1 level) |
| **Provide/Inject** | Ancestor → deep descendants (hindari prop drilling) |
| **Pinia** | Global state yang diakses dari mana saja |

---

**Sebelumnya:** [← Bab 11 — Slots](./11-slots.md)
**Selanjutnya:** [Bab 13 — Lifecycle Hooks →](./13-lifecycle.md)
