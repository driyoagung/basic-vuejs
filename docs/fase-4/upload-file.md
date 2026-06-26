# Upload File & Media

Mengunggah file (seperti gambar profil atau dokumen PDF) sedikit berbeda dengan mengirim data text/json biasa. Kita harus menggunakan **FormData** agar file bisa terkirim dengan format `multipart/form-data` yang dimengerti oleh Backend (Laravel).

## 1. Konsep Dasar Input File

```vue
<script setup>
import { ref } from 'vue'

const filePilihan = ref(null)

// Dijalankan saat user memilih file di kotak dialog
const handleFileChange = (event) => {
  // Ambil file pertama dari daftar file yang dipilih
  const file = event.target.files[0]
  
  if (file) {
    filePilihan.value = file
    console.log('Nama File:', file.name)
    console.log('Ukuran:', (file.size / 1024).toFixed(2), 'KB')
    console.log('Tipe:', file.type) // "image/jpeg", "application/pdf"
  }
}
</script>

<template>
  <!-- WAJIB menggunakan type="file" -->
  <input type="file" @change="handleFileChange" accept="image/png, image/jpeg" />
</template>
```

::: warning Perhatian
Jangan gunakan `v-model` pada input bertipe `file`! `v-model` tidak didukung karena input file di browser bersifat *Read-Only* secara keamanan (JavaScript tidak boleh menyetel file secara paksa). Selalu gunakan event `@change`.
:::

## 2. Preview Gambar (Sebelum Upload)

Sangat sering user ingin melihat foto yang mereka pilih *sebelum* memencet tombol Simpan. Kita bisa menggunakan `URL.createObjectURL()`.

```vue
<script setup>
import { ref, onUnmounted } from 'vue'

const filePilihan = ref(null)
const previewUrl = ref(null)

const onFileDipilih = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validasi tipe (Hanya Gambar)
  if (!file.type.startsWith('image/')) {
    alert('Tolong pilih file gambar!')
    return
  }

  // Simpan Object File-nya (Untuk dikirim ke API nanti)
  filePilihan.value = file

  // Buat URL sementara (Blob URL) untuk preview
  previewUrl.value = URL.createObjectURL(file)
}

// Memory Cleanup: Hapus Blob URL saat komponen mati
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div>
    <!-- Tampilkan Preview jika URL ada -->
    <img 
      v-if="previewUrl" 
      :src="previewUrl" 
      alt="Preview" 
      style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;"
    />
    
    <input type="file" @change="onFileDipilih" accept="image/*" />
  </div>
</template>
```

## 3. Mengirim File ke API dengan FormData

Saat tombol submit ditekan, kita bungkus file (dan teks lainnya jika ada) ke dalam `FormData`.

```vue
<script setup>
import { ref } from 'vue'
import api from '@/utils/api'

const nama = ref('')
const foto = ref(null)
const isUploading = ref(false)

const pilihFoto = (e) => {
  foto.value = e.target.files[0]
}

const submitKeServer = async () => {
  // 1. Buat instance FormData baru
  const formData = new FormData()
  
  // 2. Masukkan data teks biasa
  formData.append('nama', nama.value)
  
  // 3. Masukkan file (Jika user memilih file)
  if (foto.value) {
    // 'foto_profil' harus sama dengan nama var di Laravel $request->file('foto_profil')
    formData.append('foto_profil', foto.value) 
  }

  isUploading.value = true
  
  try {
    // 4. Kirim dengan method POST
    const response = await api.post('/update-profil', formData, {
      // 5. Wajib Set Header Content-Type
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    alert('Berhasil upload!')
  } catch (error) {
    console.error(error)
    alert('Gagal upload.')
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submitKeServer">
    <input v-model="nama" placeholder="Ketik nama Anda" />
    <input type="file" @change="pilihFoto" accept="image/*" />
    
    <button type="submit" :disabled="isUploading">
      {{ isUploading ? 'Mengirim...' : 'Simpan Profil' }}
    </button>
  </form>
</template>
```

## 4. Menambahkan Progress Bar Upload

Jika file cukup besar, user butuh indikator (Progress Bar) agar mereka tahu bahwa aplikasi sedang bekerja (tidak hang). Axios memiliki fitur `onUploadProgress`.

```vue
<script setup>
import { ref } from 'vue'
import api from '@/utils/api'

const foto = ref(null)
const progress = ref(0) // Angka 0 - 100

const prosesUpload = async () => {
  const fd = new FormData()
  fd.append('file', foto.value)
  
  try {
    await api.post('/upload-dokumen', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      
      // Axios Event: Melacak Proses Upload
      onUploadProgress: (progressEvent) => {
        // Hitung persentase ter-upload
        const persentase = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        progress.value = persentase
      }
    })
    
    alert('Upload Selesai!')
    progress.value = 0 // Reset
    
  } catch (err) {
    progress.value = 0 // Reset jika error
    alert('Terjadi kesalahan')
  }
}
</script>

<template>
  <div>
    <input type="file" @change="e => foto.value = e.target.files[0]" />
    <button @click="prosesUpload">Upload File Besar</button>
    
    <!-- Tampilan Progress Bar -->
    <div v-if="progress > 0" class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      <p style="text-align: center;">{{ progress }}% Terkirim...</p>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
}
.progress-bar {
  height: 20px;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
</style>
```

## 5. Trik Upload Method PUT (Laravel Khusus)

Secara bawaan HTTP, `FormData` (`multipart/form-data`) **hanya bisa terkirim via metode `POST`**. Jika kamu memaksakan mengirimnya dengan metode `PUT` (misalnya route Laravel menggunakan `Route::put`), file kamu akan terbaca KOSONG di backend!

### Solusi Laravel (Method Spoofing)
Kirim tetap menggunakan metode **`POST`**, tetapi tambahkan field khusus `_method` berisi nilai `"PUT"` ke dalam FormData-mu.

```js
const formData = new FormData()
formData.append('nama', 'Agung')
formData.append('foto', file.value)

// TRIK LARAVEL: Berbohong bahwa ini adalah method PUT
formData.append('_method', 'PUT')

// Ingat: Axiosnya TETAP menggunakan .post() !
await api.post(`/buku/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```
