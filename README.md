# Capstone_Project_JantungIn

Tugas Akhir untuk Studi Independen DBS Foundation dan Dicoding

Jangan lupa atur buat .gitignore kalo mau import file gede disini

## BackEnd Tech Stack & How TO RUN

JantungIn API adalah layanan backend RESTful untuk aplikasi penilaian risiko kardiovaskular JantungIn. API ini mendukung otentikasi pengguna, manajemen data pasien, dan prediksi risiko kardiovaskular.

- Node.js
- Hapi.js framework
- MySQL/PostgreSQL (for development/testing)
- AWS DynamoDB (for production)
- JWT for authentication

```bash
cd JantungIn_API
```

```bash
cp .env.example .env
isi format di dalemnya
```

```bash
docker-compose up
```

Cek selebihnya di JantungIn_API
