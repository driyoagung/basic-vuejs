# Bab 9: Props & Validation

## 📖 Apa itu Props?

Props adalah cara **parent** mengirim data ke **child** component. Aliran data satu arah: parent → child.

---

## 1️⃣ Mendefinisikan Props

```vue
<!-- ChildComponent.vue -->
<script setup>
// defineProps — tidak perlu di-import
const props = defineProps({
  judul: String,
  deskripsi: String,
  jumlah: Number,
})
</script>

<template>
  <h3>{{ judul }}</h3>
  <p>{{ deskripsi }}</p>
  <span>Jumlah: {{ jumlah }}</span>
</template>
```

### Menggunakan Props dari Parent

```vue
<!-- ParentComponent.vue -->
<script setup>
import ChildComponent from './ChildComponent.vue'
</script>

<template>
  <ChildComponent 
    judul="Belajar Vue" 
    deskripsi="Props itu mudah!" 
    :jumlah="42"  
  />
  <!-- ⚠️ Gunakan : (v-bind) untuk non-string values -->
</template>
```

---

## 2️⃣ Props Validation

```vue
<script setup>
defineProps({
  // Type saja
  nama: String,
  
  // Multiple types
  id: [String, Number],
  
  // Required
  email: {
    type: String,
    required: true,
  },
  
  // Dengan default value
  status: {
    type: String,
    default: 'aktif',
  },
  
  // Validator custom
  umur: {
    type: Number,
    validator(value) {
      return value >= 0 && value <= 150
    }
  },
  
  // Object/Array default harus factory function
  items: {
    type: Array,
    default: () => [],
  },
  config: {
    type: Object,
    default: () => ({ tema: 'light' }),
  },
})
</script>
```

---

## 3️⃣ Props dengan TypeScript-style (Alternatif)

```vue
<script setup>
// Menggunakan generic type
const props = defineProps<{
  judul: string
  deskripsi?: string  // optional
  jumlah: number
}>()

// Dengan default values
const props2 = withDefaults(defineProps<{
  judul: string
  tema?: string
}>(), {
  tema: 'light',
})
</script>
```

---

## 4️⃣ Dynamic Props

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
  <UserCard 
    v-for="user in users" 
    :key="user.id"
    :nama="user.nama"
    :role="user.role"
  />

  <!-- Atau pass seluruh object -->
  <UserCard v-for="user in users" :key="user.id" v-bind="user" />
</template>
```

---

## 5️⃣ One-Way Data Flow

```vue
<!-- ❌ JANGAN mutasi props langsung! -->
<script setup>
const props = defineProps({ count: Number })
// props.count++ ← ERROR!
</script>

<!-- ✅ Gunakan local ref atau computed -->
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ initialCount: Number })

// Local copy
const count = ref(props.initialCount)

// Atau computed
const doubled = computed(() => props.initialCount * 2)
</script>
```

---

## 🧪 Latihan: Product Card

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
    <img :src="gambar" :alt="nama" />
    <div class="info">
      <span class="kategori">{{ kategori }}</span>
      <h3>{{ nama }}</h3>
      <p class="harga">Rp {{ harga.toLocaleString() }}</p>
      <p :class="stok > 0 ? 'stok-ada' : 'stok-habis'">
        {{ stok > 0 ? `Stok: ${stok}` : 'Habis' }}
      </p>
    </div>
  </div>
</template>
```

Gunakan di parent:
```vue
<script setup>
import ProductCard from './components/ProductCard.vue'
import { ref } from 'vue'

const products = ref([
  { id: 1, nama: 'Laptop', harga: 12000000, stok: 5, kategori: 'Elektronik' },
  { id: 2, nama: 'Mouse', harga: 150000, stok: 0, kategori: 'Aksesoris' },
])
</script>

<template>
  <ProductCard
    v-for="p in products" :key="p.id"
    :nama="p.nama"
    :harga="p.harga"
    :stok="p.stok"
    :kategori="p.kategori"
  />
</template>
```

---

**Sebelumnya:** [← Bab 8 — Components](./08-components.md)
**Selanjutnya:** [Bab 10 — Events & Emit →](./10-emit-events.md)
