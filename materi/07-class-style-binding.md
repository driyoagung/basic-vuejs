# Bab 7: Class & Style Binding

## 1️⃣ Dynamic Class Binding

### Object Syntax
```vue
<script setup>
import { ref } from 'vue'
const aktif = ref(true)
const error = ref(false)
</script>

<template>
  <!-- Class ditambahkan jika nilai true -->
  <div :class="{ active: aktif, 'text-error': error }">
    Konten
  </div>
  <!-- Output: <div class="active">Konten</div> -->
</template>
```

### Array Syntax
```vue
<script setup>
const classUtama = 'card'
const classTema = 'card-dark'
</script>

<template>
  <div :class="[classUtama, classTema]">Konten</div>
  <!-- Output: <div class="card card-dark">Konten</div> -->

  <!-- Kombinasi array + object -->
  <div :class="[classUtama, { active: true }]">Konten</div>
</template>
```

---

## 2️⃣ Inline Style Binding

### Object Syntax
```vue
<script setup>
import { ref } from 'vue'
const warna = ref('#3b82f6')
const ukuran = ref(18)
</script>

<template>
  <p :style="{ color: warna, fontSize: ukuran + 'px' }">
    Teks berwarna
  </p>

  <!-- Atau pakai kebab-case (harus di-quote) -->
  <p :style="{ 'font-size': ukuran + 'px' }">Teks</p>
</template>
```

### Style Object
```vue
<script setup>
import { computed } from 'vue'

const cardStyle = computed(() => ({
  padding: '20px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
}))
</script>

<template>
  <div :style="cardStyle">Card bergradien</div>
</template>
```

---

## 🧪 Latihan: Tab Dinamis

```vue
<script setup>
import { ref } from 'vue'

const tabs = ['Profil', 'Pengaturan', 'Notifikasi']
const tabAktif = ref('Profil')
</script>

<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab"
      :class="{ 'tab-active': tabAktif === tab }"
      @click="tabAktif = tab"
    >
      {{ tab }}
    </button>
  </div>
  <div class="tab-content">
    Konten: {{ tabAktif }}
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: 4px; }
.tabs button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
}
.tab-active {
  background: #3b82f6 !important;
  color: white;
  border-color: #3b82f6 !important;
}
</style>
```

---

**Sebelumnya:** [← Bab 6 — Form Binding](./06-form-binding.md)
**Selanjutnya:** [Bab 8 — Pengenalan Component →](./08-components.md)
