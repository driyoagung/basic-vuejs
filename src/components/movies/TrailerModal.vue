<script setup>
import { X, Play, Video, AlertCircle } from '@lucide/vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  trailerKey: { type: String, default: '' },
  movieTitle: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />
    <div class="relative bg-[#1a1a1a] rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden border border-white/10">
      <div class="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h3 class="text-white text-lg font-semibold flex items-center gap-2">
          <Video class="w-5 h-5 text-red-500" />
          {{ movieTitle }} — Trailer
        </h3>
        <button @click="close" class="text-white/60 hover:text-white cursor-pointer p-1">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div v-if="trailerKey" class="aspect-video">
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`"
          :title="`${movieTitle} Trailer`"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full"
        />
      </div>

      <div v-else class="p-12 text-center">
        <AlertCircle class="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p class="text-white/60 text-lg mb-2">No trailer available</p>
        <p class="text-white/30 text-sm">Trailer untuk "{{ movieTitle }}" belum tersedia di TMDB.</p>
      </div>
    </div>
  </div>
</template>
