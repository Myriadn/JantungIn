'use strict';

const Boom = require('@hapi/boom');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

// Fungsi login khusus untuk admin/dokter
const adminLogin = async (request, h) => {
  try {
    const { username, password } = request.payload;

    // Cari user berdasarkan email sebagai username
    const admin = await User.findOne({
      where: {
        email: username,
        role: ['admin', 'dokter'], // Hanya user dengan role admin atau dokter
      },
    });

    if (!admin) {
      return Boom.unauthorized('Username atau password tidak valid');
    }

    // Verifikasi password
    const isValid = await admin.verifyPassword(password);
    if (!isValid) {
      return Boom.unauthorized('Username atau password tidak valid');
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return h.response({
      statusCode: 200,
      message: 'Login berhasil',
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return Boom.badImplementation('Error during login');
  }
};

// Fungsi untuk mendapatkan data semua pasien (user)
const getAllPatients = async (request, h) => {
  try {
    const patients = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
    });

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil diambil',
      data: patients,
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return Boom.badImplementation('Error mengambil data pasien');
  }
};

// Fungsi untuk mendapatkan data satu pasien berdasarkan id
const getPatientById = async (request, h) => {
  try {
    const { id } = request.params;

    const patient = await User.findOne({
      where: {
        id,
        role: 'user',
      },
      attributes: { exclude: ['password'] },
    });

    if (!patient) {
      return Boom.notFound('Pasien tidak ditemukan');
    }

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil diambil',
      data: patient,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return Boom.badImplementation('Error mengambil data pasien');
  }
};

// Fungsi untuk mencari pasien berdasarkan NIK
const findPatientByNik = async (request, h) => {
  try {
    const { nik } = request.payload;

    // Validasi NIK
    if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
      return Boom.badRequest('NIK harus 16 digit angka');
    }

    // Cari semua user dengan scope untuk akses nik_encrypted
    const users = await User.findAll({
      where: { role: 'user' },
      scope: 'withNIK',
      attributes: { exclude: ['password'] },
    });

    // Cari user dengan NIK yang cocok
    let patient = null;
    for (const user of users) {
      if (user.getNIK() === nik) {
        patient = user;
        break;
      }
    }

    if (!patient) {
      return Boom.notFound('Pasien dengan NIK tersebut tidak ditemukan');
    }

    return h.response({
      statusCode: 200,
      message: 'Data pasien berhasil ditemukan',
      data: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        dateOfBirth: patient.dateOfBirth,
      },
    });
  } catch (error) {
    console.error('Find patient error:', error);
    return Boom.badImplementation('Error mencari data pasien');
  }
};

module.exports = {
  adminLogin,
  getAllPatients,
  getPatientById,
  findPatientByNik,
};
