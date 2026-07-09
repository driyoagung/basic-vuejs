import axios from 'axios'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  },
  params: { language: 'en-US' },
})

export const imageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a1a/666?text=No+Image'
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const movieService = {
  getTrending: async (page = 1) => {
    const { data } = await tmdbApi.get('/trending/movie/week', { params: { page } })
    return data
  },

  getPopular: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/popular', { params: { page } })
    return data
  },

  getTopRated: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/top_rated', { params: { page } })
    return data
  },

  getUpcoming: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/upcoming', { params: { page } })
    return data
  },

  getNowPlaying: async (page = 1) => {
    const { data } = await tmdbApi.get('/movie/now_playing', { params: { page } })
    return data
  },

  getGenres: async () => {
    const { data } = await tmdbApi.get('/genre/movie/list')
    return data.genres
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const { data } = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, sort_by: 'popularity.desc', page },
    })
    return data
  },

  getMovieDetail: async (id) => {
    const { data } = await tmdbApi.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,similar,videos' },
    })
    return data
  },

  searchMovies: async (query, page = 1) => {
    const { data } = await tmdbApi.get('/search/movie', {
      params: { query, page, include_adult: false },
    })
    return data
  },

  getPersonDetail: async (id) => {
    const { data } = await tmdbApi.get(`/person/${id}`, {
      params: { append_to_response: 'movie_credits' },
    })
    return data
  },

  getMovieVideos: async (id) => {
    const { data } = await tmdbApi.get(`/movie/${id}/videos`)
    return data
  },
}
