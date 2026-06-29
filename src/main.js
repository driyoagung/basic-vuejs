import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// [MATERI FASE 3: PINIA — initFromStorage]
// Muat kembali sesi user dari localStorage sebelum app di-mount.
// Ini agar status login tidak hilang saat user me-refresh halaman.
const authStore = useAuthStore()
authStore.initFromStorage()

app.mount('#app')
