# Deployment ke Railway

Berikut adalah langkah-langkah untuk mendeploy JantungIn API ke Railway:

## Persiapan

1. Pastikan Anda memiliki akun [Railway](https://railway.app/)
2. Install Railway CLI jika ingin deploy melalui command line
   ```
   npm i -g @railway/cli
   ```
3. Login ke Railway CLI
   ```
   railway login
   ```

## Cara Deploy

### Opsi 1: Deploy melalui GitHub

1. Push kode ke repository GitHub Anda
2. Login ke dashboard Railway
3. Klik "New Project"
4. Pilih "Deploy from GitHub repo"
5. Pilih repository JantungIn API
6. Railway akan otomatis mendeteksi Dockerfile dan melakukan build

### Opsi 2: Deploy melalui CLI

1. Pastikan Anda berada di direktori JantungIn_API
2. Jalankan perintah berikut:
   ```
   railway init
   ```
3. Pilih "Create a new project"
4. Kemudian deploy dengan perintah:
   ```
   railway up
   ```

## Konfigurasi Environment Variables

Setelah project terbuat di Railway, tambahkan environment variables berikut:

1. `NODE_ENV` = production
2. `JWT_SECRET` = [generate random string 32+ karakter]
3. `JWT_EXPIRATION` = 24h
4. `DB_HOST` = [Railway PostgreSQL host]
5. `DB_NAME` = railway
6. `DB_USER` = postgres
7. `DB_PASSWORD` = [Railway PostgreSQL password]
8. `DB_PORT` = 5432
9. `ENCRYPTION_KEY` = [generate random string 32 karakter]
10. `ALLOWED_ORIGINS` = https://your-frontend-url.com,http://localhost:5173
11. `RATE_LIMIT_WINDOW_MS` = 900000
12. `RATE_LIMIT_MAX_REQUESTS` = 100
13. `ADMIN_EMAIL` = admin@jantungin.com
14. `ADMIN_PASSWORD` = [secure password for admin]

## Database Setup

Railway menyediakan PostgreSQL sebagai add-on:

1. Di dashboard Railway, klik "New"
2. Pilih "PostgreSQL"
3. Railway akan memberikan kredensial database di Variables
4. Gunakan kredensial tersebut untuk mengisi DB\_\* environment variables

## Custom Domain (Opsional)

1. Di dashboard Railway, pilih project Anda
2. Klik tab "Settings"
3. Scroll ke bagian "Domains"
4. Klik "Generate Domain" untuk mendapatkan domain railway.app
5. Atau tambahkan custom domain Anda sendiri

## Monitoring

1. Di dashboard Railway, pilih project Anda
2. Klik tab "Metrics" untuk melihat penggunaan CPU, RAM, dan lainnya
3. Klik tab "Logs" untuk melihat log aplikasi

## Troubleshooting

Jika ada masalah saat deployment:

1. Periksa logs di dashboard Railway
2. Pastikan semua environment variables sudah diset dengan benar
3. Verifikasi kredensial database sudah benar
4. Pastikan port yang diekspos di Dockerfile (3000) sesuai dengan konfigurasi

## Setelah Deployment

1. Test API dengan Postman menggunakan URL yang diberikan Railway
2. Update frontend untuk menggunakan URL API yang baru
3. Monitor log untuk error atau performance issues

## Backup dan Maintenance

1. Pastikan data penting di-backup secara berkala
2. Update dependencies secara rutin untuk keamanan
3. Monitor penggunaan resource untuk optimasi biaya
