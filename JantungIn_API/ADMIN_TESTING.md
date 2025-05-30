# Pengujian API Admin JantungIn

Dokumen ini berisi panduan untuk melakukan pengujian semua endpoint admin JantungIn API menggunakan Postman.

## Persiapan

### 1. Menjalankan Server

```bash
cd JantungIn_API
npm install
npm start
```

### 2. Inisialisasi Akun Admin

Ketika server pertama kali dijalankan, akun admin default akan otomatis dibuat:

- Email: `admin@jantungin.com`
- Password: `admin123`

Jika ingin membuat akun admin secara manual, gunakan endpoint setup:

```
POST http://localhost:3000/api/setup/admin
```

Body:

```json
{
  "name": "Admin JantungIn",
  "email": "admin@jantungin.com",
  "password": "admin123",
  "nik": "1234567890123456"
}
```

### 3. Import Postman Collection

1. Buka Postman
2. Import file koleksi dari folder `postman`:
   - `JantungIn API.postman_collection.json`
   - `JantungIn Variabel.postman_environment.json`

## Pengujian Endpoint Admin

### 1. Login Admin

**Endpoint:** `POST /api/admin/login`

**Request Body:**

```json
{
  "username": "admin@jantungin.com",
  "password": "admin123"
}
```

**Langkah Pengujian:**

1. Buat request POST baru ke `{{base_url}}/api/admin/login`
2. Masukkan body request dengan format JSON seperti di atas
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi token
5. Simpan token dengan menambahkan skrip di tab Tests:

```javascript
var jsonData = pm.response.json();
if (jsonData.data && jsonData.data.token) {
  pm.environment.set('admin_token', jsonData.data.token);
}
```

### 2. Mendapatkan Semua Pasien

**Endpoint:** `GET /api/admin/patients`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/patients`
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi array data pasien

### 3. Mendapatkan Data Pasien Berdasarkan ID

**Endpoint:** `GET /api/admin/patients/{id}`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/patients/{{patient_id}}`
   - Anda perlu menambahkan variabel `patient_id` ke environment atau menggantinya dengan ID pasien yang valid
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi data pasien

### 4. Mencari Pasien Berdasarkan NIK

**Endpoint:** `POST /api/admin/patients/find`

**Request Body:**

```json
{
  "nik": "1234567890123456"
}
```

**Langkah Pengujian:**

1. Buat request POST baru ke `{{base_url}}/api/admin/patients/find`
2. Masukkan body request dengan format JSON seperti di atas
3. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
4. Kirim request
5. Periksa response:
   - Status code harus 200
   - Response harus berisi data pasien

### 5. Mendapatkan Semua Admin/Dokter

**Endpoint:** `GET /api/admin/admins`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/admins`
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi array data admin/dokter

### 6. Membuat Admin/Dokter Baru

**Endpoint:** `POST /api/admin/admins`

**Request Body:**

```json
{
  "name": "Dokter Baru",
  "email": "dokter.baru@jantungin.com",
  "password": "dokter123",
  "role": "dokter",
  "nik": "1234567890123456",
  "dateOfBirth": "1990-01-01"
}
```

**Langkah Pengujian:**

1. Buat request POST baru ke `{{base_url}}/api/admin/admins`
2. Masukkan body request dengan format JSON seperti di atas
3. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
4. Kirim request
5. Periksa response:
   - Status code harus 201
   - Response harus berisi data admin/dokter yang baru dibuat

### 7. Mengubah Data User

**Endpoint:** `PUT /api/admin/users/{id}`

**Request Body:**

```json
{
  "name": "Nama Baru",
  "email": "email.baru@jantungin.com",
  "role": "dokter",
  "dateOfBirth": "1991-02-02"
}
```

**Langkah Pengujian:**

1. Buat request PUT baru ke `{{base_url}}/api/admin/users/{{user_id}}`
   - Anda perlu menambahkan variabel `user_id` ke environment atau menggantinya dengan ID user yang valid
2. Masukkan body request dengan format JSON seperti di atas
3. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
4. Kirim request
5. Periksa response:
   - Status code harus 200
   - Response harus berisi data user yang telah diperbarui

### 8. Menghapus User

**Endpoint:** `DELETE /api/admin/users/{id}`

**Langkah Pengujian:**

1. Buat request DELETE baru ke `{{base_url}}/api/admin/users/{{user_id}}`
   - Anda perlu menambahkan variabel `user_id` ke environment atau menggantinya dengan ID user yang valid
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi pesan sukses

### 9. Reset Password User

**Endpoint:** `POST /api/admin/users/{id}/reset-password`

**Request Body:**

```json
{
  "newPassword": "password123"
}
```

**Langkah Pengujian:**

1. Buat request POST baru ke `{{base_url}}/api/admin/users/{{user_id}}/reset-password`
   - Anda perlu menambahkan variabel `user_id` ke environment atau menggantinya dengan ID user yang valid
2. Masukkan body request dengan format JSON seperti di atas
3. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
4. Kirim request
5. Periksa response:
   - Status code harus 200
   - Response harus berisi pesan sukses

### 10. Mendapatkan Statistik Diagnosa

**Endpoint:** `GET /api/admin/statistics/diagnosis`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/statistics/diagnosis`
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi data statistik diagnosa

### 11. Mendapatkan Data Dashboard Admin

**Endpoint:** `GET /api/admin/dashboard`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/dashboard`
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi data dashboard admin

### 12. Mendapatkan Profil Admin

**Endpoint:** `GET /api/admin/profile`

**Langkah Pengujian:**

1. Buat request GET baru ke `{{base_url}}/api/admin/profile`
2. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
3. Kirim request
4. Periksa response:
   - Status code harus 200
   - Response harus berisi data profil admin

### 13. Mengganti Password Admin

**Endpoint:** `POST /api/admin/change-password`

**Request Body:**

```json
{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**Langkah Pengujian:**

1. Buat request POST baru ke `{{base_url}}/api/admin/change-password`
2. Masukkan body request dengan format JSON seperti di atas
3. Di tab Authorization, pilih Type: Bearer Token dan masukkan token: `{{admin_token}}`
4. Kirim request
5. Periksa response:
   - Status code harus 200
   - Response harus berisi pesan sukses

## Otomatisasi Pengujian dengan Collection Runner

Anda dapat mengatur urutan pengujian dan menjalankannya secara otomatis dengan Postman Collection Runner:

1. Klik tombol "Runner" di pojok kiri atas Postman
2. Pilih koleksi JantungIn API
3. Atur urutan pengujian, mulai dari Login Admin
4. Pastikan environment sudah dipilih
5. Klik "Start Run" untuk menjalankan semua pengujian secara berurutan
