<p align="center">
  <img src="./JantungIn_API/public/logo.png" alt="JantungIn Logo" width="200"/>
</p>

<p align="center">
  <b>JantungIn - Aplikasi Penilaian Risiko Kardiovaskular</b>
</p>

JantungIn adalah aplikasi yang dirancang untuk membantu seorang dokter sebagai efisiensi waktu dalam menilai risiko penyakit kardiovaskular para pasien. Proyek ini merupakan Tugas Akhir untuk Studi Independen DBS Foundation dan Dicoding.

## Documentation

Dokumentasi lengkap untuk setiap komponen tersedia di:

- [Frontend - Web Application](JantungIn-FE/README.md)
- [Backend - REST API](JantungIn_API/README.md)
- [Machine Learning - Model & Training](JantungIn_ML/README.md)
- [API Documentation - Postman Collection](JantungIn_API/postman/)
- [ML Model - Jupyter Notebook](JantungIn_ML/notebook/)

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

### 3. JantungIn_ML (Model Machine Learning)

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

### Konfigurasi Machine Learning Model

```sh
# Masuk ke direktori machine learning
cd JantungIn_ML

# Buka notebook untuk training dan evaluasi model
# Menggunakan Jupyter Notebook atau Google Colab
jupyter notebook notebook/Notebook_JantungIn.ipynb
```

**Hasil Model sudah tersedia dalam format TensorFlow.js di folder model/:**
- `group1-shard1of1.bin`: Model weights
- `model.json`: Model architecture  
- `scaler_info.json`: Preprocessing parameters

**Model Specifications:**
- **Akurasi**: 96.67% pada test set
- **Arsitektur**: Multi-Layer Perceptron (MLP) dengan 3 layer
- **Input**: 13 parameter medis kardiovaskular
- **Output**: Binary classification (0: Tidak ada risiko, 1: Ada risiko)
- **Zero False Negatives**: Sangat penting untuk aplikasi medis

## Deployment

Aplikasi ini di-deploy pada layanan seperti:

- Frontend: Netlify
- Backend: Railway
- Database: Supabase

## Tim Pengembang

JantungIn dikembangkan oleh tim mahasiswa dalam program Studi Independen DBS Foundation dan Dicoding.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).
