# Bab 6: Form Input Binding (v-model)

## 📖 Two-Way Data Binding

`v-model` menghubungkan input form dengan data secara **dua arah**: data → tampilan, tampilan → data.

---

## 1️⃣ Text Input & Textarea

```vue
<script setup>
import { ref } from 'vue'
const nama = ref('')
const bio = ref('')
</script>

<template>
  <input v-model="nama" placeholder="Nama" />
  <p>Halo, {{ nama || '...' }}!</p>

  <textarea v-model="bio" placeholder="Bio"></textarea>
  <p>{{ bio }}</p>
</template>
```

---

## 2️⃣ Checkbox

```vue
<script setup>
import { ref } from 'vue'

// Single checkbox → boolean
const setuju = ref(false)

// Multiple checkbox → array
const hobi = ref([])
</script>

<template>
  <label>
    <input type="checkbox" v-model="setuju" /> Saya setuju
  </label>
  <p>Status: {{ setuju ? '✅ Setuju' : '❌ Belum' }}</p>

  <h3>Hobi:</h3>
  <label><input type="checkbox" v-model="hobi" value="coding" /> Coding</label>
  <label><input type="checkbox" v-model="hobi" value="gaming" /> Gaming</label>
  <label><input type="checkbox" v-model="hobi" value="reading" /> Reading</label>
  <p>Dipilih: {{ hobi.join(', ') }}</p>
</template>
```

---

## 3️⃣ Radio Button

```vue
<script setup>
import { ref } from 'vue'
const gender = ref('')
</script>

<template>
  <label><input type="radio" v-model="gender" value="pria" /> Pria</label>
  <label><input type="radio" v-model="gender" value="wanita" /> Wanita</label>
  <p>Gender: {{ gender }}</p>
</template>
```

---

## 4️⃣ Select / Dropdown

```vue
<script setup>
import { ref } from 'vue'
const kota = ref('')
const bahasa = ref([]) // multi-select
</script>

<template>
  <select v-model="kota">
    <option disabled value="">-- Pilih Kota --</option>
    <option>Jakarta</option>
    <option>Bandung</option>
    <option>Surabaya</option>
  </select>

  <!-- Multi select -->
  <select v-model="bahasa" multiple>
    <option>JavaScript</option>
    <option>Python</option>
    <option>PHP</option>
  </select>
</template>
```

---

## 5️⃣ Modifiers

```vue
<template>
  <!-- .lazy: update saat blur, bukan setiap keystroke -->
  <input v-model.lazy="pesan" />

  <!-- .number: auto-cast ke number -->
  <input v-model.number="umur" type="number" />

  <!-- .trim: auto-trim whitespace -->
  <input v-model.trim="nama" />
</template>
```

---

## 🧪 Latihan: Form Pendaftaran

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
  setuju: false,
})

const isValid = computed(() => {
  return form.value.nama && form.value.email && form.value.setuju
})

const submitted = ref(false)
const submit = () => {
  if (!isValid.value) return
  submitted.value = true
}
</script>

<template>
  <h2>📋 Form Pendaftaran</h2>
  
  <div v-if="!submitted">
    <input v-model.trim="form.nama" placeholder="Nama" />
    <input v-model.trim="form.email" type="email" placeholder="Email" />
    <input v-model.number="form.umur" type="number" placeholder="Umur" />
    
    <div>
      <label><input type="radio" v-model="form.gender" value="pria" /> Pria</label>
      <label><input type="radio" v-model="form.gender" value="wanita" /> Wanita</label>
    </div>
    
    <select v-model="form.kota">
      <option disabled value="">Pilih kota</option>
      <option>Jakarta</option>
      <option>Bandung</option>
    </select>
    
    <div>
      <label><input type="checkbox" v-model="form.hobi" value="coding" /> Coding</label>
      <label><input type="checkbox" v-model="form.hobi" value="gaming" /> Gaming</label>
    </div>
    
    <label><input type="checkbox" v-model="form.setuju" /> Saya setuju</label>
    
    <button :disabled="!isValid" @click="submit">Daftar</button>
  </div>

  <div v-else>
    <h3>✅ Berhasil!</h3>
    <pre>{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>
```

---

**Sebelumnya:** [← Bab 5 — Conditional & List](./05-conditional-list.md)
**Selanjutnya:** [Bab 7 — Class & Style Binding →](./07-class-style-binding.md)
