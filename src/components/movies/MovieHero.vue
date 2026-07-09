<script setup>
import { useRouter } from 'vue-router'
import { Play, Info } from '@lucide/vue'
import { imageUrl } from '@/api/movieService'

const props = defineProps({
  movie: { type: Object, required: true },
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })
}

const rating = props.movie.vote_average?.toFixed(1) || '-'
const year = props.movie.release_date?.slice(0, 4) || '-'
</script>

<template>
  <div class="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
    <div class="absolute inset-0">
      <img
        :src="imageUrl(movie.backdrop_path, 'original')"
        :alt="movie.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
    </div>

    <div class="relative h-full flex items-center px-4 md:px-12">
      <div class="max-w-xl space-y-4">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {{ movie.title }}
        </h1>
        <div class="flex items-center gap-3 text-sm text-white/80">
          <span class="text-green-400 font-bold">{{ rating }}★</span>
          <span>{{ year }}</span>
          <span v-if="movie.genre_ids" class="hidden md:inline">
            {{ movie.overview?.slice(0, 100) }}{{ movie.overview?.length > 100 ? '...' : '' }}
          </span>
        </div>
        <p class="text-white/70 text-sm md:text-base line-clamp-3 hidden md:block">
          {{ movie.overview }}
        </p>
        <div class="flex items-center gap-3 pt-2">
          <button
            @click="goToDetail"
            class="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-md hover:bg-white/80 transition-colors cursor-pointer"
          >
            <Play class="w-5 h-5 fill-black" />
            Play
          </button>
          <button
            @click="goToDetail"
            class="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-white/30 transition-colors cursor-pointer backdrop-blur-sm"
          >
            <Info class="w-5 h-5" />
            More Info
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
