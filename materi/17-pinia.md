# Bab 17: Pinia — State Management

## 📖 Apa itu Pinia?

Pinia adalah **state management** official Vue.js — tempat menyimpan data/state yang diakses oleh banyak component secara global.

---

## 1️⃣ Membuat Store

```js
// src/stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Composition API style (rekomendasi)
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)

  // Actions (methods)
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  return { count, doubleCount, isPositive, increment, decrement, reset }
})
```

---

## 2️⃣ Menggunakan Store di Component

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <p>Count: {{ counterStore.count }}</p>
  <p>Double: {{ counterStore.doubleCount }}</p>
  <button @click="counterStore.increment()">+1</button>
  <button @click="counterStore.reset()">Reset</button>
</template>
```

### Destructure dengan `storeToRefs`

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ✅ Gunakan storeToRefs untuk state & getters
const { count, doubleCount } = storeToRefs(store)

// ✅ Actions bisa destructure langsung
const { increment, reset } = store
</script>
```

---

## 3️⃣ Store yang Lebih Realistis: Todo Store

```js
// src/stores/todo.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const filter = ref('semua') // 'semua' | 'aktif' | 'selesai'

  // Getters
  const filteredTodos = computed(() => {
    if (filter.value === 'aktif') return todos.value.filter(t => !t.selesai)
    if (filter.value === 'selesai') return todos.value.filter(t => t.selesai)
    return todos.value
  })

  const totalAktif = computed(() => todos.value.filter(t => !t.selesai).length)

  // Actions
  function addTodo(teks) {
    todos.value.push({
      id: Date.now(),
      teks,
      selesai: false,
      createdAt: new Date(),
    })
  }

  function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.selesai = !todo.selesai
  }

  function removeTodo(id) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  function clearCompleted() {
    todos.value = todos.value.filter(t => !t.selesai)
  }

  return {
    todos, filter, filteredTodos, totalAktif,
    addTodo, toggleTodo, removeTodo, clearCompleted,
  }
})
```

---

## 4️⃣ Store di Banyak Component

```vue
<!-- TodoInput.vue -->
<script setup>
import { ref } from 'vue'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const input = ref('')

const submit = () => {
  if (!input.value.trim()) return
  store.addTodo(input.value)
  input.value = ''
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="input" placeholder="Tambah todo..." />
    <button type="submit">Tambah</button>
  </form>
</template>
```

```vue
<!-- TodoList.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todo'

const store = useTodoStore()
const { filteredTodos, totalAktif } = storeToRefs(store)
const { toggleTodo, removeTodo } = store
</script>

<template>
  <p>{{ totalAktif }} item tersisa</p>
  <div v-for="todo in filteredTodos" :key="todo.id">
    <input type="checkbox" :checked="todo.selesai" @change="toggleTodo(todo.id)" />
    <span>{{ todo.teks }}</span>
    <button @click="removeTodo(todo.id)">❌</button>
  </div>
</template>
```

---

**Sebelumnya:** [← Bab 16 — Router Lanjutan](./16-vue-router-lanjutan.md)
**Selanjutnya:** [Bab 18 — Pinia Lanjutan →](./18-pinia-lanjutan.md)
