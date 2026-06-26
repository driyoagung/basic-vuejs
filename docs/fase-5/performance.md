# Performa & Optimasi (Performance)

Aplikasi Vue secara bawaan sudah sangat cepat karena sistem reactivity yang efisien. Namun, pada aplikasi yang besar dan kompleks, kita tetap perlu melakukan optimasi (tuning) agar aplikasi tidak memakan banyak memori (RAM) dan tidak lag saat dirender.

## 1. Async Component (Lazy Loading)

Pernah merasa aplikasi loadingnya lama sekali di awal (Initial Load)? Itu terjadi karena seluruh komponen Javascript di-download sekaligus oleh browser di halaman depan.

Solusinya adalah **Lazy Loading**. Kita hanya men-download file komponen ketika komponen tersebut *benar-benar dibutuhkan* untuk tampil di layar.

### Skenario: Modal Besar / Berat
Jika kamu punya komponen Modal yang berisi Form Kompleks atau Chart Grafik yang berat, jangan load di awal.

```vue
<script setup>
import { ref, defineAsyncComponent } from 'vue'

// ❌ CARA NORMAL (Sync) - Download langsung meski modal belum dibuka
// import ChartStatistikBerat from './ChartStatistikBerat.vue'

// ✅ CARA OPTIMASI (Async) - Download HANYA SAAT `bukaModal = true`
const ChartStatistikBerat = defineAsyncComponent(() => 
  import('./ChartStatistikBerat.vue')
)

const bukaModal = ref(false)
</script>

<template>
  <button @click="bukaModal = true">Lihat Statistik</button>
  
  <!-- Komponen ini tidak didownload sampai button diklik! -->
  <ChartStatistikBerat v-if="bukaModal" />
</template>
```

### Lazy Loading Rute (Vue Router)
Teknik yang sama kita terapkan untuk Vue Router. Kita menyebutnya *Code Splitting* di tingkat rute.

```js
// router.js
const routes = [
  // ❌ JANGAN import() di atas file
  // { path: '/admin', component: AdminView },

  // ✅ SELALU gunakan Dynamic Import untuk Rute Halaman
  { 
    path: '/admin', 
    component: () => import('@/views/AdminView.vue') 
  }
]
```

## 2. Direktif `v-memo` (Mencegah Render Ulang Loop)

Pernah merender daftar (list) dengan data 10.000 baris? Jika salah satu item berubah, Vue mungkin mengecek 10.000 baris tersebut untuk mencari perubahannya. Ini bikin performa drop drastis.

Direktif **`v-memo`** memaksa Vue untuk me-skip kalkulasi ulang pada item tersebut JIKA nilai acuan (dependency) nya tidak ada yang berubah. Ini persis seperti `React.memo` di dunia React.

```vue
<template>
  <div v-for="item in daftar10000Item" :key="item.id">
    
    <!-- 
      Vue, JANGAN RE-RENDER div ini KECUALI item.nama atau item.harga 
      benar-benar berubah nilainya! (Meskipun item.stok berubah, hiraukan!)
    -->
    <div v-memo="[item.nama, item.harga]">
      <h3>{{ item.nama }}</h3>
      <p>Harga Fix: Rp {{ item.harga }}</p>
      
      <!-- Operasi berat (Komponen yang lambat dirender) -->
      <KalkulasiBerat />
    </div>

  </div>
</template>
```

## 3. Hindari Reactivity Berlebih dengan `shallowRef`

`ref()` membuat state menjadi *Deeply Reactive*. Jika kamu menaruh Object bersarang atau Array berisi 100.000 object ke dalam `ref()`, Vue akan membungkus setiap properti kecil dari object tersebut agar bisa dipantau perubahannya. Ini memakan CPU dan Memori yang amat besar.

Jika kamu **hanya perlu mengganti / menimpa SELURUH DATA sekaligus** (tidak merubah properti objectnya satu per satu), gunakan `shallowRef`.

```vue
<script setup>
import { shallowRef, ref } from 'vue'

// ❌ Buruk untuk data besar (API besar). 
// Vue akan melacak ribuan properti di dalamnya.
const dataPeta = ref([]) 

// ✅ Baik untuk data besar statis! 
// Vue HANYA bereaksi jika variable `dataPeta` DITIMPA sepenuhnya.
const dataPeta = shallowRef([]) 

const ambilDataGeoJSON = async () => {
  const result = await fetchBigData()
  
  // Ini valid! DOM akan update karena kita MENIMPA seluruh isinya.
  dataPeta.value = result.data 
}

const mutasiSalah = () => {
  // ❌ DOM TIDAK AKAN UPDATE karena kita hanya merubah properti kecil.
  // shallowRef tidak melacak ini!
  dataPeta.value[0].nama = 'Lokasi Baru' 
}
</script>
```
*Skenario terbaik penggunaan `shallowRef`:* Chart.js data, Mapbox GeoJSON, Third-party SDK instances, Daftar Log/History.

## 4. Mempertahankan State dengan `<KeepAlive>`

Saat kamu menggunakan pergantian komponen dinamis (seperti `<component :is="...">` atau Vue Router `<router-view>`), komponen lama akan **dihancurkan (unmounted)** dari memori saat user pindah, dan diciptakan ulang saat user kembali.

Ini buruk untuk performa jika komponen tersebut memakan waktu lama untuk dimuat, atau jika kamu ingin mempertahankan input user (misal: user sedang mengisi form panjang di tab A, lalu pindah sebentar ke tab B).

Gunakan `<KeepAlive>` untuk menyimpan komponen di dalam memori (di-cache) alih-alih dihancurkan.

```vue
<!-- Contoh pada Vue Router -->
<router-view v-slot="{ Component }">
  <!-- Hanya komponen Dashboard dan Form yang di-cache -->
  <keep-alive include="Dashboard,Form">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

*Catatan: Komponen yang dibungkus KeepAlive akan memiliki Lifecycle Hook baru yaitu `onActivated` dan `onDeactivated` (karena `onMounted` dan `onUnmounted` hanya dipanggil sekali di awal).*

## 5. `v-once` (Render Satu Kali Seumur Hidup)

Jika kamu memiliki tulisan panjang atau komponen yang isinya dijamin 100% **TIDAK AKAN PERNAH BERUBAH** setelah render pertama selesai, gunakan `v-once`. Vue akan menandainya sebagai HTML statis selamanya, menghemat waktu cek diff saat ada re-render komponen induk.

```vue
<template>
  <!-- Bagian Header Profil yang datanya statis ambil dari Session Storage -->
  <div v-once class="header-statis">
    <h1>Selamat datang kembali, {{ username }}!</h1>
    <p>Ini adalah aplikasi versi 2.0</p>
  </div>
</template>
```

## Kesimpulan Optimasi
1. Jika load app awal lambat -> Pakai `defineAsyncComponent` & Route Code Splitting.
2. Jika ada Array raksasa (5000+ item) lambat dirender -> Pakai `v-memo`.
3. Jika State nyimpen Object JSON dari API super besar & kompleks -> Pakai `shallowRef`.
4. Jika bagian halaman pasti tidak akan merubah wujud selamanya -> Pakai `v-once`.
