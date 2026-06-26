# Template Syntax & Data Binding

Template syntax adalah cara Vue.js menghubungkan **data** di JavaScript dengan **tampilan** di HTML. Vue menggunakan sintaks berbasis HTML yang memungkinkan kamu mengikat DOM ke data secara deklaratif.

## Text Interpolation (Mustache)

Cara paling dasar menampilkan data menggunakan sintaks double curly braces <code v-pre>{{ }}</code>:

```vue
<script setup>
const pesan = 'Halo Vue.js!'
const angka = 42
</script>

<template>
  <h1>{{ pesan }}</h1>
  <p>Jawaban: {{ angka }}</p>
  
  <!-- JavaScript expression juga bisa -->
  <p>{{ pesan.toUpperCase() }}</p>
  <p>{{ angka * 2 }}</p>
  <p>{{ angka > 40 ? 'Besar' : 'Kecil' }}</p>
  <p>{{ pesan.split('').reverse().join('') }}</p>
</template>
```

::: warning Expression vs Statement
Hanya **expression** (menghasilkan nilai) yang diperbolehkan di dalam <code v-pre>{{ }}</code>, bukan **statement** (perintah).

```vue
<!-- ✅ Expression — menghasilkan nilai -->
{{ angka + 1 }}
{{ ok ? 'Ya' : 'Tidak' }}
{{ pesan.split(' ').join('-') }}

<!-- ❌ Statement — TIDAK boleh -->
{{ var x = 1 }}
{{ if (ok) { return 'ya' } }}
{{ for (let i=0; i<5; i++) {} }}
```
:::

## Raw HTML — `v-html`

Secara default, <code v-pre>{{ }}</code> menampilkan teks mentah (HTML di-escape). Untuk merender HTML asli, gunakan directive `v-html`:

```vue
<script setup>
const htmlMentah = '<span style="color: red; font-weight: bold;">Teks merah tebal!</span>'
const teksMarkdown = '<h3>Judul</h3><p>Paragraf dengan <em>italic</em> dan <strong>bold</strong>.</p>'
</script>

<template>
  <!-- Ini tampil sebagai teks biasa (HTML di-escape) -->
  <p>Escaped: {{ htmlMentah }}</p>
  
  <!-- Ini merender HTML sesungguhnya -->
  <p>Rendered:</p>
  <div v-html="htmlMentah"></div>
  
  <div v-html="teksMarkdown"></div>
</template>
```

::: danger Peringatan Keamanan
**Jangan pernah** gunakan `v-html` untuk data yang berasal dari user input — rawan serangan **XSS (Cross-Site Scripting)**! Hanya gunakan untuk konten yang kamu kontrol sepenuhnya (misalnya dari CMS yang trusted).
:::

## Attribute Binding — `v-bind`

Untuk mengikat data ke atribut HTML, gunakan directive `v-bind`:

```vue
<script setup>
import { ref } from 'vue'

const idDinamis = 'judul-utama'
const urlGambar = 'https://vuejs.org/images/logo.png'
const isDisabled = ref(true)
const urlLink = 'https://vuejs.org'
</script>

<template>
  <!-- Syntax lengkap: v-bind:atribut="data" -->
  <h1 v-bind:id="idDinamis">Judul</h1>
  <img v-bind:src="urlGambar" alt="Vue Logo" />
  <button v-bind:disabled="isDisabled">Klik Saya</button>
  
  <!-- ✨ Shorthand (rekomendasi): gunakan titik dua (:) -->
  <h1 :id="idDinamis">Judul</h1>
  <img :src="urlGambar" alt="Vue Logo" />
  <a :href="urlLink" target="_blank">Vue.js</a>
  <button :disabled="isDisabled">Klik Saya</button>
</template>
```

::: tip Shorthand
`v-bind:src="url"` bisa disingkat menjadi `:src="url"`. Selalu gunakan shorthand untuk kode yang lebih bersih.
:::

### Boolean Attributes

Untuk atribut boolean seperti `disabled`, `hidden`, `required`, `readonly`:

```vue
<script setup>
import { ref } from 'vue'
const bisaDiklik = ref(true)
const wajibIsi = ref(true)
</script>

<template>
  <!-- Jika bisaDiklik false → atribut disabled DITAMBAHKAN -->
  <button :disabled="!bisaDiklik">Kirim</button>
  
  <!-- Jika wajibIsi true → atribut required DITAMBAHKAN -->
  <input :required="wajibIsi" placeholder="Wajib diisi" />
</template>
```

Aturan: jika nilainya `true` → atribut ditambahkan. Jika `false`, `null`, atau `undefined` → atribut dihapus dari elemen.

### Binding Multiple Attributes Sekaligus

Kamu bisa bind semua atribut dari sebuah object sekaligus:

```vue
<script setup>
const atributInput = {
  id: 'nama-field',
  type: 'text',
  placeholder: 'Masukkan nama...',
  class: 'input-field',
  'data-testid': 'nama-input'
}
</script>

<template>
  <!-- Semua atribut dari object di-bind sekaligus -->
  <input v-bind="atributInput" />
  
  <!-- Hasilnya sama dengan: -->
  <input 
    id="nama-field" 
    type="text" 
    placeholder="Masukkan nama..."
    class="input-field"
    data-testid="nama-input"
  />
</template>
```

## Daftar Directive

Directive adalah atribut khusus Vue dengan prefix `v-`. Berikut daftar directive yang akan kita pelajari:

| Directive | Shorthand | Fungsi | Contoh |
|-----------|-----------|--------|--------|
| `v-bind` | `:` | Bind atribut | `<img :src="url" />` |
| `v-on` | `@` | Event listener | `<button @click="fn">` |
| `v-model` | — | Two-way binding | `<input v-model="nama" />` |
| `v-if` | — | Conditional render | `<p v-if="tampil">` |
| `v-else` | — | Else branch | `<p v-else>` |
| `v-else-if` | — | Else-if branch | `<p v-else-if="cond">` |
| `v-show` | — | Toggle display CSS | `<p v-show="tampil">` |
| `v-for` | — | Loop / iterasi | `<li v-for="item in items">` |
| `v-html` | — | Render raw HTML | `<div v-html="html">` |
| `v-text` | — | Set text content | `<p v-text="teks">` |
| `v-once` | — | Render sekali saja | <code v-pre>&lt;p v-once&gt;{{ statis }}</code> |
| `v-memo` | — | Cache conditional | `<div v-memo="[dep]">` |
| `v-slot` | `#` | Slot template | `<template #header>` |

## Template Refs

Untuk mengakses elemen DOM secara langsung (seperti `document.querySelector`), gunakan **template ref**:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// Buat ref dengan nama yang sama dengan atribut ref di template
const inputRef = ref(null)

onMounted(() => {
  // Elemen DOM sudah tersedia setelah mounted
  inputRef.value.focus()          // Auto-focus input
  console.log(inputRef.value)     // <input> element
})
</script>

<template>
  <!-- Hubungkan dengan atribut ref -->
  <input ref="inputRef" placeholder="Auto focus saat halaman dimuat!" />
</template>
```

::: info Kapan Pakai Template Ref?
Gunakan template ref hanya ketika kamu **benar-benar perlu akses DOM langsung** — misalnya untuk focus, scroll, integrasi library pihak ketiga, atau pengukuran dimensi. Untuk kebanyakan kasus, gunakan data binding dan directive Vue.
:::

## Latihan

### Latihan 1: Kartu Profil Dinamis

Buat komponen yang menampilkan kartu profil dengan data binding:

```vue
<!-- src/components/ProfilCard.vue -->
<script setup>
import { ref } from 'vue'

const profil = ref({
  nama: 'Agung',
  pekerjaan: 'Web Developer',
  bio: 'Seorang developer yang sedang <strong>belajar Vue.js</strong> dengan semangat!',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agung',
  website: 'https://example.com',
  aktif: true,
})
</script>

<template>
  <div class="card">
    <!-- Bind src dan alt -->
    <img :src="profil.avatar" :alt="profil.nama" width="100" />
    
    <!-- Text interpolation -->
    <h2>{{ profil.nama }}</h2>
    <p>{{ profil.pekerjaan }}</p>
    
    <!-- Raw HTML untuk bio -->
    <div v-html="profil.bio"></div>
    
    <!-- Dynamic href -->
    <a :href="profil.website" target="_blank">🔗 Website</a>
    
    <!-- Conditional class/text -->
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
  max-width: 320px;
  text-align: center;
  font-family: sans-serif;
}
.badge-aktif { color: #16a34a; font-weight: bold; }
.badge-nonaktif { color: #dc2626; font-weight: bold; }
</style>
```

### Latihan 2: Dynamic Button

Buat tombol yang berubah tampilan berdasarkan state:

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
    :title="loading ? 'Sedang memproses...' : 'Klik untuk mulai'"
    @click="mulaiProses"
  >
    {{ loading ? '⏳ Memproses...' : '🚀 Mulai Proses' }}
  </button>
</template>

<style scoped>
.btn-normal {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}
.btn-normal:hover { background: #2563eb; }
.btn-loading {
  padding: 12px 24px;
  background: #94a3b8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: not-allowed;
  font-size: 16px;
}
</style>
```

## Rangkuman

| Konsep | Syntax | Keterangan |
|--------|--------|------------|
| Text Interpolation | <code v-pre>{{ data }}</code> | Menampilkan data sebagai teks |
| Raw HTML | `v-html="data"` | Merender HTML (hati-hati XSS!) |
| Attribute Binding | `:attr="data"` | Bind data ke atribut HTML |
| Multiple Bind | `v-bind="object"` | Bind semua atribut dari object |
| Boolean Attr | `:disabled="bool"` | Tambah/hapus atribut berdasarkan boolean |
| Template Ref | `ref="namaRef"` | Akses elemen DOM langsung |
