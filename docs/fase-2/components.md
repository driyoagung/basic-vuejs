# Pengenalan Component

Component adalah **blok UI yang reusable dan mandiri**. Setiap component punya template, logic, dan style sendiri — seperti LEGO yang bisa disusun membentuk UI yang kompleks.

## Kenapa Component?

```
App.vue                    ← Root component
├── AppHeader.vue          ← Navigasi
├── MainContent.vue        ← Konten utama
│   ├── ArticleCard.vue    ← Card artikel (dipakai berkali-kali)
│   ├── ArticleCard.vue
│   └── Sidebar.vue        ← Sidebar
└── AppFooter.vue          ← Footer
```

Keuntungan:
- **Reusable** — satu component bisa dipakai di banyak tempat
- **Maintainable** — perubahan terisolasi di satu file
- **Testable** — bisa ditest secara independen
- **Readable** — kode terorganisir dan mudah dipahami

## Single File Component (SFC)

Format khas Vue — 3 bagian dalam satu file `.vue`:

```vue
<!-- src/components/Tombol.vue -->
<script setup>
// 🧠 Logic: imports, reactive data, methods
import { ref } from 'vue'
const clicked = ref(0)
const handleClick = () => clicked.value++
</script>

<template>
  <!-- 🎨 Template: HTML + Vue directives -->
  <button class="btn" @click="handleClick">
    Diklik {{ clicked }}x
  </button>
</template>

<style scoped>
/* 💅 Style: CSS khusus komponen ini (scoped) */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover { background: #2563eb; }
</style>
```

## Menggunakan Component

```vue
<!-- src/App.vue -->
<script setup>
// 1. Import component
import Tombol from './components/Tombol.vue'
import HeaderNav from './components/HeaderNav.vue'
</script>

<template>
  <HeaderNav />
  <main>
    <h1>Halaman Utama</h1>
    <!-- 2. Gunakan seperti HTML tag -->
    <Tombol />
    <Tombol />  <!-- Bisa dipakai berkali-kali, masing-masing independen -->
    <Tombol />
  </main>
</template>
```

::: info Import = Registrasi
Dengan `<script setup>`, component yang di-import **otomatis teregistrasi** — tidak perlu `components: { ... }` seperti di Options API.
:::

## Naming Convention

| Format | Contoh | Kapan Pakai |
|--------|--------|-------------|
| **PascalCase** (file) | `UserCard.vue` | ✅ Nama file component |
| **PascalCase** (template) | `<UserCard />` | ✅ Rekomendasi di template |
| **kebab-case** (template) | `<user-card />` | ✅ Alternatif, wajib di DOM template |
| **Multi-word** | `BaseButton.vue` | ✅ Selalu gunakan multi-word |
| ~~Single-word~~ | ~~`Button.vue`~~ | ❌ Hindari (konflik dengan HTML) |

::: tip Best Practice
- Nama component selalu **multi-word**: `BaseButton`, `UserCard`, `AppHeader`
- Hindari single-word: `Button`, `Header`, `Input` (bisa konflik dengan HTML native)
:::

## Organisasi File Component

```
src/components/
├── ui/                     # Komponen UI generik (reusable everywhere)
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── BaseModal.vue
│   ├── BaseCard.vue
│   └── BaseTable.vue
│
├── layout/                 # Komponen layout / struktur halaman
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   └── AppSidebar.vue
│
├── feature/                # Komponen fitur spesifik
│   ├── UserCard.vue
│   ├── ProductList.vue
│   └── CommentSection.vue
│
└── icons/                  # Icon components
    ├── IconHome.vue
    └── IconUser.vue
```

## Scoped vs Global Style

```vue
<!-- Scoped: hanya berlaku di komponen ini -->
<style scoped>
.title { color: blue; } /* Hanya affect <h1> di komponen ini */
</style>

<!-- Global: berlaku di seluruh aplikasi -->
<style>
.title { color: blue; } /* Affect SEMUA elemen .title */
</style>
```

::: warning Selalu Gunakan Scoped
Tanpa `scoped`, style bisa "bocor" ke komponen lain dan menyebabkan konflik CSS yang sulit di-debug.
:::

## Latihan: Buat Card Component

```vue
<!-- src/components/InfoCard.vue -->
<script setup>
// Kosong untuk sekarang — di bab Props, kita akan buat ini dinamis
</script>

<template>
  <div class="info-card">
    <div class="card-icon">📘</div>
    <h3 class="card-title">Judul Card</h3>
    <p class="card-desc">Ini adalah deskripsi card. Kontennya masih statis.</p>
    <button class="card-btn">Selengkapnya →</button>
  </div>
</template>

<style scoped>
.info-card {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  max-width: 300px;
}
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.card-icon { font-size: 32px; margin-bottom: 12px; }
.card-title { margin: 0 0 8px; font-size: 18px; color: #1e293b; }
.card-desc { color: #64748b; margin: 0 0 16px; font-size: 14px; line-height: 1.5; }
.card-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.card-btn:hover { background: #2563eb; }
</style>
```

Gunakan di `App.vue`:

```vue
<script setup>
import InfoCard from './components/InfoCard.vue'
</script>

<template>
  <div style="display: flex; gap: 16px; padding: 24px; flex-wrap: wrap;">
    <InfoCard />
    <InfoCard />
    <InfoCard />
  </div>
</template>
```

> 💡 **Masalah:** Semua card menampilkan konten yang sama! Di bab berikutnya (Props), kita akan membuat card yang **dinamis** — setiap card bisa punya judul, deskripsi, dan icon berbeda.
