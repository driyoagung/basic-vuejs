# Conditional & List Rendering

## Conditional Rendering

### `v-if`, `v-else-if`, `v-else`

Directive `v-if` merender elemen **hanya jika** kondisi bernilai `true`. Elemen benar-benar ditambahkan/dihapus dari DOM.

```vue
<script setup>
import { ref } from 'vue'
const skor = ref(85)
const loggedIn = ref(false)
</script>

<template>
  <!-- v-if / v-else-if / v-else -->
  <div v-if="skor >= 90">🏆 Sangat Baik (A)</div>
  <div v-else-if="skor >= 75">👍 Baik (B)</div>
  <div v-else-if="skor >= 60">📝 Cukup (C)</div>
  <div v-else>❌ Kurang (D)</div>

  <!-- Simple toggle -->
  <div v-if="loggedIn">
    <p>Selamat datang!</p>
    <button @click="loggedIn = false">Logout</button>
  </div>
  <div v-else>
    <p>Silakan login terlebih dahulu</p>
    <button @click="loggedIn = true">Login</button>
  </div>
</template>
```

### `v-if` pada `<template>`

Untuk menerapkan kondisi pada **beberapa elemen sekaligus** tanpa wrapper div tambahan:

```vue
<template>
  <template v-if="loggedIn">
    <h1>Selamat datang</h1>
    <p>Dashboard kamu</p>
    <nav>Menu navigasi</nav>
  </template>
  <!-- Tidak ada div wrapper tambahan di DOM! -->
</template>
```

### `v-show` — Toggle Display CSS

```vue
<template>
  <!-- v-show hanya toggle CSS display:none -->
  <!-- Elemen SELALU ada di DOM -->
  <p v-show="tampilkan">Saya terlihat!</p>
  
  <button @click="tampilkan = !tampilkan">Toggle</button>
</template>
```

### v-if vs v-show

| Fitur | `v-if` | `v-show` |
|-------|--------|----------|
| **Mekanisme** | Destroy/create elemen di DOM | Toggle `display: none` |
| **Initial cost** | Rendah (jika `false`, tidak render) | Tinggi (selalu render) |
| **Toggle cost** | Tinggi (destroy & recreate) | Rendah (hanya CSS) |
| **Mendukung `v-else`** | ✅ Ya | ❌ Tidak |
| **Gunakan saat** | **Jarang berubah** | **Sering toggle** |

::: tip Aturan Praktis
- **`v-show`** → untuk tab panel, dropdown, modal yang sering dibuka/tutup
- **`v-if`** → untuk konten yang jarang berubah, atau butuh lazy render
:::

## List Rendering — `v-for`

### Iterasi Array

```vue
<script setup>
import { ref } from 'vue'

const buah = ref([
  { id: 1, nama: '🍎 Apel', harga: 15000 },
  { id: 2, nama: '🍌 Pisang', harga: 8000 },
  { id: 3, nama: '🍊 Jeruk', harga: 12000 },
  { id: 4, nama: '🍇 Anggur', harga: 35000 },
])
</script>

<template>
  <ul>
    <!-- (item, index) in array -->
    <li v-for="(item, index) in buah" :key="item.id">
      {{ index + 1 }}. {{ item.nama }} — Rp {{ item.harga.toLocaleString() }}
    </li>
  </ul>
</template>
```

### Iterasi Object

```vue
<script setup>
const user = {
  nama: 'Agung',
  umur: 25,
  kota: 'Jakarta',
  pekerjaan: 'Developer'
}
</script>

<template>
  <!-- (value, key, index) in object -->
  <div v-for="(value, key, index) in user" :key="key">
    {{ index + 1 }}. <strong>{{ key }}</strong>: {{ value }}
  </div>
</template>
```

### Iterasi Range (Angka)

```vue
<template>
  <!-- v-for dengan angka (dimulai dari 1) -->
  <span v-for="n in 5" :key="n">{{ n }} </span>
  <!-- Output: 1 2 3 4 5 -->
</template>
```

## Pentingnya `:key`

`:key` membantu Vue **melacak identitas** setiap elemen saat list berubah. Selalu gunakan **ID unik** sebagai key.

```vue
<script setup>
import { ref } from 'vue'

const todos = ref([
  { id: 1, teks: 'Belajar Vue' },
  { id: 2, teks: 'Buat project' },
])

const tambahDiAwal = () => {
  todos.value.unshift({ id: Date.now(), teks: 'Todo baru' })
}
</script>

<template>
  <button @click="tambahDiAwal">Tambah di awal</button>
  
  <!-- ✅ Gunakan ID unik sebagai key -->
  <div v-for="todo in todos" :key="todo.id">
    <input :value="todo.teks" /> {{ todo.teks }}
  </div>
</template>
```

::: danger Hindari index sebagai key
```vue
<!-- ❌ Jangan pakai index jika item bisa berubah urutan -->
<div v-for="(item, index) in items" :key="index">

<!-- ✅ Gunakan ID unik -->
<div v-for="item in items" :key="item.id">
```
Menggunakan `index` sebagai key akan menyebabkan bug saat item ditambah/hapus/diurutkan ulang — Vue akan salah mencocokkan elemen.
:::

## v-if + v-for — Jangan Digabung!

::: danger Anti-Pattern
```vue
<!-- ❌ JANGAN gunakan v-if dan v-for pada elemen yang sama -->
<li v-for="todo in todos" v-if="!todo.selesai" :key="todo.id">
  {{ todo.teks }}
</li>
```
`v-if` punya prioritas lebih tinggi dari `v-for`, sehingga `v-if` tidak bisa akses variable dari `v-for`.
:::

### Solusi 1: Gunakan `computed` (Rekomendasi)

```vue
<script setup>
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, teks: 'Belajar Vue', selesai: true },
  { id: 2, teks: 'Buat project', selesai: false },
])

// ✅ Filter di computed
const todoBelumSelesai = computed(() => 
  todos.value.filter(t => !t.selesai)
)
</script>

<template>
  <li v-for="todo in todoBelumSelesai" :key="todo.id">
    {{ todo.teks }}
  </li>
</template>
```

### Solusi 2: Gunakan `<template>` wrapper

```vue
<template>
  <!-- ✅ v-for di template, v-if di child -->
  <template v-for="todo in todos" :key="todo.id">
    <li v-if="!todo.selesai">{{ todo.teks }}</li>
  </template>
</template>
```

## Latihan: Daftar Kontak dengan Filter

```vue
<script setup>
import { ref, computed } from 'vue'

const kontaks = ref([
  { id: 1, nama: 'Agung', telp: '08123456789', favorit: true },
  { id: 2, nama: 'Budi', telp: '08234567890', favorit: false },
  { id: 3, nama: 'Citra', telp: '08345678901', favorit: true },
  { id: 4, nama: 'Dewi', telp: '08456789012', favorit: false },
])

const filter = ref('semua')
const cari = ref('')

const kontakFiltered = computed(() => {
  let hasil = kontaks.value
  
  if (filter.value === 'favorit') {
    hasil = hasil.filter(k => k.favorit)
  }
  
  if (cari.value.trim()) {
    const keyword = cari.value.toLowerCase()
    hasil = hasil.filter(k => 
      k.nama.toLowerCase().includes(keyword) ||
      k.telp.includes(keyword)
    )
  }
  
  return hasil
})

const toggleFavorit = (id) => {
  const k = kontaks.value.find(k => k.id === id)
  if (k) k.favorit = !k.favorit
}

const hapusKontak = (id) => {
  kontaks.value = kontaks.value.filter(k => k.id !== id)
}
</script>

<template>
  <h2>📞 Daftar Kontak ({{ kontakFiltered.length }})</h2>
  
  <input v-model="cari" placeholder="🔍 Cari nama atau nomor..." />
  
  <select v-model="filter">
    <option value="semua">Semua</option>
    <option value="favorit">⭐ Favorit saja</option>
  </select>

  <p v-if="kontakFiltered.length === 0">
    Tidak ada kontak yang cocok.
  </p>

  <div v-for="k in kontakFiltered" :key="k.id" class="kontak-item">
    <span @click="toggleFavorit(k.id)" style="cursor: pointer;">
      {{ k.favorit ? '⭐' : '☆' }}
    </span>
    <strong>{{ k.nama }}</strong> — {{ k.telp }}
    <button @click="hapusKontak(k.id)">🗑️</button>
  </div>
</template>
```

## Rangkuman

| Konsep | Directive | Keterangan |
|--------|-----------|------------|
| Conditional render | `v-if` / `v-else-if` / `v-else` | Tambah/hapus dari DOM |
| Toggle visibility | `v-show` | CSS `display: none` |
| Loop array | `v-for="(item, i) in arr"` | Wajib pakai `:key` |
| Loop object | `v-for="(val, key, i) in obj"` | Akses value, key, index |
| Loop range | `v-for="n in 5"` | Angka 1 sampai 5 |
| Key unik | `:key="item.id"` | Hindari index sebagai key |
