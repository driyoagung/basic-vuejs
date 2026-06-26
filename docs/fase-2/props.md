# Props & Validation

## Apa itu Props?

Props adalah cara **parent component** mengirim data ke **child component**. Aliran data di Vue bersifat satu arah (one-way data flow): dari parent turun ke child.

```
Parent Component
       │
    (Props)  ← Mengalir ke bawah
       ▼
Child Component
```

## Mendefinisikan Props

Gunakan macro `defineProps` di dalam `<script setup>`. Macro ini otomatis tersedia, tidak perlu di-import.

```vue
<!-- ChildComponent.vue -->
<script setup>
// Definisikan props yang diterima
const props = defineProps({
  judul: String,
  deskripsi: String,
  jumlah: Number,
})
</script>

<template>
  <div class="card">
    <h3>{{ judul }}</h3>
    <p>{{ deskripsi }}</p>
    <span>Jumlah: {{ jumlah }}</span>
  </div>
</template>
```

### Menggunakan Props dari Parent

```vue
<!-- ParentComponent.vue -->
<script setup>
import ChildComponent from './ChildComponent.vue'
</script>

<template>
  <!-- Passing static string -->
  <ChildComponent 
    judul="Belajar Vue" 
    deskripsi="Props itu mudah dipahami!" 
    :jumlah="42"  
  />
  
  <!-- ⚠️ PERHATIAN: Gunakan : (v-bind) untuk non-string values -->
  <!-- :jumlah="42" (Number) vs jumlah="42" (String) -->
  <!-- :is-active="true" (Boolean) vs is-active="true" (String) -->
</template>
```

## Props Validation

Vue menyediakan cara untuk memvalidasi props yang diterima. Ini sangat berguna jika komponen akan digunakan oleh developer lain.

```vue
<script setup>
defineProps({
  // Tipe data sederhana
  nama: String,
  
  // Mendukung multi-tipe data
  id: [String, Number],
  
  // Wajib diisi (Required)
  email: {
    type: String,
    required: true,
  },
  
  // Dengan nilai default
  status: {
    type: String,
    default: 'aktif',
  },
  
  // ⚠️ Default object/array HARUS dari function
  items: {
    type: Array,
    default: () => [],
  },
  config: {
    type: Object,
    default: () => ({ tema: 'light' }),
  },

  // Custom Validator
  umur: {
    type: Number,
    validator(value) {
      // Nilai harus di antara 0 dan 150
      return value >= 0 && value <= 150
    }
  },
})
</script>
```

## Props dengan TypeScript-style (Alternatif)

Jika menggunakan `<script setup lang="ts">`, kamu bisa mendefinisikan props menggunakan tipe TypeScript. (Vue compiler akan mengubahnya ke runtime validation).

```vue
<script setup lang="ts">
// Menggunakan generic type
const props = defineProps<{
  judul: string
  deskripsi?: string  // ? berarti optional
  jumlah: number
}>()

// Dengan default values (menggunakan withDefaults macro)
const propsWithDefault = withDefaults(defineProps<{
  judul: string
  tema?: string
}>(), {
  tema: 'light',
})
</script>
```

## Dynamic Props

Seringkali kita merender komponen di dalam loop dan mengirim data dari array/object:

```vue
<script setup>
import { ref } from 'vue'
import UserCard from './UserCard.vue'

const users = ref([
  { id: 1, nama: 'Agung', role: 'Developer' },
  { id: 2, nama: 'Budi', role: 'Designer' },
  { id: 3, nama: 'Citra', role: 'Manager' },
])
</script>

<template>
  <!-- Bind spesifik property -->
  <UserCard 
    v-for="user in users" 
    :key="user.id"
    :nama="user.nama"
    :role="user.role"
  />

  <!-- ✨ Shorthand: Bind seluruh properti object sekaligus -->
  <UserCard v-for="user in users" :key="user.id" v-bind="user" />
</template>
```

## One-Way Data Flow (Jangan Mutasi Props!)

::: danger Aturan Emas
Props bersifat **Read-Only**! Anak (child) TIDAK BOLEH merubah nilai prop yang diberikan oleh parent secara langsung.
:::

```vue
<!-- ❌ SALAH: Mutasi props langsung -->
<script setup>
const props = defineProps({ count: Number })

const increment = () => {
  props.count++  // ERROR! Vue akan memberikan warning.
}
</script>
```

### Solusi 1: Copy ke Local State (Jika butuh diubah lokal)

```vue
<script setup>
import { ref } from 'vue'
const props = defineProps({ initialCount: Number })

// Jadikan prop sebagai nilai awal untuk local ref
const localCount = ref(props.initialCount)

const increment = () => {
  localCount.value++ // Boleh, karena ini state lokal
}
</script>
```

### Solusi 2: Gunakan Computed (Jika nilai bergantung prop)

```vue
<script setup>
import { computed } from 'vue'
const props = defineProps({ nama: String })

const namaKapital = computed(() => props.nama.toUpperCase())
</script>
```

## Latihan: Product Card Dinamis

Mari perbaiki komponen Card statis dari bab sebelumnya menjadi dinamis dengan Props.

```vue
<!-- src/components/ProductCard.vue -->
<script setup>
defineProps({
  nama: { type: String, required: true },
  harga: { type: Number, required: true },
  gambar: { type: String, default: 'https://placehold.co/200x150' },
  stok: { type: Number, default: 0 },
  kategori: { type: String, default: 'Umum' },
})
</script>

<template>
  <div class="product-card">
    <img :src="gambar" :alt="nama" class="image" />
    <div class="info">
      <span class="badge">{{ kategori }}</span>
      <h3>{{ nama }}</h3>
      <p class="harga">Rp {{ harga.toLocaleString('id-ID') }}</p>
      
      <p :class="stok > 0 ? 'text-success' : 'text-danger'">
        {{ stok > 0 ? `Sisa Stok: ${stok}` : 'Habis Terjual' }}
      </p>
      
      <button :disabled="stok === 0">
        {{ stok > 0 ? 'Beli Sekarang' : 'Stok Kosong' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  max-width: 250px;
}
.image { width: 100%; height: 150px; object-fit: cover; }
.info { padding: 16px; }
.badge { background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.harga { font-weight: bold; font-size: 18px; color: #3b82f6; }
.text-success { color: #16a34a; font-size: 14px; }
.text-danger { color: #dc2626; font-size: 14px; font-weight: bold; }
button { width: 100%; padding: 8px; margin-top: 10px; cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.6; }
</style>
```

Gunakan di Parent:

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import ProductCard from './components/ProductCard.vue'

const products = ref([
  { id: 1, nama: 'Laptop Gaming X', harga: 15000000, stok: 5, kategori: 'Laptop' },
  { id: 2, nama: 'Mechanical Keyboard', harga: 850000, stok: 12, kategori: 'Aksesoris' },
  { id: 3, nama: 'Mouse Wireless', harga: 250000, stok: 0, kategori: 'Aksesoris' },
])
</script>

<template>
  <div style="display: flex; gap: 20px; flex-wrap: wrap;">
    <!-- Gunakan v-bind object untuk passing semua prop sekaligus -->
    <ProductCard 
      v-for="p in products" 
      :key="p.id" 
      v-bind="p" 
    />
  </div>
</template>
```
