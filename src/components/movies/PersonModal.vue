<script setup>
import { computed } from 'vue'
import { X, Star, Calendar } from '@lucide/vue'
import { imageUrl } from '@/api/movieService'
import { useRouter } from 'vue-router'

const props = defineProps({
  person: { type: Object, required: true },
})

const emit = defineEmits(['close', 'select-movie'])

const router = useRouter()

const castMovies = computed(() => {
  if (!props.person?.movie_credits?.cast) return []
  return props.person.movie_credits.cast
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20)
})

const knownFor = computed(() => {
  if (!props.person?.movie_credits?.cast) return '-'
  const sorted = [...props.person.movie_credits.cast].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
  return sorted.slice(0, 3).map((m) => m.title).join(', ') || '-'
})

const selectMovie = (movie) => {
  emit('close')
  router.push({ name: 'movie-detail', params: { id: movie.id } })
}

const close = () => {
  emit('close')
}
</script>

<template>
  <div v-if="person" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />
    <div class="relative bg-[#1a1a1a] rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
      <div class="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h3 class="text-white text-lg font-semibold">{{ person.name }}</h3>
        <button @click="close" class="text-white/60 hover:text-white cursor-pointer p-1">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <div class="flex gap-5 mb-6">
          <img
            :src="person.profile_path ? imageUrl(person.profile_path, 'w185') : 'https://via.placeholder.com/185x278/1a1a1a/666?text=No+Photo'"
            :alt="person.name"
            class="w-28 h-36 rounded-lg object-cover flex-shrink-0"
          />
          <div class="space-y-2 min-w-0">
            <p v-if="person.known_for_department" class="text-white/50 text-xs uppercase tracking-wider">Known For</p>
            <p class="text-white font-medium text-sm">{{ knownFor }}</p>
            <div class="flex flex-wrap gap-4 text-sm text-white/60 pt-2">
              <span v-if="person.birthday" class="flex items-center gap-1">
                <Calendar class="w-3.5 h-3.5" />
                {{ person.birthday }}
              </span>
              <span v-if="person.place_of_birth" class="truncate max-w-[200px]">
                {{ person.place_of_birth }}
              </span>
            </div>
            <p v-if="person.biography" class="text-white/50 text-xs line-clamp-4 mt-2">
              {{ person.biography }}
            </p>
          </div>
        </div>

        <h4 class="text-white font-semibold mb-3">Movies ({{ castMovies.length }})</h4>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <div
            v-for="movie in castMovies"
            :key="movie.id"
            @click="selectMovie(movie)"
            class="group cursor-pointer"
          >
            <img
              :src="imageUrl(movie.poster_path, 'w185')"
              :alt="movie.title"
              class="w-full aspect-[2/3] object-cover rounded-md group-hover:ring-2 group-hover:ring-red-500 transition-all"
              loading="lazy"
            />
            <p class="text-white/80 text-xs mt-1.5 line-clamp-2 group-hover:text-white transition-colors">{{ movie.title }}</p>
            <div class="flex items-center gap-1 text-[10px] text-white/40 mt-0.5">
              <Star class="w-2.5 h-2.5" />
              {{ movie.vote_average?.toFixed(1) || '-' }}
              <span class="ml-auto">{{ movie.release_date?.slice(0, 4) || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
