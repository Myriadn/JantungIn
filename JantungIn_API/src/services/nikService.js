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
      raw: true
    });
    
    console.log('--- DAFTAR NIK TERENKRIPSI ---');
    users.forEach(user => {
      console.log(`User ID: ${user.id}, NIK encrypted: ${user.nik_encrypted}`);
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching encrypted NIKs:', error);
    return [];
  }
};

module.exports = { findUsersByEncryptedNIK };
