# Bab 5: Conditional & List Rendering

## 1️⃣ Conditional Rendering

### `v-if`, `v-else-if`, `v-else`

```vue
<script setup>
import { ref } from 'vue'
const skor = ref(85)
</script>

<template>
  <p v-if="skor >= 90">🏆 Sangat Baik (A)</p>
  <p v-else-if="skor >= 75">👍 Baik (B)</p>
  <p v-else-if="skor >= 60">📝 Cukup (C)</p>
  <p v-else>❌ Kurang (D)</p>
</template>
```

### `v-show` — Toggle CSS Display

```vue
<template>
  <!-- v-show hanya toggle display:none, elemen tetap di DOM -->
  <p v-show="tampilkan">Saya terlihat!</p>
</template>
```

### v-if vs v-show

| Fitur | `v-if` | `v-show` |
|-------|--------|----------|
| Render | Destroy/create DOM | Toggle `display: none` |
| Initial cost | Rendah (jika false) | Tinggi (selalu render) |
| Toggle cost | Tinggi | Rendah |
| **Gunakan saat** | Jarang toggle | Sering toggle |

---

## 2️⃣ List Rendering — `v-for`

### Iterasi Array

```vue
<script setup>
import { ref } from 'vue'

const buah = ref(['🍎 Apel', '🍌 Pisang', '🍊 Jeruk', '🍇 Anggur'])
</script>

<template>
  <!-- Wajib pakai :key untuk performa optimal -->
  <ul>
    <li v-for="(item, index) in buah" :key="index">
      {{ index + 1 }}. {{ item }}
    </li>
  </ul>
</template>
```

### Iterasi Object

```vue
<script setup>
const user = { nama: 'Agung', umur: 25, kota: 'Jakarta' }
</script>

<template>
  <div v-for="(value, key, index) in user" :key="key">
    {{ index }}. {{ key }}: {{ value }}
  </div>
</template>
```

### Iterasi Range

```vue
<template>
  <!-- v-for dengan angka (1-based) -->
  <span v-for="n in 5" :key="n">{{ n }} </span>
  <!-- Output: 1 2 3 4 5 -->
</template>
```

---

## 3️⃣ `:key` — Kenapa Penting?

`:key` membantu Vue melacak identitas setiap elemen saat list berubah. **Selalu gunakan ID unik**, hindari index jika item bisa berubah urutan.

```vue
<script setup>
import { ref } from 'vue'

const todos = ref([
  { id: 1, teks: 'Belajar Vue' },
  { id: 2, teks: 'Buat project' },
])

const tambah = () => {
  todos.value.unshift({ id: Date.now(), teks: 'Todo baru' })
}
</script>

<template>
  <button @click="tambah">Tambah di awal</button>
  <!-- ✅ Pakai id sebagai key -->
  <div v-for="todo in todos" :key="todo.id">
    <input :value="todo.teks" />
  </div>
</template>
```

---

## 4️⃣ v-if + v-for (Jangan Digabung!)

```vue
<!-- ❌ SALAH: v-if dan v-for di elemen yang sama -->
<li v-for="todo in todos" v-if="!todo.selesai" :key="todo.id">
  {{ todo.teks }}
</li>

<!-- ✅ BENAR: Gunakan computed atau template wrapper -->
<script setup>
import { ref, computed } from 'vue'
const todos = ref([...])
const todoBelumSelesai = computed(() => todos.value.filter(t => !t.selesai))
</script>

<template>
  <li v-for="todo in todoBelumSelesai" :key="todo.id">
    {{ todo.teks }}
  </li>
</template>

<!-- ✅ Atau pakai <template> wrapper -->
<template v-for="todo in todos" :key="todo.id">
  <li v-if="!todo.selesai">{{ todo.teks }}</li>
</template>
```

---

## 🧪 Latihan: Daftar Kontak

```vue
<script setup>
import { ref, computed } from 'vue'

const kontaks = ref([
  { id: 1, nama: 'Agung', telp: '08123456789', favorit: true },
  { id: 2, nama: 'Budi', telp: '08234567890', favorit: false },
  { id: 3, nama: 'Citra', telp: '08345678901', favorit: true },
])

const filter = ref('semua') // 'semua' | 'favorit'
const cari = ref('')

const kontakFiltered = computed(() => {
  let hasil = kontaks.value
  if (filter.value === 'favorit') {
    hasil = hasil.filter(k => k.favorit)
  }
  if (cari.value) {
    hasil = hasil.filter(k => 
      k.nama.toLowerCase().includes(cari.value.toLowerCase())
    )
  }
  return hasil
})

const toggleFavorit = (id) => {
  const k = kontaks.value.find(k => k.id === id)
  if (k) k.favorit = !k.favorit
}
</script>

<template>
  <h2>📞 Kontak</h2>
  <input v-model="cari" placeholder="Cari nama..." />
  <select v-model="filter">
    <option value="semua">Semua</option>
    <option value="favorit">⭐ Favorit</option>
  </select>

  <p v-if="kontakFiltered.length === 0">Tidak ada kontak.</p>

  <div v-for="k in kontakFiltered" :key="k.id">
    <span @click="toggleFavorit(k.id)">
      {{ k.favorit ? '⭐' : '☆' }}
    </span>
    <strong>{{ k.nama }}</strong> — {{ k.telp }}
  </div>
</template>
```

---

**Sebelumnya:** [← Bab 4 — Event Handling](./04-event-handling.md)
**Selanjutnya:** [Bab 6 — Form Input Binding →](./06-form-binding.md)
