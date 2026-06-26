# Class & Style Binding

Vue menyediakan cara khusus untuk mengikat `class` dan `style` secara dinamis — mendukung object syntax dan array syntax.

## Dynamic Class — Object Syntax

```vue
<script setup>
import { ref } from 'vue'
const aktif = ref(true)
const error = ref(false)
const loading = ref(false)
</script>

<template>
  <!-- Class ditambahkan jika nilainya true -->
  <div :class="{ active: aktif, 'text-error': error, 'is-loading': loading }">
    Konten
  </div>
  <!-- Output: <div class="active">Konten</div> -->

  <!-- Bisa digabung dengan class statis -->
  <div class="card" :class="{ 'card-active': aktif, 'card-error': error }">
    Card
  </div>
  <!-- Output: <div class="card card-active">Card</div> -->
</template>
```

### Bind ke Computed

```vue
<script setup>
import { ref, computed } from 'vue'

const status = ref('success') // 'success' | 'warning' | 'error'

const cardClass = computed(() => ({
  'card-success': status.value === 'success',
  'card-warning': status.value === 'warning',
  'card-error': status.value === 'error',
}))
</script>

<template>
  <div class="card" :class="cardClass">
    Status: {{ status }}
  </div>
</template>
```

## Dynamic Class — Array Syntax

```vue
<script setup>
import { ref } from 'vue'
const classUtama = ref('card')
const classTema = ref('card-dark')
const isHighlighted = ref(true)
</script>

<template>
  <!-- Array of class names -->
  <div :class="[classUtama, classTema]">Konten</div>
  <!-- Output: <div class="card card-dark">Konten</div> -->

  <!-- Kombinasi array + conditional -->
  <div :class="[classUtama, isHighlighted ? 'highlighted' : '']">Konten</div>

  <!-- Kombinasi array + object -->
  <div :class="[classUtama, { highlighted: isHighlighted }]">Konten</div>
</template>
```

## Inline Style — Object Syntax

```vue
<script setup>
import { ref } from 'vue'
const warna = ref('#3b82f6')
const ukuran = ref(18)
</script>

<template>
  <!-- camelCase property names -->
  <p :style="{ color: warna, fontSize: ukuran + 'px', fontWeight: 'bold' }">
    Teks berwarna
  </p>

  <!-- kebab-case juga bisa (harus di-quote) -->
  <p :style="{ 'font-size': ukuran + 'px', 'line-height': '1.5' }">
    Teks lainnya
  </p>
</template>
```

### Style Object & Computed

```vue
<script setup>
import { ref, computed } from 'vue'

const tema = ref('dark')

const containerStyle = computed(() => ({
  padding: '24px',
  borderRadius: '12px',
  background: tema.value === 'dark' 
    ? 'linear-gradient(135deg, #1e293b, #334155)' 
    : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
  color: tema.value === 'dark' ? '#f1f5f9' : '#1e293b',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}))
</script>

<template>
  <div :style="containerStyle">
    <p>Tema: {{ tema }}</p>
    <button @click="tema = tema === 'dark' ? 'light' : 'dark'">
      Toggle Tema
    </button>
  </div>
</template>
```

### Multiple Style Objects

```vue
<script setup>
const baseStyle = { padding: '16px', borderRadius: '8px' }
const colorStyle = { background: '#3b82f6', color: 'white' }
</script>

<template>
  <div :style="[baseStyle, colorStyle]">
    Gabungan style objects
  </div>
</template>
```

## Latihan: Tab Navigation

```vue
<script setup>
import { ref } from 'vue'

const tabs = [
  { id: 'profil', label: '👤 Profil', content: 'Konten halaman profil...' },
  { id: 'settings', label: '⚙️ Pengaturan', content: 'Konten pengaturan...' },
  { id: 'notifikasi', label: '🔔 Notifikasi', content: 'Konten notifikasi...' },
]

const tabAktif = ref('profil')
</script>

<template>
  <div class="tab-container">
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { 'tab-active': tabAktif === tab.id }]"
        @click="tabAktif = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <div v-for="tab in tabs" :key="tab.id" v-show="tabAktif === tab.id">
        <h3>{{ tab.label }}</h3>
        <p>{{ tab.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-container { max-width: 500px; }
.tab-nav { display: flex; gap: 4px; border-bottom: 2px solid #e2e8f0; }
.tab-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
  font-size: 14px;
}
.tab-btn:hover { background: #f1f5f9; }
.tab-active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  font-weight: 600;
}
.tab-content { padding: 20px 0; }
</style>
```

## Rangkuman

| Konsep | Syntax | Contoh |
|--------|--------|--------|
| Class object | `:class="{ cls: bool }"` | `:class="{ active: isActive }"` |
| Class array | `:class="[cls1, cls2]"` | `:class="['card', tema]"` |
| Class gabungan | `:class="[cls, { c: bool }]"` | `:class="['card', { active: true }]"` |
| Style object | `:style="{ prop: val }"` | `:style="{ color: warna }"` |
| Style array | `:style="[obj1, obj2]"` | `:style="[base, color]"` |
| Computed class | `:class="computedObj"` | `:class="cardClass"` |
