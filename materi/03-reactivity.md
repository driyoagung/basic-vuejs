# Bab 3: Reactivity — ref, reactive, computed, watch

## 📖 Apa itu Reactivity?

Reactivity adalah konsep inti Vue.js — ketika **data berubah**, **UI otomatis update**.

---

## 1️⃣ `ref()` — Reactive Reference

```vue
<script setup>
import { ref } from 'vue'

const counter = ref(0)
const nama = ref('Agung')

// Di script → akses dengan .value
const increment = () => { counter.value++ }
</script>

<template>
  <!-- Di template → TIDAK perlu .value -->
  <p>{{ counter }}</p>
  <p>{{ nama }}</p>
  <button @click="increment">+1</button>
</template>
```

---

## 2️⃣ `reactive()` — Reactive Object

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  nama: 'Agung',
  umur: 25,
  alamat: { kota: 'Jakarta' }
})

// Tidak perlu .value
const tambahUmur = () => { user.umur++ }
</script>

<template>
  <p>{{ user.nama }} ({{ user.umur }} tahun)</p>
  <p>Kota: {{ user.alamat.kota }}</p>
</template>
```

### ⚠️ Batasan reactive()
- ❌ Jangan reassign: `user = reactive({...})` → kehilangan reactivity
- ❌ Jangan destructure langsung: `const { nama } = reactive({...})`
- ✅ Gunakan `toRefs()` jika perlu destructure

---

## 3️⃣ ref vs reactive

| Fitur | `ref()` | `reactive()` |
|-------|---------|-------------|
| Tipe data | Primitif & Object | Object saja |
| Akses di script | `.value` | Langsung |
| Bisa reassign | ✅ | ❌ |
| **Rekomendasi** | **✅ Default** | Untuk object complex |

---

## 4️⃣ `computed()` — Nilai Turunan (Cached)

```vue
<script setup>
import { ref, computed } from 'vue'

const harga = ref(100000)
const jumlah = ref(3)
const diskon = ref(10)

const subtotal = computed(() => harga.value * jumlah.value)
const total = computed(() => subtotal.value * (1 - diskon.value / 100))
</script>

<template>
  <p>Subtotal: Rp {{ subtotal.toLocaleString() }}</p>
  <p>Total: Rp {{ total.toLocaleString() }}</p>
</template>
```

---

## 5️⃣ `watch()` & `watchEffect()`

### watch — Pantau data tertentu
```vue
<script setup>
import { ref, watch } from 'vue'

const pencarian = ref('')

watch(pencarian, (baru, lama) => {
  console.log(`Berubah: "${lama}" → "${baru}"`)
}, { immediate: false, deep: false })
</script>
```

### watchEffect — Auto-track
```vue
<script setup>
import { ref, watchEffect } from 'vue'

const counter = ref(0)

watchEffect(() => {
  console.log(`Counter: ${counter.value}`) // auto-track
})
</script>
```

| Fitur | `watch()` | `watchEffect()` |
|-------|-----------|-----------------|
| Source | Manual | Auto-detect |
| Nilai lama | ✅ | ❌ |
| Lazy | ✅ | ❌ (langsung jalan) |

---

## 🧪 Latihan: Todo List

Buat todo list dengan `ref`, `computed`, dan `watch`:

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const todos = ref([
  { id: 1, teks: 'Belajar ref()', selesai: true },
  { id: 2, teks: 'Belajar computed()', selesai: false },
])
const inputBaru = ref('')

const totalSelesai = computed(() => todos.value.filter(t => t.selesai).length)

watch(todos, (val) => {
  console.log('Todos berubah:', val.length)
}, { deep: true })

const tambah = () => {
  if (!inputBaru.value.trim()) return
  todos.value.push({ id: Date.now(), teks: inputBaru.value, selesai: false })
  inputBaru.value = ''
}
</script>

<template>
  <h2>📝 Todo ({{ totalSelesai }}/{{ todos.length }})</h2>
  <input v-model="inputBaru" @keyup.enter="tambah" placeholder="Tambah..." />
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input type="checkbox" v-model="todo.selesai" />
      <span :style="{ textDecoration: todo.selesai ? 'line-through' : 'none' }">
        {{ todo.teks }}
      </span>
    </li>
  </ul>
</template>
```

---

**Sebelumnya:** [← Bab 2 — Template Syntax](./02-template-syntax.md)
**Selanjutnya:** [Bab 4 — Event Handling →](./04-event-handling.md)
