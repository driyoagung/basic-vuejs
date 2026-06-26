# Bab 13: Component Lifecycle Hooks

## 📖 Siklus Hidup Component

Setiap component Vue melewati serangkaian tahapan: dibuat → dimount → diupdate → dihancurkan.

```
setup()           → Composition API entry point
  │
onBeforeMount()   → Sebelum render ke DOM
  │
onMounted()       → ✅ Sudah ada di DOM (fetch data di sini!)
  │
onBeforeUpdate()  → Sebelum re-render
  │
onUpdated()       → Setelah re-render
  │
onBeforeUnmount() → Sebelum dihapus dari DOM
  │
onUnmounted()     → ✅ Sudah dihapus (cleanup di sini!)
```

---

## 1️⃣ Hooks yang Paling Sering Dipakai

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const data = ref(null)
const timer = ref(null)

// ✅ Fetch data saat component dimount
onMounted(async () => {
  console.log('Component sudah di DOM!')
  const res = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  data.value = await res.json()
  
  // Setup interval
  timer.value = setInterval(() => {
    console.log('tick')
  }, 1000)
})

// ✅ Cleanup saat component dihancurkan
onUnmounted(() => {
  console.log('Component dihapus!')
  clearInterval(timer.value)  // Jangan lupa bersihkan!
})
</script>

<template>
  <div v-if="data">
    <h3>{{ data.title }}</h3>
    <p>{{ data.body }}</p>
  </div>
  <p v-else>Loading...</p>
</template>
```

---

## 2️⃣ Semua Lifecycle Hooks

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
} from 'vue'

onBeforeMount(() => console.log('1. Before Mount'))
onMounted(() => console.log('2. Mounted ✅'))
onBeforeUpdate(() => console.log('3. Before Update'))
onUpdated(() => console.log('4. Updated ✅'))
onBeforeUnmount(() => console.log('5. Before Unmount'))
onUnmounted(() => console.log('6. Unmounted ✅'))

// Menangkap error dari child components
onErrorCaptured((err, instance, info) => {
  console.error('Error caught:', err)
  return false // prevent propagation
})
</script>
```

---

## 🧪 Latihan: Clock Component

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const waktu = ref(new Date())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    waktu.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval) // ⚡ Penting: cleanup!
})
</script>

<template>
  <div class="clock">
    <h2>🕐 {{ waktu.toLocaleTimeString('id-ID') }}</h2>
    <p>{{ waktu.toLocaleDateString('id-ID', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }) }}</p>
  </div>
</template>
```

---

**Sebelumnya:** [← Bab 12 — Provide/Inject](./12-provide-inject.md)
**Selanjutnya:** [Bab 14 — Composables →](./14-composables.md)
