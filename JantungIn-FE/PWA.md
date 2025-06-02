# Progressive Web App (PWA) - JantungIn

## Penjelasan

Progressive Web App (PWA) merupakan pendekatan pengembangan aplikasi web yang memberikan pengalaman seperti aplikasi native pada perangkat pengguna. JantungIn dirancang sebagai PWA untuk memberikan pengalaman aplikasi yang lebih baik dengan fitur-fitur:

- **Instalasi pada perangkat** - pengguna dapat menginstal JantungIn pada perangkat mereka
- **Penggunaan offline** - aplikasi tetap dapat diakses meskipun tanpa koneksi internet
- **Pembaruan otomatis** - aplikasi selalu mendapatkan versi terbaru
- **Notifikasi push** - pengguna dapat menerima notifikasi penting (fitur yang dapat dikembangkan)

## Komponen PWA pada JantungIn

### 1. Web App Manifest (manifest.webmanifest)

File `public/manifest.webmanifest` berisi metadata aplikasi seperti:

- Nama aplikasi
- Deskripsi
- Ikon
- Warna tema
- Mode tampilan
- URL mulai

### 2. Service Worker (sw.js)

File `public/sw.js` menangani:

- Caching aset statis untuk akses offline
- Strategi caching untuk API
- Penanganan pembaruan aplikasi
- Halaman fallback ketika offline

### 3. Komponen Instalasi PWA (InstallPWA.vue)

Komponen `src/components/InstallPWA.vue` menyediakan:

- Prompt instalasi otomatis
- Tombol instalasi manual
- Panduan instalasi untuk berbagai platform

### 4. Komponen Pembaruan (RefreshApp.vue)

Komponen `src/components/RefreshApp.vue` menangani:

- Mendeteksi pembaruan aplikasi
- Menampilkan notifikasi pembaruan
- Memfasilitasi proses update

### 5. Utilitas PWA (pwaHelper.js, pwaUpdater.js)

File-file utilitas di `src/utils/` menangani:

- Deteksi status instalasi
- Pemantauan pembaruan
- Pengelolaan pembaruan service worker

## Cara Instalasi JantungIn PWA

### Di Perangkat Mobile

1. **Android (Chrome)**

   - Buka JantungIn di Chrome
   - Ketuk banner instalasi yang muncul, atau
   - Ketuk menu tiga titik > "Install app"

2. **iOS (Safari)**
   - Buka JantungIn di Safari
   - Ketuk tombol Share
   - Pilih "Add to Home Screen"
   - Ketuk "Add"

### Di Desktop

1. **Chrome, Edge, atau browser berbasis Chromium**

   - Klik ikon instalasi di bilah alamat (ikon +), atau
   - Klik menu tiga titik > "Install JantungIn"

2. **Firefox**
   - Saat ini dukungan PWA di Firefox terbatas
   - Pengguna dapat menggunakan tombol instalasi manual di aplikasi

## Fitur PWA pada JantungIn

### 1. Offline Support

- Akses halaman utama dan informasi penting tanpa koneksi internet
- Halaman offline yang informatif ketika koneksi terputus

### 2. Cache Strategies

- **Cache First** - untuk aset statis (CSS, JS, gambar)
- **Network First** - untuk API dan konten dinamis
- **Stale While Revalidate** - untuk konten semi-dinamis

### 3. Update Management

- Pembaruan otomatis service worker
- Notifikasi pembaruan tersedia
- Opsi untuk refresh ke versi terbaru

## Pengujian PWA

### Alat Pengujian

- **Lighthouse** - untuk audit PWA dan performa
- **Chrome DevTools > Application** - untuk memeriksa service worker dan cache
- **PWA Builder** - untuk validasi PWA

### Skenario Pengujian

1. **Pengujian Instalasi**

   - Uji instalasi di berbagai perangkat dan browser
   - Verifikasi ikon, splash screen, dan pengalaman app-like

2. **Pengujian Offline**

   - Matikan koneksi internet dan verifikasi aplikasi tetap berfungsi
   - Uji kemampuan caching dan akses offline

3. **Pengujian Pembaruan**
   - Verifikasi pembaruan service worker berfungsi dengan benar
   - Uji notifikasi pembaruan dan mekanisme refresh

## Tips Pengembangan Lanjutan

1. **Background Sync** - untuk sinkronisasi data saat kembali online
2. **Periodic Background Sync** - untuk pembaruan konten berkala
3. **Push Notifications** - untuk pemberitahuan penting
4. **Storage Estimation** - untuk mengelola penggunaan penyimpanan

## Referensi

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
