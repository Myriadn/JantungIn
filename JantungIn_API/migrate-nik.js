'use strict';

require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');
const crypto = require('crypto');

// Fungsi untuk menampilkan semua user dengan NIK terenkripsi mereka
const listAllUsers = async () => {
  const users = await User.findAll({ 
    attributes: ['id', 'name', 'email', 'nik_encrypted', 'role'],
    scope: 'withNIK',
    raw: true 
  });
  
  console.log('\n--- DAFTAR USER ---');
  console.table(users);
  
  return users;
};

// Fungsi untuk coba dekripsi NIK dari semua user
const attemptDecryptAllNIKs = async () => {
  const users = await User.findAll({ scope: 'withNIK' });
  
  console.log('\n--- PERCOBAAN DEKRIPSI NIK ---');
  let successCount = 0;
  let failCount = 0;
  
  for (const user of users) {
    try {
      const decryptedNIK = user.getNIK();
      console.log(`User ID: ${user.id}, NIK: ${decryptedNIK || 'GAGAL DEKRIPSI'}`);
      
      if (decryptedNIK) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`Error decrypting NIK for user ${user.id}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\nHasil dekripsi: ${successCount} sukses, ${failCount} gagal`);
  
  return { successCount, failCount };
};

// Fungsi untuk migrasi NIK (re-enkripsi)
const migrateNIKs = async () => {
  // Buat backup terlebih dahulu
  const users = await User.findAll({ scope: 'withNIK' });
  const backup = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    nik_encrypted: user.nik_encrypted
  }));
  
  console.log(`\n--- MIGRASI NIK (TOTAL ${users.length} USER) ---`);
  console.log('Backup data user dibuat.');
  
  // Cek apakah semua user memiliki NIK yang valid untuk migrasi
  const invalidUsers = [];
  
  // Lakukan migrasi (re-enkripsi)
  let successCount = 0;
  let failCount = 0;
  
  for (const user of users) {
    try {
      // Ambil NIK original (jika bisa didekripsi)
      const originalNIK = user.getNIK();
      
      if (!originalNIK) {
        console.log(`\nUser ID: ${user.id} tidak memiliki NIK yang valid, tidak dapat dimigrasi.`);
        invalidUsers.push(user.id);
        failCount++;
        continue;
      }
      
      // Re-enkripsi NIK dengan fungsi yang sudah diperbaiki
      const newEncryptedNIK = User.encryptNIK(originalNIK);
      
      // Update user dengan NIK terenkripsi baru
      await user.update({ nik_encrypted: newEncryptedNIK });
      
      // Verifikasi NIK baru
      const updatedUser = await User.findByPk(user.id, { scope: 'withNIK' });
      const decryptedNIK = updatedUser.getNIK();
      
      if (decryptedNIK === originalNIK) {
        console.log(`\nUser ID: ${user.id} berhasil dimigrasi.`);
        console.log(`NIK original: ${originalNIK}`);
        console.log(`NIK terenkripsi baru: ${newEncryptedNIK}`);
        console.log(`Verifikasi dekripsi: ${decryptedNIK}`);
        successCount++;
      } else {
        console.error(`\nMigrasi user ID: ${user.id} gagal verifikasi.`);
        console.error(`NIK original: ${originalNIK}, NIK dekripsi baru: ${decryptedNIK}`);
        // Kembalikan ke enkripsi lama
        await user.update({ nik_encrypted: user.nik_encrypted });
        failCount++;
      }
    } catch (error) {
      console.error(`\nError migrasi user ID: ${user.id}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\nHasil migrasi: ${successCount} sukses, ${failCount} gagal`);
  
  if (invalidUsers.length > 0) {
    console.log(`\nDaftar user yang tidak dapat dimigrasi: ${invalidUsers.join(', ')}`);
  }
  
  return { successCount, failCount, invalidUsers };
};

// Fungsi utama
const main = async () => {
  try {
    // Koneksi database
    await sequelize.authenticate();
    console.log('Koneksi database berhasil dibuat.');
    
    // Tampilkan daftar user
    await listAllUsers();
    
    // Coba dekripsi semua NIK (sebelum migrasi)
    console.log('\n=== STATUS NIK SEBELUM MIGRASI ===');
    const beforeMigration = await attemptDecryptAllNIKs();
    
    // Migrasi NIK jika diminta
    if (process.argv.includes('--migrate')) {
      await migrateNIKs();
      
      // Cek hasil migrasi
      console.log('\n=== STATUS NIK SETELAH MIGRASI ===');
      const afterMigration = await attemptDecryptAllNIKs();
      
      console.log('\n=== RINGKASAN MIGRASI ===');
      console.log(`Sebelum: ${beforeMigration.successCount} sukses, ${beforeMigration.failCount} gagal`);
      console.log(`Setelah: ${afterMigration.successCount} sukses, ${afterMigration.failCount} gagal`);
    }
    
    console.log('\nProses selesai.');
  } catch (error) {
    console.error('Error:', error);
    console.error(error.stack);
  } finally {
    // Tutup koneksi database
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Jalankan fungsi utama
main();
