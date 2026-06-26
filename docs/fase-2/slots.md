# Slots & Scoped Slots

## Apa itu Slots?

Selain **Props** (untuk mengirim data) dan **Emit** (untuk mengirim event), Vue menyediakan **Slots** untuk mengirim **HTML/Template**. 

Slots memungkinkan parent component untuk menyisipkan konten ke dalam area tertentu di child component. Anggap saja slot sebagai "lubang" di child component yang bebas diisi apa saja oleh parent-nya.

## 1. Default Slot

Gunakan tag `<slot>` di child component untuk menandai letak konten akan disisipkan.

```vue
<!-- BaseCard.vue (Child) -->
<template>
  <div class="card">
    <!-- Konten dari parent akan masuk ke sini -->
    <slot></slot>
  </div>
</template>

<style scoped>
.card { padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; }
</style>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import BaseCard from './BaseCard.vue'
</script>

<template>
  <!-- Segala yang ada di dalam tag BaseCard akan dimasukkan ke <slot> -->
  <BaseCard>
    <h2>Judul Card</h2>
    <p>Ini adalah konten yang sangat fleksibel. Bisa berisi teks, HTML, atau bahkan komponen lain!</p>
    <button>Aksi</button>
  </BaseCard>
</template>
```

### Fallback (Default) Content

Kamu bisa memberikan konten bawaan di dalam tag `<slot>` yang akan dirender jika parent **tidak memberikan konten apa-apa**.

```vue
<!-- BaseButton.vue -->
<template>
  <button class="btn">
    <slot>
      Submit <!-- Teks ini akan muncul jika slot kosong -->
    </slot>
  </button>
</template>
```

Penggunaan:
```vue
<BaseButton />                   <!-- Output: <button>Submit</button> -->
<BaseButton>Simpan</BaseButton>  <!-- Output: <button>Simpan</button> -->
```

## 2. Named Slots

Terkadang sebuah komponen butuh lebih dari satu slot (misal: header, body, footer). Kamu bisa memberi nama pada slot menggunakan atribut `name`.

```vue
<!-- PageLayout.vue (Child) -->
<template>
  <div class="layout">
    <header class="header">
      <slot name="header"></slot>
    </header>
    
    <main class="content">
      <!-- Slot tanpa name = default slot -->
      <slot></slot>
    </main>
    
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

Di sisi Parent, gunakan tag `<template>` dengan atribut `v-slot:` (atau shorthand `#`) untuk menentukan ke slot mana konten harus dimasukkan.

```vue
<!-- ParentComponent.vue -->
<template>
  <PageLayout>
    <!-- Masuk ke slot header -->
    <template #header>
      <h1>Judul Halaman Saya</h1>
    </template>

    <!-- Masuk ke default slot (tidak butuh <template> khusus, tapi boleh) -->
    <p>Ini adalah konten utama halaman.</p>
    <img src="/image.png" alt="Gambar Utama" />

    <!-- Masuk ke slot footer -->
    <template #footer>
      <p>&copy; 2026 Hak Cipta Dilindungi</p>
    </template>
  </PageLayout>
</template>
```

## 3. Scoped Slots

Scoped slots adalah konsep tingkat lanjut di mana **Child Component dapat mengirimkan data kembali ke Parent Component melalui slot**.

Ini berguna saat kamu memiliki komponen yang mengelola list/array (seperti List Component atau Table), namun menyerahkan urusan "tampilan per-item" kepada parent-nya.

### Langkah 1: Child Passing Data (Slot Props)

Di Child, berikan atribut pada tag `<slot>` (disebut Slot Props).

```vue
<!-- UserList.vue (Child) -->
<script setup>
import { ref } from 'vue'

// Data ada di Child!
const users = ref([
  { id: 1, nama: 'Agung', role: 'Dev' },
  { id: 2, nama: 'Budi', role: 'Design' },
])
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <!-- Kirim data user ke parent yang akan mengisi slot ini -->
      <!-- nama bebas, di sini kita gunakan nama prop "item" -->
      <slot :item="user" :index="user.id">
        <!-- Fallback render jika parent tidak pakai slot -->
        {{ user.nama }}
      </slot>
    </li>
  </ul>
</template>
```

### Langkah 2: Parent Menerima Data

Di Parent, tangkap slot props menggunakan argumen dari `v-slot` atau `#`.

```vue
<!-- ParentComponent.vue -->
<script setup>
import UserList from './UserList.vue'
</script>

<template>
  <UserList>
    <!-- Tangkap slot props (bisa pakai destructuring object) -->
    <template #default="{ item, index }">
      <div class="custom-user-row">
        <span class="badge">#{{ index }}</span>
        <strong>{{ item.nama.toUpperCase() }}</strong>
        <span class="role-label">{{ item.role }}</span>
      </div>
    </template>
  </UserList>
</template>
```

## Latihan: BaseModal Component

Mari buat komponen Modal yang sangat reusable dengan Named Slots.

```vue
<!-- components/BaseModal.vue -->
<script setup>
defineProps({ show: Boolean })
defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      
      <div class="modal-header">
        <slot name="header">
          <h3>Konfirmasi</h3> <!-- Fallback Header -->
        </slot>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-body">
        <slot> <!-- Default Slot untuk body -->
          <p>Apakah Anda yakin?</p>
        </slot>
      </div>
      
      <div class="modal-footer">
        <slot name="footer"> <!-- Fallback Footer -->
          <button @click="$emit('close')">Tutup</button>
        </slot>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
}
.modal { background: white; border-radius: 8px; width: 400px; max-width: 90%; }
.modal-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; }
.close-btn { background: none; border: none; font-size: 18px; cursor: pointer; }
.modal-body { padding: 20px; }
.modal-footer { padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }
</style>
```

Penggunaan:

```vue
<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">Buka Modal</button>

  <BaseModal :show="showModal" @close="showModal = false">
    <!-- Mengganti Header -->
    <template #header>
      <h3 style="color: red;">Peringatan Hapus Data!</h3>
    </template>

    <!-- Mengisi Body (Default) -->
    <p>Data yang dihapus tidak bisa dikembalikan. Lanjutkan?</p>

    <!-- Mengganti Footer -->
    <template #footer>
      <button @click="showModal = false">Batal</button>
      <button @click="lanjutHapus" style="background: red; color: white;">Hapus Permanen</button>
    </template>
  </BaseModal>
</template>
```
