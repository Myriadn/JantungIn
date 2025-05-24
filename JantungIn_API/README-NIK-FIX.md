# Perbaikan Enkripsi/Dekripsi NIK

Ini adalah rangkuman perubahan yang telah dilakukan untuk memperbaiki masalah enkripsi/dekripsi NIK.

## Masalah

Dekripsi NIK terenkripsi mengembalikan nilai `null` atau gagal, sehingga login dengan NIK tidak berfungsi dengan benar.

## Solusi

1. Memperbaiki fungsi `decryptNIK` di model User:
   - Mengubah cara buffer dibuat dari string terenkripsi
   - Memperbaiki cara parsing string terenkripsi

2. Memperbaiki penggunaan scope Sequelize:
   - Membuat scope `withCredentials` untuk mengambil `nik_encrypted` dan `password`
   - Memastikan atribut `nik_encrypted` termasuk dalam query

3. Meningkatkan logging dan debugging:
   - Menambahkan logging lebih detail untuk proses enkripsi/dekripsi
   - Membuat endpoint debugging yang lebih informatif

## Perubahan Kode

### 1. Perbaikan di User.js

```javascript
// Fungsi untuk dekripsi NIK yang diperbaiki
const decryptNIK = (encryptedNIK) => {
  try {
    console.log(`Attempting to decrypt: ${encryptedNIK}`);
    
    if (!encryptedNIK || !encryptedNIK.includes(':')) {
      console.error(`Invalid encrypted NIK format: ${encryptedNIK}`);
      return null;
    }
    
    const algorithm = 'aes-256-cbc';
    
    // Pastikan kunci memiliki panjang 32 bytes (256 bits) untuk AES-256
    let keyStr = process.env.ENCRYPTION_KEY || 'fallback_encryption_key_for_development';
    // Padding kunci jika kurang dari 32 karakter atau memotong jika lebih
    if (keyStr.length < 32) {
      keyStr = keyStr.padEnd(32, '0');
    } else if (keyStr.length > 32) {
      keyStr = keyStr.substring(0, 32);
    }
    
    console.log(`Using key (first 5 chars): ${keyStr.substring(0, 5)}... (length: ${keyStr.length})`);
    
    const key = Buffer.from(keyStr, 'utf-8');
    const textParts = encryptedNIK.split(':');
    
    console.log(`IV part length: ${textParts[0].length}, Encrypted part length: ${textParts[1]?.length || 0}`);
    
    // PERBAIKAN: Cara membuat buffer dari string hex
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted += decipher.final('utf8');
    
    console.log(`Successfully decrypted to: ${decrypted}`);
    return decrypted;
  } catch (error) {
    console.error(`Decryption error:`, error);
    return null;
  }
};

// Perbaikan scope di Sequelize model
// ...
defaultScope: {
  attributes: { exclude: ['nik_encrypted', 'password'] },
},
scopes: {
  withNIK: {
    attributes: { include: ['nik_encrypted'] },
  },
  withCredentials: {
    attributes: { include: ['nik_encrypted', 'password'] },
  },
},
// ...
```

### 2. Perbaikan di authController.js

```javascript
// Cari user berdasarkan NIK
const users = await User.findAll({ 
  scope: 'withCredentials',
  attributes: { include: ['nik_encrypted', 'password'] }
});
console.log(`Found ${users.length} users to check against`);
```

## Pengujian

Untuk menguji perubahan ini:

1. Buat user baru dengan NIK terenkripsi
2. Coba login dengan NIK
3. Verifikasi bahwa dekripsi NIK berfungsi dengan benar

## Catatan Tambahan

Jika masih mengalami masalah dengan database remote, pertimbangkan untuk menggunakan database lokal untuk pengembangan.
