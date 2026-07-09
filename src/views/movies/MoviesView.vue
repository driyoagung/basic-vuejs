<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from '@/stores/movieStore'
import MovieHero from '@/components/movies/MovieHero.vue'
import MovieRow from '@/components/movies/MovieRow.vue'
import MovieCard from '@/components/movies/MovieCard.vue'

const movieStore = useMovieStore()

onMounted(() => {
  if (movieStore.trending.length === 0) {
    movieStore.fetchAllCategories()
  }
})
</script>

<template>
  <div>
    <div v-if="movieStore.isLoading && movieStore.trending.length === 0" class="flex items-center justify-center h-screen">
      <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>

    <template v-else>
      <MovieHero v-if="movieStore.featuredMovie" :movie="movieStore.featuredMovie" />

      <div class="-mt-16 md:-mt-32 relative z-10">
        <div v-if="movieStore.searchResults.length > 0">
          <h2 class="text-white text-lg md:text-xl font-bold mb-3 px-4 md:px-12 pt-4">
            Search Results for "{{ movieStore.searchQuery }}"
          </h2>
          <div class="flex flex-wrap gap-2 px-4 md:px-12">
            <MovieCard v-for="movie in movieStore.searchResults" :key="movie.id" :movie="movie" />
          </div>
        </div>

        <template v-else>
          <MovieRow title="Trending Now" :movies="movieStore.trending" />
          <MovieRow title="Popular on VueFlix" :movies="movieStore.popular" />
          <MovieRow title="Top Rated" :movies="movieStore.topRated" />

          <MovieRow
            v-for="genre in movieStore.genres.slice(0, 4)"
            :key="genre.id"
            :title="genre.name"
            :movies="movieStore.moviesByGenre[genre.id] || []"
          />

          <MovieRow title="Upcoming" :movies="movieStore.upcoming" />
          <MovieRow title="Now Playing" :movies="movieStore.nowPlaying" />
        </template>
      </div>
    </template>
  </div>
</template>
