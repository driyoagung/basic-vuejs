import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { movieService } from '@/api/movieService'

export const useMovieStore = defineStore('movies', () => {
  const trending = ref([])
  const popular = ref([])
  const topRated = ref([])
  const upcoming = ref([])
  const nowPlaying = ref([])
  const genres = ref([])
  const moviesByGenre = ref({})
  const searchResults = ref([])
  const selectedMovie = ref(null)
  const selectedPerson = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  const featuredMovie = computed(() => {
    if (trending.value.length > 0) {
      return trending.value[Math.floor(Math.random() * Math.min(5, trending.value.length))]
    }
    return null
  })

  const fetchAllCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      const [trendingRes, popularRes, topRatedRes, upcomingRes, nowPlayingRes, genresRes] =
        await Promise.all([
          movieService.getTrending(),
          movieService.getPopular(),
          movieService.getTopRated(),
          movieService.getUpcoming(),
          movieService.getNowPlaying(),
          movieService.getGenres(),
        ])
      trending.value = trendingRes.results
      popular.value = popularRes.results
      topRated.value = topRatedRes.results
      upcoming.value = upcomingRes.results
      nowPlaying.value = nowPlayingRes.results
      genres.value = genresRes

      const genrePromises = genresRes.slice(0, 4).map(async (genre) => {
        const res = await movieService.getMoviesByGenre(genre.id)
        moviesByGenre.value[genre.id] = res.results
      })
      await Promise.all(genrePromises)
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchMovieDetail = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await movieService.getMovieDetail(id)
      selectedMovie.value = data
      return data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const searchMovies = async (query) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }
    isLoading.value = true
    error.value = null
    try {
      const data = await movieService.searchMovies(query)
      searchResults.value = data.results
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const clearSearch = () => {
    searchResults.value = []
    searchQuery.value = ''
  }

  const fetchPersonDetail = async (id) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await movieService.getPersonDetail(id)
      selectedPerson.value = data
      return data
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const clearPerson = () => {
    selectedPerson.value = null
  }

  return {
    trending,
    popular,
    topRated,
    upcoming,
    nowPlaying,
    genres,
    moviesByGenre,
    searchResults,
    selectedMovie,
    selectedPerson,
    isLoading,
    error,
    searchQuery,
    featuredMovie,
    fetchAllCategories,
    fetchMovieDetail,
    fetchPersonDetail,
    clearPerson,
    searchMovies,
    clearSearch,
  }
})
