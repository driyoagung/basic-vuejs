<script setup>
// ============================================================
// BaseButton.vue — Reusable Button Component
// [MATERI FASE 2: PROPS & EMIT]
// [MATERI FASE 1: CLASS & STYLE BINDING]
// ============================================================
import { Loader2 } from '@lucide/vue'

// [MATERI FASE 2: PROPS]
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'danger', 'ghost', 'success'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
})

// [MATERI FASE 2: EMIT EVENTS]
defineEmits(['click'])

// [MATERI FASE 1: COMPUTED — dynamic class mapping]
const variantClasses = {
  primary:   'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30',
  secondary: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5',
  danger:    'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30',
  success:   'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5',
  ghost:     'bg-transparent text-primary-600 border-transparent hover:bg-primary-50',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium border-[1.5px] rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap relative overflow-hidden',
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-60 cursor-not-allowed !translate-y-0 !shadow-none': disabled || loading },
      { 'w-full': fullWidth }
    ]"
    @click="$emit('click', $event)"
  >
    <!-- [MATERI FASE 1: CONDITIONAL RENDERING] -->
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <slot />
  </button>
</template>
