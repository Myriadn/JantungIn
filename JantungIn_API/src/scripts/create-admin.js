'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { initializeDatabase } = require('../models');

// Fungsi untuk menambahkan admin baru secara langsung
const createAdmin = async () => {
  try {
    await initializeDatabase();
    console.log('Database connected');

    // Data admin baru
    const adminData = {
      name: 'Admin JantungIn',
      email: 'admin@jantungin.com',
      password: 'admin123',
      role: 'admin',
      nik: '1234567890123456',
      dateOfBirth: '1990-01-01',
    }; // Cek apakah email sudah terdaftar
    const existingAdmin = await User.findOne({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('Admin dengan email ini sudah ada, mengupdate password...');

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 10);

      // Update password dengan raw query untuk memastikan
      await User.sequelize.query(`UPDATE "Users" SET "password" = ? WHERE "id" = ?`, {
        replacements: [hashedPassword, existingAdmin.id],
        type: User.sequelize.QueryTypes.UPDATE,
      });

      console.log('Password admin berhasil diupdate.');
      console.log(`Admin ID: ${existingAdmin.id}`);
      console.log('Email: admin@jantungin.com');
      console.log('Password: admin123');

      // Verifikasi bahwa password telah diupdate
      const updatedAdmin = await User.scope('withCredentials').findByPk(existingAdmin.id);
      console.log(`Password field exists: ${updatedAdmin.password ? 'Yes' : 'No'}`);
      console.log(
        `Password hash length: ${updatedAdmin.password ? updatedAdmin.password.length : 0}`
      );

      process.exit(0);
    }

    // Enkripsi NIK
    const nik_encrypted = User.encryptNIK(adminData.nik);
    // Hash password manual untuk memastikan
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    console.log(`Generated password hash length: ${hashedPassword.length}`);

    // Buat admin baru dengan raw query untuk memastikan
    const [adminId] = await User.sequelize.query(
      `INSERT INTO "Users" ("id", "name", "email", "password", "role", "nik_encrypted", "dateOfBirth", "createdAt", "updatedAt") 
       VALUES (uuid_generate_v4(), ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING "id"`,
      {
        replacements: [
          adminData.name,
          adminData.email,
          hashedPassword,
          adminData.role,
          nik_encrypted,
          adminData.dateOfBirth,
        ],
        type: User.sequelize.QueryTypes.INSERT,
      }
    );

    // Mengambil admin yang baru dibuat untuk konfirmasi
    const newAdminId = adminId[0].id;
    const admin = await User.scope('withCredentials').findByPk(newAdminId);

    console.log('Admin berhasil dibuat:');
    console.log(`ID: ${admin.id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Password hash exists: ${admin.password ? 'Yes' : 'No'}`);
    console.log(`Password hash length: ${admin.password ? admin.password.length : 0}`);
    console.log('Password (plaintext): admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
