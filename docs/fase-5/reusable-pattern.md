# Reusable Patterns & Base Components

Di aplikasi skala besar (Enterprise), kita dituntut untuk membuat kode yang sangat DRY (Don't Repeat Yourself). Salah satu caranya adalah dengan membangun **Base Components** dan **Compound Components**.

## 1. Konsep Base Component (UI Kit Internal)

Base Component adalah komponen bodoh (dumb component) yang *hanya peduli soal tampilan*. Ia tidak melakukan request API, ia tidak terikat dengan logika bisnis spesifik. 

Kita memberi awalan `Base` pada komponen ini.

Contoh yang SANGAT disarankan untuk dibuat Base Component:
- `BaseButton.vue`
- `BaseInput.vue`
- `BaseModal.vue`
- `BaseTable.vue`

### Contoh: `BaseButton.vue`

Daripada mengulang class CSS Tailwind/Bootstrap di setiap form, buat satu tombol mutlak.

```vue
<!-- components/ui/BaseButton.vue -->
<script setup>
// Menerima prop varian warna, ukuran, dan loading state
defineProps({
  variant: { type: String, default: 'primary' }, // primary, danger, outline
  size: { type: String, default: 'md' }, // sm, md, lg
  isLoading: { type: Boolean, default: false }
})
</script>

<template>
  <!-- 
    $attrs berguna agar event bawaan seperti @click, disabled, type="submit" 
    otomatis menempel ke elemen <button> ini.
  -->
  <button 
    class="base-btn" 
    :class="[`btn-${variant}`, `btn-${size}`]"
    :disabled="isLoading"
    v-bind="$attrs"
  >
    <span v-if="isLoading" class="spinner">⏳</span>
    
    <!-- Render teks/elemen dari slot -->
    <slot></slot>
  </button>
</template>

<style scoped>
/* CSS Reset Dasar untuk Button */
.base-btn {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 6px; border: 1px solid transparent; cursor: pointer;
  font-weight: 500; transition: all 0.2s ease;
}
.base-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner { margin-right: 8px; animation: spin 1s linear infinite; }

/* Variants */
.btn-primary { background: #3b82f6; color: white; }
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-danger { background: #ef4444; color: white; }
.btn-outline { background: transparent; border-color: #cbd5e1; color: #334155; }

/* Sizes */
.btn-sm { padding: 6px 12px; font-size: 14px; }
.btn-md { padding: 10px 16px; font-size: 16px; }
.btn-lg { padding: 14px 24px; font-size: 18px; }
</style>
```

**Penggunaan BaseButton di mana saja:**
```vue
<BaseButton type="submit" variant="primary" :is-loading="menyimpan">
  Simpan Data
</BaseButton>

<BaseButton @click="batal" variant="outline" size="sm">
  Batal
</BaseButton>
```

## 2. Pengecualian Atribut Component (`inheritAttrs: false`)

Secara *default*, jika kamu mem-passing atribut `class="x"` atau `id="x"` ke sebuah komponen, Vue akan menempelkannya secara otomatis pada elemen HTML **terluar (Root)** dari komponen tersebut.

Namun pada Form Input, ini jadi masalah. Kita ingin `type`, `placeholder`, dan `id` menempel di elemen `<input>`, **bukan** di elemen `<div>` pembungkusnya!

```vue
<!-- components/ui/BaseInput.vue -->
<script setup>
// Mematikan perilaku default penempelan atribut!
defineOptions({ inheritAttrs: false })

defineProps({
  label: String,
  modelValue: [String, Number]
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    
    <!-- 
      Tempelkan atribut ($attrs) seperti placeholder, type, min, max
      SECARA SPESIFIK KE ELEMEN INI SAJA! 
    -->
    <input 
      class="base-input"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs" 
    />
  </div>
</template>

<style scoped>
.input-wrapper { display: flex; flex-direction: column; margin-bottom: 16px; }
.input-label { margin-bottom: 6px; font-weight: bold; color: #333; }
.base-input { padding: 10px; border: 1px solid #ccc; border-radius: 6px; width: 100%; }
.base-input:focus { border-color: #3b82f6; outline: none; }
</style>
```

**Penggunaan BaseInput:**
```vue
<BaseInput 
  v-model="user.email" 
  label="Alamat Email" 
  type="email" 
  placeholder="admin@example.com" 
  required 
/>
<!-- `type`, `placeholder`, `required` akan menempel dengan benar di tag <input>! -->
```

## 3. Pola Data Table Cerdas (Smart Table)

Tabel adalah UI yang paling sering diulang di halaman Admin (CRUD).
Daripada membuat loop `tr/td` manual di setiap halaman, buat satu tabel pintar.

```vue
<!-- components/ui/BaseTable.vue -->
<script setup>
defineProps({
  columns: { type: Array, required: true }, // [ { key: 'nama', label: 'Nama' } ]
  data: { type: Array, required: true },
  isLoading: { type: Boolean, default: false }
})
</script>

<template>
  <div class="table-container">
    <div v-if="isLoading" class="table-loading">Memuat Data...</div>
    
    <table v-else class="base-table">
      <!-- HEADER DINAMIS -->
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">
            {{ col.label }}
          </th>
          <!-- Header khusus Aksi (jika slot aksi digunakan parent) -->
          <th v-if="$slots.actions">Aksi</th>
        </tr>
      </thead>
      
      <!-- BODY DINAMIS -->
      <tbody>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" style="text-align:center">
            Data Tidak Ditemukan
          </td>
        </tr>
        
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col.key">
            
            <!-- SCOPED SLOT: 
                 Berikan kebebasan Parent untuk merender sel tertentu. 
                 Nama slotnya otomatis dinamai `cell-key` -->
            <slot :name="'cell-' + col.key" :value="row[col.key]" :item="row">
              {{ row[col.key] }} <!-- Fallback Render Biasa -->
            </slot>
            
          </td>
          
          <td v-if="$slots.actions">
            <!-- Berikan akses 'row' penuh ke parent untuk aksi Edit/Hapus -->
            <slot name="actions" :item="row"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* CSS Tabel Sederhana */
.base-table { width: 100%; border-collapse: collapse; text-align: left; }
.base-table th, .base-table td { padding: 12px; border-bottom: 1px solid #ddd; }
.base-table th { background-color: #f8f9fa; }
</style>
```

**Penggunaannya di Halaman Daftar Pengguna SANGAT BERSIH:**

```vue
<script setup>
import { ref } from 'vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const colHeader = [
  { key: 'id', label: 'ID' },
  { key: 'nama', label: 'Nama Lengkap' },
  { key: 'status', label: 'Status' }
]

const listUser = ref([
  { id: 1, nama: 'Agung', status: 'Aktif' },
  { id: 2, nama: 'Budi', status: 'Banned' }
])
</script>

<template>
  <BaseTable :columns="colHeader" :data="listUser">
    
    <!-- Custom Render Khusus Kolom Status (Slot bernama cell-status) -->
    <template #cell-status="{ value }">
      <span :style="{ color: value === 'Aktif' ? 'green' : 'red' }">
        {{ value.toUpperCase() }}
      </span>
    </template>
    
    <!-- Render Tombol Aksi -->
    <template #actions="{ item }">
      <BaseButton size="sm" @click="editUser(item.id)">Edit</BaseButton>
    </template>
    
  </BaseTable>
</template>
```
