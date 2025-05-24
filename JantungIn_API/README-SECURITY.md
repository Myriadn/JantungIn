# JantungIn API - Sistem Keamanan dan Peran

Sistem JantungIn API telah diperbarui dengan arsitektur keamanan baru yang memisahkan akses berdasarkan peran:
- **Pengguna Umum (User)**: Mendaftar dan login menggunakan NIK, dapat melihat riwayat diagnosis
- **Administrator/Dokter**: Login melalui terminal localhost, dapat melakukan diagnosis untuk pasien

## Struktur Keamanan

### 1. Pengguna Umum (User)
- **Autentikasi**: 
  - Register menggunakan NIK (16 digit) dan password
  - Login menggunakan NIK dan password
  - NIK dienkripsi dengan AES-256-CBC sebelum disimpan di database
- **Fitur yang Tersedia**:
  - Melihat profil sendiri
  - Melihat hasil diagnosis sendiri
  - **TIDAK DAPAT** melakukan diagnosis sendiri

### 2. Administrator/Dokter
- **Autentikasi**:
  - Login melalui terminal localhost (keamanan berbasis IP) 
  - Kredensial khusus dengan username dan password
  - Akses terbatas dari localhost saja
- **Fitur yang Tersedia**:
  - Melihat daftar semua pasien
  - Mencari pasien berdasarkan NIK
  - Melakukan diagnosis untuk pasien
  - Melihat riwayat diagnosis semua pasien

## Cara Penggunaan

### Persiapan
1. Install dependensi:
   ```
   npm install
   ```

2. Buat file `.env` dengan konfigurasi berikut:
   ```
   PORT=3000
   HOST=localhost
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRATION=1d
   ENCRYPTION_KEY=your_secure_32_byte_encryption_key
   DATABASE_URL=your_database_connection_string
   ```

3. Buat admin pertama:
   ```
   npm run create-admin
   ```

### Akses User (Masyarakat Umum)
- **Register**: `POST /api/auth/register`
  ```json
  {
    "name": "Nama Lengkap",
    "email": "email@example.com", // Opsional
    "nik": "1234567890123456", // Harus 16 digit
    "password": "password123", 
    "dateOfBirth": "1990-01-01"
  }
  ```

- **Login**: `POST /api/auth/login`
  ```json
  {
    "nik": "1234567890123456",
    "password": "password123"
  }
  ```

- **Lihat Riwayat Diagnosis**: `GET /api/diagnosis/history`
  - Memerlukan token autentikasi di header: `Authorization: Bearer {token}`

### Akses Admin/Dokter (Via Terminal)

1. Jalankan aplikasi:
   ```
   npm run dev
   ```

2. Di terminal lain, jalankan admin terminal:
   ```
   npm run admin
   ```

3. Login dengan kredensial admin:
   ```
   Username: admin@jantungin.com
   Password: admin123
   ```

4. Gunakan menu yang tersedia untuk:
   - Melihat daftar pasien
   - Mencari pasien berdasarkan NIK
   - Membuat diagnosis untuk pasien

## Keamanan

- **Enkripsi NIK**: NIK dienkripsi dengan AES-256-CBC sebelum disimpan di database
- **Akses Terminal**: Hanya bisa diakses dari localhost (127.0.0.1, ::1)
- **Role-Based Access Control**: Pembatasan akses berdasarkan peran (user vs. admin/dokter)
- **Hashing Password**: Password di-hash dengan bcrypt (10 saltRounds)
- **JWT Tokens**: Autentikasi berbasis token dengan expiration time

## Deployment

Pastikan untuk mengubah semua kunci keamanan (JWT_SECRET, ENCRYPTION_KEY) saat deployment ke production.

## Catatan Penting

- Sistem ini mengandalkan batasan akses localhost untuk terminal admin, pastikan konfigurasi server tidak memungkinkan akses dari luar ke endpoint admin
- NIK adalah data sensitif dan dienkripsi untuk melindungi data pasien
- Admin/dokter harus menggunakan terminal khusus untuk mengakses sistem
