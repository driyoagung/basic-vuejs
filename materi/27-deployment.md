# Bab 27: Deployment & Build Production

## 1️⃣ Environment Variables

```bash
# .env (development)
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Vue Basic

# .env.production
VITE_API_URL=https://api.example.com/api
VITE_APP_NAME=Vue Basic
```

Akses di kode:
```js
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
```

> ⚠️ Hanya variabel dengan prefix `VITE_` yang bisa diakses di frontend!

---

## 2️⃣ Build Production

```bash
npm run build
```

Hasil build di folder `dist/`:
```
dist/
├── index.html
└── assets/
    ├── index-abc123.js    (bundled JS)
    ├── index-def456.css   (bundled CSS)
    └── logo-ghi789.svg    (static assets)
```

### Preview Build
```bash
npm run preview
# Buka http://localhost:4173
```

---

## 3️⃣ Deploy Options

### A. Static Hosting (Vercel, Netlify, GitHub Pages)

```bash
# Vercel
npm i -g vercel
vercel

# Netlify
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### B. Di Server Sendiri (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/vue-basic/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # ← Penting untuk SPA!
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;  # Laravel backend
    }
}
```

### C. Serve dari Laravel

```php
// routes/web.php (Laravel)
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
```

Build Vue lalu copy `dist/` ke Laravel `public/`:
```bash
npm run build
cp -r dist/* /path/to/laravel/public/
```

---

## 4️⃣ Checklist Sebelum Deploy

- [ ] Environment variables sudah benar
- [ ] API URL production sudah di-set
- [ ] CORS Laravel sudah dikonfigurasi
- [ ] Build berhasil tanpa error
- [ ] Test lulus semua
- [ ] Assets (gambar, font) sudah optimal
- [ ] `console.log` development sudah dihapus

---

## 🎉 Selamat!

Kamu sudah menyelesaikan seluruh materi pembelajaran Vue.js! Dari dasar hingga deployment production.

### Recap Perjalanan:

```
✅ Fase 1: Fondasi (template, reactivity, events, form)
✅ Fase 2: Component System (props, emit, slots, composables)
✅ Fase 3: Router & State (Vue Router, Pinia)
✅ Fase 4: Fullstack (Axios, CRUD, Auth, Upload)
✅ Fase 5: Best Practices (patterns, performance, testing, deploy)
```

### Next Steps:
- 🔨 Bangun project nyata (portfolio, e-commerce, blog)
- 📚 Eksplorasi [Nuxt.js](https://nuxt.com) untuk SSR/SSG
- 🎨 Pelajari UI library (Vuetify, PrimeVue, Naive UI)
- 🧪 Pelajari E2E testing (Cypress, Playwright)

---

**Sebelumnya:** [← Bab 26 — Testing](./26-testing.md)
**Kembali ke:** [📋 Roadmap](./00-roadmap.md)
