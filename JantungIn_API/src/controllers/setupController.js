'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');

// Fungsi untuk memeriksa admin yang sudah ada
const checkAdminAccount = async (request, h) => {
  try {
    // Cari semua user dengan role admin
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    if (admins.length === 0) {
      return h.response({
        statusCode: 404,
        message: 'No admin accounts found',
        data: [],
      });
    }

    return h.response({
      statusCode: 200,
      message: 'Admin accounts found',
      data: admins,
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return Boom.badImplementation('Error checking admin accounts');
  }
};

// Fungsi untuk membuat admin pertama
const setupAdmin = async (request, h) => {
  try {
    // Cek apakah sudah ada user dengan role admin
    const existingAdmin = await User.findOne({
      where: { role: 'admin' },
    });

    if (existingAdmin) {
      return Boom.conflict('Admin account already exists');
    }

    const { name, email, password, nik } = request.payload;

    // Validasi input
    if (!name || !email || !password || !nik) {
      return Boom.badRequest('Name, email, password, and NIK are required');
    }

    if (nik.length !== 16 || !/^\d+$/.test(nik)) {
      return Boom.badRequest('NIK must be 16 digits');
    }

    // Enkripsi NIK
    const nik_encrypted = User.encryptNIK(nik);

    // Buat admin baru
    const admin = await User.create({
      name,
      email,
      password, // Password akan di-hash secara otomatis melalui hook
      role: 'admin',
      nik_encrypted,
    });

    return h
      .response({
        statusCode: 201,
        message: 'Initial admin account created successfully',
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      })
      .code(201);
  } catch (error) {
    console.error('Setup admin error:', error);
    return Boom.badImplementation('Error setting up admin account');
  }
};

module.exports = {
  setupAdmin,
  checkAdminAccount,
};
