# Bab 20: CRUD Fullstack (Vue + Laravel API)

## 📖 Arsitektur Vue + Laravel

```
┌─────────────┐    HTTP/JSON    ┌─────────────┐
│   Vue.js    │ ◄─────────────► │   Laravel   │
│  (Frontend) │    Axios        │  (Backend)  │
│  Port 5173  │                 │  Port 8000  │
└─────────────┘                 └─────────────┘
```

---

## 1️⃣ Setup CORS di Laravel

```php
// config/cors.php (Laravel)
return [
    'paths' => ['api/*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

---

## 2️⃣ Laravel API (Contoh)

```php
// routes/api.php
Route::apiResource('products', ProductController::class);

// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    public function index()
    {
        return ProductResource::collection(Product::paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'harga' => 'required|numeric',
        ]);
        $product = Product::create($validated);
        return new ProductResource($product);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($request->validated());
        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}
```

---

## 3️⃣ Vue: Store untuk CRUD

```js
// src/stores/product.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    try {
      const { data } = await api.get('/products')
      products.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || e.message
    } finally {
      loading.value = false
    }
  }

  async function create(form) {
    const { data } = await api.post('/products', form)
    products.value.unshift(data.data)
  }

  async function update(id, form) {
    const { data } = await api.put(`/products/${id}`, form)
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value[idx] = data.data
  }

  async function remove(id) {
    await api.delete(`/products/${id}`)
    products.value = products.value.filter(p => p.id !== id)
  }

  return { products, loading, error, fetchAll, create, update, remove }
})
```

---

## 4️⃣ Vue: Halaman Product

```vue
<!-- src/views/ProductView.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'

const store = useProductStore()
const showForm = ref(false)
const editId = ref(null)
const form = ref({ nama: '', harga: '' })

onMounted(() => store.fetchAll())

const openCreate = () => {
  editId.value = null
  form.value = { nama: '', harga: '' }
  showForm.value = true
}

const openEdit = (product) => {
  editId.value = product.id
  form.value = { nama: product.nama, harga: product.harga }
  showForm.value = true
}

const submit = async () => {
  try {
    if (editId.value) {
      await store.update(editId.value, form.value)
    } else {
      await store.create(form.value)
    }
    showForm.value = false
  } catch (err) {
    alert('Error: ' + err.response?.data?.message)
  }
}

const hapus = async (id) => {
  if (confirm('Yakin hapus?')) {
    await store.remove(id)
  }
}
</script>

<template>
  <h1>📦 Products</h1>
  <button @click="openCreate">+ Tambah</button>

  <!-- Form -->
  <div v-if="showForm" class="form-card">
    <h3>{{ editId ? 'Edit' : 'Tambah' }} Product</h3>
    <form @submit.prevent="submit">
      <input v-model="form.nama" placeholder="Nama" required />
      <input v-model.number="form.harga" type="number" placeholder="Harga" required />
      <button type="submit">Simpan</button>
      <button type="button" @click="showForm = false">Batal</button>
    </form>
  </div>

  <!-- List -->
  <div v-if="store.loading">Loading...</div>
  <table v-else>
    <thead>
      <tr><th>Nama</th><th>Harga</th><th>Aksi</th></tr>
    </thead>
    <tbody>
      <tr v-for="p in store.products" :key="p.id">
        <td>{{ p.nama }}</td>
        <td>Rp {{ p.harga?.toLocaleString() }}</td>
        <td>
          <button @click="openEdit(p)">✏️</button>
          <button @click="hapus(p.id)">🗑️</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

---

**Sebelumnya:** [← Bab 19 — Axios](./19-axios.md)
**Selanjutnya:** [Bab 21 — Auth Sanctum →](./21-auth-sanctum.md)
