<script setup>
import { ref, computed, watch } from 'vue'
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Play, Star, Calendar, Clock, Globe, User } from '@lucide/vue'
import { useMovieStore } from '@/stores/movieStore'
import { imageUrl } from '@/api/movieService'
import MovieRow from '@/components/movies/MovieRow.vue'
import MovieCard from '@/components/movies/MovieCard.vue'
import PersonModal from '@/components/movies/PersonModal.vue'
import TrailerModal from '@/components/movies/TrailerModal.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const showTrailer = ref(false)
const showPerson = ref(false)
const trailerKey = ref('')

const movie = computed(() => movieStore.selectedMovie)
const person = computed(() => movieStore.selectedPerson)

const director = computed(() => {
  if (!movie.value?.credits?.crew) return '-'
  const d = movie.value.credits.crew.find((c) => c.job === 'Director')
  return d?.name || '-'
})

const youtubeTrailer = computed(() => {
  if (!movie.value?.videos?.results) return null
  return movie.value.videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
})

const loadMovie = async (id) => {
  window.scrollTo(0, 0)
  showTrailer.value = false
  showPerson.value = false
  movieStore.clearPerson()
  await movieStore.fetchMovieDetail(id)
}

onMounted(() => loadMovie(route.params.id))

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) loadMovie(newId)
})

const goBack = () => {
  router.push({ name: 'movies' })
}

const formatRuntime = (min) => {
  if (!min) return '-'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const handlePlay = async () => {
  if (youtubeTrailer.value) {
    trailerKey.value = youtubeTrailer.value.key
    showTrailer.value = true
  } else {
    trailerKey.value = ''
    showTrailer.value = true
  }
}

const openPerson = async (personId) => {
  await movieStore.fetchPersonDetail(personId)
  showPerson.value = true
}

const closePerson = () => {
  showPerson.value = false
  movieStore.clearPerson()
}

const closeTrailer = () => {
  showTrailer.value = false
  trailerKey.value = ''
}
</script>

<template>
  <div class="min-h-screen">
    <div v-if="movieStore.isLoading" class="flex items-center justify-center h-screen">
      <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <div v-else-if="movie">
      <div class="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <div class="absolute inset-0">
          <img
            :src="imageUrl(movie.backdrop_path, 'original')"
            :alt="movie.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
        </div>

        <button
          @click="goBack"
          class="absolute top-20 left-4 md:left-12 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-5 h-5" />
          <span class="text-sm">Back</span>
        </button>

        <div class="relative h-full flex items-end pb-12 px-4 md:px-12">
          <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <img
              :src="imageUrl(movie.poster_path, 'w342')"
              :alt="movie.title"
              class="w-32 md:w-48 rounded-lg shadow-2xl hidden md:block"
            />
            <div class="flex-1 space-y-4">
              <h1 class="text-3xl md:text-5xl font-bold text-white">{{ movie.title }}</h1>
              <div class="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span class="text-green-400 font-bold flex items-center gap-1">
                  <Star class="w-4 h-4 fill-green-400" />
                  {{ movie.vote_average?.toFixed(1) }}
                </span>
                <span class="flex items-center gap-1">
                  <Calendar class="w-4 h-4" />
                  {{ movie.release_date?.slice(0, 4) || '-' }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-4 h-4" />
                  {{ formatRuntime(movie.runtime) }}
                </span>
                <span v-if="movie.original_language" class="flex items-center gap-1">
                  <Globe class="w-4 h-4" />
                  {{ movie.original_language.toUpperCase() }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  class="px-3 py-1 text-xs font-medium text-white/90 bg-white/10 rounded-full border border-white/20"
                >
                  {{ genre.name }}
                </span>
              </div>
              <p class="text-white/70 text-sm md:text-base max-w-2xl">{{ movie.overview || 'No overview available.' }}</p>
              <div class="flex items-center gap-3 pt-2">
                <button
                  @click="handlePlay"
                  class="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-md hover:bg-white/80 transition-colors cursor-pointer"
                >
                  <Play class="w-5 h-5 fill-black" />
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 md:px-12 py-8 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white/5 rounded-lg p-5 border border-white/10">
            <h3 class="text-white/50 text-xs uppercase tracking-wider mb-2">Director</h3>
            <p class="text-white font-semibold">{{ director }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-5 border border-white/10">
            <h3 class="text-white/50 text-xs uppercase tracking-wider mb-2">Status</h3>
            <p class="text-white font-semibold">{{ movie.status || '-' }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-5 border border-white/10">
            <h3 class="text-white/50 text-xs uppercase tracking-wider mb-2">Budget / Revenue</h3>
            <p class="text-white font-semibold text-sm">
              <span v-if="movie.budget">${{ (movie.budget / 1_000_000).toFixed(0) }}M</span>
              <span v-else>-</span>
              /
              <span v-if="movie.revenue">${{ (movie.revenue / 1_000_000).toFixed(0) }}M</span>
              <span v-else>-</span>
            </p>
          </div>
        </div>

        <div v-if="movie.credits?.cast?.length">
          <h2 class="text-white text-lg md:text-xl font-bold mb-4">Cast</h2>
          <div class="flex gap-3 overflow-x-auto pb-2" style="scrollbar-width: none;">
            <div
              v-for="personItem in movie.credits.cast.slice(0, 15)"
              :key="personItem.id"
              @click="openPerson(personItem.id)"
              class="flex-shrink-0 w-24 text-center cursor-pointer group"
            >
              <img
                :src="personItem.profile_path ? imageUrl(personItem.profile_path, 'w185') : 'https://via.placeholder.com/185x278/1a1a1a/666?text=No+Photo'"
                :alt="personItem.name"
                class="w-20 h-20 rounded-full object-cover mx-auto mb-2 group-hover:ring-2 group-hover:ring-red-500 transition-all"
                loading="lazy"
              />
              <p class="text-white text-xs font-medium truncate group-hover:text-red-400 transition-colors">{{ personItem.name }}</p>
              <p class="text-white/40 text-[10px] truncate">{{ personItem.character }}</p>
            </div>
          </div>
        </div>

        <MovieRow
          v-if="movie.similar?.results?.length"
          title="More Like This"
          :movies="movie.similar.results"
        />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-screen text-white/60">
      <p class="text-lg">Movie not found</p>
      <button @click="goBack" class="mt-4 text-red-500 hover:text-red-400 cursor-pointer">Go back home</button>
    </div>

    <TrailerModal
      :show="showTrailer"
      :trailer-key="trailerKey"
      :movie-title="movie?.title || ''"
      @close="closeTrailer"
    />

    <PersonModal
      v-if="showPerson && person"
      :person="person"
      @close="closePerson"
    />
  </div>
</template>
