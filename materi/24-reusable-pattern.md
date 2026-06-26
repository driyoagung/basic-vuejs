# Bab 24: Reusable Component Patterns

## 1️⃣ Base/Generic Components

### BaseButton

```vue
<!-- src/components/ui/BaseButton.vue -->
<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger
  size: { type: String, default: 'md' },         // sm, md, lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button 
    :class="['btn', `btn-${variant}`, `btn-${size}`]"
    :disabled="disabled || loading"
  >
    <span v-if="loading">⏳</span>
    <slot />
  </button>
</template>
```

### BaseModal

```vue
<!-- src/components/ui/BaseModal.vue -->
<script setup>
defineProps({ show: Boolean, title: String, size: { type: String, default: 'md' } })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div :class="['modal-content', `modal-${size}`]">
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button @click="$emit('close')">✕</button>
          </div>
          <div class="modal-body"><slot /></div>
          <div class="modal-footer"><slot name="footer" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

---

## 2️⃣ Data Table Component

```vue
<!-- src/components/ui/DataTable.vue -->
<script setup>
defineProps({
  columns: Array,  // [{ key: 'nama', label: 'Nama' }, ...]
  data: Array,
  loading: Boolean,
})
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        <th><slot name="header-actions">Aksi</slot></th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td :colspan="columns.length + 1">Loading...</td>
      </tr>
      <tr v-else-if="!data?.length">
        <td :colspan="columns.length + 1">Tidak ada data</td>
      </tr>
      <tr v-for="row in data" :key="row.id" v-else>
        <td v-for="col in columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
            {{ row[col.key] }}
          </slot>
        </td>
        <td>
          <slot name="actions" :row="row" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

Penggunaan:
```vue
<DataTable :columns="columns" :data="products">
  <template #cell-harga="{ value }">
    Rp {{ value?.toLocaleString() }}
  </template>
  <template #actions="{ row }">
    <button @click="edit(row)">✏️</button>
    <button @click="hapus(row.id)">🗑️</button>
  </template>
</DataTable>
```

---

## 3️⃣ Compound Components (Tabs)

```vue
<!-- Tabs.vue -->
<script setup>
import { provide, ref } from 'vue'
const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const activeTab = ref(props.modelValue)
provide('activeTab', activeTab)
provide('setTab', (val) => {
  activeTab.value = val
  emit('update:modelValue', val)
})
</script>

<template><div class="tabs"><slot /></div></template>
```

```vue
<!-- TabPanel.vue -->
<script setup>
import { inject } from 'vue'
const props = defineProps({ name: String })
const activeTab = inject('activeTab')
</script>

<template>
  <div v-show="activeTab === name"><slot /></div>
</template>
```

---

**Sebelumnya:** [← Bab 23 — Error Handling](./23-error-handling.md)
**Selanjutnya:** [Bab 25 — Performance →](./25-performance.md)
