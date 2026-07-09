<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  movies: { type: Array, default: () => [] },
})

const scrollContainer = ref(null)

const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = scrollContainer.value.clientWidth * 0.75
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="mb-8 md:mb-12">
    <h2 class="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12">{{ title }}</h2>
    <div class="group/row relative">
      <button
        @click="scroll('left')"
        class="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronLeft class="w-8 h-8 text-white" />
      </button>

      <div
        ref="scrollContainer"
        class="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>

      <button
        @click="scroll('right')"
        class="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer"
      >
        <ChevronRight class="w-8 h-8 text-white" />
      </button>
    </div>
  </div>
</template>
