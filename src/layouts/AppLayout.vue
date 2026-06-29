<script setup>
// ============================================================
// AppLayout.vue — Main Application Shell
// [MATERI FASE 2: LIFECYCLE + PROVIDE/INJECT]
// [MATERI FASE 3: PINIA, VUE ROUTER]
// ============================================================
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, Package, LogOut, Menu, X,
  ChevronRight, Zap, Calendar
} from '@lucide/vue'

const isSidebarOpen = ref(true)

const handleResize = () => {
  isSidebarOpen.value = window.innerWidth >= 1024
}

// [MATERI FASE 2: LIFECYCLE — onMounted & onUnmounted]
onMounted(() => { handleResize(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize) })

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => route.meta?.title ?? 'Dashboard')

const logout = () => { authStore.logout(); router.push({ name: 'login' }) }

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', name: 'dashboard' },
  { icon: Package,         label: 'Produk',    name: 'products' },
]
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- SIDEBAR -->
    <aside :class="[
      'fixed top-0 left-0 z-50 h-screen flex flex-col w-[260px] bg-sidebar transition-transform duration-300 lg:sticky lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-white/[0.08]">
        <div class="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
          <Zap class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold text-white tracking-tight">VueStore</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-indigo-200/80 hover:bg-white/[0.06] hover:text-white transition-all duration-150"
          active-class="!bg-primary-600/30 !text-white"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
          <span class="flex-1">{{ item.label }}</span>
          <ChevronRight class="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200" />
        </RouterLink>
      </nav>

      <!-- User Section -->
      <div class="flex items-center gap-3 px-4 py-4 border-t border-white/[0.08] mt-auto">
        <div class="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {{ authStore.userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.name ?? 'User' }}</p>
          <p class="text-[11px] text-indigo-300/70 capitalize">{{ authStore.user?.role ?? 'guest' }}</p>
        </div>
        <button
          @click="logout"
          title="Keluar"
          class="p-1.5 rounded-md hover:bg-white/10 text-indigo-300/60 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-6 shadow-sm">
        <button
          @click="isSidebarOpen = !isSidebarOpen"
          class="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu v-if="!isSidebarOpen" class="w-5 h-5 text-slate-600" />
          <X v-else class="w-5 h-5 text-slate-600" />
        </button>

        <h1 class="text-lg font-semibold text-slate-800 flex-1">{{ pageTitle }}</h1>

        <div class="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <Calendar class="w-4 h-4" />
          {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) }}
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
