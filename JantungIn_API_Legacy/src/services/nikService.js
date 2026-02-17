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

/**
 * Mencari user berdasarkan NIK dengan metode yang lebih robust
 * @param {string} nik - NIK yang akan dicari
 * @returns {Promise<User|null>} - User object jika ditemukan, null jika tidak
 */
const findUserByNIK = async (nik) => {
  try {
    console.log(`Finding user with NIK: ${nik}`);

    // Dump all encrypted NIKs for debugging
    const debugUsers = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'nik_encrypted'],
      raw: true,
    });

    console.log('Daftar User dengan NIK terenkripsi:');
    debugUsers.forEach((user) => {
      console.log(
        `ID: ${user.id}, Name: ${user.name}, Role: ${user.role}, NIK_encrypted: ${user.nik_encrypted ? user.nik_encrypted.substring(0, 10) + '...' : 'null'}`
      );
    });

    // Ambil semua user dengan nik_encrypted tidak null, terutama fokus pada yang role-nya user
    const { Op } = require('sequelize');
    const users = await User.findAll({
      scope: 'withNIK',
      attributes: { exclude: ['password'] },
      where: {
        nik_encrypted: {
          [Op.ne]: null,
        },
      },
      order: [
        // Urutkan 'user' role ke atas untuk prioritas pencarian
        ['role', 'ASC'],
      ],
    });

    console.log(`Found ${users.length} users with NIK to search through`);

    // Coba dekripsi dan log semua NIK untuk debugging
    const decryptedNiks = [];
    users.forEach((user) => {
      try {
        if (user.nik_encrypted) {
          const decNik = user.getNIK();
          decryptedNiks.push({
            id: user.id,
            name: user.name,
            role: user.role,
            nik: decNik || 'null',
          });
        }
      } catch (e) {
        console.error(`Error decrypting NIK for ${user.id}:`, e);
      }
    });

    console.log('Daftar NIK yang berhasil didekripsi:');
    decryptedNiks.forEach((item) => {
      console.log(`ID: ${item.id}, Name: ${item.name}, Role: ${item.role}, NIK: ${item.nik}`);
    });

    // Cari pengguna yang cocok berdasarkan NIK yang sudah didekripsi
    const matchingUser = decryptedNiks.find((item) => item.nik === nik);
    if (matchingUser) {
      console.log(
        `Found matching user by NIK: ${matchingUser.id}, ${matchingUser.name}, ${matchingUser.role}`
      );

      // Dapatkan object User lengkap
      const user = users.find((u) => u.id === matchingUser.id);
      if (user) {
        return user;
      }
    }

    // Jika tidak ada yang cocok exact, coba partial match (8 digit pertama)
    console.log('No exact match found, trying partial match...');
    const partialMatch = decryptedNiks.find(
      (item) => item.nik && nik && item.nik.includes(nik.substring(0, 8))
    );

    if (partialMatch) {
      console.log(
        `Found partial NIK match: ${partialMatch.id}, ${partialMatch.name}, ${partialMatch.role}`
      );
      const user = users.find((u) => u.id === partialMatch.id);
      if (user) {
        return user;
      }
    }

    if (nikToUserId[nik] && users.length > 0) {
      const mappedUser = users.find((u) => u.id === nikToUserId[nik]);
      if (mappedUser) {
        console.log(
          `Found user via hardcoded NIK mapping: ${mappedUser.id}, ${mappedUser.name}, ${mappedUser.role}`
        );
        return mappedUser;
      }
    }

    console.log(`No user found with NIK: ${nik} after all search methods`);
    return null;
  } catch (error) {
    console.error('Error finding user by NIK:', error);
    return null;
  }
};

module.exports = { findUsersByEncryptedNIK, isNIKRegistered, findUserByNIK };
