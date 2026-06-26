# Bab 11: Slots & Scoped Slots

## 📖 Apa itu Slots?

Slots memungkinkan parent **menyisipkan konten** ke dalam child component. Seperti "lubang" di component yang bisa diisi dari luar.

---

## 1️⃣ Default Slot

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot></slot>  <!-- Konten dari parent masuk di sini -->
  </div>
</template>
```

```vue
<!-- Parent -->
<BaseCard>
  <h3>Judul Saya</h3>
  <p>Konten apapun bisa dimasukkan!</p>
</BaseCard>
```

### Fallback Content
```vue
<template>
  <div class="card">
    <slot>
      <p>Konten default jika parent tidak mengisi slot</p>
    </slot>
  </div>
</template>
```

---

## 2️⃣ Named Slots

```vue
<!-- PageLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>  <!-- default slot -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- Parent -->
<PageLayout>
  <template #header>
    <h1>Judul Halaman</h1>
  </template>

  <!-- Konten default slot -->
  <p>Konten utama di sini</p>

  <template #footer>
    <p>&copy; 2026</p>
  </template>
</PageLayout>
```

> `#header` adalah shorthand dari `v-slot:header`

---

## 3️⃣ Scoped Slots

Scoped slots memungkinkan child **mengirim data balik** ke parent melalui slot:

```vue
<!-- UserList.vue -->
<script setup>
import { ref } from 'vue'
const users = ref([
  { id: 1, nama: 'Agung', role: 'Dev' },
  { id: 2, nama: 'Budi', role: 'Designer' },
])
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <!-- Kirim data ke parent via slot props -->
      <slot :user="user" :index="user.id">
        {{ user.nama }}  <!-- fallback -->
      </slot>
    </li>
  </ul>
</template>
```

```vue
<!-- Parent — terima data dari slot -->
<UserList>
  <template #default="{ user }">
    <strong>{{ user.nama }}</strong> — {{ user.role }}
  </template>
</UserList>
```

---

## 🧪 Latihan: Modal Component

```vue
<!-- BaseModal.vue -->
<script setup>
defineProps({ visible: Boolean, title: String })
defineEmits(['close'])
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <slot name="header">
          <h3>{{ title || 'Modal' }}</h3>
        </slot>
        <button @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <button @click="$emit('close')">Tutup</button>
        </slot>
      </div>
    </div>
  </div>
</template>
```

```vue
<!-- Parent -->
<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const showModal = ref(false)
</script>

<template>
  <button @click="showModal = true">Buka Modal</button>

  <BaseModal :visible="showModal" @close="showModal = false">
    <template #header>
      <h3>🎉 Custom Header</h3>
    </template>

    <p>Konten modal di sini!</p>

    <template #footer>
      <button @click="showModal = false">Batal</button>
      <button @click="showModal = false">Simpan</button>
    </template>
  </BaseModal>
</template>
```

---

**Sebelumnya:** [← Bab 10 — Emit Events](./10-emit-events.md)
**Selanjutnya:** [Bab 12 — Provide & Inject →](./12-provide-inject.md)
