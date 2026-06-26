# CRUD Fullstack (Vue + Laravel API)

Bab ini merangkum alur lengkap membuat fitur CRUD (Create, Read, Update, Delete) yang menghubungkan Vue (Frontend) dengan Laravel (Backend API).

Kita akan menggunakan contoh studi kasus: **Manajemen Data Buku**.

## 1. Persiapan Backend (Laravel)

Pastikan kamu memiliki Controller API di Laravel (`BukuController.php`).

```php
// Route di routes/api.php
Route::apiResource('buku', BukuController::class);
```

Endpoint yang akan di-generate oleh Laravel:
- `GET /api/buku` (Index/Read All)
- `POST /api/buku` (Store/Create)
- `GET /api/buku/{id}` (Show/Read Single)
- `PUT /api/buku/{id}` (Update)
- `DELETE /api/buku/{id}` (Destroy)

## 2. Setup Service API (Vue)

Buat fungsi pembantu untuk memanggil API buku menggunakan instance axios yang sudah kita buat sebelumnya (`api.js`). Memisahkan "Logika Panggilan API" dari "Komponen UI" sangat disarankan.

```js
// src/services/bukuService.js
import api from '@/utils/api'

export default {
  getAll() {
    return api.get('/buku')
  },
  getById(id) {
    return api.get(`/buku/${id}`)
  },
  create(data) {
    return api.post('/buku', data)
  },
  update(id, data) {
    return api.put(`/buku/${id}`, data)
  },
  delete(id) {
    return api.delete(`/buku/${id}`)
  }
}
```

## 3. Komponen Utama: Menampilkan Daftar (Read) & Hapus (Delete)

```vue
<!-- views/BukuIndexView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bukuService from '@/services/bukuService'

const router = useRouter()
const daftarBuku = ref([])
const loading = ref(true)
const error = ref('')

const fetchBuku = async () => {
  loading.value = true
  try {
    const response = await bukuService.getAll()
    // Tergantung struktur respon Laravelmu, biasanya dibungkus "data"
    daftarBuku.value = response.data.data 
  } catch (err) {
    error.value = 'Gagal memuat daftar buku.'
  } finally {
    loading.value = false
  }
}

const hapusBuku = async (id) => {
  if (!confirm('Anda yakin ingin menghapus buku ini?')) return
  
  try {
    await bukuService.delete(id)
    alert('Buku berhasil dihapus!')
    fetchBuku() // Refresh daftar
  } catch (err) {
    alert('Gagal menghapus buku.')
  }
}

const pergiKeFormTambah = () => {
  router.push({ name: 'buku-tambah' })
}

const pergiKeFormEdit = (id) => {
  router.push({ name: 'buku-edit', params: { id } })
}

onMounted(() => {
  fetchBuku()
})
</script>

<template>
  <div>
    <h2>Daftar Buku</h2>
    <button @click="pergiKeFormTambah" class="btn-primary">Tambah Buku Baru</button>

    <div v-if="loading">Memuat data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="buku in daftarBuku" :key="buku.id">
          <td>{{ buku.id }}</td>
          <td>{{ buku.judul }}</td>
          <td>{{ buku.penulis }}</td>
          <td>
            <button @click="pergiKeFormEdit(buku.id)">Edit</button>
            <button @click="hapusBuku(buku.id)" style="color:red">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <p v-if="daftarBuku.length === 0 && !loading">Belum ada data buku.</p>
  </div>
</template>
```

## 4. Komponen Form: Tambah (Create) & Ubah (Update)

Satu komponen form dapat digunakan untuk Mode Tambah maupun Mode Edit.

```vue
<!-- views/BukuFormView.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import bukuService from '@/services/bukuService'

const router = useRouter()
const route = useRoute()

// Form Data Reactive
const form = ref({
  judul: '',
  penulis: '',
  tahun_terbit: ''
})

const isSubmitting = ref(false)
const errorMessages = ref({}) // Untuk menampung validasi dari Laravel (422)

// Cek apakah ini mode Edit (jika ada param :id di URL)
const isEditMode = computed(() => !!route.params.id)

const loadBukuForEdit = async () => {
  try {
    const response = await bukuService.getById(route.params.id)
    form.value = response.data.data
  } catch (err) {
    alert('Buku tidak ditemukan')
    router.push({ name: 'buku-index' })
  }
}

const submitForm = async () => {
  isSubmitting.value = true
  errorMessages.value = {}
  
  try {
    if (isEditMode.value) {
      await bukuService.update(route.params.id, form.value)
      alert('Berhasil diperbarui!')
    } else {
      await bukuService.create(form.value)
      alert('Berhasil ditambahkan!')
    }
    
    // Redirect ke daftar buku
    router.push({ name: 'buku-index' })
    
  } catch (err) {
    // Menangkap validasi error Laravel (Status HTTP 422 Unprocessable Entity)
    if (err.response && err.response.status === 422) {
      // Laravel mengembalikan error di object "errors"
      errorMessages.value = err.response.data.errors
    } else {
      alert('Terjadi kesalahan pada server.')
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (isEditMode.value) {
    loadBukuForEdit()
  }
})
</script>

<template>
  <div class="form-container">
    <h2>{{ isEditMode ? 'Edit Buku' : 'Tambah Buku Baru' }}</h2>
    
    <form @submit.prevent="submitForm">
      <!-- Input Judul -->
      <div class="form-group">
        <label>Judul Buku</label>
        <input v-model="form.judul" type="text" placeholder="Masukkan judul..." />
        
        <!-- Tampilkan Error Spesifik untuk field 'judul' -->
        <small v-if="errorMessages.judul" class="error">
          {{ errorMessages.judul[0] }}
        </small>
      </div>

      <!-- Input Penulis -->
      <div class="form-group">
        <label>Nama Penulis</label>
        <input v-model="form.penulis" type="text" />
        <small v-if="errorMessages.penulis" class="error">{{ errorMessages.penulis[0] }}</small>
      </div>

      <!-- Input Tahun -->
      <div class="form-group">
        <label>Tahun Terbit</label>
        <input v-model="form.tahun_terbit" type="number" />
        <small v-if="errorMessages.tahun_terbit" class="error">{{ errorMessages.tahun_terbit[0] }}</small>
      </div>

      <div class="form-actions">
        <button type="button" @click="router.back()">Batal</button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error { color: red; font-size: 12px; display: block; margin-top: 4px; }
.form-group { margin-bottom: 15px; }
.form-actions { display: flex; gap: 10px; margin-top: 20px; }
</style>
```

## 5. Pola Lanjutan: Optimistic UI Updates

Seringkali user harus menunggu 1-2 detik saat menghapus data sebelum baris di tabel hilang (karena menunggu balasan server). Pola **Optimistic UI** membalikkan cara kerjanya: Kita "langsung" mengubah UI dengan asumsi bahwa request ke server *pasti akan berhasil*.

Jika ternyata server mengembalikan error, barulah kita kembalikan UI-nya ke bentuk semula. Ini membuat aplikasi terasa **instan tanpa loading**.

Contoh modifikasi fungsi `hapusBuku` menggunakan pola Optimistic UI:

```js
const hapusBukuOptimistic = async (id) => {
  if (!confirm('Anda yakin?')) return

  // 1. Simpan backup data aslinya (berjaga-jaga jika API gagal)
  const backupData = [...daftarBuku.value]

  // 2. LANGSUNG Hapus baris dari UI tanpa menunggu API (UI berubah Instan!)
  daftarBuku.value = daftarBuku.value.filter(b => b.id !== id)

  try {
    // 3. Eksekusi request API di background
    await bukuService.delete(id)
    // Jika sukses, biarkan saja (karena UI sudah dihapus duluan)
  } catch (err) {
    // 4. JIKA GAGAL: Kembalikan data dari backup!
    alert('Gagal menghapus ke server. Mengembalikan data aslinya.')
    daftarBuku.value = backupData
  }
}
```

## 6. Ringkasan Routing (Di `router/index.js`)

Untuk memastikan komponen di atas berjalan, konfigurasi routemu harus terlihat seperti ini:

```js
const routes = [
  {
    path: '/buku',
    name: 'buku-index',
    component: () => import('@/views/BukuIndexView.vue')
  },
  {
    path: '/buku/tambah',
    name: 'buku-tambah',
    component: () => import('@/views/BukuFormView.vue')
  },
  {
    path: '/buku/edit/:id',
    name: 'buku-edit',
    component: () => import('@/views/BukuFormView.vue')
  }
]
```

## Kesimpulan Alur CRUD
1. Pisahkan pemanggilan Axios di folder `/services`.
2. Gunakan Lifecycle `onMounted` untuk `GET` (Read).
3. Gunakan function yang dipicu `@click` untuk `POST/PUT/DELETE`.
4. Selalu gunakan blok `try-catch` untuk menangkap error dari Backend.
5. Tangani HTTP Status Code `422` dari Laravel untuk menampilkan pesan validasi error per input field menggunakan `err.response.data.errors`.
