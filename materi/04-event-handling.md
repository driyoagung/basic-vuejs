# Bab 4: Event Handling & Methods

## 📖 Menangani Event di Vue

Vue menggunakan directive `v-on` (shorthand: `@`) untuk mendengarkan event DOM.

---

## 1️⃣ Dasar Event Handling

```vue
<script setup>
import { ref } from 'vue'
const counter = ref(0)

const increment = () => { counter.value++ }
const reset = () => { counter.value = 0 }
</script>

<template>
  <p>{{ counter }}</p>
  
  <!-- v-on:click atau @click -->
  <button v-on:click="increment">+1</button>
  <button @click="reset">Reset</button>
  
  <!-- Inline handler -->
  <button @click="counter++">Inline +1</button>
  <button @click="counter = 42">Set ke 42</button>
</template>
```

---

## 2️⃣ Mengakses Event Object

```vue
<script setup>
const handleClick = (event) => {
  console.log('Tag:', event.target.tagName)
  console.log('Posisi:', event.clientX, event.clientY)
}

// Method dengan parameter DAN event
const sapa = (nama, event) => {
  console.log(`Halo ${nama}!`, event.type)
}
</script>

<template>
  <button @click="handleClick">Klik Info</button>
  <!-- Gunakan $event untuk passing event object -->
  <button @click="sapa('Agung', $event)">Sapa</button>
</template>
```

---

## 3️⃣ Event Modifiers

Vue menyediakan modifier untuk menggantikan `event.preventDefault()`, `event.stopPropagation()`, dll:

```vue
<template>
  <!-- .prevent = preventDefault() -->
  <form @submit.prevent="handleSubmit">
    <input type="text" />
    <button type="submit">Kirim</button>
  </form>

  <!-- .stop = stopPropagation() -->
  <div @click="handleOuter">
    <button @click.stop="handleInner">Klik (tidak bubble)</button>
  </div>

  <!-- .once = hanya trigger sekali -->
  <button @click.once="handleSekali">Hanya 1x</button>

  <!-- .self = hanya trigger jika target adalah elemen itu sendiri -->
  <div @click.self="handleDiv">
    <button>Klik button ini tidak trigger div</button>
  </div>

  <!-- Bisa chain modifier -->
  <form @submit.prevent.once="handleSubmit">...</form>
</template>
```

| Modifier | Fungsi |
|----------|--------|
| `.prevent` | `event.preventDefault()` |
| `.stop` | `event.stopPropagation()` |
| `.once` | Trigger hanya sekali |
| `.self` | Hanya jika `event.target === element` |
| `.capture` | Gunakan capture mode |
| `.passive` | Seperti `{ passive: true }` |

---

## 4️⃣ Key Modifiers

```vue
<template>
  <!-- Trigger saat tekan Enter -->
  <input @keyup.enter="submit" />
  
  <!-- Trigger saat tekan Escape -->
  <input @keyup.esc="batalkan" />
  
  <!-- Key modifiers lainnya -->
  <input @keyup.tab="nextField" />
  <input @keyup.delete="hapus" />
  <input @keyup.space="toggle" />
  <input @keyup.up="keAtas" />
  <input @keyup.down="keBawah" />
  
  <!-- Kombinasi: Ctrl+Enter -->
  <textarea @keyup.ctrl.enter="kirimPesan"></textarea>
  
  <!-- Alt+S -->
  <button @click.alt="simpanDraft">Simpan</button>
</template>
```

---

## 5️⃣ Mouse Button Modifiers

```vue
<template>
  <div 
    @click.left="klikKiri"
    @click.right.prevent="klikKanan"
    @click.middle="klikTengah"
  >
    Klik dengan tombol mouse berbeda
  </div>
</template>
```

---

## 🧪 Latihan: Form Interaktif

```vue
<script setup>
import { ref } from 'vue'

const pesan = ref('')
const pesanList = ref([])

const kirimPesan = () => {
  if (!pesan.value.trim()) return
  pesanList.value.push({
    id: Date.now(),
    teks: pesan.value,
    waktu: new Date().toLocaleTimeString()
  })
  pesan.value = ''
}

const hapusPesan = (id) => {
  pesanList.value = pesanList.value.filter(p => p.id !== id)
}
</script>

<template>
  <h2>💬 Chat Sederhana</h2>
  
  <form @submit.prevent="kirimPesan">
    <input 
      v-model="pesan" 
      @keyup.enter="kirimPesan"
      placeholder="Ketik pesan..." 
    />
    <button type="submit">Kirim</button>
  </form>

  <ul>
    <li v-for="p in pesanList" :key="p.id">
      <span>{{ p.teks }}</span>
      <small>({{ p.waktu }})</small>
      <button @click.stop="hapusPesan(p.id)">❌</button>
    </li>
  </ul>
</template>
```

---

## 📝 Rangkuman

| Konsep | Syntax | Contoh |
|--------|--------|--------|
| Event listener | `@event` | `@click="handler"` |
| Event object | `$event` | `@click="fn($event)"` |
| Prevent default | `.prevent` | `@submit.prevent` |
| Stop propagation | `.stop` | `@click.stop` |
| Key modifier | `.key` | `@keyup.enter` |

---

**Sebelumnya:** [← Bab 3 — Reactivity](./03-reactivity.md)
**Selanjutnya:** [Bab 5 — Conditional & List Rendering →](./05-conditional-list.md)
