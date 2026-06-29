<script setup>
// ============================================================
// BaseCard.vue — Reusable Card Container
// [MATERI FASE 2: SLOTS (Default & Named)]
// ============================================================
defineProps({
  hoverable: { type: Boolean, default: false },
  noPadding: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="[
    'bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200',
    hoverable ? 'hover:shadow-lg hover:-translate-y-0.5' : ''
  ]">
    <div v-if="$slots.header" class="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4">
      <slot name="header" />
    </div>

    <div :class="noPadding ? '' : 'p-5'">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
      <slot name="footer" />
    </div>
  </div>
</template>
