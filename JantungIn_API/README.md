# 🫀 JantungIn API

<p align="center">
  <img src="./public/logo.png" alt="JantungIn Logo" width="300"/>
</p>

<p align="center">
  <b>Solusi Cerdas untuk Deteksi Dini Risiko Penyakit Kardiovaskular.</b>
</p>

JantungIn API adalah layanan backend RESTful untuk aplikasi JantungIn yang berfokus pada penilaian risiko penyakit kardiovaskular. API ini mendukung otentikasi pengguna, manajemen data pasien, dan prediksi risiko kardiovaskular menggunakan model pembelajaran mesin.

## ✨ Fitur Utama

- 🔐 **Otentikasi Pengguna** - Daftar, masuk, dan kelola profil
- 🔍 **Prediksi Risiko Penyakit Kardiovaskular** - Menggunakan TensorFlow.js untuk analisis data kesehatan
- 📊 **Pelacakan Riwayat Diagnosis** - Menyimpan dan menampilkan riwayat diagnosis pasien
- 🌐 **API RESTful** - Dengan endpoint terstandarisasi
- 💾 **Database PostgreSQL** - Penyimpanan data yang handal
- 🚀 **Opsi Deployment yang Aman** - Dukungan untuk AWS, Railway, dan Docker

## 🛠️ Teknologi yang Digunakan

- **Node.js** - Lingkungan runtime JavaScript
- **Hapi.js** - Framework web yang kuat dan fleksibel
- **PostgreSQL** - Sistem manajemen database relasional
- **Sequelize** - ORM untuk PostgreSQL
- **JWT** - JSON Web Token untuk autentikasi yang aman
- **TensorFlow.js** - Library pembelajaran mesin untuk prediksi
- **Bcrypt** - Enkripsi password
- **Winston** - Logging library
- **Jest** - Framework pengujian

## 📋 Prasyarat

- **Node.js v14+** dan npm
- **PostgreSQL** database
- **Git** untuk kontrol versi

## 🚀 Instalasi

1. Clone repositori:

```bash
git clone <repository-url>
cd JantungIn_API
```

2. Install dependensi:

```bash
npm install
```

3. Siapkan variabel lingkungan:

```bash
cp .env.example .env
```

Edit file `.env` untuk mengatur kredensial database dan opsi konfigurasi lainnya termasuk:

- `PORT` (default: 3000)
- `JWT_SECRET` untuk enkripsi token
- `NODE_ENV` (development/production)
- `ALLOWED_ORIGINS` untuk konfigurasi CORS

## 💾 Konfigurasi Database

### Konfigurasi PostgreSQL

1. Konfigurasi pengaturan database PostgreSQL di file `.env`:

```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jantungin
DB_USER=username_anda
DB_PASSWORD=password_anda
```

2. Pastikan server PostgreSQL berjalan dan database telah dibuat.

## 🏃‍♂️ Menjalankan Aplikasi

### Mode Pengembangan

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` secara default.

### Mode Produksi

```bash
npm start
```

Untuk produksi dengan variabel lingkungan langsung:

```bash
npm run production
```

## 📡 Endpoint API

### 🔐 Autentikasi

- `POST /api/v1/auth/register` - Mendaftarkan pengguna baru
- `POST /api/v1/auth/login` - Login pengguna
- `GET /api/v1/auth/profile` - Mendapatkan profil pengguna
- `PUT /api/v1/auth/profile` - Memperbarui profil pengguna

### 🩺 Diagnosis

- `POST /api/v1/diagnosis` - Membuat diagnosis baru
- `GET /api/v1/diagnosis/history` - Mendapatkan riwayat diagnosis pengguna
- `GET /api/v1/diagnosis/{id}` - Mendapatkan diagnosis spesifik

### 👩‍💼 Admin (Khusus Dokter)

- `POST /api/v1/admin/login` - Login khusus admin/dokter
- `GET /api/v1/admin/patients` - Mendapatkan daftar semua pasien
- `GET /api/v1/admin/diagnoses` - Mendapatkan semua data diagnosis
- `PUT /api/v1/admin/patients/{id}` - Memperbarui data pasien

## 🧪 Pengujian

```bash
npm test
```

### Pengujian dengan Postman

Koleksi Postman tersedia di direktori `/postman` untuk menguji semua endpoint API:

1. Impor `JantungIn APi.postman_collection.json` ke Postman
2. Impor `JantungIn Variabel.postman_environment.json` untuk variabel lingkungan
3. Sesuaikan variabel lingkungan jika diperlukan (URL, token, dll.)

## 🚀 Deployment

### 🚂 Deployment di Railway

JantungIn API dapat dengan mudah di-deploy di [Railway](https://railway.app):

1. Hubungkan repositori GitHub Anda ke Railway
2. Siapkan variabel lingkungan yang diperlukan:
   - `PORT` (default: 3000)
   - `NODE_ENV=production`
   - `JWT_SECRET`
   - String koneksi database (berdasarkan plugin PostgreSQL Railway)
   - Variabel lingkungan spesifik aplikasi lainnya
3. Deploy aplikasi Anda

### ☁️ Langkah-langkah Deployment AWS

1. Siapkan instance EC2
2. Konfigurasi variabel lingkungan untuk produksi
3. Gunakan process manager seperti PM2 untuk mengelola aplikasi Node.js:

```bash
npm install -g pm2
pm2 start src/server.js --name jantungin-api
```

### 🐳 Deployment dengan Docker

Dockerfile disertakan untuk mengkontainerisasi aplikasi. Build dan jalankan dengan:

```bash
docker build -t jantungin-api .
docker run -p 3000:3000 -e NODE_ENV=production jantungin-api
```

## 🔧 Pemecahan Masalah

### 🚨 Masalah Umum saat Deployment

1. **Kesalahan Middleware** - Pastikan fungsi middleware kompatibel dengan Hapi.js. Middleware gaya Express (`app.use()`) tidak akan berfungsi dengan Hapi.js.

2. **Masalah Koneksi Database** - Verifikasi kredensial database dan pastikan database dapat diakses dari lingkungan deployment Anda.

3. **Variabel Lingkungan** - Periksa bahwa semua variabel lingkungan yang diperlukan diatur dengan benar di platform deployment Anda.

4. **Konflik Port** - Pastikan port yang ditentukan dalam aplikasi Anda tersedia dan tidak diblokir oleh firewall.

## 📈 Arsitektur Sistem

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Frontend  │────▶│  JantungIn  │────▶│  PostgreSQL │
│   (Vue.js)  │     │     API     │     │  Database   │
│             │◀────│  (Hapi.js)  │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ TensorFlow  │
                    │    Model    │
                    └─────────────┘
```

## 📝 Alur Kerja

1. Pengguna melakukan autentikasi melalui frontend
2. Frontend mengirimkan data kesehatan ke API
3. API memproses data menggunakan model TensorFlow.js
4. Hasil prediksi dikembalikan ke pengguna
5. Data diagnosis disimpan dalam database

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi ISC.

## 👨‍💻 Kontributor

- Myriadn - Pengembangan awal dan desain API

## 📚 Dokumentasi API

Dokumentasi API tersedia secara langsung melalui:

```
http://localhost:3000/public/api-docs.html
```

Dokumentasi ini memberikan informasi lengkap tentang semua endpoint API, parameter yang diperlukan, dan contoh respons.
