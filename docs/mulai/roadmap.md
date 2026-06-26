# Roadmap Belajar

Panduan ini disusun dalam **5 fase** yang harus dipelajari secara berurutan. Setiap fase membangun fondasi untuk fase berikutnya.

## Alur Pembelajaran

```
┌─────────────────────────────────────────────────────────┐
│              🟢 FASE 1: FONDASI VUE.JS                  │
│  Template Syntax → Reactivity → Events → Form → Style  │
│  (Pahami dasar Vue: template, data binding, directive)  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           🟡 FASE 2: COMPONENT SYSTEM                   │
│  Component → Props → Emit → Slots → Lifecycle          │
│  (Pecah UI jadi komponen, komunikasi antar komponen)    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│          🟠 FASE 3: ROUTING & STATE MANAGEMENT          │
│  Vue Router → Navigation Guard → Pinia                  │
│  (Navigasi multi-halaman, state global)                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           🔴 FASE 4: CONSUME API & FULLSTACK            │
│  Axios → CRUD → Auth Sanctum → Upload → Error          │
│  (Hubungkan Vue dengan Laravel API)                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│          🟣 FASE 5: PATTERN & BEST PRACTICES            │
│  Reusable → Performance → Testing → Deploy              │
│  (Optimasi, testing, dan deploy ke production)          │
└─────────────────────────────────────────────────────────┘
```

## Daftar Materi Per Fase

### 🟢 Fase 1 — Fondasi Vue.js

| # | Topik | Deskripsi |
|---|-------|-----------|
| 1 | [Template Syntax & Data Binding](/fase-1/template-syntax) | Interpolasi `{{ }}`, directive `v-bind`, `v-html` |
| 2 | [Reactivity (ref, reactive, computed)](/fase-1/reactivity) | Sistem reactive Vue: `ref()`, `reactive()`, `computed()`, `watch()` |
| 3 | [Event Handling & Methods](/fase-1/event-handling) | `v-on` / `@`, event modifier, key modifier |
| 4 | [Conditional & List Rendering](/fase-1/conditional-list) | `v-if`, `v-else`, `v-show`, `v-for`, `:key` |
| 5 | [Form Input Binding](/fase-1/form-binding) | `v-model` untuk input, checkbox, radio, select |
| 6 | [Class & Style Binding](/fase-1/class-style-binding) | Dynamic class, inline style, object & array syntax |

### 🟡 Fase 2 — Component System

| # | Topik | Deskripsi |
|---|-------|-----------|
| 7 | [Pengenalan Component](/fase-2/components) | SFC, registrasi, naming convention, organisasi file |
| 8 | [Props & Validation](/fase-2/props) | Passing data parent→child, type validation, default |
| 9 | [Events & Emit](/fase-2/emit-events) | Child→parent communication, `defineEmits`, `v-model` custom |
| 10 | [Slots & Scoped Slots](/fase-2/slots) | Default slot, named slot, scoped slot |
| 11 | [Provide & Inject](/fase-2/provide-inject) | Dependency injection lintas level komponen |
| 12 | [Component Lifecycle](/fase-2/lifecycle) | `onMounted`, `onUnmounted`, dan hooks lainnya |
| 13 | [Composables](/fase-2/composables) | Reusable logic pattern (`useCounter`, `useFetch`, dll) |

### 🟠 Fase 3 — Routing & State Management

| # | Topik | Deskripsi |
|---|-------|-----------|
| 14 | [Vue Router — Dasar](/fase-3/vue-router-dasar) | Setup, `RouterLink`, `RouterView`, programmatic navigation |
| 15 | [Vue Router — Lanjutan](/fase-3/vue-router-lanjutan) | Dynamic route, nested route, navigation guard, 404 |
| 16 | [Pinia — State Management](/fase-3/pinia) | Store, state, getters, actions |
| 17 | [Pinia — Lanjutan](/fase-3/pinia-lanjutan) | Persist state, `$subscribe`, store di luar component |

### 🔴 Fase 4 — Consume API & Fullstack

| # | Topik | Deskripsi |
|---|-------|-----------|
| 18 | [HTTP Request (Axios)](/fase-4/axios) | Setup axios, interceptor, CRUD operations |
| 19 | [CRUD Fullstack](/fase-4/crud-fullstack) | Vue + Laravel API integration, CORS, resource |
| 20 | [Auth (Laravel Sanctum)](/fase-4/auth-sanctum) | Login/register, token, protected route |
| 21 | [Upload File & Media](/fase-4/upload-file) | FormData, preview, progress bar, drag & drop |
| 22 | [Error Handling & Loading](/fase-4/error-handling) | Try-catch, skeleton loader, toast notification |

### 🟣 Fase 5 — Best Practices

| # | Topik | Deskripsi |
|---|-------|-----------|
| 23 | [Reusable Patterns](/fase-5/reusable-pattern) | Base components, data table, compound component |
| 24 | [Performance](/fase-5/performance) | Lazy loading, `v-memo`, `shallowRef`, code splitting |
| 25 | [Testing](/fase-5/testing) | Vitest, Vue Test Utils, test component & store |
| 26 | [Deployment](/fase-5/deployment) | Build production, env variables, Nginx, Vercel |

## Prasyarat

::: warning Sebelum Mulai
Pastikan kamu sudah memahami dasar-dasar berikut:
- **HTML & CSS** — struktur halaman dan styling
- **JavaScript ES6+** — arrow function, destructuring, template literal, async/await, modules
- **Terminal/Command Line** — navigasi folder, menjalankan perintah npm
- **Node.js & npm** — sudah terinstall (Node.js v18+)
:::

## Mulai Belajar

Siap? Mulai dari [Pengenalan Vue.js](/mulai/pengenalan) atau langsung ke [Template Syntax & Data Binding](/fase-1/template-syntax)!
