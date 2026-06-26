# 🗺️ Roadmap Belajar Vue.js — Dari Dasar hingga Fullstack

> **Target:** Menguasai Vue.js 3 (Composition API) dari nol hingga mampu membangun aplikasi fullstack yang consume API Laravel.

---

## 📋 Daftar Materi

### 🟢 FASE 1 — Fondasi Vue.js (Beginner)

| Bab | Judul | File | Deskripsi |
|-----|-------|------|-----------|
| 01 | Pengenalan Vue.js & Setup Project | `01-pengenalan-vue.md` | Apa itu Vue.js, ekosistem, Vite, struktur project |
| 02 | Template Syntax & Data Binding | `02-template-syntax.md` | Interpolasi, directive (`v-bind`, `v-html`), dll |
| 03 | Reactivity & Ref / Reactive | `03-reactivity.md` | `ref()`, `reactive()`, `computed()`, `watch()` |
| 04 | Event Handling & Methods | `04-event-handling.md` | `v-on`, event modifier, method, inline handler |
| 05 | Conditional & List Rendering | `05-conditional-list.md` | `v-if`, `v-else`, `v-show`, `v-for`, `:key` |
| 06 | Form Input Binding | `06-form-binding.md` | `v-model`, checkbox, radio, select, modifier |
| 07 | Class & Style Binding | `07-class-style-binding.md` | Dynamic class, inline style, array/object syntax |

---

### 🟡 FASE 2 — Component System (Intermediate)

| Bab | Judul | File | Deskripsi |
|-----|-------|------|-----------|
| 08 | Pengenalan Component | `08-components.md` | SFC, registrasi, naming convention |
| 09 | Props & Validation | `09-props.md` | Passing data, type validation, default value |
| 10 | Events & Emit | `10-emit-events.md` | Child-to-parent communication, `defineEmits` |
| 11 | Slots & Scoped Slots | `11-slots.md` | Default slot, named slot, scoped slot |
| 12 | Provide & Inject | `12-provide-inject.md` | Dependency injection lintas komponen |
| 13 | Component Lifecycle | `13-lifecycle.md` | `onMounted`, `onUpdated`, `onUnmounted`, dll |
| 14 | Composables (Custom Hooks) | `14-composables.md` | Reusable logic, pattern, best practices |

---

### 🟠 FASE 3 — Routing & State Management (Intermediate-Advanced)

| Bab | Judul | File | Deskripsi |
|-----|-------|------|-----------|
| 15 | Vue Router — Dasar | `15-vue-router-dasar.md` | Setup, route config, `<RouterLink>`, `<RouterView>` |
| 16 | Vue Router — Lanjutan | `16-vue-router-lanjutan.md` | Dynamic route, nested route, navigation guard |
| 17 | Pinia — State Management | `17-pinia.md` | Store, state, getters, actions |
| 18 | Pinia — Lanjutan | `18-pinia-lanjutan.md` | Persist state, plugins, pattern fullstack |

---

### 🔴 FASE 4 — Consume API & Fullstack (Advanced)

| Bab | Judul | File | Deskripsi |
|-----|-------|------|-----------|
| 19 | HTTP Request dengan Axios | `19-axios.md` | Install, GET/POST/PUT/DELETE, interceptor |
| 20 | CRUD Fullstack (Vue + Laravel) | `20-crud-fullstack.md` | Integrasi API Laravel, CORS, resource |
| 21 | Autentikasi (Laravel Sanctum) | `21-auth-sanctum.md` | Login/Register, token, protected route |
| 22 | Upload File & Handling Media | `22-upload-file.md` | Form upload, preview, progress bar |
| 23 | Error Handling & Loading State | `23-error-handling.md` | Try-catch, global error, skeleton, toast |

---

### 🟣 FASE 5 — Pattern & Best Practices (Advanced)

| Bab | Judul | File | Deskripsi |
|-----|-------|------|-----------|
| 24 | Reusable Component Pattern | `24-reusable-pattern.md` | Modal, table, form generator, renderless comp |
| 25 | Performance Optimization | `25-performance.md` | Lazy loading, `v-memo`, `shallowRef`, code splitting |
| 26 | Testing (Unit & E2E) | `26-testing.md` | Vitest, Vue Test Utils, Cypress/Playwright |
| 27 | Deployment & Build | `27-deployment.md` | Build production, deploy, env variable |

---

## 🔀 Alur Pembelajaran

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 1: FONDASI                              │
│  01 → 02 → 03 → 04 → 05 → 06 → 07                             │
│  (Pahami dasar Vue: template, reactivity, event, form)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                 FASE 2: COMPONENT SYSTEM                        │
│  08 → 09 → 10 → 11 → 12 → 13 → 14                             │
│  (Pecah UI jadi komponen, komunikasi antar komponen)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│             FASE 3: ROUTING & STATE MANAGEMENT                  │
│  15 → 16 → 17 → 18                                             │
│  (Navigasi multi-halaman, state global dengan Pinia)            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              FASE 4: CONSUME API & FULLSTACK                    │
│  19 → 20 → 21 → 22 → 23                                       │
│  (Hubungkan Vue dengan Laravel API, auth, upload)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            FASE 5: PATTERN & BEST PRACTICES                     │
│  24 → 25 → 26 → 27                                             │
│  (Reusable pattern, optimasi, testing, deploy)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📌 Catatan Penting

- **Semua materi menggunakan Vue 3 Composition API** (`<script setup>`)
- **Project ini sudah tersetup** dengan Vite + Vue Router + Pinia
- **Setiap bab berisi:** teori, contoh kode, dan latihan praktik
- **Fase 4 memerlukan backend Laravel** yang sudah berjalan (API)
- **Bahasa:** Indonesia 🇮🇩

---

## 🚀 Mulai dari Mana?

Buka file `01-pengenalan-vue.md` untuk memulai perjalanan belajar Vue.js kamu!
