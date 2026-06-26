# Component Lifecycle Hooks

Setiap komponen di Vue melewati siklus hidup (lifecycle) dari saat diciptakan hingga dihancurkan. Vue menyediakan "Hooks" (fungsi) yang memungkinkan kita menyelipkan kode sendiri pada setiap tahapan spesifik dari siklus hidup tersebut.

## Siklus Hidup Utama Component

Diagram sederhana proses lahir-batin sebuah komponen:

```
    Inisialisasi script setup()
               │
    onBeforeMount()   ── Sebelum komponen di-render ke DOM (Jarang Dipakai)
               │
    onMounted()       ── ✅ Komponen ADA DI DOM (Paling Sering Dipakai!)
               │
               ├──────────────────┐ (Data Berubah)
               │                  │
               │            onBeforeUpdate() ── Sebelum DOM di-update
               │                  │
               │              onUpdated()    ── Setelah DOM di-update
               │                  │
               │<─────────────────┘
               │
  onBeforeUnmount() ── Sebelum komponen dihancurkan (Penting untuk Cleanup!)
               │
    onUnmounted()     ── ✅ Komponen musnah dari DOM
```

## 1. `onMounted` (Paling Sering Digunakan)

Dijalankan saat komponen **telah dimasukkan ke dalam DOM**. Ini adalah tempat yang tepat untuk:
- Melakukan pemanggilan API (Fetch data dari Backend).
- Inisialisasi library third-party (seperti Chart.js atau Mapbox).
- Mengakses referensi DOM secara langsung (`template ref`).

```vue
<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(true)

// Dijalankan sekali saat komponen tampil
onMounted(async () => {
  console.log('Komponen telah dimount!')
  
  try {
    const response = await fetch('https://api.example.com/users')
    users.value = await response.json()
  } catch (err) {
    console.error('Gagal memuat data', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Memuat pengguna...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## 2. `onUnmounted` & `onBeforeUnmount` (Sangat Penting)

Dijalankan saat komponen dihancurkan (misalnya saat berpindah halaman via Router, atau `v-if` menjadi false). 

**Wajib** digunakan untuk membersihkan efek samping (side-effects) agar tidak terjadi *Memory Leak*, seperti:
- Menghentikan `setInterval` atau `setTimeout`.
- Menghapus global event listener (`window.addEventListener`).
- Membersihkan instance dari third-party library.

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const waktu = ref(new Date().toLocaleTimeString())
let timerId = null

onMounted(() => {
  // Pasang interval
  timerId = setInterval(() => {
    waktu.value = new Date().toLocaleTimeString()
    console.log('Tick tock...') // Ini akan jalan terus walau pindah halaman!
  }, 1000)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // BERSIHKAN! Matikan interval
  clearInterval(timerId)
  
  // BERSIHKAN! Matikan event listener global
  window.removeEventListener('resize', handleResize)
  console.log('Komponen dihancurkan, cleanup selesai.')
})

function handleResize() {
  console.log('Window di-resize')
}
</script>

<template>
  <div>
    <h3>Jam Digital</h3>
    <p>{{ waktu }}</p>
  </div>
</template>
```

::: danger Awas Memory Leak! (Kesalahan Paling Umum)
Jika kamu lupa melakukan cleanup di `onUnmounted`, efek samping tersebut akan terus berjalan di background meskipun user sudah pindah halaman. Jika user mondar-mandir buka-tutup halaman itu berulang kali, maka:
1. **Interval/Timer:** Akan tercipta puluhan interval yang berjalan bersamaan hingga browser lag.
2. **Event Listener:** Klik satu tombol akan men-trigger event listener 10x secara ganda.
3. **Third-Party Libraries:** Library seperti **Chart.js, Mapbox, atau Leaflet** memakan RAM yang sangat besar. Kamu **WAJIB** memanggil fungsi penghancur (misal: `chartInstance.destroy()` atau `map.remove()`) di dalam `onUnmounted` agar RAM tersebut dikembalikan ke browser.
:::

## 3. `onUpdated` & `onBeforeUpdate`

Dijalankan ketika ada **Data Reactive** yang berubah dan mengakibatkan re-render pada DOM.

```vue
<script setup>
import { ref, onUpdated } from 'vue'

const counter = ref(0)

onUpdated(() => {
  // Terpanggil setiap kali user klik tombol +1 karena 'counter' merubah DOM
  console.log('DOM telah di-update! Nilai baru:', counter.value)
})
</script>

<template>
  <button @click="counter++">Klik: {{ counter }}</button>
</template>
```

::: warning Perhatian
Jangan mengubah *data reactive* (state) di dalam fungsi `onUpdated`, karena akan menyebabkan perubahan DOM baru, yang memicu `onUpdated` lagi, yang merubah state lagi... menyebabkan *Infinite Loop*!
:::

## Daftar Lengkap Lifecycle Hooks Vue 3

| Hook | Kapan Dijalankan | Kegunaan Umum |
|------|------------------|---------------|
| `onBeforeMount()` | Tepat sebelum render pertama kali ke DOM. | Jarang dipakai. |
| `onMounted()` | Setelah komponen dirender penuh ke DOM. | ✅ **Fetch API**, Inisialisasi DOM/Library. |
| `onBeforeUpdate()` | State berubah, tepat sebelum DOM diupdate. | Mengakses state DOM lama sebelum diubah. |
| `onUpdated()` | Setelah DOM diupdate berdasarkan state baru. | Bereaksi terhadap selesai-nya update DOM. |
| `onBeforeUnmount()` | Tepat sebelum komponen dihapus. | ✅ Persiapan hapus. |
| `onUnmounted()` | Setelah komponen dihapus sepenuhnya. | ✅ **Cleanup** Timer/Event Listener. |
| `onErrorCaptured()` | Menangkap error dari komponen keturunan (child). | Membuat Error Boundary component. |
