# JantungIn - Aplikasi Penilaian Risiko Kardiovaskular

JantungIn adalah aplikasi yang dirancang untuk membantu pengguna menilai risiko penyakit kardiovaskular mereka. Proyek ini merupakan Tugas Akhir untuk Studi Independen DBS Foundation dan Dicoding.

## Deskripsi Aplikasi

JantungIn menyediakan platform terpadu untuk penilaian risiko kardiovaskular dengan fitur-fitur:

- Penilaian risiko berdasarkan faktor risiko kardiovaskular yang diakui secara medis
- Autentikasi dan manajemen pengguna
- Penyimpanan dan pelacakan hasil diagnosa
- Rekomendasi dan saran kesehatan berdasarkan hasil penilaian

## Struktur Proyek

Proyek ini terdiri dari tiga komponen utama:

### 1. JantungIn-FE (Frontend)

Antarmuka pengguna web yang dibangun menggunakan:

- Vue.js 3
- Tailwind CSS
- GSAP untuk animasi
- Progressive Web App (PWA) support

### 2. JantungIn_API (Backend)

Layanan RESTful API yang mendukung:

- Otentikasi pengguna
- Manajemen data pasien
- Integrasi dengan model prediksi risiko kardiovaskular
- Keamanan data dengan JWT

Teknologi yang digunakan:

- Node.js
- Hapi.js framework
- MySQL/PostgreSQL
- JWT untuk autentikasi

### 3. Inference (Model Machine Learning)

Komponen machine learning untuk prediksi risiko kardiovaskular:

- Model TensorFlow.js
- Preprocessing data
- API integrasi dengan backend

## Instalasi dan Pengaturan Proyek

### Prasyarat

- Node.js (v14.x atau lebih baru)
- NPM atau Yarn
- Database MySQL/PostgreSQL

### Instalasi Frontend

```sh
# Masuk ke direktori frontend
cd JantungIn-FE

# Instal dependensi
npm install

# Jalankan untuk development
npm run dev

# Build untuk production
npm run build
```

### Instalasi Backend

```sh
# Masuk ke direktori backend
cd JantungIn_API

# Instal dependensi
npm install

# Jalankan server
npm start
```

### Konfigurasi Inference Model

```sh
# Masuk ke direktori inference
cd Inference

# Instal dependensi
npm install

# Jalankan untuk development
npm run dev
```

## Deployment

Aplikasi ini dirancang untuk dapat di-deploy dalam beberapa cara:

- Frontend: Netlify, Vercel, atau hosting statis lainnya
- Backend: Heroku, AWS, atau layanan cloud lainnya
- Database: Layanan database terkelola

## Tim Pengembang

JantungIn dikembangkan oleh tim mahasiswa dalam program Studi Independen DBS Foundation dan Dicoding.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).
