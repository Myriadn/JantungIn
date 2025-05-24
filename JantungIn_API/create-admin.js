'use strict';

// This script is used to create an admin/doctor user
const { User } = require('./src/models');
const { sequelize } = require('./src/config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Fungsi untuk enkripsi NIK
const encryptNIK = (nik) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(
    process.env.ENCRYPTION_KEY || 'fallback_encryption_key_for_development',
    'utf-8'
  );
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(nik, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Create admin user
    const adminData = {
      name: 'Admin Dokter',
      email: 'admin@jantungin.com',
      nik_encrypted: encryptNIK('9876543210123456'), // Ganti dengan NIK dokter
      password: await bcrypt.hash('admin123', 10), // Ganti dengan password yang kuat
      role: 'admin',
      dateOfBirth: new Date('1980-01-01'),
    };

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Buat admin
    const admin = await User.create(adminData);
    console.log('Admin user created successfully!');
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
