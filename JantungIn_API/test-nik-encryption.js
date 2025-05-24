'use strict';

require('dotenv').config();
const { sequelize } = require('./src/config/database');
const { User } = require('./src/models');
const crypto = require('crypto');

// Fungsi untuk test enkripsi/dekripsi
const testEncryptionDecryption = (nik) => {
  console.log('------- TEST ENKRIPSI/DEKRIPSI -------');
  console.log(`Original NIK: ${nik}`);

  // Cek kunci enkripsi
  let keyStr = process.env.ENCRYPTION_KEY || 'fallback_encryption_key_for_development';
  if (keyStr.length < 32) {
    keyStr = keyStr.padEnd(32, '0');
  } else if (keyStr.length > 32) {
    keyStr = keyStr.substring(0, 32);
  }
  
  console.log(`Encryption key (first 5 chars): ${keyStr.substring(0, 5)}... (length: ${keyStr.length})`);

  try {
    // Tes enkripsi
    const encrypted = User.encryptNIK(nik);
    console.log(`Encrypted: ${encrypted}`);
    
    // Tes dekripsi
    const decrypted = User.decryptNIK(encrypted);
    console.log(`Decrypted: ${decrypted}`);
    
    // Cek hasil
    console.log(`Decryption successful: ${nik === decrypted}`);
    
    return { encrypted, decrypted, success: nik === decrypted };
  } catch (error) {
    console.error('Encryption/decryption error:', error);
    return { error: error.message };
  }
};

// Fungsi utama
const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Tes enkripsi/dekripsi dengan NIK dummy
    const testNIK = '1234567890123456';
    const encryptionTest = testEncryptionDecryption(testNIK);
    
    if (!encryptionTest.success) {
      console.error('Encryption/decryption test failed. Fix this before proceeding.');
      process.exit(1);
    }
    
    // Hapus semua user untuk testing
    if (process.argv.includes('--reset')) {
      console.log('Resetting users table...');
      await User.destroy({ where: {}, force: true });
      console.log('Users table has been reset.');
    }
      // Buat user test baru
    if (process.argv.includes('--create-test-user')) {
      console.log('Creating test user...');
      
      const testUserNIK = '3507261401980001';
      const testUserData = {
        name: 'Test User Updated',
        email: `test-${Date.now()}@example.com`, // Use a unique email
        nik_encrypted: User.encryptNIK(testUserNIK),
        password: '$2b$10$3QxGMf.3JNBCwrANEh4OWuNTXwD1Vj0m1u2JZ/9n2n2v2L8VsU2Oe', // password123 (pre-hashed)
        role: 'user',
      };
      
      const testUser = await User.create(testUserData);
      console.log(`Test user created with ID: ${testUser.id}`);
      console.log(`NIK: ${testUserNIK}`);
      console.log(`Email: ${testUserData.email}`);
      console.log(`Password: password123`);
      
      // Verifikasi NIK tersimpan dengan benar
      const storedUser = await User.findByPk(testUser.id, { scope: 'withNIK' });
      console.log(`Stored encrypted NIK: ${storedUser.nik_encrypted}`);
      const decryptedNIK = storedUser.getNIK();
      console.log(`Decrypted NIK: ${decryptedNIK}`);
      console.log(`NIK verification successful: ${testUserNIK === decryptedNIK}`);
    }
    
    // Tampilkan semua user
    console.log('Fetching all users...');
    const users = await User.findAll({ 
      attributes: ['id', 'name', 'email', 'role'],
      raw: true 
    });
    console.table(users);
    
    // Tampilkan semua NIK terenkripsi
    console.log('Fetching all encrypted NIKs...');
    const usersWithNIK = await User.findAll({ 
      scope: 'withNIK',
      attributes: ['id', 'nik_encrypted'],
      raw: true 
    });
    
    for (const user of usersWithNIK) {
      console.log(`User ID: ${user.id}, Encrypted NIK: ${user.nik_encrypted}`);
      try {
        const decryptedNIK = User.decryptNIK(user.nik_encrypted);
        console.log(`Decrypted NIK: ${decryptedNIK}`);
      } catch (error) {
        console.error(`Failed to decrypt NIK for user ${user.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

main();
