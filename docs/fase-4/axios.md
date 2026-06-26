# HTTP Request dengan Axios

Untuk berkomunikasi dengan Backend API (seperti mengambil data dari server, mengirim form, atau hapus data), kita butuh library HTTP Client. Walaupun JavaScript punya `fetch()` bawaan, **Axios** adalah standar industri di ekosistem Vue karena lebih praktis dan punya banyak fitur canggih.

## 1. Instalasi Axios

```bash
npm install axios
```

## 2. Membuat Instance Axios (Best Practice)

Daripada memanggil `axios.get('http://api.domain.com/v1/...')` berkali-kali di setiap komponen, lebih baik kita buat sebuah "Instance" atau Base Config.

Buat file baru di `src/utils/api.js` atau `src/services/api.js`.

```js
// src/utils/api.js
import axios from 'axios'

const api = axios.create({
  // URL dasar backend API kamu (misal: API Laravel)
  baseURL: 'http://localhost:8000/api',
  
  // Timeout jika server down (10 detik)
  timeout: 10000,
  
  // Header bawaan untuk setiap request
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default api
```

## 3. Melakukan Permintaan CRUD Dasar

Sekarang kita bisa menggunakan instance `api` tadi di dalam komponen.

```vue
<!-- DaftarProduk.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/api' // Import instance buatan kita

const produk = ref([])
const error = ref(null)

// R (Read) - GET Request
const ambilData = async () => {
  try {
    // Memanggil http://localhost:8000/api/produk
    const response = await api.get('/produk')
    
    // Axios otomatis mengubah respon JSON menjadi Object Javascript.
    // Data aslinya selalu berada di dalam property .data
    produk.value = response.data.data 
  } catch (err) {
    error.value = err.message
  }
}

// C (Create) - POST Request
const tambahData = async (payloadBaru) => {
  try {
    const response = await api.post('/produk', payloadBaru)
    console.log('Berhasil tambah!', response.data)
    ambilData() // Refresh list
  } catch (err) {
    console.error('Gagal tambah', err)
  }
}

// U (Update) - PUT/PATCH Request
const updateData = async (id, payloadUpdate) => {
  try {
    await api.put(`/produk/${id}`, payloadUpdate)
    ambilData()
  } catch (err) {
    console.error('Gagal update', err)
  }
}

// D (Delete) - DELETE Request
const hapusData = async (id) => {
  if(!confirm('Yakin hapus?')) return
  try {
    await api.delete(`/produk/${id}`)
    ambilData()
  } catch (err) {
    console.error('Gagal hapus', err)
  }
}

onMounted(() => {
  ambilData()
})
</script>
```

## 4. Kehebatan Axios: Interceptors

Interceptor adalah fitur layaknya "Satpam" yang berdiri di tengah-tengah jalan. 
Ada satpam untuk **Request** (sebelum data terkirim ke server) dan **Response** (setelah server menjawab, sebelum masuk ke komponen).

### A. Request Interceptor (Menyisipkan Token Auth)

Misalkan kita punya Token Login. Daripada menyisipkan token secara manual di setiap request `.get()` dan `.post()`, kita suruh Axios otomatis menyisipkannya.

```js
// Lanjutan dari src/utils/api.js

api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token')
    
    // Jika ada token, pasang di Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config // Lanjutkan request
  },
  (error) => {
    return Promise.reject(error)
  }
)
```

### B. Response Interceptor (Global Error Handling)

Seringkali Backend mengembalikan status `401 Unauthorized` (Token mati/belum login). Jika ini terjadi, kita mau otomatis menendang user kembali ke halaman Login.

```js
api.interceptors.response.use(
  (response) => {
    // Jika respon sukses (200-299), langsung kembalikan datanya
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Jika error 401 (Unauthorized) DAN belum pernah mencoba refresh sebelumnya
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // Tandai agar tidak infinite loop
      
      try {
        // Coba minta token baru ke endpoint refresh (biasanya via Cookie HttpOnly)
        const res = await axios.post('http://localhost:8000/api/refresh-token', {}, { withCredentials: true })
        
        // Simpan token baru
        const tokenBaru = res.data.token
        localStorage.setItem('token', tokenBaru)
        
        // Ubah header Authorization di request yang tadi gagal, lalu ulangi requestnya!
        originalRequest.headers.Authorization = `Bearer ${tokenBaru}`
        return api(originalRequest)
        
      } catch (refreshError) {
        // Jika proses refresh token juga gagal (misal session benar-benar habis)
        console.warn('Sesi Habis. Silakan Login Ulang.')
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Lempar kembali error jika bukan 401, atau jika refresh gagal
    return Promise.reject(error)
  }
)
```

## 5. Menangani CORS (Cross-Origin Resource Sharing)

Saat Vue (misal di port `localhost:5173`) mencoba memanggil API (misal port `localhost:8000`), browser akan memblokirnya karena dianggap tidak aman. Ini namanya masalah CORS.

**Solusinya ada di Backend, bukan di Frontend Vue!**
Jika menggunakan Laravel:
1. Buka file `config/cors.php`.
2. Pastikan `allowed_origins` memuat `['http://localhost:5173']` atau `['*']`.

Di Vue/Axios, kita bisa membantu dengan mengaktifkan pengaturan `withCredentials` jika Backend membutuhkan pengiriman Cookies/Session (seperti pada sistem Laravel Sanctum SPA Auth).

```js
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true // Penting untuk Sanctum Auth
})
```
