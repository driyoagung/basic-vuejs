# Bab 10: Events & Emit (Child → Parent)

## 📖 Komunikasi Child ke Parent

Props = Parent → Child. **Emit** = Child → Parent.

---

## 1️⃣ defineEmits

```vue
<!-- ChildComponent.vue -->
<script setup>
const emit = defineEmits(['update', 'hapus'])

const handleUpdate = () => {
  emit('update', { id: 1, nama: 'Data baru' })
}

const handleHapus = () => {
  emit('hapus', 1)
}
</script>

<template>
  <button @click="handleUpdate">Update</button>
  <button @click="handleHapus">Hapus</button>
</template>
```

```vue
<!-- ParentComponent.vue -->
<script setup>
import ChildComponent from './ChildComponent.vue'

const onUpdate = (data) => {
  console.log('Data diupdate:', data)
}

const onHapus = (id) => {
  console.log('Item dihapus:', id)
}
</script>

<template>
  <ChildComponent @update="onUpdate" @hapus="onHapus" />
</template>
```

---

## 2️⃣ Emit dengan Validation

```vue
<script setup>
const emit = defineEmits({
  // Dengan validator
  submit: (payload) => {
    if (!payload.email) {
      console.warn('Email wajib!')
      return false
    }
    return true
  },
  // Tanpa validator
  cancel: null,
})
</script>
```

---

## 3️⃣ Pattern: v-model pada Component

Buat component yang mendukung `v-model`:

```vue
<!-- CustomInput.vue -->
<script setup>
const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input :value="modelValue" @input="updateValue" class="custom-input" />
</template>
```

Gunakan di parent:
```vue
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const nama = ref('')
</script>

<template>
  <!-- Sama seperti <input v-model="nama" /> tapi custom! -->
  <CustomInput v-model="nama" />
  <p>Nama: {{ nama }}</p>
</template>
```

### Multiple v-model

```vue
<!-- UserForm.vue -->
<script setup>
defineProps({ firstName: String, lastName: String })
defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input :value="firstName" @input="$emit('update:firstName', $event.target.value)" />
  <input :value="lastName" @input="$emit('update:lastName', $event.target.value)" />
</template>
```

```vue
<!-- Parent -->
<UserForm v-model:first-name="depan" v-model:last-name="belakang" />
```

---

## 🧪 Latihan: Todo App dengan Emit

```vue
<!-- TodoItem.vue -->
<script setup>
defineProps({
  todo: { type: Object, required: true }
})

const emit = defineEmits(['toggle', 'hapus'])
</script>

<template>
  <div class="todo-item">
    <input 
      type="checkbox" 
      :checked="todo.selesai" 
      @change="emit('toggle', todo.id)" 
    />
    <span :class="{ done: todo.selesai }">{{ todo.teks }}</span>
    <button @click="emit('hapus', todo.id)">❌</button>
  </div>
</template>
```

```vue
<!-- TodoApp.vue (Parent) -->
<script setup>
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

const todos = ref([
  { id: 1, teks: 'Belajar Props', selesai: true },
  { id: 2, teks: 'Belajar Emit', selesai: false },
])

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.selesai = !todo.selesai
}

const hapusTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <TodoItem
    v-for="todo in todos" :key="todo.id"
    :todo="todo"
    @toggle="toggleTodo"
    @hapus="hapusTodo"
  />
</template>
```

---

**Sebelumnya:** [← Bab 9 — Props](./09-props.md)
**Selanjutnya:** [Bab 11 — Slots →](./11-slots.md)
