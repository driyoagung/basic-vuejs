<script setup>
// [MATERI FASE 1: TEMPLATE SYNTAX]
// App.vue adalah root component. Di sini kita hanya render <RouterView />
// yang akan secara otomatis menampilkan komponen sesuai URL yang aktif.
// Tidak ada logika di sini — semua dikelola oleh layout dan view masing-masing.
import { RouterView } from 'vue-router'
</script>

<template>
  <!--
    [MATERI FASE 3: VUE ROUTER]
    <RouterView /> adalah placeholder yang akan diganti oleh Vue Router
    dengan komponen yang sesuai berdasarkan route yang aktif.
    Ini adalah entry point utama tampilan aplikasi.
  -->
  <RouterView />
</template>
