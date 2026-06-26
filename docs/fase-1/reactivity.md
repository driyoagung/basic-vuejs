# Reactivity — ref, reactive, computed, watch

Reactivity adalah konsep inti Vue.js — ketika **data berubah**, **UI otomatis update** tanpa manipulasi DOM manual.

```
Data berubah  →  Vue mendeteksi  →  DOM di-update otomatis
```

## `ref()` — Reactive Reference

`ref()` adalah cara utama membuat data reactive di Vue 3. Bisa dipakai untuk **semua tipe data** (primitif maupun object).

```vue
<script setup>
import { ref } from 'vue'

const counter = ref(0)           // number
const nama = ref('Agung')       // string
const aktif = ref(true)         // boolean
const items = ref([1, 2, 3])    // array
const user = ref({ nama: 'A' }) // object

// ⚠️ Di dalam <script>, akses/ubah dengan .value
console.log(counter.value) // 0
counter.value++            // 1
nama.value = 'Budi'       // ubah string
items.value.push(4)        // ubah array
</script>

<template>
  <!-- ✅ Di dalam <template>, TIDAK perlu .value -->
  <p>Counter: {{ counter }}</p>
  <p>Nama: {{ nama }}</p>
  <p>Items: {{ items }}</p>
</template>
```

::: tip Aturan .value
- **Di `<script>`** → akses/ubah dengan `.value` (wajib!)
- **Di `<template>`** → Vue otomatis unwrap, **tidak perlu** `.value`
:::

## `reactive()` — Reactive Object

`reactive()` membuat object menjadi reactive secara mendalam (deep reactive). Tidak perlu `.value`.

```vue
<script setup>
import { reactive } from 'vue'

const user = reactive({
  nama: 'Agung',
  umur: 25,
  alamat: {
    kota: 'Jakarta',
    provinsi: 'DKI Jakarta'
  }
})

// ✅ Langsung akses tanpa .value
user.umur++
user.alamat.kota = 'Bandung'
</script>

<template>
  <p>{{ user.nama }} ({{ user.umur }} tahun)</p>
  <p>Kota: {{ user.alamat.kota }}</p>
</template>
```

### Batasan `reactive()`

::: danger Jangan Lakukan Ini
```js
// ❌ JANGAN reassign reactive object
let user = reactive({ nama: 'Agung' })
user = reactive({ nama: 'Budi' }) // Kehilangan reactivity!

// ❌ JANGAN destructure langsung
const { nama, umur } = reactive({ nama: 'Agung', umur: 25 })
// nama dan umur BUKAN reactive lagi!
```
:::

Solusi jika perlu destructure:

```js
import { reactive, toRefs } from 'vue'

const state = reactive({ nama: 'Agung', umur: 25 })
const { nama, umur } = toRefs(state) // ✅ Tetap reactive!
// Akses: nama.value, umur.value
```

## `ref()` vs `reactive()`

| Fitur | `ref()` | `reactive()` |
|-------|---------|-------------|
| Tipe data | **Semua** (primitif & object) | Object/Array saja |
| Akses di script | `.value` | Langsung |
| Bisa reassign | ✅ Ya | ❌ Tidak |
| Bisa destructure | ✅ Ya | ❌ Kehilangan reactivity |
| **Rekomendasi** | **✅ Pilihan utama** | Untuk nested object yang complex |

::: tip Rekomendasi Tim Vue
Gunakan `ref()` sebagai pilihan default. Ini lebih konsisten dan fleksibel.
:::

## Deep Dive: Bagaimana Reactivity Bekerja? (ES6 Proxy)

Seringkali pemula bingung, *"Bagaimana Vue tahu kalau variabel `nama` berubah, lalu otomatis mengganti UI?"*

Di Vue 3, rahasianya ada pada fitur JavaScript modern bernama **ES6 Proxy**. 
Ketika kamu membungkus object dengan `reactive()` atau memanggil `ref()`, Vue sebenarnya tidak memberikan object aslimu, melainkan sebuah **Proxy** (Perantara).

```js
// Object biasa
const asli = { nama: 'Agung' }

// Vue membungkusnya dengan Proxy
const proxy = new Proxy(asli, {
  get(target, key) {
    // Vue mencatat: "Oh, komponen A sedang membaca data 'nama'" (Track)
    return target[key]
  },
  set(target, key, value) {
    target[key] = value
    // Vue memberi tahu: "Hei komponen A, data 'nama' diganti, ayo re-render!" (Trigger)
    return true
  }
})
```

Itulah mengapa **destructuring** (mengambil nilai secara terpisah seperti `const { nama } = state`) akan menghilangkan reactivity-nya. Karena saat kamu men-destructure, kamu menarik nilai *primitive* mentahnya keluar dari "pengawasan" si Proxy! Gunakan `toRefs()` untuk mencegahnya.

## `computed()` — Nilai Turunan (Cached)

`computed()` membuat nilai yang **otomatis dihitung ulang** saat dependency-nya berubah. Hasilnya di-**cache** — tidak dihitung ulang jika dependency tidak berubah.

```vue
<script setup>
import { ref, computed } from 'vue'

const harga = ref(100000)
const jumlah = ref(3)
const diskon = ref(10) // persen

// ✅ Otomatis recalculate saat harga/jumlah/diskon berubah
const subtotal = computed(() => harga.value * jumlah.value)
const potongan = computed(() => subtotal.value * (diskon.value / 100))
const total = computed(() => subtotal.value - potongan.value)
</script>

<template>
  <div>
    <label>Harga: <input type="number" v-model.number="harga" /></label>
    <label>Jumlah: <input type="number" v-model.number="jumlah" /></label>
    <label>Diskon (%): <input type="number" v-model.number="diskon" /></label>
    
    <hr />
    <p>Subtotal: Rp {{ subtotal.toLocaleString('id-ID') }}</p>
    <p>Potongan: Rp {{ potongan.toLocaleString('id-ID') }}</p>
    <p><strong>Total: Rp {{ total.toLocaleString('id-ID') }}</strong></p>
  </div>
</template>
```

### Computed vs Method

| | `computed` | Method |
|---|-----------|--------|
| **Caching** | ✅ Di-cache, recalculate hanya saat dependency berubah | ❌ Dipanggil setiap kali re-render |
| **Pakai saat** | Nilai turunan dari data reactive | Aksi/operasi yang perlu dipanggil |
| **Contoh** | `filteredList`, `totalHarga` | `handleSubmit`, `fetchData` |

### Writable Computed

Computed bisa juga punya setter:

```vue
<script setup>
import { ref, computed } from 'vue'

const namaDepan = ref('Agung')
const namaBelakang = ref('Pratama')

const namaLengkap = computed({
  get() {
    return `${namaDepan.value} ${namaBelakang.value}`
  },
  set(nilai) {
    const [depan, ...belakang] = nilai.split(' ')
    namaDepan.value = depan
    namaBelakang.value = belakang.join(' ')
  }
})

// Bisa di-set:
// namaLengkap.value = 'Budi Santoso'
// → namaDepan = 'Budi', namaBelakang = 'Santoso'
</script>
```

## `watch()` — Pantau Perubahan

`watch()` memantau perubahan data tertentu dan menjalankan side-effect (efek samping) saat data berubah.

```vue
<script setup>
import { ref, watch } from 'vue'

const pencarian = ref('')
const hasilCari = ref([])

// Watch satu ref
watch(pencarian, (nilaiBaru, nilaiLama) => {
  console.log(`Berubah: "${nilaiLama}" → "${nilaiBaru}"`)
  
  // Contoh: fetch data saat pencarian ≥ 3 karakter
  if (nilaiBaru.length >= 3) {
    hasilCari.value = [`Hasil untuk: ${nilaiBaru}`]
  } else {
    hasilCari.value = []
  }
})
```

### Watch Options

```js
// Jalankan juga saat pertama kali (tidak hanya saat berubah)
watch(source, callback, { immediate: true })

// Pantau perubahan nested/deep (untuk object/array)
watch(source, callback, { deep: true })

// Hanya trigger sekali
watch(source, callback, { once: true })
```

### Watch Multiple Sources

```js
const x = ref(0)
const y = ref(0)

watch([x, y], ([newX, newY], [oldX, oldY]) => {
  console.log(`(${oldX},${oldY}) → (${newX},${newY})`)
})
```

## `watchEffect()` — Auto-Track

`watchEffect()` otomatis mendeteksi dependency dan langsung dijalankan saat pertama kali:

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const counter = ref(0)
const nama = ref('Agung')

// Otomatis track counter dan nama — dijalankan langsung!
watchEffect(() => {
  console.log(`Counter: ${counter.value}, Nama: ${nama.value}`)
  document.title = `Count: ${counter.value}`
})
</script>
```

### Perbandingan watch vs watchEffect

| Fitur | `watch()` | `watchEffect()` |
|-------|-----------|-----------------|
| Tentukan source | ✅ Manual (eksplisit) | 🔄 Auto-detect |
| Akses nilai lama | ✅ Ya (`oldValue`) | ❌ Tidak |
| Lazy by default | ✅ Ya (trigger saat berubah) | ❌ Langsung jalan |
| **Pakai saat** | Reaksi spesifik terhadap data tertentu | Side-effect umum |

## Latihan

### Latihan: Todo List dengan Reactivity

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const todos = ref([
  { id: 1, teks: 'Belajar ref()', selesai: true },
  { id: 2, teks: 'Belajar reactive()', selesai: false },
  { id: 3, teks: 'Belajar computed()', selesai: false },
])

const inputBaru = ref('')

// Computed
const totalTodos = computed(() => todos.value.length)
const totalSelesai = computed(() => todos.value.filter(t => t.selesai).length)
const totalBelum = computed(() => totalTodos.value - totalSelesai.value)
const progress = computed(() => 
  totalTodos.value > 0 
    ? Math.round((totalSelesai.value / totalTodos.value) * 100) 
    : 0
)

// Watch
watch(totalSelesai, (baru, lama) => {
  if (baru > lama) {
    console.log('🎉 Satu todo selesai!')
  }
})

// Methods
const tambahTodo = () => {
  if (!inputBaru.value.trim()) return
  todos.value.push({
    id: Date.now(),
    teks: inputBaru.value,
    selesai: false
  })
  inputBaru.value = ''
}

const hapusTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <h2>📝 Todo List</h2>
  <p>
    Total: {{ totalTodos }} | 
    ✅ Selesai: {{ totalSelesai }} | 
    ⏳ Belum: {{ totalBelum }} |
    Progress: {{ progress }}%
  </p>
  
  <div>
    <input 
      v-model="inputBaru" 
      @keyup.enter="tambahTodo" 
      placeholder="Tambah todo baru..." 
    />
    <button @click="tambahTodo">Tambah</button>
  </div>
  
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input type="checkbox" v-model="todo.selesai" />
      <span :style="{ 
        textDecoration: todo.selesai ? 'line-through' : 'none',
        color: todo.selesai ? '#9ca3af' : 'inherit'
      }">
        {{ todo.teks }}
      </span>
      <button @click="hapusTodo(todo.id)">❌</button>
    </li>
  </ul>
</template>
```

## Rangkuman

| Konsep | Fungsi | Catatan Penting |
|--------|--------|----------------|
| `ref()` | Buat nilai reactive | Akses `.value` di script, otomatis di template |
| `reactive()` | Buat object reactive | Jangan reassign / destructure |
| `computed()` | Nilai turunan (cached) | Otomatis update saat dependency berubah |
| `watch()` | Pantau perubahan spesifik | Bisa akses nilai lama, lazy by default |
| `watchEffect()` | Auto-track side effect | Langsung jalan, auto-detect dependency |
| `toRefs()` | Destructure reactive | Pertahankan reactivity saat destructure |
