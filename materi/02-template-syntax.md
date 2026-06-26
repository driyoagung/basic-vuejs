# Bab 2: Template Syntax & Data Binding

## 📖 Apa itu Template Syntax?

Template syntax adalah cara Vue.js menghubungkan **data** di JavaScript dengan **tampilan** di HTML. Vue menggunakan sintaks berbasis HTML yang memungkinkan kamu mengikat (bind) DOM ke data instance secara deklaratif.

---

## 1️⃣ Text Interpolation (Mustache Syntax)

Cara paling dasar menampilkan data:

```vue
<script setup>
const pesan = 'Halo Vue.js!'
const angka = 42
</script>

<template>
  <h1>{{ pesan }}</h1>
  <p>Jawaban: {{ angka }}</p>
  
  <!-- Bisa juga expression JavaScript -->
  <p>{{ pesan.toUpperCase() }}</p>
  <p>{{ angka * 2 }}</p>
  <p>{{ angka > 40 ? 'Besar' : 'Kecil' }}</p>
</template>
```

> ⚠️ **Catatan:** Hanya **expression** yang diperbolehkan, bukan **statement**.
> - ✅ <code v-pre>{{ angka + 1 }}</code> — expression
> - ❌ <code v-pre>{{ if (true) { return 'ya' } }}</code> — statement (tidak boleh!)

---

## 2️⃣ Raw HTML — `v-html`

Secara default, <code v-pre>{{ }}</code> akan menampilkan teks biasa (escape HTML). Untuk merender HTML asli:

```vue
<script setup>
const htmlMentah = '<span style="color: red;">Teks merah!</span>'
</script>

<template>
  <!-- Ini akan menampilkan tag HTML sebagai teks -->
  <p>{{ htmlMentah }}</p>
  
  <!-- Ini akan merender HTML -->
  <p v-html="htmlMentah"></p>
</template>
```

> ⚠️ **Peringatan:** Jangan gunakan `v-html` untuk data dari user input — rawan **XSS attack**!

---

## 3️⃣ Attribute Binding — `v-bind`

Untuk mengikat data ke atribut HTML, gunakan directive `v-bind`:

```vue
<script setup>
const idDinamis = 'judul-utama'
const urlGambar = 'https://vuejs.org/images/logo.png'
const isDisabled = true
</script>

<template>
  <!-- v-bind:atribut="data" -->
  <h1 v-bind:id="idDinamis">Judul</h1>
  <img v-bind:src="urlGambar" alt="Vue Logo" />
  <button v-bind:disabled="isDisabled">Klik Saya</button>
  
  <!-- ✨ Shorthand: gunakan titik dua (:) saja -->
  <h1 :id="idDinamis">Judul</h1>
  <img :src="urlGambar" alt="Vue Logo" />
  <button :disabled="isDisabled">Klik Saya</button>
</template>
```

### Boolean Attributes

Untuk atribut boolean (`disabled`, `hidden`, `required`, dll):

```vue
<script setup>
import { ref } from 'vue'
const bisaDiklik = ref(true)
</script>

<template>
  <!-- Jika bisaDiklik false → atribut disabled ditambahkan -->
  <button :disabled="!bisaDiklik">Kirim</button>
</template>
```

### Multiple Attributes Sekaligus

```vue
<script setup>
const atributInput = {
  id: 'nama-field',
  type: 'text',
  placeholder: 'Masukkan nama...',
  class: 'input-field'
}
</script>

<template>
  <!-- Bind semua atribut dari object -->
  <input v-bind="atributInput" />
</template>
```

---

## 4️⃣ Directive

Directive adalah atribut khusus dengan prefix `v-`. Berikut yang sudah kita pelajari:

| Directive | Fungsi | Contoh |
|-----------|--------|--------|
| `v-html` | Render HTML mentah | `<p v-html="html"></p>` |
| `v-bind` / `:` | Bind atribut | `<img :src="url" />` |
| `v-on` / `@` | Event listener | `<button @click="aksi">` |
| `v-model` | Two-way binding | `<input v-model="nama" />` |
| `v-if` | Conditional render | `<p v-if="tampil">Halo</p>` |
| `v-for` | Loop / iterasi | `<li v-for="item in items">` |
| `v-show` | Toggle visibility | `<p v-show="terlihat">` |

> Kita akan membahas masing-masing directive secara mendalam di bab-bab selanjutnya.

---

## 5️⃣ Template Refs — `ref` di Template

Untuk mengakses elemen DOM secara langsung:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  // Fokuskan input saat komponen dimount
  inputRef.value.focus()
})
</script>

<template>
  <input ref="inputRef" placeholder="Auto focus!" />
</template>
```

---

## 🧪 Latihan

### Latihan 1: Kartu Profil

Buat komponen `ProfilCard.vue` yang menampilkan data profil:

```vue
<script setup>
import { ref } from 'vue'

const profil = ref({
  nama: 'Agung',
  pekerjaan: 'Web Developer',
  bio: 'Seorang developer yang sedang <strong>belajar Vue.js</strong>',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agung',
  website: 'https://example.com',
  aktif: true
})
</script>

<template>
  <div class="card">
    <img :src="profil.avatar" :alt="profil.nama" width="100" />
    <h2>{{ profil.nama }}</h2>
    <p>{{ profil.pekerjaan }}</p>
    
    <!-- Gunakan v-html untuk bio yang mengandung HTML -->
    <p v-html="profil.bio"></p>
    
    <!-- Bind href -->
    <a :href="profil.website" target="_blank">Website</a>
    
    <!-- Boolean attribute -->
    <span :class="profil.aktif ? 'badge-aktif' : 'badge-nonaktif'">
      {{ profil.aktif ? '🟢 Aktif' : '🔴 Nonaktif' }}
    </span>
  </div>
</template>

<style scoped>
.card {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  max-width: 300px;
  text-align: center;
}
.badge-aktif {
  color: #16a34a;
  font-weight: bold;
}
.badge-nonaktif {
  color: #dc2626;
  font-weight: bold;
}
</style>
```

### Latihan 2: Dynamic Attributes

Buat tombol yang atributnya berubah berdasarkan data:

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)

const mulaiProses = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <button 
    :disabled="loading" 
    :class="loading ? 'btn-loading' : 'btn-normal'"
    @click="mulaiProses"
  >
    {{ loading ? '⏳ Memproses...' : '🚀 Mulai' }}
  </button>
</template>
```

---

## 📝 Rangkuman

| Konsep | Syntax | Contoh |
|--------|--------|--------|
| Text Interpolation | <code v-pre>{{ data }}</code> | <code v-pre>{{ nama }}</code> |
| Raw HTML | `v-html` | `<p v-html="html"></p>` |
| Attribute Binding | `v-bind:attr` / `:attr` | `<img :src="url" />` |
| Multiple Bind | `v-bind="object"` | `<input v-bind="attrs" />` |
| Template Ref | `ref="namaRef"` | `<input ref="inputRef" />` |

---

**Sebelumnya:** [← Bab 1 — Pengenalan Vue.js](./01-pengenalan-vue.md)  
**Selanjutnya:** [Bab 3 — Reactivity & Ref/Reactive →](./03-reactivity.md)
