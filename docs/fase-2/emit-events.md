# Events & Emit (Child ke Parent)

Jika **Props** mengirim data turun (Parent → Child), maka **Emit** digunakan untuk mengirim pesan/data naik (Child → Parent).

Ini adalah cara komponen anak memberi tahu komponen induk bahwa sesuatu telah terjadi (seperti tombol diklik, form disubmit, atau data diupdate).

## 1. Mendefinisikan & Memanggil Emit

Gunakan macro `defineEmits` di dalam `<script setup>` untuk mendefinisikan event apa saja yang bisa dipancarkan (emit) oleh komponen ini.

```vue
<!-- ChildComponent.vue -->
<script setup>
// Definisikan daftar custom event
const emit = defineEmits(['update', 'hapus'])

const handleUpdate = () => {
  // emit('namaEvent', payloadData)
  emit('update', { id: 1, nama: 'Data baru' })
}

const handleHapus = () => {
  emit('hapus', 1)
}
</script>

<template>
  <div>
    <button @click="handleUpdate">Update Data</button>
    
    <!-- Emit bisa juga dipanggil langsung di template via $emit -->
    <button @click="$emit('hapus', 1)">Hapus Data</button>
  </div>
</template>
```

### Mendengarkan Event di Parent

Parent mendengarkan custom event menggunakan `v-on` (atau `@`) sama seperti event HTML biasa (seperti `@click`).

```vue
<!-- ParentComponent.vue -->
<script setup>
import ChildComponent from './ChildComponent.vue'

const onUpdate = (data) => {
  console.log('Data dari child:', data)
  // Lakukan sesuatu dengan data: { id: 1, nama: 'Data baru' }
}

const onHapus = (id) => {
  console.log('Hapus item id:', id)
}
</script>

<template>
  <!-- Gunakan kebab-case untuk nama event di template -->
  <ChildComponent 
    @update="onUpdate" 
    @hapus="onHapus" 
  />
</template>
```

## 2. Emit dengan Validation

Sama seperti props, kamu bisa memvalidasi payload dari event yang di-emit. Ini sangat membantu untuk dokumentasi dan mencegah bug.

```vue
<script setup>
const emit = defineEmits({
  // Event tanpa validasi
  cancel: null,
  
  // Event dengan validasi payload
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true // Valid
    } else {
      console.warn('Payload submit tidak lengkap!')
      return false // Invalid
    }
  }
})

const onSubmit = () => {
  emit('submit', { email: 'test@test.com', password: '123' })
}
</script>
```

## 3. Pattern `v-model` pada Component

Seringkali kita ingin membuat custom input component (seperti Custom DatePicker atau Input field yang di-styling khusus) yang bisa digunakan dengan `v-model`.

Di Vue 3, `v-model` pada sebuah komponen pada dasarnya adalah **kombinasi prop `modelValue` dan event `update:modelValue`**.

### Membuat Custom Input

```vue
<!-- BaseInput.vue -->
<script setup>
// 1. Terima prop modelValue
defineProps(['modelValue'])

// 2. Definisikan event update:modelValue
const emit = defineEmits(['update:modelValue'])

const handleInput = (event) => {
  // 3. Emit event saat input berubah dengan value baru
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="input-wrapper">
    <!-- Bind value dan dengarkan event input -->
    <input 
      :value="modelValue" 
      @input="handleInput" 
      class="custom-input" 
    />
  </div>
</template>
```

### Menggunakan Custom Input

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const nama = ref('')
</script>

<template>
  <!-- v-model akan otomatis binding ke modelValue dan mendengar update:modelValue -->
  <BaseInput v-model="nama" />
  
  <p>Input: {{ nama }}</p>
</template>
```

### Multiple `v-model`

Sebuah komponen bisa memiliki lebih dari satu `v-model` dengan memberikan argumen nama.

```vue
<!-- UserNameForm.vue -->
<script setup>
defineProps(['firstName', 'lastName'])
defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input 
    :value="firstName" 
    @input="$emit('update:firstName', $event.target.value)" 
    placeholder="Nama Depan"
  />
  <input 
    :value="lastName" 
    @input="$emit('update:lastName', $event.target.value)" 
    placeholder="Nama Belakang"
  />
</template>
```

Penggunaan di Parent:

```vue
<UserNameForm 
  v-model:first-name="depan" 
  v-model:last-name="belakang" 
/>
```

## Latihan: Todo App Lengkap dengan Emit

Mari gabungkan Props dan Emit untuk membuat list item yang interaktif.

```vue
<!-- TodoItem.vue (Child) -->
<script setup>
defineProps({
  todo: { type: Object, required: true }
})

// Child tidak boleh merubah todo secara langsung.
// Ia hanya MEMINTA parent untuk merubah/menghapusnya.
const emit = defineEmits(['toggle', 'hapus'])
</script>

<template>
  <div class="todo-item" :class="{ 'is-done': todo.selesai }">
    <input 
      type="checkbox" 
      :checked="todo.selesai" 
      @change="emit('toggle', todo.id)" 
    />
    <span>{{ todo.teks }}</span>
    <button @click="emit('hapus', todo.id)" class="btn-delete">❌</button>
  </div>
</template>

<style scoped>
.todo-item { display: flex; gap: 10px; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
.is-done span { text-decoration: line-through; color: #999; }
.btn-delete { margin-left: auto; background: none; border: none; cursor: pointer; }
</style>
```

```vue
<!-- TodoList.vue (Parent) -->
<script setup>
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

// State (Sumber kebenaran ada di Parent)
const todos = ref([
  { id: 1, teks: 'Belajar Vue Component', selesai: true },
  { id: 2, teks: 'Pahami Props dan Emit', selesai: false },
])

// Event Handlers (Hanya Parent yang boleh merubah State)
const handleToggle = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.selesai = !todo.selesai
}

const handleHapus = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <div class="card">
    <h2>Daftar Tugas</h2>
    <TodoItem
      v-for="todo in todos" 
      :key="todo.id"
      :todo="todo"
      @toggle="handleToggle"
      @hapus="handleHapus"
    />
  </div>
</template>
```
