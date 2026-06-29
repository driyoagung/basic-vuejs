<script setup>
// ============================================================
// BaseInput.vue — Reusable Input Component
// [MATERI FASE 2: PROPS, EMIT, v-model Pattern]
// [MATERI FASE 1: FORM INPUT BINDING]
// ============================================================
import { TriangleAlert } from '@lucide/vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:       { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type:        { type: String, default: 'text' },
  id:          { type: String, required: true },
  error:       { type: String, default: '' },
  hint:        { type: String, default: '' },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
})

// [MATERI FASE 2: EMIT — v-model Contract]
const emit = defineEmits(['update:modelValue'])
const handleInput = (event) => emit('update:modelValue', event.target.value)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <div class="relative flex items-center">
      <!-- [MATERI FASE 2: SLOTS (Named Slot)] -->
      <span v-if="$slots.prepend" class="absolute left-3 text-slate-400 flex items-center pointer-events-none">
        <slot name="prepend" />
      </span>

      <!--
        [MATERI FASE 1: FORM INPUT BINDING & ATTRIBUTE BINDING]
        :value + @input = manual v-model untuk komponen kustom
      -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full py-2.5 px-3.5 text-sm text-slate-800 bg-white border-[1.5px] border-slate-200 rounded-lg outline-none transition-all duration-150',
          'placeholder:text-slate-400',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : '',
          disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : '',
          $slots.prepend ? 'pl-10' : ''
        ]"
        :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
        :aria-invalid="!!error"
        @input="handleInput"
      />
    </div>

    <!-- Error message -->
    <p v-if="error" :id="`${id}-error`" class="flex items-center gap-1 text-xs text-red-500" role="alert">
      <TriangleAlert class="w-3.5 h-3.5 flex-shrink-0" />
      {{ error }}
    </p>
    <!-- Hint -->
    <p v-else-if="hint" :id="`${id}-hint`" class="text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
