# Deployment (Rilis ke Production)

Setelah kodinganmu sempurna, saatnya meng-online-kannya ke internet agar bisa dipakai oleh publik. 

Ingat: File Javascript mentah (SFC `.vue`, file config vite) **BUKAN** file yang dimengerti oleh Browser Chrome / Safari. Mereka harus di-Build (dikompilasi, dikompress, digabung) menjadi HTML, CSS, dan JS murni.

## 1. Menyiapkan Environment Variables (.env)

Biasanya, URL Backend API antara mesin Local (komputer pribadimu) dengan mesin Production (Server Cloud) itu berbeda. Vite menyediakannya lewat `.env`.

Buat file `.env` di **root** projectmu (sejajar dengan package.json).

Vite **HANYA AKAN MENGANGKUT** variable yang nama depannya diawali tulisan `VITE_` ke file Production.

```env
# .env (Bisa dicommit ke Git - jika bukan rahasia)
VITE_APP_NAMA="TokoVueKu"
VITE_API_URL="http://localhost:8000/api"
```

Buat juga file spesifik Production `.env.production`:
```env
# .env.production
VITE_API_URL="https://api.domainaslimu.com/v1"
```

*Cara Panggil di Komponen Vue:*
```js
// Hasilnya akan otomatis terganti sesuai tempatnya dijalankan.
const endpoint = import.meta.env.VITE_API_URL 

// Contoh dipakai di file konfigurasi Axios kita:
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
```

## 2. Melakukan Build

Perintah ini akan merangkum aplikasi Vue-mu menjadi folder super ringan bernama `dist/`.

```bash
npm run build
```

Jika sukses, kamu akan menemukan folder `/dist`.
- `index.html` (Layar utamanya)
- `/assets` (Berisi CSS yang digabung jadi 1 file, dan JS yang digabung & di-minify (dikompres tanpa spasi) agar loading web super ngebut).

## 3. Deployment ke Vercel / Netlify (Paling Gampang & Gratis)

Vercel dan Netlify adalah layanan hosting gratis untuk *Frontend SPA*. 
Cara paling instan (via Github):
1. Push kodinganmu ke Repo Github.
2. Login ke Vercel.com, klik "Add New Project", hubungkan akun Githubmu.
3. Pilih repository `vue-basic` milikmu.
4. Vercel akan otomatis mendeteksi bahwa ini aplikasi Vite.
5. Klik **Deploy**!
6. Setiap kali kamu `git push` ke branch `main`, Vercel akan otomatis membuild ulang (CI/CD otomatis!)

## 4. Deployment ke Server Sendiri (VPS + NGINX)

Jika timmu mewajibkan menaruhnya di VPS Ubuntu (DigitalOcean, AWS EC2, dll), kamu butuh web server Nginx untuk merender file `/dist` tersebut.

**Langkah Pertama:** Copy folder `/dist` ke VPS menggunakan SCP atau tarik via Git lalu jalankan `npm run build` di server. Anggap hasilnya ditaruh di `/var/www/vue-basic/dist`.

**Langkah Kedua (Sangat Penting):** Konfigurasi NGINX untuk Single Page Application (Vue Router History Mode).

Aplikasi SPA memiliki masalah: Jika user langsung mengetik/refresh di url `namamu.com/tentang`, server NGINX akan panik karena dia tidak punya folder/file bernama `/tentang`. NGINX akan mengeluarkan error `404 Not Found`.

Padahal `/tentang` itu rute bohongan buatan Javascript Vue Router! 
Oleh sebab itu, NGINX **harus dipaksa** untuk melempar semua Error 404 ke `index.html` milik Vue. Biarkan Vue Router yang membaca pathnya!

```nginx
# Contoh konfigurasi /etc/nginx/sites-available/vueku
server {
    listen 80;
    server_name www.domainaslimu.com;

    # Arahkan kesini!
    root /var/www/vue-basic/dist;
    
    index index.html;

    location / {
        # KUNCI UTAMANYA ADA DI BARIS INI:
        # Coba buka uri aslinya, kalau gak ada, paksa serahkan ke index.html!
        try_files $uri $uri/ /index.html;
    }
}
```

Restart NGINX:
```bash
sudo systemctl restart nginx
```

Selesai! Aplikasimu sudah siap dipakai di Production dengan kecepatan tinggi!
