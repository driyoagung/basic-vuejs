# Bab 8: Pengenalan Component

## 📖 Apa itu Component?

Component adalah **blok UI yang reusable** dan mandiri. Setiap component memiliki template, logic, dan style sendiri.

```
App.vue
├── HeaderNav.vue
├── MainContent.vue
│   ├── ArticleCard.vue
│   └── Sidebar.vue
└── FooterBar.vue
```

---

## 1️⃣ Single File Component (SFC)

```vue
<!-- src/components/Tombol.vue -->
<script setup>
// Logic di sini
</script>

<template>
  <!-- Template di sini -->
  <button class="btn">Klik Saya</button>
</template>

<style scoped>
/* Style yang hanya berlaku di komponen ini */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
```

---

## 2️⃣ Menggunakan Component

```vue
<!-- src/App.vue -->
<script setup>
// Import component
import Tombol from './components/Tombol.vue'
import HeaderNav from './components/HeaderNav.vue'
</script>

<template>
  <HeaderNav />
  <main>
    <h1>Halaman Utama</h1>
    <Tombol />
    <Tombol />  <!-- Bisa dipakai berkali-kali -->
  </main>
</template>
```

---

## 3️⃣ Naming Convention

| Format | Contoh | Digunakan di |
|--------|--------|-------------|
| PascalCase | `<UserCard />` | Template (rekomendasi) |
| kebab-case | `<user-card />` | Template (alternatif) |
| PascalCase file | `UserCard.vue` | Nama file (rekomendasi) |

---

## 4️⃣ Component Organization

```
src/components/
├── ui/                 # Komponen UI generik
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   └── BaseModal.vue
├── layout/             # Komponen layout
│   ├── AppHeader.vue
│   └── AppFooter.vue
└── feature/            # Komponen fitur spesifik
    ├── UserCard.vue
    └── ProductList.vue
```

---

## 🧪 Latihan: Buat Card Component

```vue
<!-- src/components/InfoCard.vue -->
<script setup>
// Kosong untuk sekarang — nanti kita tambah props di Bab 9
</script>

<template>
  <div class="info-card">
    <h3>Judul Card</h3>
    <p>Deskripsi card di sini</p>
    <button class="btn">Action</button>
  </div>
</template>

<style scoped>
.info-card {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.info-card h3 { margin: 0 0 8px; }
.info-card p { color: #64748b; margin: 0 0 16px; }
.btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
```

Gunakan di `App.vue`:
```vue
<script setup>
import InfoCard from './components/InfoCard.vue'
</script>

<template>
  <div style="display: flex; gap: 16px; padding: 24px;">
    <InfoCard />
    <InfoCard />
    <InfoCard />
  </div>
</template>
```

> 💡 Masalah: Semua card menampilkan konten yang sama! Di Bab 9, kita akan belajar **Props** untuk membuat card yang dinamis.

---

**Sebelumnya:** [← Bab 7 — Class & Style Binding](./07-class-style-binding.md)
**Selanjutnya:** [Bab 9 — Props & Validation →](./09-props.md)
