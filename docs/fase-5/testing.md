# Testing (Vitest & Vue Test Utils)

Menulis tes (Automated Testing) sering dilewati oleh pemula, namun SANGAT DIWAJIBKAN jika kamu bekerja di tim profesional atau membuat aplikasi yang masuk *Production*.

Kita tidak akan mengecek aplikasi dengan nge-klik manual sana-sini setiap kali kodenya kita ubah. Kita akan membuat skrip agar komputer mengeceknya untuk kita!

## 1. Alat yang Kita Gunakan
- **Vitest:** Framework testing utama (Test Runner). Kecepatannya secepat kilat dibanding Jest, karena sama-sama memakai *engine* Vite.
- **Vue Test Utils:** Library resmi dari Vue agar kita gampang pura-pura ngerender dan men-simulasi "klik" pada Komponen Vue tanpa butuh browser sungguhan.

*(Asumsi: Project `create-vue` kamu dibuat dengan menyertakan fitur Testing di awal setup).*

## 2. Struktur Dasar Test (Vitest)

File tes umumnya berekstensi `.spec.js` atau `.test.js` dan ditaruh disebelah file aslinya, atau di dalam folder `tests/`.

Konsep dasar:
- `describe()`: Kelompokkan sekumpulan tes.
- `it()` atau `test()`: Spesifik mendefinisikan satu skenario tes.
- `expect()`: Perintah untuk mengecek apakah "hasilnya benar / sesuai harapan".

```js
// tests/matematika.spec.js
import { describe, it, expect } from 'vitest'

// Uji coba murni logika javascript
describe('Kalkulator Sederhana', () => {
  it('Bisa melakukan penjumlahan', () => {
    // Persiapan (Arrange)
    const a = 1
    const b = 2
    
    // Aksi (Act)
    const hasil = a + b
    
    // Ekspektasi/Penegasan (Assert)
    expect(hasil).toBe(3) // "Aku harap hasilnya adalah 3"
  })
})
```

*Cara menjalankan Test di Terminal:*
```bash
npm run test:unit
```

## 3. Testing Komponen Vue (Vue Test Utils)

Bagian serunya adalah mengetes komponen! Kita import fungsi `mount` dari `@vue/test-utils`. `mount` akan "me-render sementara" komponen kita di dalam memori Node.js (JSDOM), agar kita bisa periksa isinya.

Anggap kita punya komponen:

```vue
<!-- components/TombolSuka.vue -->
<script setup>
import { ref } from 'vue'

const isLiked = ref(false)

const toggleLike = () => {
  isLiked.value = !isLiked.value
}
</script>

<template>
  <div class="card">
    <p>Status: <span id="status-teks">{{ isLiked ? 'Disukai' : 'Biasa' }}</span></p>
    <button @click="toggleLike">Klik Saya</button>
  </div>
</template>
```

Mari kita buat kode pengetesannya:

```js
// tests/TombolSuka.spec.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TombolSuka from '@/components/TombolSuka.vue'

describe('Komponen TombolSuka.vue', () => {

  it('Merender status awal dengan benar', () => {
    // 1. Mount (Render) Komponennya!
    const wrapper = mount(TombolSuka)

    // 2. Cari elemen dengan ID 'status-teks' lalu periksa teksnya
    expect(wrapper.find('#status-teks').text()).toBe('Biasa')
  })

  it('Status berubah menjadi "Disukai" saat tombol diklik', async () => {
    const wrapper = mount(TombolSuka)

    // 1. Cari elemen button, lalu simulasikan event KLIK!
    // HARUS PAKE AWAIT karena Vue butuh sekejap waktu merender ulang DOM-nya
    await wrapper.find('button').trigger('click')

    // 2. Ekspektasi setelah diklik, teksnya berubah
    expect(wrapper.find('#status-teks').text()).toBe('Disukai')
  })

})
```

## 4. Testing Props dan Emit

Bagaimana jika komponen menerima Props dan membuang Event(Emit)?

```js
// tests/CardProfil.spec.js
import { mount } from '@vue/test-utils'
import CardProfil from '@/components/CardProfil.vue'

it('Bisa menerima Props dan memancarkan (emit) Event Hapus', async () => {
  
  // 1. Mounting dengan PROPS bawaan (Pura-pura dikasih dari Parent)
  const wrapper = mount(CardProfil, {
    props: {
      namaUser: 'Agung',
      role: 'Admin'
    }
  })

  // Pastikan render namanya ada!
  expect(wrapper.text()).toContain('Nama: Agung')

  // 2. Klik tombol Hapus di dalam komponen
  await wrapper.find('button.btn-hapus').trigger('click')

  // 3. Periksa apakah komponen melempar custom event `hapusUser` !
  // wrapper.emitted() merekam semua custom event yang ditembakkan komponen.
  expect(wrapper.emitted()).toHaveProperty('hapusUser')

  // (Opsional) Cek payload eventnya, contoh kita minta dia meng-emit nama yang dihapus
  expect(wrapper.emitted().hapusUser[0]).toEqual(['Agung'])

})
```

## Kapan Saya Harus Menulis Tes?
Menulis testing memang bikin kerjaan di awal 2x lebih lama, tapi akan menyelamatkan nyawamu saat aplikasi mulai di-update 6 bulan ke depan.

- **Fungsi utilitas kalkulasi angka/uang**: Wajib di Test! (Unit Test).
- **Base Components (Input, Button, Modal, Table)**: Wajib di Test! Karena satu error di tombol, aplikasi akan rusak semua.
- **Halaman yang cuma baca API doang**: Boleh dilewat, atau Test pakai `Cypress / Playwright` (End to End Testing - tingkat paling tinggi yang mensimulasikan browser Google Chrome bohongan).
