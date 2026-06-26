# Error Handling & Loading State

Pengalaman Pengguna (User Experience / UX) yang baik bukan hanya tentang warna yang bagus, tapi bagaimana aplikasi bereaksi ketika sedang **memproses data** (Loading) dan ketika **terjadi kegagalan** (Error).

Tanpa Loading, user akan mengira tombol submit rusak lalu mengkliknya berkali-kali (menyebabkan double-data).
Tanpa Error Handling, aplikasi akan mati mendadak atau diam saja saat gagal ke server.

## 1. Konsep Try-Catch-Finally

Ketika melakukan aksi Async/Await (memanggil API), selalulah bungkus menggunakan blok `try-catch-finally`.

- **`try`**: Tempat dimana kode "semoga berhasil" dijalankan.
- **`catch`**: Akan menangkap error jika `try` gagal. Aplikasi tidak akan mati.
- **`finally`**: *SELALU* dijalankan pada akhirnya, baik sukses (`try`) maupun gagal (`catch`). Ini adalah tempat terbaik untuk mematikan status "Loading".

```vue
<script setup>
import { ref } from 'vue'
import api from '@/utils/api'

const isLoading = ref(false)
const errorMessage = ref(null)

const ambilData = async () => {
  // 1. Matikan error lama, hidupkan loading
  errorMessage.value = null
  isLoading.value = true
  
  try {
    // 2. Coba jalankan kode
    const response = await api.get('/data')
    console.log('Berhasil!', response.data)
  } catch (err) {
    // 3. Jika gagal, tangkap dan munculkan pesan
    errorMessage.value = 'Maaf, gagal memuat data ke server.'
  } finally {
    // 4. Pasti Dijalankan: Matikan loading!
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <button @click="ambilData" :disabled="isLoading">
      {{ isLoading ? 'Memproses...' : 'Ambil Data' }}
    </button>
    
    <p v-if="errorMessage" class="error-text">❌ {{ errorMessage }}</p>
  </div>
</template>
```

## 2. Skeleton Loader (Pengganti Teks "Loading...")

Menampilkan teks "Loading..." kadang kurang estetik. Aplikasi modern menggunakan `Skeleton Loader`, yaitu elemen kotak abu-abu yang berkedip untuk memberi ilusi bahwa konten akan segera muncul.

```vue
<template>
  <div>
    <!-- TAMPILKAN SKELETON JIKA LOADING -->
    <div v-if="isLoading" class="skeleton-wrapper">
      <!-- Ulangi 3 kotak skeleton pakai v-for -->
      <div v-for="n in 3" :key="n" class="skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>

    <!-- TAMPILKAN KONTEN ASLI JIKA SELESAI -->
    <div v-else class="content-wrapper">
      <div v-for="item in dataAsli" :key="item.id" class="card">
        <h3>{{ item.judul }}</h3>
        <p>{{ item.deskripsi }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* CSS Animasi Berkedip (Pulse) */
@keyframes pulse {
  0% { background-color: #e2e8f0; }
  50% { background-color: #cbd5e1; }
  100% { background-color: #e2e8f0; }
}

.skeleton {
  animation: pulse 1.5s infinite ease-in-out;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-title { height: 24px; width: 70%; }
.skeleton-text { height: 16px; width: 100%; }
</style>
```

## 3. Toast Notification (Notifikasi Pojok)

Untuk Error (atau Sukses) yang sifatnya umum (seperti 'Data berhasil dihapus'), sebaiknya jangan pakai `alert()` bawaan browser karena jelek dan mengganggu. Gunakan Toast Notification.

Ada banyak library luar, tapi membuat yang simple sendiri juga sangat mudah dengan **Teleport** Vue.

```vue
<!-- components/BaseToast.vue -->
<script setup>
import { ref } from 'vue'

const toasts = ref([])

// Fungsi ini bisa dipanggil dari luar menggunakan template ref / expose
const showToast = (pesan, tipe = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, pesan, tipe })
  
  // Otomatis hapus toast setelah 3 detik
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

// Buka akses agar fungsi ini bisa dipanggil dari parent
defineExpose({ showToast })
</script>

<template>
  <!-- Teleport: Pindahkan elemen ini langsung ke <body> agar posisinya absolut tidak terganggu css induknya -->
  <Teleport to="body">
    <div class="toast-container">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast"
        :class="'toast-' + toast.tipe"
      >
        {{ toast.pesan }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed; top: 20px; right: 20px;
  display: flex; flex-direction: column; gap: 10px; z-index: 9999;
}
.toast {
  min-width: 200px; padding: 15px 20px; border-radius: 8px;
  color: white; font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}
.toast-success { background-color: #10b981; }
.toast-error { background-color: #ef4444; }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
```

**Cara Menggunakannya di App.vue:**

```vue
<!-- App.vue -->
<script setup>
import { ref } from 'vue'
import BaseToast from '@/components/BaseToast.vue'

// Buat reference ke komponen
const toastRef = ref(null)

const jalankanSimulasi = async () => {
  try {
    // Panggil Toast SUKSES
    toastRef.value.showToast('Data berhasil disimpan!', 'success')
  } catch(e) {
    // Panggil Toast ERROR
    toastRef.value.showToast('Gagal menyimpan data!', 'error')
  }
}
</script>

<template>
  <!-- Pasang Komponen Toast cukup satu kali saja di Root (Misal di App.vue atau Layout utama) -->
  <BaseToast ref="toastRef" />
  
  <button @click="jalankanSimulasi">Simulasikan Notifikasi</button>
</template>
```
