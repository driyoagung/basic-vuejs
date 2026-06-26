<script setup>
import InputRupiahDemo from '../components/InputRupiahDemo.vue'
</script>

# Form Input Binding

`v-model` menciptakan **two-way data binding** antara input form dan data reactive — perubahan di input mengupdate data, perubahan di data mengupdate input.

## Text Input & Textarea

```vue
<script setup>
import { ref } from 'vue'
const nama = ref('')
const bio = ref('')
</script>

<template>
  <div>
    <label>Nama:</label>
    <input v-model="nama" placeholder="Ketik nama..." />
    <p>Halo, {{ nama || '...' }}!</p>
  </div>

  <div>
    <label>Bio:</label>
    <textarea v-model="bio" placeholder="Ceritakan tentang dirimu..." rows="3"></textarea>
    <p>{{ bio.length }} karakter</p>
  </div>
</template>
```

::: info v-model di balik layar
`v-model` pada input text sebenarnya adalah shorthand dari:
```vue
<input :value="nama" @input="nama = $event.target.value" />
```
:::

## Checkbox

```vue
<script setup>
import { ref } from 'vue'

// Single checkbox → boolean
const setuju = ref(false)

// Multiple checkbox → array
const hobi = ref([])
</script>

<template>
  <!-- Single: menghasilkan boolean -->
  <label>
    <input type="checkbox" v-model="setuju" />
    Saya setuju dengan syarat & ketentuan
  </label>
  <p>Status: {{ setuju ? '✅ Setuju' : '❌ Belum setuju' }}</p>

  <!-- Multiple: menghasilkan array of values -->
  <h3>Hobi:</h3>
  <label><input type="checkbox" v-model="hobi" value="coding" /> 💻 Coding</label>
  <label><input type="checkbox" v-model="hobi" value="gaming" /> 🎮 Gaming</label>
  <label><input type="checkbox" v-model="hobi" value="reading" /> 📚 Reading</label>
  <label><input type="checkbox" v-model="hobi" value="traveling" /> ✈️ Traveling</label>
  <p>Hobi dipilih: {{ hobi.join(', ') || 'Belum ada' }}</p>
</template>
```

## Radio Button

```vue
<script setup>
import { ref } from 'vue'
const gender = ref('')
const paket = ref('basic')
</script>

<template>
  <h3>Gender:</h3>
  <label><input type="radio" v-model="gender" value="pria" /> 👨 Pria</label>
  <label><input type="radio" v-model="gender" value="wanita" /> 👩 Wanita</label>
  <p>Gender: {{ gender || 'Belum dipilih' }}</p>

  <h3>Pilih Paket:</h3>
  <label><input type="radio" v-model="paket" value="basic" /> Basic (Gratis)</label>
  <label><input type="radio" v-model="paket" value="pro" /> Pro (Rp 99rb/bulan)</label>
  <label><input type="radio" v-model="paket" value="enterprise" /> Enterprise (Rp 299rb/bulan)</label>
  <p>Paket: {{ paket }}</p>
</template>
```

## Select / Dropdown

```vue
<script setup>
import { ref } from 'vue'
const kota = ref('')
const bahasa = ref([])

const kotaList = [
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'surabaya', label: 'Surabaya' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
]
</script>

<template>
  <!-- Single select -->
  <label>Kota:</label>
  <select v-model="kota">
    <option disabled value="">-- Pilih Kota --</option>
    <option v-for="k in kotaList" :key="k.value" :value="k.value">
      {{ k.label }}
    </option>
  </select>
  <p>Kota: {{ kota || 'Belum dipilih' }}</p>

  <!-- Multi select (tahan Ctrl/Cmd untuk pilih banyak) -->
  <label>Bahasa Pemrograman:</label>
  <select v-model="bahasa" multiple>
    <option>JavaScript</option>
    <option>Python</option>
    <option>PHP</option>
    <option>Go</option>
  </select>
  <p>Bahasa: {{ bahasa.join(', ') }}</p>
</template>
```

## Modifiers

```vue
<script setup>
import { ref } from 'vue'
const pesan = ref('')
const umur = ref(null)
const username = ref('')
</script>

<template>
  <!-- .lazy: update saat BLUR (bukan setiap keystroke) -->
  <input v-model.lazy="pesan" placeholder="Update saat blur" />

  <!-- .number: otomatis cast ke number -->
  <input v-model.number="umur" type="number" placeholder="Umur" />
  <p>Tipe: {{ typeof umur }}</p>

  <!-- .trim: otomatis hapus whitespace di awal/akhir -->
  <input v-model.trim="username" placeholder="Username (auto trim)" />
  <p>"{{ username }}" ({{ username.length }} karakter)</p>
</template>
```

| Modifier | Fungsi |
|----------|--------|
| `.lazy` | Sync saat `change` event (blur), bukan `input` |
| `.number` | Auto-cast value ke `Number` |
| `.trim` | Auto-trim whitespace |

## Latihan: Form Pendaftaran Lengkap

```vue
<script setup>
import { ref, computed } from 'vue'

const form = ref({
  nama: '',
  email: '',
  umur: null,
  gender: '',
  kota: '',
  hobi: [],
  bio: '',
  setuju: false,
})

const errors = computed(() => {
  const e = {}
  if (!form.value.nama) e.nama = 'Nama wajib diisi'
  if (!form.value.email) e.email = 'Email wajib diisi'
  else if (!/\S+@\S+\.\S+/.test(form.value.email)) e.email = 'Email tidak valid'
  if (!form.value.setuju) e.setuju = 'Harus menyetujui syarat'
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)
const submitted = ref(false)

const submit = () => {
  if (!isValid.value) return
  submitted.value = true
  console.log('Data:', JSON.stringify(form.value, null, 2))
}

const reset = () => {
  form.value = { nama: '', email: '', umur: null, gender: '', kota: '', hobi: [], bio: '', setuju: false }
  submitted.value = false
}
</script>

<template>
  <h2>📋 Form Pendaftaran</h2>
  
  <div v-if="!submitted">
    <div>
      <label>Nama: *</label>
      <input v-model.trim="form.nama" placeholder="Nama lengkap" />
      <small v-if="errors.nama" style="color:red">{{ errors.nama }}</small>
    </div>

    <div>
      <label>Email: *</label>
      <input v-model.trim="form.email" type="email" placeholder="email@example.com" />
      <small v-if="errors.email" style="color:red">{{ errors.email }}</small>
    </div>

    <div>
      <label>Umur:</label>
      <input v-model.number="form.umur" type="number" min="1" max="120" />
    </div>

    <div>
      <label>Gender:</label>
      <label><input type="radio" v-model="form.gender" value="pria" /> Pria</label>
      <label><input type="radio" v-model="form.gender" value="wanita" /> Wanita</label>
    </div>

    <div>
      <label>Kota:</label>
      <select v-model="form.kota">
        <option disabled value="">Pilih kota</option>
        <option>Jakarta</option>
        <option>Bandung</option>
        <option>Surabaya</option>
      </select>
    </div>

    <div>
      <label>Hobi:</label>
      <label><input type="checkbox" v-model="form.hobi" value="coding" /> Coding</label>
      <label><input type="checkbox" v-model="form.hobi" value="gaming" /> Gaming</label>
      <label><input type="checkbox" v-model="form.hobi" value="reading" /> Reading</label>
    </div>

    <div>
      <label>Bio:</label>
      <textarea v-model.trim="form.bio" rows="3" placeholder="Ceritakan..."></textarea>
    </div>

    <div>
      <label>
        <input type="checkbox" v-model="form.setuju" />
        Saya setuju dengan syarat & ketentuan *
      </label>
    </div>

    <button @click="submit" :disabled="!isValid">Daftar</button>
  </div>

  <div v-else>
    <h3>✅ Pendaftaran Berhasil!</h3>
    <pre>{{ JSON.stringify(form, null, 2) }}</pre>
    <button @click="reset">Daftar Lagi</button>
  </div>
</template>
```

## Skenario Nyata: Custom Input Masking (Rupiah)

Terkadang kita perlu memodifikasi bagaimana input bekerja, contohnya untuk format mata uang. Kita ingin user melihat teks `"Rp 10.000"` di layar, namun di dalam variabel state (data), kita hanya menyimpan angka murni `10000` (agar mudah disimpan ke database).

Di bawah ini adalah **Interactive Demo** yang dibuat menggunakan Writable Computed Property dengan setter (seperti yang kita pelajari di bab Reactivity). *Coba ketik angka di dalam kotak di bawah ini:*

<InputRupiahDemo />

Bagaimana cara membuatnya? Berikut adalah kodenya:

```vue
<script setup>
import { ref, computed } from 'vue'

const rawValue = ref(0)

const formattedRupiah = computed({
  get() {
    // Tampilkan dengan format Rp saat dibaca
    if (!rawValue.value) return ''
    return 'Rp ' + rawValue.value.toLocaleString('id-ID')
  },
  set(newValue) {
    // Bersihkan semua karakter non-digit saat user mengetik
    const numericString = newValue.replace(/[^\d]/g, '')
    rawValue.value = numericString ? parseInt(numericString, 10) : 0
  }
})
</script>

<template>
  <input v-model="formattedRupiah" type="text" placeholder="Ketik angka..." />
  <p>Data Asli: {{ rawValue }}</p>
</template>
```

## Rangkuman

| Input Type | v-model Type | Nilai |
|------------|-------------|-------|
| `text`, `textarea` | `string` | Isi teks |
| `checkbox` (single) | `boolean` | `true` / `false` |
| `checkbox` (multiple) | `array` | Array of values |
| `radio` | `string` | Value yang dipilih |
| `select` (single) | `string` | Value option |
| `select` (multiple) | `array` | Array of values |
| `number` + `.number` | `number` | Angka |
