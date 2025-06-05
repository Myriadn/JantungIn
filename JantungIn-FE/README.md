# JantungIn Frontend

Frontend untuk aplikasi JantungIn - platform penilaian risiko kardiovaskular yang inovatif.

## Deskripsi

JantungIn Frontend adalah antarmuka web responsif yang memungkinkan pengguna untuk:

- Melakukan pendaftaran dan login ke sistem
- Mengisi formulir penilaian risiko kardiovaskular
- Melihat hasil prediksi dan rekomendasi
- Melacak riwayat penilaian
- Mengelola profil pengguna

## Teknologi

Aplikasi ini dibangun menggunakan:

- **Vue.js 3**: Framework JavaScript progresif untuk membangun UI
- **Vite**: Build tool dan development server yang cepat
- **Tailwind CSS**: Framework CSS untuk desain yang cepat dan responsif
- **GSAP**: Library animasi untuk pengalaman pengguna yang menarik
- **Vue Router**: Routing pada sisi klien
- **PWA**: Fitur Progressive Web App untuk pengalaman mobile yang lebih baik

## Struktur Proyek

```
JantungIn-FE/
├── public/                # Aset statis dan file manifest PWA
├── src/
│   ├── assets/            # Gambar, font, dan aset lainnya
│   ├── components/        # Komponen Vue yang dapat digunakan kembali
│   ├── i18n/              # Konfigurasi dan file internasionalisasi
│   ├── models/            # Model data dan definisi tipe
│   ├── Page/              # Komponen halaman utama
│   ├── router/            # Konfigurasi Vue Router
│   ├── scripts/           # Script utility dan helper
│   ├── services/          # Layanan API dan logika bisnis
│   ├── utils/             # Fungsi utilitas umum
│   ├── viewmodels/        # View models untuk logika presentasi
│   ├── App.vue            # Komponen root aplikasi
│   └── main.js            # Entry point aplikasi
├── tailwind.config.js     # Konfigurasi Tailwind CSS
└── vite.config.js         # Konfigurasi Vite
```

## Fitur

- **Otentikasi Pengguna**: Login, pendaftaran, dan manajemen sesi
- **Formulir Penilaian**: Input data kesehatan yang mudah digunakan
- **Visualisasi Hasil**: Representasi visual dari hasil penilaian risiko
- **Responsif**: Desain yang bekerja dengan baik di desktop dan perangkat mobile
- **Mode Offline**: Dukungan PWA untuk penggunaan offline
- **Multi-bahasa**: Dukungan untuk beberapa bahasa

## Pengaturan Proyek

```sh
# Instal dependensi
npm install

# Kompilasi dan hot-reload untuk pengembangan
npm run dev

# Kompilasi dan minifikasi untuk produksi
npm run build

# Lint dengan ESLint
npm run lint
```

```sh
npm run lint
```

## Integrasi dengan Backend

JantungIn Frontend berkomunikasi dengan JantungIn API melalui RESTful endpoints untuk:

- Otentikasi dan manajemen pengguna
- Pengiriman data penilaian
- Penerimaan hasil prediksi
- Mengambil riwayat penilaian

## Pengembangan

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disarankan untuk menonaktifkan Vetur jika terpasang).

### API Testing

Untuk menguji integrasi dengan API:

1. Pastikan JantungIn API berjalan
2. Buka file `public/api-test.html` untuk mencoba endpoint API

### PWA Support

Aplikasi ini mendukung fitur Progressive Web App yang memungkinkan:

- Instalasi ke perangkat
- Caching untuk kinerja yang lebih cepat
- Pengalaman offline dasar

## Deployment

Frontend dapat di-deploy ke berbagai layanan hosting statis:

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## Kontribusi

Untuk berkontribusi pada pengembangan frontend:

1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request
