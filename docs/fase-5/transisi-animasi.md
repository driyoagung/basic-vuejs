# Transisi & Animasi

Di Vue, menambahkan animasi ketika sebuah elemen **muncul (masuk)** atau **hilang (keluar)** dari DOM sangatlah mudah. Animasi ini sangat krusial untuk membuat UI yang terasa "hidup" dan tidak kaku.

Vue menyediakan dua komponen *Built-in* (bawaan) khusus untuk ini: `<Transition>` dan `<TransitionGroup>`.

## 1. Komponen `<Transition>` Dasar

Komponen `<Transition>` hanya bisa membungkus **Satu Elemen Akar** (Single Root Element) yang dikontrol kemunculannya menggunakan `v-if`, `v-show`, atau component routing yang berubah.

```vue
<script setup>
import { ref } from 'vue'
const isTampil = ref(false)
</script>

<template>
  <button @click="isTampil = !isTampil">Toggle Modal</button>

  <!-- Bungkus elemen yang mau dianimasikan dengan Transition -->
  <!-- Beri nama (name) agar CSS-nya unik. Misal: name="fade" -->
  <Transition name="fade">
    
    <div v-if="isTampil" class="modal-box">
      <h2>Halo, ini Modal!</h2>
      <p>Saya muncul dengan animasi yang smooth.</p>
    </div>
    
  </Transition>
</template>

<style>
/* 
  Vue secara otomatis akan menambah-hapus class CSS di bawah ini 
  berdasarkan nama transition ("fade").
*/

/* 1. Kondisi elemen saat BARU AKAN MASUK (Start) dan SELESAI KELUAR (End) */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 2. Kondisi durasi dan tipe pergerakan animasi (Active) */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

/* 
  (Opsional)
  .fade-enter-to, .fade-leave-from tidak perlu ditulis 
  karena browser sudah otomatis tau (kondisi normal opacity 1).
*/
</style>
```

## 2. Enam Class Transisi Vue

Saat kamu menggunakan `<Transition name="slide">`, Vue akan menginjeksi 6 class ini ke dalam elemenmu secara otomatis pada waktu yang tepat:

1. **`slide-enter-from`**: Tepat sebelum elemen masuk. (Titik awal animasi masuk).
2. **`slide-enter-active`**: Diterapkan selama animasi masuk berlangsung. (Tempat menaruh `transition: opacity 0.5s`).
3. **`slide-enter-to`**: Titik akhir animasi masuk.

4. **`slide-leave-from`**: Tepat sebelum elemen hilang.
5. **`slide-leave-active`**: Diterapkan selama animasi hilang berlangsung.
6. **`slide-leave-to`**: Titik akhir animasi keluar.

## 3. Animasi pada List (Daftar Banyak) dengan `<TransitionGroup>`

Bagaimana jika kita punya sebuah tabel atau daftar array `v-for`? Jika ada data baru di push, kita ingin baris tersebut masuk dengan elegan. Jika ada data dihapus, baris tersebut mengecil dan hilang.

Gunakan `<TransitionGroup>`.

```vue
<script setup>
import { ref } from 'vue'

const items = ref([1, 2, 3, 4, 5])
let nextNum = 6

const tambah = () => {
  // Masukkan angka ke posisi acak di tengah-tengah
  const indexBebas = Math.floor(Math.random() * items.value.length)
  items.value.splice(indexBebas, 0, nextNum++)
}

const hapus = (index) => {
  items.value.splice(index, 1)
}
</script>

<template>
  <button @click="tambah">Tambah Angka Acak</button>

  <!-- Gunakan tag="ul" agar pembungkusnya dirender menjadi elemen <ul> -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="(item, index) in items" :key="item" class="list-item">
      {{ item }} 
      <button @click="hapus(index)">X</button>
    </li>
  </TransitionGroup>
</template>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
  background: #e2e8f0;
  padding: 5px 10px;
  border-radius: 4px;
}

/* Animasi Masuk dan Keluar */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 
  FITUR SPESIAL TransitionGroup: v-move
  Class ini mengatur animasi saat elemen LAIN bergeser untuk memberi 
  ruang bagi elemen baru / menutupi ruang elemen yang dihapus. 
*/
.list-move {
  transition: transform 0.5s ease;
}

/* 
  Trik agar elemen yang mau hilang tidak mengganggu animasi geser elemen lain 
*/
.list-leave-active {
  position: absolute;
}
</style>
```

## 4. Animasi pada Perpindahan Route (Halaman)

Untuk membuat transisi *fade-in* saat berpindah antar halaman di Vue Router, kita bisa membungkus `<component>` di dalam `<router-view>` menggunakan sintaks slot:

```vue
<!-- App.vue (Layout Utama) -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </nav>

  <!-- PENTING: Sintaks khusus Vue Router v4 untuk Transisi -->
  <router-view v-slot="{ Component }">
    <transition name="halaman" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
/* Mode "out-in" memastikan halaman lama KELUAR dulu, baru halaman baru MASUK */
.halaman-enter-active,
.halaman-leave-active {
  transition: opacity 0.3s ease;
}

.halaman-enter-from,
.halaman-leave-to {
  opacity: 0;
}
</style>
```
