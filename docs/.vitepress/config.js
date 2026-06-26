import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Belajar Vue.js',
  description: 'Panduan lengkap belajar Vue.js 3 dari dasar hingga fullstack dengan Laravel',
  lang: 'id-ID',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
  ],

  themeConfig: {
    logo: '/vue-logo.svg',
    siteTitle: 'Belajar Vue.js',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Panduan', link: '/mulai/pengenalan' },
      {
        text: 'Fase',
        items: [
          { text: '🟢 Fase 1 — Fondasi', link: '/fase-1/template-syntax' },
          { text: '🟡 Fase 2 — Component', link: '/fase-2/components' },
          { text: '🟠 Fase 3 — Router & State', link: '/fase-3/vue-router-dasar' },
          { text: '🔴 Fase 4 — Fullstack', link: '/fase-4/axios' },
          { text: '🟣 Fase 5 — Best Practices', link: '/fase-5/reusable-pattern' },
        ],
      },
    ],

    sidebar: [
      {
        text: '🚀 Mulai',
        collapsed: false,
        items: [
          { text: 'Pengenalan Vue.js', link: '/mulai/pengenalan' },
          { text: 'Roadmap Belajar', link: '/mulai/roadmap' },
        ],
      },
      {
        text: '🟢 Fase 1 — Fondasi',
        collapsed: false,
        items: [
          { text: 'Template Syntax & Data Binding', link: '/fase-1/template-syntax' },
          { text: 'Reactivity (ref, reactive, computed)', link: '/fase-1/reactivity' },
          { text: 'Event Handling & Methods', link: '/fase-1/event-handling' },
          { text: 'Conditional & List Rendering', link: '/fase-1/conditional-list' },
          { text: 'Form Input Binding', link: '/fase-1/form-binding' },
          { text: 'Class & Style Binding', link: '/fase-1/class-style-binding' },
        ],
      },
      {
        text: '🟡 Fase 2 — Component System',
        collapsed: false,
        items: [
          { text: 'Pengenalan Component', link: '/fase-2/components' },
          { text: 'Props & Validation', link: '/fase-2/props' },
          { text: 'Events & Emit', link: '/fase-2/emit-events' },
          { text: 'Slots & Scoped Slots', link: '/fase-2/slots' },
          { text: 'Provide & Inject', link: '/fase-2/provide-inject' },
          { text: 'Component Lifecycle', link: '/fase-2/lifecycle' },
          { text: 'Composables (Custom Hooks)', link: '/fase-2/composables' },
        ],
      },
      {
        text: '🟠 Fase 3 — Routing & State',
        collapsed: true,
        items: [
          { text: 'Vue Router — Dasar', link: '/fase-3/vue-router-dasar' },
          { text: 'Vue Router — Lanjutan', link: '/fase-3/vue-router-lanjutan' },
          { text: 'Pinia — State Management', link: '/fase-3/pinia' },
          { text: 'Pinia — Lanjutan', link: '/fase-3/pinia-lanjutan' },
        ],
      },
      {
        text: '🔴 Fase 4 — Fullstack (Vue + Laravel)',
        collapsed: true,
        items: [
          { text: 'HTTP Request dengan Axios', link: '/fase-4/axios' },
          { text: 'CRUD Fullstack', link: '/fase-4/crud-fullstack' },
          { text: 'Auth (Laravel Sanctum)', link: '/fase-4/auth-sanctum' },
          { text: 'Upload File & Media', link: '/fase-4/upload-file' },
          { text: 'Error Handling & Loading', link: '/fase-4/error-handling' },
        ],
      },
      {
        text: '🟣 Fase 5 — Best Practices',
        collapsed: true,
        items: [
          { text: 'Reusable Component Pattern', link: '/fase-5/reusable-pattern' },
          { text: 'Performance Optimization', link: '/fase-5/performance' },
          { text: 'Keamanan SPA (Security)', link: '/fase-5/keamanan-spa' },
          { text: 'Transisi & Animasi', link: '/fase-5/transisi-animasi' },
          { text: 'Testing (Vitest)', link: '/fase-5/testing' },
          { text: 'Deployment & Build', link: '/fase-5/deployment' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/driyoagung/basic-vuejs' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Cari...', buttonAriaLabel: 'Cari' },
          modal: {
            noResultsText: 'Tidak ditemukan',
            resetButtonTitle: 'Reset',
            footer: { selectText: 'Pilih', navigateText: 'Navigasi', closeText: 'Tutup' },
          },
        },
      },
    },

    outline: {
      label: 'Di Halaman Ini',
      level: [2, 3],
    },

    docFooter: {
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
    },

    editLink: {
      pattern: 'https://github.com/driyoagung/basic-vuejs/edit/main/docs/:path',
      text: 'Edit halaman ini',
    },

    lastUpdated: {
      text: 'Terakhir diperbarui',
    },

    footer: {
      message: 'Dibuat dengan ❤️ menggunakan VitePress',
      copyright: '© 2026 Belajar Vue.js',
    },

    returnToTopLabel: 'Kembali ke atas',
  },
})
