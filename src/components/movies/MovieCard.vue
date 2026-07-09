<script setup>
import { useRouter } from 'vue-router'
import { imageUrl } from '@/api/movieService'

const props = defineProps({
  movie: { type: Object, required: true },
  size: { type: String, default: 'normal' },
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })
}

const year = props.movie.release_date?.slice(0, 4) || '-'
const rating = props.movie.vote_average?.toFixed(1) || '-'
</script>

<template>
  <div
    @click="goToDetail"
    :class="[
      'group relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/50',
      size === 'large' ? 'w-[200px] md:w-[250px]' : 'w-[150px] md:w-[200px]'
    ]"
  >
    <img
      :src="imageUrl(movie.poster_path, 'w342')"
      :alt="movie.title"
      class="w-full aspect-[2/3] object-cover"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <h3 class="text-white text-sm font-semibold line-clamp-2 mb-1">{{ movie.title }}</h3>
        <div class="flex items-center gap-2 text-xs text-white/70">
          <span class="text-green-400 font-semibold">{{ rating }}★</span>
          <span>{{ year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
