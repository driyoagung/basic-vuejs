# Keamanan SPA (Vue.js)

Single Page Applications (SPA) seperti Vue memiliki tantangan keamanan yang berbeda dibanding website tradisional (PHP/HTML render server). Karena sebagian besar logika dan routing berjalan di sisi client (browser), hacker memiliki akses penuh untuk membaca kode Javascript-mu.

Berikut adalah panduan utama menjaga keamanan aplikasi Vue.js.

## 1. Hindari XSS dengan tidak memakai `v-html`

**Cross-Site Scripting (XSS)** adalah serangan di mana peretas menyuntikkan script berbahaya ke dalam halaman webmu. Di Vue, interpolasi text biasa `{{ }}` sudah **100% aman** dari XSS karena Vue otomatis melakukan *escaping* pada karakter HTML.

```vue
<script setup>
import { ref } from 'vue'

// Teks ini disuntikkan oleh hacker dari input komentar
const komentarHacker = ref('<script>alert("Uangmu dicuri!")</script>')
</script>

<template>
  <!-- AMAN ✅ (Akan dirender sebagai teks biasa) -->
  <div>{{ komentarHacker }}</div>
  
  <!-- BAHAYA ❌ (Script hacker akan benar-benar dieksekusi browser!) -->
  <div v-html="komentarHacker"></div>
</template>
```

**Kapan boleh pakai `v-html`?**
Hanya gunakan `v-html` jika kamu **benar-benar percaya** pada sumber datanya (misalnya artikel blog yang diketik oleh admin websitemu sendiri). Jangan pernah gunakan `v-html` pada inputan publik (komentar, nama user, dll).

Jika kamu terpaksa merender HTML dari sumber yang kurang terpercaya, wajib bersihkan dulu isinya menggunakan library **DOMPurify**.

```js
import DOMPurify from 'dompurify'
const komentarAman = DOMPurify.sanitize(komentarHacker.value)
```

## 2. Lindungi Akses Halaman (Global Guard)

Seperti yang dipelajari di bab Vue Router, halaman admin wajib diproteksi. Namun ingat: **proteksi Router di Vue HANYA proteksi UX, bukan proteksi keamanan hakiki**.

Kenapa? Karena hacker yang pintar bisa membuka tab *Developer Tools* dan mematikan script Javascript Vue Router untuk menembus halaman `/admin`.

**Lalu apa gunanya Router Guard?**
Gunanya agar *user biasa* tidak kesasar.
**Keamanan sebenarnya HARUS ada di Backend API.** 
Meskipun hacker berhasil menembus UI `/admin` di Vue, jika dia mencoba mengambil data dari Backend API tanpa membawa Token yang sah, Backend tetap akan menolaknya dengan error 401/403.

## 3. Perlindungan CSRF pada Axios

**Cross-Site Request Forgery (CSRF)** adalah serangan di mana web jahat memaksa browsermu (yang sedang login) untuk mengirim request palsu ke API tanpa sepengetahuanmu.

Jika kamu menggunakan **Token (Bearer)**, kamu kebal dari CSRF. 
Namun jika kamu menggunakan **Cookie-Based Authentication** (seperti SPA Auth Laravel Sanctum), kamu wajib mengatur proteksi CSRF.

Vue (melalui Axios) sudah bisa otomatis membaca CSRF token dari Cookie dan menyisipkannya ke Header. 

Di `api.js`:
```js
const api = axios.create({
  baseURL: 'http://localhost:8000',
  // Sangat krusial untuk mencegah CSRF saat pakai Sanctum Cookie!
  withCredentials: true, 
  withXSRFToken: true // Axios versi baru 1.x butuh ini diaktifkan
})
```

## 4. Jangan Simpan Rahasia di Vue!

Apapun yang kamu tulis di file Vue (kode, string, apalagi `.env` yang diawali `VITE_`), akan bisa dibaca oleh siapapun yang membongkar file Javascript di folder `dist/` mu.

**❌ JANGAN PERNAH MENYIMPAN INI DI VUE:**
- Kunci Rahasia API (seperti Midtrans Server Key, Stripe Secret Key)
- Password Database
- Logika bisnis yang sangat rahasia (seperti algoritma kemenangan game/judi)

**✅ BAGAIMANA CARANYA?**
Pindahkan operasi tersebut ke Backend (Laravel). Vue mengirim request *"Hai Laravel, tolong proses pembayaran ini"*. Laravel yang memiliki kunci rahasianya akan memprosesnya ke Midtrans, lalu Laravel membalas *"Pembayaran sukses"* ke Vue.
