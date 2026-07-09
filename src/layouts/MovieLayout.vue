<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { Search, X, Film } from '@lucide/vue'
import { useMovieStore } from '@/stores/movieStore'

const movieStore = useMovieStore()
const router = useRouter()
const isScrolled = ref(false)
const showSearch = ref(false)
const searchInput = ref(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    setTimeout(() => searchInput.value?.focus(), 100)
  } else {
    movieStore.clearSearch()
  }
}

const handleSearch = (e) => {
  movieStore.searchMovies(e.target.value)
}

const goHome = () => {
  movieStore.clearSearch()
  router.push({ name: 'movies' })
}
</script>

<template>
  <div class="min-h-screen bg-[#141414]">
    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-12',
        isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
      ]"
    >
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <button @click="goHome" class="flex items-center gap-2 cursor-pointer">
            <Film class="w-8 h-8 text-red-600" />
            <span class="text-red-600 text-2xl font-bold tracking-tight hidden sm:inline">VueFlix</span>
          </button>
          <div class="hidden md:flex items-center gap-6">
            <button @click="goHome" class="text-sm text-white/90 hover:text-white transition-colors cursor-pointer">Home</button>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div v-if="showSearch" class="flex items-center bg-black/80 border border-white/30 rounded">
            <Search class="w-4 h-4 text-white/70 ml-3" />
            <input
              ref="searchInput"
              type="text"
              placeholder="Titles, people, genres"
              class="bg-transparent text-white text-sm px-3 py-2 w-48 md:w-64 outline-none placeholder:text-white/50"
              @input="handleSearch"
            />
            <button @click="toggleSearch" class="p-2 text-white/70 hover:text-white cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>
          <button v-else @click="toggleSearch" class="p-2 text-white/80 hover:text-white cursor-pointer">
            <Search class="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

    <main>
      <RouterView />
    </main>

    <footer class="bg-[#141414] border-t border-white/5 py-8 px-4 md:px-12">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-white/30 text-sm">VueFlix &copy; 2025 — Powered by TMDB API</p>
      </div>
    </footer>
  </div>
</template>
