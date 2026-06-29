<script setup>
// ============================================================
// BaseBadge.vue — Status Badge Component
// [MATERI FASE 1: PROPS & CLASS BINDING]
// ============================================================
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'success', 'danger', 'warning'].includes(v),
  },
  size: { type: String, default: 'sm' },
  dot:  { type: Boolean, default: false },
})

const variantClasses = {
  default: 'bg-slate-100 text-slate-600',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-emerald-50 text-emerald-700',
  danger:  'bg-red-50 text-red-700',
  warning: 'bg-amber-50 text-amber-700',
}

const dotClasses = {
  default: 'bg-slate-400',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  danger:  'bg-red-500',
  warning: 'bg-amber-500',
}
</script>

<template>
  <span :class="[
    'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
    variantClasses[variant],
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
  ]">
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', dotClasses[variant]]" />
    <slot />
  </span>
</template>
