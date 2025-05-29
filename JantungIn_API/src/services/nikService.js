'use strict';

const { Op } = require('sequelize');
const { User } = require('../models');

/**
 * Pencarian user berdasarkan NIK terenkripsi dari database
 * Fungsi ini untuk troubleshooting masalah enkripsi/dekripsi NIK
 */
const findUsersByEncryptedNIK = async () => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'nik_encrypted'],
      raw: true,
    });

    console.log('--- DAFTAR NIK TERENKRIPSI ---');
    users.forEach((user) => {
      console.log(`User ID: ${user.id}, NIK encrypted: ${user.nik_encrypted}`);
    });

    return users;
  } catch (error) {
    console.error('Error fetching encrypted NIKs:', error);
    return [];
  }
};

/**
 * Memeriksa apakah NIK sudah terdaftar dalam database
 * @param {string} nik - NIK yang akan dicek
 * @returns {Promise<boolean>} - true jika NIK sudah terdaftar, false jika belum
 */
const isNIKRegistered = async (nik) => {
  try {
    console.log(`Checking if NIK is already registered: ${nik}`);

    // Ambil semua user dengan NIK terenkripsi dan pastikan akses ke nik_encrypted
    const users = await User.findAll({
      scope: 'withCredentials',
      attributes: { include: ['nik_encrypted'] },
    });

    console.log(`Found ${users.length} users to check NIK against`);

    // Periksa apakah ada user dengan NIK yang sama
    for (const user of users) {
      try {
        const decryptedNIK = user.getNIK();
        console.log(`Comparing with user ID: ${user.id}, Decrypted NIK: ${decryptedNIK}`);

        if (decryptedNIK === nik) {
          console.log(`NIK ${nik} is already registered by user ID: ${user.id}`);
          return true;
        }
      } catch (decryptError) {
        console.error(`Error decrypting NIK for user ${user.id}:`, decryptError);
        // Lanjutkan pengecekan ke user berikutnya
        continue;
      }
    }

    console.log(`NIK ${nik} is not registered yet`);
    return false;
  } catch (error) {
    console.error('Error checking NIK registration:', error);
    throw error;
  }
};

module.exports = { findUsersByEncryptedNIK, isNIKRegistered };
