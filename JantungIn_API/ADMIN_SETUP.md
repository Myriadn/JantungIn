# Inisialisasi Akun Admin JantungIn API

Dokumen ini menjelaskan cara membuat akun admin pertama untuk JantungIn API.

## Metode 1: Inisialisasi Otomatis

Saat aplikasi pertama kali dijalankan, sistem secara otomatis akan memeriksa apakah sudah ada akun admin. Jika belum ada, sistem akan membuat akun admin default dengan informasi berikut:

- Email: `admin@jantungin.com`
- Password: `admin123`
- Role: `admin`

**Penting:** Segera ubah password default ini setelah login pertama kali demi keamanan sistem.

## Metode 2: Endpoint Setup

Jika ingin membuat akun admin secara manual, Anda dapat menggunakan endpoint setup berikut yang hanya dapat diakses dari localhost:

```
POST /api/setup/admin
```

**Request Body:**

```json
{
  "name": "Admin JantungIn",
  "email": "admin@jantungin.com",
  "password": "admin123",
  "nik": "1234567890123456"
}
```

**Contoh menggunakan curl:**

```bash
curl -X POST http://localhost:3000/api/setup/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin JantungIn",
    "email": "admin@jantungin.com",
    "password": "admin123",
    "nik": "1234567890123456"
  }'
```

**Contoh menggunakan Postman:**

1. Buat request POST baru ke `http://localhost:3000/api/setup/admin`
2. Di tab Body, pilih raw dan JSON
3. Masukkan body request seperti di atas
4. Kirim request

**Catatan:** Endpoint ini hanya dapat diakses dari localhost dan hanya akan berfungsi jika belum ada akun admin yang terdaftar.

## Pengujian dengan Postman

Setelah akun admin dibuat, Anda dapat melakukan login dan mendapatkan token admin dengan cara berikut:

1. Gunakan endpoint `POST /api/admin/login` dengan body:

```json
{
  "username": "admin@jantungin.com",
  "password": "admin123"
}
```

2. Respons akan berisi token JWT yang dapat digunakan untuk otentikasi semua endpoint admin

3. Tambahkan token tersebut ke environment Postman dengan nama `admin_token`

4. Untuk semua request ke endpoint admin, gunakan Authorization type "Bearer Token" dan masukkan `{{admin_token}}`

## Keamanan

- Segera ubah password admin default setelah login pertama
- Semua endpoint admin dilindungi dengan JWT dan hanya dapat diakses oleh pengguna dengan role admin
- Beberapa endpoint admin hanya dapat diakses dari localhost untuk keamanan tambahan
