'use strict';

const { User } = require('../models');
const { encryptNIK } = require('../models/User');

// Data admin default yang akan dibuat saat aplikasi pertama kali dijalankan
const defaultAdmin = {
  name: 'Admin JantungIn',
  email: 'admin@jantungin.com',
  password: 'admin123',
  role: 'admin',
  nik: '1234567890123456',
  dateOfBirth: '1990-01-01',
};

// Fungsi untuk membuat admin pertama jika belum ada
const createInitialAdmin = async () => {
  try {
    console.log('Checking for existing admin...');

    // Cek apakah sudah ada user dengan role admin
    const existingAdmin = await User.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin account already exists, skipping initialization.');
      return;
    }

    console.log('No admin account found. Creating initial admin account...');
    // Buat admin baru
    const nik_encrypted = encryptNIK(defaultAdmin.nik);

    const adminUser = await User.create({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      password: defaultAdmin.password, // Password akan di-hash secara otomatis melalui hook
      role: defaultAdmin.role,
      nik_encrypted,
      dateOfBirth: defaultAdmin.dateOfBirth,
    });

    console.log('Initial admin account created successfully with details:');
    console.log(`ID: ${adminUser.id}`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('Email: admin@jantungin.com');
    console.log('Password: admin123');
    console.log('Please change this password after first login!');
  } catch (error) {
    console.error('Error creating initial admin account:', error);
  }
};

module.exports = {
  createInitialAdmin,
};
