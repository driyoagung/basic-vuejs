# Event Handling & Methods

Vue menggunakan directive `v-on` (shorthand: `@`) untuk mendengarkan event DOM dan menjalankan JavaScript saat event terjadi.

## Dasar Event Handling

```vue
<script setup>
import { ref } from 'vue'
const counter = ref(0)

// Method handler
const increment = () => { counter.value++ }
const decrement = () => { counter.value-- }
const reset = () => { counter.value = 0 }
</script>

<template>
  <p>Counter: {{ counter }}</p>
  
  <!-- v-on:click atau shorthand @click -->
  <button v-on:click="increment">+1 (v-on)</button>
  <button @click="decrement">-1 (shorthand)</button>
  <button @click="reset">Reset</button>
  
  <!-- Inline handler — langsung expression -->
  <button @click="counter++">Inline +1</button>
  <button @click="counter = 42">Set 42</button>
</template>
```

::: tip Shorthand
`v-on:click="fn"` → `@click="fn"`. Selalu gunakan shorthand `@`.
:::

## Mengakses Event Object

```vue
<script setup>
// Tanpa parameter tambahan — event otomatis dikirim
const handleClick = (event) => {
  console.log('Tipe:', event.type)        // 'click'
  console.log('Target:', event.target)    // <button> element
  console.log('Posisi:', event.clientX, event.clientY)
}

// Dengan parameter DAN event — gunakan $event
const sapa = (nama, event) => {
  console.log(`Halo ${nama}!`)
  console.log('Event:', event.type)
}
</script>

<template>
  <!-- Event otomatis dikirim sebagai parameter pertama -->
  <button @click="handleClick">Klik Info</button>
  
  <!-- Gunakan $event untuk mengirim event bersama parameter lain -->
  <button @click="sapa('Agung', $event)">Sapa Agung</button>
  <button @click="sapa('Budi', $event)">Sapa Budi</button>
</template>
```

## Event Modifiers

Vue menyediakan modifier untuk menggantikan pemanggilan method event secara manual:

```vue
<template>
  <!-- .prevent = event.preventDefault() -->
  <form @submit.prevent="handleSubmit">
    <input type="text" placeholder="Data..." />
    <button type="submit">Kirim (tanpa reload)</button>
  </form>

  <!-- .stop = event.stopPropagation() -->
  <div @click="handleOuter" style="padding: 20px; background: #fee">
    Outer (klik di sini)
    <button @click.stop="handleInner">
      Inner (tidak trigger outer)
    </button>
  </div>

  <!-- .once = hanya trigger satu kali -->
  <button @click.once="handleSekali">Hanya bisa diklik 1x</button>

  <!-- .self = hanya trigger jika target === elemen itu sendiri -->
  <div @click.self="handleDiv" style="padding: 20px; background: #efe">
    Klik area ini (bukan button)
    <button>Klik button ini TIDAK trigger div</button>
  </div>

  <!-- Chain modifiers -->
  <form @submit.prevent.once="handleSubmit">
    Submit hanya sekali tanpa reload
  </form>
</template>
```

| Modifier | Setara dengan | Fungsi |
|----------|--------------|--------|
| `.prevent` | `event.preventDefault()` | Cegah behavior default (submit, link) |
| `.stop` | `event.stopPropagation()` | Hentikan event bubbling |
| `.once` | — | Trigger hanya sekali |
| `.self` | — | Hanya jika `event.target === element` |
| `.capture` | `{ capture: true }` | Event capture mode (top-down) |
| `.passive` | `{ passive: true }` | Optimasi scroll performance |

## Key Modifiers

Untuk menangani event keyboard:

```vue
<script setup>
import { ref } from 'vue'
const pesan = ref('')

const submit = () => console.log('Submit:', pesan.value)
const batalkan = () => { pesan.value = '' }
</script>

<template>
  <!-- Trigger saat tekan Enter -->
  <input v-model="pesan" @keyup.enter="submit" placeholder="Tekan Enter" />
  
  <!-- Trigger saat tekan Escape -->
  <input @keyup.esc="batalkan" placeholder="Tekan Esc" />
  
  <!-- Key modifiers yang tersedia -->
  <input @keyup.tab="nextField" />
  <input @keyup.delete="hapus" />
  <input @keyup.space="toggle" />
  <input @keyup.up="keAtas" />
  <input @keyup.down="keBawah" />
  <input @keyup.left="keKiri" />
  <input @keyup.right="keKanan" />
</template>
```

### System Modifier Keys

```vue
<template>
  <!-- Ctrl + Enter -->
  <textarea @keyup.ctrl.enter="kirimPesan" placeholder="Ctrl+Enter kirim"></textarea>
  
  <!-- Alt + S -->
  <input @keyup.alt.s="simpan" />
  
  <!-- Shift + Click -->
  <button @click.shift="selectRange">Shift+Click</button>
  
  <!-- Ctrl + Click -->
  <button @click.ctrl="multiSelect">Ctrl+Click</button>
  
  <!-- .exact — HANYA modifier ini, tanpa yang lain -->
  <button @click.ctrl.exact="onlyCtrlClick">Ctrl saja</button>
</template>
```

## Mouse Button Modifiers

```vue
<template>
  <div 
    @click.left="klikKiri"
    @click.right.prevent="klikKanan"
    @click.middle="klikTengah"
    style="padding: 40px; background: #f0f0f0; text-align: center;"
  >
    Klik dengan tombol mouse berbeda
  </div>
</template>
```

## Latihan: Chat Sederhana

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
    waktu: new Date().toLocaleTimeString('id-ID'),
    dari: 'Saya'
  })
  pesan.value = ''
}

const hapusPesan = (id) => {
  pesanList.value = pesanList.value.filter(p => p.id !== id)
}

const hapusSemua = () => {
  if (pesanList.value.length === 0) return
  pesanList.value = []
}
</script>

<template>
  <div class="chat">
    <h2>💬 Chat</h2>
    
    <div class="messages">
      <p v-if="pesanList.length === 0" style="color: #9ca3af;">
        Belum ada pesan...
      </p>
      <div v-for="p in pesanList" :key="p.id" class="message">
        <span class="text">{{ p.teks }}</span>
        <small class="time">{{ p.waktu }}</small>
        <button @click.stop="hapusPesan(p.id)" class="delete">❌</button>
      </div>
    </div>

    <form @submit.prevent="kirimPesan" class="input-area">
      <input 
        v-model="pesan"
        @keyup.enter="kirimPesan"
        placeholder="Ketik pesan... (Enter untuk kirim)"
      />
      <button type="submit">Kirim</button>
      <button type="button" @click="hapusSemua">🗑️</button>
    </form>
  </div>
</template>
```

## Rangkuman

| Konsep | Syntax | Contoh |
|--------|--------|--------|
| Event listener | `@event="handler"` | `@click="increment"` |
| Inline handler | `@event="expression"` | `@click="counter++"` |
| Event object | `$event` | `@click="fn($event)"` |
| Prevent default | `.prevent` | `@submit.prevent` |
| Stop propagation | `.stop` | `@click.stop` |
| Satu kali | `.once` | `@click.once` |
| Key modifier | `.key` | `@keyup.enter` |
| System key | `.ctrl`, `.alt`, `.shift` | `@keyup.ctrl.enter` |
| Mouse button | `.left`, `.right`, `.middle` | `@click.right.prevent` |
